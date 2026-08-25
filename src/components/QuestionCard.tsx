import { Radio, Typography, Tag, Alert } from 'antd'
import type { ObjectiveQuestion, ProgrammingQuestion } from '../types/exam'
import CppSandbox from './CppSandbox'

const { Text, Paragraph } = Typography

interface QuestionCardProps {
  question: ObjectiveQuestion | ProgrammingQuestion
  index: number
  sectionLabel: string
  studentAnswer?: string
  onAnswer?: (value: string) => void
  showResult?: boolean
  correctAnswer?: string
}

export default function QuestionCard({
  question,
  index,
  sectionLabel,
  studentAnswer = '',
  onAnswer,
  showResult = false,
  correctAnswer,
}: QuestionCardProps) {
  // 只有客观题才用 correctAnswer 判定对错；编程题当前为人工评分，不标红/绿
  const isObjective = question.type === 'singleChoice' || question.type === 'trueFalse'
  const isCorrect = showResult && isObjective && studentAnswer === correctAnswer

  const cardClass = showResult
    ? `question-card ${isCorrect ? 'answer-correct' : isObjective ? 'answer-wrong' : ''}`
    : 'question-card'

  return (
    <div className={cardClass} id={`q-${question.id}`}>
      {/* 题号 + 考点 */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-blue-600 font-bold text-lg">第 {index} 题</span>
          <span className="ml-2 text-gray-400 text-sm">（{sectionLabel}，{question.score} 分）</span>
        </div>
        <div>
          {question.tags.map((tag) => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
        </div>
      </div>

      {/* 题干 */}
      <Paragraph className="!mb-3 text-gray-800" style={{ whiteSpace: 'pre-wrap' }}>
        {question.stem}
      </Paragraph>

      {/* 题干中的代码 */}
      {'code' in question && question.code && (
        <pre className="code-block light mb-3">{question.code}</pre>
      )}

      {/* 单选题 / 判断题 */}
      {(question.type === 'singleChoice' || question.type === 'trueFalse') && (
        <QuestionOptions
          question={question as ObjectiveQuestion}
          studentAnswer={studentAnswer}
          onAnswer={onAnswer}
          showResult={showResult}
          correctAnswer={correctAnswer}
        />
      )}

      {/* 编程题 */}
      {question.type === 'programming' && (
        <ProgrammingContent
          question={question as ProgrammingQuestion}
          studentAnswer={studentAnswer}
          onAnswer={onAnswer}
          showResult={showResult}
        />
      )}

      {/* 结果展示：正确答案 + 解析 */}
      {showResult && (question.type === 'singleChoice' || question.type === 'trueFalse') && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Text strong className={isCorrect ? 'text-green-600' : 'text-red-500'}>
              {isCorrect ? '✅ 回答正确' : '❌ 回答错误'}
            </Text>
            <Text type="secondary">
              你的答案：{studentAnswer || '（未作答）'} ｜ 正确答案：{correctAnswer}
            </Text>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
            <Text strong className="text-blue-600">📝 解析：</Text>
            <br />
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  )
}

// 单选题 / 判断题选项
function QuestionOptions({
  question,
  studentAnswer,
  onAnswer,
  showResult,
  correctAnswer,
}: {
  question: ObjectiveQuestion
  studentAnswer: string
  onAnswer?: (v: string) => void
  showResult: boolean
  correctAnswer?: string
}) {
  // 判断题选项
  if (question.type === 'trueFalse') {
    const options = { A: '正确', B: '错误' }
    return (
      <Radio.Group
        value={studentAnswer}
        onChange={(e) => onAnswer?.(e.target.value)}
        disabled={showResult}
        className="flex flex-col gap-2"
      >
        {(['A', 'B'] as const).map((key) => {
          const isThisCorrect = showResult && correctAnswer === key
          const isThisSelected = studentAnswer === key
          return (
            <Radio
              key={key}
              value={key}
              className={`p-2 rounded-lg ${showResult && isThisCorrect ? 'bg-green-50' : ''} ${showResult && isThisSelected && !isThisCorrect ? 'bg-red-50' : ''}`}
            >
              <span className={showResult && isThisCorrect ? 'text-green-600 font-bold' : ''}>
                {key}. {options[key]}
              </span>
              {showResult && isThisCorrect && <span className="ml-2 text-green-600">✓</span>}
              {showResult && isThisSelected && !isThisCorrect && <span className="ml-2 text-red-500">✗</span>}
            </Radio>
          )
        })}
      </Radio.Group>
    )
  }

  // 单选题选项
  const options = question.options || {}
  return (
    <Radio.Group
      value={studentAnswer}
      onChange={(e) => onAnswer?.(e.target.value)}
      disabled={showResult}
      className="flex flex-col gap-2"
    >
      {(['A', 'B', 'C', 'D'] as const).map((key) => {
        const isThisCorrect = showResult && correctAnswer === key
        const isThisSelected = studentAnswer === key
        return (
          <Radio
            key={key}
            value={key}
            className={`p-2 rounded-lg border border-gray-200 ${showResult && isThisCorrect ? 'bg-green-50 border-green-300' : ''} ${showResult && isThisSelected && !isThisCorrect ? 'bg-red-50 border-red-300' : ''}`}
          >
            <span className={showResult && isThisCorrect ? 'text-green-600 font-bold' : ''}>
              {key}. {options[key]}
            </span>
            {showResult && isThisCorrect && <span className="ml-2 text-green-600">✓</span>}
            {showResult && isThisSelected && !isThisCorrect && <span className="ml-2 text-red-500">✗</span>}
          </Radio>
        )
      })}
    </Radio.Group>
  )
}

// 编程题内容
function ProgrammingContent({
  question,
  studentAnswer,
  onAnswer,
  showResult,
}: {
  question: ProgrammingQuestion
  studentAnswer: string
  onAnswer?: (v: string) => void
  showResult: boolean
}) {
  return (
    <div>
      {/* 输入输出格式 + 样例 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text strong className="text-gray-700">输入格式</Text>
          <Paragraph className="!mb-0 !mt-1 text-sm text-gray-600" style={{ whiteSpace: 'pre-wrap' }}>
            {question.inputFormat}
          </Paragraph>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text strong className="text-gray-700">输出格式</Text>
          <Paragraph className="!mb-0 !mt-1 text-sm text-gray-600" style={{ whiteSpace: 'pre-wrap' }}>
            {question.outputFormat}
          </Paragraph>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text strong className="text-gray-700">样例输入</Text>
          <pre className="code-block light !mt-1 !mb-0 text-xs">{question.sampleInput}</pre>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Text strong className="text-gray-700">样例输出</Text>
          <pre className="code-block light !mt-1 !mb-0 text-xs">{question.sampleOutput}</pre>
        </div>
      </div>

      {/* 代码输入 + 运行沙箱 */}
      {!showResult ? (
        <div>
          <Text strong className="text-gray-700 mb-2 block">请在此编写并运行你的代码：</Text>
          <CppSandbox
            value={studentAnswer}
            onChange={(v) => onAnswer?.(v)}
            sampleInput={question.sampleInput}
            sampleOutput={question.sampleOutput}
          />
        </div>
      ) : (
        <div>
          <Alert
            type="info"
            showIcon
            message="编程题暂由教师人工评分"
            description="请对照右侧参考代码和解析自行检查，系统会在教师确认后更新得分。"
            className="mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 学生代码 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-gray-700">你的代码：</Text>
                <Tag color="orange" className="text-xs">待评分</Tag>
              </div>
              <pre className="code-block light">{studentAnswer || '（未作答）'}</pre>
            </div>
            {/* 参考代码 */}
            <div>
              <Text strong className="text-green-600 mb-2 block">参考代码：</Text>
              <pre className="code-block light">{question.referenceCode}</pre>
            </div>
            {/* 解析 */}
            <div className="md:col-span-2 bg-blue-50 p-3 rounded-lg text-sm text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
              <Text strong className="text-blue-600">📝 解析：</Text>
              <br />
              {question.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
