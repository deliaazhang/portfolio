import { createContext, useContext } from 'react'

export type GalleryOrigin = 'hero' | 'elsewhere'
export type GalleryApi = {
  open: (origin: GalleryOrigin, index?: number) => void
}

export const GalleryContext = createContext<GalleryApi>({ open: () => {} })
export const useGallery = () => useContext(GalleryContext)
