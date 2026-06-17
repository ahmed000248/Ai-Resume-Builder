import { apiClient } from "./client";
import { ResumeFormData } from "@/types/resume";

export async function generateResume(data: ResumeFormData): Promise<{ content: string }> {
  return apiClient<{ content: string }>("/api/generate-resume", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
