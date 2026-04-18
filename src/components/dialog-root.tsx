"use client";

import type React from "react";

import { dialogRegistry } from "@/config/dialog";
import { useDialog } from "@/context/dialog-context";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function DialogRoot() {
  const { state, closeDialog } = useDialog();

  if (!state.type) {
    return null;
  }

  const dialogConfig = dialogRegistry[state.type];

  if (!dialogConfig) {
    return null;
  }

  const Component = dialogConfig.component;
  const options = { ...dialogConfig.defaultOptions, ...state.options };

  return (
    <Dialog open={state.isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent
        showCloseButton={options.showCloseButton}
        className={cn(options.className, options.dialogClassName)}
        style={
          options.maxWidth
            ? ({ maxWidth: options.maxWidth } as React.CSSProperties)
            : undefined
        }
      >
        <Component {...state.props} />
      </DialogContent>
    </Dialog>
  );
}
