import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

type ScoreGaugeProps = {
  score: number;
};

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const data = [
    {
      name: "Score",
      value: score,
      fill: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444",
    },
  ];

  return (
    <div className="relative w-full h-[220px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="95%"
          barSize={14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: "#1e293b" }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">out of 100</span>
      </div>
    </div>
  );
}
