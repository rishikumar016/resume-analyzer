"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface Suggestion {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
}

const PRIORITY_CONFIG = {
  high: {
    icon: AlertCircle,
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    bar: "bg-red-500",
  },
  medium: {
    icon: AlertTriangle,
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    bar: "bg-amber-500",
  },
  low: {
    icon: Info,
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    bar: "bg-blue-500",
  },
};

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  // Sort by priority
  const sorted = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Improvement suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.map((suggestion, i) => {
            const config = PRIORITY_CONFIG[suggestion.priority];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-4 border-l-4",
                  suggestion.priority === "high" && "border-l-red-500",
                  suggestion.priority === "medium" && "border-l-amber-500",
                  suggestion.priority === "low" && "border-l-blue-500"
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {suggestion.title}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0", config.badge)}
                      >
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
