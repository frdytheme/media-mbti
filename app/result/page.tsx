"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useRef, useState } from "react";

import HomeNavigation from "../../src/components/HomeNavigation";
import ResultRadarChart from "../../src/components/ResultRadarChart";
import categories from "../../src/data/categories.json";
import contentQualityReport from "../../src/data/reports/content-quality-report.json";
import digitalJudgmentReport from "../../src/data/reports/digital-judgment-report.json";
import familyCommunicationReport from "../../src/data/reports/family-communication-report.json";
import gameSpendingReport from "../../src/data/reports/game-spending-report.json";
import socialSafetyReport from "../../src/data/reports/social-safety-report.json";
import timeControlReport from "../../src/data/reports/time-control-report.json";
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

type ConversationLine = {
  speaker: "parent" | "child";
  text: string;
};

type ConversationExample = {
  title: string;
  resourceLink?: string;
  resourceLinks?: ResourceLink[];
  dialogue: ConversationLine[];
};

type ResourceLink =
  | string
  | {
      label?: string;
      name?: string;
      text?: string;
      title?: string;
      link?: string;
      url?: string;
      href?: string;
    };

type ReportRange = {
  min: number;
  max: number;
  level: string;
  title: string;
  description: string;
  watchPoint: string;
  conversationExamples?: ConversationExample[];
};

type CategoryReport = {
  categoryId: string;
  categoryName: string;
  ranges: ReportRange[];
};

const PREVIEW_SCORES: Record<string, number> = {
  time_control: 82,
  content_quality: 74,
  social_safety: 91,
  game_spending: 68,
  digital_judgment: 79,
  family_communication: 86,
};

const AVAILABLE_REPORTS = [
  timeControlReport as CategoryReport,
  contentQualityReport as CategoryReport,
  socialSafetyReport as CategoryReport,
  gameSpendingReport as CategoryReport,
  digitalJudgmentReport as CategoryReport,
  familyCommunicationReport as CategoryReport,
];

const TEST_RANGE_SCORES: Record<string, number> = {
  stable: 92,
  watch: 77,
  adjustment: 60,
  priority: 35,
};

const LEAVE_RESULT_MESSAGE = "결과 페이지에서 나가시겠습니까?";

function buildPreviewScores(categoryId?: string | null, range?: string | null) {
  if (!categoryId || !range || !TEST_RANGE_SCORES[range]) {
    if (!range || !TEST_RANGE_SCORES[range]) {
      return PREVIEW_SCORES;
    }

    return Object.fromEntries(
      (categories as Category[]).map((category) => [
        category.id,
        TEST_RANGE_SCORES[range],
      ]),
    );
  }

  return {
    ...PREVIEW_SCORES,
    [categoryId]: TEST_RANGE_SCORES[range],
  };
}

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

function findReportRange(report: CategoryReport, score: number) {
  return report.ranges.find(
    (range) => score >= range.min && score <= range.max,
  );
}

function getSpeakerLabel(speaker: ConversationLine["speaker"]) {
  return speaker === "parent" ? "부모" : "아이";
}

function getResourceLinks(example: ConversationExample) {
  const resourceLinks = example.resourceLinks ?? [];
  const normalizedLinks = resourceLinks
    .map((link, index) => {
      if (typeof link === "string") {
        return link ? { href: link, label: `자료 ${index + 1}` } : null;
      }

      const href = link.url || link.href || link.link;

      if (!href) {
        return null;
      }

      return {
        href,
        label:
          link.label || link.title || link.name || link.text || `자료 ${index + 1}`,
      };
    })
    .filter((link): link is { href: string; label: string } => Boolean(link));

  if (normalizedLinks.length > 0) {
    return normalizedLinks;
  }

  return example.resourceLink
    ? [{ href: example.resourceLink, label: "자료 보기" }]
    : [];
}

function splitReportParagraphs(text: string) {
  const sentences: string[] = [];
  let currentSentence = "";
  let isInsideQuote = false;

  for (const character of text.replace(/\s+/g, " ").trim()) {
    currentSentence += character;

    if (character === '"') {
      isInsideQuote = !isInsideQuote;
      continue;
    }

    if (character === "“") {
      isInsideQuote = true;
      continue;
    }

    if (character === "”") {
      isInsideQuote = false;
      continue;
    }

    if (!isInsideQuote && [".", "?", "!", "。", "？", "！"].includes(character)) {
      sentences.push(currentSentence.trim());
      currentSentence = "";
    }
  }

  if (currentSentence.trim()) {
    sentences.push(currentSentence.trim());
  }

  if (sentences.length <= 2) {
    return [text.trim()];
  }

  const paragraphs: string[] = [];

  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return paragraphs;
}

function ReportText({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {splitReportParagraphs(text).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const hasNavigationGuard = useRef(false);
  const allowNavigation = useRef(false);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const [previewScores, setPreviewScores] = useState(PREVIEW_SCORES);
  const categoryIds = (categories as Category[]).map((category) => category.id);
  const hasStoredAnswers = answers.length > 0;
  const shouldShowResult = hasStoredAnswers || isPreview;
  const scores = isPreview
    ? previewScores
    : calculateCategoryScores(answers, categoryIds);
  const totalScore = categoryIds.reduce(
    (sum, categoryId) => sum + (scores[categoryId] ?? 0),
    0,
  );
  const maxTotalScore = categoryIds.length * 100;

  useEffect(() => {
    queueMicrotask(() => {
      const searchParams = new URLSearchParams(window.location.search);
      setIsPreview(searchParams.get("preview") === "1");
      setPreviewScores(
        buildPreviewScores(
          searchParams.get("category"),
          searchParams.get("range"),
        ),
      );
      setAnswers(loadStoredAnswers());
    });
  }, []);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (allowNavigation.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = LEAVE_RESULT_MESSAGE;
    }

    function handlePopState() {
      if (allowNavigation.current) {
        return;
      }

      if (window.confirm(LEAVE_RESULT_MESSAGE)) {
        allowNavigation.current = true;
        router.push("/");
        return;
      }

      window.history.pushState({ resultGuard: true }, "", window.location.href);
    }

    if (!hasNavigationGuard.current) {
      window.history.pushState({ resultGuard: true }, "", window.location.href);
      hasNavigationGuard.current = true;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  function confirmResultNavigation(event?: MouseEvent<HTMLAnchorElement>) {
    if (!window.confirm(LEAVE_RESULT_MESSAGE)) {
      event?.preventDefault();
      return false;
    }

    allowNavigation.current = true;
    return true;
  }

  function goHomeFromResult() {
    if (!confirmResultNavigation()) {
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 dark:bg-zinc-950 dark:text-zinc-50">
      <HomeNavigation onNavigate={confirmResultNavigation} />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Media MBTI Result
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">진단 결과</h1>
        </header>

        {!shouldShowResult ? (
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              저장된 응답이 없습니다. 테스트를 먼저 진행해주세요.
            </p>
            <Link
              href="/test?restart=1"
              className="mt-5 inline-flex h-11 cursor-pointer items-center rounded-md bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:bg-blue-800"
            >
              테스트 시작
            </Link>
          </section>
        ) : (
          <>
            <ResultRadarChart scores={scores} />

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {isPreview ? (
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

            <section className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                항목별 리포트
              </h2>

              {AVAILABLE_REPORTS.map((report) => {
                const score = scores[report.categoryId] ?? 0;
                const matchedRange = findReportRange(report, score);

                if (!matchedRange) {
                  return null;
                }

                return (
                  <article
                    key={report.categoryId}
                    className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {report.categoryName}
                        </p>
                        <h3 className="mt-2 text-lg font-bold leading-7">
                          {matchedRange.title}
                        </h3>
                      </div>
                      <p className="shrink-0 text-right text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                        {score}점
                      </p>
                    </div>

                    <div className="mt-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                      <ReportText text={matchedRange.description} />
                    </div>

                    <div className="mt-5 rounded-md bg-blue-50 p-4 dark:bg-blue-950">
                      <p className="text-sm font-bold text-blue-700 dark:text-blue-200">
                        관찰 포인트
                      </p>
                      <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                        <ReportText text={matchedRange.watchPoint} />
                      </div>
                    </div>

                    {matchedRange.conversationExamples?.length ? (
                      <div className="mt-5 flex flex-col gap-3">
                        <p className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                          대화 예시
                        </p>
                        {matchedRange.conversationExamples.map((example) => (
                          <div
                            key={example.title}
                            className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800"
                          >
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                              {example.title}
                            </p>
                            <div className="mt-3 flex flex-col gap-2">
                              {example.dialogue.map((line, index) => (
                                <p
                                  key={`${example.title}-${index}`}
                                  className="text-sm leading-6 text-zinc-600 dark:text-zinc-300"
                                >
                                  <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                                    {getSpeakerLabel(line.speaker)}
                                  </span>
                                  : {line.text}
                                </p>
                              ))}
                            </div>
                            {getResourceLinks(example).length > 0 ? (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {getResourceLinks(example).map((link) => (
                                  <a
                                    key={`${example.title}-${link.href}`}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0"
                                  >
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </section>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={goHomeFromResult}
                className="inline-flex h-11 cursor-pointer items-center rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                뒤로가기
              </button>
              <Link
                href="/test"
                onClick={confirmResultNavigation}
                className="inline-flex h-11 cursor-pointer items-center rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                다시 보기
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
