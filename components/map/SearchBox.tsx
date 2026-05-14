import React, { useEffect, useRef } from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Search, MapPin, Loader2 } from "lucide-react"
import { useMapStore } from "./hooks/useMapStore"
import { isLocationInMumbai, generateGoogleMapsLink } from "./utils/map"
import { motion, AnimatePresence } from "framer-motion"

export const SearchBox = ({ mapRef }: { mapRef: React.RefObject<google.maps.Map | null> }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "in" },
    },
    debounce: 300,
  })

  const { setSelectedLocation, setIsOutsideMumbai, setIsLoading } = useMapStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        clearSuggestions()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [clearSuggestions])

  const handleSelect = async (address: string) => {
    setValue(address, false)
    clearSuggestions()
    setIsLoading(true)

    try {
      const results = await getGeocode({ address })
      const placeId = results[0].place_id
      const { lat, lng } = await getLatLng(results[0])
      
      const inMumbai = isLocationInMumbai(lat, lng)
      setIsOutsideMumbai(!inMumbai)

      setSelectedLocation({
        lat,
        lng,
        address,
        placeId,
        googleMapsLink: generateGoogleMapsLink(lat, lng, placeId),
      })

      if (mapRef.current && inMumbai) {
        mapRef.current.panTo({ lat, lng })
        mapRef.current.setZoom(15)
      }
    } catch (error) {
      console.error("Error fetching geocode: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={wrapperRef} className="absolute top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-10">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="w-full bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
          placeholder="Search locations in Mumbai..."
        />
      </div>

      <AnimatePresence>
        {status === "OK" && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {data.map(({ place_id, description, structured_formatting: { main_text, secondary_text } }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
              >
                <div className="bg-primary/20 p-2 rounded-full flex-shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-foreground truncate">{main_text}</span>
                  <span className="text-xs text-muted-foreground truncate">{secondary_text}</span>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
