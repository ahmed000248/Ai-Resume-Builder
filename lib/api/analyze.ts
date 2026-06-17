import { apiClient } from "./client";
import { AnalysisResult } from "@/types/analysis";

export async function analyzeResume(resume: string, jobDescription: string): Promise<AnalysisResult> {
  return apiClient<AnalysisResult>("/api/analyze-resume", {
    method: "POST",
    body: JSON.stringify({ resume, jobDescription }),
  });
}
