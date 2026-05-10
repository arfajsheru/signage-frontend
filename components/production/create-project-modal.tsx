"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Hammer, Printer, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signage" | "print"
}

export function CreateProjectModal({ isOpen, onClose, type }: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="relative w-full bg-background/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
          {/* Header Background Gradient */}
          <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-br ${
            type === "signage" ? "from-orange-500/20 to-blue-600/20" : "from-indigo-500/20 to-purple-600/20"
          } blur-3xl opacity-50`} />
          
          <DialogHeader className="relative p-8 pb-4">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg ${
                type === "signage" ? "bg-orange-500 text-white" : "bg-indigo-600 text-white"
              }`}>
                {type === "signage" ? <Hammer className="h-6 w-6" /> : <Printer className="h-6 w-6" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight uppercase">
                  New <span className="text-primary">{type}</span> Project
                </DialogTitle>
                <DialogDescription className="text-sm font-medium opacity-70">
                  Configure your production requirements below.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-8 py-12 relative flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-dashed border-muted-foreground/30">
              <Sparkles className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
            <h3 className="text-lg font-bold mb-2">Form Structure Coming Soon</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              We are finalizing the production fields for the <span className="font-bold text-foreground capitalize">{type}</span> module.
            </p>
          </div>

          <div className="p-6 bg-muted/30 border-t border-white/10 flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose} className="font-semibold">
              Cancel
            </Button>
            <Button className={`font-bold px-8 ${
              type === "signage" ? "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
            } shadow-lg`}>
              Initialize Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
