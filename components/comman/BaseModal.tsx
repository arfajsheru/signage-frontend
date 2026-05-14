"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
          "flex flex-col p-0 gap-0 overflow-hidden rounded-2xl",
          sizeMap[size],
          className
        )}
      >
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-8 w-8 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        <div className="border-b" />

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        <DialogFooter className="p-6 pt-4 border-t flex-row items-center justify-end space-x-2">
          {secondaryButtonText && (
            <Button
              type="button"
              variant="outline"
              onClick={onSecondaryAction || onClose}
            >
              {secondaryButtonText}
            </Button>
          )}
          {primaryButtonText && (
            <Button
              type="button"
              onClick={onPrimaryAction}
            >
              {primaryButtonText}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
