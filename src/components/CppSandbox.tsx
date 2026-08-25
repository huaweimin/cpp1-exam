import { lazy, Suspense, useState, useRef } from 'react'
import type { EditorProps, OnMount } from '@monaco-editor/react'
import { Button, Input, Typography, Tag, Spin } from 'antd'
import { PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons'
import { initMonaco } from '../utils/monacoSetup'

const { Text } = Typography
const { TextArea } = Input

interface CppSandboxProps {
  /** 学生当前代码（受控） */
  value: string
  /** 代码变更回调 */
  onChange: (code: string) => void
  /** 样例输入，默认填入 stdin，学生可改 */
  sampleInput?: string
  /** 样例输出，用于运行后对比 */
  sampleOutput?: string
  /** 只读模式（如交卷后展示） */
  readOnly?: boolean
}

type RunStatus = 'idle' | 'running' | 'done' | 'error'

// 暴露所有已挂载的 Monaco 实例，便于自动化测试/调试（如 agent-browser 注入代码）
declare global {
  interface Window {
    __cppEditors?: Array<{ setValue: (v: string) => void; getValue: () => string }>
  }
}

// 免费公共 C++ 编译服务（gcc-head，支持 CORS，无需密钥）
const WANDBOX_ENDPOINT = 'https://wandbox.org/api/compile.json'
const RUN_TIMEOUT_MS = 15000

const handleEditorMount: OnMount = (editor) => {
  if (!window.__cppEditors) window.__cppEditors = []
  window.__cppEditors.push({ setValue: (v) => editor.setValue(v), getValue: () => editor.getValue() })
}

// 按需加载 Monaco：首屏不下载编辑器引擎，进入编程题时才拉取（配合 initMonaco 本地化配置）
const MonacoEditor = lazy(() =>
  initMonaco().then(() => import('@monaco-editor/react').then((m) => ({ default: m.Editor })))
)

/** 包装层：Monaco 加载期间显示占位，避免布局跳动 */
function LazyEditor(props: EditorProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center bg-gray-900"
          style={{ height: 340 }}
        >
          <Spin size="large" />
          <span className="ml-3 text-gray-400 text-sm">编辑器加载中…</span>
        </div>
      }
    >
      <MonacoEditor {...props} />
    </Suspense>
  )
}

export default function CppSandbox({
  value,
  onChange,
  sampleInput = '',
  sampleOutput = '',
  readOnly = false,
}: CppSandboxProps) {
  const [input, setInput] = useState(sampleInput)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<RunStatus>('idle')
  const [hint, setHint] = useState('')
  const [matchSample, setMatchSample] = useState<boolean | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const runCode = async () => {
    if (!value.trim()) {
      setHint('请先输入代码再运行')
      setStatus('error')
      setOutput('')
      setMatchSample(null)
      return
    }
    setStatus('running')
    setOutput('')
    setHint('正在编译运行…')
    setMatchSample(null)

    const controller = new AbortController()
    abortRef.current = controller
    const timer = setTimeout(() => controller.abort(), RUN_TIMEOUT_MS)

    try {
      const res = await fetch(WANDBOX_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compiler: 'gcc-head',
          code: value,
          stdin: input,
          'compiler-option': ['-std=c++17', '-O2'],
        }),
        signal: controller.signal,
      })
      clearTimeout(timer)
      const data = await res.json()

      if (data.compiler_error) {
        setOutput(String(data.compiler_error))
        setHint('编译错误，请检查语法')
        setStatus('error')
        return
      }
      if (data.program_error) {
        const merged = `${data.program_output ?? ''}${data.program_error}`.trim()
        setOutput(merged)
        setHint('运行时错误')
        setStatus('error')
        return
      }

      const out = String(data.program_output ?? data.program_message ?? '')
      setOutput(out)
      setStatus('done')

      if (sampleOutput.trim() !== '') {
        const ok = out.trim() === sampleOutput.trim()
        setMatchSample(ok)
        setHint(ok ? '输出与样例一致' : '输出与样例不一致，再检查一下')
      } else {
        setHint('运行完成')
      }
    } catch (err) {
      clearTimeout(timer)
      if (controller.signal.aborted) {
        setOutput('')
        setHint('运行超时（15 秒），可能存在死循环，请检查循环退出条件')
      } else {
        setOutput('')
        setHint('网络错误：无法连接编译服务，请检查网络后重试')
      }
      setStatus('error')
    }
  }

  const fillSampleInput = () => setInput(sampleInput)

  return (
    <div className="cpp-sandbox">
      {/* 代码编辑器 */}
      <div className="rounded-lg overflow-hidden border border-gray-300">
        <LazyEditor
          height="340px"
          language="cpp"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? '')}
          onMount={handleEditorMount}
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: 'SF Mono, Fira Code, Cascadia Code, Consolas, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            smoothScrolling: true,
            padding: { top: 12 },
          }}
        />
      </div>

      {/* 工具栏 */}      <div className="flex flex-wrap items-center gap-2 mt-3">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={runCode}
          loading={status === 'running'}
          disabled={readOnly}
        >
          运行
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fillSampleInput} disabled={readOnly || !sampleInput}>
          填充样例输入
        </Button>
        {matchSample !== null && (
          <Tag color={matchSample ? 'success' : 'error'}>
            {matchSample ? '与样例一致 ✓' : '与样例不一致 ✗'}
          </Tag>
        )}
      </div>

      {/* 输入区 */}
      {!readOnly && (
        <div className="mt-3">
          <Text strong className="text-gray-700 mb-1 block">
            输入（作为程序 stdin，可修改）：
          </Text>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在此输入测试数据，或点击「填充样例输入」"
            autoSize={{ minRows: 2, maxRows: 6 }}
            className="font-mono text-sm"
          />
        </div>
      )}

      {/* 输出区 */}
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <Text strong className="text-gray-700">
            输出：
          </Text>
          {status === 'running' && <Spin size="small" />}
        </div>
        <pre className="code-block min-h-[80px]">
          {status === 'idle' ? '（点击「运行」查看输出）' : output || '（无输出）'}
        </pre>
        {hint && (
          <div className={`mt-1 text-sm ${status === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
            {hint}
          </div>
        )}
      </div>
    </div>
  )
}
