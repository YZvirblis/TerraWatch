'use client'

import {
  Flame,
  CloudLightning,
  Waves,
  Mountain,
  Activity,
} from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'

const buttons = [
  { id: 'Wildfires', icon: Flame },
  { id: 'Severe Storms', icon: CloudLightning },
  { id: 'Floods', icon: Waves },
  { id: 'Volcanoes', icon: Mountain },
  { id: 'Earthquakes', icon: Activity },
] as const

export default function CategoryFilter() {
  const activeCategories = useFilterStore((state) => state.activeCategories)
  const toggleCategory = useFilterStore((state) => state.toggleCategory)

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow p-2 flex gap-2 z-50">
      {buttons.map(({ id, icon: Icon }) => {
        const active = activeCategories.includes(id)

        return (
          <button
            key={id}
            onClick={() => toggleCategory(id)}
            className={`relative group p-2 rounded-md border transition-all duration-200 flex items-center justify-center
              ${active
                ? 'bg-blue-500 border-blue-700 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            title={id}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span className="absolute text-xs opacity-0 group-hover:opacity-100 bg-black text-white px-2 py-1 rounded shadow -bottom-7 whitespace-nowrap z-50 transition">
              {id}
            </span>
          </button>
        )
      })}
    </div>
  )
}
