import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { analyses } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

interface PatchRequest {
  suggestions: Array<{
    category: string;
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    suggestedText?: string;
  }>;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!db || !isDatabaseConfigured) {
      return Response.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body: PatchRequest = await req.json();

    // Verify auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Update analysis
    await db
      .update(analyses)
      .set({
        suggestions: body.suggestions as unknown,
      })
      .where(eq(analyses.id, id));

    return Response.json({
      success: true,
      message: "Analysis updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/analyses/[id] error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
