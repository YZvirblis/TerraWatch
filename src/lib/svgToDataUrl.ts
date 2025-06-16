export function svgToDataUrl(svgString: string): string {
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString)
}
