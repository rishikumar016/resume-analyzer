"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAnalyzeResumeMutation } from "@/app/query";
import { ResumeUploader } from "@/components/ResumeUploader";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type OnboardingValues = {
  jobDescription: string;
};

/* ------------------------------------------------------------------ */
/*  Steps for the sidebar stepper                                      */
/* ------------------------------------------------------------------ */
const STEPS = [
  {
    label: "Upload & Context",
    description: "Provide the source materials for curation.",
  },
  {
    label: "Processing",
    description: "AI analyzes your resume against the role.",
  },
  {
    label: "Editorial Review",
    description: "Review your personalized report.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function OnboardingPage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeResumeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeStep = 0; // Always step 0 on this page

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
    <div className="flex min-h-screen bg-[#f8f9fe]">
      {/* ──────────────────────────────────────────────────────── */}
      {/*  LEFT SIDEBAR                                            */}
      {/* ──────────────────────────────────────────────────────── */}
      <aside className="hidden w-[320px] flex-col justify-between px-8 py-10 lg:flex">
        {/* Brand */}
        <div>
          <div className="mb-10">
            <h1
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "Manrope, var(--font-sans)",
                color: "#5056af",
              }}
            >
              Editorial Intelligence
            </h1>
            <p
              className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#757b84" }}
            >
              The Digital Curator
            </p>
          </div>

          {/* ── Stepper ──────────────────────────────────────── */}
          <div className="mb-8">
            <h2
              className="mb-6 text-base font-semibold tracking-tight"
              style={{
                fontFamily: "Manrope, var(--font-sans)",
                color: "#2d333a",
              }}
            >
              New Analysis
            </h2>

            <div className="relative flex flex-col gap-0">
              {STEPS.map((step, i) => {
                const isActive = i === activeStep;
                const isCompleted = i < activeStep;
                const isLast = i === STEPS.length - 1;

                return (
                  <div key={step.label} className="relative flex gap-3.5">
                    {/* Vertical connector line */}
                    {!isLast && (
                      <div
                        className="absolute left-[11px] top-[28px] h-[calc(100%-4px)] w-[2px]"
                        style={{
                          backgroundColor:
                            isCompleted || isActive ? "#5056af" : "#dde3ec",
                        }}
                      />
                    )}

                    {/* Dot / Check */}
                    <div className="relative z-10 flex-shrink-0 pt-[2px]">
                      {isCompleted ? (
                        <div
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-full"
                          style={{ backgroundColor: "#5056af" }}
                        >
                          <CheckCircle2
                            className="h-3.5 w-3.5"
                            style={{ color: "#fbf7ff" }}
                          />
                        </div>
                      ) : isActive ? (
                        <div
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-full"
                          style={{
                            backgroundColor: "#5056af",
                            boxShadow: "0 0 0 4px rgba(80, 86, 175, 0.15)",
                          }}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: "#fbf7ff" }}
                          />
                        </div>
                      ) : (
                        <div
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-full"
                          style={{ backgroundColor: "#eaeef5" }}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: "#adb2bb" }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Label & description */}
                    <div className="pb-7">
                      <p
                        className="text-sm font-semibold leading-snug"
                        style={{
                          fontFamily: "Inter, var(--font-sans)",
                          color:
                            isActive || isCompleted ? "#5056af" : "#757b84",
                        }}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <p
                          className="mt-1 text-xs leading-relaxed"
                          style={{
                            fontFamily: "Inter, var(--font-sans)",
                            color: "#757b84",
                          }}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── AI Insight Card ────────────────────────────────── */}
        <div
          className="rounded-2xl px-5 py-5"
          style={{ backgroundColor: "#e8eaf8" }}
        >
          <Sparkles className="mb-3 h-5 w-5" style={{ color: "#5056af" }} />
          <p
            className="text-xs font-medium leading-relaxed"
            style={{
              fontFamily: "Inter, var(--font-sans)",
              color: "#5a6068",
            }}
          >
            Our AI evaluates structural authority and data readability to ensure
            a premium editorial presentation.
          </p>
        </div>
      </aside>

      {/* ──────────────────────────────────────────────────────── */}
      {/*  MAIN CONTENT                                            */}
      {/* ──────────────────────────────────────────────────────── */}
      <main className="flex flex-1 items-start justify-center px-4 py-6 sm:px-8 lg:py-10">
        <div
          className="w-full max-w-[720px] rounded-3xl px-8 py-10 sm:px-10 sm:py-12"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 20px 40px rgba(45, 51, 58, 0.06)",
          }}
        >
          {/* ── Mobile Brand (visible < lg) ───────────────────── */}
          <div className="mb-8 lg:hidden">
            <h1
              className="text-lg font-bold tracking-tight"
              style={{
                fontFamily: "Manrope, var(--font-sans)",
                color: "#5056af",
              }}
            >
              Editorial Intelligence
            </h1>
            <p
              className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#757b84" }}
            >
              The Digital Curator
            </p>
          </div>

          {/* ── Heading ───────────────────────────────────────── */}
          <div className="mb-8">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-[1.75rem]"
              style={{
                fontFamily: "Manrope, var(--font-sans)",
                color: "#2d333a",
              }}
            >
              Provide Documents
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{
                fontFamily: "Inter, var(--font-sans)",
                color: "#5a6068",
              }}
            >
              Upload your current resume and paste the target job description.
              We process standard PDF formats.
            </p>
          </div>

          {/* ── Form ──────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {/* Resume Upload Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label
                  className="text-sm font-semibold"
                  style={{
                    fontFamily: "Inter, var(--font-sans)",
                    color: "#2d333a",
                  }}
                >
                  Resume Document
                </label>
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    backgroundColor: "#eaeef5",
                    color: "#5a6068",
                  }}
                >
                  PDF only
                </span>
              </div>

              <ResumeUploader
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />
            </div>

            {/* ── Separator using tonal shift ─────────────────── */}
            <div
              className="h-px w-full"
              style={{ backgroundColor: "#eaeef5" }}
            />

            {/* Job Description Section */}
            <div>
              <label
                className="mb-3 block text-sm font-semibold"
                htmlFor="onboarding-job-desc"
                style={{
                  fontFamily: "Inter, var(--font-sans)",
                  color: "#2d333a",
                }}
              >
                Target Job Description
              </label>
              <textarea
                id="onboarding-job-desc"
                rows={5}
                placeholder="Paste the full job description here. We use this to analyze skills gaps and optimize your narrative focus..."
                className="w-full resize-y rounded-xl px-4 py-3.5 text-sm leading-relaxed outline-none transition-all placeholder:text-[#adb2bb] focus:ring-2 focus:ring-[#9298f7]/40"
                style={{
                  fontFamily: "Inter, var(--font-sans)",
                  backgroundColor: "#f1f4fa",
                  color: "#2d333a",
                  border: "none",
                }}
                {...register("jobDescription")}
              />
            </div>

            {/* ── Error Message ────────────────────────────────── */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm font-medium"
                style={{
                  backgroundColor: "rgba(168, 54, 75, 0.08)",
                  color: "#a8364b",
                }}
              >
                {error}
              </div>
            )}

            {/* ── Separator ──────────────────────────────────── */}
            <div
              className="h-px w-full"
              style={{ backgroundColor: "#eaeef5" }}
            />

            {/* ── Submit ──────────────────────────────────────── */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!file || analyzeMutation.isPending}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200",
                  file && !analyzeMutation.isPending
                    ? "cursor-pointer hover:shadow-lg hover:shadow-[#5056af]/20 active:scale-[0.98]"
                    : "cursor-not-allowed opacity-50",
                )}
                style={{
                  fontFamily: "Inter, var(--font-sans)",
                  background: "linear-gradient(135deg, #5056af, #9298f7)",
                  color: "#fbf7ff",
                }}
              >
                {analyzeMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
