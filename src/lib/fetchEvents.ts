export interface EonetEvent {
  id: string
  title: string
  categories: { id: number; title: string }[]
  geometry: { type: string; coordinates: number[]; date: string }[]
  sources: { id: string; url: string }[]
}

export async function fetchEonetEvents(): Promise<EonetEvent[]> {
  const res = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open')
  const data = await res.json()
  return data.events
}
