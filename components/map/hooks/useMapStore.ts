import { create } from 'zustand'
import { MapStore } from '../types/map.types'

export const useMapStore = create<MapStore>((set) => ({
  selectedLocation: null,
  isOutsideMumbai: false,
  isLoading: false,
  isGoogleMapsLoaded: false,
  setSelectedLocation: (loc) => set({ selectedLocation: loc }),
  setIsOutsideMumbai: (val) => set({ isOutsideMumbai: val }),
  setIsLoading: (val) => set({ isLoading: val }),
  setGoogleMapsLoaded: (val) => set({ isGoogleMapsLoaded: val }),
}))
