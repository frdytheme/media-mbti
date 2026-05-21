"use client";

import { useEffect, useRef, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";

import categories from "../data/categories.json";

type Category = {
  id: string;
  name: string;
};

type ChartDatum = {
  categoryId: string;
  name: string;
  score: number;
};

type ChartSize = {
  width: number;
  height: number;
};

export type ResultRadarChartProps = {
  scores: Record<string, number>;
  className?: string;
};

function clampScore(score: number | undefined): number {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export default function ResultRadarChart({
  scores,
  className = "",
}: ResultRadarChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState<ChartSize | null>(null);
  const chartData: ChartDatum[] = (categories as Category[]).map(
    (category) => ({
      categoryId: category.id,
      name: category.name,
      score: clampScore(scores[category.id]),
    }),
  );

  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) {
      return;
    }

    const updateChartSize = () => {
      const { width, height } = container.getBoundingClientRect();
      const nextWidth = Math.floor(width);
      const nextHeight = Math.floor(height);

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      setChartSize((previousSize) => {
        if (
          previousSize?.width === nextWidth &&
          previousSize.height === nextHeight
        ) {
          return previousSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    const animationFrame = window.requestAnimationFrame(updateChartSize);
    const resizeObserver = new ResizeObserver(updateChartSize);
    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section
      className={`w-full rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-950 ${className}`}
      aria-label="진단 결과 레이더 차트"
    >
      <div
        ref={chartContainerRef}
        className="h-72 min-h-72 w-full min-w-0 sm:h-96 sm:min-h-96"
      >
        {chartSize ? (
          <RadarChart
            data={chartData}
            height={chartSize.height}
            outerRadius="70%"
            width={chartSize.width}
          >
            <PolarGrid stroke="#d4d4d8" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fill: "#52525b", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              tickCount={6}
            />
            <Tooltip
              formatter={(value) => [`${value}점`, "점수"]}
              labelFormatter={(label) => label}
            />
            <Radar
              dataKey="score"
              name="점수"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.28}
              strokeWidth={2}
            />
          </RadarChart>
        ) : null}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {chartData.map((item) => (
          <li
            key={item.categoryId}
            className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {item.name}
            </span>
            <span className="shrink-0 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              {item.score}점
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
