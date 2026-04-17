"use client";

import { useRef, useState } from "react";
import { FileSearch, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeUploader } from "@/components/ResumeUploader";
import { ScoreCard } from "@/components/ScoreCard";
import { SuggestionsList } from "@/components/SuggestionsList";
import { SkillsDisplay } from "@/components/SkillsDisplay";
import { JobMatch } from "@/components/JobMatch";
import { Hero } from "@/components/ui/animated-hero";
import type { ResumeAnalysis } from "@/types";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLDivElement>(null);

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
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold tracking-tight">
              Resume Analyzer
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {!analysis ? (
          /* ── Upload state ── */
          <div>
            <Hero
              onGetStarted={() =>
                uploadRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            />

            <div
              ref={uploadRef}
              className="mx-auto max-w-xl space-y-5 pb-20"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-semibold tracking-tight">
                  Upload your resume
                </h2>
                <p className="text-sm text-muted-foreground">
                  Drop a PDF to get started with the analysis.
                </p>
              </div>

              <ResumeUploader
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />

              {/* Job description (optional) */}
              <div className="space-y-1.5">
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
                  className="w-full min-h-28 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 resize-y"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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
            </div>
          </div>
        ) : (
          /* ── Results state ── */
          <div className="space-y-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {analysis.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {analysis.summary}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
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
