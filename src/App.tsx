import { useState, useCallback, useEffect } from 'react'
import type { Exam, ExamResult } from './types/exam'
import type { AuthUser, LoginResult } from './utils/cloudSync'
import { getStoredAuth, storeAuth, verifyAuth, logoutAccount, clearAuth } from './utils/cloudSync'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import TeacherPage from './pages/TeacherPage'
import RecordsPage from './pages/RecordsPage'

type Page = 'home' | 'exam' | 'result' | 'teacher' | 'records'

export default function App() {
  // 登录态（localStorage 持久化）
  const [auth, setAuth] = useState<{ token: string; user: AuthUser } | null>(() => getStoredAuth())
  const [page, setPage] = useState<Page>('home')
  const [exam, setExam] = useState<Exam | null>(null)
  const [result, setResult] = useState<ExamResult | null>(null)

  // 启动时校验登录态是否仍有效（token 过期/被注销则清除）
  useEffect(() => {
    if (!auth) return
    let cancelled = false
    verifyAuth(auth.token).then((user) => {
      if (cancelled) return
      if (!user) {
        clearAuth()
        setAuth(null)
      } else if (user.role !== auth.user.role) {
        // 角色信息以服务器为准
        setAuth((prev) => (prev ? { ...prev, user } : prev))
      }
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = useCallback((loginResult: LoginResult) => {
    storeAuth(loginResult)
    setAuth({ token: loginResult.token, user: { username: loginResult.username, role: loginResult.role } })
    setPage('home')
  }, [])

  const handleLogout = useCallback(() => {
    if (auth) logoutAccount(auth.token)
    setAuth(null)
    setResult(null)
    setExam(null)
    setPage('home')
  }, [auth])

  const startExam = useCallback(
    (selectedExam: Exam) => {
      if (!auth) return
      setExam(selectedExam)
      setPage('exam')
    },
    [auth]
  )

  const finishExam = useCallback((examResult: ExamResult) => {
    setResult(examResult)
    setPage('result')
  }, [])

  const backToHome = useCallback(() => {
    setPage('home')
    setResult(null)
  }, [])

  // 未登录：显示登录/注册页
  if (!auth) {
    return <AuthPage onLogin={handleLogin} />
  }

  const studentName = auth.user.username

  return (
    <>
      {page === 'home' && (
        <HomePage
          user={auth.user}
          onStart={startExam}
          onTeacher={() => setPage('teacher')}
          onRecords={() => setPage('records')}
          onLogout={handleLogout}
        />
      )}
      {page === 'exam' && exam && (
        <ExamPage exam={exam} studentName={studentName} onFinish={finishExam} onExit={backToHome} />
      )}
      {page === 'result' && result && exam && (
        <ResultPage result={result} exam={exam} onBack={backToHome} token={auth.token} />
      )}
      {page === 'teacher' && <TeacherPage onBack={backToHome} token={auth.token} />}
      {page === 'records' && <RecordsPage onBack={backToHome} token={auth.token} username={studentName} />}
    </>
  )
}
