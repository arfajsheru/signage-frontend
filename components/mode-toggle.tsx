"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

import { Hint } from "@/components/hint"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Hint label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} side="bottom">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 bg-muted/50 hover:bg-muted transition-all duration-300 rounded-md border border-border/50 overflow-hidden group"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
        <span className="sr-only">Toggle theme</span>
        
        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Button>
    </Hint>
  )
}
