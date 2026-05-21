import contentQualityQuestions from "../data/questions/content_quality.json";
import digitalJudgementQuestions from "../data/questions/digital_judgement.json";
import familyCommunicationQuestions from "../data/questions/family_communication.json";
import gameSpendingQuestions from "../data/questions/game_spending.json";
import socialSafetyQuestions from "../data/questions/social_safety.json";
import timeControlQuestions from "../data/questions/time-control.json";

export type QuestionOption = {
  id: string;
  label: string;
  scoreDelta: number;
};

export type Question = {
  id: string;
  order: number;
  categoryId: string;
  question: string;
  options: QuestionOption[];
};

export type StoredAnswer = {
  questionId: string;
  categoryId: string;
  selectedOptionId: string;
  scoreDelta: number;
};

export const TEST_ANSWERS_STORAGE_KEY = "media-mbti:test-answers";
export const SHUFFLED_QUESTIONS_STORAGE_KEY =
  "media-mbti:shuffled-questions";

export const questions: Question[] = [
  ...(timeControlQuestions as Question[]),
  ...(contentQualityQuestions as Question[]),
  ...(socialSafetyQuestions as Question[]),
  ...(gameSpendingQuestions as Question[]),
  ...(digitalJudgementQuestions as Question[]),
  ...(familyCommunicationQuestions as Question[]),
];
