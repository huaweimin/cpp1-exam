import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FixedSizeList as VirtualList } from 'react-window'
import { Card, Button, Space, Typography, Tag, Divider, Select, Segmented, Input, Empty } from 'antd'
import {
  PlayCircleOutlined,
  BarChartOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { allExams } from '../data/exams'
import type { Exam, ExamCategory } from '../types/exam'
import { useAuth } from '../App'

const { Title, Text } = Typography

const CATEGORY_LABEL: Record<ExamCategory, string> = {
  real: '真题',
  mock: '模拟卷',
}

// 虚拟列表单行高度：卡片 76px + 固定间距 8px，保持两端平台一致
const ROW_HEIGHT = 84

// 动态测量容器高度，使列表随浏览器视口高度自适应填充
function useElementHeight(ref: React.RefObject<HTMLElement>) {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setHeight(el.getBoundingClientRect().height)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return height
}

export default function HomePage() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const user = auth!.user

  const [selectedExam, setSelectedExam] = useState<Exam | null>(allExams[0] || null)
  const [yearFilter, setYearFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<ExamCategory | 'all'>('all')
  const [keyword, setKeyword] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // 列表容器高度随视口自适应
  const listRef = useRef<HTMLDivElement>(null)
  const listHeight = useElementHeight(listRef)

  // 从 examDate 派生年份，并生成可选项
  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(allExams.map((e) => e.examDate.slice(0, 4)))).sort((a, b) => b.localeCompare(a))
    return [{ value: 'all', label: '全部年份' }, ...years.map((y) => ({ value: y, label: `${y} 年` }))]
  }, [])

  const filteredExams = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return allExams.filter((exam) => {
      if (yearFilter !== 'all' && !exam.examDate.startsWith(yearFilter)) return false
      if (categoryFilter !== 'all' && exam.category !== categoryFilter) return false
      if (kw && !exam.name.toLowerCase().includes(kw)) return false
      return true
    })
  }, [yearFilter, categoryFilter, keyword])

  // 若所有试卷的分数/时长一致，则抽成顶部一行全局说明（移动端显示）
  const scoreInfo = useMemo(() => {
    const sample = allExams[0]
    if (!sample) return null
    const allSame = allExams.every(
      (e) =>
        e.totalScore === sample.totalScore &&
        e.passingScore === sample.passingScore &&
        e.duration === sample.duration,
    )
    return allSame
      ? `每套试卷满分 ${sample.totalScore} 分，及格 ${sample.passingScore} 分，限时 ${sample.duration} 分钟`
      : null
  }, [])

  // 当前已激活的筛选条件（用于移动端折叠时展示 chips）
  const activeChips: string[] = []
  if (yearFilter !== 'all') activeChips.push(yearOptions.find((y) => y.value === yearFilter)?.label ?? yearFilter)
  if (categoryFilter !== 'all') activeChips.push(CATEGORY_LABEL[categoryFilter])
  if (keyword.trim()) activeChips.push(`"${keyword.trim()}"`)

  const handleStart = () => {
    if (selectedExam) {
      navigate(`/exam/${selectedExam.id}`)
    }
  }

  const renderExamCard = (exam: Exam) => {
    const selected = selectedExam?.id === exam.id
    return (
      <Card
        size="small"
        className={`cursor-pointer border-2 transition-[transform,border-color] duration-150 active:scale-[0.97] ${selected ? 'border-blue-500' : 'border-gray-200'}`}
        onClick={() => setSelectedExam(exam)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Tag color={exam.category === 'real' ? 'red' : 'purple'} className="!mr-0">
              {CATEGORY_LABEL[exam.category]}
            </Tag>
            <Text strong className="text-sm leading-snug truncate sm:text-base">{exam.name}</Text>
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <Text type="secondary" className="text-xs">
              单选 {exam.singleChoice.length} · 判断 {exam.trueFalse.length} · 编程 {exam.programming.length} 题
            </Text>
            {/* 分数与时长仅在桌面端显示，避免移动端拥挤 */}
            <Text type="secondary" className="hidden whitespace-nowrap text-xs sm:block">
              {exam.totalScore}分 · {exam.duration}分钟
            </Text>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-dvh flex flex-col px-4 py-6 sm:p-6" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="w-full max-w-3xl flex-1 min-h-0 flex flex-col mx-auto">
        {/* 标题 */}
        <div className="text-center mb-3 sm:mb-6">
          <h1 className="text-xl font-bold text-white mb-1 sm:text-2xl sm:mb-2 lg:text-4xl">C++ 一级在线考试系统</h1>
          <p className="text-white/80 text-xs sm:text-sm sm:text-lg hidden sm:block">青少年软件编程等级考试 · 模拟训练平台</p>
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-white text-xs">
            <UserOutlined />
            <span>{user.username}</span>
            <Tag color={user.role === 'teacher' ? 'gold' : 'blue'} className="!mr-0 text-[10px]">
              {user.role === 'teacher' ? '教师' : '学生'}
            </Tag>
          </div>
        </div>

        {/* 考试卡片（自适应占据剩余视口高度） */}
        <Card
          className="shadow-2xl flex-1 min-h-0 flex flex-col"
          variant="borderless"
          classNames={{ body: 'flex-1 min-h-0 flex flex-col' }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <Title level={4} className="!mb-0">选择考试</Title>
            {/* 移动端：筛选折叠按钮 */}
            <Button
              size="small"
              icon={<FilterOutlined />}
              onClick={() => setShowFilters((v) => !v)}
              className="sm:hidden"
            >
              筛选 {activeChips.length > 0 && `(${activeChips.length})`}
              {showFilters ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </div>

          {/* 筛选栏：移动端可折叠，桌面端常显 */}
          <div className={showFilters ? '' : 'hidden sm:block'}>
            <Space direction="vertical" className="w-full" size="small">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select
                  value={yearFilter}
                  onChange={setYearFilter}
                  options={yearOptions}
                  className="w-full sm:w-40"
                />
                <Segmented
                  value={categoryFilter}
                  onChange={(v) => setCategoryFilter(v as ExamCategory | 'all')}
                  options={[
                    { label: '全部', value: 'all' },
                    { label: '真题', value: 'real' },
                    { label: '模拟卷', value: 'mock' },
                  ]}
                  className="w-full sm:w-auto"
                />
                <Input
                  allowClear
                  prefix={<SearchOutlined />}
                  placeholder="搜索试卷名称"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full sm:flex-1"
                />
              </div>
              {/* 移动端折叠态：已选条件 chips */}
              {activeChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 sm:hidden">
                  {activeChips.map((c) => (
                    <Tag key={c} color="blue" className="!m-0">{c}</Tag>
                  ))}
                </div>
              )}
              <Text type="secondary" className="text-xs">
                共 {filteredExams.length} 套试卷
                {selectedExam && (
                  <span> · 已选：<span className="text-blue-600 font-medium">{selectedExam.name}</span></span>
                )}
              </Text>
            </Space>
          </div>

          <Divider className="!my-3" />

          {/* 移动端全局分数说明（桌面端卡片已含，故隐藏） */}
          {scoreInfo && (
            <Text type="secondary" className="text-xs mb-2 block sm:hidden">{scoreInfo}</Text>
          )}

          {/* 虚拟滚动列表：高度随视口自适应 */}
          <div ref={listRef} className="flex-1 min-h-0">
            {filteredExams.length === 0 ? (
              <Empty description="没有符合条件的试卷" className="py-10" />
            ) : listHeight > 0 ? (
              <VirtualList
                height={listHeight}
                itemCount={filteredExams.length}
                itemSize={ROW_HEIGHT}
                width="100%"
              >
                {({ index, style }) => (
                  <div style={style} className="pb-2">
                    {renderExamCard(filteredExams[index])}
                  </div>
                )}
              </VirtualList>
            ) : null}
          </div>

          <Divider />

          <Button
            type="primary"
            size="large"
            block
            icon={<PlayCircleOutlined />}
            onClick={handleStart}
            disabled={!selectedExam}
          >
            开始考试
          </Button>
        </Card>

        {/* 底部按钮：移动端和桌面端都可见，移动端做成紧凑的小按钮组 */}
        <div className="mt-3 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button
            type="text"
            size="middle"
            icon={<HistoryOutlined />}
            onClick={() => navigate('/records')}
            className="!text-white/90 hover:!text-white !px-2"
          >
            <span className="text-xs sm:text-sm">我的练习记录</span>
          </Button>
          {user.role === 'teacher' && (
            <Button
              type="text"
              size="middle"
              icon={<BarChartOutlined />}
              onClick={() => navigate('/teacher')}
              className="!text-white/90 hover:!text-white !px-2"
            >
              <span className="text-xs sm:text-sm">教师查看成绩</span>
            </Button>
          )}
          <Button
            type="text"
            size="middle"
            icon={<LogoutOutlined />}
            onClick={logout}
            className="!text-white/90 hover:!text-white !px-2"
          >
            <span className="text-xs sm:text-sm">退出登录</span>
          </Button>
        </div>

        {/* 个人信息 footer：移动端仅保留一行最简信息，避免挤占底部按钮空间 */}
        <footer className="mt-4 sm:mt-8 text-center text-white/70 text-[10px] leading-5 sm:text-xs sm:leading-6">
          <div className="sm:hidden">华老师 · 珠海横琴 © 2026</div>
          <div className="hidden sm:block">
            <div>开发维护：华老师</div>
            <div>邮箱：huaweimin@yeah.net</div>
            <div>珠海 · 横琴 © 2026 C++ 一级在线考试系统</div>
          </div>
        </footer>
      </div>
    </div>
  )
}
