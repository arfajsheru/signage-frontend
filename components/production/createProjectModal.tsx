"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import ButtonShineHover from "@/components/shadcn-studio/button/button-41"
import { motion, AnimatePresence } from "framer-motion"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  type: "signage" | "print"
}

export function CreateProjectModal({ isOpen, onClose, type }: CreateProjectModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            forceMount
            className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: { 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300,
                  duration: 0.3 
                } 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95, 
                y: 10,
                transition: { duration: 0.2 } 
              }}
              className="p-6 border border-border/50 bg-background shadow-2xl rounded-2xl relative overflow-hidden"
            >
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-black tracking-tight">
                  Create New <span className="capitalize">{type}</span> Job
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                  Fill in the details below to initialize a new production project for the {type} module.
                </DialogDescription>
              </DialogHeader>

              <div className="py-8 min-h-[100px] flex items-center justify-center border-y border-dashed border-border/60 my-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
                  Project Form Fields Coming Soon
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <ButtonShineHover 
                  variant="outline" 
                  onClick={onClose} 
                  className="h-10 px-6 border-border/50 hover:bg-muted"
                >
                  Cancel
                </ButtonShineHover>
                <ButtonShineHover 
                  className="h-10 px-8 bg-primary shadow-lg shadow-primary/20"
                >
                  Submit
                </ButtonShineHover>
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
