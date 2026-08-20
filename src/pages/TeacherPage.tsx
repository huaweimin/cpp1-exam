import { Table, Button, Typography, Empty, Card, Tag } from 'antd'
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ExamResult } from '../types/exam'
import { getAllResults, exportResultsToCSV } from '../utils/storage'
import { useState } from 'react'

const { Title, Text } = Typography

interface TeacherPageProps {
  onBack: () => void
}

export default function TeacherPage({ onBack }: TeacherPageProps) {
  const [results] = useState<ExamResult[]>(getAllResults())

  // 按考试分组
  const examGroups = results.reduce((acc, r) => {
    if (!acc[r.examId]) acc[r.examId] = []
    acc[r.examId].push(r)
    return acc
  }, {} as Record<string, ExamResult[]>)

  const columns = [
    {
      title: '姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '客观题得分',
      key: 'objectiveScore',
      render: (_: any, record: ExamResult) => {
        const objective = record.details.filter((d) => d.type !== 'programming')
        const earned = objective.reduce((s, d) => s + d.score, 0)
        const max = objective.reduce((s, d) => s + d.maxScore, 0)
        return `${earned} / ${max}`
      },
    },
    {
      title: '总分',
      key: 'totalScore',
      render: (_: any, record: ExamResult) => (
        <span className={`font-bold ${record.passed ? 'text-green-600' : 'text-red-500'}`}>
          {record.totalScore} / {record.maxScore}
        </span>
      ),
    },
    {
      title: '是否及格',
      key: 'passed',
      render: (_: any, record: ExamResult) =>
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
      render: (_: any, record: ExamResult) => `${(record.duration / 60).toFixed(1)} 分钟`,
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
            <Title level={3} className="!mb-0">成绩管理</Title>
          </div>
        </div>

        {results.length === 0 ? (
          <Card>
            <Empty description="暂无考试记录" />
          </Card>
        ) : (
          Object.entries(examGroups).map(([examId, examResults]) => (
            <Card key={examId} className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className="!mb-0">{examResults[0].examName}</Title>
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
                <Text type="secondary">
                  参考人数：{examResults.length}
                </Text>
                <Text type="secondary">
                  及格人数：{examResults.filter((r) => r.passed).length}
                </Text>
                <Text type="secondary">
                  平均分：{(examResults.reduce((s, r) => s + r.totalScore, 0) / examResults.length).toFixed(1)}
                </Text>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
