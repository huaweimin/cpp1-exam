import { useEffect, useRef, useState } from 'react'
import { Button, Typography, Statistic, Card, Row, Col, Tag, Progress, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import type { Exam, ExamResult } from '../types/exam'
import QuestionCard from '../components/QuestionCard'
import { saveResult } from '../utils/storage'
import { pushResult } from '../utils/cloudSync'
import { judgeExamProgramming } from '../utils/judge'

const { Title, Text, Paragraph } = Typography

interface ResultPageProps {
  result: ExamResult
  exam: Exam
  onBack: () => void
  token: string
}

export default function ResultPage({ result, exam, onBack, token }: ResultPageProps) {
  const pushedRef = useRef(false)
  // 评测后的完整成绩（编程题判完才有）；评测完成前用原始 result
  const [judgedResult, setJudgedResult] = useState<ExamResult | null>(null)
  const [judging, setJudging] = useState(false)
  const [judgeProgress, setJudgeProgress] = useState({ done: 0, total: 0 })

  const display = judgedResult ?? result

  // 交卷后：本地保存 → 评测编程题 → 评测完成再推送云端
  useEffect(() => {
    saveResult(result)
    const pendingProgramming = result.details.filter(
      (d) => d.type === 'programming' && d.judgeStatus === 'pending'
    )
    if (pushedRef.current) return
    pushedRef.current = true

    if (pendingProgramming.length === 0) {
      // 无待评测编程题（如历史记录回看），直接推送
      pushResult(result, token).catch(() => {})
      return
    }

    setJudging(true)
    setJudgeProgress({ done: 0, total: pendingProgramming.length })
    judgeExamProgramming(result, exam, (done, total) => {
      setJudgeProgress({ done, total })
    })
      .then((judged) => {
        setJudgedResult(judged)
        saveResult(judged)
        pushResult(judged, token).catch(() => {})
      })
      .catch(() => {
        // 评测失败兜底：按当前（编程题 0 分）结果推送
        setJudgedResult(result)
        saveResult(result)
        pushResult(result, token).catch(() => {})
      })
      .finally(() => setJudging(false))
  }, [result, exam, token])

  const objectiveDetails = display.details.filter((d) => d.type !== 'programming')
  const programmingDetails = display.details.filter((d) => d.type === 'programming')
  const objectiveScore = objectiveDetails.reduce((s, d) => s + d.score, 0)
  const objectiveMax = objectiveDetails.reduce((s, d) => s + d.maxScore, 0)
  const programmingScore = programmingDetails.reduce((s, d) => s + d.score, 0)
  const programmingMax = programmingDetails.reduce((s, d) => s + d.maxScore, 0)
  const correctCount = objectiveDetails.filter((d) => d.isCorrect).length
  const wrongCount = objectiveDetails.filter((d) => !d.isCorrect).length

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m} 分 ${s} 秒`
  }

  // 评测中：全屏覆盖提示
  if (judging) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center shadow-lg">
          <ExperimentOutlined style={{ fontSize: 40, color: '#1677ff' }} className="mb-4" />
          <Title level={4} className="!mb-2">正在评测编程题…</Title>
          <Paragraph type="secondary" className="!mb-4">
            系统正在用测试用例运行你的代码（黑盒评测），请稍候，不要关闭页面
          </Paragraph>
          <Spin size="large" />
          <div className="mt-4 text-gray-500 text-sm">
            已完成 {judgeProgress.done} / {judgeProgress.total} 道编程题
          </div>
          <Progress
            percent={judgeProgress.total > 0 ? Math.round((judgeProgress.done / judgeProgress.total) * 100) : 0}
            className="mt-2"
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mb-4"
        >
          返回首页
        </Button>

        {/* 成绩总览 */}
        <Card className="mb-6 shadow-lg" bordered={false}>
          <div className="text-center py-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{
                background: display.passed ? '#f0fdf4' : '#fef2f2',
              }}
            >
              {display.passed ? (
                <CheckCircleOutlined style={{ fontSize: 40, color: '#16a34a' }} />
              ) : (
                <CloseCircleOutlined style={{ fontSize: 40, color: '#dc2626' }} />
              )}
            </div>

            <Title level={2} className="!mb-2">
              {display.totalScore}{' '}
              <span className="text-gray-400 text-lg">/ {display.maxScore} 分</span>
            </Title>
            <Tag color={display.passed ? 'success' : 'error'} className="!text-base !px-4 !py-1 !mb-2">
              {display.passed ? '🎉 及格' : '😔 不及格'}
            </Tag>
            <Paragraph type="secondary" className="!mb-0">
              {display.studentName} · {display.examName}
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
                  value={programmingScore}
                  suffix={`/ ${programmingMax} 分`}
                  valueStyle={{ color: '#ea580c', fontSize: '20px' }}
                />
                <Text type="secondary" className="text-xs">
                  已自动评测，按测试用例通过比例给分
                </Text>
              </Card>
            </Col>
          </Row>

          {/* 用时 + 进度条 */}
          <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <Text type="secondary">⏱️ 考试用时：{formatDuration(display.duration)}</Text>
            <Text type="secondary">提交时间：{new Date(display.submittedAt).toLocaleString('zh-CN')}</Text>
          </div>
          <Progress
            percent={Math.round((display.totalScore / display.maxScore) * 100)}
            status={display.passed ? 'success' : 'exception'}
            className="mt-2"
            format={(percent) => `${percent}%`}
          />
        </Card>

        {/* 逐题解析 */}
        <div className="mb-4">
          <Title level={4} className="bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-blue-500">
            📝 一、单选题解析（每题 4 分）
          </Title>
          {exam.singleChoice.map((q, i) => {
            const detail = display.details.find((d) => d.questionId === q.id)!
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
            📝 二、判断题解析（每题 2 分）
          </Title>
          {exam.trueFalse.map((q, i) => {
            const detail = display.details.find((d) => d.questionId === q.id)!
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
            📝 三、编程题解析（每题 20 分，自动评测）
          </Title>
          {exam.programming.map((q, i) => {
            const detail = display.details.find((d) => d.questionId === q.id)!
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
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={onBack}
            className="!px-12"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  )
}
