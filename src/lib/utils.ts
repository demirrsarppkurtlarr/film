export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatTitle(title: string): string {
  return title
    .replace(/ izle$/i, '')
    .replace(/ \(\d{4}\)$/i, '')
    .trim()
}

export function getLanguageBadgeColor(languageType: string): string {
  if (languageType.includes('Dublaj')) {
    return 'bg-yellow-500/90 text-yellow-950'
  }
  if (languageType.includes('Altyazılı')) {
    return 'bg-blue-500/90 text-white'
  }
  return 'bg-gray-500/90 text-white'
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function getOptimizedImageUrl(url?: string, width: number = 300): string {
  if (!url) return ''
  if (url.includes('weserv.nl')) return url
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=80&output=webp`
}

export function getYears(): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let year = currentYear; year >= 1980; year--) {
    years.push(year)
  }
  return years
}

export function cleanNumber(text: string): number | undefined {
  const match = text.match(/[\d.]+/)
  if (!match) return undefined
  const num = parseFloat(match[0])
  return isNaN(num) ? undefined : num
}

export function extractYear(text: string): number | undefined {
  const match = text.match(/(\d{4})/)
  if (!match) return undefined
  const year = parseInt(match[1])
  if (year < 1900 || year > 2030) return undefined
  return year
}

export function extractImdbId(url: string): string | undefined {
  const match = url.match(/tt\d+/)
  return match ? match[0] : undefined
}
