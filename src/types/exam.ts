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

// 编程题测试用例（黑盒判题：stdin = input，比对程序输出与 expected）
export interface TestCase {
  input: string;
  output: string; // 期望输出
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
  testCases: TestCase[]; // 判题用例（样例 + 边界，隐藏对学生）
  score: number;
  tags: string[];
  explanation: string;
}

// 试卷类型：真题 / 模拟卷
export type ExamCategory = 'real' | 'mock';

// 考试
export interface Exam {
  id: string;
  name: string;
  category: ExamCategory; // 真题 'real' / 模拟卷 'mock'
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

// 编程题判题状态
export type JudgeStatus = 'pending' | 'done' | 'error';

// 单个用例的判题对比详情（结果页展示给学生）
export interface CaseDetail {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
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
  // 编程题判题附加信息
  judgeStatus?: JudgeStatus;
  casesPassed?: number;
  casesTotal?: number;
  caseDetails?: CaseDetail[];
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
