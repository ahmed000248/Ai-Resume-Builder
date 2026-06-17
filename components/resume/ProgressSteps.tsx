import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type ProgressStepsProps = {
  steps: string[];
  currentStep: number;
};

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 z-10",
                    isCompleted
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isActive
                      ? "bg-slate-950 border-indigo-500 text-indigo-400"
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5 stroke-[3]" />
                  ) : (
                    <span>{stepNum}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-semibold hidden md:block transition-all",
                    isActive ? "text-indigo-400" : isCompleted ? "text-slate-300" : "text-slate-500"
                  )}
                >
                  {step}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div className="flex-1 h-[2px] bg-slate-900 mx-2 relative -translate-y-4 hidden md:block">
                  <div
                    className={cn(
                      "absolute inset-0 bg-indigo-600 transition-all duration-500",
                      stepNum < currentStep ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="text-center mt-4 md:hidden text-xs font-bold text-indigo-400 uppercase tracking-wider">
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]}
      </div>
    </div>
  );
}
