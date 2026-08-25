import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Typography, Empty, Card, Tag, Statistic, Row, Col, message, Spin } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ExamResult } from '../types/exam'
import { pullRecords } from '../utils/cloudSync'
import { useAuth } from '../App'

const { Title, Text } = Typography

export default function TeacherPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const token = auth!.token
  // 全部成绩记录（唯一数据源：服务器）
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  const loadFromServer = (silent = false) => {
    if (!silent) setLoading(true)
    setLoadFailed(false)
    pullRecords(token)
      .then((list) => {
        if (list) {
          setResults(list)
        } else {
          setLoadFailed(true)
        }
      })
      .finally(() => setLoading(false))
  }

  // 进入页面时从服务器拉取全部记录
  useEffect(() => {
    loadFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // 按考试分组
  const examGroups = useMemo(() => {
    return results.reduce((acc, r) => {
      if (!acc[r.examId]) acc[r.examId] = []
      acc[r.examId].push(r)
      return acc
    }, {} as Record<string, ExamResult[]>)
  }, [results])

  // 全局统计（所有学生所有考试）
  const studentCount = new Set(results.map((r) => r.studentName)).size
  const passRate = results.length > 0
    ? Math.round((results.filter((r) => r.passed).length / results.length) * 100)
    : 0
  const avgScore = results.length > 0
    ? (results.reduce((s, r) => s + r.totalScore, 0) / results.length).toFixed(1)
    : '0'

  // 导出 CSV（从当前服务器数据过滤，不依赖浏览器缓存）
  const exportCSV = (examId: string, examName: string) => {
    const list = results.filter((r) => r.examId === examId)
    if (list.length === 0) {
      message.warning('暂无成绩数据')
      return
    }
    const headers = ['姓名', '总分', '满分', '是否及格', '提交时间', '用时(分钟)']
    const rows = list.map((r) => [
      r.studentName,
      r.totalScore,
      r.maxScore,
      r.passed ? '及格' : '不及格',
      r.submittedAt,
      (r.duration / 60).toFixed(1),
    ])
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${examName}_成绩.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '客观题得分',
      key: 'objectiveScore',
      render: (_: unknown, record: ExamResult) => {
        const objective = record.details.filter((d) => d.type !== 'programming')
        const earned = objective.reduce((s, d) => s + d.score, 0)
        const max = objective.reduce((s, d) => s + d.maxScore, 0)
        return `${earned} / ${max}`
      },
    },
    {
      title: '总分',
      key: 'totalScore',
      render: (_: unknown, record: ExamResult) => (
        <span className={`font-bold ${record.passed ? 'text-green-600' : 'text-red-500'}`}>
          {record.totalScore} / {record.maxScore}
        </span>
      ),
    },
    {
      title: '是否及格',
      key: 'passed',
      render: (_: unknown, record: ExamResult) =>
        record.passed ? <Tag color="green">及格</Tag> : <Tag color="red">不及格</Tag>,
    },
    {
      title: '提交时间',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (val: string) => new Date(val).toLocaleString('zh-CN'),
    },
    {
      title: '用时',
      key: 'duration',
      render: (_: unknown, record: ExamResult) => `${(record.duration / 60).toFixed(1)} 分钟`,
    },
  ]

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
              返回
            </Button>
            <Title level={3} className="!m-0 leading-none">
              成绩管理
            </Title>
          </div>
          <Button icon={<ReloadOutlined />} loading={loading} onClick={() => loadFromServer()}>
            刷新
          </Button>
        </div>

        {/* 全局统计 */}
        <Card className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <Statistic title="学生总数" value={studentCount} suffix="人" />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="练习总次数" value={results.length} suffix="次" />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="及格率" value={passRate} suffix="%" valueStyle={{ color: '#52c41a' }} />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title="平均分" value={avgScore} />
            </Col>
          </Row>
        </Card>

        {loading ? (
          <Card>
            <div className="py-12 text-center">
              <Spin />
              <div className="mt-3 text-gray-400 text-sm">正在加载成绩数据…</div>
            </div>
          </Card>
        ) : loadFailed ? (
          <Card>
            <Empty description="成绩加载失败，请检查网络">
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => loadFromServer()}>
                重新加载
              </Button>
            </Empty>
          </Card>
        ) : results.length === 0 ? (
          <Card>
            <Empty description="暂无考试记录，等学生交卷后这里会自动汇总" />
          </Card>
        ) : (
          Object.entries(examGroups).map(([examId, examResults]) => (
            <Card key={examId} className="mb-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <Title level={4} className="!mb-0 flex-1 min-w-0">
                  {examResults[0].examName}
                </Title>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => exportCSV(examId, examResults[0].examName)}
                >
                  导出 CSV
                </Button>
              </div>
              <Table
                columns={columns}
                dataSource={examResults}
                rowKey={(r) => r.studentName + r.submittedAt}
                pagination={false}
                size="middle"
                scroll={{ x: 'max-content' }}
              />
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <Text type="secondary">参考人次：{examResults.length}</Text>
                <Text type="secondary">及格人次：{examResults.filter((r) => r.passed).length}</Text>
                <Text type="secondary">
                  平均分：
                  {(examResults.reduce((s, r) => s + r.totalScore, 0) / examResults.length).toFixed(1)}
                </Text>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
