import Link from "next/link";
import { type MouseEventHandler } from "react";

type HomeNavigationProps = {
  onNavigate?: MouseEventHandler<HTMLAnchorElement>;
};

export default function HomeNavigation({ onNavigate }: HomeNavigationProps) {
  return (
    <>
      <Link
        href="/"
        onClick={onNavigate}
        className="fixed left-4 top-4 z-50 rounded-md px-2 py-1 text-sm font-semibold text-zinc-500 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:left-6 sm:top-6 dark:text-zinc-400 dark:hover:text-blue-300 dark:focus:ring-blue-900"
      >
        홈으로
      </Link>
      <Link
        href="/"
        onClick={onNavigate}
        aria-label="홈으로"
        className="fixed bottom-5 right-5 z-50 inline-flex size-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-200 active:translate-y-0 dark:shadow-blue-950/40 dark:focus:ring-blue-900"
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
        >
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      </Link>
    </>
  );
}
