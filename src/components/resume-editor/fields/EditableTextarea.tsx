"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EditableTextareaProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function EditableTextarea({
  value: initialValue,
  onSave,
  label,
  placeholder,
  disabled,
  rows = 4,
}: EditableTextareaProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleBlur = useCallback(async () => {
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(value);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save:", error);
      setValue(initialValue);
    } finally {
      setIsSaving(false);
    }
  }, [value, isDirty, isSaving, initialValue, onSave]);

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsDirty(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isSaving}
          rows={rows}
          className="resize-none"
        />
        {isSaving && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
