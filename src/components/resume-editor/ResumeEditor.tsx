"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { EditableText } from "./fields/EditableText";
import { EditableTextarea } from "./fields/EditableTextarea";
import { SuggestionCard } from "./fields/SuggestionCard";
import { TemplatePreview } from "./TemplatePreview";
import { WorkSection } from "./sections/WorkSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";

interface ResumeEditorProps {
  resumeId: string;
  resumeData: Record<string, unknown>;
  selectedTemplate: string;
  fileName: string;
  suggestions: Array<any>;
}

export function ResumeEditor({
  resumeId,
  resumeData,
  selectedTemplate,
  fileName,
  suggestions,
}: ResumeEditorProps) {
  const [data, setData] = useState(resumeData);
  const [template, setTemplate] = useState(selectedTemplate);
  const [isSaving, setIsSaving] = useState(false);

  const updateBasicField = useCallback(
    async (field: string, value: unknown) => {
      const basics = (data.basics as Record<string, unknown>) || {};
      const newData = {
        ...data,
        basics: { ...basics, [field]: value },
      };
      setData(newData);

      try {
        await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: newData }),
        });
      } catch (error) {
        console.error("Failed to save:", error);
      }
    },
    [data, resumeId]
  );

  const updateSection = useCallback(
    async (section: string, value: unknown) => {
      const newData = {
        ...data,
        [section]: value,
      };
      setData(newData);

      try {
        await fetch(`/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeData: newData }),
        });
      } catch (error) {
        console.error("Failed to save:", error);
      }
    },
    [data, resumeId]
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: data,
          selectedTemplate: template,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save resume");
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }, [resumeId, data, template]);

  const handleExportPDF = useCallback(() => {
    // Open export endpoint in new window
    const exportUrl = `/api/resumes/${resumeId}/export?template=${template}`;
    const newWindow = window.open(exportUrl, "_blank");
    if (newWindow) {
      // After a short delay, trigger print dialog
      setTimeout(() => {
        newWindow.print();
      }, 500);
    }
  }, [resumeId, template]);

  const basics = data.basics as Record<string, unknown> | null;
  const work = Array.isArray(data.work) ? (data.work as Array<Record<string, unknown>>) : [];
  const education = Array.isArray(data.education)
    ? (data.education as Array<Record<string, unknown>>)
    : [];
  const skills = Array.isArray(data.skills) ? (data.skills as Array<Record<string, unknown>>) : [];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left Panel - Editor */}
      <div className="w-1/2 border-r overflow-y-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{fileName}</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Basics Section */}
          <TabsContent value="basics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableText
                  label="Full Name"
                  value={(basics?.name as string) || ""}
                  onSave={(value) => updateBasicField("name", value)}
                  placeholder="Your full name"
                />
                <EditableText
                  label="Email"
                  value={(basics?.email as string) || ""}
                  onSave={(value) => updateBasicField("email", value)}
                  placeholder="your.email@example.com"
                />
                <EditableText
                  label="Phone"
                  value={(basics?.phone as string) || ""}
                  onSave={(value) => updateBasicField("phone", value)}
                  placeholder="(123) 456-7890"
                />
                <EditableTextarea
                  label="Professional Summary"
                  value={(basics?.summary as string) || ""}
                  onSave={(value) => updateBasicField("summary", value)}
                  placeholder="A brief overview of your professional background and goals"
                  rows={4}
                />
              </CardContent>
            </Card>

            {suggestions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions
                    .filter((s) => s.section && s.section.startsWith("basics"))
                    .map((suggestion, idx) => (
                      <SuggestionCard
                        key={idx}
                        title={suggestion.title}
                        description={suggestion.description}
                        suggestedText={suggestion.suggestedText}
                        priority={suggestion.priority}
                        isApplied={suggestion.isApplied}
                        onApply={async () => {
                          console.log("Applying suggestion:", suggestion);
                        }}
                      />
                    ))}
                  {suggestions.filter((s) => s.section && s.section.startsWith("basics"))
                    .length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No suggestions for this section
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Work Section */}
          <TabsContent value="work" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkSection
                  items={work as any[]}
                  onUpdate={(items) => updateSection("work", items)}
                />
              </CardContent>
            </Card>

            {suggestions.filter((s) => s.section && s.section === "work").length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions
                    .filter((s) => s.section && s.section === "work")
                    .map((suggestion, idx) => (
                      <SuggestionCard
                        key={idx}
                        title={suggestion.title}
                        description={suggestion.description}
                        suggestedText={suggestion.suggestedText}
                        priority={suggestion.priority}
                        isApplied={suggestion.isApplied}
                        onApply={async () => {
                          console.log("Applying suggestion:", suggestion);
                        }}
                      />
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <EducationSection
                  items={education as any[]}
                  onUpdate={(items) => updateSection("education", items)}
                />
              </CardContent>
            </Card>

            {suggestions.filter((s) => s.section && s.section === "education").length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions
                    .filter((s) => s.section && s.section === "education")
                    .map((suggestion, idx) => (
                      <SuggestionCard
                        key={idx}
                        title={suggestion.title}
                        description={suggestion.description}
                        suggestedText={suggestion.suggestedText}
                        priority={suggestion.priority}
                        isApplied={suggestion.isApplied}
                        onApply={async () => {
                          console.log("Applying suggestion:", suggestion);
                        }}
                      />
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <SkillsSection
                  items={skills as any[]}
                  onUpdate={(items) => updateSection("skills", items)}
                />
              </CardContent>
            </Card>

            {suggestions.filter((s) => s.section && s.section === "skills").length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions
                    .filter((s) => s.section && s.section === "skills")
                    .map((suggestion, idx) => (
                      <SuggestionCard
                        key={idx}
                        title={suggestion.title}
                        description={suggestion.description}
                        suggestedText={suggestion.suggestedText}
                        priority={suggestion.priority}
                        isApplied={suggestion.isApplied}
                        onApply={async () => {
                          console.log("Applying suggestion:", suggestion);
                        }}
                      />
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 sticky bottom-6">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
          <Button variant="secondary" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 bg-muted/50 p-6 overflow-y-auto">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Template</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="modern">Modern</option>
                <option value="ats">ATS Friendly</option>
                <option value="creative">Creative</option>
              </select>
            </CardContent>
          </Card>

          <TemplatePreview resumeData={data} template={template as "modern" | "ats" | "creative"} />
        </div>
      </div>
    </div>
  );
}
