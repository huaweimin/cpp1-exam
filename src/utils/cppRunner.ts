/**
 * C++ 云端编译运行服务（多后端容灾版）
 *
 * 后端 1：Compiler Explorer / Godbolt（https://godbolt.org，gcc 13.2.0）—— 主用后端
 * 后端 2：Wandbox（https://wandbox.org）—— Godbolt 故障时自动兜底
 *
 * 统一入口 runCppCode：
 * - 任一后端"网络层失败"（超时 / HTTP 5xx / 断网）时自动切换下一个后端；
 * - 编译错误、运行错误属于"正常判定结果"，直接返回给调用方，不做后端重试。
 */

export interface CppRunResult {
  ok: boolean // true = 编译运行成功，output 为程序 stdout
  output: string // 程序标准输出
  error: string // ok = false 时的错误描述（编译错误 / 运行错误 / 服务不可用）
}

const WANDBOX_ENDPOINT = 'https://wandbox.org/api/compile.json'
const GODBOLT_ENDPOINT = 'https://godbolt.org/api/compiler/g132/compile'
const GODBOLT_USER_ARGS = '-O2 -std=c++17'

interface WandboxResp {
  compiler_error?: string
  program_error?: string
  program_output?: string
  program_message?: string
}

interface GodboltLine {
  text?: string
}

interface GodboltResp {
  stderr?: GodboltLine[] // 编译期诊断信息
  execResult?: {
    code?: number // 程序退出码（信号为负数）
    timedOut?: boolean
    stdout?: GodboltLine[]
    stderr?: GodboltLine[]
  }
}

/** 把 Godbolt 的 [{text}] 行数组拼成一段文本（并去除编译诊断中的 ANSI 颜色码） */
function joinGodboltLines(lines?: GodboltLine[]): string {
  return (lines ?? [])
    .map((l) => String(l.text ?? '').replace(/\x1b\[[0-9;]*m/g, ''))
    .join('\n')
}

/** 后端 1：Wandbox。网络层失败时 throw，由上层切换后端 */
async function runOnWandbox(code: string, stdin: string, timeoutMs: number): Promise<CppRunResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(WANDBOX_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-head',
        code,
        stdin,
        'compiler-option': ['-std=c++17', '-O2'],
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Wandbox HTTP ${res.status}`)
    const data = (await res.json()) as WandboxResp
    if (data.compiler_error) {
      return { ok: false, output: '', error: `编译错误：${String(data.compiler_error).slice(0, 300)}` }
    }
    if (data.program_error) {
      return {
        ok: false,
        output: String(data.program_output ?? ''),
        error: `运行错误：${String(data.program_error).slice(0, 300)}`,
      }
    }
    return { ok: true, output: String(data.program_output ?? ''), error: '' }
  } finally {
    clearTimeout(timer)
  }
}

/** 后端 2：Godbolt。网络层失败时 throw，由上层统一处理 */
async function runOnGodbolt(code: string, stdin: string, timeoutMs: number): Promise<CppRunResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(GODBOLT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        source: code,
        lang: 'c++',
        allowStoreCodeDebug: false,
        options: {
          userArguments: GODBOLT_USER_ARGS,
          executeParameters: { stdin },
          filters: { execute: true },
        },
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Godbolt HTTP ${res.status}`)
    const data = (await res.json()) as GodboltResp
    const exec = data.execResult
    if (!exec) {
      // 没有执行结果 = 编译失败
      const msg = (joinGodboltLines(data.stderr) || '未知编译错误').slice(0, 300)
      return { ok: false, output: '', error: `编译错误：${msg}` }
    }
    if (exec.timedOut) {
      return {
        ok: false,
        output: joinGodboltLines(exec.stdout),
        error: '运行超时：可能存在死循环，请检查循环退出条件',
      }
    }
    if ((exec.code ?? 0) !== 0) {
      return {
        ok: false,
        output: joinGodboltLines(exec.stdout),
        error: `运行错误（退出码 ${exec.code}）：${joinGodboltLines(exec.stderr).slice(0, 300)}`,
      }
    }
    return { ok: true, output: joinGodboltLines(exec.stdout), error: '' }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 运行 C++ 代码（统一入口）。
 * Godbolt 优先（Wandbox 2026-09 起服务端故障持续返回 500，故降为兜底）；
 * 主后端网络层故障时自动切换 Wandbox；两个后端都失败才报服务不可用。
 */
export async function runCppCode(code: string, stdin: string, timeoutMs = 20000): Promise<CppRunResult> {
  const backends = [runOnGodbolt, runOnWandbox]
  const errors: string[] = []
  for (const backend of backends) {
    try {
      return await backend(code, stdin, timeoutMs)
    } catch (err) {
      errors.push(String(err))
    }
  }
  return {
    ok: false,
    output: '',
    error: `评测服务暂时不可用，请稍后重试（${errors.join('；').slice(0, 200)}）`,
  }
}
