"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-4.5 text-blue-500 dark:text-blue-400 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4.5 text-amber-500 dark:text-amber-400 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-4.5 text-red-500 dark:text-red-400 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-4.5 animate-spin text-primary shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg font-medium",
          success: "!bg-emerald-50/90 !text-emerald-900 !border-emerald-200 dark:!bg-emerald-950/30 dark:!text-emerald-300 dark:!border-emerald-900/50",
          error: "!bg-red-50/90 !text-red-900 !border-red-200 dark:!bg-red-950/30 dark:!text-red-300 dark:!border-red-900/50",
          warning: "!bg-amber-50/90 !text-amber-900 !border-amber-200 dark:!bg-amber-950/30 dark:!text-amber-300 dark:!border-amber-900/50",
          info: "!bg-blue-50/90 !text-blue-900 !border-blue-200 dark:!bg-blue-950/30 dark:!text-blue-300 dark:!border-blue-900/50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
