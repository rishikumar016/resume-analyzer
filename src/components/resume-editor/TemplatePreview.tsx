"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TemplatePreviewProps {
  resumeData: Record<string, unknown>;
  template: "modern" | "ats" | "creative";
}

export function TemplatePreview({ resumeData, template }: TemplatePreviewProps) {
  const basics = useMemo(
    () => (typeof resumeData?.basics === "object" ? resumeData.basics : null),
    [resumeData]
  );

  const work = useMemo(
    () =>
      Array.isArray(resumeData?.work)
        ? (resumeData.work as Array<Record<string, unknown>>)
        : [],
    [resumeData]
  );

  const education = useMemo(
    () =>
      Array.isArray(resumeData?.education)
        ? (resumeData.education as Array<Record<string, unknown>>)
        : [],
    [resumeData]
  );

  const skills = useMemo(
    () =>
      Array.isArray(resumeData?.skills)
        ? (resumeData.skills as Array<Record<string, unknown>>)
        : [],
    [resumeData]
  );

  const renderBasicsTemplate = () => {
    if (!basics) return null;
    const basicsRecord = basics as Record<string, unknown>;
    const name = (basicsRecord.name as string) || "Your Name";
    const email = basicsRecord.email as string | undefined;
    const phone = basicsRecord.phone as string | undefined;
    const summary = basicsRecord.summary as string | undefined;

    return (
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        {(email || phone) && (
          <p className="text-sm text-muted-foreground mt-1">
            {email && <span>{email}</span>}
            {email && phone && <span> • </span>}
            {phone && <span>{phone}</span>}
          </p>
        )}
        {summary && <p className="text-sm text-foreground mt-3">{summary}</p>}
      </div>
    );
  };

  const renderWorkTemplate = () => {
    if (work.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-3">
          EXPERIENCE
        </h2>
        <div className="space-y-4">
          {work.map((job, idx) => {
            const position = (job.position as string) || "";
            const startDate = (job.startDate as string) || "";
            const name = (job.name as string) || "";
            const highlights = Array.isArray(job.highlights)
              ? (job.highlights as string[])
              : [];

            return (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-foreground">{position}</p>
                  <p className="text-xs text-muted-foreground">{startDate}</p>
                </div>
                <p className="text-sm text-muted-foreground">{name}</p>
                {highlights.length > 0 && (
                  <ul className="mt-2 ml-4 space-y-1 text-sm text-foreground">
                    {highlights.map((highlight, i) => (
                      <li key={i} className="list-disc">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEducationTemplate = () => {
    if (education.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-3">
          EDUCATION
        </h2>
        <div className="space-y-3">
          {education.map((edu, idx) => {
            const studyType = (edu.studyType as string) || "";
            const area = (edu.area as string) || "";
            const startDate = (edu.startDate as string) || "";
            const institution = (edu.institution as string) || "";

            return (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <p className="font-semibold text-foreground">
                    {studyType} {area && `in ${area}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{startDate}</p>
                </div>
                <p className="text-sm text-muted-foreground">{institution}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSkillsTemplate = () => {
    if (skills.length === 0) return null;
    return (
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground mb-3">SKILLS</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => {
            const skillRecord = skill as Record<string, unknown>;
            const skillName = (skillRecord.name as string) || "";

            return (
              <Badge key={idx} variant="outline" className="text-xs">
                {skillName}
              </Badge>
            );
          })}
        </div>
      </div>
    );
  };

  const getTemplateClass = () => {
    switch (template) {
      case "ats":
        return "font-sans";
      case "creative":
        return "font-sans";
      default:
        return "font-serif";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Preview ({template})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`bg-white p-6 rounded border min-h-96 overflow-y-auto ${getTemplateClass()} text-black text-sm`}>
          {renderBasicsTemplate()}
          {work.length > 0 && <Separator className="my-4" />}
          {renderWorkTemplate()}
          {education.length > 0 && <Separator className="my-4" />}
          {renderEducationTemplate()}
          {skills.length > 0 && <Separator className="my-4" />}
          {renderSkillsTemplate()}
        </div>
      </CardContent>
    </Card>
  );
}
