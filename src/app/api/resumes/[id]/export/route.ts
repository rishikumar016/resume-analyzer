import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { resumes } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

// Helper function to generate HTML from resume data
function generateResumeHTML(
  resumeData: Record<string, unknown>,
  template: string = "modern"
) {
  const basics = (resumeData.basics as Record<string, unknown>) || {};
  const work = Array.isArray(resumeData.work) ? resumeData.work : [];
  const education = Array.isArray(resumeData.education) ? resumeData.education : [];
  const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

  const name = (basics.name as string) || "Resume";
  const email = (basics.email as string) || "";
  const phone = (basics.phone as string) || "";
  const summary = (basics.summary as string) || "";

  const fontFamily = template === "ats" ? "sans-serif" : "serif";
  const fontSize = template === "creative" ? "14px" : "11px";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; }
        body {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          line-height: 1.5;
          color: #333;
          padding: 40px;
        }
        h1 { font-size: 24px; margin-bottom: 5px; }
        .contact { font-size: 10px; color: #666; margin-bottom: 15px; }
        .contact span { margin-right: 15px; }
        h2 { font-size: 13px; font-weight: bold; margin-top: 15px; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .section { margin-bottom: 10px; }
        .job { margin-bottom: 12px; }
        .job-title { font-weight: bold; }
        .job-meta { font-size: 10px; color: #666; }
        .job-highlights { margin: 5px 0; margin-left: 20px; font-size: 10px; }
        .job-highlights li { margin-bottom: 3px; }
        .edu-item { margin-bottom: 8px; }
        .edu-degree { font-weight: bold; }
        .edu-school { font-size: 10px; color: #666; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-badge {
          background-color: #f0f0f0;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 10px;
          border: 1px solid #ddd;
        }
        .summary { margin-bottom: 15px; font-size: 11px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="contact">
        ${email ? `<span>${email}</span>` : ""}
        ${phone ? `<span>${phone}</span>` : ""}
      </div>

      ${
        summary
          ? `
        <div class="summary">${summary}</div>
      `
          : ""
      }

      ${
        Array.isArray(work) && work.length > 0
          ? `
        <h2>EXPERIENCE</h2>
        ${(work as any[])
          .map(
            (job) => `
          <div class="job">
            <div class="job-title">${(job.position as string) || ""}</div>
            <div class="job-meta">${(job.name as string) || ""} ${job.startDate ? `• ${job.startDate}` : ""}</div>
            ${
              Array.isArray(job.highlights) && job.highlights.length > 0
                ? `
              <ul class="job-highlights">
                ${(job.highlights as string[]).map((h) => `<li>${h}</li>`).join("")}
              </ul>
            `
                : ""
            }
          </div>
        `
          )
          .join("")}
      `
          : ""
      }

      ${
        Array.isArray(education) && education.length > 0
          ? `
        <h2>EDUCATION</h2>
        ${(education as any[])
          .map(
            (edu) => `
          <div class="edu-item">
            <div class="edu-degree">${(edu.studyType as string) || ""} ${edu.area ? `in ${edu.area}` : ""}</div>
            <div class="edu-school">${(edu.institution as string) || ""} ${edu.startDate ? `• ${edu.startDate}` : ""}</div>
          </div>
        `
          )
          .join("")}
      `
          : ""
      }

      ${
        Array.isArray(skills) && skills.length > 0
          ? `
        <h2>SKILLS</h2>
        <div class="skills">
          ${(skills as any[])
            .map((skill) => `<div class="skill-badge">${(skill.name as string) || ""}</div>`)
            .join("")}
        </div>
      `
          : ""
      }
    </body>
    </html>
  `;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const template = searchParams.get("template") || "modern";

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

    // Generate HTML from resume data
    const resumeData = resume[0].resumeData as Record<string, unknown>;
    const html = generateResumeHTML(resumeData, template);

    // Return HTML as response (browser will handle PDF printing/download)
    // In a production app, you'd use a headless browser to convert to PDF
    const fileName = `${resume[0].fileName.replace(".pdf", "")}_${template}`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${fileName}.html"`,
      },
    });
  } catch (error) {
    console.error("GET /api/resumes/[id]/export failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export resume" },
      { status: 500 }
    );
  }
}
