import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Button, Modal, Typography, Progress, Space, Affix, Card } from 'antd'
import { ClockCircleOutlined, LogoutOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { Exam, StudentAnswers, ExamResult } from '../types/exam'
import { allExams } from '../data/exams'
import { useAuth } from '../App'
import QuestionCard from '../components/QuestionCard'
import { saveProgress, loadProgress, clearProgress } from '../utils/storage'
import { gradeExam, getAnswerStats } from '../utils/grading'

const { Text, Title } = Typography

interface ExamInnerProps {
  exam: Exam
  studentName: string
}

function ExamInner({ exam, studentName }: ExamInnerProps) {
  const navigate = useNavigate()
  const startTimeRef = useRef<number>(Date.now())
  const [remainingSec, setRemainingSec] = useState(exam.duration * 60)

  // 初始化答案（尝试恢复进度）
  const [answers, setAnswers] = useState<StudentAnswers>(() => {
    const saved = loadProgress(exam.id, studentName)
    return saved || { singleChoice: {}, trueFalse: {}, programming: {} }
  })

  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // 时间到，自动交卷
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 自动保存（每 10 秒）
  useEffect(() => {
    const autoSave = setInterval(() => {
      saveProgress(exam.id, studentName, answers)
    }, 10000)
    return () => {
      clearInterval(autoSave)
      saveProgress(exam.id, studentName, answers)
    }
  }, [exam.id, studentName, answers])

  // 答题统计
  const stats = getAnswerStats(answers, exam)

  // 提交
  const handleSubmit = useCallback(
    (autoSubmit: boolean = false) => {
      if (!autoSubmit) setShowSubmitModal(false)
      const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000)
      const result = gradeExam(exam, answers, studentName, durationSec)
      saveProgress(exam.id, studentName, answers)
      clearProgress(exam.id, studentName)
      navigate('/result', { state: { result }, replace: true })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [answers, exam, studentName, navigate]
  )

  // 更新单选题答案
  const updateSingleChoice = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      singleChoice: { ...prev.singleChoice, [questionId]: value },
    }))
  }

  // 更新判断题答案
  const updateTrueFalse = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      trueFalse: { ...prev.trueFalse, [questionId]: value },
    }))
  }

  // 更新编程题答案
  const updateProgramming = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      programming: { ...prev.programming, [questionId]: value },
    }))
  }

  // 滚动到指定题目
  const scrollToQuestion = (questionId: number) => {
    const el = document.getElementById(`q-${questionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // 格式化时间
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const isUrgent = remainingSec <= 300 // 5 分钟以内变红

  // 题号导航
  const renderQuestionNav = () => {
    const allQuestions = [
      ...exam.singleChoice.map((q) => ({ id: q.id, type: '单选' as const, answered: !!answers.singleChoice[q.id] })),
      ...exam.trueFalse.map((q) => ({ id: q.id, type: '判断' as const, answered: !!answers.trueFalse[q.id] })),
      ...exam.programming.map((q) => ({ id: q.id, type: '编程' as const, answered: !!answers.programming[q.id]?.trim() })),
    ]

    return (
      <div className="space-y-3">
        <div>
          <Text strong className="text-gray-600 block mb-2">单选题</Text>
          <div className="flex flex-wrap gap-1.5">
            {allQuestions.filter((q) => q.type === '单选').map((q, i) => (
              <button
                key={q.id}
                className={`nav-btn ${q.answered ? 'answered' : 'unanswered'}`}
                onClick={() => scrollToQuestion(q.id)}
                title={`第 ${i + 1} 题`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Text strong className="text-gray-600 block mb-2">判断题</Text>
          <div className="flex flex-wrap gap-1.5">
            {allQuestions.filter((q) => q.type === '判断').map((q, i) => (
              <button
                key={q.id}
                className={`nav-btn ${q.answered ? 'answered' : 'unanswered'}`}
                onClick={() => scrollToQuestion(q.id)}
                title={`第 ${i + 1} 题`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Text strong className="text-gray-600 block mb-2">编程题</Text>
          <div className="flex flex-wrap gap-1.5">
            {allQuestions.filter((q) => q.type === '编程').map((q, i) => (
              <button
                key={q.id}
                className={`nav-btn ${q.answered ? 'answered' : 'unanswered'}`}
                onClick={() => scrollToQuestion(q.id)}
                title={`第 ${i + 1} 题`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 顶部状态栏 */}
      <Affix offsetTop={0}>
        <div className="bg-white shadow-md px-3 sm:px-6 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => setShowExitModal(true)}
              className="text-gray-500"
            >
              退出
            </Button>
            <Text strong className="text-gray-700 hidden md:inline">
              {studentName} · {exam.name}
            </Text>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <ClockCircleOutlined className={`text-lg ${isUrgent ? 'text-red-500' : 'text-blue-500'}`} />
              <span
                className={`font-mono text-lg sm:text-xl font-bold ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}
              >
                {formatTime(remainingSec)}
              </span>
            </div>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => setShowSubmitModal(true)}
              size="large"
            >
              交卷
            </Button>
          </div>
        </div>
      </Affix>

      <div className="flex max-w-7xl mx-auto gap-6 p-4 md:p-6">
        {/* 左侧导航 */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl p-4 shadow-sm">
            <Text strong className="text-gray-700 block mb-3">答题进度</Text>
            <Progress
              percent={Math.round((stats.answered / stats.total) * 100)}
              status={stats.answered === stats.total ? 'success' : 'active'}
              className="mb-4"
            />
            <Text type="secondary" className="text-sm block mb-4">
              已答 {stats.answered} / {stats.total} 题
            </Text>
            {renderQuestionNav()}
          </div>
        </div>

        {/* 主答题区 */}
        <div className="flex-1 min-w-0">
          {/* 单选题 */}
          <div className="mb-6">
            <Title level={4} className="bg-blue-50 px-4 py-2 rounded-lg border-l-4 border-blue-500">
              一、单选题（每题 4 分，共 {exam.singleChoice.length * 4} 分）
            </Title>
            {exam.singleChoice.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="单选题"
                studentAnswer={answers.singleChoice[q.id]}
                onAnswer={(v) => updateSingleChoice(q.id, v)}
              />
            ))}
          </div>

          {/* 判断题 */}
          <div className="mb-6">
            <Title level={4} className="bg-green-50 px-4 py-2 rounded-lg border-l-4 border-green-500">
              二、判断题（每题 2 分，共 {exam.trueFalse.length * 2} 分）
            </Title>
            {exam.trueFalse.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="判断题"
                studentAnswer={answers.trueFalse[q.id]}
                onAnswer={(v) => updateTrueFalse(q.id, v)}
              />
            ))}
          </div>

          {/* 编程题 */}
          <div className="mb-6">
            <Title level={4} className="bg-orange-50 px-4 py-2 rounded-lg border-l-4 border-orange-500">
              三、编程题（每题 20 分，共 {exam.programming.length * 20} 分）
            </Title>
            {exam.programming.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                sectionLabel="编程题"
                studentAnswer={answers.programming[q.id]}
                onAnswer={(v) => updateProgramming(q.id, v)}
              />
            ))}
          </div>

          {/* 底部交卷按钮 */}
          <div className="text-center py-8">
            <Space direction="vertical" size="large">
              <Text type="secondary">
                已答 {stats.answered} / {stats.total} 题
                {stats.unanswered.length > 0 && `（还有 ${stats.unanswered.length} 题未作答）`}
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={() => setShowSubmitModal(true)}
                className="!px-12"
              >
                提交试卷
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 交卷确认弹窗 */}
      <Modal
        title="确认交卷"
        open={showSubmitModal}
        onOk={() => handleSubmit(false)}
        onCancel={() => setShowSubmitModal(false)}
        okText="确认交卷"
        cancelText="继续答题"
        okButtonProps={{ danger: stats.unanswered.length > 0 }}
      >
        <div className="py-4">
          <p className="text-gray-700 mb-3">确定要提交试卷吗？</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">📊 答题情况：</p>
            <ul className="text-sm text-gray-600 ml-4">
              <li>已答题数：{stats.answered} / {stats.total}</li>
              <li>未答题数：{stats.unanswered.length}</li>
              {stats.unanswered.length > 0 && (
                <li className="text-red-500 mt-1">
                  ⚠️ 还有 {stats.unanswered.length} 题未作答，提交后无法修改！
                </li>
              )}
            </ul>
          </div>
        </div>
      </Modal>

      {/* 退出确认弹窗 */}
      <Modal
        title="确认退出"
        open={showExitModal}
        onOk={() => navigate('/')}
        onCancel={() => setShowExitModal(false)}
        okText="确认退出"
        cancelText="继续答题"
        okButtonProps={{ danger: true }}
      >
        <div className="py-4">
          <p className="text-gray-700">
            退出后答题进度会自动保存，下次进入同一考试可以继续答题。
          </p>
          <p className="text-gray-500 text-sm mt-2">
            （但计时不会暂停，建议不要长时间退出）
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>()
  const { auth } = useAuth()
  const exam = allExams.find((e) => e.id === examId)

  // 理论上不会走到（RequireAuth 已拦截未登录），仅作兜底
  if (!auth) return null

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center shadow-lg">
          <Title level={4} className="!mb-4">试卷不存在或已下架</Title>
          <Link to="/">
            <Button type="primary" size="large">返回首页</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return <ExamInner exam={exam} studentName={auth.user.username} />
}
