"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Download,
  Edit2,
  FileText,
  Sparkles,
  Zap,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { ResumePreview } from "@/components/ResumePreview";
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
import { Textarea } from "@/components/ui/textarea";
import {
  getScoreLabel,
  getScoreBadgeVariant,
  getPriorityVariant,
  formatAnalysisDate,
} from "@/lib/analysis-utils";
import { useSaveAnalysisMutation } from "@/app/query";

interface Suggestion {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestedText?: string;
  isApplied?: boolean;
}

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
  suggestions: Suggestion[];
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

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const percentage = score / 100;
  const offset = circumference - percentage * circumference;

  const getColor = () => {
    if (score >= 85) return "#10b981"; // green
    if (score >= 70) return "#f59e0b"; // amber
    if (score >= 50) return "#ef4444"; // red
    return "#ef4444";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" className="transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-muted"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <Badge variant={getScoreBadgeVariant(score)}>
        {getScoreLabel(score)}
      </Badge>
    </div>
  );
}

function QuickFixesPanel({ suggestions }: { suggestions: Suggestion[] }) {
  const highCount = suggestions.filter((s) => s.priority === "high").length;
  if (highCount === 0) return null;

  return (
    <Card className="border-0 shadow-sm bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Quick Fixes</p>
            <p className="text-sm text-muted-foreground">
              {highCount} critical improvement{highCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalysisResultsView({
  analysisId,
  overallScore,
  scores,
  extractedData,
  suggestions: initialSuggestions,
  jobMatch,
  jobDescription,
  fileName,
  analyzedAt,
}: AnalysisResultsViewProps) {
  const [editedSuggestions, setEditedSuggestions] =
    useState<Suggestion[]>(initialSuggestions);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const saveMutation = useSaveAnalysisMutation(analysisId);
  const roleHint = extractedData.experience?.[0]?.role || "your target role";

  const handleEdit = (index: number) => {
    setEditingId(index);
    setEditText(editedSuggestions[index].suggestedText || "");
  };

  const handleSaveSuggestion = async (index: number) => {
    const updated = [...editedSuggestions];
    updated[index] = { ...updated[index], suggestedText: editText };
    setEditedSuggestions(updated);
    setEditingId(null);

    try {
      await saveMutation.mutateAsync(updated);
      toast.success("Suggestions saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save suggestions"
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveAll = async () => {
    try {
      await saveMutation.mutateAsync(editedSuggestions);
      toast.success("All suggestions saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save suggestions"
      );
    }
  };

  const handleApplySuggestion = async (index: number) => {
    const suggestion = editedSuggestions[index];
    if (!suggestion.suggestedText) return;

    toast.promise(
      (async () => {
        // Update local state to mark as applied
        const updated = [...editedSuggestions];
        updated[index] = {
          ...updated[index],
          isApplied: true,
        };
        setEditedSuggestions(updated);

        // Save to DB
        await saveMutation.mutateAsync(updated);
      })(),
      {
        loading: "Applying suggestion...",
        success: "Suggestion applied to resume!",
        error: "Failed to apply suggestion",
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* LEFT PANEL - Resume Preview (50%) */}
      <aside className="w-1/2 shrink-0 border-r overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <ResumePreview extractedData={extractedData} fileName={fileName} />
        </div>
        <div className="border-t p-4 bg-white">
          <Button variant="secondary" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </aside>

      {/* RIGHT PANEL - Analysis (50%) */}
      <main className="w-1/2 overflow-y-auto p-6 space-y-6">
        {/* Score Ring */}
        <div className="flex justify-center">
          <ScoreRing score={overallScore} />
        </div>

        {/* Quick Fixes */}
        <QuickFixesPanel suggestions={editedSuggestions} />

        {/* Score Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardDescription>Score breakdown</CardDescription>
            <div className="grid gap-3 sm:grid-cols-3 mt-4">
              {[
                { label: "Relevance", value: scores.relevance },
                { label: "Formatting", value: scores.formatting },
                { label: "Impact", value: scores.impact },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-muted/60 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {item.value}/100
                  </p>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Analysis Tabs */}
        <AnalysisScoreTabs
          scores={scores}
          extractedData={{
            summary: extractedData.summary,
            skills: extractedData.skills,
          }}
          jobDescription={jobDescription}
        />

        {/* Editable Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Resume Improvement Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {editedSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">
                        {suggestion.title}
                      </p>
                      <Badge variant={getPriorityVariant(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </div>
                </div>

                {/* AI Suggested Text */}
                {editingId === idx ? (
                  <div className="space-y-2 bg-muted/50 p-3 rounded">
                    <p className="text-xs font-medium text-muted-foreground">
                      AI Suggested Text
                    </p>
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="text-sm"
                      rows={3}
                      disabled={saveMutation.isPending}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveSuggestion(idx)}
                        className="gap-1"
                        disabled={saveMutation.isPending}
                      >
                        {saveMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="gap-1"
                        disabled={saveMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : suggestion.suggestedText ? (
                  <div className="bg-muted/50 p-3 rounded space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      AI Suggestion
                    </p>
                    <p className="text-sm text-foreground italic">
                      "{suggestion.suggestedText}"
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {suggestion.isApplied ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Applied to Resume
                        </Badge>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(idx)}
                            className="gap-1"
                            variant="default"
                            disabled={saveMutation.isPending}
                          >
                            {saveMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                            Apply to Resume
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(idx)}
                            className="gap-1"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(idx)}
                    className="gap-1"
                  >
                    <Edit2 className="h-4 w-4" />
                    Add Suggestion
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Job Match */}
        {jobMatch && (
          <AnalysisDetailsAccordion
            suggestions={[]}
            extractedData={{
              experience: extractedData.experience,
              education: extractedData.education,
            }}
            jobMatch={jobMatch}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pb-6">
          <Button
            variant="default"
            onClick={handleSaveAll}
            disabled={saveMutation.isPending}
            className="gap-2"
          >
            {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Auto-Apply All Fixes
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/history">
              <FileText className="h-4 w-4 mr-2" />
              View Previous Versions
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard/new">
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze New Resume
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
