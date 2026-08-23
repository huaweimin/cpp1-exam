import { useEffect, useMemo, useState } from 'react'
import { Table, Button, Typography, Empty, Card, Tag, Statistic, Row, Col, message } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ExamResult } from '../types/exam'
import { getAllResults, exportResultsToCSV, importResults } from '../utils/storage'
import { pullRecords } from '../utils/cloudSync'

const { Title, Text } = Typography

interface TeacherPageProps {
  onBack: () => void
}

export default function TeacherPage({ onBack }: TeacherPageProps) {
  const [results, setResults] = useState<ExamResult[]>(getAllResults())

  // 进入页面时自动合并云端记录（静默，无 UI 提示）
  useEffect(() => {
    pullRecords()
      .then((cloud) => {
        if (cloud && cloud.length > 0) {
          importResults(cloud)
          setResults(getAllResults())
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
              返回
            </Button>
            <Title level={3} className="!m-0 leading-none">
              成绩管理
            </Title>
          </div>
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
          <Text type="secondary" className="text-xs mt-2 block">
            数据来源：当前浏览器本地记录
          </Text>
        </Card>

        {results.length === 0 ? (
          <Card>
            <Empty description="暂无考试记录，等学生交卷后这里会自动汇总" />
          </Card>
        ) : (
          Object.entries(examGroups).map(([examId, examResults]) => (
            <Card key={examId} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className="!mb-0">
                  {examResults[0].examName}
                </Title>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => exportResultsToCSV(examId, examResults[0].examName)}
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
              />
              <div className="mt-4 flex gap-6 text-sm">
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
