import type { Exam, StudentAnswers, ExamResult, QuestionResult } from '../types/exam';

// 自动批改：客观题（单选+判断）自动判分；编程题标记"待评测"，交卷后由 judge.ts 黑盒判题
export function gradeExam(
  exam: Exam,
  answers: StudentAnswers,
  studentName: string,
  durationSec: number
): ExamResult {
  const details: QuestionResult[] = [];

  // 单选题
  for (const q of exam.singleChoice) {
    const studentAnswer = answers.singleChoice[q.id] || '';
    const isCorrect = studentAnswer === q.answer;
    details.push({
      questionId: q.id,
      type: 'singleChoice',
      studentAnswer,
      correctAnswer: q.answer,
      isCorrect,
      score: isCorrect ? q.score : 0,
      maxScore: q.score,
    });
  }

  // 判断题
  for (const q of exam.trueFalse) {
    const studentAnswer = answers.trueFalse[q.id] || '';
    const isCorrect = studentAnswer === q.answer;
    details.push({
      questionId: q.id,
      type: 'trueFalse',
      studentAnswer,
      correctAnswer: q.answer,
      isCorrect,
      score: isCorrect ? q.score : 0,
      maxScore: q.score,
    });
  }

  // 编程题：交卷时先标记"待评测"，交卷后由 judgeExamProgramming 黑盒判题给分
  for (const q of exam.programming) {
    const studentCode = answers.programming[q.id] || '';
    details.push({
      questionId: q.id,
      type: 'programming',
      studentAnswer: studentCode,
      correctAnswer: '（参考代码见解析）',
      isCorrect: false, // 判题后更新
      score: 0, // 判题后按用例通过比例给分
      maxScore: q.score,
      judgeStatus: 'pending',
      casesPassed: 0,
      casesTotal: q.testCases?.length ?? 0,
      caseDetails: [],
    });
  }

  const totalScore = details.reduce((sum, d) => sum + d.score, 0);

  return {
    studentName,
    examId: exam.id,
    examName: exam.name,
    totalScore,
    maxScore: exam.totalScore,
    passed: totalScore >= exam.passingScore,
    details,
    submittedAt: new Date().toISOString(),
    duration: durationSec,
  };
}

// 统计答题情况
export function getAnswerStats(answers: StudentAnswers, exam: Exam): {
  answered: number;
  total: number;
  unanswered: number[];
} {
  let answered = 0;
  const unanswered: number[] = [];
  const total = exam.singleChoice.length + exam.trueFalse.length + exam.programming.length;

  for (const q of exam.singleChoice) {
    if (answers.singleChoice[q.id]) answered++;
    else unanswered.push(q.id);
  }
  for (const q of exam.trueFalse) {
    if (answers.trueFalse[q.id]) answered++;
    else unanswered.push(q.id);
  }
  for (const q of exam.programming) {
    if (answers.programming[q.id]?.trim()) answered++;
    else unanswered.push(q.id);
  }

  return { answered, total, unanswered };
}
