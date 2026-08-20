import { useState, useCallback } from 'react'
import { Modal, Input, Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import type { Exam, ExamResult } from './types/exam'
import HomePage from './pages/HomePage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import TeacherPage from './pages/TeacherPage'
import RecordsPage from './pages/RecordsPage'

const { Text } = Typography

// 教师口令：优先读 .env，未配置时用默认值（改口令：编辑 .env 后重新 build 部署）
const TEACHER_PASSWORD = import.meta.env.VITE_TEACHER_PASSWORD || 'teacher2026'
const TEACHER_AUTH_KEY = 'cpp_exam_teacher_authed'

type Page = 'home' | 'exam' | 'result' | 'teacher' | 'records'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [studentName, setStudentName] = useState('')
  const [exam, setExam] = useState<Exam | null>(null)
  const [result, setResult] = useState<ExamResult | null>(null)

  // 教师权限：本次会话内验证过即可（关浏览器后需重新输入）
  const [teacherAuthed, setTeacherAuthed] = useState(
    () => sessionStorage.getItem(TEACHER_AUTH_KEY) === '1'
  )
  const [showTeacherLogin, setShowTeacherLogin] = useState(false)
  const [teacherPwd, setTeacherPwd] = useState('')
  const [pwdError, setPwdError] = useState<string | null>(null)

  const startExam = useCallback((name: string, selectedExam: Exam) => {
    setStudentName(name)
    setExam(selectedExam)
    setPage('exam')
  }, [])

  const finishExam = useCallback((examResult: ExamResult) => {
    setResult(examResult)
    setPage('result')
  }, [])

  const backToHome = useCallback(() => {
    setPage('home')
    setResult(null)
  }, [])

  // 教师入口：已验证直接进，未验证弹口令框
  const tryEnterTeacher = useCallback(() => {
    if (teacherAuthed) {
      setPage('teacher')
    } else {
      setTeacherPwd('')
      setPwdError(null)
      setShowTeacherLogin(true)
    }
  }, [teacherAuthed])

  const confirmTeacherPwd = useCallback(() => {
    if (teacherPwd === TEACHER_PASSWORD) {
      sessionStorage.setItem(TEACHER_AUTH_KEY, '1')
      setTeacherAuthed(true)
      setShowTeacherLogin(false)
      setTeacherPwd('')
      setPage('teacher')
    } else {
      setPwdError('口令不正确，请重试')
    }
  }, [teacherPwd])

  return (
    <>
      {page === 'home' && (
        <HomePage
          onStart={startExam}
          onTeacher={tryEnterTeacher}
          onRecords={() => setPage('records')}
        />
      )}
      {page === 'exam' && exam && (
        <ExamPage exam={exam} studentName={studentName} onFinish={finishExam} onExit={backToHome} />
      )}
      {page === 'result' && result && exam && (
        <ResultPage result={result} exam={exam} onBack={backToHome} />
      )}
      {page === 'teacher' && <TeacherPage onBack={backToHome} />}
      {page === 'records' && <RecordsPage onBack={backToHome} />}

      {/* 教师口令验证弹窗 */}
      <Modal
        title={
          <span>
            <LockOutlined className="mr-2" />
            教师验证
          </span>
        }
        open={showTeacherLogin}
        onOk={confirmTeacherPwd}
        onCancel={() => setShowTeacherLogin(false)}
        okText="进入"
        cancelText="取消"
        okButtonProps={{ icon: <LockOutlined /> }}
        destroyOnClose
      >
        <div className="py-2">
          <Text type="secondary" className="block mb-3">
            「教师查看成绩」仅限老师使用，请输入教师口令
          </Text>
          <Input.Password
            size="large"
            placeholder="请输入教师口令"
            prefix={<LockOutlined style={{ color: '#1677ff' }} />}
            value={teacherPwd}
            onChange={(e) => {
              setTeacherPwd(e.target.value)
              setPwdError(null)
            }}
            onPressEnter={confirmTeacherPwd}
            status={pwdError ? 'error' : undefined}
            autoFocus
          />
          {pwdError && (
            <Text type="danger" className="block mt-2">
              {pwdError}
            </Text>
          )}
          <Text type="secondary" className="block mt-3 text-xs">
            验证一次后本次会话内不用重复输入；关闭浏览器后需重新验证
          </Text>
        </div>
      </Modal>
    </>
  )
}
