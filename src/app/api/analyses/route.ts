import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/lib/db";
import { analyses, resumes, users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    if (!db || !isDatabaseConfigured) {
      return NextResponse.json({ success: true, data: [] });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get the database user record for the authenticated user
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.authId, user.id))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const rows = await db
      .select({
        id: analyses.id,
        fileName: resumes.fileName,
        overallScore: analyses.overallScore,
        analyzedAt: analyses.analyzedAt,
        jobDescription: analyses.jobDescription,
        extractedData: analyses.extractedData,
        suggestions: analyses.suggestions,
        jobMatch: analyses.jobMatch,
      })
      .from(analyses)
      .innerJoin(resumes, eq(analyses.resumeId, resumes.id))
      .where(eq(resumes.userId, dbUser[0].id))
      .orderBy(desc(analyses.analyzedAt));

    const data = rows.map((row) => ({
      id: row.id,
      fileName: row.fileName,
      overallScore: row.overallScore,
      analyzedAt: row.analyzedAt.toISOString(),
      jobDescription: row.jobDescription,
      extractedData: row.extractedData,
      suggestions: row.suggestions,
      jobMatch: row.jobMatch,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
