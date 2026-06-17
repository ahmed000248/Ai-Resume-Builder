import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Sparkles, FileText } from "lucide-react";

type RewriteComparisonProps = {
  original: string;
  improved: string;
};

export function RewriteComparison({ original, improved }: RewriteComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="flex flex-col bg-slate-950/20 border-slate-900 shadow-md">
        <CardHeader className="border-b border-slate-900/60 pb-3 flex flex-row items-center space-x-2">
          <FileText className="h-5 w-5 text-slate-500" />
          <CardTitle className="text-base font-bold text-slate-300">Original Resume</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-[400px] text-sm text-slate-400 font-medium whitespace-pre-wrap leading-relaxed select-text">
          {original || "No original content provided."}
        </CardContent>
      </Card>

      <Card className="flex flex-col bg-slate-950/20 border-indigo-500/20 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5">
        <CardHeader className="border-b border-indigo-500/10 pb-3 flex flex-row items-center space-x-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <CardTitle className="text-base font-bold text-indigo-400">AI Improved Suggestion</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-[400px] text-sm text-slate-200 font-medium whitespace-pre-wrap leading-relaxed select-text">
          {improved || "AI Rewrite is processing..."}
        </CardContent>
      </Card>
    </div>
  );
}
