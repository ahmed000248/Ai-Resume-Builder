import React from "react";
import Link from "next/link";
import { HistoryCard } from "./HistoryCard";
import { AnalysisResult } from "@/types/analysis";
import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";
import { FilePlus2 } from "lucide-react";

type RecentResumesProps = {
  items: AnalysisResult[];
  isLoading: boolean;
  onView: (item: AnalysisResult) => void;
  onDelete: (id: string) => void;
};

export function RecentResumes({ items, isLoading, onView, onDelete }: RecentResumesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-900 bg-slate-950/20 p-6 space-y-4 h-[180px]">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-end space-x-2 pt-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-center">
        <p className="text-slate-400 font-medium mb-4">No analysis history found. Start optimizing your resume today!</p>
        <Link href="/dashboard/create">
          <Button variant="primary" size="sm">
            <FilePlus2 className="h-4 w-4 mr-2" />
            Create First Resume
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
          onView={onView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
