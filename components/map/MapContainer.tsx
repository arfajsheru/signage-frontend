"use client"
import React, { useCallback, useRef, useState, useEffect } from "react"
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api"
import {
  MAP_CENTER_MUMBAI,
  DEFAULT_ZOOM,
  MAP_STYLES,
} from "./constants/map.constants"
import { useMapStore } from "./hooks/useMapStore"
import { isLocationInMumbai, generateGoogleMapsLink } from "./utils/map"
import { SearchBox } from "./SearchBox"
import { RestrictionOverlay } from "./RestrictionOverlay"
import { AddressCard } from "./AddressCard"
import { CurrentLocationButton } from "./CurrentLocationButton"
import { Loader2 } from "lucide-react"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
]

export const MapContainer = ({
  onLocationSelect,
  hideSearch = false,
  hideCard = false,
}: {
  onLocationSelect: (address: string) => void
  hideSearch?: boolean
  hideCard?: boolean
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  })

  if (loadError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background p-6 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Loader2 className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-foreground">
          Map Load Error
        </h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          {loadError.message ||
            "Failed to load Google Maps. Please check your API key and connection."}
        </p>
      </div>
    )
  }

  const mapRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null)

  const {
    selectedLocation,
    isOutsideMumbai,
    setSelectedLocation,
    setIsOutsideMumbai,
    setIsLoading,
    setGoogleMapsLoaded,
  } = useMapStore()

  useEffect(() => {
    if (isLoaded) {
      setGoogleMapsLoaded(true)
      setGeocoder(new window.google.maps.Geocoder())
    }
  }, [isLoaded, setGoogleMapsLoaded])

  // Pan to selected location when it changes (e.g. from search)
  useEffect(() => {
    if (mapRef.current && selectedLocation && !isOutsideMumbai) {
      mapRef.current.panTo({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      })
      mapRef.current.setZoom(15)
    }
  }, [selectedLocation, isOutsideMumbai])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || !geocoder) return

      const lat = e.latLng.lat()
      const lng = e.latLng.lng()

      const inMumbai = isLocationInMumbai(lat, lng)
      setIsOutsideMumbai(!inMumbai)

      if (inMumbai) {
        setIsLoading(true)
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          setIsLoading(false)
          if (status === "OK" && results && results[0]) {
            setSelectedLocation({
              lat,
              lng,
              address: results[0].formatted_address,
              placeId: results[0].place_id,
              googleMapsLink: generateGoogleMapsLink(
                lat,
                lng,
                results[0].place_id
              ),
            })
          }
        })
      } else {
        setSelectedLocation(null)
      }
    },
    [geocoder, setIsOutsideMumbai, setIsLoading, setSelectedLocation]
  )

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const inMumbai = isLocationInMumbai(lat, lng)
        setIsOutsideMumbai(!inMumbai)

        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng })
          mapRef.current.setZoom(15)
        }

        if (inMumbai && geocoder) {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setIsLoading(false)
            if (status === "OK" && results && results[0]) {
              setSelectedLocation({
                lat,
                lng,
                address: results[0].formatted_address,
                placeId: results[0].place_id,
                googleMapsLink: generateGoogleMapsLink(
                  lat,
                  lng,
                  results[0].place_id
                ),
              })
            }
          })
        } else {
          setIsLoading(false)
          setSelectedLocation(null)
        }
      },
      () => {
        setIsLoading(false)
        console.error("Geolocation failed")
      }
    )
  }

  const handleConfirm = () => {
    if (selectedLocation && !isOutsideMumbai) {
      onLocationSelect(selectedLocation.address)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading Map Experience...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {!hideSearch && <SearchBox mapRef={mapRef} />}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={MAP_CENTER_MUMBAI}
        zoom={DEFAULT_ZOOM}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: isOutsideMumbai ? "none" : "greedy",
        }}
      >
        {selectedLocation && !isOutsideMumbai && (
          <Marker
            position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            animation={window.google.maps.Animation.DROP}
            onLoad={(marker) => (markerRef.current = marker)}
          />
        )}
      </GoogleMap>

      <CurrentLocationButton onClick={handleCurrentLocation} />
      <RestrictionOverlay isVisible={isOutsideMumbai} />
      {!hideCard && <AddressCard onConfirm={handleConfirm} />}
    </div>
  )
}
