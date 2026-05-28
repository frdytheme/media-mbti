"use client";

import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import HomeNavigation from "../../src/components/HomeNavigation";
import {
  questions,
  SHUFFLED_QUESTIONS_STORAGE_KEY,
  TEST_ANSWERS_STORAGE_KEY,
  type Question,
  type StoredAnswer,
} from "../../src/lib/questions";

type AnswerMap = Record<string, StoredAnswer>;

const LEAVE_TEST_MESSAGE =
  "테스트 진행 사항이 초기화될 수 있습니다 이동하시겠습니까?";

function loadStoredAnswers(): AnswerMap {
  if (typeof window === "undefined") {
    return {};
  }

  const storedValue = window.localStorage.getItem(TEST_ANSWERS_STORAGE_KEY);

  if (!storedValue) {
    return {};
  }

  try {
    return JSON.parse(storedValue) as AnswerMap;
  } catch {
    return {};
  }
}

function shuffleQuestions(sourceQuestions: Question[]): Question[] {
  const shuffledQuestions = [...sourceQuestions];

  for (let index = shuffledQuestions.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledQuestions[index], shuffledQuestions[randomIndex]] = [
      shuffledQuestions[randomIndex],
      shuffledQuestions[index],
    ];
  }

  return shuffledQuestions;
}

function loadShuffledQuestions(): Question[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(
    SHUFFLED_QUESTIONS_STORAGE_KEY,
  );

  if (!storedValue) {
    return null;
  }

  try {
    const parsedQuestions = JSON.parse(storedValue) as Question[];
    const hasAllQuestions = parsedQuestions.length === questions.length;

    if (!hasAllQuestions) {
      return null;
    }

    return parsedQuestions;
  } catch {
    return null;
  }
}

function saveShuffledQuestions(nextQuestions: Question[]) {
  window.localStorage.setItem(
    SHUFFLED_QUESTIONS_STORAGE_KEY,
    JSON.stringify(nextQuestions),
  );
}

export default function TestPage() {
  const router = useRouter();
  const hasNavigationGuard = useRef(false);
  const allowNavigation = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const currentQuestion = testQuestions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const progress =
    testQuestions.length > 0
      ? Math.round(((currentIndex + 1) / testQuestions.length) * 100)
      : 0;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === testQuestions.length - 1;

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  useEffect(() => {
    if (answeredCount === 0) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (allowNavigation.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = LEAVE_TEST_MESSAGE;
    }

    function handlePopState() {
      if (allowNavigation.current) {
        return;
      }

      if (window.confirm(LEAVE_TEST_MESSAGE)) {
        allowNavigation.current = true;
        window.history.back();
        return;
      }

      window.history.pushState({ testGuard: true }, "", window.location.href);
    }

    if (!hasNavigationGuard.current) {
      window.history.pushState({ testGuard: true }, "", window.location.href);
      hasNavigationGuard.current = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [answeredCount]);

  useEffect(() => {
    queueMicrotask(() => {
      const shouldRestart =
        new URLSearchParams(window.location.search).get("restart") === "1";
      const nextQuestions =
        shouldRestart || !loadShuffledQuestions()
          ? shuffleQuestions(questions)
          : loadShuffledQuestions();

      if (!nextQuestions) {
        return;
      }

      if (shouldRestart) {
        window.localStorage.removeItem(TEST_ANSWERS_STORAGE_KEY);
        window.history.replaceState(null, "", "/test");
        setAnswers({});
      } else {
        setAnswers(loadStoredAnswers());
      }

      saveShuffledQuestions(nextQuestions);
      setCurrentIndex(0);
      setTestQuestions(nextQuestions);
    });
  }, []);

  function saveAnswers(nextAnswers: AnswerMap) {
    setAnswers(nextAnswers);
    window.localStorage.setItem(
      TEST_ANSWERS_STORAGE_KEY,
      JSON.stringify(nextAnswers),
    );
  }

  function handleSelect(optionId: string, scoreDelta: number) {
    if (!currentQuestion) {
      return;
    }

    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        categoryId: currentQuestion.categoryId,
        selectedOptionId: optionId,
        scoreDelta,
      },
    };

    saveAnswers(nextAnswers);
  }

  function goToPrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goToNext() {
    if (!currentAnswer) {
      return;
    }

    if (isLastQuestion) {
      allowNavigation.current = true;
      router.push("/result");
      return;
    }

    setCurrentIndex((index) => Math.min(testQuestions.length - 1, index + 1));
  }

  function confirmExternalNavigation(event: MouseEvent<HTMLAnchorElement>) {
    if (answeredCount === 0) {
      return;
    }

    if (!window.confirm(LEAVE_TEST_MESSAGE)) {
      event.preventDefault();
      return;
    }

    allowNavigation.current = true;
  }

  if (!currentQuestion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          테스트를 준비하고 있습니다.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 sm:py-12 dark:bg-zinc-950 dark:text-zinc-50">
      <HomeNavigation onNavigate={confirmExternalNavigation} />
      <div className="flex w-full max-w-2xl -translate-y-2 flex-col gap-6 sm:-translate-y-4">
        <header className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <span>
              {currentIndex + 1} / {testQuestions.length}
            </span>
            <span>{progress}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
            aria-label="전체 진행률"
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold leading-8 sm:text-2xl">
            {currentQuestion.question}
          </h1>

          <div className="mt-7 grid gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = currentAnswer?.selectedOptionId === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id, option.scoreDelta)}
                  className={`w-full cursor-pointer rounded-md border px-4 py-3 text-left text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:text-base ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-900"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-blue-700 dark:hover:bg-blue-950"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <footer className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={isFirstQuestion}
            className="h-11 cursor-pointer rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-zinc-300 disabled:hover:bg-transparent disabled:hover:shadow-none dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
          >
            이전
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            응답 {answeredCount}개
          </span>
          <button
            type="button"
            onClick={goToNext}
            disabled={!currentAnswer}
            className="h-11 cursor-pointer rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-blue-600 disabled:hover:shadow-sm"
          >
            {isLastQuestion ? "결과 보기" : "다음"}
          </button>
        </footer>
      </div>
    </main>
  );
}
