export interface LocationData {
  lat: number
  lng: number
  address: string
  placeId?: string
  googleMapsLink?: string
}

export interface MapStore {
  selectedLocation: LocationData | null
  isOutsideMumbai: boolean
  isLoading: boolean
  isGoogleMapsLoaded: boolean
  setSelectedLocation: (loc: LocationData | null) => void
  setIsOutsideMumbai: (val: boolean) => void
  setIsLoading: (val: boolean) => void
  setGoogleMapsLoaded: (val: boolean) => void
}
