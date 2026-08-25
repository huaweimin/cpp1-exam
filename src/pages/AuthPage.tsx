import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Input, Button, Tabs, Radio, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons'
import type { LoginResult } from '../utils/cloudSync'
import { loginAccount, registerAccount } from '../utils/cloudSync'

const { Title, Text } = Typography

interface AuthPageProps {
  onLogin: (auth: LoginResult) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const navigate = useNavigate()
  const location = useLocation()
  // 未登录访问受保护页时被重定向过来，登录后跳回来源页面；否则回首页
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [tab, setTab] = useState<'login' | 'register'>('login')

  // 登录表单
  const [loginName, setLoginName] = useState('')
  const [loginPwd, setLoginPwd] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // 注册表单
  const [regName, setRegName] = useState('')
  const [regPwd, setRegPwd] = useState('')
  const [regPwd2, setRegPwd2] = useState('')
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student')
  const [teacherKey, setTeacherKey] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  const handleLogin = async () => {
    const name = loginName.trim()
    if (!name || !loginPwd) {
      message.warning('请输入用户名和密码')
      return
    }
    setLoginLoading(true)
    try {
      const auth = await loginAccount(name, loginPwd)
      message.success(`欢迎回来，${auth.username}`)
      onLogin(auth)
      navigate(from, { replace: true })
    } catch (err) {
      message.error(String(err instanceof Error ? err.message : err))
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async () => {
    const name = regName.trim()
    if (!name) {
      message.warning('请输入用户名')
      return
    }
    if (name.length > 20) {
      message.warning('用户名最长 20 个字符')
      return
    }
    if (regPwd.length < 4) {
      message.warning('密码至少 4 位')
      return
    }
    if (regPwd !== regPwd2) {
      message.warning('两次输入的密码不一致')
      return
    }
    if (regRole === 'teacher' && !teacherKey.trim()) {
      message.warning('注册教师账号需要教师密钥')
      return
    }
    setRegLoading(true)
    try {
      const auth = await registerAccount({
        username: name,
        password: regPwd,
        role: regRole,
        teacherKey: teacherKey.trim() || undefined,
      })
      message.success('注册成功，已自动登录')
      onLogin(auth)
      navigate(from, { replace: true })
    } catch (err) {
      message.error(String(err instanceof Error ? err.message : err))
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-6"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 sm:text-3xl">C++ 一级在线考试系统</h1>
          <p className="text-white/80 text-sm">登录后可进行模拟考试、查看自己的练习记录</p>
        </div>

        <Card bordered={false} className="shadow-2xl">
          <Tabs
            activeKey={tab}
            onChange={(k) => setTab(k as 'login' | 'register')}
            centered
            items={[
              {
                key: 'login',
                label: '登录',
                children: (
                  <div className="space-y-4">
                    <Input
                      size="large"
                      placeholder="用户名"
                      prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      onPressEnter={handleLogin}
                      maxLength={20}
                      autoFocus
                    />
                    <Input.Password
                      size="large"
                      placeholder="密码"
                      prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                      value={loginPwd}
                      onChange={(e) => setLoginPwd(e.target.value)}
                      onPressEnter={handleLogin}
                    />
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<LoginOutlined />}
                      loading={loginLoading}
                      onClick={handleLogin}
                    >
                      登录
                    </Button>
                    <Text type="secondary" className="block text-center text-xs">
                      还没有账号？切换到「注册」创建
                    </Text>
                  </div>
                ),
              },
              {
                key: 'register',
                label: '注册',
                children: (
                  <div className="space-y-4">
                    <Input
                      size="large"
                      placeholder="用户名（建议用真实姓名）"
                      prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      maxLength={20}
                      autoFocus
                    />
                    <Input.Password
                      size="large"
                      placeholder="密码（至少 4 位）"
                      prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                      value={regPwd}
                      onChange={(e) => setRegPwd(e.target.value)}
                    />
                    <Input.Password
                      size="large"
                      placeholder="确认密码"
                      prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                      value={regPwd2}
                      onChange={(e) => setRegPwd2(e.target.value)}
                      onPressEnter={handleRegister}
                    />
                    <div className="flex items-center gap-3">
                      <Text type="secondary" className="whitespace-nowrap text-sm">身份：</Text>
                      <Radio.Group
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as 'student' | 'teacher')}
                      >
                        <Radio value="student">学生</Radio>
                        <Radio value="teacher">教师</Radio>
                      </Radio.Group>
                    </div>
                    {regRole === 'teacher' && (
                      <Input.Password
                        size="large"
                        placeholder="教师注册密钥"
                        prefix={<SafetyOutlined style={{ color: '#faad14' }} />}
                        value={teacherKey}
                        onChange={(e) => setTeacherKey(e.target.value)}
                      />
                    )}
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<UserAddOutlined />}
                      loading={regLoading}
                      onClick={handleRegister}
                    >
                      注册并登录
                    </Button>
                    <Text type="secondary" className="block text-center text-xs">
                      学生注册请使用真实姓名，以便关联你此前的练习记录
                    </Text>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <footer className="text-center mt-8 text-white/60 text-xs leading-6">
          <div>开发维护：华老师 · 前端开发工程师 / C++ 少儿编程教师</div>
          <div>邮箱：huaweimin@yeah.net</div>
          <div>珠海 · 横琴 © 2026 C++ 一级在线考试系统</div>
        </footer>
      </div>
    </div>
  )
}
