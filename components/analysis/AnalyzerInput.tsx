"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Card } from "../ui/Card";
import { Upload, Sparkles, FileText, Briefcase } from "lucide-react";
import toast from "react-hot-toast";

const analyzerSchema = z.object({
  resumeText: z.string().min(50, "Resume content must be at least 50 characters long"),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters long"),
});

type AnalyzerInputProps = {
  onSubmit: (data: { resumeText: string; jobDescription: string }) => void;
  isLoading?: boolean;
};

export function AnalyzerInput({ onSubmit, isLoading = false }: AnalyzerInputProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(analyzerSchema),
    defaultValues: {
      resumeText: "",
      jobDescription: "",
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setValue("resumeText", text, { shouldValidate: true });
      toast.success(`Loaded ${file.name} successfully!`);
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
    };
    reader.readAsText(file);
  };

  return (
    <Card className="bg-slate-950/20 border border-slate-900 shadow-xl p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <label className="text-sm font-bold text-slate-300 flex items-center">
              <FileText className="h-4.5 w-4.5 mr-2 text-indigo-400" />
              Paste Resume Text
            </label>
            <div className="relative">
              <input
                type="file"
                id="resume-file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="resume-file"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{fileName ? fileName : "Upload .txt / .md"}</span>
              </label>
            </div>
          </div>

          <Textarea
            placeholder="Paste the full text of your current resume here..."
            rows={10}
            error={errors.resumeText?.message}
            {...register("resumeText")}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-300 flex items-center">
            <Briefcase className="h-4.5 w-4.5 mr-2 text-indigo-400" />
            Target Job Description
          </label>
          <Textarea
            placeholder="Paste the job description or role requirements you are targeting..."
            rows={6}
            error={errors.jobDescription?.message}
            {...register("jobDescription")}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" className="w-full sm:w-auto" isLoading={isLoading}>
            <Sparkles className="h-5 w-5 mr-2" />
            Analyze & Match Score
          </Button>
        </div>
      </form>
    </Card>
  );
}
