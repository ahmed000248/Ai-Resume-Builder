import React from "react";
import { Card, CardContent } from "../ui/Card";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = "neutral",
}: StatCardProps) {
  return (
    <Card hoverable className="relative overflow-hidden bg-slate-950/40 border border-slate-900 shadow-md">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Icon className="h-24 w-24 text-slate-100" />
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-400">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="text-3xl font-extrabold text-white">{value}</h3>
          {trend && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                trendType === "positive"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : trendType === "negative"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-slate-500/10 text-slate-400"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-500 font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}
