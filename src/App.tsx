import { useState, useCallback, useEffect, useContext, createContext, useMemo } from 'react'
import type { ReactElement } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import type { AuthUser, LoginResult } from './utils/cloudSync'
import { getStoredAuth, storeAuth, verifyAuth, logoutAccount, clearAuth } from './utils/cloudSync'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import TeacherPage from './pages/TeacherPage'
import RecordsPage from './pages/RecordsPage'

interface AuthState {
  token: string
  user: AuthUser
}

interface AuthContextValue {
  auth: AuthState | null
  login: (loginResult: LoginResult) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  auth: null,
  login: () => {},
  logout: () => {},
})

/** 获取登录态（RequireAuth 守卫内调用，非空） */
export function useAuth() {
  return useContext(AuthContext)
}

/** 登录守卫：未登录跳转到 /login，并记录来源页面用于登录后回跳 */
function RequireAuth({ children }: { children: ReactElement }) {
  const { auth } = useAuth()
  const location = useLocation()
  if (!auth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

export default function App() {
  // 登录态（localStorage 持久化）
  const [auth, setAuth] = useState<AuthState | null>(() => getStoredAuth())
  const location = useLocation()
  const navigate = useNavigate()

  // 路由切换时回到顶部，避免继承上一页的滚动位置
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // 启动时校验登录态是否仍有效（token 过期/被注销则清除）
  useEffect(() => {
    if (!auth) return
    let cancelled = false
    verifyAuth(auth.token).then((user) => {
      if (cancelled) return
      if (!user) {
        clearAuth()
        setAuth(null)
        navigate('/login', { replace: true })
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

  const login = useCallback((loginResult: LoginResult) => {
    storeAuth(loginResult)
    setAuth({ token: loginResult.token, user: { username: loginResult.username, role: loginResult.role } })
  }, [])

  const logout = useCallback(() => {
    if (auth) logoutAccount(auth.token)
    setAuth(null)
    navigate('/login', { replace: true })
  }, [auth, navigate])

  const authValue = useMemo(() => ({ auth, login, logout }), [auth, login, logout])

  return (
    <AuthContext.Provider value={authValue}>
      <Routes>
        {/* 已登录访问登录页 → 直接回首页 */}
        <Route
          path="/login"
          element={auth ? <Navigate to="/" replace /> : <AuthPage onLogin={login} />}
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/exam/:examId"
          element={
            <RequireAuth>
              <ExamPage />
            </RequireAuth>
          }
        />
        <Route
          path="/result"
          element={
            <RequireAuth>
              <ResultPage />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher"
          element={
            <RequireAuth>
              <TeacherPage />
            </RequireAuth>
          }
        />
        <Route
          path="/records"
          element={
            <RequireAuth>
              <RecordsPage />
            </RequireAuth>
          }
        />
        {/* 未知路径 → 首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
