import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type AnalysisCardProps = {
  type: "strength" | "weakness";
  title: string;
  items: string[];
};

export function AnalysisCard({ type, title, items }: AnalysisCardProps) {
  const isStrength = type === "strength";

  return (
    <Card
      className={cn(
        "bg-slate-950/20 border shadow-md",
        isStrength
          ? "border-emerald-500/10 shadow-emerald-500/2"
          : "border-red-500/10 shadow-red-500/2"
      )}
    >
      <CardHeader className="flex flex-row items-center space-x-2.5 pb-2">
        {isStrength ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-400" />
        )}
        <CardTitle className={cn("text-base font-bold", isStrength ? "text-emerald-400" : "text-red-400")}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium italic">No entries identified.</p>
        ) : (
          <ul className="space-y-2.5 text-sm text-slate-300 font-medium">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className={cn("mr-2.5 mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0", isStrength ? "bg-emerald-500" : "bg-red-500")} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
