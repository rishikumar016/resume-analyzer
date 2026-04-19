"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";

interface EditableListProps {
  items: string[];
  onSave: (items: string[]) => Promise<void>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function EditableList({
  items: initialItems,
  onSave,
  label,
  placeholder,
  disabled,
}: EditableListProps) {
  const [items, setItems] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const saveItems = useCallback(async (newItems: string[]) => {
    setIsSaving(true);
    try {
      await onSave(newItems);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save:", error);
      setItems(initialItems);
    } finally {
      setIsSaving(false);
    }
  }, [initialItems, onSave]);

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    setIsDirty(true);
  };

  const handleAddItem = () => {
    const newItems = [...items, ""];
    setItems(newItems);
    setIsDirty(true);
  };

  const handleRemoveItem = async (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    await saveItems(newItems);
  };

  const handleSaveAll = async () => {
    await saveItems(items);
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium block">{label}</label>}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 flex-shrink-0" />
            <Input
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              placeholder={placeholder || `Item ${index + 1}`}
              disabled={isSaving}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(index)}
              disabled={isSaving}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          disabled={isSaving}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
        {isDirty && (
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
