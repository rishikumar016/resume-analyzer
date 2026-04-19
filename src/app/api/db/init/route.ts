import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

/**
 * This route initializes the database schema
 * WARNING: Only use this in development/testing
 * In production, use proper database migration tools
 */
export async function POST(req: NextRequest) {
  // Security: Only allow from localhost in development
  const host = req.headers.get("host");
  if (!host?.includes("localhost") && process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      return NextResponse.json(
        { error: "DATABASE_URL not configured" },
        { status: 500 }
      );
    }

    const sql = postgres(connectionString, { prepare: false });

    // Drop existing tables (development only)
    await sql`DROP TABLE IF EXISTS "analyses" CASCADE`;
    await sql`DROP TABLE IF EXISTS "resumes" CASCADE`;
    await sql`DROP TABLE IF EXISTS "users" CASCADE`;

    // Create users table
    await sql`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "auth_id" text NOT NULL UNIQUE,
        "email" varchar(255) NOT NULL UNIQUE,
        "name" varchar(255),
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `;

    // Create resumes table
    await sql`
      CREATE TABLE "resumes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE,
        "file_name" varchar(255) NOT NULL,
        "raw_text" text NOT NULL,
        "resume_data" jsonb NOT NULL,
        "selected_template" varchar(50) DEFAULT 'modern',
        "uploaded_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `;

    // Create analyses table
    await sql`
      CREATE TABLE "analyses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "resume_id" uuid NOT NULL REFERENCES "resumes"("id") ON DELETE CASCADE,
        "job_description" text,
        "overall_score" integer NOT NULL,
        "scores" jsonb NOT NULL,
        "extracted_data" jsonb NOT NULL,
        "suggestions" jsonb NOT NULL,
        "job_match" jsonb,
        "analyzed_at" timestamp DEFAULT now() NOT NULL
      )
    `;

    await sql.end();

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database initialization failed",
      },
      { status: 500 }
    );
  }
}
