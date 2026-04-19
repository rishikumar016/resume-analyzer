"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AnalysesResponse,
  AnalyzeMutationInput,
  AnalyzeResponse,
} from "@/types";

export const analysisKeys = {
  all: ["analyses"] as const,
  analyze: ["analyses", "analyze"] as const,
  history: ["analyses", "history"] as const,
};

async function analyzeResume({
  file,
  jobDescription,
}: AnalyzeMutationInput): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("resume", file);

  if (jobDescription?.trim()) {
    formData.append("jobDescription", jobDescription.trim());
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const result = (await response.json()) as AnalyzeResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Analysis failed.");
  }

  return result;
}

async function fetchAnalyses() {
  const response = await fetch("/api/analyses", {
    method: "GET",
    cache: "no-store",
  });

  const result = (await response.json()) as AnalysesResponse;

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Unable to load analysis history.");
  }

  return result.data ?? [];
}

export function useAnalyzeResumeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: analysisKeys.analyze,
    mutationFn: analyzeResume,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: analysisKeys.all });
    },
  });
}

export function useAnalysesQuery() {
  return useQuery({
    queryKey: analysisKeys.history,
    queryFn: fetchAnalyses,
  });
}

async function saveAnalysisSuggestions(
  analysisId: string,
  suggestions: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    suggestedText?: string;
  }>
) {
  const response = await fetch(`/api/analyses/${analysisId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ suggestions }),
  });

  const result = (await response.json()) as { success: boolean; error?: string };

  if (!response.ok || !result.success) {
    throw new Error(result.error || "Failed to save suggestions.");
  }

  return result;
}

export function useSaveAnalysisMutation(analysisId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (suggestions: Array<{
      category: string;
      priority: "high" | "medium" | "low";
      title: string;
      description: string;
      suggestedText?: string;
    }>) => saveAnalysisSuggestions(analysisId, suggestions),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: analysisKeys.all });
    },
  });
}
