"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AnalyzeMutationInput, AnalyzeResponse } from "@/types";

export const analysisKeys = {
  all: ["analyses"] as const,
  analyze: ["analyses", "analyze"] as const,
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
