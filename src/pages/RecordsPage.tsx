import { useEffect, useMemo, useState } from 'react'
import {
  Button, Card, Input, Typography, Empty, Tag, Statistic, Row, Col, Collapse, Select,
} from 'antd'
import {
  ArrowLeftOutlined, UserOutlined, TrophyOutlined, CloudOutlined, FileSearchOutlined,
} from '@ant-design/icons'
import type { Exam, ExamResult } from '../types/exam'
import { allExams } from '../data/exams'
import { getResultsByStudent, getAllStudentNames, importResults } from '../utils/storage'
import { pullRecords } from '../utils/gistSync'
import RecordDetail from '../components/RecordDetail'

const { Title, Text } = Typography

interface RecordsPageProps {
  onBack: () => void
}

export default function RecordsPage({ onBack }: RecordsPageProps) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState(0)
  const [cloudSyncing, setCloudSyncing] = useState(false)
  const [cloudMsg, setCloudMsg] = useState<string | null>(null)
  // 当前正在查看完整试卷的历史记录，null = 显示列表
  const [viewing, setViewing] = useState<ExamResult | null>(null)

  const allNames = useMemo(() => getAllStudentNames(), [version])

  // 本地 + 云端合并后的记录
  const [records, setRecords] = useState<ExamResult[]>([])

  // 拉取云端记录并合并到本地
  const syncFromCloud = async () => {
    setCloudSyncing(true)
    setCloudMsg(null)
    const cloud = await pullRecords()
    if (cloud === null) {
      setCloudMsg('云端暂时连不上（不影响本地记录），稍后再试')
    } else if (cloud.length > 0) {
      const imported = importResults(cloud)
      setCloudMsg(
        imported > 0
          ? `已从云端同步 ${imported} 条记录`
          : '云端没有新记录，已是最新'
      )
    } else {
      setCloudMsg('云端暂无记录')
    }
    setCloudSyncing(false)
    setVersion((v) => v + 1)
  }

  // 进入页面自动同步一次云端
  useEffect(() => {
    if (name.trim()) syncFromCloud()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name])

  useEffect(() => {
    setRecords(name.trim() ? getResultsByStudent(name.trim()) : [])
  }, [name, version])

  const bestScore = records.length > 0 ? Math.max(...records.map((r) => r.totalScore)) : 0
  const passCount = records.filter((r) => r.passed).length
  const avgScore = records.length > 0
    ? Math.round((records.reduce((s, r) => s + r.totalScore, 0) / records.length) * 10) / 10
    : 0

  const findExam = (examId: string): Exam | undefined => allExams.find((e) => e.id === examId)

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return m > 0 ? `${m}分${s}秒` : `${s}秒`
  }

  const scoreColor = (score: number, passed: boolean) => (passed ? '#52c41a' : '#ff4d4f')

  // 查看某次记录的完整试卷（和交卷后的成绩页一样）
  if (viewing) {
    return (
      <RecordDetail
        result={viewing}
        exam={findExam(viewing.examId)}
        onBack={() => setViewing(null)}
      />
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回
          </Button>
          <Title level={3} className="!m-0 leading-none flex-1">
            我的练习记录
          </Title>
          <Button
            icon={<CloudOutlined />}
            onClick={syncFromCloud}
            loading={cloudSyncing}
          >
            同步云端
          </Button>
        </div>

        {/* 姓名查询 */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              size="large"
              placeholder="请输入你的姓名"
              prefix={<UserOutlined />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              allowClear
            />
            {allNames.length > 0 && (
              <Select
                size="large"
                placeholder="或选择历史姓名"
                style={{ minWidth: 160 }}
                value={name || undefined}
                onChange={(val) => setName(val)}
                options={allNames.map((n) => ({ value: n, label: n }))}
              />
            )}
          </div>
          {cloudMsg && (
            <Text type="secondary" className="mt-2 block text-xs">
              {cloudMsg}
            </Text>
          )}
          <Text type="secondary" className="mt-1 block text-xs">
            记录保存在浏览器本地 + 云端（自动合并），换设备也能查到
          </Text>
        </Card>

        {name.trim() === '' ? (
          <Card>
            <Empty description="输入姓名查看你的练习记录" />
          </Card>
        ) : records.length === 0 ? (
          <Card>
            <Empty description="暂无练习记录，先去完成一场考试吧" />
          </Card>
        ) : (
          <>
            {/* 统计卡片 */}
            <Row gutter={16} className="mb-6">
              <Col xs={12} md={6}>
                <Card>
                  <Statistic title="练习次数" value={records.length} suffix="次" />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="最高分"
                    value={bestScore}
                    suffix={`/ ${records[0]?.maxScore ?? 100}`}
                    valueStyle={{ color: '#1677ff' }}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="及格次数"
                    value={passCount}
                    suffix={`/ ${records.length}`}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<TrophyOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic title="平均分" value={avgScore} precision={1} />
                </Card>
              </Col>
            </Row>

            {/* 记录列表（可展开看逐题成绩） */}
            <Card title={`共 ${records.length} 次练习`} extra={<Text type="secondary">点击展开看逐题成绩</Text>}>
              <Collapse
                items={records.map((r, idx) => {
                  const exam = findExam(r.examId)
                  const correctCount = r.details.filter((d) => d.isCorrect).length
                  return {
                    key: idx,
                    label: (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{r.examName}</span>
                        <Tag color={r.passed ? 'success' : 'error'}>
                          {r.totalScore} 分 {r.passed ? '及格' : '未及格'}
                        </Tag>
                        <Tag>{correctCount}/{r.details.length} 题正确</Tag>
                        <Text type="secondary" className="text-xs">
                          {new Date(r.submittedAt).toLocaleString('zh-CN')} · 用时 {formatDuration(r.duration)}
                        </Text>
                      </div>
                    ),
                    children: (
                      <div>
                        {r.details.map((d) => (
                          <div key={d.questionId} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                            <Text>
                              第 {d.questionId} 题
                              <Tag className="ml-2">
                                {d.type === 'singleChoice' ? '单选' : d.type === 'trueFalse' ? '判断' : '编程'}
                              </Tag>
                            </Text>
                            <Text strong style={{ color: d.isCorrect ? '#52c41a' : '#ff4d4f' }}>
                              {d.isCorrect ? '✓ 正确' : `✗ 得 ${d.score}/${d.maxScore} 分`}
                            </Text>
                          </div>
                        ))}
                        <Button
                          type="primary"
                          size="small"
                          className="mt-3"
                          icon={<FileSearchOutlined />}
                          onClick={() => {
                            setViewing(r)
                            window.scrollTo(0, 0)
                          }}
                        >
                          查看完整试卷（含逐题解析）
                        </Button>
                        {exam === undefined && (
                          <Text type="warning" className="block mt-2 text-xs">
                            注：这套试卷已不在系统中，只能查看成绩概览
                          </Text>
                        )}
                      </div>
                    ),
                  }
                })}
              />
            </Card>

            {/* 进步趋势 */}
            {records.length >= 2 && (
              <Card title="成绩趋势（从早到晚）" className="mt-6">
                <div className="flex items-end gap-2 h-32">
                  {[...records].reverse().map((r, i) => {
                    const h = Math.max(8, (r.totalScore / r.maxScore) * 100)
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <Text strong style={{ color: scoreColor(r.totalScore, r.passed) }} className="text-xs">
                          {r.totalScore}
                        </Text>
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${h}%`,
                            background: r.passed ? 'linear-gradient(180deg,#95de64,#52c41a)' : 'linear-gradient(180deg,#ffa39e,#ff4d4f)',
                          }}
                        />
                        <Text type="secondary" className="text-xs whitespace-nowrap">
                          {new Date(r.submittedAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                        </Text>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
