import { Button, Typography, Statistic, Card, Row, Col, Tag, Progress, Alert } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import type { Exam, ExamResult } from '../types/exam'
import QuestionCard from '../components/QuestionCard'

const { Title, Text, Paragraph } = Typography

interface RecordDetailProps {
  result: ExamResult
  exam?: Exam
  onBack: () => void
}

// 历史记录详情：复刻交卷后成绩页的完整试卷回顾
export default function RecordDetail({ result, exam, onBack }: RecordDetailProps) {
  const objectiveDetails = result.details.filter((d) => d.type !== 'programming')
  const programmingDetails = result.details.filter((d) => d.type === 'programming')
  const objectiveScore = objectiveDetails.reduce((s, d) => s + d.score, 0)
  const objectiveMax = objectiveDetails.reduce((s, d) => s + d.maxScore, 0)
  const correctCount = objectiveDetails.filter((d) => d.isCorrect).length
  const wrongCount = objectiveDetails.filter((d) => !d.isCorrect).length

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m} 分 ${s} 秒`
  }

  // 找不到原卷（考试被下架/导入的旧记录）时，只展示成绩概览
  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">
            返回记录列表
          </Button>
          <Alert
            type="warning"
            showIcon
            message="这套试卷已不在系统里（可能已下架），只能查看成绩概览，无法展示逐题解析。"
          />
          <Card className="mt-4">
            <div className="text-center py-6">
              <Title level={2} className="!mb-2">
                {result.totalScore}
                <span className="text-gray-400 text-lg"> / {result.maxScore} 分</span>
              </Title>
              <Tag color={result.passed ? 'success' : 'error'} className="!text-base !px-4 !py-1">
                {result.passed ? '🎉 及格' : '😔 不及格'}
              </Tag>
              <Paragraph type="secondary" className="!mb-0 mt-2">
                {result.studentName} · {result.examName} ·{' '}
                {new Date(result.submittedAt).toLocaleString('zh-CN')}
              </Paragraph>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 返回按钮 */}
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">
          返回记录列表
        </Button>

        {/* 成绩总览（和交卷后的成绩页一致） */}
        <Card className="mb-6 shadow-lg" variant="borderless">
          <div className="text-center py-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ background: result.passed ? '#f0fdf4' : '#fef2f2' }}
            >
              {result.passed ? (
                <CheckCircleOutlined style={{ fontSize: 40, color: '#16a34a' }} />
              ) : (
                <CloseCircleOutlined style={{ fontSize: 40, color: '#dc2626' }} />
              )}
            </div>

            <Title level={2} className="!mb-2">
              {result.totalScore}{' '}
              <span className="text-gray-400 text-lg">/ {result.maxScore} 分</span>
            </Title>
            <Tag color={result.passed ? 'success' : 'error'} className="!text-base !px-4 !py-1 !mb-2">
              {result.passed ? '🎉 及格' : '😔 不及格'}
            </Tag>
            <Paragraph type="secondary" className="!mb-0">
              {result.studentName} · {result.examName}
            </Paragraph>
          </div>

          {/* 分项统计 */}
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24} sm={8}>
              <Card size="small" className="bg-blue-50 border-0">
                <Statistic
                  title="单选题"
                  value={objectiveScore}
                  suffix={`/ ${objectiveMax} 分`}
                  valueStyle={{ color: '#2563eb' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" className="bg-green-50 border-0">
                <Statistic
                  title="客观题正确率"
                  value={objectiveDetails.length > 0 ? Math.round((correctCount / objectiveDetails.length) * 100) : 0}
                  suffix="%"
                  valueStyle={{ color: '#16a34a' }}
                />
                <Text type="secondary" className="text-xs">
                  正确 {correctCount} 题 / 错误 {wrongCount} 题
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small" className="bg-orange-50 border-0">
                <Statistic
                  title="编程题"
                  value="待评分"
                  valueStyle={{ color: '#ea580c', fontSize: '20px' }}
                />
                <Text type="secondary" className="text-xs">
                  编程题请对照参考代码自检
                </Text>
              </Card>
            </Col>
          </Row>

          {/* 用时 + 进度条 */}
          <div className="mt-4 flex items-center justify-between">
            <Text type="secondary">⏱️ 考试用时：{formatDuration(result.duration)}</Text>
            <Text type="secondary">提交时间：{new Date(result.submittedAt).toLocaleString('zh-CN')}</Text>
          </div>
          <Progress
            percent={Math.round((result.totalScore / result.maxScore) * 100)}
            status={result.passed ? 'success' : 'exception'}
            className="mt-2"
            format={(percent) => `${percent}%`}
          />
        </Card>

        {/* 逐题解析 */}
        <div className="mb-4">
          <Title level={4} className="bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-blue-500">
            📝 一、单选题解析
          </Title>
          {exam.singleChoice.map((q, i) => {
            const detail = result.details.find((d) => d.questionId === q.id)
            if (!detail) return null
            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="单选题"
                studentAnswer={detail.studentAnswer}
                showResult
                correctAnswer={detail.correctAnswer}
              />
            )
          })}
        </div>

        <div className="mb-4">
          <Title level={4} className="bg-green-50 px-4 py-2 rounded-lg border-l-4 border-green-500">
            📝 二、判断题解析
          </Title>
          {exam.trueFalse.map((q, i) => {
            const detail = result.details.find((d) => d.questionId === q.id)
            if (!detail) return null
            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="判断题"
                studentAnswer={detail.studentAnswer}
                showResult
                correctAnswer={detail.correctAnswer}
              />
            )
          })}
        </div>

        <div className="mb-4">
          <Title level={4} className="bg-orange-50 px-4 py-2 rounded-lg border-l-4 border-orange-500">
            📝 三、编程题解析（自动评测）
          </Title>
          {exam.programming.map((q, i) => {
            const detail = result.details.find((d) => d.questionId === q.id)
            if (!detail) return null
            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="编程题"
                studentAnswer={detail.studentAnswer}
                showResult
                judge={detail}
              />
            )
          })}
        </div>

        {/* 底部返回 */}
        <div className="text-center py-8">
          <Button type="primary" size="large" icon={<ArrowLeftOutlined />} onClick={onBack} className="!px-12">
            返回记录列表
          </Button>
        </div>
      </div>
    </div>
  )
}
