"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  FileSearch,
  Loader2,
  MoveRight,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAnalyzeResumeMutation } from "@/app/query";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Upload resume", icon: Upload },
  { label: "Job details", icon: Briefcase },
  { label: "Analyze", icon: CheckCircle2 },
];

type OnboardingValues = {
  jobTitle: string;
  jobDescription: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeResumeMutation();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch } = useForm<OnboardingValues>({
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
    },
  });

  const jobTitle = watch("jobTitle");
  const jobDescription = watch("jobDescription");

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-2 px-4 py-3">
          <FileSearch className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight">
            Resume Analyzer
          </span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                    i <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {i < step ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <s.icon className="h-3.5 w-3.5" />
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-10",
                      i < step ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
              >
                {step === 0 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-lg font-semibold tracking-tight">
                        Upload your resume
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Drop a PDF to get started with your first analysis.
                      </p>
                    </div>
                    <ResumeUploader
                      onFileSelect={setFile}
                      selectedFile={file}
                      onClear={() => setFile(null)}
                    />
                    <Button
                      type="button"
                      className="w-full gap-2"
                      disabled={!file}
                      onClick={() => setStep(1)}
                    >
                      Continue <MoveRight className="h-4 w-4" />
                    </Button>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-lg font-semibold tracking-tight">
                        Target job details
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Optional — helps us tailor the analysis to a specific
                        role.
                      </p>
                    </div>

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="jobTitle">Job title</FieldLabel>
                        <Input
                          id="jobTitle"
                          placeholder="e.g., Senior Frontend Engineer"
                          {...register("jobTitle")}
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="jobDesc">
                          Job description
                        </FieldLabel>
                        <Textarea
                          id="jobDesc"
                          placeholder="Paste the full job description for a match analysis..."
                          {...register("jobDescription")}
                        />
                      </Field>
                    </FieldGroup>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setStep(0)}
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="button"
                        className="flex-1 gap-2"
                        onClick={() => setStep(2)}
                      >
                        Continue <MoveRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="text-center">
                      <h2 className="text-lg font-semibold tracking-tight">
                        Ready to analyze
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        We&apos;ll score your resume and provide actionable
                        insights.
                      </p>
                    </div>

                    <div className="space-y-2 rounded-lg border bg-muted/30 p-4 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Resume</span>
                        <span className="max-w-[60%] truncate font-medium">
                          {file?.name}
                        </span>
                      </div>
                      {jobTitle && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">
                            Target role
                          </span>
                          <span className="font-medium">{jobTitle}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Job description
                        </span>
                        <span className="font-medium">
                          {jobDescription ? "Provided" : "Skipped"}
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setStep(1)}
                        disabled={analyzeMutation.isPending}
                      >
                        <ArrowLeft className="h-4 w-4" /> Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 gap-2"
                        disabled={analyzeMutation.isPending || !file}
                      >
                        {analyzeMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Analyze my resume
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
