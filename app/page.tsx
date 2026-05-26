"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

const DEV_MODE_PASSWORD = "whyme";

const REPORT_RANGES = [
  {
    id: "stable",
    label: "1구간",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:border-emerald-500",
  },
  {
    id: "watch",
    label: "2구간",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-500 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 dark:hover:border-blue-500",
  },
  {
    id: "adjustment",
    label: "3구간",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-500 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 dark:hover:border-amber-500",
  },
  {
    id: "priority",
    label: "4구간",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-500 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200 dark:hover:border-rose-500",
  },
];

export default function Home() {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleDeveloperModeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === DEV_MODE_PASSWORD) {
      setIsDeveloperMode(true);
      setIsPasswordFormOpen(false);
      setPassword("");
      setPasswordError("");
      return;
    }

    setPasswordError("패스워드를 다시 확인해주세요.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-950 sm:py-16 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="flex w-full max-w-4xl -translate-y-4 flex-col items-center gap-7 text-center sm:-translate-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">
            WHYME 미디어 MBTI
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
            아이의 디지털 미디어 사용 습관을 6가지 영역으로 살펴보고,
            균형 있는 사용 방향을 확인해보세요.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/start"
            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:bg-blue-800"
          >
            미디어 MBTI 시작하기
          </Link>

          {!isDeveloperMode ? (
            <button
              type="button"
              onClick={() => setIsPasswordFormOpen((isOpen) => !isOpen)}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-600 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              개발자 모드
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsDeveloperMode(false)}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-600 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
            >
              개발자 모드 닫기
            </button>
          )}
        </div>

        {isPasswordFormOpen && !isDeveloperMode ? (
          <form
            onSubmit={handleDeveloperModeSubmit}
            className="flex w-full max-w-sm flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <label
              htmlFor="developer-password"
              className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200"
            >
              개발자 패스워드
            </label>
            <input
              id="developer-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-blue-400 dark:focus:ring-blue-950"
            />
            {passwordError ? (
              <p className="text-left text-sm font-semibold text-rose-600 dark:text-rose-300">
                {passwordError}
              </p>
            ) : null}
            <button
              type="submit"
              className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-md active:translate-y-0 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              확인
            </button>
          </form>
        ) : null}

        {isDeveloperMode ? (
          <div className="w-full border-t border-zinc-200 pt-6 text-left dark:border-zinc-800">
            <p className="mb-4 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              개발 확인용 리포트 바로보기
            </p>
            <div className="mb-3 flex justify-center">
              <Link
                href="/result?preview=1"
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-600 transition hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-white hover:shadow-sm active:translate-y-0 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                진단 결과 바로보기(임시)
              </Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-4">
              {REPORT_RANGES.map((range) => (
                <Link
                  key={range.id}
                  href={`/result?preview=1&range=${range.id}`}
                  className={`inline-flex min-h-12 items-center justify-center rounded-md border px-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 ${range.className}`}
                >
                  {range.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
