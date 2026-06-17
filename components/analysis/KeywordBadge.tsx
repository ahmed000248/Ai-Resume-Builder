import React from "react";

type KeywordBadgeProps = {
  keyword: string;
  type?: "critical" | "warning" | "default";
};

export function KeywordBadge({ keyword, type = "default" }: KeywordBadgeProps) {
  const badgeColors = {
    critical: "bg-red-500/10 text-red-400 border-red-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    default: "bg-slate-900 text-slate-300 border-slate-800",
  };

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold border px-2.5 py-1 rounded-lg transition-colors ${badgeColors[type]}`}
    >
      {keyword}
    </span>
  );
}
