"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentResumes } from "@/components/dashboard/RecentResumes";
import { Button } from "@/components/ui/Button";
import { getHistory, deleteHistory } from "@/lib/api/history";
import { AnalysisResult } from "@/types/analysis";
import {
  FileText,
  TrendingUp,
  Award,
  Plus,
  ArrowRight,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { ResultsDashboard } from "@/components/analysis/ResultsDashboard";

export default function DashboardHome() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null);

  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      console.warn("Fallback to mock history data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return;
    try {
      await deleteHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Analysis deleted successfully.");
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to delete analysis.");
    }
  };

  const totalAnalyses = history.length;
  const avgAtsScore = totalAnalyses
    ? Math.round(history.reduce((sum, item) => sum + item.atsScore, 0) / totalAnalyses)
    : 0;
  const resumesCreated = totalAnalyses;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome, {user?.displayName || "Candidate"}
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Analyze your resume, target high-priority keywords, and increase your response rate.
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="primary">
            <Plus className="h-5 w-5 mr-2" />
            Create Resume
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Analyses"
          value={totalAnalyses}
          description="Resumes reviewed by AI"
          icon={FileText}
          trend={totalAnalyses > 0 ? "+100%" : undefined}
          trendType="positive"
        />
        <StatCard
          title="Average ATS Score"
          value={`${avgAtsScore}%`}
          description="Goal is 80% or higher"
          icon={TrendingUp}
          trend={avgAtsScore >= 80 ? "Excellent" : avgAtsScore >= 60 ? "Average" : "Needs Work"}
          trendType={avgAtsScore >= 80 ? "positive" : avgAtsScore >= 60 ? "neutral" : "negative"}
        />
        <StatCard
          title="Resumes Created"
          value={resumesCreated}
          description="Optimized versions generated"
          icon={Award}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-200">Recent Analyses</h2>
          <Link href="/dashboard/history" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center">
            View All History
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <RecentResumes
          items={history.slice(0, 3)}
          isLoading={isLoading}
          onView={(item) => setSelectedItem(item)}
          onDelete={handleDelete}
        />
      </div>

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
