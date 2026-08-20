import type { ExamResult } from '../types/exam'

const CODE_PREFIX = 'EXAM1:'

// 生成成绩码（学生复制后发给老师）
export function encodeResult(result: ExamResult): string {
  const json = JSON.stringify(result)
  const base64 = btoa(unescape(encodeURIComponent(json)))
  return CODE_PREFIX + base64
}

// 解析成绩码（老师导入用，支持多个码用空格/换行分隔）
export function decodeResults(code: string): ExamResult[] {
  const results: ExamResult[] = []
  const parts = code.split(/[\s,;]+/).filter(Boolean)
  for (const part of parts) {
    const b64 = part.startsWith(CODE_PREFIX) ? part.slice(CODE_PREFIX.length) : part
    try {
      const json = decodeURIComponent(escape(atob(b64.trim())))
      const parsed = JSON.parse(json)
      if (parsed && parsed.studentName && parsed.examId && Array.isArray(parsed.details)) {
        results.push(parsed as ExamResult)
      }
    } catch {
      // 无效片段直接跳过
    }
  }
  return results
}

// 复制文本到剪贴板（带降级方案）
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // 降级处理
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}
