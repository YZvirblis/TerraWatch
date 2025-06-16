import { create } from 'zustand'
import { EonetEvent, fetchEonetEvents } from '@/lib/fetchEvents'

type EventState = {
  events: EonetEvent[]
  loading: boolean
  error: string | null
  fetchEvents: () => Promise<void>
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  loading: true,
  error: null,
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null })
      const events = await fetchEonetEvents()
      set({ events, loading: false })
    } catch (error: any) {
      set({ error: error.message || 'Error loading events', loading: false })
    }
  },
}))
