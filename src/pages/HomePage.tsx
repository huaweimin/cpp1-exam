import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Space, Typography, Tag, Divider } from 'antd'
import {
  PlayCircleOutlined,
  BarChartOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { allExams } from '../data/exams'
import { useAuth } from '../App'

const { Title, Text } = Typography

export default function HomePage() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedExam, setSelectedExam] = useState(allExams[0] || null)
  const user = auth!.user

  const handleStart = () => {
    if (selectedExam) {
      navigate(`/exam/${selectedExam.id}`)
    }
  }

  return (
    <div className="min-h-dvh flex justify-center px-4 py-6 sm:p-6" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-3xl my-auto">
        {/* 标题 */}
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 sm:text-4xl">C++ 一级在线考试系统</h1>
          <p className="text-white/80 text-sm sm:text-lg">青少年软件编程等级考试 · 模拟训练平台</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-white text-sm">
            <UserOutlined />
            <span>{user.username}</span>
            <Tag color={user.role === 'teacher' ? 'gold' : 'blue'} className="!mr-0">
              {user.role === 'teacher' ? '教师' : '学生'}
            </Tag>
          </div>
        </div>

        {/* 考试卡片 */}
        <Card className="shadow-2xl" bordered={false}>
          <div className="mb-6">
            <Title level={4}>选择考试</Title>
            <Space direction="vertical" className="w-full" size="middle">
              {allExams.map((exam) => (
                <Card
                  key={exam.id}
                  size="small"
                  className={`cursor-pointer border-2 transition-[transform,border-color] duration-150 active:scale-[0.97] ${selectedExam?.id === exam.id ? 'border-blue-500' : 'border-gray-200'}`}
                  onClick={() => setSelectedExam(exam)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <Text strong className="text-base">{exam.name}</Text>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Tag color="blue">单选 {exam.singleChoice.length} 题</Tag>
                        <Tag color="green">判断 {exam.trueFalse.length} 题</Tag>
                        <Tag color="orange">编程 {exam.programming.length} 题</Tag>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between sm:flex-col sm:items-end">
                      <div className="text-xl font-bold text-gray-800 sm:text-2xl">{exam.totalScore}分</div>
                      <Text type="secondary" className="text-xs sm:text-sm">及格 {exam.passingScore}分 · {exam.duration}分钟</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          </div>

          <Divider />

          <Button
            type="primary"
            size="large"
            block
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
          >
            开始考试
          </Button>
        </Card>

        {/* 底部按钮 */}
        <div className="text-center mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="text"
            icon={<HistoryOutlined />}
            onClick={() => navigate('/records')}
            className="text-white/80 hover:text-white"
          >
            我的练习记录
          </Button>
          {user.role === 'teacher' && (
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => navigate('/teacher')}
              className="text-white/80 hover:text-white"
            >
              教师查看成绩
            </Button>
          )}
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={logout}
            className="text-white/80 hover:text-white"
          >
            退出登录
          </Button>
        </div>

        {/* 个人信息 footer */}
        <footer className="text-center mt-8 text-white/60 text-xs leading-6">
          <div>
            开发维护：华老师 · 前端开发工程师 / C++ 少儿编程教师
          </div>
          <div>
            邮箱：huaweimin@yeah.net
          </div>
          <div>珠海 · 横琴 © 2026 C++ 一级在线考试系统</div>
        </footer>
      </div>
    </div>
  )
}
