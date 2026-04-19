"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillItem {
  name?: string;
  level?: string;
  keywords?: string[];
}

interface SkillsSectionProps {
  items: SkillItem[];
  onUpdate: (items: SkillItem[]) => Promise<void>;
}

export function SkillsSection({ items, onUpdate }: SkillsSectionProps) {
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("intermediate");

  const handleAddSkill = async () => {
    if (!newSkillName.trim()) return;

    const newItems = [
      ...items,
      {
        name: newSkillName,
        level: newSkillLevel,
        keywords: [],
      },
    ];
    await onUpdate(newItems);
    setNewSkillName("");
    setNewSkillLevel("intermediate");
  };

  const handleRemoveSkill = async (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx);
    await onUpdate(newItems);
  };

  const handleUpdateSkillLevel = async (idx: number, level: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], level };
    await onUpdate(newItems);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-green-100 text-green-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Skill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Skill Name</label>
            <Input
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., Python, React, Leadership"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSkill();
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Proficiency Level</label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <Button onClick={handleAddSkill} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skills ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((skill, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <BadgeIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {(skill.name as string) || "Unnamed Skill"}
                    </p>
                    <select
                      value={(skill.level as string) || "intermediate"}
                      onChange={(e) => handleUpdateSkillLevel(idx, e.target.value)}
                      className="mt-1 w-full text-xs px-2 py-1 border rounded"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <Badge className={getLevelColor(skill.level as string)}>
                    {((skill.level as string) || "intermediate").charAt(0).toUpperCase() +
                      ((skill.level as string) || "intermediate").slice(1)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSkill(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
