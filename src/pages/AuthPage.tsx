import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, Input, Button, Modal, Tabs, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined, QrcodeOutlined, SendOutlined, ZoomInOutlined } from '@ant-design/icons'
import type { LoginResult } from '../utils/cloudSync'
import { loginAccount, submitRegisterApplication } from '../utils/cloudSync'
import { getApplyCooldownRemaining, markApplySubmitted } from '../utils/storage'

const { Title, Text } = Typography

interface AuthPageProps {
  onLogin: (auth: LoginResult) => void
}

/** 管理员微信二维码（静态资源，放 public/ 目录） */
const QRCODE_URL = '/wechat-qrcode.jpg'

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

  // 注册申请弹窗
  const [applyOpen, setApplyOpen] = useState(false)
  const [applyName, setApplyName] = useState('')
  const [applyContact, setApplyContact] = useState('')
  const [applyReason, setApplyReason] = useState('')
  const [applyLoading, setApplyLoading] = useState(false)
  // 二维码加载失败时显示兜底占位
  const [qrFailed, setQrFailed] = useState(false)
  // 居中弹窗：二维码大图 + 申请引导
  const [qrModalOpen, setQrModalOpen] = useState(false)

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

  const openApplyModal = () => {
    setApplyOpen(true)
  }

  const handleApplySubmit = async () => {
    const name = applyName.trim()
    const contact = applyContact.trim()
    const reason = applyReason.trim()
    if (!name) {
      message.warning('请输入期望的用户名')
      return
    }
    if (name.length > 20) {
      message.warning('用户名最长 20 个字符')
      return
    }
    if (!contact) {
      message.warning('请输入联系方式')
      return
    }
    if (!reason) {
      message.warning('请简单填写申请理由')
      return
    }
    const remain = getApplyCooldownRemaining()
    if (remain > 0) {
      message.warning(`请勿频繁提交，请 ${Math.ceil(remain / 60000)} 分钟后再试`)
      return
    }
    setApplyLoading(true)
    try {
      await submitRegisterApplication({ username: name, contact, reason })
      markApplySubmitted()
      message.success('申请已提交，请等待管理员审核（审核通过后会通过微信联系你）')
      setApplyOpen(false)
      setApplyName('')
      setApplyContact('')
      setApplyReason('')
    } catch (err) {
      message.error(String(err instanceof Error ? err.message : err))
    } finally {
      setApplyLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex justify-center items-center px-4 py-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-md xl:max-w-lg">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2 sm:text-3xl xl:text-4xl">C++ 一级在线考试系统</h1>
          <p className="text-white/80 text-sm xl:text-base">登录后可进行模拟考试、查看自己的练习记录</p>
        </div>

        <Card variant="borderless" className="shadow-2xl">
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
                      还没有账号？切换到「注册」提交申请
                    </Text>
                  </div>
                ),
              },
              {
                key: 'register',
                label: '注册',
                children: (
                  <div className="flex flex-col items-center text-center">
                    <Text type="secondary" className="text-sm leading-6 mb-3">
                      新用户注册需先联系管理员，请扫描下方二维码添加微信
                    </Text>

                    {qrFailed ? (
                      <div className="w-40 h-40 sm:w-44 sm:h-44 xl:w-48 xl:h-48 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 mb-2">
                        <QrcodeOutlined className="text-3xl text-gray-300" />
                        <Text type="secondary" className="text-xs">二维码加载失败</Text>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setQrModalOpen(true)}
                        aria-label="点击放大查看管理员微信二维码"
                        className="group relative w-40 h-40 sm:w-44 sm:h-44 xl:w-48 xl:h-48 mb-2 rounded-xl overflow-hidden border-none bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-zoom-in focus:outline-none focus-visible:outline-none"
                      >
                        <img
                          src={QRCODE_URL}
                          alt="管理员微信二维码"
                          className="w-full h-full object-contain"
                          onError={() => setQrFailed(true)}
                        />
                        <span className="absolute inset-0 hidden group-hover:flex items-center justify-center gap-1.5 bg-black/45 text-white text-sm font-medium">
                          <ZoomInOutlined />
                          点击放大查看
                        </span>
                      </button>
                    )}
                    <Text type="secondary" className="text-xs mb-3 text-violet-500">
                      点击二维码可放大，方便扫码添加
                    </Text>

                    <Button
                      size="large"
                      block
                      icon={<SendOutlined />}
                      loading={applyLoading}
                      onClick={openApplyModal}
                      className="!border-none !bg-gradient-to-r !from-violet-500 !to-purple-600 hover:!from-violet-600 hover:!to-purple-700 !text-white !shadow-md transition-shadow hover:!shadow-lg"
                    >
                      已联系，申请注册
                    </Button>
                    <Text type="secondary" className="text-xs mt-2 leading-5">
                      提交申请后由管理员审核，审核通过并开通账号后即可登录
                    </Text>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        <footer className="text-center mt-5 text-white/60 text-xs leading-5">
          <div>开发维护：华老师</div>
          <div>邮箱：huaweimin@yeah.net</div>
          <div>© 2026 C++ 一级在线考试系统</div>
        </footer>

        {/* 注册申请表单弹窗 */}
        <Modal
          title="申请注册"
          open={applyOpen}
          onCancel={() => setApplyOpen(false)}
          centered
          width="min(92vw, 420px)"
          footer={[
            <Button key="cancel" onClick={() => setApplyOpen(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={applyLoading}
              onClick={handleApplySubmit}
              className="!border-none !bg-gradient-to-r !from-violet-500 !to-purple-600 hover:!from-violet-600 hover:!to-purple-700"
            >
              提交申请
            </Button>,
          ]}
        >
          <div className="space-y-4 pt-2 pb-3">
            <div>
              <Text type="secondary" className="text-xs mb-1 block">期望用户名（建议用真实姓名，最长 20 字符）</Text>
              <Input
                placeholder="如：张三"
                prefix={<UserOutlined style={{ color: '#1677ff' }} />}
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                maxLength={20}
              />
            </div>
            <div>
              <Text type="secondary" className="text-xs mb-1 block">联系方式（手机号 / 微信号）</Text>
              <Input
                placeholder="方便管理员与你确认开通"
                value={applyContact}
                onChange={(e) => setApplyContact(e.target.value)}
                maxLength={50}
              />
            </div>
            <div>
              <Text type="secondary" className="text-xs mb-1 block">申请理由（最长 200 字符）</Text>
              <Input.TextArea
                placeholder="如：备战 2026 年 3 月 C++ 一级考试"
                rows={3}
                value={applyReason}
                onChange={(e) => setApplyReason(e.target.value)}
                maxLength={200}
                showCount
              />
            </div>
          </div>
        </Modal>

        {/* 联系管理员弹窗：大二维码 + 申请动线 */}
        <Modal
          title="联系管理员 · 申请注册"
          open={qrModalOpen}
          onCancel={() => setQrModalOpen(false)}
          centered
          width="min(92vw, 440px)"
          maskClosable
          styles={{ body: { maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' } }}
          footer={
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button className="w-full sm:w-auto" onClick={() => setQrModalOpen(false)}>
                稍后再说
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={() => {
                  setQrModalOpen(false)
                  openApplyModal()
                }}
                className="w-full sm:w-auto !border-none !bg-gradient-to-r !from-violet-500 !to-purple-600 hover:!from-violet-600 hover:!to-purple-700"
              >
                我已添加，下一步申请注册
              </Button>
            </div>
          }
        >
          <div className="flex flex-col items-center text-center pt-2">
            <Text strong className="mb-1">微信扫码添加管理员</Text>
            <Text type="secondary" className="text-xs mb-4">添加好友时请备注「考试系统注册」</Text>

            {qrFailed ? (
              <div className="w-[min(72vw,288px)] h-[min(72vw,288px)] rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
                <QrcodeOutlined className="text-4xl text-gray-300" />
                <Text type="secondary" className="text-xs">二维码加载失败</Text>
              </div>
            ) : (
              <div className="w-[min(72vw,288px)] h-[min(72vw,288px)] rounded-xl overflow-hidden bg-white shadow-sm">
                <img src={QRCODE_URL} alt="管理员微信二维码（大图）" className="w-full h-full object-contain" />
              </div>
            )}
            <Text type="secondary" className="text-xs mt-3">手机可长按二维码保存后，用微信「扫一扫」识别</Text>

            <div className="w-full mt-4 text-left bg-violet-50 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 shrink-0 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-medium">1</span>
                <Text className="text-sm !text-gray-700">扫描二维码添加管理员微信</Text>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 shrink-0 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-medium">2</span>
                <Text className="text-sm !text-gray-700">管理员审核通过后为你开通账号</Text>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 shrink-0 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-medium">3</span>
                <Text className="text-sm !text-gray-700">回到登录页，用申请的用户名密码登录</Text>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
