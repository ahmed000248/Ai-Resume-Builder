import React from "react";
import { AnalysisResult } from "@/types/analysis";
import { ScoreGauge } from "./ScoreGauge";
import { KeywordBadge } from "./KeywordBadge";
import { AnalysisCard } from "./AnalysisCard";
import { RewriteComparison } from "../resume/RewriteComparison";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Sparkles, CheckCircle, ListChecks } from "lucide-react";

type ResultsDashboardProps = {
  result: AnalysisResult;
};

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-2 pb-2 border-b border-slate-900">
        <Sparkles className="h-6 w-6 text-indigo-400" />
        <h2 className="text-2xl font-extrabold text-white">AI Analysis Results</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-950/20 border-slate-900 shadow-md">
          <CardHeader className="pb-0 text-center">
            <CardTitle className="text-base font-bold text-slate-300">ATS Match Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ScoreGauge score={result.atsScore} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 bg-slate-950/20 border-slate-900 shadow-md flex flex-col justify-between">
          <div>
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <ListChecks className="h-5 w-5 text-indigo-400" />
              <CardTitle className="text-base font-bold text-slate-300">Missing Target Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              {result.missingKeywords && result.missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((kw, idx) => (
                    <KeywordBadge
                      key={idx}
                      keyword={kw}
                      type={idx < 3 ? "critical" : "warning"}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">Perfect! No critical target keywords are missing.</span>
                </div>
              )}
            </CardContent>
          </div>
          <CardContent className="pt-0 border-t border-slate-900/60 mt-4">
            <p className="text-xs text-slate-500 font-semibold pt-4">
              Tip: Integrate these missing keywords naturally into your experience description and skills section to raise your match rating.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisCard
          type="strength"
          title="Key Strengths"
          items={result.strengths || []}
        />
        <AnalysisCard
          type="weakness"
          title="Areas of Improvement"
          items={result.weaknesses || []}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Recommended Enhancements</h3>
        <RewriteComparison
          original={result.original}
          improved={result.improved}
        />
      </div>
    </div>
  );
}
