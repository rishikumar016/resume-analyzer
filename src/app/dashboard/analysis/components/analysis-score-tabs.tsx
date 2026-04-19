"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getScoreLabel,
  getScoreBadgeVariant,
} from "@/lib/analysis-utils";

type AnalysisScores = {
  relevance: number;
  experience: number;
  skills: number;
  education: number;
  formatting: number;
  impact: number;
};

type ExtractedData = {
  summary: string;
  skills: Array<{ name: string; category: string; proficiency: string }>;
};

interface AnalysisScoreTabsProps {
  scores: AnalysisScores;
  extractedData: ExtractedData;
  jobDescription: string | null;
}

const RESULT_TABS = [
  {
    key: "overview",
    label: "Overview",
    text: "A top-level editorial read on the overall structure and narrative quality.",
    scoreKeys: ["formatting", "impact"] as const,
  },
  {
    key: "content",
    label: "Content",
    text: "How well your experience and positioning align to the intended role.",
    scoreKeys: ["relevance", "experience"] as const,
  },
  {
    key: "structure",
    label: "Structure",
    text: "Section hierarchy, readability, and how clearly the document is organized.",
    scoreKeys: ["formatting", "education"] as const,
  },
  {
    key: "skills",
    label: "Skills",
    text: "Skill coverage, role-fit signals, and the strength of your technical profile.",
    scoreKeys: ["skills", "relevance"] as const,
  },
] as const;

export function AnalysisScoreTabs({
  scores,
  extractedData,
  jobDescription,
}: AnalysisScoreTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 md:grid-cols-4">
        {RESULT_TABS.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key} className="py-2.5">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {RESULT_TABS.map((tab) => {
        const average = Math.round(
          tab.scoreKeys.reduce((sum, key) => sum + scores[key], 0) /
            tab.scoreKeys.length,
        );

        return (
          <TabsContent key={tab.key} value={tab.key}>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{tab.label}</CardTitle>
                    <CardDescription>{tab.text}</CardDescription>
                  </div>
                  <Badge variant={getScoreBadgeVariant(average)}>
                    {getScoreLabel(average)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {tab.scoreKeys.map((scoreKey) => (
                    <div key={scoreKey} className="rounded-lg bg-muted/60 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {scoreKey.charAt(0).toUpperCase() + scoreKey.slice(1)}
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-foreground">
                        {scores[scoreKey]}
                        <span className="ml-1 text-sm font-medium text-muted-foreground">
                          /100
                        </span>
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-sm leading-6 text-muted-foreground">
                  {extractedData.summary ||
                    "No summary was extracted for this section."}
                </p>

                {tab.key === "skills" && extractedData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {extractedData.skills.slice(0, 12).map((skill) => (
                      <Badge key={skill.name} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {tab.key === "overview" && jobDescription && (
                  <div className="rounded-lg bg-muted/60 p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Target brief
                    </p>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                      {jobDescription}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
