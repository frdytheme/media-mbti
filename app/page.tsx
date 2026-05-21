import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="flex w-full max-w-2xl flex-col items-center gap-7 text-center">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            WHYME
          </p>
          <h1 className="text-4xl font-bold tracking-normal sm:text-5xl">
            미디어 MBTI
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-zinc-600 sm:text-lg dark:text-zinc-300">
            아이의 디지털 미디어 사용 습관을 6가지 영역으로 살펴보고,
            균형 잡힌 사용 방향을 확인해보세요.
          </p>
        </div>

        <Link
          href="/result"
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:bg-blue-800"
        >
          미디어MBTI 시작하기
        </Link>
      </section>
    </main>
  );
}
