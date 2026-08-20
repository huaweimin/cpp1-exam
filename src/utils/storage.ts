import type { StudentAnswers, ExamResult } from '../types/exam';

const STORAGE_PREFIX = 'cpp_exam_';

// 保存答题进度（断线恢复用）
export function saveProgress(examId: string, studentName: string, answers: StudentAnswers): void {
  const key = `${STORAGE_PREFIX}progress_${examId}_${studentName}`;
  localStorage.setItem(key, JSON.stringify({ answers, savedAt: new Date().toISOString() }));
}

// 读取答题进度
export function loadProgress(examId: string, studentName: string): StudentAnswers | null {
  const key = `${STORAGE_PREFIX}progress_${examId}_${studentName}`;
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    return JSON.parse(data).answers as StudentAnswers;
  } catch {
    return null;
  }
}

// 清除进度
export function clearProgress(examId: string, studentName: string): void {
  const key = `${STORAGE_PREFIX}progress_${examId}_${studentName}`;
  localStorage.removeItem(key);
}

// 保存考试结果
export function saveResult(result: ExamResult): void {
  const allResults = getAllResults();
  allResults.push(result);
  localStorage.setItem(`${STORAGE_PREFIX}results`, JSON.stringify(allResults));
}

// 获取所有考试结果
export function getAllResults(): ExamResult[] {
  const data = localStorage.getItem(`${STORAGE_PREFIX}results`);
  if (!data) return [];
  try {
    return JSON.parse(data) as ExamResult[];
  } catch {
    return [];
  }
}

// 获取某场考试的所有结果（教师查看用）
export function getResultsByExam(examId: string): ExamResult[] {
  return getAllResults().filter((r) => r.examId === examId);
}

// 获取某学生的所有成绩（学生练习记录用）
export function getResultsByStudent(studentName: string): ExamResult[] {
  return getAllResults()
    .filter((r) => r.studentName === studentName)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

// 获取所有出现过的学生姓名
export function getAllStudentNames(): string[] {
  const names = new Set(getAllResults().map((r) => r.studentName));
  return Array.from(names).sort();
}

// 导入成绩（成绩码用，自动去重）
export function importResults(results: ExamResult[]): number {
  const existing = getAllResults();
  const keys = new Set(existing.map((r) => `${r.studentName}|${r.examId}|${r.submittedAt}`));
  let imported = 0;
  for (const r of results) {
    const key = `${r.studentName}|${r.examId}|${r.submittedAt}`;
    if (!keys.has(key)) {
      existing.push(r);
      keys.add(key);
      imported++;
    }
  }
  if (imported > 0) {
    localStorage.setItem(`${STORAGE_PREFIX}results`, JSON.stringify(existing));
  }
  return imported;
}

// 删除某条成绩记录
export function deleteResult(studentName: string, examId: string, submittedAt: string): void {
  const all = getAllResults().filter(
    (r) => !(r.studentName === studentName && r.examId === examId && r.submittedAt === submittedAt)
  );
  localStorage.setItem(`${STORAGE_PREFIX}results`, JSON.stringify(all));
}

// 导出成绩为 CSV
export function exportResultsToCSV(examId: string, examName: string): void {
  const results = getResultsByExam(examId);
  if (results.length === 0) {
    alert('暂无成绩数据');
    return;
  }

  const headers = ['姓名', '总分', '满分', '是否及格', '提交时间', '用时(分钟)'];
  const rows = results.map((r) => [
    r.studentName,
    r.totalScore,
    r.maxScore,
    r.passed ? '及格' : '不及格',
    r.submittedAt,
    (r.duration / 60).toFixed(1),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // BOM 头 + CSV
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${examName}_成绩.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
