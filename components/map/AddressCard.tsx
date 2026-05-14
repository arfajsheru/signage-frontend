import { motion, AnimatePresence } from "framer-motion"
import { MapPin, CheckCircle2 } from "lucide-react"
import { useMapStore } from "./hooks/useMapStore"

export const AddressCard = ({ onConfirm }: { onConfirm: () => void }) => {
  const { selectedLocation, isOutsideMumbai, isLoading } = useMapStore()

  return (
    <AnimatePresence>
      {selectedLocation && !isOutsideMumbai && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20"
        >
          <div className="bg-background/90 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2.5 rounded-full shrink-0 mt-1">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <h3 className="text-sm font-bold text-foreground">Selected Address</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {selectedLocation.address}
                </p>
              </div>
            </div>

            <button
              onClick={onConfirm}
              disabled={isLoading || isOutsideMumbai}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm Location
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
