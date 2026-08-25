import type { ExamResult } from '../types/exam'

/**
 * CloudBase 云函数同步模块（examSync）
 * 设计原则：服务器是成绩记录的唯一数据源，页面展示（学生记录页/教师成绩页）均从云端拉取；
 * 登录体系：所有成绩读写都需要登录 token（register/login 除外），
 * 学生只能操作自己的记录，教师账号才能查看/操作全部记录。
 *
 * 链路：fetch → HTTP 访问服务公开路由 → 云函数 examSync → PostgreSQL
 * （PG 环境匿名 callFunction 会被角色授权层拦截 EXCEED_AUTHORITY，故走免鉴权公开路由）
 */

// 环境变量（本地 .env 注入，不进源码仓库），参见项目根目录 .env.example
// 兜底默认值：公开免鉴权路由 URL（非敏感信息），确保线上构建即使没配环境变量也能同步
// 优先级：VITE_TCB_SYNC_URL > VITE_TCB_ENV_ID + VITE_TCB_REGION 拼接 > 默认值
const DEFAULT_SYNC_URL =
  'https://exam-backend-d3gzsicbj7bb6bca0.ap-shanghai.app.tcloudbase.com/examsync'

const SYNC_URL =
  (import.meta.env.VITE_TCB_SYNC_URL as string | undefined) ||
  (import.meta.env.VITE_TCB_ENV_ID
    ? `https://${import.meta.env.VITE_TCB_ENV_ID as string}.${
        import.meta.env.VITE_TCB_REGION as string
      }.app.tcloudbase.com/examsync`
    : DEFAULT_SYNC_URL)

// 请求超时时间（ms）
const TIMEOUT = 12000

// 登录态存储键
export const AUTH_TOKEN_KEY = 'cpp_exam_token'
export const AUTH_USER_KEY = 'cpp_exam_user'

export interface AuthUser {
  username: string
  role: 'student' | 'teacher'
}

export interface LoginResult extends AuthUser {
  token: string
}

/** 读取本地登录态 */
export function getStoredAuth(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userRaw = localStorage.getItem(AUTH_USER_KEY)
    if (!token || !userRaw) return null
    const user = JSON.parse(userRaw) as AuthUser
    if (!user.username || !user.role) return null
    return { token, user }
  } catch {
    return null
  }
}

/** 保存本地登录态 */
export function storeAuth(auth: LoginResult): void {
  localStorage.setItem(AUTH_TOKEN_KEY, auth.token)
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ username: auth.username, role: auth.role }))
}

/** 清除本地登录态 */
export function clearAuth(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

interface CloudResp<T> {
  code: number
  data: T
  message: string
}

/** 统一调用云函数 action（带可选 token）。业务错误（code!==0）抛出异常。 */
async function call<T>(
  action: string,
  data: Record<string, unknown> = {},
  token?: string
): Promise<CloudResp<T>> {
  const payload: Record<string, unknown> = { action, data }
  if (token) payload.token = token
  const res = await fetchWithTimeout(SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as CloudResp<T>
  if (json.code !== 0) throw new Error(json.message || `code ${json.code}`)
  return json
}

/* ==================== 用户体系 ==================== */

/** 注册账号，成功返回 token + 用户信息（自动登录） */
export async function registerAccount(input: {
  username: string
  password: string
  role: 'student' | 'teacher'
  teacherKey?: string
}): Promise<LoginResult> {
  const json = await call<LoginResult>('register', {
    username: input.username,
    password: input.password,
    role: input.role,
    teacherKey: input.teacherKey,
  })
  return json.data
}

/** 登录，成功返回 token + 用户信息 */
export async function loginAccount(username: string, password: string): Promise<LoginResult> {
  const json = await call<LoginResult>('login', { username, password })
  return json.data
}

/** 注销（服务端清除 token + 本地清除登录态） */
export async function logoutAccount(token: string): Promise<boolean> {
  try {
    await call('logout', {}, token)
    return true
  } catch (err) {
    console.warn('[cloudSync] 注销失败:', err)
    return false
  } finally {
    clearAuth()
  }
}

/** 校验 token 有效性，返回当前用户；无效返回 null */
export async function verifyAuth(token: string): Promise<AuthUser | null> {
  try {
    const json = await call<AuthUser>('me', {}, token)
    return json.data
  } catch (err) {
    console.warn('[cloudSync] 登录态校验失败:', err)
    return null
  }
}

/* ==================== 成绩记录 ==================== */

/** 拉取云端全部成绩记录（教师页用）。失败返回 null，调用方降级。 */
export async function pullRecords(token: string): Promise<ExamResult[] | null> {
  try {
    const json = await call<ExamResult[]>('pull', {}, token)
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.warn('[cloudSync] 拉取云端记录失败:', err)
    return null
  }
}

/** 拉取当前登录用户自己的全部记录（学生练习记录页）。失败返回 null。 */
export async function pullMyRecords(token: string): Promise<ExamResult[] | null> {
  try {
    const json = await call<ExamResult[]>('mine', {}, token)
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.warn('[cloudSync] 拉取个人记录失败:', err)
    return null
  }
}

/** 推送单条成绩（学生交卷时调用，归属强制为当前登录用户）。 */
export async function pushResult(result: ExamResult, token: string): Promise<boolean> {
  try {
    await call('pushOne', { record: result }, token)
    return true
  } catch (err) {
    console.warn('[cloudSync] 推送成绩失败（本地缓存兜底）:', err)
    return false
  }
}

/** 从云端删除一条记录（学生只能删自己的，教师可删任意）。 */
export async function deleteRecordOnCloud(
  record: { studentName: string; examId: string; submittedAt: string },
  token: string
): Promise<boolean> {
  try {
    await call('delete', { record }, token)
    return true
  } catch (err) {
    console.warn('[cloudSync] 云端删除失败（本地不受影响）:', err)
    return false
  }
}

/** 测试云端连通性（无需登录）。 */
export async function testConnection(): Promise<{ ok: boolean; count: number | null; error?: string }> {
  try {
    const json = await call<{ count: number }>('test')
    return { ok: true, count: json.data.count }
  } catch (err) {
    return { ok: false, count: null, error: String(err) }
  }
}
