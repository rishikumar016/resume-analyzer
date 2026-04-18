import { z } from "zod";

// ── Zod schemas for AI structured output ──

export const skillSchema = z.object({
  name: z.string(),
  category: z.enum([
    "technical",
    "soft",
    "tool",
    "language",
    "framework",
    "other",
  ]),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
});

export const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  highlights: z.array(z.string()),
});

export const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  year: z.string(),
});

export const resumeAnalysisSchema = z.object({
  // Extracted data
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  summary: z.string(),
  skills: z.array(skillSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),

  // Scoring (0-100)
  overallScore: z.number().min(0).max(100),
  scores: z.object({
    relevance: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
    education: z.number().min(0).max(100),
    formatting: z.number().min(0).max(100),
    impact: z.number().min(0).max(100),
  }),

  // Suggestions
  suggestions: z.array(
    z.object({
      category: z.enum([
        "content",
        "formatting",
        "skills",
        "experience",
        "general",
      ]),
      priority: z.enum(["high", "medium", "low"]),
      title: z.string(),
      description: z.string(),
    }),
  ),

  // Job match (only when job description provided)
  jobMatch: z
    .object({
      matchPercentage: z.number().min(0).max(100),
      matchedSkills: z.array(z.string()),
      missingSkills: z.array(z.string()),
      recommendations: z.array(z.string()),
    })
    .nullable(),
});

// ── Inferred types ──

export type Skill = z.infer<typeof skillSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;

// ── Request / Response types ──

export interface AnalyzeRequest {
  resumeText: string;
  jobDescription?: string;
}

export interface AnalyzeMutationInput {
  file: File;
  jobDescription?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: ResumeAnalysis;
  error?: string;
  savedToDatabase?: boolean;
  analysisId?: string | null;
}
