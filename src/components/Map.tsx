'use client'

import {
  GoogleMap,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api'
import { useFilterStore } from '@/store/useFilterStore'
import { useEffect, useState, useRef } from 'react'
import { getEventIcon } from '@/lib/eventIcons'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { useEventStore } from '@/store/useEventStore'
import { EonetEvent } from '@/lib/fetchEvents'

const containerStyle = {
  width: '100%',
  height: '100vh',
}

const center = { lat: 0, lng: 0 }

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [googleReady, setGoogleReady] = useState(false)
  const events = useEventStore((state) => state.events)
  const activeCategories = useFilterStore((state) => state.activeCategories)
  const [selected, setSelected] = useState<EonetEvent | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const clustererRef = useRef<MarkerClusterer | null>(null)

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map
  }

  // Poll until google is ready
  useEffect(() => {
    if (!isLoaded) return

    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.google?.maps) {
        setGoogleReady(true)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isLoaded])

  // Render markers when events or filters change
  useEffect(() => {
    if (!googleReady || !mapRef.current) return

    const googleRef = window.google

    const filteredEvents = events.filter((event) => {
      const cat = event.categories[0]?.title ?? 'Default'
      return activeCategories.includes(cat as any)
    })

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    if (clustererRef.current) {
      clustererRef.current.clearMarkers()
    }

    const newMarkers: google.maps.Marker[] = []

    for (const event of filteredEvents) {
      const coords = event.geometry[0]?.coordinates
      if (!coords) continue

      const category = event.categories[0]?.title ?? 'Default'
      const iconUrl = getEventIcon(category)

      const marker = new googleRef.maps.Marker({
        position: { lat: coords[1], lng: coords[0] },
        map: mapRef.current!,
        icon: {
          url: iconUrl,
          scaledSize: new googleRef.maps.Size(40, 40),
        },
      })

      marker.addListener('click', () => {
        setSelected(event)
      })

      newMarkers.push(marker)
    }

    markersRef.current = newMarkers

    clustererRef.current = new MarkerClusterer({
      markers: newMarkers,
      map: mapRef.current!,
    })
  }, [events, activeCategories, googleReady])

  if (!isLoaded || !googleReady) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <GoogleMap
      onLoad={onLoad}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={2}
    >
      {selected && (
        <InfoWindow
          position={{
            lat: selected.geometry[0].coordinates[1],
            lng: selected.geometry[0].coordinates[0],
          }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="max-w-xs text-sm">
            <h2 className="font-bold">{selected.title}</h2>
            <p className="text-gray-700">{selected.categories[0]?.title}</p>
            <p className="text-xs text-gray-500">
              Updated: {new Date(selected.geometry[0].date).toLocaleString()}
            </p>
            {selected.sources?.[0]?.url && (
              <a
                href={selected.sources[0].url}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}
