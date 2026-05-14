import { Navigation } from "lucide-react"
import { useMapStore } from "./hooks/useMapStore"

export const CurrentLocationButton = ({ onClick }: { onClick: () => void }) => {
  const { isLoading } = useMapStore()

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="absolute bottom-6 right-6 z-10 bg-background/90 backdrop-blur-xl border border-white/10 p-3.5 rounded-full shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
      aria-label="Use current location"
    >
      <Navigation className="h-5 w-5 text-foreground" />
    </button>
  )
}
