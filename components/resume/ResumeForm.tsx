"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResumeFormData } from "@/types/resume";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { ProgressSteps } from "./ProgressSteps";
import { Card } from "../ui/Card";
import { Plus, Trash2, ArrowLeft, ArrowRight, Save } from "lucide-react";

const step1Schema = z.object({
  personal: z.object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(6, "Phone number is required"),
    linkedin: z.string().url("Must be a valid LinkedIn URL").or(z.string().length(0)),
    portfolio: z.string().url("Must be a valid Portfolio URL").or(z.string().length(0)),
  }),
});

const step2Schema = z.object({
  experience: z.array(
    z.object({
      company: z.string().min(2, "Company name is required"),
      role: z.string().min(2, "Job title/role is required"),
      description: z.string().min(10, "Description must be at least 10 characters"),
      startDate: z.string().min(2, "Start date is required"),
      endDate: z.string().min(2, "End date is required (e.g. Present or date)"),
    })
  ).min(1, "Please add at least one experience entry"),
});

const step3Schema = z.object({
  education: z.array(
    z.object({
      school: z.string().min(2, "School name is required"),
      degree: z.string().min(2, "Degree is required"),
      year: z.string().min(4, "Graduation year is required"),
    })
  ).min(1, "Please add at least one education entry"),
});

const step4Schema = z.object({
  skillsInput: z.string().min(2, "Please enter at least one skill"),
});

const STEPS = ["Personal Info", "Experience", "Education", "Skills"];

type ResumeFormProps = {
  onSubmit: (data: ResumeFormData) => void;
  initialData?: Partial<ResumeFormData>;
  isLoading?: boolean;
};

export function ResumeForm({ onSubmit, initialData, isLoading = false }: ResumeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(
      currentStep === 1
        ? step1Schema
        : currentStep === 2
        ? step2Schema
        : currentStep === 3
        ? step3Schema
        : step4Schema
    ),
    defaultValues: {
      personal: {
        name: initialData?.personal?.name || "",
        email: initialData?.personal?.email || "",
        phone: initialData?.personal?.phone || "",
        linkedin: initialData?.personal?.linkedin || "",
        portfolio: initialData?.personal?.portfolio || "",
      },
      experience: initialData?.experience || [
        { company: "", role: "", description: "", startDate: "", endDate: "" },
      ],
      education: initialData?.education || [{ school: "", degree: "", year: "" }],
      skillsInput: initialData?.skills?.join(", ") || "",
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formErrors = errors as any;

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: "experience",
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: "education",
  });

  const handleNext = async () => {
    const stepFields: Record<number, Array<"personal.name" | "personal.email" | "personal.phone" | "personal.linkedin" | "personal.portfolio" | "experience" | "education" | "skillsInput">> = {
      1: ["personal.name", "personal.email", "personal.phone", "personal.linkedin", "personal.portfolio"],
      2: ["experience"],
      3: ["education"],
      4: ["skillsInput"],
    };

    const isValid = await trigger(stepFields[currentStep]);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFormSubmit = (data: any) => {
    const skillsArray = (data.skillsInput || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const finalData: ResumeFormData = {
      personal: {
        name: data.personal?.name || "",
        email: data.personal?.email || "",
        phone: data.personal?.phone || "",
        linkedin: data.personal?.linkedin || "",
        portfolio: data.personal?.portfolio || "",
      },
      experience: data.experience || [],
      education: data.education || [],
      skills: skillsArray,
    };
    onSubmit(finalData);
  };

  return (
    <Card className="bg-slate-950/20 border border-slate-900 shadow-xl p-6 md:p-8 space-y-8">
      <ProgressSteps steps={STEPS} currentStep={currentStep} />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pt-4">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="John Doe"
                error={formErrors.personal?.name?.message}
                {...register("personal.name")}
              />
              <Input
                label="Email Address"
                placeholder="johndoe@example.com"
                type="email"
                error={formErrors.personal?.email?.message}
                {...register("personal.email")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                error={formErrors.personal?.phone?.message}
                {...register("personal.phone")}
              />
              <Input
                label="LinkedIn URL (Optional)"
                placeholder="https://linkedin.com/in/username"
                error={formErrors.personal?.linkedin?.message}
                {...register("personal.linkedin")}
              />
              <Input
                label="Portfolio URL (Optional)"
                placeholder="https://portfolio.com"
                error={formErrors.personal?.portfolio?.message}
                {...register("personal.portfolio")}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Work Experience</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendExp({ company: "", role: "", description: "", startDate: "", endDate: "" })}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Work
              </Button>
            </div>

            {formErrors.experience && typeof formErrors.experience.message === "string" && (
              <p className="text-sm text-red-500 font-medium">{formErrors.experience.message}</p>
            )}

            <div className="space-y-6">
              {expFields.map((field, idx) => (
                <div key={field.id} className="relative p-6 border border-slate-900 bg-slate-950/40 rounded-xl space-y-4">
                  {expFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExp(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1"
                      aria-label="Remove work experience"
                      title="Remove work experience"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      placeholder="e.g. Google"
                      error={formErrors.experience?.[idx]?.company?.message}
                      {...register(`experience.${idx}.company` as const)}
                    />
                    <Input
                      label="Job Title / Role"
                      placeholder="e.g. Frontend Engineer"
                      error={formErrors.experience?.[idx]?.role?.message}
                      {...register(`experience.${idx}.role` as const)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      placeholder="e.g. Jan 2023"
                      error={formErrors.experience?.[idx]?.startDate?.message}
                      {...register(`experience.${idx}.startDate` as const)}
                    />
                    <Input
                      label="End Date"
                      placeholder="e.g. Present or Dec 2025"
                      error={formErrors.experience?.[idx]?.endDate?.message}
                      {...register(`experience.${idx}.endDate` as const)}
                    />
                  </div>

                  <Textarea
                    label="Description of Responsibilities"
                    placeholder="Built responsive interfaces, optimized performance by 30%, and led a team of 4..."
                    error={formErrors.experience?.[idx]?.description?.message}
                    {...register(`experience.${idx}.description` as const)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Education History</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendEdu({ school: "", degree: "", year: "" })}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Education
              </Button>
            </div>

            {formErrors.education && typeof formErrors.education.message === "string" && (
              <p className="text-sm text-red-500 font-medium">{formErrors.education.message}</p>
            )}

            <div className="space-y-6">
              {eduFields.map((field, idx) => (
                <div key={field.id} className="relative p-6 border border-slate-900 bg-slate-950/40 rounded-xl space-y-4">
                  {eduFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(idx)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-red-400 p-1"
                      aria-label="Remove education entry"
                      title="Remove education entry"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="School / University"
                        placeholder="e.g. Stanford University"
                        error={formErrors.education?.[idx]?.school?.message}
                        {...register(`education.${idx}.school` as const)}
                      />
                    </div>
                    <div>
                      <Input
                        label="Graduation Year"
                        placeholder="e.g. 2024"
                        error={formErrors.education?.[idx]?.year?.message}
                        {...register(`education.${idx}.year` as const)}
                      />
                    </div>
                  </div>

                  <Input
                    label="Degree & Major"
                    placeholder="e.g. B.S. in Computer Science"
                    error={formErrors.education?.[idx]?.degree?.message}
                    {...register(`education.${idx}.degree` as const)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Skills & Core Competencies</h3>
            <Textarea
              label="Key Skills"
              placeholder="React, TypeScript, Next.js, Node.js, REST APIs, Tailwind CSS, System Design, Git..."
              error={formErrors.skillsInput?.message}
              {...register("skillsInput")}
            />
            <p className="text-xs text-slate-500 font-semibold">
              Enter your skills separated by commas. We will automatically parse them into structured badges on your resume.
            </p>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-900 pt-6 mt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={handleNext} disabled={isLoading}>
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" isLoading={isLoading}>
              <Save className="h-5 w-5 mr-2" />
              Generate Resume
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
