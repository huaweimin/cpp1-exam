/**
 * examSync 云函数
 *
 * 本环境为 CloudBase PG 模式（PostgreSQL 17），无文档型数据库，
 * 因此使用 @cloudbase/node-sdk v3 的 app.rdb()（postgREST 客户端）读写 PG。
 * 云函数运行时自动以管理员身份鉴权（SYMBOL_CURRENT_ENV），无需密钥。
 *
 * 表：exam_results（schema 与环境 ID 同名，rdb() 默认 profile）
 *   主键 id = studentName|examId|submittedAt（唯一去重键）
 *
 * event.action 支持：
 *   - pull   : 查询全部记录，按 submittedAt 倒序返回
 *   - push   : 批量 upsert（按主键 id 冲突合并）
 *   - delete : 按唯一键删除单条
 *   - test   : 返回当前记录条数（连通性诊断）
 *
 * 无论成功与否都返回 { code, data, message }，前端根据 code 判定。
 */

const cloud = require('@cloudbase/node-sdk')

const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV })
const db = app.rdb({ database: 'public' })

const TABLE = 'exam_results'

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

/** 拉取全部记录（按提交时间倒序，最多 1000 条） */
async function handlePull() {
  const { data, error } = await db
    .from(TABLE)
    .select('*')
    .order('submitted_at', { ascending: false })
    .limit(1000)
  if (error) throw new Error(pgError(error))
  return (data || []).map(rowToRecord).filter(Boolean)
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

/** 按唯一键删除单条 */
async function handleDelete(target) {
  const row = recordToRow(target)
  if (!row) return { deleted: false }
  const { error } = await db.from(TABLE).delete().eq('id', row.id)
  if (error) throw new Error(pgError(error))
  return { deleted: true }
}

/** 连通性测试：返回记录总条数 */
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

exports.main = async (event = {}) => {
  const input = normalizeEvent(event)
  const action = input && input.action
  const data = (input && input.data) || {}

  try {
    let result
    switch (action) {
      case 'pull':
        result = await handlePull()
        return { code: 0, data: result, message: 'ok' }
      case 'push':
        result = await handlePush(data.records)
        return { code: 0, data: result, message: 'ok' }
      case 'delete':
        result = await handleDelete(data.record)
        return { code: 0, data: result, message: 'ok' }
      case 'test':
        result = await handleTest()
        return { code: 0, data: result, message: 'ok' }
      default:
        return {
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
    }
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
    return { code: 1, data: null, message: detail }
  }
}
