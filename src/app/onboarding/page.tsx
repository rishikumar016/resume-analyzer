"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAnalyzeResumeMutation } from "@/app/query";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type OnboardingValues = {
  jobDescription: string;
};

const STEPS = [
  {
    label: "Upload & Context",
    description: "Provide the source materials for analysis.",
  },
  {
    label: "Processing",
    description: "AI evaluates role-fit, structure, and strengths.",
  },
  {
    label: "Editorial Review",
    description: "Review your personalized report and recommendations.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeResumeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeStep = 0;

  const { register, handleSubmit } = useForm<OnboardingValues>({
    defaultValues: {
      jobDescription: "",
    },
  });

  const onSubmit = async (values: OnboardingValues) => {
    if (!file) return;
    setError(null);

    try {
      const result = await analyzeMutation.mutateAsync({
        file,
        jobDescription: values.jobDescription,
      });

      if (result.analysisId) {
        router.push(`/dashboard/analysis/${result.analysisId}`);
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6 lg:py-8">
        <aside className="hidden w-full max-w-xs shrink-0 flex-col justify-between lg:flex">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Editorial Intelligence
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                New analysis
              </h1>
            </div>

            <div className="space-y-4">
              {STEPS.map((step, index) => {
                const isActive = index === activeStep;
                const isComplete = index < activeStep;

                return (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "flex size-6 items-center justify-center rounded-full",
                          isActive || isComplete
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <div className="size-2 rounded-full bg-current" />
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="h-10 w-px bg-border" />
                      )}
                    </div>

                    <div className="space-y-1 pb-2">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border-0 bg-muted/50 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  The system reviews clarity, relevance, and presentation to
                  create a sharper hiring narrative.
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl tracking-tight">
                Provide documents
              </CardTitle>
              <CardDescription>
                Upload your resume and optionally paste the target job
                description for a more tailored review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-foreground">
                      Resume document
                    </label>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-secondary-foreground">
                      PDF only
                    </span>
                  </div>

                  <ResumeUploader
                    onFileSelect={setFile}
                    selectedFile={file}
                    onClear={() => setFile(null)}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="onboarding-job-desc"
                  >
                    Target job description
                  </label>
                  <Textarea
                    id="onboarding-job-desc"
                    rows={6}
                    placeholder="Paste the full job description here. We use this to analyze skills gaps and optimize your narrative focus..."
                    className="min-h-36 border-0 bg-muted/60 shadow-none"
                    {...register("jobDescription")}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Separator />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={!file || analyzeMutation.isPending}
                    className="gap-2"
                  >
                    {analyzeMutation.isPending ? (
                      <>
                        <Loader2
                          data-icon="inline-start"
                          className="h-4 w-4 animate-spin"
                        />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        Analyze Resume
                        <ArrowRight
                          data-icon="inline-end"
                          className="h-4 w-4"
                        />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
