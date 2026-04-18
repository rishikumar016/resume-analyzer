import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, isDatabaseConfigured } from "@/lib/db";
import { analyses, resumes } from "@/lib/db/schema";
import { AnalysisResultsView } from "./results-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisResultPage({ params }: PageProps) {
  const { id } = await params;

  if (!db || !isDatabaseConfigured) {
    notFound();
  }

  const result = await db
    .select()
    .from(analyses)
    .innerJoin(resumes, eq(analyses.resumeId, resumes.id))
    .where(eq(analyses.id, id))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const { analyses: analysis, resumes: resume } = result[0];

  // Safely cast jsonb columns back to their expected shapes
  const scores = analysis.scores as {
    relevance: number;
    experience: number;
    skills: number;
    education: number;
    formatting: number;
    impact: number;
  };

  const extractedData = analysis.extractedData as {
    name: string;
    email: string | null;
    phone: string | null;
    summary: string;
    skills: Array<{
      name: string;
      category: string;
      proficiency: string;
    }>;
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

  const suggestions = analysis.suggestions as Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }>;

  const jobMatch = analysis.jobMatch as {
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    recommendations: string[];
  } | null;

  return (
    <AnalysisResultsView
      analysisId={analysis.id}
      overallScore={analysis.overallScore}
      scores={scores}
      extractedData={extractedData}
      suggestions={suggestions}
      jobMatch={jobMatch}
      jobDescription={analysis.jobDescription}
      fileName={resume.fileName}
      analyzedAt={analysis.analyzedAt.toISOString()}
    />
  );
}
