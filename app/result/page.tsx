"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import ResultRadarChart from "../../src/components/ResultRadarChart";
import categories from "../../src/data/categories.json";
import { calculateCategoryScores } from "../../src/lib/scoring";
import {
  TEST_ANSWERS_STORAGE_KEY,
  type StoredAnswer,
} from "../../src/lib/questions";

type Category = {
  id: string;
  name: string;
};

type AnswerMap = Record<string, StoredAnswer>;

const PREVIEW_SCORES: Record<string, number> = {
  time_control: 82,
  content_quality: 74,
  social_safety: 91,
  game_spending: 68,
  digital_judgment: 79,
  family_communication: 86,
};

function loadStoredAnswers(): StoredAnswer[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(TEST_ANSWERS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    return Object.values(JSON.parse(storedValue) as AnswerMap);
  } catch {
    return [];
  }
}

export default function ResultPage() {
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const categoryIds = (categories as Category[]).map((category) => category.id);
  const hasStoredAnswers = answers.length > 0;
  const scores = hasStoredAnswers
    ? calculateCategoryScores(answers, categoryIds)
    : PREVIEW_SCORES;
  const totalScore = categoryIds.reduce(
    (sum, categoryId) => sum + (scores[categoryId] ?? 0),
    0,
  );
  const maxTotalScore = categoryIds.length * 100;

  useEffect(() => {
    queueMicrotask(() => {
      setAnswers(loadStoredAnswers());
    });
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Media MBTI Result
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">진단 결과</h1>
        </header>

        <ResultRadarChart scores={scores} />
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {!hasStoredAnswers ? (
            <p className="mb-4 text-sm font-medium text-amber-600 dark:text-amber-400">
              임시 미리보기 점수입니다.
            </p>
          ) : null}
          <div className="flex items-baseline justify-end gap-3 text-right">
            <p className="text-2xl font-bold tracking-normal text-blue-600 dark:text-blue-400">
              총점
            </p>
            <p className="text-3xl font-bold tracking-normal text-zinc-950 sm:text-4xl dark:text-zinc-50">
              {totalScore}
              <span className="ml-1.5 text-lg font-semibold text-zinc-500 sm:text-xl dark:text-zinc-400">
                / {maxTotalScore}점
              </span>
            </p>
          </div>
        </section>
        <div className="flex justify-end">
          <Link
            href="/test"
            className="inline-flex h-11 cursor-pointer items-center rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            다시 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
