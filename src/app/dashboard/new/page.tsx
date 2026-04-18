"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAnalyzeResumeMutation } from "@/app/query";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";

type NewAnalysisValues = {
  jobDescription: string;
};

export default function NewAnalysisPage() {
  const router = useRouter();
  const analyzeMutation = useAnalyzeResumeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<NewAnalysisValues>({
    defaultValues: {
      jobDescription: "",
    },
  });

  const onSubmit = async (values: NewAnalysisValues) => {
    if (!file) return;
    setError(null);

    try {
      const result = await analyzeMutation.mutateAsync({
        file,
        jobDescription: values.jobDescription,
      });

      if (result.analysisId) {
        router.push(`/dashboard/analysis/${result.analysisId}`);
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <h1 className="text-sm font-semibold">New analysis</h1>
      </header>

      <div className="flex-1 p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex max-w-xl flex-col gap-6"
        >
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Analyze a resume
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload a PDF and optionally provide a job description.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resume file</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUploader
                onFileSelect={setFile}
                selectedFile={file}
                onClear={() => setFile(null)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Job description{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="jobDescription">Role details</FieldLabel>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste a job description to get a match score and tailored recommendations..."
                    {...register("jobDescription")}
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!file || analyzeMutation.isPending}
            className="w-full gap-2"
            size="lg"
          >
            {analyzeMutation.isPending ? (
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
        </form>
      </div>
    </div>
  );
}
