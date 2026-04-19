"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { EditableText } from "../fields/EditableText";
import { EditableList } from "../fields/EditableList";

interface WorkItem {
  name?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

interface WorkSectionProps {
  items: WorkItem[];
  onUpdate: (items: WorkItem[]) => Promise<void>;
}

export function WorkSection({ items, onUpdate }: WorkSectionProps) {
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

  const handleAddJob = async () => {
    const newItems = [
      ...items,
      {
        name: "",
        position: "",
        startDate: "",
        endDate: "",
        summary: "",
        highlights: [],
      },
    ];
    await onUpdate(newItems);
    setExpanded(new Set([...expanded, items.length]));
  };

  const handleRemoveJob = async (idx: number) => {
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
      {items.map((job, idx) => (
        <Card key={idx}>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => toggleExpanded(idx)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-base">
                  {(job.position as string) || "Job Title"}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {(job.name as string) || "Company"}{" "}
                  {job.startDate && `• ${job.startDate}`}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveJob(idx);
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
                label="Company Name"
                value={(job.name as string) || ""}
                onSave={(value) => handleUpdateField(idx, "name", value)}
                placeholder="e.g., Acme Corporation"
              />
              <EditableText
                label="Job Title"
                value={(job.position as string) || ""}
                onSave={(value) => handleUpdateField(idx, "position", value)}
                placeholder="e.g., Senior Software Engineer"
              />
              <div className="grid grid-cols-2 gap-4">
                <EditableText
                  label="Start Date"
                  value={(job.startDate as string) || ""}
                  onSave={(value) => handleUpdateField(idx, "startDate", value)}
                  placeholder="e.g., Jan 2020"
                />
                <EditableText
                  label="End Date"
                  value={(job.endDate as string) || ""}
                  onSave={(value) => handleUpdateField(idx, "endDate", value)}
                  placeholder="e.g., Present"
                />
              </div>
              <EditableList
                label="Highlights & Achievements"
                items={(job.highlights as string[]) || []}
                onSave={(value) => handleUpdateField(idx, "highlights", value)}
                placeholder="e.g., Led team of 5 engineers..."
              />
            </CardContent>
          )}
        </Card>
      ))}

      <Button onClick={handleAddJob} variant="outline" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Work Experience
      </Button>
    </div>
  );
}
