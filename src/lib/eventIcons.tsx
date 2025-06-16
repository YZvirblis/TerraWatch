import { Flame, CloudLightning, Waves, Mountain, Globe } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { svgToDataUrl } from './svgToDataUrl'

export function getEventIcon(category: string): string {
  const iconMap: Record<string, JSX.Element> = {
    Wildfires: <Flame size={40} color="red" />,
    'Severe Storms': <CloudLightning size={40} color="blue" />,
    Floods: <Waves size={40} color="teal" />,
    Volcanoes: <Mountain size={40} color="orange" />,
    Default: <Globe size={40} color="gray" />,
  }

  const iconComponent = iconMap[category] || iconMap.Default
  const svgString = renderToStaticMarkup(iconComponent)
  return svgToDataUrl(svgString)
}
