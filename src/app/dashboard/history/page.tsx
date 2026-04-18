"use client";

import Link from "next/link";
import {
  ArrowRight,
  FilePlus,
  FileText,
  History as HistoryIcon,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAnalysesQuery } from "@/app/query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function getScoreTone(score: number) {
  if (score >= 85) return "text-emerald-600 bg-emerald-50";
  if (score >= 70) return "text-primary bg-primary/10";
  if (score >= 50) return "text-amber-700 bg-amber-50";
  return "text-destructive bg-destructive/10";
}

function formatAnalysisDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const { data: analyses = [], isLoading, error } = useAnalysesQuery();

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-sm font-semibold">History</h1>
      </header>

      <div className="flex-1 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Analysis history
              </h2>
              <p className="text-sm text-muted-foreground">
                Open any previous report to view its full analysis details.
              </p>
            </div>
            <Button className="gap-2" size="sm" asChild>
              <Link href="/dashboard/new">
                <FilePlus className="h-3.5 w-3.5" />
                New analysis
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading analysis history...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="py-8">
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Unable to load your analysis history."}
                </div>
              </CardContent>
            </Card>
          ) : analyses.length === 0 ? (
            <Card>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <HistoryIcon className="mb-3 h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium">No history yet</p>
                  <p className="mb-4 mt-1 text-xs text-muted-foreground">
                    Your completed analyses will appear here.
                  </p>
                  <Button size="sm" className="gap-2" asChild>
                    <Link href="/dashboard/new">
                      <FilePlus className="h-3.5 w-3.5" />
                      New analysis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {analyses.map((analysis) => {
                const topSuggestion = analysis.suggestions[0];
                const topSkills = analysis.extractedData.skills.slice(0, 4);

                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/analysis/${analysis.id}`}
                    className="block"
                  >
                    <Card className="transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <FileText className="h-4 w-4 text-primary" />
                              {analysis.extractedData.name || analysis.fileName}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {analysis.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatAnalysisDate(analysis.analyzedAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {analysis.jobMatch && (
                              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                                Match {analysis.jobMatch.matchPercentage}%
                              </span>
                            )}
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getScoreTone(analysis.overallScore)}`}
                            >
                              Score {analysis.overallScore}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {analysis.extractedData.summary ||
                            "Analysis summary available in the detail view."}
                        </p>

                        {topSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {topSkills.map((skill) => (
                              <span
                                key={`${analysis.id}-${skill.name}`}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-3 border-t pt-3">
                          <div className="flex items-start gap-2 text-xs text-muted-foreground">
                            <Sparkles className="mt-0.5 h-3.5 w-3.5 text-primary" />
                            <span>
                              {topSuggestion?.title ||
                                "Open the report to review recommendations."}
                            </span>
                          </div>
                          <span className="flex items-center gap-1 text-sm font-medium text-primary">
                            View details
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
