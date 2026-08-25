import type { ExamResult } from '../types/exam'

/**
 * CloudBase 云函数同步模块（examSync）
 * 设计原则：服务器是成绩记录的唯一数据源，页面展示（学生记录页/教师成绩页）均从云端拉取；
 * localStorage 仅作为交卷瞬间的本地缓存兜底（崩溃/断网保护），不参与页面展示。
 *
 * 链路：fetch → HTTP 访问服务公开路由 → 云函数 examSync → PostgreSQL exam_results 表
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

/** 统一调用云函数 action，失败抛错由调用方降级。 */
async function call<T>(action: string, data: Record<string, unknown> = {}): Promise<CloudResp<T>> {
  const res = await fetchWithTimeout(SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = (await res.json()) as CloudResp<T>
  if (json.code !== 0) throw new Error(json.message || `code ${json.code}`)
  return json
}

/** 拉取云端全部成绩记录（教师页用）。失败返回 null，调用方降级。 */
export async function pullRecords(): Promise<ExamResult[] | null> {
  try {
    const json = await call<ExamResult[]>('pull')
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.warn('[cloudSync] 拉取云端记录失败:', err)
    return null
  }
}

/** 拉取指定学生的全部云端记录（学生练习记录页）。失败返回 null。 */
export async function pullRecordsByStudent(studentName: string): Promise<ExamResult[] | null> {
  try {
    const json = await call<ExamResult[]>('pullStudent', { studentName })
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.warn('[cloudSync] 拉取学生云端记录失败:', err)
    return null
  }
}

/** 拉取云端全部学生姓名（历史姓名下拉）。失败返回 null。 */
export async function pullStudentNames(): Promise<string[] | null> {
  try {
    const json = await call<string[]>('names')
    return Array.isArray(json.data) ? json.data : []
  } catch (err) {
    console.warn('[cloudSync] 拉取学生姓名列表失败:', err)
    return null
  }
}

/** 推送全部本地记录到云端（服务端按主键 upsert 合并）。 */
export async function pushRecords(localRecords: ExamResult[]): Promise<boolean> {
  try {
    await call('push', { records: localRecords })
    return true
  } catch (err) {
    console.warn('[cloudSync] 推送云端失败（本地数据不受影响）:', err)
    return false
  }
}

/** 推送单条成绩（学生交卷时调用，服务端按主键 upsert）。 */
export async function pushResult(result: ExamResult): Promise<boolean> {
  try {
    await call('pushOne', { record: result })
    return true
  } catch (err) {
    console.warn('[cloudSync] 推送成绩失败（本地缓存兜底）:', err)
    return false
  }
}

/** 从云端删除一条记录。 */
export async function deleteRecordOnCloud(
  studentName: string,
  examId: string,
  submittedAt: string
): Promise<boolean> {
  try {
    await call('delete', { record: { studentName, examId, submittedAt } })
    return true
  } catch (err) {
    console.warn('[cloudSync] 云端删除失败（本地不受影响）:', err)
    return false
  }
}

/** 合并两组记录并按 (studentName, examId, submittedAt) 去重。 */
export function mergeRecords(a: ExamResult[], b: ExamResult[]): ExamResult[] {
  const map = new Map<string, ExamResult>()
  const keyOf = (r: ExamResult) => `${r.studentName}|${r.examId}|${r.submittedAt}`
  for (const r of [...a, ...b]) map.set(keyOf(r), r)
  return Array.from(map.values()).sort(
    (x, y) => new Date(y.submittedAt).getTime() - new Date(x.submittedAt).getTime()
  )
}

/** 测试云端连通性（设置页/诊断用）。 */
export async function testConnection(): Promise<{ ok: boolean; count: number | null; error?: string }> {
  try {
    const json = await call<{ count: number }>('test')
    return { ok: true, count: json.data.count }
  } catch (err) {
    return { ok: false, count: null, error: String(err) }
  }
}
