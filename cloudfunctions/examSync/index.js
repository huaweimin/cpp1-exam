/**
 * examSync 云函数
 *
 * 本环境为 CloudBase PG 模式（PostgreSQL 17），无文档型数据库，
 * 因此使用 @cloudbase/node-sdk v3 的 app.rdb()（postgREST 客户端）读写 PG。
 * 云函数运行时自动以管理员身份鉴权（SYMBOL_CURRENT_ENV），无需密钥。
 *
 * 表：
 *   exam_results : 成绩记录（主键 id = studentName|examId|submittedAt）
 *   exam_users   : 用户账号（登录体系，username 主键，token 鉴权）
 *   exam_register_applications : 注册申请（申请制注册，管理员审核后手动开通账号）
 *
 * 建表 SQL（部署时在 CloudBase PG 控制台执行一次）：
 *   CREATE TABLE IF NOT EXISTS exam_register_applications (
 *     id            text PRIMARY KEY,
 *     username      text NOT NULL,
 *     contact       text NOT NULL,
 *     contact_norm  text,
 *     reason        text NOT NULL,
 *     status        text NOT NULL DEFAULT 'pending',
 *     created_at    timestamptz NOT NULL DEFAULT now(),
 *     reviewed_at   timestamptz
 *   );
 *   已部署旧库需追加 contact_norm 列（防刷用，联系方式归一化去重）：
 *     ALTER TABLE exam_register_applications ADD COLUMN IF NOT EXISTS contact_norm text;
 *     CREATE INDEX IF NOT EXISTS idx_apps_contact_norm ON exam_register_applications (contact_norm);
 *
 * event.action 支持：
 *   用户体系
 *   - applyRegister : 公开，提交注册申请（username/contact/reason），无需登录
 *   - listApplications    : [教师] 查询注册申请列表
 *   - reviewApplication   : [教师] 审核注册申请（approved/rejected）
 *   - register    : 注册（username/password/role/teacherKey），返回 token
 *     （前端已不再暴露注册入口，仅保留给管理员手动开通账号时使用）
 *   - login       : 登录，返回 token
 *   - logout      : 注销，清除 token
 *   - me          : 校验 token，返回当前用户
 *   成绩（全部需登录）
 *   - pull        : [教师] 查询全部记录
 *   - pullStudent : [教师] 按姓名查询任意学生记录
 *   - mine        : 查询当前登录用户自己的记录（学生记录页用）
 *   - names       : [教师] 去重学生姓名列表
 *   - push        : [教师] 批量 upsert
 *   - pushOne     : 单条 upsert（交卷用，归属强制为当前登录用户）
 *   - delete      : 删除单条（学生只能删自己的，教师可删任意）
 *   - test        : 公开，返回记录条数（连通性诊断）
 *
 * 无论成功与否，业务层都返回 { code, data, message }，前端根据 code 判定；
 * 经 HTTP 网关调用时包装为 { statusCode, headers(含CORS), body: JSON 字符串 }，
 * callFunction 直调则保持原业务对象。
 */

const crypto = require('crypto')
const cloud = require('@cloudbase/node-sdk')

const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV })
const db = app.rdb({ database: 'public' })

const TABLE = 'exam_results'
const USERS_TABLE = 'exam_users'
const APPS_TABLE = 'exam_register_applications'

/** 教师注册密钥：部署时通过 cloudbaserc.json envVariables 注入；未配置时用兜底值 */
const TEACHER_REGISTER_KEY = process.env.TEACHER_REGISTER_KEY || 'Tcb-Exam-2026-Teacher'

/** 登录 token 有效期：30 天 */
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

/** 把 postgREST 返回的 error 对象转成可读字符串 */
function pgError(e) {
  if (!e) return 'unknown error'
  if (typeof e === 'string') return e
  if (e instanceof Error) return `${e.name}: ${e.message}`
  const parts = []
  if (e.message) parts.push(String(e.message))
  if (e.code) parts.push(`code=${e.code}`)
  if (e.details) parts.push(`details=${e.details}`)
  if (e.hint) parts.push(`hint=${e.hint}`)
  if (parts.length > 0) return parts.join(', ')
  try {
    return JSON.stringify(e, Object.getOwnPropertyNames(e))
  } catch (_) {
    return String(e)
  }
}

/* ==================== 用户体系 ==================== */

function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(`${salt}:${password}`).digest('hex')
}

async function findUserByUsername(username) {
  const { data, error } = await db.from(USERS_TABLE).select('*').eq('username', String(username)).limit(1)
  if (error) throw new Error(pgError(error))
  return (data || [])[0] || null
}

/** token → 用户行；无效/过期返回 null */
async function authUser(token) {
  if (!token) return null
  const { data, error } = await db.from(USERS_TABLE).select('*').eq('token', String(token)).limit(1)
  if (error) throw new Error(pgError(error))
  const user = (data || [])[0]
  if (!user) return null
  if (!user.token_expires_at || new Date(user.token_expires_at).getTime() < Date.now()) return null
  return user
}

/** 强制登录：未登录/过期直接抛错 */
async function requireUser(token) {
  const user = await authUser(token)
  if (!user) throw new Error('请先登录')
  return user
}

async function handleRegister({ username, password, role, teacherKey }) {
  const name = String(username || '').trim()
  const pwd = String(password || '')
  const r = role === 'teacher' ? 'teacher' : 'student'
  if (!name) throw new Error('用户名不能为空')
  if (name.length > 20) throw new Error('用户名最长 20 个字符')
  if (pwd.length < 4) throw new Error('密码至少 4 位')
  if (r === 'teacher' && teacherKey !== TEACHER_REGISTER_KEY) {
    throw new Error('教师注册密钥不正确')
  }
  const exists = await findUserByUsername(name)
  if (exists) throw new Error('该用户名已被注册')
  const salt = crypto.randomBytes(16).toString('hex')
  const token = crypto.randomBytes(24).toString('hex')
  const row = {
    username: name,
    password_hash: hashPassword(pwd, salt),
    salt,
    role: r,
    token,
    token_expires_at: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
    created_at: new Date().toISOString(),
  }
  const { error: insErr } = await db.from(USERS_TABLE).insert(row)
  if (insErr) throw new Error(pgError(insErr))
  return { token, username: name, role: r }
}

async function handleLogin({ username, password }) {
  const name = String(username || '').trim()
  const pwd = String(password || '')
  const user = await findUserByUsername(name)
  if (!user) throw new Error('用户名或密码错误')
  if (user.password_hash !== hashPassword(pwd, user.salt)) throw new Error('用户名或密码错误')
  const token = crypto.randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString()
  const { error: upErr } = await db
    .from(USERS_TABLE)
    .update({ token, token_expires_at: expiresAt })
    .eq('username', user.username)
  if (upErr) throw new Error(pgError(upErr))
  return { token, username: user.username, role: user.role }
}

async function handleLogout(token) {
  if (!token) return { ok: false }
  const { error } = await db
    .from(USERS_TABLE)
    .update({ token: null, token_expires_at: null })
    .eq('token', String(token))
  if (error) throw new Error(pgError(error))
  return { ok: true }
}

async function handleMe(token) {
  const user = await requireUser(token)
  return { username: user.username, role: user.role }
}

/* ==================== 注册申请（申请制注册） ==================== */

/** PG 行 → 前端 RegisterApplication */
function rowToApplication(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    contact: row.contact,
    reason: row.reason,
    status: row.status || 'pending',
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at || null,
  }
}

/** 联系方式归一化：去空白、小写；纯数字（手机号）去掉国别前缀 +86 */
function normalizeContact(c) {
  let s = String(c || '').toLowerCase().replace(/\s+/g, '')
  if (/^\d+$/.test(s)) s = s.replace(/^(\+?86)/, '')
  return s
}

/** 提交注册申请（公开）。防刷：用户名去重 + 联系方式去重 + 10 分钟冷却窗口 */
async function handleApplyRegister({ username, contact, reason }) {
  const name = String(username || '').trim()
  const tel = String(contact || '').trim()
  const why = String(reason || '').trim()
  if (!name) throw new Error('用户名不能为空')
  if (name.length > 20) throw new Error('用户名最长 20 个字符')
  if (!tel) throw new Error('联系方式不能为空')
  if (tel.length > 50) throw new Error('联系方式最长 50 个字符')
  if (!why) throw new Error('申请理由不能为空')
  if (why.length > 200) throw new Error('申请理由最长 200 个字符')

  const exists = await findUserByUsername(name)
  if (exists) throw new Error('该用户名已被注册，如非本人操作请联系管理员')

  // 去重 1：同一用户名存在待审申请
  const { data: pendingByName, error: dupErr } = await db
    .from(APPS_TABLE)
    .select('id')
    .eq('username', name)
    .eq('status', 'pending')
    .limit(1)
  if (dupErr) throw new Error(pgError(dupErr))
  if ((pendingByName || []).length > 0) throw new Error('该用户名已提交过申请，请等待管理员审核')

  const norm = normalizeContact(tel)

  // 去重 2：同一联系方式存在待审申请（换用户名也绕不过）
  const { data: pendingByContact, error: cErr } = await db
    .from(APPS_TABLE)
    .select('id')
    .eq('contact_norm', norm)
    .eq('status', 'pending')
    .limit(1)
  if (cErr) throw new Error(pgError(cErr))
  if ((pendingByContact || []).length > 0) throw new Error('该联系方式已提交过申请，请等待管理员审核')

  // 冷却：取该联系方式最近一条申请，10 分钟内不允许再次提交
  const { data: latest, error: lErr } = await db
    .from(APPS_TABLE)
    .select('created_at')
    .eq('contact_norm', norm)
    .order('created_at', { ascending: false })
    .limit(1)
  if (lErr) throw new Error(pgError(lErr))
  const last = (latest || [])[0]
  if (last && Date.now() - new Date(last.created_at).getTime() < 10 * 60 * 1000) {
    throw new Error('提交过于频繁，请 10 分钟后再试')
  }

  const row = {
    id: `${name}|${new Date().toISOString()}`,
    username: name,
    contact: tel,
    contact_norm: norm,
    reason: why,
    status: 'pending',
    created_at: new Date().toISOString(),
  }
  const { error: insErr } = await db.from(APPS_TABLE).insert(row)
  if (insErr) throw new Error(pgError(insErr))
  return { submitted: true }
}

/** 查询注册申请列表（教师专用，按申请时间倒序，最多 200 条） */
async function handleListApplications() {
  const { data, error } = await db
    .from(APPS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(pgError(error))
  return (data || []).map(rowToApplication).filter(Boolean)
}

/** 审核注册申请（教师专用）：status 仅允许 approved / rejected */
async function handleReviewApplication({ id, status }) {
  const appId = String(id || '')
  const next = status === 'approved' || status === 'rejected' ? status : null
  if (!appId) throw new Error('缺少申请 ID')
  if (!next) throw new Error('审核状态不合法')
  const { error } = await db
    .from(APPS_TABLE)
    .update({ status: next, reviewed_at: new Date().toISOString() })
    .eq('id', appId)
  if (error) throw new Error(pgError(error))
  return { reviewed: true, status: next }
}

/* ==================== 成绩记录 ==================== */

/** ExamResult(前端 camelCase) → PG 行(snake_case)，并生成主键 id */
function recordToRow(record) {
  if (!record || typeof record !== 'object') return null
  const {
    studentName,
    examId,
    examName,
    totalScore,
    maxScore,
    passed,
    details,
    submittedAt,
    duration,
  } = record
  if (!studentName || !examId || !submittedAt) return null
  return {
    id: `${studentName}|${examId}|${submittedAt}`,
    student_name: String(studentName),
    exam_id: String(examId),
    exam_name: examName ? String(examName) : '',
    total_score: Number(totalScore) || 0,
    max_score: Number(maxScore) || 0,
    passed: Boolean(passed),
    details: Array.isArray(details) ? details : [],
    submitted_at: String(submittedAt),
    duration: Number(duration) || 0,
  }
}

/** PG 行 → 前端 ExamResult */
function rowToRecord(row) {
  if (!row) return null
  return {
    studentName: row.student_name,
    examId: row.exam_id,
    examName: row.exam_name || '',
    totalScore: Number(row.total_score) || 0,
    maxScore: Number(row.max_score) || 0,
    passed: Boolean(row.passed),
    details: Array.isArray(row.details) ? row.details : [],
    submittedAt: row.submitted_at,
    duration: Number(row.duration) || 0,
  }
}

/** 拉取全部记录（教师专用，按提交时间倒序，最多 1000 条） */
async function handlePull() {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(1000)
  if (error) throw new Error(pgError(error))
  return (data || []).map(rowToRecord).filter(Boolean)
}

/** 按学生姓名精确查询（教师专用） */
async function handlePullStudent(studentName) {
  if (!studentName) return []
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .eq('student_name', String(studentName))
    .order('submitted_at', { ascending: false })
    .limit(1000)
  if (error) throw new Error(pgError(error))
  return (data || []).map(rowToRecord).filter(Boolean)
}

/** 查询当前登录用户自己的记录（学生记录页用） */
async function handleMine(user) {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .eq('student_name', user.username)
    .order('submitted_at', { ascending: false })
    .limit(1000)
  if (error) throw new Error(pgError(error))
  return (data || []).map(rowToRecord).filter(Boolean)
}

/** 返回去重后的学生姓名列表（教师专用） */
async function handleNames() {
  const { data, error } = await db.from(TABLE).select('student_name').limit(2000)
  if (error) throw new Error(pgError(error))
  const names = new Set((data || []).map((r) => r.student_name).filter(Boolean))
  return Array.from(names).sort((a, b) => String(a).localeCompare(String(b), 'zh-CN'))
}

/** 批量 upsert（主键冲突即覆盖更新），分批防止单次请求过大 */
async function handlePush(records) {
  const list = Array.isArray(records) ? records : []
  const rows = list.map(recordToRow).filter(Boolean)
  if (rows.length === 0) return { upserted: 0 }

  const BATCH = 100
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH)
    const { error } = await db.from(TABLE).upsert(chunk, { onConflict: 'id' })
    if (error) throw new Error(pgError(error))
  }
  return { upserted: rows.length }
}

/** 单条 upsert（交卷用），归属强制为当前登录用户，防伪造他人姓名 */
async function handlePushOne(user, record) {
  const row = recordToRow({ ...record, studentName: user.username })
  if (!row) throw new Error('成绩数据不完整')
  const { error } = await db.from(TABLE).upsert([row], { onConflict: 'id' })
  if (error) throw new Error(pgError(error))
  return { upserted: 1 }
}

/** 按唯一键删除单条：学生只能删自己的，教师可删任意 */
async function handleDelete(user, target) {
  const row = recordToRow(target)
  if (!row) return { deleted: false }
  if (user.role !== 'teacher' && row.student_name !== user.username) {
    throw new Error('只能删除自己的记录')
  }
  const { error } = await db.from(TABLE).delete().eq('id', row.id)
  if (error) throw new Error(pgError(error))
  return { deleted: true }
}

/** 连通性测试：返回记录总条数（公开） */
async function handleTest() {
  // 注意：网关不支持 HEAD 请求（返回 406），这里用普通 select + exact count
  const { count, error } = await db
    .from(TABLE)
    .select('id', { count: 'exact' })
    .limit(1)
  if (error) throw new Error(pgError(error))
  return { count: Number(count) || 0 }
}

/**
 * 入参归一化：同时兼容两种调用方式
 *  1. callFunction 直调：event = { action, data }
 *  2. HTTP 访问服务路由：event = { body: '{"action":...}' (JSON 字符串),
 *     headers, httpMethod, path, queryStringParameters, isBase64Encoded }
 */
function normalizeEvent(event = {}) {
  if (event.action) return event
  if (typeof event.body === 'string' && event.body.length > 0) {
    try {
      const parsed = JSON.parse(event.body)
      if (parsed && typeof parsed === 'object') return parsed
    } catch (_) {
      /* body 不是合法 JSON，走兜底 */
    }
  }
  if (event.body && typeof event.body === 'object') return event.body
  return event
}

/**
 * 把业务对象包装成 HTTP 响应（含 CORS 头）。
 * 仅 HTTP 网关调用生效；callFunction 直调保持返回原业务对象。
 */
function httpResponse(payload, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(payload),
  }
}

exports.main = async (event = {}) => {
  // HTTP 网关调用：event 带 httpMethod（预检为 OPTIONS）
  const isHttp = !!(event && event.httpMethod)
  const input = normalizeEvent(event)
  const action = input && input.action
  const data = (input && input.data) || {}
  const token = data.token || (input && input.token) || ''

  // CORS 预检请求：直接返回 204 + 允许头，不执行业务逻辑
  if (isHttp && event.httpMethod === 'OPTIONS') {
    return httpResponse({ code: 0, data: null, message: 'ok' }, 204)
  }

  try {
    let result
    switch (action) {
      // ---- 用户体系（register/applyRegister/login/test 公开，其余需登录） ----
      case 'applyRegister':
        result = await handleApplyRegister(data)
        break
      case 'listApplications': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可查看注册申请')
        result = await handleListApplications()
        break
      }
      case 'reviewApplication': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可审核注册申请')
        result = await handleReviewApplication(data)
        break
      }
      case 'register':
        result = await handleRegister(data)
        break
      case 'login':
        result = await handleLogin(data)
        break
      case 'logout': {
        const u = await authUser(token)
        result = await handleLogout(token)
        break
      }
      case 'me': {
        const u = await requireUser(token)
        result = await handleMe(token)
        break
      }

      // ---- 成绩（全部需登录；学生只能操作自己的记录） ----
      case 'pull': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可查看全部成绩')
        result = await handlePull()
        break
      }
      case 'pullStudent': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可查询其他学生记录')
        result = await handlePullStudent(data.studentName)
        break
      }
      case 'mine': {
        const u = await requireUser(token)
        result = await handleMine(u)
        break
      }
      case 'names': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可查看学生名单')
        result = await handleNames()
        break
      }
      case 'push': {
        const u = await requireUser(token)
        if (u.role !== 'teacher') throw new Error('仅教师可批量导入成绩')
        result = await handlePush(data.records)
        break
      }
      case 'pushOne': {
        const u = await requireUser(token)
        result = await handlePushOne(u, data.record)
        break
      }
      case 'delete': {
        const u = await requireUser(token)
        result = await handleDelete(u, data.record)
        break
      }
      case 'test':
        result = await handleTest()
        break
      default: {
        const payload = {
          code: -1,
          data: {
            eventKeys: Object.keys(event || {}),
            bodyType: typeof (event && event.body),
            bodySample:
              typeof (event && event.body) === 'string'
                ? String(event.body).slice(0, 300)
                : JSON.stringify(event && event.body)?.slice(0, 300),
            rawSample: JSON.stringify(event)?.slice(0, 500),
          },
          message: `unknown action: ${action}`,
        }
        return isHttp ? httpResponse(payload) : payload
      }
    }
    return isHttp ? httpResponse({ code: 0, data: result, message: 'ok' }) : { code: 0, data: result, message: 'ok' }
  } catch (err) {
    let detail
    try {
      detail =
        err && err.message && typeof err.message === 'string' && err.message !== '[object Object]'
          ? err.message
          : JSON.stringify(err, Object.getOwnPropertyNames(err || {}))
    } catch (e) {
      detail = String(err)
    }
    console.error('[examSync] 处理失败:', action, detail, err && err.stack)
    return isHttp ? httpResponse({ code: 1, data: null, message: detail }) : { code: 1, data: null, message: detail }
  }
}
