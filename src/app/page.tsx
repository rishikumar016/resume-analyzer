"use client";

import { useState } from "react";
import { FileSearch, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/ResumeUploader";
import { ScoreCard } from "@/components/ScoreCard";
import { SuggestionsList } from "@/components/SuggestionsList";
import { SkillsDisplay } from "@/components/SkillsDisplay";
import { JobMatch } from "@/components/JobMatch";
import type { ResumeAnalysis } from "@/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || "Analysis failed.");
      }

      setAnalysis(json.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center gap-3 px-4 py-4">
          <FileSearch className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">
            Resume Analyzer
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!analysis ? (
          /* ── Upload state ── */
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Analyze your resume
              </h2>
              <p className="text-muted-foreground">
                Get an AI-powered score, skill extraction, and actionable
                suggestions to improve your resume.
              </p>
            </div>

            {/* Upload card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload resume</CardTitle>
                <CardDescription>
                  Upload your resume as a PDF to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResumeUploader
                  onFileSelect={setFile}
                  selectedFile={file}
                  onClear={() => setFile(null)}
                />

                {/* Job description (optional) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Job description{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste a job description to get a match score and tailored recommendations..."
                    className="w-full min-h-[120px] rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Analyze button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={!file || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ── Results state ── */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {analysis.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {analysis.summary}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysis(null);
                  setFile(null);
                  setJobDescription("");
                  setError(null);
                }}
              >
                Analyze another
              </Button>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                {analysis.jobMatch && (
                  <TabsTrigger value="match">Job match</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-6 md:grid-cols-2">
                  <ScoreCard
                    overallScore={analysis.overallScore}
                    scores={analysis.scores}
                  />
                  <div className="space-y-6">
                    {/* Experience summary */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Experience</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysis.experience.map((exp, i) => (
                          <div key={i} className="border-l-2 border-primary/20 pl-3">
                            <p className="text-sm font-medium">{exp.role}</p>
                            <p className="text-xs text-muted-foreground">
                              {exp.company} &middot; {exp.duration}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Education */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Education</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {analysis.education.map((edu, i) => (
                          <div key={i} className="border-l-2 border-primary/20 pl-3">
                            <p className="text-sm font-medium">
                              {edu.degree} in {edu.field}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {edu.institution} &middot; {edu.year}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills">
                <SkillsDisplay skills={analysis.skills} />
              </TabsContent>

              <TabsContent value="suggestions">
                <SuggestionsList suggestions={analysis.suggestions} />
              </TabsContent>

              {analysis.jobMatch && (
                <TabsContent value="match">
                  <JobMatch jobMatch={analysis.jobMatch} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </main>
    </div>
  );
}
