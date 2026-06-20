import { NextRequest, NextResponse } from 'next/server'
import { HdfilmcehennemiScraper } from '@/lib/scraper'


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, action, url } = body

    if (secret !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const scraper = new HdfilmcehennemiScraper()

    if (action === 'full') {
      scraper.runFullScraping().catch(console.error)
      
      return NextResponse.json({
        message: 'Scraping arka planda başlatıldı',
        status: 'started'
      })
    }

    if (action === 'single' && url) {
      let filmData
      try {
        filmData = await scraper.scrapeFilmPage(url)
      } catch (scrapeErr: any) {
        console.error('Scrape error:', scrapeErr)
        return NextResponse.json(
          { error: `Film sayfası çekilemedi: ${scrapeErr?.message || 'bilinmeyen hata'}` },
          { status: 502 }
        )
      }
      
      if (!filmData) {
        return NextResponse.json(
          { error: 'Film verisi bulunamadı. URL kontrol edin.' },
          { status: 400 }
        )
      }

      let saved = false
      try {
        saved = await scraper.saveFilmToDatabase(filmData)
      } catch (saveErr: any) {
        console.error('Save error:', saveErr)
        return NextResponse.json(
          { error: `Veritabanına kayıt başarısız: ${saveErr?.message || 'bilinmeyen hata'}`, film: filmData },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: saved,
        film: filmData
      })
    }

    return NextResponse.json(
      { error: 'Geçersiz işlem' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Scrape API error:', error)
    return NextResponse.json(
      { error: `Sunucu hatası: ${error?.message || 'bilinmeyen hata'}` },
      { status: 500 }
    )
  }
}
