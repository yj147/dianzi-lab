"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { RadarDataPoint, DimensionScore } from "./types";
import { DIMENSIONS } from "./constants";

// 动态导入 Recharts，禁用 SSR
const RechartsRadarChart = dynamic(
  () => import("./RadarChartInner").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-primary" />
      </div>
    ),
  }
);

type RadarChartProps = {
  scores: DimensionScore[];
  className?: string;
};

// 转换分数数据为雷达图数据格式
function transformToRadarData(scores: DimensionScore[]): RadarDataPoint[] {
  return DIMENSIONS.map((dim) => {
    const found = scores.find((s) => s.key === dim.key);
    return {
      dimension: dim.label,
      score: found?.value ?? 0,
      fullMark: 10,
    };
  });
}

export default function RadarChart({ scores, className }: RadarChartProps) {
  const data = transformToRadarData(scores);

  return (
    <div className={cn("h-[300px] w-full", className)}>
      <RechartsRadarChart data={data} />
    </div>
  );
}
