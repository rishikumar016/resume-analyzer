"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Trash2 } from "lucide-react";
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
    maxSize: 10 * 1024 * 1024, // 10MB
    noClick: !!selectedFile,
    noKeyboard: !!selectedFile,
  });

  if (selectedFile) {
    return (
      <div className="w-full">
        <div
          {...getRootProps()}
          className="group relative flex h-52 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border bg-primary/5"
        >
          <input {...getInputProps()} />
          <FileText className="h-12 w-12 text-primary" />
          <p className="text-sm font-medium truncate max-w-[80%]">
            {selectedFile.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(selectedFile.size / 1024).toFixed(1)} KB &middot; PDF
          </p>
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              className="h-9 w-9 p-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="h-9 w-9 p-0"
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
          "flex h-52 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
          isDragActive && "border-primary/50 bg-primary/5",
        )}
      >
        <input {...getInputProps()} />
        <div className="rounded-full bg-background p-3 shadow-sm">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Click to select</p>
          <p className="text-xs text-muted-foreground">
            or drag and drop your PDF here (max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
