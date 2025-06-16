'use client'

import { useEffect } from 'react'
import { useEventStore } from '@/store/useEventStore'
import MapWrapper from '@/components/MapWrapper'
import CategoryFilter from '@/components/CategoryFilter'
import EventCategoryChart from '@/components/EventCategoryChart'

export default function Home() {
  const { fetchEvents, loading } = useEventStore()

  useEffect(() => {
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="h-full w-full relative pb-96">
      <MapWrapper />
      <CategoryFilter />
      <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <EventCategoryChart />
        </div>
      </div>
    </main>
  )
}
