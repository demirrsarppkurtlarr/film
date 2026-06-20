import * as cheerio from 'cheerio'
import { supabaseAdmin } from './supabase'
import { generateSlug, extractImdbId, extractYear, cleanNumber } from './utils'
import { ScrapingResult } from '@/types'

export class HdfilmcehennemiScraper {
  private baseUrl = 'https://www.hdfilmcehennemi.nl'
  private delay = parseInt(process.env.SCRAPING_DELAY || '2000')

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private async fetchHtml(url: string): Promise<cheerio.CheerioAPI | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      return cheerio.load(html)
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      return null
    }
  }

  async scrapeFilmPage(url: string): Promise<ScrapingResult | null> {
    const $ = await this.fetchHtml(url)
    if (!$) return null

    try {
      // Ana başlık
      const fullTitle = $('h1').first().text().trim()
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

      // Film bilgi bölümü
      const infoSection = $('.film-info, .movie-info, .movie-details').first()
      
      // IMDb puanı
      let imdbRating: number | undefined
      const imdbText = infoSection.text() + $('body').text()
      const imdbMatch = imdbText.match(/IMDb\s*(?:Puanı)?\s*[:\s]*\s*([\d,.]+)/i)
      if (imdbMatch) {
        imdbRating = cleanNumber(imdbMatch[1])
      }

      // IMDb ID
      let imdbId: string | undefined
      infoSection.find('a').each((_: number, elem: any) => {
        const href = $(elem).attr('href')
        if (href && href.includes('imdb.com')) {
          imdbId = extractImdbId(href)
        }
      })

      // Yıl
      let year: number | undefined
      const yearLink = $('a[href*="/yil/"]').first().text()
      if (yearLink) {
        year = extractYear(yearLink)
      }

      // Ülke
      let country: string | undefined
      const countryLink = $('a[href*="/ulke/"]').first().text()
      if (countryLink) {
        country = countryLink.replace(' Filmleri', '').replace(' filmleri', '').trim()
      }

      // Türler
      const genres: string[] = []
      $('a[href*="/tur/"]').each((_: number, elem: any) => {
        const genre = $(elem).text().trim()
        if (genre && !genre.includes('Filmleri') && !genre.includes('izle')) {
          genres.push(genre)
        }
      })

      // Dil türleri
      const languageTypes: string[] = []
      const languageText = $('body').text()
      if (languageText.includes('Türkçe Dublaj')) {
        languageTypes.push('Türkçe Dublaj')
      } else if (languageText.includes('Dublaj')) {
        languageTypes.push('Dublaj')
      }
      if (languageText.includes('Türkçe Altyazılı')) {
        languageTypes.push('Türkçe Altyazılı')
      } else if (languageText.includes('Altyazılı')) {
        languageTypes.push('Altyazılı')
      }
      
      if (languageTypes.length === 0) {
        languageTypes.push('Altyazılı')
      }

      // Açıklama
      let description: string | undefined
      const descriptionSelectors = [
        '.film-description p',
        '.movie-description p',
        '.description p',
        '.summary p',
        '.film-info + p'
      ]
      
      for (const selector of descriptionSelectors) {
        const desc = $(selector).first().text().trim()
        if (desc && desc.length > 50) {
          description = desc
          break
        }
      }

      // Poster
      let posterUrl: string | undefined
      const posterSelectors = [
        '.poster img',
        '.movie-poster img',
        '.film-poster img',
        '.main-poster img'
      ]
      
      for (const selector of posterSelectors) {
        const src = $(selector).first().attr('src') || $(selector).first().attr('data-src')
        if (src && !src.includes('placeholder')) {
          posterUrl = src
          break
        }
      }
      
      // Fallback: Open Graph image
      if (!posterUrl) {
        const ogImage = $('meta[property="og:image"]').attr('content')
        if (ogImage) {
          posterUrl = ogImage
        }
      }

      // Oyuncular
      const actors: Array<{ name: string; character?: string; voice_role?: string }> = []
      const actorSelectors = [
        '.cast .actor',
        '.actors .actor',
        '.oyuncular a',
        'a[href*="/oyuncu/"]'
      ]
      
      for (const selector of actorSelectors) {
        $(selector).each((_: number, elem: any) => {
          const actorName = $(elem).text().trim()
          const characterName = $(elem).find('.character').text().trim()
          
          if (actorName && actorName.length > 1 && actorName.length < 50) {
            actors.push({
              name: actorName,
              character: characterName || undefined,
              voice_role: undefined
            })
          }
        })
        
        if (actors.length > 0) break
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
      const home$ = await this.fetchHtml(this.baseUrl)
      if (home$) {
        home$('a[href^="/"]').each((_: number, elem: any) => {
          const href = home$(elem).attr('href')
          if (href && this.isFilmUrl(href)) {
            urls.add(this.baseUrl + href)
          }
        })
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
          
          const $ = await this.fetchHtml(pageUrl)
          if (!$) continue

          $('a[href^="/"]').each((_: number, elem: any) => {
            const href = $(elem).attr('href')
            if (href && this.isFilmUrl(href)) {
              urls.add(this.baseUrl + href)
            }
          })

          await this.sleep(this.delay)
        }
      }

      // Yıl bazlı filmler
      const currentYear = new Date().getFullYear()
      for (const year of [currentYear, currentYear - 1, currentYear - 2]) {
        const yearUrl = `${this.baseUrl}/yil/${year}-filmleri-izle/`
        const $ = await this.fetchHtml(yearUrl)
        if (!$) continue

        $('a[href^="/"]').each((_: number, elem: any) => {
          const href = $(elem).attr('href')
          if (href && this.isFilmUrl(href)) {
            urls.add(this.baseUrl + href)
          }
        })

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
      // Var mı kontrol et
      const { data: existing } = await supabaseAdmin
        .from('films')
        .select('id')
        .eq('slug', filmData.slug)
        .single()

      if (existing) {
        console.log(`⚠️ Already exists: ${filmData.title}`)
        return false
      }

      // Film ekle
      const { data: film, error: filmError } = await supabaseAdmin
        .from('films')
        .insert({
          title: filmData.title,
          original_title: filmData.title !== filmData.title ? filmData.title : undefined,
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

      // Oyuncuları ekle
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

      // Kategorileri güncelle
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

      console.log(`✅ Saved: ${filmData.title}`)
      return true

    } catch (error) {
      console.error('Error saving film to database:', error)
      return false
    }
  }

  async runFullScraping(): Promise<{ success: number; failed: number; total: number }> {
    console.log('🚀 Starting full scraping process...')
    
    const filmUrls = await this.discoverFilmUrls()
    console.log(`📊 Found ${filmUrls.length} film URLs`)

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

    // Log kaydı
    await supabaseAdmin.from('scraping_logs').insert({
      source_url: this.baseUrl,
      action: 'full-scraping',
      status: successCount > 0 ? 'success' : 'failed',
      message: `Scraping completed. Success: ${successCount}, Failed: ${failCount}`,
      films_count: successCount
    })

    console.log(`✅ Scraping completed! Success: ${successCount}, Failed: ${failCount}`)
    return { success: successCount, failed: failCount, total: filmUrls.length }
  }
}

export default HdfilmcehennemiScraper
