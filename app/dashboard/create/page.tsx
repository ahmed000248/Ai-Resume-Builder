"use client";

import React, { useState } from "react";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { PDFButton } from "@/components/resume/PDFButton";
import { generateResume } from "@/lib/api/generate";
import { ResumeFormData } from "@/types/resume";
import toast from "react-hot-toast";
import { FilePlus2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CreateResumePage() {
  const [formData, setFormData] = useState<ResumeFormData | null>(null);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: ResumeFormData) => {
    setIsLoading(true);
    try {
      const result = await generateResume(data);
      setFormData(data);
      setGeneratedResume(result.content);
      toast.success("Resume optimized successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Using client-side structured resume preview.");
      setFormData(data);
      setGeneratedResume("Success");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
          <FilePlus2 className="h-7 w-7 mr-2 text-indigo-400" />
          AI Resume Generator
        </h1>
        <p className="text-slate-400 font-medium mt-1">
          Provide your professional background details through our multi-step form to construct an optimized resume.
        </p>
      </div>

      {!formData || !generatedResume ? (
        <ResumeForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/20 border border-slate-900 p-4 rounded-xl">
            <Button variant="ghost" size="sm" onClick={() => { setFormData(null); setGeneratedResume(null); }}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Edit Form Details
            </Button>
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <PDFButton data={formData} />
            </div>
          </div>
          <ResumePreview data={formData} />
        </div>
      )}
    </div>
  );
}
