"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  overallScore: number;
  scores: {
    relevance: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
    impact: number;
  };
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 70) return "text-blue-600 dark:text-blue-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getProgressColor(score: number): string {
  if (score >= 85) return "[&>div]:bg-emerald-500";
  if (score >= 70) return "[&>div]:bg-blue-500";
  if (score >= 50) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

function getGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

const SCORE_LABELS: Record<string, string> = {
  relevance: "Relevance",
  experience: "Experience",
  skills: "Skills",
  education: "Education",
  formatting: "Formatting",
  impact: "Impact",
};

export function ScoreCard({ overallScore, scores }: ScoreCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resume score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall score */}
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "text-5xl font-bold tabular-nums",
              getScoreColor(overallScore)
            )}
          >
            {overallScore}
          </div>
          <div>
            <div
              className={cn(
                "text-2xl font-semibold",
                getScoreColor(overallScore)
              )}
            >
              {getGrade(overallScore)}
            </div>
            <p className="text-xs text-muted-foreground">out of 100</p>
          </div>
        </div>

        {/* Individual scores */}
        <div className="space-y-3">
          {Object.entries(scores).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {SCORE_LABELS[key]}
                </span>
                <span className={cn("font-medium tabular-nums", getScoreColor(value))}>
                  {value}
                </span>
              </div>
              <Progress
                value={value}
                className={cn("h-1.5", getProgressColor(value))}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
