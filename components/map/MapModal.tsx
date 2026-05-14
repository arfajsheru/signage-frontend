import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MapContainer } from "./MapContainer"
import { motion, AnimatePresence } from "framer-motion"

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (address: string) => void
}

export const MapModal = ({ isOpen, onClose, onLocationSelect }: MapModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent 
            forceMount
            className="sm:max-w-[800px] w-[95vw] h-[80vh] p-0 border-none bg-background shadow-2xl overflow-hidden rounded-3xl"
            showCloseButton={true}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full h-full relative"
            >
              <MapContainer 
                onLocationSelect={(address) => {
                  onLocationSelect(address)
                  onClose()
                }} 
              />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}
