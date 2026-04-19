"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { EditableText } from "../fields/EditableText";

interface EducationItem {
  institution?: string;
  studyType?: string;
  area?: string;
  startDate?: string;
  endDate?: string;
  score?: string;
}

interface EducationSectionProps {
  items: EducationItem[];
  onUpdate: (items: EducationItem[]) => Promise<void>;
}

export function EducationSection({ items, onUpdate }: EducationSectionProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const toggleExpanded = (idx: number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpanded(newExpanded);
  };

  const handleAddEducation = async () => {
    const newItems = [
      ...items,
      {
        institution: "",
        studyType: "",
        area: "",
        startDate: "",
        endDate: "",
        score: "",
      },
    ];
    await onUpdate(newItems);
    setExpanded(new Set([...expanded, items.length]));
  };

  const handleRemoveEducation = async (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx);
    await onUpdate(newItems);
  };

  const handleUpdateField = async (idx: number, field: string, value: unknown) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    await onUpdate(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((edu, idx) => (
        <Card key={idx}>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleExpanded(idx)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">
                  {(edu.studyType as string) || "Degree"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {(edu.institution as string) || "University"}{" "}
                  {edu.startDate && `• ${edu.startDate}`}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveEducation(idx);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expanded.has(idx) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>

          {expanded.has(idx) && (
            <CardContent className="space-y-4 border-t pt-4">
              <EditableText
                label="Institution"
                value={(edu.institution as string) || ""}
                onSave={(value) => handleUpdateField(idx, "institution", value)}
                placeholder="e.g., Stanford University"
              />
              <EditableText
                label="Degree"
                value={(edu.studyType as string) || ""}
                onSave={(value) => handleUpdateField(idx, "studyType", value)}
                placeholder="e.g., Bachelor of Science"
              />
              <EditableText
                label="Field of Study"
                value={(edu.area as string) || ""}
                onSave={(value) => handleUpdateField(idx, "area", value)}
                placeholder="e.g., Computer Science"
              />
              <div className="grid grid-cols-3 gap-4">
                <EditableText
                  label="Start Date"
                  value={(edu.startDate as string) || ""}
                  onSave={(value) => handleUpdateField(idx, "startDate", value)}
                  placeholder="e.g., 2018"
                />
                <EditableText
                  label="End Date"
                  value={(edu.endDate as string) || ""}
                  onSave={(value) => handleUpdateField(idx, "endDate", value)}
                  placeholder="e.g., 2022"
                />
                <EditableText
                  label="GPA / Score"
                  value={(edu.score as string) || ""}
                  onSave={(value) => handleUpdateField(idx, "score", value)}
                  placeholder="e.g., 3.8"
                />
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      <Button onClick={handleAddEducation} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Education
      </Button>
    </div>
  );
}
