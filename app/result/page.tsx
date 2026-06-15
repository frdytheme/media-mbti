"use client";

import Link from "next/link";
import Image from "next/image";
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
import studentContentQualityReport from "../../src/data/student/reports/content-quality-report.json";
import studentDigitalJudgmentReport from "../../src/data/student/reports/digital-judgment-report.json";
import studentFamilyCommunicationReport from "../../src/data/student/reports/family-communication-report.json";
import studentGameSpendingReport from "../../src/data/student/reports/game-spending-report.json";
import studentSocialSafetyReport from "../../src/data/student/reports/social-safety-report.json";
import studentTimeControlReport from "../../src/data/student/reports/time-control-report.json";
import {
  studentMediaDomainLabels,
  studentTemperamentInsightCards,
  studentTemperamentInsightIntro,
  studentTemperamentLeadTitle,
} from "../../src/data/student/temperament-insights";
import {
  getGuideResourcesForCategory,
  type GuideResource,
} from "../../src/data/guide-resources";
import {
  mediaDomainLabels,
  temperamentInsightCards,
  temperamentInsightIntro,
  type MediaDomainId,
  type TemperamentInsightCard,
} from "../../src/data/temperament-insights";
import { calculateCategoryScores } from "../../src/lib/scoring";
import {
  getTestAnswersStorageKey,
  getTestAudience,
  type StoredAnswer,
  type TestAudience,
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
  dialogue: ConversationLine[];
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
  audience?: TestAudience;
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

const PARENT_REPORTS = [
  timeControlReport as CategoryReport,
  contentQualityReport as CategoryReport,
  socialSafetyReport as CategoryReport,
  gameSpendingReport as CategoryReport,
  digitalJudgmentReport as CategoryReport,
  familyCommunicationReport as CategoryReport,
];

const STUDENT_REPORTS = [
  studentTimeControlReport as CategoryReport,
  studentContentQualityReport as CategoryReport,
  studentSocialSafetyReport as CategoryReport,
  studentGameSpendingReport as CategoryReport,
  studentDigitalJudgmentReport as CategoryReport,
  studentFamilyCommunicationReport as CategoryReport,
];

const TEST_RANGE_SCORES: Record<string, number> = {
  stable: 92,
  watch: 77,
  adjustment: 60,
  priority: 35,
};

const LEAVE_RESULT_MESSAGE = "결과 페이지에서 나가시겠습니까?";
const WMQI_CONTENT_EVALUATION_SHEET_PATH =
  "/images/reports/content-quality/wmqi-content-evaluation-sheet.webp";

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

function loadStoredAnswers(audience: TestAudience): StoredAnswer[] {
  if (typeof window === "undefined") {
    return [];
  }

  let storedValue: string | null = null;

  try {
    storedValue = window.localStorage.getItem(
      getTestAnswersStorageKey(audience),
    );
  } catch {
    return [];
  }

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

function splitReportParagraphs(text: string) {
  const sentences: string[] = [];
  let currentSentence = "";
  const quoteStack: string[] = [];

  for (const character of text.replace(/\s+/g, " ").trim()) {
    currentSentence += character;

    if (character === '"' || character === "'") {
      if (quoteStack.at(-1) === character) {
        quoteStack.pop();
      } else {
        quoteStack.push(character);
      }
      continue;
    }

    if (character === "“") {
      quoteStack.push("”");
      continue;
    }

    if (character === "”") {
      if (quoteStack.at(-1) === character) {
        quoteStack.pop();
      }
      continue;
    }

    if (character === "‘") {
      quoteStack.push("’");
      continue;
    }

    if (character === "’") {
      if (quoteStack.at(-1) === character) {
        quoteStack.pop();
      }
      continue;
    }

    if (
      quoteStack.length === 0 &&
      [".", "?", "!", "。", "？", "！"].includes(character)
    ) {
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
      {splitReportParagraphs(text).map((paragraph, index) => (
        <p key={`${index}-${paragraph}`} className="text-left">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function GuideResourcesSection({ guides }: { guides: GuideResource[] }) {
  const groupedGuides = guides.reduce<Record<string, GuideResource[]>>(
    (groups, guide) => {
      groups[guide.group] = [...(groups[guide.group] ?? []), guide];
      return groups;
    },
    {},
  );

  return (
    <details className="group mt-5 overflow-hidden rounded-md border border-blue-200 bg-blue-50/80 shadow-sm dark:border-blue-900 dark:bg-blue-950/50">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 border-l-4 border-blue-600 px-4 py-3 text-sm font-bold text-blue-950 marker:hidden transition hover:bg-blue-100/70 dark:border-blue-400 dark:text-blue-100 dark:hover:bg-blue-900/40">
        <span className="flex min-w-0 flex-col gap-1">
          <span>도움이 되는 가이드 자료</span>
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
            이 유형에 맞는 자료 {guides.length}개
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-blue-700 shadow-sm ring-1 ring-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:ring-blue-800">
          <span className="group-open:hidden">펼쳐보기</span>
          <span className="hidden group-open:inline">접기</span>
          <span
            aria-hidden="true"
            className="text-base transition-transform group-open:rotate-180"
          >
            ↓
          </span>
        </span>
      </summary>

      <div className="border-t border-blue-200 bg-white px-4 py-4 dark:border-blue-900 dark:bg-zinc-950">
        <div className="flex flex-col gap-5">
          {Object.entries(groupedGuides).map(([group, groupGuides]) => (
            <section key={group}>
              <h4 className="mb-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                {group}
              </h4>
              <ul className="divide-y divide-zinc-200 overflow-hidden rounded-md border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                {groupGuides.map((guide) => (
                  <li key={guide.id}>
                    <a
                      href={guide.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-12 items-center gap-3 px-3 py-2.5 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-200 dark:hover:bg-blue-950 dark:focus:ring-blue-900"
                    >
                      <span className="shrink-0 rounded-sm bg-zinc-100 px-2 py-1 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {guide.type}
                      </span>
                      <span className="min-w-0 flex-1 text-sm font-medium leading-6 text-zinc-700 dark:text-zinc-200">
                        {guide.title}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">
                        열기
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </details>
  );
}

const TEMPERAMENT_INSIGHT_GROUPS = [
  {
    id: "novelty_seeking",
    label: "자극추구",
    highId: "novelty_seeking_high",
    lowId: "novelty_seeking_low",
  },
  {
    id: "harm_avoidance",
    label: "위험회피",
    highId: "harm_avoidance_high",
    lowId: "harm_avoidance_low",
  },
  {
    id: "reward_dependence",
    label: "사회적민감성",
    highId: "reward_dependence_high",
    lowId: "reward_dependence_low",
  },
  {
    id: "persistence",
    label: "인내력",
    highId: "persistence_high",
    lowId: "persistence_low",
  },
] as const;

function TemperamentInsightSection({ audience }: { audience: TestAudience }) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const isStudent = audience === "student";
  const insightCards = isStudent
    ? studentTemperamentInsightCards
    : temperamentInsightCards;
  const insightIntro = isStudent
    ? studentTemperamentInsightIntro
    : temperamentInsightIntro;
  const domainLabels = isStudent ? studentMediaDomainLabels : mediaDomainLabels;

  function toggleCard(cardId: string) {
    setSelectedCardId((currentCardId) =>
      currentCardId === cardId ? null : cardId,
    );
  }

  return (
    <section className="rounded-lg border border-emerald-950 bg-[#173b36] p-5 text-white shadow-lg shadow-emerald-950/15 dark:border-emerald-800 dark:bg-[#102d29]">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-emerald-200">
          {isStudent ? "나를 이해하는 힌트" : "참고 자료"}
        </p>
        <h2 className="text-xl font-bold tracking-normal text-white">
          기질적 관점으로 보는 미디어 습관
        </h2>
        <div className="text-sm leading-7 text-emerald-50/90">
          <ReportText text={insightIntro} />
        </div>
      </header>

      <div className="mt-6 grid gap-4">
        {TEMPERAMENT_INSIGHT_GROUPS.map((group) => {
          const highCard = insightCards.find(
            (card) => card.id === group.highId,
          );
          const lowCard = insightCards.find(
            (card) => card.id === group.lowId,
          );
          const selectedCard = insightCards.find(
            (card) =>
              card.id === selectedCardId &&
              (card.id === group.highId || card.id === group.lowId),
          );

          if (!highCard || !lowCard) {
            return null;
          }

          return (
            <section
              key={group.id}
              className="overflow-hidden rounded-md border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60"
            >
              <div className="flex items-center gap-3 px-3 pt-3">
                <span className="h-px flex-1 bg-emerald-200 dark:bg-emerald-800" />
                <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                  {group.label}
                </h3>
                <span className="h-px flex-1 bg-emerald-200 dark:bg-emerald-800" />
              </div>

              <div className="grid grid-cols-2 gap-px p-3">
                <TemperamentChoiceButton
                  card={highCard}
                  direction="high"
                  isSelected={selectedCardId === highCard.id}
                  onClick={() => toggleCard(highCard.id)}
                />
                <TemperamentChoiceButton
                  card={lowCard}
                  direction="low"
                  isSelected={selectedCardId === lowCard.id}
                  onClick={() => toggleCard(lowCard.id)}
                />
              </div>

              {selectedCard ? (
                <TemperamentInsightCardContent
                  audience={audience}
                  card={selectedCard}
                  domainLabels={domainLabels}
                />
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function TemperamentChoiceButton({
  card,
  direction,
  isSelected,
  onClick,
}: {
  card: TemperamentInsightCard;
  direction: "high" | "low";
  isSelected: boolean;
  onClick: () => void;
}) {
  const isHigh = direction === "high";

  return (
    <button
      type="button"
      aria-expanded={isSelected}
      aria-controls={`temperament-card-${card.id}`}
      onClick={onClick}
      className={`group/choice relative flex min-h-28 cursor-pointer flex-col justify-between overflow-hidden px-3 py-3 text-left transition sm:min-h-24 sm:px-4 ${
        isHigh
          ? "rounded-l-md border border-zinc-200 bg-white hover:border-rose-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-rose-700"
          : "rounded-r-md border border-zinc-200 bg-white hover:border-teal-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-teal-700"
      } ${
        isSelected
          ? isHigh
            ? "ring-2 ring-inset ring-rose-400 dark:ring-rose-500"
            : "ring-2 ring-inset ring-teal-400 dark:ring-teal-500"
          : ""
      }`}
    >
      <span
        className={`text-xs font-bold sm:text-sm ${
          isHigh
            ? "text-rose-700 dark:text-rose-300"
            : "text-teal-700 dark:text-teal-300"
        }`}
      >
        {isHigh ? "높은 편이라면" : "낮은 편이라면"}
      </span>
      <span className="mt-2 max-w-full text-sm font-semibold leading-5 text-zinc-700 dark:text-zinc-300">
        “{card.characterLabel}”
      </span>
      <span
        aria-hidden="true"
        className={`absolute inset-x-3 bottom-2 h-0.5 scale-x-0 transition-transform duration-300 ease-out group-hover/choice:scale-x-100 ${
          isHigh
            ? "origin-right bg-rose-500 dark:bg-rose-400"
            : "origin-left bg-teal-500 dark:bg-teal-400"
        } ${isSelected ? "scale-x-100" : ""}`}
      />
    </button>
  );
}

function TemperamentInsightCardContent({
  audience,
  card,
  domainLabels,
}: {
  audience: TestAudience;
  card: TemperamentInsightCard;
  domainLabels: Record<MediaDomainId, string>;
}) {
  const isStudent = audience === "student";

  return (
    <div
      id={`temperament-card-${card.id}`}
      className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
          {isStudent
            ? "같이 확인해볼 리포트 영역"
            : "함께 살펴볼 리포트 영역"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {card.relatedDomains.map((domainId) => (
            <span
              key={domainId}
              className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800"
            >
              {domainLabels[domainId]}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-7">
        <TemperamentBodyItem
          label={
            isStudent ? "이런 모습이 있을 수 있어" : "이런 모습으로 보일 수 있어요"
          }
          text={card.body.childPattern}
        />
        <TemperamentBodyItem
          label={
            isStudent ? "이건 너의 장점이기도 해" : "이 힘은 자원이기도 해요"
          }
          text={card.body.strengthFrame}
        />
        <TemperamentBodyItem
          label="다만 미디어 환경에서는"
          text={card.body.mediaRisk}
        />
        <TemperamentBodyItem
          label={
            isStudent ? "이 영역을 같이 확인해봐" : "이 영역을 함께 살펴보세요"
          }
          text={card.body.readingGuide}
        />
        <TemperamentBodyItem
          label={
            isStudent
              ? "이렇게 해보면 도움이 될 수 있어"
              : "이런 말이 더 잘 닿을 수 있어요"
          }
          text={card.body.parentApproach}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-950">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {isStudent ? "스스로 체크해볼 점" : "살펴볼 지점"}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {card.watchPoint}
          </p>
        </div>
        <div className="rounded-md bg-emerald-50 p-3 dark:bg-emerald-950">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
            {isStudent ? "부모님과 이렇게 말해봐" : "부모 첫마디"}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
            {card.parentPhrase}
          </p>
        </div>
      </div>
    </div>
  );
}

function TemperamentBodyItem({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
        {label}
      </p>
      <div className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        <ReportText text={text} />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const hasNavigationGuard = useRef(false);
  const allowNavigation = useRef(false);
  const [answers, setAnswers] = useState<StoredAnswer[]>([]);
  const [audience, setAudience] = useState<TestAudience>("parent");
  const [isPreview, setIsPreview] = useState(false);
  const [isWmqiImageOpen, setIsWmqiImageOpen] = useState(false);
  const [previewScores, setPreviewScores] = useState(PREVIEW_SCORES);
  const categoryIds = (categories as Category[]).map((category) => category.id);
  const availableReports =
    audience === "student" ? STUDENT_REPORTS : PARENT_REPORTS;
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
      const nextAudience = getTestAudience(searchParams.get("audience"));
      setAudience(nextAudience);
      setIsPreview(searchParams.get("preview") === "1");
      setPreviewScores(
        buildPreviewScores(
          searchParams.get("category"),
          searchParams.get("range"),
        ),
      );
      setAnswers(loadStoredAnswers(nextAudience));
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

  useEffect(() => {
    if (!isWmqiImageOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsWmqiImageOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWmqiImageOpen]);

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

  function openWmqiImage() {
    setIsWmqiImageOpen(true);
  }

  function closeWmqiImage() {
    setIsWmqiImageOpen(false);
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-950 sm:px-6 dark:bg-zinc-950 dark:text-zinc-50">
      <HomeNavigation onNavigate={confirmResultNavigation} />
      {isWmqiImageOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="WMQI 콘텐츠 평가표 크게 보기"
          className="fixed inset-0 z-[100] flex bg-zinc-950/80 p-3 sm:p-6"
        >
          <div className="flex min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-zinc-950">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="min-w-0 truncate text-sm font-bold text-zinc-950 dark:text-zinc-50">
                WMQI 콘텐츠 평가표
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                >
                  원본 크게 보기
                </a>
                <button
                  type="button"
                  onClick={closeWmqiImage}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-3 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  닫기
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-zinc-100 p-3 dark:bg-zinc-900 sm:p-6">
              <div className="w-[960px] max-w-none sm:mx-auto sm:w-[1280px]">
                <Image
                  src={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                  alt="WMQI 콘텐츠 평가표"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 1280px"
                  className="h-auto w-full rounded-md bg-white shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            Media MBTI Result
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">진단 결과</h1>
          {audience === "student" ? (
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              학생용 리포트
            </p>
          ) : null}
        </header>

        {!shouldShowResult ? (
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              저장된 응답이 없습니다. 테스트를 먼저 진행해주세요.
            </p>
            <Link
              href={
                audience === "student"
                  ? "/test?audience=student&restart=1"
                  : "/test?restart=1"
              }
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

              {availableReports.map((report) => {
                const score = scores[report.categoryId] ?? 0;
                const matchedRange = findReportRange(report, score);
                const guides = getGuideResourcesForCategory(report.categoryId);

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

                    {report.categoryId === "content_quality" ? (
                      <figure className="mt-5 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={openWmqiImage}
                          className="group hidden w-full cursor-zoom-in bg-white text-left sm:block dark:bg-zinc-950"
                          aria-label="WMQI 콘텐츠 평가표 크게 보기"
                        >
                          <Image
                            src={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                            alt="WMQI 콘텐츠 평가표"
                            width={1920}
                            height={1080}
                            sizes="(max-width: 768px) calc(100vw - 40px), 720px"
                            className="h-auto w-full transition group-hover:opacity-90"
                          />
                        </button>
                        <a
                          href={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                          target="_blank"
                          rel="noreferrer"
                          className="block bg-white dark:bg-zinc-950 sm:hidden"
                          aria-label="WMQI 콘텐츠 평가표 원본 보기"
                        >
                          <Image
                            src={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                            alt="WMQI 콘텐츠 평가표"
                            width={1920}
                            height={1080}
                            sizes="calc(100vw - 40px)"
                            className="h-auto w-full"
                          />
                        </a>
                        <figcaption className="flex flex-col gap-3 border-t border-zinc-200 px-4 py-3 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                          <span>WMQI 콘텐츠 평가표</span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={openWmqiImage}
                              className="hidden h-9 items-center justify-center rounded-md bg-blue-600 px-3 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 sm:inline-flex"
                            >
                              크게 보기
                            </button>
                            <a
                              href={WMQI_CONTENT_EVALUATION_SHEET_PATH}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                            >
                              원본 크게 보기
                            </a>
                          </div>
                        </figcaption>
                      </figure>
                    ) : null}

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
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {guides.length > 0 ? (
                      <GuideResourcesSection guides={guides} />
                    ) : null}
                  </article>
                );
              })}
            </section>

            {audience === "student" ? (
              <section className="px-2 py-10 text-center sm:px-6 sm:py-14">
                <p className="text-2xl font-bold leading-10 text-zinc-950 sm:text-3xl sm:leading-[1.5] dark:text-zinc-50">
                  {studentTemperamentLeadTitle.split("\n").map((line) => (
                    <span key={line} className="block break-keep">
                      {line}
                    </span>
                  ))}
                </p>
              </section>
            ) : null}

            <TemperamentInsightSection audience={audience} />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={goHomeFromResult}
                className="inline-flex h-11 cursor-pointer items-center rounded-md border border-zinc-300 px-5 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                뒤로가기
              </button>
              <Link
                href={audience === "student" ? "/test?audience=student" : "/test"}
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
