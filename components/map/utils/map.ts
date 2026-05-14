import { MUMBAI_BOUNDS } from "../constants/map.constants"
import { LocationData } from "../types/map.types"

export const isLocationInMumbai = (lat: number, lng: number): boolean => {
  return (
    lat >= MUMBAI_BOUNDS.south &&
    lat <= MUMBAI_BOUNDS.north &&
    lng >= MUMBAI_BOUNDS.west &&
    lng <= MUMBAI_BOUNDS.east
  )
}

export const generateGoogleMapsLink = (lat: number, lng: number, placeId?: string): string => {
  if (placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}
