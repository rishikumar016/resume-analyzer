"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface JobMatchProps {
  jobMatch: {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  };
}

export function JobMatch({ jobMatch }: JobMatchProps) {
  const { matchPercentage, matchedSkills, missingSkills, recommendations } =
    jobMatch;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Job match analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Match percentage */}
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-sm text-muted-foreground">
              Overall match
            </span>
            <span
              className={cn(
                "text-2xl font-bold tabular-nums",
                matchPercentage >= 75
                  ? "text-emerald-600 dark:text-emerald-400"
                  : matchPercentage >= 50
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              )}
            >
              {matchPercentage}%
            </span>
          </div>
          <Progress
            value={matchPercentage}
            className={cn(
              "h-2",
              matchPercentage >= 75
                ? "[&>div]:bg-emerald-500"
                : matchPercentage >= 50
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-red-500"
            )}
          />
        </div>

        {/* Matched skills */}
        {matchedSkills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Matched skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                >
                  <Check className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Missing skills */}
        {missingSkills.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Missing skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                >
                  <X className="h-3 w-3 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="text-primary font-medium shrink-0">
                    {i + 1}.
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
