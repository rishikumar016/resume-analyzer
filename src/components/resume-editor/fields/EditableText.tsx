"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => Promise<void>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function EditableText({
  value: initialValue,
  onSave,
  label,
  placeholder,
  disabled,
}: EditableTextProps) {
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
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setIsDirty(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled || isSaving}
          className="pr-10"
        />
        {isSaving && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
