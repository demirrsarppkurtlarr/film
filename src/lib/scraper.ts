import { supabaseAdmin } from './supabase'
import { generateSlug, extractImdbId, extractYear, cleanNumber } from './utils'
import { ScrapingResult } from '@/types'

function getTextByTag(html: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, 'is')
  const m = html.match(re)
  return m ? m[1].replace(/<[^>]*>/g, '').trim() : ''
}

function getMetaContent(html: string, property: string): string {
  const re = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
  const m = html.match(re)
  if (m) return m[1]
  const re2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i')
  const m2 = html.match(re2)
  return m2 ? m2[1] : ''
}

function getAttr(html: string, selector: string, attr: string): string {
  const re = new RegExp(`${selector}[^>]*${attr}=["']([^"']*)["']`, 'i')
  const m = html.match(re)
  return m ? m[1] : ''
}

function getAllLinks(html: string, pattern: string): string[] {
  const links: string[] = []
  const re = new RegExp(`href=["']([^"']*${pattern}[^"']*)["']`, 'gi')
  let m
  while ((m = re.exec(html)) !== null) {
    links.push(m[1])
  }
  return [...new Set(links)]
}

function getLinkTexts(html: string, pattern: string): string[] {
  const texts: string[] = []
  const re = new RegExp(`<a[^>]*href=["']([^"']*${pattern}[^"']*)["'][^>]*>(.*?)</a>`, 'gi')
  let m
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]*>/g, '').trim()
    if (text) texts.push(text)
  }
  return [...new Set(texts)]
}

export class HdfilmcehennemiScraper {
  private baseUrl = 'https://www.hdfilmcehennemi.nl'
  private delay = parseInt(process.env.SCRAPING_DELAY || '2000')

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchHtml(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Connection': 'keep-alive',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      return null
    }
  }

  async scrapeFilmPage(url: string): Promise<ScrapingResult | null> {
    const html = await this.fetchHtml(url)
    if (!html) return null

    try {
      // Ana başlık
      const fullTitle = getTextByTag(html, 'h1')
      if (!fullTitle) return null

      // Başlık ve orijinal başlık ayrımı
      let title = fullTitle
      let originalTitle: string | undefined

      const titleMatch = fullTitle.match(/^(.+?)\s+-\s+(.+?)\s+izle/)
      if (titleMatch) {
        title = titleMatch[1].trim()
        originalTitle = titleMatch[2].trim()
      } else {
        const simpleMatch = fullTitle.match(/^(.+?)\s+izle/)
        if (simpleMatch) {
          title = simpleMatch[1].trim()
        }
      }

      // IMDb puanı
      let imdbRating: number | undefined
      const imdbMatch = html.match(/IMDb\s*(?:Puanı)?\s*[:\s]*\s*([\d,.]+)/i)
      if (imdbMatch) {
        imdbRating = cleanNumber(imdbMatch[1])
      }

      // IMDb ID
      let imdbId: string | undefined
      const imdbLinkMatch = html.match(/href=["'](https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+))/i)
      if (imdbLinkMatch) {
        imdbId = imdbLinkMatch[2]
      }

      // Yıl
      let year: number | undefined
      const yearLinks = getLinkTexts(html, '/yil/')
      if (yearLinks.length > 0) {
        year = extractYear(yearLinks[0])
      }

      // Ülke
      let country: string | undefined
      const countryLinks = getLinkTexts(html, '/ulke/')
      if (countryLinks.length > 0) {
        country = countryLinks[0].replace(/ Filmleri/i, '').replace(/ filmleri/i, '').trim()
      }

      // Türler
      const genreTexts = getLinkTexts(html, '/tur/')
      const genres = genreTexts.filter(g =>
        g && g.length > 1 && g.length < 30 &&
        !g.includes('Filmleri') && !g.includes('izle') && !g.includes('film')
      )

      // Dil türleri
      const languageTypes: string[] = []
      const bodyText = html.replace(/<[^>]*>/g, ' ')
      if (bodyText.includes('Türkçe Dublaj')) {
        languageTypes.push('Türkçe Dublaj')
      } else if (bodyText.includes('Dublaj')) {
        languageTypes.push('Dublaj')
      }
      if (bodyText.includes('Türkçe Altyazılı')) {
        languageTypes.push('Türkçe Altyazılı')
      } else if (bodyText.includes('Altyazılı')) {
        languageTypes.push('Altyazılı')
      }
      if (languageTypes.length === 0) {
        languageTypes.push('Altyazılı')
      }

      // Açıklama
      let description: string | undefined
      const descMatch = html.match(/<p[^>]*>([\s\S]{50,}?)<\/p>/i)
      if (descMatch) {
        const desc = descMatch[1].replace(/<[^>]*>/g, '').trim()
        if (desc.length > 50) {
          description = desc
        }
      }
      if (!description) {
        const ogDesc = getMetaContent(html, 'og:description')
        if (ogDesc && ogDesc.length > 30) {
          description = ogDesc
        }
      }

      // Poster
      let posterUrl: string | undefined
      const ogImage = getMetaContent(html, 'og:image')
      if (ogImage && !ogImage.includes('placeholder')) {
        posterUrl = ogImage
      }
      if (!posterUrl) {
        const imgMatch = html.match(/<img[^>]*class=["'][^"']*poster[^"']*["'][^>]*src=["']([^"']*)["']/i)
        if (imgMatch) {
          posterUrl = imgMatch[1]
        }
      }
      if (!posterUrl) {
        const imgMatch2 = html.match(/<img[^>]*src=["'](https?:\/\/[^"']*(?:poster|cover|afis)[^"']*)["']/i)
        if (imgMatch2) {
          posterUrl = imgMatch2[1]
        }
      }

      // Oyuncular
      const actors: Array<{ name: string; character?: string; voice_role?: string }> = []
      const actorLinks = getLinkTexts(html, '/oyuncu/')
      for (const actorName of actorLinks) {
        if (actorName && actorName.length > 1 && actorName.length < 50) {
          actors.push({ name: actorName })
        }
      }

      await this.sleep(this.delay)

      return {
        title,
        slug: generateSlug(title),
        imdb_id: imdbId,
        imdb_rating: imdbRating,
        year,
        country,
        description,
        poster_url: posterUrl,
        language_types: languageTypes,
        genres: [...new Set(genres)],
        actors: actors.slice(0, 15),
        source_url: url
      }
    } catch (error) {
      console.error(`Error parsing film page ${url}:`, error)
      return null
    }
  }

  async discoverFilmUrls(): Promise<string[]> {
    const urls = new Set<string>()
    const maxPages = 3

    try {
      // Ana sayfa
      const homeHtml = await this.fetchHtml(this.baseUrl)
      if (homeHtml) {
        const links = getAllLinks(homeHtml, '^/')
        for (const href of links) {
          if (this.isFilmUrl(href)) {
            urls.add(this.baseUrl + href)
          }
        }
      }

      // Kategori sayfaları
      const categoryPaths = [
        '/category/nette-ilk-filmler/',
        '/category/tavsiye-filmler-izle2/',
        '/imdb-7-puan-uzeri-filmler-2/',
        '/en-cok-begenilen-filmleri-izle-4/'
      ]

      for (const categoryPath of categoryPaths) {
        for (let page = 1; page <= maxPages; page++) {
          const pageUrl = page === 1
            ? this.baseUrl + categoryPath
            : this.baseUrl + categoryPath + `page/${page}/`

          const html = await this.fetchHtml(pageUrl)
          if (!html) continue

          const links = getAllLinks(html, '^/')
          for (const href of links) {
            if (this.isFilmUrl(href)) {
              urls.add(this.baseUrl + href)
            }
          }

          await this.sleep(this.delay)
        }
      }

      // Yıl bazlı filmler
      const currentYear = new Date().getFullYear()
      for (const year of [currentYear, currentYear - 1, currentYear - 2]) {
        const yearUrl = `${this.baseUrl}/yil/${year}-filmleri-izle/`
        const html = await this.fetchHtml(yearUrl)
        if (!html) continue

        const links = getAllLinks(html, '^/')
        for (const href of links) {
          if (this.isFilmUrl(href)) {
            urls.add(this.baseUrl + href)
          }
        }

        await this.sleep(this.delay)
      }
    } catch (error) {
      console.error('Error discovering film URLs:', error)
    }

    return Array.from(urls)
  }

  private isFilmUrl(href: string): boolean {
    const excludedPaths = [
      '/category/', '/tur/', '/dil/', '/yil/', '/ulke/', '/oyuncu/',
      '/wp-content/', '/wp-includes/', '/wp-admin/', '/tag/', '/author/',
      '/film-robotu', '/film-istekleri', '/en-cok-yorumlananlar',
      '/en-cok-begenilen', '/imdb-7', '/tavsiye'
    ]

    if (excludedPaths.some(path => href.includes(path))) return false
    if (href.includes('/page/')) return false
    if (href.includes('//')) return false
    if (href === '/') return false
    if (href.split('/').filter(Boolean).length !== 1) return false

    return href.length > 2
  }

  async saveFilmToDatabase(filmData: ScrapingResult): Promise<boolean> {
    try {
      const { data: existing } = await supabaseAdmin
        .from('films')
        .select('id')
        .eq('slug', filmData.slug)
        .single()

      if (existing) {
        console.log(`Already exists: ${filmData.title}`)
        return false
      }

      const { data: film, error: filmError } = await supabaseAdmin
        .from('films')
        .insert({
          title: filmData.title,
          original_title: filmData.original_title,
          slug: filmData.slug,
          imdb_id: filmData.imdb_id,
          imdb_rating: filmData.imdb_rating,
          year: filmData.year,
          country: filmData.country,
          description: filmData.description,
          poster_url: filmData.poster_url,
          language_types: filmData.language_types,
          genres: filmData.genres,
          source_url: filmData.source_url,
          status: 'active'
        })
        .select()
        .single()

      if (filmError || !film) {
        console.error('Error saving film:', filmError)
        return false
      }

      for (const actorData of filmData.actors) {
        const actorSlug = generateSlug(actorData.name)

        const { data: actor } = await supabaseAdmin
          .from('actors')
          .upsert({
            name: actorData.name,
            slug: actorSlug
          })
          .select()
          .single()

        if (actor) {
          await supabaseAdmin
            .from('film_actors')
            .insert({
              film_id: film.id,
              actor_id: actor.id,
              character_name: actorData.character,
              voice_role: actorData.voice_role
            })
        }
      }

      for (const genreName of filmData.genres) {
        const genreSlug = generateSlug(genreName)

        const { data: category } = await supabaseAdmin
          .from('categories')
          .upsert({
            name: genreName,
            slug: genreSlug,
            type: 'genre'
          })
          .select()
          .single()

        if (category) {
          await supabaseAdmin
            .from('film_categories')
            .insert({
              film_id: film.id,
              category_id: category.id
            })
        }
      }

      console.log(`Saved: ${filmData.title}`)
      return true

    } catch (error) {
      console.error('Error saving film to database:', error)
      return false
    }
  }

  async runFullScraping(): Promise<{ success: number; failed: number; total: number }> {
    console.log('Starting full scraping process...')

    const filmUrls = await this.discoverFilmUrls()
    console.log(`Found ${filmUrls.length} film URLs`)

    let successCount = 0
    let failCount = 0

    const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '5')

    for (let i = 0; i < filmUrls.length; i += maxConcurrent) {
      const batch = filmUrls.slice(i, i + maxConcurrent)

      const promises = batch.map(async (url) => {
        const filmData = await this.scrapeFilmPage(url)
        if (filmData) {
          const saved = await this.saveFilmToDatabase(filmData)
          return saved ? 1 : 0
        }
        return 0
      })

      const results = await Promise.all(promises)
      successCount += results.reduce((sum: number, count: number) => sum + count, 0)
      failCount += batch.length - results.reduce((sum: number, count: number) => sum + count, 0)

      console.log(`Progress: ${Math.min(i + maxConcurrent, filmUrls.length)}/${filmUrls.length} | Success: ${successCount} | Failed: ${failCount}`)
    }

    await supabaseAdmin.from('scraping_logs').insert({
      source_url: this.baseUrl,
      action: 'full-scraping',
      status: successCount > 0 ? 'success' : 'failed',
      message: `Scraping completed. Success: ${successCount}, Failed: ${failCount}`,
      films_count: successCount
    })

    console.log(`Scraping completed! Success: ${successCount}, Failed: ${failCount}`)
    return { success: successCount, failed: failCount, total: filmUrls.length }
  }
}

export default HdfilmcehennemiScraper
