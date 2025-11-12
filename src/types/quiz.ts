export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizData {
  province: string;
  questions: Question[];
}
