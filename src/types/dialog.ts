export type DialogType = string | null;

export type DialogPosition = "center" | "top" | "bottom" | "left" | "right";

export type DialogOptions = {
  title?: string;
  description?: string;
  className?: string;
  dialogClassName?: string;
  maxWidth?: string;
  position?: DialogPosition;
  showCloseButton?: boolean;
};

export type DialogState = {
  type: DialogType;
  isOpen: boolean;
  props: Record<string, any>;
  options: DialogOptions;
};
