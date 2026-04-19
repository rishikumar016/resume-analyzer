"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Lightbulb } from "lucide-react";

interface SuggestionCardProps {
  title: string;
  description: string;
  suggestedText: string;
  priority: "high" | "medium" | "low";
  isApplied?: boolean;
  onApply: () => Promise<void>;
}

export function SuggestionCard({
  title,
  description,
  suggestedText,
  priority,
  isApplied = false,
  onApply,
}: SuggestionCardProps) {
  const [isApplying, setIsApplying] = useState(false);

  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply();
    } catch (error) {
      console.error("Failed to apply suggestion:", error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <h3 className="font-semibold text-sm">{title}</h3>
                <Badge className={`text-xs ${getPriorityColor()}`}>
                  {priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Suggested Text:
            </p>
            <p className="text-sm italic text-foreground">
              "{suggestedText}"
            </p>
          </div>

          {isApplied ? (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Check className="h-4 w-4" />
              <span>Applied to resume</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isApplying}
              className="gap-2"
            >
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Apply Suggestion
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
