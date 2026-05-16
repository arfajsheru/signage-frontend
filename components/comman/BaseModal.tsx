"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "xl1" | "xl3";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  size?: ModalSize;
  className?: string;
}

const sizeMap: Record<ModalSize, string> = {
  xs: "max-w-[95vw] sm:max-w-[320px]",
  sm: "max-w-[95vw] sm:max-w-[400px]",
  md: "max-w-[95vw] sm:max-w-[500px]",
  lg: "max-w-[95vw] sm:max-w-[600px]",
  xl: "max-w-[95vw] sm:max-w-[700px]",
  xl1: "max-w-[95vw] sm:max-w-[850px]",
  xl3: "max-w-[95vw] sm:max-w-[1000px]",
};

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  primaryButtonText = "Confirm",
  secondaryButtonText = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  size = "md",
  className,
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col p-0 gap-0 overflow-hidden rounded-2xl max-h-[90vh] min-h-[200px] w-full",
          sizeMap[size],
          className
        )}
      >
        {/* Header section (Sticky) */}
        <div className="flex shrink-0 items-start justify-between p-6 pb-4 border-b">
          <div className="space-y-1 pr-8 text-left">
            <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {description}
              </DialogDescription>
            )}
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        {/* Scrollable Body section */}
        <ScrollArea className="flex-1 w-full h-full min-h-0 overflow-y-auto">
          <div className="p-6">
            <div className="w-full max-w-full">
              {children}
            </div>
          </div>
        </ScrollArea>

        {/* Footer section (Sticky) */}
        <div className="shrink-0 p-6 pt-4 border-t bg-muted/5">
          <DialogFooter className="flex flex-row items-center justify-end gap-3">
            {secondaryButtonText && (
              <Button
                type="button"
                variant="outline"
                onClick={onSecondaryAction || onClose}
                className="h-10 px-6 font-medium"
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                type="button"
                onClick={onPrimaryAction}
                className="h-10 px-6 font-medium shadow-sm transition-all hover:shadow-md"
              >
                {primaryButtonText}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
