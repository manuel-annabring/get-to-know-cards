export interface QuestionGroup {
  id: string; // stable key, kebab-case, e.g. "sweets"
  questions: string[]; // 1 to 3 items, each ends with "?"
}
