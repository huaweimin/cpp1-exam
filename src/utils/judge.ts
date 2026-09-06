import type { Exam, ExamResult, ProgrammingQuestion, CaseDetail, JudgeStatus } from '../types/exam'
import { runCppCode } from './cppRunner'

/**
 * 编程题自动判题引擎（黑盒测试）
 *
 * 原理：把测试用例的 input 作为 stdin 喂给用户代码（云端编译运行，多后端容灾见 cppRunner.ts），
 * 比对程序输出与期望输出（有效字符精确匹配，忽略行尾空白/末尾换行），
 * 按通过用例数比例给分——对标电子学会 C/C++ 一级考试"按测试点计分 + 输出格式严格一致"的规则。
 */

const CASE_TIMEOUT_MS = 20000 // 单用例编译+运行超时
const MAX_CONCURRENCY = 4 // 云端免费服务并发限制，逐组运行太慢，限 4 并发

/** 输出归一化：统一换行符、去掉每行行尾空白、去掉首尾空行 */
export function normalizeOutput(s: string): string {
  return String(s)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n+$/g, '')
    .replace(/^\n+/g, '')
}

/** 判定单个用例 */
async function judgeCase(code: string, input: string, expected: string): Promise<CaseDetail> {
  const { ok, output, error } = await runCppCode(code, input, CASE_TIMEOUT_MS)
  if (!ok) {
    return { input, expected, actual: `⚠️ ${error}`, passed: false }
  }
  const passed = normalizeOutput(output) === normalizeOutput(expected)
  return { input, expected, actual: passed ? output : output, passed }
}

/**
 * 判一道编程题：逐用例黑盒测试，按通过比例给分。
 * 返回 { score, casesPassed, casesTotal, caseDetails, status }
 */
export async function judgeProgrammingQuestion(
  code: string,
  question: ProgrammingQuestion
): Promise<{
  score: number
  casesPassed: number
  casesTotal: number
  caseDetails: CaseDetail[]
  status: JudgeStatus
}> {
  const cases = question.testCases && question.testCases.length > 0
    ? question.testCases
    : [{ input: question.sampleInput, output: question.sampleOutput }]

  const results: CaseDetail[] = []
  // 分批并发（Wandbox 限制并发，避免被封）
  for (let i = 0; i < cases.length; i += MAX_CONCURRENCY) {
    const chunk = cases.slice(i, i + MAX_CONCURRENCY)
    const settled = await Promise.allSettled(
      chunk.map((tc) => judgeCase(code, tc.input, tc.output))
    )
    settled.forEach((r) => {
      if (r.status === 'fulfilled') results.push(r.value)
      else {
        results.push({
          input: '',
          expected: '',
          actual: `⚠️ 评测异常：${String(r.reason ?? '').slice(0, 100)}`,
          passed: false,
        })
      }
    })
  }

  const casesPassed = results.filter((r) => r.passed).length
  const casesTotal = results.length
  // 空代码直接 0 分
  const isEmpty = !code.trim()
  const score = isEmpty ? 0 : Math.round((question.score * casesPassed) / Math.max(casesTotal, 1))
  const status: JudgeStatus = isEmpty || casesPassed === casesTotal ? 'done' : 'done'
  return { score, casesPassed, casesTotal, caseDetails: results, status }
}

/**
 * 评测整卷编程题（交卷后调用），就地更新 result.details 中编程题的判题结果，
 * 返回更新后的 result 及每题的进度回调。
 */
export async function judgeExamProgramming(
  result: ExamResult,
  exam: Exam,
  onProgress?: (done: number, total: number, questionIdx: number) => void
): Promise<ExamResult> {
  const programming = exam.programming
  const total = programming.length
  if (total === 0) return result

  const answersMap: Record<number, string> = {}
  for (const d of result.details) {
    if (d.type === 'programming') answersMap[d.questionId] = d.studentAnswer
  }

  for (let i = 0; i < total; i++) {
    const q = programming[i]
    const code = answersMap[q.id] || ''
    const judged = await judgeProgrammingQuestion(code, q)
    // 更新 details 对应项
    for (const d of result.details) {
      if (d.type === 'programming' && d.questionId === q.id) {
        d.score = judged.score
        d.isCorrect = judged.casesPassed === judged.casesTotal
        d.judgeStatus = judged.status
        d.casesPassed = judged.casesPassed
        d.casesTotal = judged.casesTotal
        d.caseDetails = judged.caseDetails
      }
    }
    onProgress?.(i + 1, total, i)
  }

  // 重算总分与及格
  result.totalScore = result.details.reduce((sum, d) => sum + d.score, 0)
  result.passed = result.totalScore >= exam.passingScore
  return result
}
