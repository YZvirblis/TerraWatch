'use client'

import { Bar } from 'react-chartjs-2'
import { useEffect, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { fetchEonetEvents, EonetEvent } from '@/lib/fetchEvents'
import { useEventStore } from '@/store/useEventStore'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function EventCategoryChart() {
    const events = useEventStore((state) => state.events)

const chartData = useMemo(() => {
  const counts: Record<string, number> = {
    'Wildfires': 0,
    'Severe Storms': 0,
    'Floods': 0,
    'Volcanoes': 0,
    'Earthquakes': 0,
  }

  for (const event of events) {
    for (const category of event.categories) {
      const title = category.title.trim()
      if (counts.hasOwnProperty(title)) {
        counts[title] += 1
      }
    }
  }

  return {
    labels: Object.keys(counts),
    datasets: [
      {
        label: 'Active Events by Category',
        data: Object.values(counts),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
      },
    ],
  }
}, [events])


  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-2 text-center">Event Distribution by Category</h2>
      <Bar data={chartData} />
    </div>
  )
}
