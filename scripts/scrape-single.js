require('dotenv').config()

const { HdfilmcehennemiScraper } = require('../src/lib/scraper')

async function main() {
  const url = process.argv[2]
  
  if (!url) {
    console.log('Usage: node scrape-single.js <url>')
    console.log('Example: node scrape-single.js https://www.hdfilmcehennemi.nl/toy-story-5-2026/')
    process.exit(1)
  }
  
  console.log(`🔍 Scraping single URL: ${url}`)
  
  const scraper = new HdfilmcehennemiScraper()
  const filmData = await scraper.scrapeFilmPage(url)
  
  if (filmData) {
    console.log('\n🎬 Film Data:')
    console.log(JSON.stringify(filmData, null, 2))
    
    const saved = await scraper.saveFilmToDatabase(filmData)
    console.log(saved ? '\n✅ Saved to database' : '\n⚠️ Not saved (already exists or error)')
  } else {
    console.log('❌ Failed to scrape film')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
