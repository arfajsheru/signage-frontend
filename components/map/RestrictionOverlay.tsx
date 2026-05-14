import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"

export const RestrictionOverlay = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm"
        >
          <div className="bg-destructive/10 backdrop-blur-xl border border-destructive/20 text-destructive-foreground p-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <div className="bg-destructive/20 p-2 rounded-full shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Service Unavailable</span>
              <span className="text-xs opacity-90">
                We currently only operate within Mumbai city limits.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
