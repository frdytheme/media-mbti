import Link from "next/link";

export default function Home() {
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

        <Link
          href="/start"
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md active:translate-y-0 active:bg-blue-800"
        >
          미디어 MBTI 시작하기
        </Link>
      </section>
    </main>
  );
}
