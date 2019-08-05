export function buildImageUrlByStyle(url, style) {
  style = style || 'w600'
  return `${url}?x-oss-process=style/${style}`
}
