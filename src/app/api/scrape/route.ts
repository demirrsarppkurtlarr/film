import { NextRequest, NextResponse } from 'next/server'
import { HdfilmcehennemiScraper } from '@/lib/scraper'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { secret, action, url } = await request.json()

    if (secret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const scraper = new HdfilmcehennemiScraper()

    if (action === 'full') {
      // Edge runtime'da uzun süren işlemler için hemen döndür
      scraper.runFullScraping().catch(console.error)
      
      return NextResponse.json({
        message: 'Scraping started in background',
        status: 'started'
      })
    }

    if (action === 'single' && url) {
      const filmData = await scraper.scrapeFilmPage(url)
      
      if (!filmData) {
        return NextResponse.json(
          { error: 'Failed to scrape film' },
          { status: 400 }
        )
      }

      const saved = await scraper.saveFilmToDatabase(filmData)
      
      return NextResponse.json({
        success: saved,
        film: filmData
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Scrape API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
