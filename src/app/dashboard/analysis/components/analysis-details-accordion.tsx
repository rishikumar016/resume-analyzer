"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getScoreBadgeVariant,
  getPriorityVariant,
} from "@/lib/analysis-utils";

type Suggestion = {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  suggestedText?: string;
};

type ExtractedData = {
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
  }>;
};

type JobMatch = {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
} | null;

interface AnalysisDetailsAccordionProps {
  suggestions: Suggestion[];
  extractedData: ExtractedData;
  jobMatch: JobMatch;
}

export function AnalysisDetailsAccordion({
  suggestions,
  extractedData,
  jobMatch,
}: AnalysisDetailsAccordionProps) {
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <Accordion
          type="multiple"
          defaultValue={[
            "suggestions",
            "experience",
            "education",
            ...(jobMatch ? ["match"] : []),
          ]}
          className="px-6"
        >
          <AccordionItem value="suggestions">
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
                    Resume improvement checklist
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {suggestions.filter((s) => s.priority === "high").length}{" "}
                    high-priority items remaining
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-3">
                {sortedSuggestions.map((suggestion, index) => (
                  <div
                    key={`${suggestion.title}-${index}`}
                    className="rounded-lg bg-muted/60 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {suggestion.priority === "high" ? (
                          <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
                        ) : (
                          <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {suggestion.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getPriorityVariant(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="experience">
            <AccordionTrigger className="py-4 hover:no-underline">
              <p className="text-sm font-semibold text-foreground">
                Experience summary
              </p>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-3">
                {extractedData.experience.length > 0 ? (
                  extractedData.experience.map((item, index) => (
                    <div
                      key={`${item.company}-${index}`}
                      className="rounded-lg bg-muted/60 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">
                          {item.role}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.duration}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.company}
                      </p>
                      <ul className="mt-3 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                        {item.highlights.map((highlight, idx) => (
                          <li key={`${item.company}-highlight-${idx}`}>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No experience data was extracted.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="education">
            <AccordionTrigger className="py-4 hover:no-underline">
              <p className="text-sm font-semibold text-foreground">Education</p>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-col gap-3">
                {extractedData.education.length > 0 ? (
                  extractedData.education.map((item, index) => (
                    <div
                      key={`${item.institution}-${index}`}
                      className="rounded-lg bg-muted/60 p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {item.degree}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.institution} · {item.field}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.year}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No education details were extracted.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {jobMatch && (
            <AccordionItem value="match">
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-foreground">
                    Job match analysis
                  </p>
                  <Badge
                    variant={getScoreBadgeVariant(jobMatch.matchPercentage)}
                  >
                    {jobMatch.matchPercentage}% match
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex flex-col gap-4">
                  <Progress value={jobMatch.matchPercentage} />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Matched skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {jobMatch.matchedSkills.length > 0 ? (
                          jobMatch.matchedSkills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-green-600/10 border-green-500 text-secondary-foreground"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No matched skills recorded.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Missing skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {jobMatch.missingSkills.length > 0 ? (
                          jobMatch.missingSkills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-rose-600/10 border-rose-500 "
                            >
                              <span className="text-black">{skill}</span>
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No missing skills were identified.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {jobMatch.recommendations.length > 0 && (
                    <div className="rounded-lg bg-muted/60 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                        Recommendations
                      </p>
                      <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                        {jobMatch.recommendations.map(
                          (recommendation, index) => (
                            <li key={`recommendation-${index}`}>
                              {recommendation}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
