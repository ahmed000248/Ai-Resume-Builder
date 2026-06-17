import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { AnalysisResult } from "@/types/analysis";
import { formatDate } from "@/lib/utils";
import { Eye, Trash2, Calendar, FileText } from "lucide-react";

type HistoryCardProps = {
  item: AnalysisResult;
  onView: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
};

export function HistoryCard({ item, onView, onDelete }: HistoryCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-400 border-red-500/20";
  };

  const getResumeTitle = (originalText: string) => {
    const firstLine = originalText.trim().split("\n")[0] || "";
    if (firstLine.length > 0 && firstLine.length < 40) {
      return firstLine;
    }
    return "Resume Analysis";
  };

  return (
    <Card hoverable className="flex flex-col justify-between h-full bg-slate-950/30 border border-slate-900 shadow-md">
      <div>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <div className="rounded-xl bg-slate-900 p-2 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold truncate max-w-[150px]">
                {getResumeTitle(item.original)}
              </CardTitle>
              <div className="flex items-center space-x-1 mt-1 text-slate-500 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.createdAt ? formatDate(item.createdAt) : "Recently"}</span>
              </div>
            </div>
          </div>
          <span className={`text-sm font-bold border px-2.5 py-1 rounded-lg ${getScoreColor(item.atsScore)}`}>
            ATS: {item.atsScore}
          </span>
        </CardHeader>
        <CardContent className="mt-2 text-sm text-slate-400 font-medium line-clamp-3">
          {item.original}
        </CardContent>
      </div>
      
      <CardFooter className="flex items-center justify-end space-x-2 mt-4">
        <Button variant="ghost" size="sm" onClick={() => onView(item)} className="text-xs">
          <Eye className="h-4 w-4 mr-1.5" />
          View
        </Button>
        <Button variant="ghost" size="sm" onClick={() => item.id && onDelete(item.id)} className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20">
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
