'use client'

import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
  MarkerClusterer
} from '@react-google-maps/api'
import { useEffect, useState } from 'react'
import { fetchEonetEvents, EonetEvent } from '@/lib/fetchEvents'
import { getEventIcon } from '@/lib/eventIcons'

const containerStyle = {
  width: '100%',
  height: '100vh',
}

const center = { lat: 0, lng: 0 }

export default function Map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [events, setEvents] = useState<EonetEvent[]>([])
  const [selected, setSelected] = useState<EonetEvent | null>(null)
const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchEonetEvents().then(setEvents).finally(() => setLoading(false))
  }, [])

if (!isLoaded || loading) {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
    </div>
  )
}

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2}>
<MarkerClusterer>
  {(clusterer) => (
    <>
      {events
        .filter((event) => event.geometry[0]?.coordinates)
        .map((event) => {
          const coords = event.geometry[0].coordinates
          const category = event.categories[0]?.title ?? 'Default'
          const iconUrl = getEventIcon(category)

          return (
            <Marker
              key={event.id}
              clusterer={clusterer}
              position={{ lat: coords[1], lng: coords[0] }}
              icon={{
                url: iconUrl,
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => setSelected(event)}
            />
          )
        })}
    </>
  )}
</MarkerClusterer>




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
