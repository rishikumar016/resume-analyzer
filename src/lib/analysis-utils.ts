export function getScoreLabel(score: number): string {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Weak";
}

export function getScoreBadgeVariant(
  score: number
): "default" | "secondary" | "outline" | "destructive" {
  if (score >= 85) return "default";
  if (score >= 70) return "secondary";
  if (score >= 50) return "outline";
  return "destructive";
}

export function getPriorityVariant(
  priority: "high" | "medium" | "low"
): "destructive" | "secondary" | "outline" {
  if (priority === "high") return "destructive";
  if (priority === "medium") return "secondary";
  return "outline";
}

export function formatAnalysisDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
