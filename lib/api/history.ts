import { apiClient } from "./client";
import { AnalysisResult } from "@/types/analysis";

export async function getHistory(): Promise<AnalysisResult[]> {
  return apiClient<AnalysisResult[]>("/api/history", {
    method: "GET",
  });
}

export async function deleteHistory(id: string): Promise<void> {
  return apiClient<void>(`/api/history/${id}`, {
    method: "DELETE",
  });
}
