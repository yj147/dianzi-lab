"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import type { RadarDataPoint } from "./types";
import { MIN_SCORE, MAX_SCORE } from "./constants";

type RadarChartInnerProps = {
  data: RadarDataPoint[];
};

export default function RadarChartInner({ data }: RadarChartInnerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#ddd6fe" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[MIN_SCORE, MAX_SCORE]}
          tick={{ fill: "#94a3b8", fontSize: 10 }}
        />
        <Radar
          name="分数"
          dataKey="score"
          stroke="#a78bfa"
          fill="#c4b5fd"
          fillOpacity={0.5}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
