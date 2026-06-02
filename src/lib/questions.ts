import contentQualityQuestions from "../data/questions/content_quality.json";
import digitalJudgementQuestions from "../data/questions/digital_judgement.json";
import familyCommunicationQuestions from "../data/questions/family_communication.json";
import gameSpendingQuestions from "../data/questions/game_spending.json";
import socialSafetyQuestions from "../data/questions/social_safety.json";
import timeControlQuestions from "../data/questions/time-control.json";
import studentContentQualityQuestions from "../data/student/questions/content-quality.json";
import studentDigitalJudgmentQuestions from "../data/student/questions/digital-judgment.json";
import studentFamilyCommunicationQuestions from "../data/student/questions/family-communication.json";
import studentGameSpendingQuestions from "../data/student/questions/game-spending.json";
import studentSocialSafetyQuestions from "../data/student/questions/social-safety.json";
import studentTimeControlQuestions from "../data/student/questions/time-control.json";

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

export type TestAudience = "parent" | "student";

export const TEST_ANSWERS_STORAGE_KEY = "media-mbti:test-answers";
export const SHUFFLED_QUESTIONS_STORAGE_KEY =
  "media-mbti:shuffled-questions";

export const parentQuestions: Question[] = [
  ...(timeControlQuestions as Question[]),
  ...(contentQualityQuestions as Question[]),
  ...(socialSafetyQuestions as Question[]),
  ...(gameSpendingQuestions as Question[]),
  ...(digitalJudgementQuestions as Question[]),
  ...(familyCommunicationQuestions as Question[]),
];

export const studentQuestions: Question[] = [
  ...(studentTimeControlQuestions as Question[]),
  ...(studentContentQualityQuestions as Question[]),
  ...(studentSocialSafetyQuestions as Question[]),
  ...(studentGameSpendingQuestions as Question[]),
  ...(studentDigitalJudgmentQuestions as Question[]),
  ...(studentFamilyCommunicationQuestions as Question[]),
];

export const questions = parentQuestions;

export function getTestAudience(value?: string | null): TestAudience {
  return value === "student" ? "student" : "parent";
}

export function getQuestionsForAudience(audience: TestAudience): Question[] {
  return audience === "student" ? studentQuestions : parentQuestions;
}

export function getTestAnswersStorageKey(audience: TestAudience) {
  return audience === "student"
    ? `${TEST_ANSWERS_STORAGE_KEY}:student`
    : TEST_ANSWERS_STORAGE_KEY;
}

export function getShuffledQuestionsStorageKey(audience: TestAudience) {
  return audience === "student"
    ? `${SHUFFLED_QUESTIONS_STORAGE_KEY}:student`
    : SHUFFLED_QUESTIONS_STORAGE_KEY;
}
