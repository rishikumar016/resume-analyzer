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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

function getPriorityVariant(
  priority: "high" | "medium" | "low",
): "default" | "secondary" | "outline" | "destructive" {
  if (priority === "high") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

function formatAnalysisDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const RESULT_TABS = [
  {
    key: "overview",
    label: "Overview",
    text: "A top-level editorial read on the overall structure and narrative quality.",
    scoreKeys: ["formatting", "impact"] as const,
  },
  {
    key: "content",
    label: "Content",
    text: "How well your experience and positioning align to the intended role.",
    scoreKeys: ["relevance", "experience"] as const,
  },
  {
    key: "structure",
    label: "Structure",
    text: "Section hierarchy, readability, and how clearly the document is organized.",
    scoreKeys: ["formatting", "education"] as const,
  },
  {
    key: "skills",
    label: "Skills",
    text: "Skill coverage, role-fit signals, and the strength of your technical profile.",
    scoreKeys: ["skills", "relevance"] as const,
  },
] as const;

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
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

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

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
              {RESULT_TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className="py-2.5">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {RESULT_TABS.map((tab) => {
              const average = Math.round(
                tab.scoreKeys.reduce((sum, key) => sum + scores[key], 0) /
                  tab.scoreKeys.length,
              );

              return (
                <TabsContent key={tab.key} value={tab.key}>
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-base">
                            {tab.label}
                          </CardTitle>
                          <CardDescription>{tab.text}</CardDescription>
                        </div>
                        <Badge variant={getScoreBadgeVariant(average)}>
                          {getScoreLabel(average)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {tab.scoreKeys.map((scoreKey) => (
                          <div
                            key={scoreKey}
                            className="rounded-lg bg-muted/60 p-4"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                              {scoreKey.charAt(0).toUpperCase() +
                                scoreKey.slice(1)}
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-foreground">
                              {scores[scoreKey]}
                              <span className="ml-1 text-sm font-medium text-muted-foreground">
                                /100
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {extractedData.summary ||
                          "No summary was extracted for this section."}
                      </p>

                      {tab.key === "skills" &&
                        extractedData.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {extractedData.skills.slice(0, 12).map((skill) => (
                              <Badge key={skill.name} variant="secondary">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        )}

                      {tab.key === "overview" && jobDescription && (
                        <div className="rounded-lg bg-muted/60 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Target brief
                          </p>
                          <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                            {jobDescription}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                defaultValue={[
                  "suggestions",
                  "experience",
                  "education",
                  ...(jobMatch ? ["match"] : []),
                ]}
                className="px-6"
              >
                <AccordionItem value="suggestions">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">
                          Resume improvement checklist
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {
                            suggestions.filter((s) => s.priority === "high")
                              .length
                          }{" "}
                          high-priority items remaining
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-col gap-3">
                      {sortedSuggestions.map((suggestion, index) => (
                        <div
                          key={`${suggestion.title}-${index}`}
                          className="rounded-lg bg-muted/60 p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              {suggestion.priority === "high" ? (
                                <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
                              ) : (
                                <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {suggestion.title}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                  {suggestion.description}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={getPriorityVariant(suggestion.priority)}
                            >
                              {suggestion.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="experience">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <p className="text-sm font-semibold text-foreground">
                      Experience summary
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-col gap-3">
                      {extractedData.experience.length > 0 ? (
                        extractedData.experience.map((item, index) => (
                          <div
                            key={`${item.company}-${index}`}
                            className="rounded-lg bg-muted/60 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {item.role}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.duration}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.company}
                            </p>
                            <ul className="mt-3 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                              {item.highlights.map((highlight, idx) => (
                                <li key={`${item.company}-highlight-${idx}`}>
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No experience data was extracted.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="education">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <p className="text-sm font-semibold text-foreground">
                      Education
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="flex flex-col gap-3">
                      {extractedData.education.length > 0 ? (
                        extractedData.education.map((item, index) => (
                          <div
                            key={`${item.institution}-${index}`}
                            className="rounded-lg bg-muted/60 p-4"
                          >
                            <p className="text-sm font-semibold text-foreground">
                              {item.degree}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.institution} · {item.field}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.year}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No education details were extracted.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {jobMatch && (
                  <AccordionItem value="match">
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          Job match analysis
                        </p>
                        <Badge
                          variant={getScoreBadgeVariant(
                            jobMatch.matchPercentage,
                          )}
                        >
                          {jobMatch.matchPercentage}% match
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pb-4">
                      <Progress value={jobMatch.matchPercentage} />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Matched skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {jobMatch.matchedSkills.length > 0 ? (
                              jobMatch.matchedSkills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No matched skills recorded.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Missing skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {jobMatch.missingSkills.length > 0 ? (
                              jobMatch.missingSkills.map((skill) => (
                                <Badge key={skill} variant="destructive">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No missing skills were identified.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {jobMatch.recommendations.length > 0 && (
                        <div className="rounded-lg bg-muted/60 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Recommendations
                          </p>
                          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                            {jobMatch.recommendations.map(
                              (recommendation, index) => (
                                <li key={`recommendation-${index}`}>
                                  {recommendation}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </CardContent>
          </Card>

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
