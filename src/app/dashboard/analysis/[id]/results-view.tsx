"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  Info,
  Sparkles,
  Zap,
} from "lucide-react";

import { AnalysisDetailsAccordion } from "../components/analysis-details-accordion";
import { AnalysisScoreTabs } from "../components/analysis-score-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultsViewProps {
  analysisId: string;
  overallScore: number;
  scores: {
    relevance: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
    impact: number;
  };
  extractedData: {
    name: string;
    email: string | null;
    phone: string | null;
    summary: string;
    skills: Array<{ name: string; category: string; proficiency: string }>;
    experience: Array<{
      company: string;
      role: string;
      duration: string;
      highlights: string[];
    }>;
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      year: string;
    }>;
  };
  suggestions: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;
  jobMatch: {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null;
  jobDescription: string | null;
  fileName: string;
  analyzedAt: string;
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Weak";
}

function getScoreBadgeVariant(
  score: number,
): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 85) return "default";
  if (score >= 70) return "secondary";
  if (score >= 50) return "outline";
  return "destructive";
}

function formatAnalysisDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AnalysisResultsView({
  analysisId,
  overallScore,
  scores,
  extractedData,
  suggestions,
  jobMatch,
  jobDescription,
  fileName,
  analyzedAt,
}: AnalysisResultsViewProps) {
  const highSuggestion = suggestions.find((s) => s.priority === "high");
  const formattedDate = formatAnalysisDate(analyzedAt);
  const roleHint = extractedData.experience?.[0]?.role || "your target role";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 pb-24 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Source document
              </CardTitle>
              <CardDescription>
                Resume snapshot, author details, and export actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Report ID
                  </p>
                  <Badge variant="outline">{analysisId.slice(0, 8)}</Badge>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded bg-background" />
                  <div className="h-2 w-4/5 rounded bg-background" />
                  <div className="h-2 w-2/3 rounded bg-background" />
                  <div className="h-px bg-border" />
                  <div className="h-2 w-5/6 rounded bg-background" />
                  <div className="h-2 w-3/4 rounded bg-background" />
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <p className="font-medium text-foreground">
                  {extractedData.name || "Candidate"}
                </p>
                {extractedData.email && (
                  <p className="text-muted-foreground">{extractedData.email}</p>
                )}
                {extractedData.phone && (
                  <p className="text-muted-foreground">{extractedData.phone}</p>
                )}
                <p className="text-xs text-muted-foreground">{fileName}</p>
              </div>

              <Button variant="secondary" className="w-full gap-2">
                <Download data-icon="inline-start" className="h-4 w-4" />
                Export PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/50 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Quick takeaway
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {highSuggestion?.title ||
                      "Your report is ready for review."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <section className="flex flex-col gap-6">
          <div className="grid gap-4 xl:grid-cols-[1.4fr_.9fr]">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardDescription>Aggregate rating</CardDescription>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <CardTitle className="text-4xl font-semibold tracking-tight">
                      {overallScore}
                      <span className="ml-1 text-base font-medium text-muted-foreground">
                        /100
                      </span>
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Positioning strength for {roleHint}
                    </p>
                  </div>
                  <Badge variant={getScoreBadgeVariant(overallScore)}>
                    {getScoreLabel(overallScore)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={overallScore} />
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Relevance", value: scores.relevance },
                    { label: "Formatting", value: scores.formatting },
                    { label: "Impact", value: scores.impact },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-muted/60 p-3"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {item.value}/100
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {highSuggestion && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Priority action
                  </CardTitle>
                  <CardDescription>
                    Tackle this first to improve the report fastest.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-foreground">
                    {highSuggestion.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {highSuggestion.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <AnalysisScoreTabs
            scores={scores}
            extractedData={{
              summary: extractedData.summary,
              skills: extractedData.skills,
            }}
            jobDescription={jobDescription}
          />

          <AnalysisDetailsAccordion
            suggestions={suggestions}
            extractedData={{
              experience: extractedData.experience,
              education: extractedData.education,
            }}
            jobMatch={jobMatch}
          />

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" asChild>
              <Link href="/dashboard/history">
                <FileText data-icon="inline-start" className="h-4 w-4" />
                View Previous Versions
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/new">
                <Sparkles data-icon="inline-start" className="h-4 w-4" />
                Analyze New Resume
                <ArrowRight data-icon="inline-end" className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
