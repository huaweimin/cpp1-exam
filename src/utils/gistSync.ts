import type { ExamResult } from '../types/exam'

/**
 * GitHub Gist 云端同步模块
 * 设计原则：云端是"尽力而为"的同步层，localStorage 永远是保底。
 * 任何网络失败都静默降级，绝不影响本地答题与判分。
 */

// Token 与 Gist ID 从环境变量读取（本地 .env 注入，不进源码仓库）
// 参见项目根目录 .env.example
const GIST_ID = import.meta.env.VITE_GIST_ID as string
const GITHUB_TOKEN = import.meta.env.VITE_GIST_TOKEN as string

const API_URL = `https://api.github.com/gists/${GIST_ID}`
const FILE_NAME = 'exam-records.json'

// 请求超时时间（ms）——国内访问 GitHub API 偶尔慢，给足余量但不无限等
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

interface GistPayload {
  records: ExamResult[]
}

/** 拉取云端全部成绩记录（教师页/同步用）。失败返回 null，调用方降级。 */
export async function pullRecords(): Promise<ExamResult[] | null> {
  try {
    const res = await fetchWithTimeout(API_URL, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    })
    if (!res.ok) return null
    const gist = await res.json()
    const content = gist?.files?.[FILE_NAME]?.content
    if (!content) return []
    const payload = JSON.parse(content) as GistPayload
    return Array.isArray(payload.records) ? payload.records : []
  } catch (err) {
    console.warn('[gistSync] 拉取云端记录失败（已降级为本地数据）:', err)
    return null
  }
}

/** 把本地全部记录推送到云端（全量覆盖写，先拉后写做合并去重）。 */
export async function pushRecords(localRecords: ExamResult[]): Promise<boolean> {
  try {
    // 1. 先拉云端现有记录做合并（防止覆盖别人刚交的成绩）
    const cloud = await pullRecords()
    const merged = mergeRecords(localRecords, cloud ?? [])

    // 2. 全量写回
    const res = await fetchWithTimeout(API_URL, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: { content: JSON.stringify({ records: merged }, null, 2) },
        },
      }),
    })
    return res.ok
  } catch (err) {
    console.warn('[gistSync] 推送云端失败（本地数据不受影响）:', err)
    return false
  }
}

/** 推送单条成绩（学生交卷时调用）：本地全量 + 该条 → 云端。 */
export async function pushResult(result: ExamResult): Promise<boolean> {
  // 本地已有该条（storage.saveResult 已写入），直接全量推
  const { getAllResults } = await import('./storage')
  const local = getAllResults()
  if (!local.some((r) => r.studentName === result.studentName && r.submittedAt === result.submittedAt)) {
    local.push(result)
  }
  return pushRecords(local)
}

/**
 * 从云端真正删除一条记录（拉取 → 过滤 → 覆盖写）。
 * 注意不能走 pushRecords 的合并逻辑，否则被删的记录会被云端副本"复活"。
 */
export async function deleteRecordOnCloud(
  studentName: string,
  examId: string,
  submittedAt: string
): Promise<boolean> {
  try {
    const cloud = await pullRecords()
    if (cloud === null) return false
    const remaining = cloud.filter(
      (r) => !(r.studentName === studentName && r.examId === examId && r.submittedAt === submittedAt)
    )
    const res = await fetchWithTimeout(API_URL, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: {
          [FILE_NAME]: { content: JSON.stringify({ records: remaining }, null, 2) },
        },
      }),
    })
    return res.ok
  } catch (err) {
    console.warn('[gistSync] 云端删除失败（本地不受影响）:', err)
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
  const records = await pullRecords()
  if (records === null) return { ok: false, count: null, error: '无法连接 GitHub API（国内网络可能波动）' }
  return { ok: true, count: records.length }
}
