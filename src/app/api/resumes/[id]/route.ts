import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { resumes, analyses } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!db || !isDatabaseConfigured) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    // Verify user owns this resume
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const resume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (resume.length === 0) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    if (user && resume[0].userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get analysis data too
    const analysis = await db
      .select()
      .from(analyses)
      .where(eq(analyses.resumeId, id))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: {
        resume: resume[0],
        analysis: analysis.length > 0 ? analysis[0] : null,
      },
    });
  } catch (error) {
    console.error("GET /api/resumes/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!db || !isDatabaseConfigured) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      );
    }

    // Verify user owns this resume
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const resume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, id))
      .limit(1);

    if (resume.length === 0) {
      return NextResponse.json(
        { success: false, error: "Resume not found" },
        { status: 404 }
      );
    }

    if (user && resume[0].userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update resume data and/or template
    const updateData: Record<string, unknown> = {};
    if (body.resumeData !== undefined) {
      updateData.resumeData = body.resumeData;
    }
    if (body.selectedTemplate !== undefined) {
      updateData.selectedTemplate = body.selectedTemplate;
    }
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(resumes)
      .set(updateData)
      .where(eq(resumes.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/resumes/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resume" },
      { status: 500 }
    );
  }
}
