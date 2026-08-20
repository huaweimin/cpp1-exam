import { useState, useCallback } from 'react'
import type { Exam, ExamResult } from './types/exam'
import HomePage from './pages/HomePage'
import ExamPage from './pages/ExamPage'
import ResultPage from './pages/ResultPage'
import TeacherPage from './pages/TeacherPage'

type Page = 'home' | 'exam' | 'result' | 'teacher'

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [studentName, setStudentName] = useState('')
  const [exam, setExam] = useState<Exam | null>(null)
  const [result, setResult] = useState<ExamResult | null>(null)

  const startExam = useCallback((name: string, selectedExam: Exam) => {
    setStudentName(name)
    setExam(selectedExam)
    setPage('exam')
  }, [])

  const finishExam = useCallback((examResult: ExamResult) => {
    setResult(examResult)
    setPage('result')
  }, [])

  const backToHome = useCallback(() => {
    setPage('home')
    setResult(null)
  }, [])

  return (
    <>
      {page === 'home' && <HomePage onStart={startExam} onTeacher={() => setPage('teacher')} />}
      {page === 'exam' && exam && (
        <ExamPage exam={exam} studentName={studentName} onFinish={finishExam} onExit={backToHome} />
      )}
      {page === 'result' && result && exam && (
        <ResultPage result={result} exam={exam} onBack={backToHome} />
      )}
      {page === 'teacher' && <TeacherPage onBack={backToHome} />}
    </>
  )
}
