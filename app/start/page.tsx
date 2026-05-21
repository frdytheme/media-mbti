import Link from "next/link";

export default function StartPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <section className="flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-3 text-center">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            테스트 유형 선택
          </p>
          <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
            누구의 관점으로 진단할까요?
          </h1>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/test?restart=1"
            className="flex min-h-36 cursor-pointer flex-col justify-between rounded-lg border border-blue-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md active:translate-y-0 dark:border-blue-900 dark:bg-zinc-900 dark:hover:bg-blue-950"
          >
            <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
              학부모용
            </span>
            <span className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              보호자가 아이의 미디어 사용 모습을 바탕으로 응답합니다.
            </span>
          </Link>

          <button
            type="button"
            disabled
            className="flex min-h-36 cursor-not-allowed flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-100 p-5 text-left opacity-55 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-xl font-bold text-zinc-500 dark:text-zinc-400">
              학생용
            </span>
            <span className="mt-4 text-sm leading-6 text-zinc-500 dark:text-zinc-500">
              준비 중입니다.
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
