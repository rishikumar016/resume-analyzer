"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileSearch,
  Upload,
  Briefcase,
  CheckCircle2,
  Loader2,
  MoveRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeUploader } from "@/components/ResumeUploader";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Upload resume", icon: Upload },
  { label: "Job details", icon: Briefcase },
  { label: "Analyze", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Analysis failed.");
      }

      // Redirect to dashboard — the analysis is saved server-side
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-2 px-4 py-3">
          <FileSearch className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold tracking-tight">
            Resume Analyzer
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Step indicator */}
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

          {/* Step content */}
          <Card>
            <CardContent className="pt-6 space-y-5">
              {step === 0 && (
                <>
                  <div className="text-center space-y-1">
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
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Target job details
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Optional — helps us tailor the analysis to a specific role.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="jobTitle" className="text-sm font-medium">
                        Job title
                      </label>
                      <input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Senior Frontend Engineer"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label
                        htmlFor="jobDesc"
                        className="text-sm font-medium"
                      >
                        Job description
                      </label>
                      <textarea
                        id="jobDesc"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description for a match analysis..."
                        className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 resize-y"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setStep(0)}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
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
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Ready to analyze
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll score your resume and provide actionable
                      insights.
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Resume</span>
                      <span className="font-medium truncate max-w-[60%]">
                        {file?.name}
                      </span>
                    </div>
                    {jobTitle && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Target role
                        </span>
                        <span className="font-medium">{jobTitle}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
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
                      variant="outline"
                      className="gap-2"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      {loading ? (
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
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
