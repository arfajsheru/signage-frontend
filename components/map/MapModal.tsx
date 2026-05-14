"use client"

import React, { useEffect } from "react"
import { BaseModal } from "@/components/comman/BaseModal"
import { MapContainer } from "./MapContainer"
import { StudioInput } from "@/components/shadcn-studio/input/studio-input"
import { MapPin } from "lucide-react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { useMapStore } from "./hooks/useMapStore"
import { isLocationInMumbai, generateGoogleMapsLink } from "./utils/map"
import { motion, AnimatePresence } from "framer-motion"
import { useJsApiLoader } from "@react-google-maps/api"

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  onLocationSelect: (address: string) => void
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"]

export const MapModal = ({ isOpen, onClose, onLocationSelect }: MapModalProps) => {
  // Load the Google Maps API here so usePlacesAutocomplete can access it
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "in" },
    },
    debounce: 300,
    initOnMount: false, // Don't init until API is loaded
  })

  // Initialize autocomplete when script is loaded
  useEffect(() => {
    if (isLoaded) {
      init()
    }
  }, [isLoaded, init])

  const { setSelectedLocation, setIsOutsideMumbai, setIsLoading, selectedLocation, isOutsideMumbai } = useMapStore()

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
    } catch (error) {
      console.error("Error fetching geocode: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    if (selectedLocation && !isOutsideMumbai) {
      onLocationSelect(selectedLocation.address)
      onClose()
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Location"
      description="Search and pick your project location in Mumbai"
      size="xl"
      primaryButtonText="Confirm Location"
      secondaryButtonText="Cancel"
      onPrimaryAction={handleConfirm}
    >
      <div className="space-y-4 flex flex-col h-[70vh]">
        <div className="relative">
          <StudioInput
            label="Search Address"
            placeholder={ready ? "Enter your street, building or area..." : "Loading search..."}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            onClear={() => setValue("")}
            className="h-10 bg-muted/30 border-border/40 focus:bg-background transition-all"
          />
          
          <AnimatePresence>
            {status === "OK" && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-xl z-50 overflow-hidden max-h-[250px] overflow-y-auto"
              >
                {data.map(({ place_id, description, structured_formatting: { main_text, secondary_text } }) => (
                  <li
                    key={place_id}
                    onClick={() => handleSelect(description)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent cursor-pointer transition-colors border-b last:border-none"
                  >
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-semibold truncate">{main_text}</span>
                      <span className="text-xs text-muted-foreground truncate">{secondary_text}</span>
                    </div>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {selectedLocation && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3"
          >
            <div className="bg-primary p-2 rounded-full mt-0.5">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Selected Location</p>
              <p className="text-sm font-medium leading-tight">{selectedLocation.address}</p>
            </div>
          </motion.div>
        )}

        <div className="flex-1 rounded-xl overflow-hidden border relative min-h-[350px]">
          <MapContainer 
            hideSearch={true}
            hideCard={true}
            onLocationSelect={(address) => {
              onLocationSelect(address)
              onClose()
            }} 
          />
        </div>
      </div>
    </BaseModal>
  )
}
