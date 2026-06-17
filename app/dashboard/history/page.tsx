"use client";

import React, { useEffect, useState } from "react";
import { getHistory, deleteHistory } from "@/lib/api/history";
import { AnalysisResult } from "@/types/analysis";
import { HistoryCard } from "@/components/dashboard/HistoryCard";
import { ResultsDashboard } from "@/components/analysis/ResultsDashboard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Clock, Search, X, FilePlus2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to retrieve history.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume analysis history?")) return;
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("History item deleted.");
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete history item.");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.original.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
          <Clock className="h-7 w-7 mr-2 text-indigo-400" />
          Analysis History
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          Review your previous ATS scans, matching scores, and AI recommendations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/20 border border-slate-900 p-4 rounded-xl">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
          <Input
            placeholder="Search original text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm font-semibold text-slate-400">
          Showing {filteredHistory.length} of {history.length} scans
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 text-center">
          <p className="text-slate-400 font-medium mb-4">No results found matching your search.</p>
          {history.length === 0 && (
            <Link href="/dashboard/analyze">
              <Button variant="primary">
                <FilePlus2 className="h-4 w-4 mr-2" />
                Scan First Resume
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={(val) => setSelectedItem(val)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              aria-label="Close modal"
              title="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mt-4">
              <ResultsDashboard result={selectedItem} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
