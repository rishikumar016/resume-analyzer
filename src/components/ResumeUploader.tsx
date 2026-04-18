"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function ResumeUploader({
  onFileSelect,
  selectedFile,
  onClear,
}: ResumeUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    noClick: !!selectedFile,
    noKeyboard: !!selectedFile,
  });

  if (selectedFile) {
    return (
      <div className="w-full">
        <div
          {...getRootProps()}
          className="group relative flex min-h-45 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-muted/80 px-4 py-6"
        >
          <input {...getInputProps()} />

          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FileText className="h-6 w-6" />
          </div>

          <div className="text-center">
            <p className="mx-auto max-w-[80%] truncate text-sm font-semibold text-foreground">
              {selectedFile.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {(selectedFile.size / 1024).toFixed(1)} KB &middot; PDF ready for
              analysis
            </p>
          </div>

          <div className="absolute inset-0 rounded-2xl bg-foreground/45 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="size-9 rounded-xl p-0 shadow-sm"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="size-9 rounded-xl p-0 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-45 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-8 text-center transition-all",
          isDragActive
            ? "border-primary/50 bg-primary/10 ring-4 ring-primary/10"
            : "border-border bg-muted/60 hover:bg-muted",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Upload className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF only &middot; max 10MB &middot; use selectable text for best
            results
          </p>
        </div>
      </div>
    </div>
  );
}
