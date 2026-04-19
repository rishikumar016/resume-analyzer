import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { resumes, analyses, users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { ResumeEditor } from "@/components/resume-editor/ResumeEditor";

interface ResumePageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { id } = await params;

  // Check if database is configured
  if (!db || !isDatabaseConfigured) {
    return <div>Database not configured</div>;
  }

  // Verify user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get database user ID from auth ID
  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (dbUser.length === 0) {
    redirect("/sign-in");
  }

  const userId = dbUser[0].id;

  // Fetch resume
  const resumeData = await db
    .select()
    .from(resumes)
    .where(eq(resumes.id, id))
    .limit(1);

  if (resumeData.length === 0) {
    notFound();
  }

  const resume = resumeData[0];

  // Verify user owns this resume
  if (resume.userId !== userId) {
    redirect("/dashboard");
  }

  // Fetch analysis
  const analysisData = await db
    .select()
    .from(analyses)
    .where(eq(analyses.resumeId, id))
    .limit(1);

  const analysis = analysisData.length > 0 ? analysisData[0] : null;

  return (
    <ResumeEditor
      resumeId={id}
      resumeData={(resume.resumeData as Record<string, unknown>) || {}}
      selectedTemplate={resume.selectedTemplate || "modern"}
      fileName={resume.fileName}
      suggestions={(analysis?.suggestions as Array<any>) || []}
    />
  );
}
