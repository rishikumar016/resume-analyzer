import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { resumeAnalysisSchema } from "@/types";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/ai/prompts";
import { extractTextFromPDF } from "@/lib/parser/pdf";
import { db, isDatabaseConfigured } from "@/lib/db";
import { resumes, analyses } from "@/lib/db/schema";

export const maxDuration = 60; // allow up to 60s for LLM response

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No resume file provided." },
        { status: 400 },
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are supported." },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File size must be under 10MB." },
        { status: 400 },
      );
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);

    // Run AI analysis with structured output
    const { object: analysis } = await generateObject({
      model: openai("gpt-5.4-mini"),
      schema: resumeAnalysisSchema,
      system: SYSTEM_PROMPT,
      prompt: buildUserPrompt(resumeText, jobDescription || undefined),
    });

    let savedToDatabase = false;

    if (db && isDatabaseConfigured) {
      try {
        const [resume] = await db
          .insert(resumes)
          .values({
            fileName: file.name,
            rawText: resumeText,
          })
          .returning();

        await db.insert(analyses).values({
          resumeId: resume.id,
          jobDescription: jobDescription || null,
          overallScore: analysis.overallScore,
          scores: analysis.scores,
          extractedData: {
            name: analysis.name,
            email: analysis.email,
            phone: analysis.phone,
            summary: analysis.summary,
            skills: analysis.skills,
            experience: analysis.experience,
            education: analysis.education,
          },
          suggestions: analysis.suggestions,
          jobMatch: analysis.jobMatch || null,
        });

        savedToDatabase = true;
      } catch (dbError) {
        console.error("Database save failed:", dbError);
      }
    }

    return NextResponse.json({ success: true, data: analysis, savedToDatabase });
  } catch (error) {
    console.error("Analysis failed:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
