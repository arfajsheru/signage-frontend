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
          "flex flex-col p-0 gap-0 overflow-hidden rounded-2xl max-h-[90vh] min-h-[200px] w-full border-0 shadow-2xl",
          sizeMap[size],
          className
        )}
      >
        {/* ── Premium Gradient Header ── */}
        <div className="shrink-0 relative overflow-hidden">
          {/* Gradient base */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(169,82%,24%) 0%, hsl(169,82%,36%) 45%, hsl(185,72%,40%) 100%)",
            }}
          />

          {/* Dot-grid pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.75) 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
              opacity: 0.18,
            }}
          />

          {/* Top-right glow orb */}
          <div
            className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.55) 0%, transparent 70%)",
              opacity: 0.22,
            }}
          />

          {/* Bottom-left subtle orb */}
          <div
            className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              opacity: 0.16,
            }}
          />

          {/* Actual header content */}
          <div className="relative z-10 px-6 py-5 pr-14 text-left">
            <DialogTitle className="text-base font-bold leading-snug tracking-wide text-white drop-shadow-sm">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-xs text-white/70 mt-1 leading-relaxed line-clamp-1">
                {description}
              </DialogDescription>
            )}
          </div>

          {/* Frosted-glass close button */}
          <DialogClose asChild>
            <button
              className="absolute right-3 top-3 z-20 h-8 w-8 rounded-full flex items-center justify-center
                         bg-white/15 hover:bg-white/28 border border-white/20
                         text-white transition-all duration-200 hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              style={{ backdropFilter: "blur(6px)" }}
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </div>

        {/* ── Scrollable Body ── */}
        <ScrollArea className="flex-1 w-full h-full min-h-0 overflow-y-auto bg-background">
          <div className="p-6">
            <div className="w-full max-w-full">{children}</div>
          </div>
        </ScrollArea>

        {/* ── Sticky Footer ── */}
        <div className="shrink-0 px-6 py-4 border-t border-border/60 bg-muted/30">
          <DialogFooter className="flex flex-row items-center justify-end gap-2">
            {secondaryButtonText && (
              <Button
                type="button"
                variant="outline"
                onClick={onSecondaryAction || onClose}
                className="h-9 px-4 font-medium text-sm border-border/70 hover:border-primary/50 hover:text-primary transition-colors"
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                type="button"
                onClick={onPrimaryAction}
                className="h-9 px-4 font-semibold text-sm shadow-md hover:shadow-primary/25 hover:shadow-lg transition-all duration-200"
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
