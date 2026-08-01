export type Severity = "CRITICAL" | "HIGH" | "MEDIUM";

export type Category = "Ground school" | "Exams" | "Flying" | "Radio" | "Momentum";

export type Problem = {
  n: number;
  title: string;
  body: string;
  fix: string;
  severity: Severity;
  category: Category;
};

export const WHY_H1: [string, string];
export const WHY_INTRO: string;
export const PROBLEMS: Problem[];
export const CATEGORIES: Category[];
