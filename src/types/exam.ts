// 题目类型枚举
export type QuestionType = 'singleChoice' | 'trueFalse' | 'programming';

// 单选题 / 判断题
export interface ObjectiveQuestion {
  id: number;
  type: 'singleChoice' | 'trueFalse';
  stem: string;
  code?: string; // 题干中的代码片段
  options?: Record<string, string>; // 单选题选项
  answer: string; // 单选: 'A'/'B'/'C'/'D'  判断: 'A'(正确) / 'B'(错误)
  score: number;
  tags: string[];
  explanation: string;
}

// 编程题
export interface ProgrammingQuestion {
  id: number;
  type: 'programming';
  stem: string;
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  referenceCode: string;
  score: number;
  tags: string[];
  explanation: string;
}

// 考试
export interface Exam {
  id: string;
  name: string;
  examDate: string;
  totalScore: number;
  passingScore: number;
  duration: number; // 分钟
  singleChoice: ObjectiveQuestion[];
  trueFalse: ObjectiveQuestion[];
  programming: ProgrammingQuestion[];
}

// 学生答案
export interface StudentAnswers {
  singleChoice: Record<number, string>; // questionId -> 'A'/'B'/'C'/'D'
  trueFalse: Record<number, string>; // questionId -> 'A'(正确) / 'B'(错误)
  programming: Record<number, string>; // questionId -> 代码文本
}

// 批改结果 - 单题
export interface QuestionResult {
  questionId: number;
  type: QuestionType;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

// 批改结果 - 整卷
export interface ExamResult {
  studentName: string;
  examId: string;
  examName: string;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  details: QuestionResult[];
  submittedAt: string;
  duration: number; // 实际用时（秒）
}

// 所有题目统一接口（用于渲染）
export interface UnifiedQuestion {
  id: number;
  type: QuestionType;
  data: ObjectiveQuestion | ProgrammingQuestion;
}
