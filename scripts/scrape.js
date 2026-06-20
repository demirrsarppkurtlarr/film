require('dotenv').config()

const { HdfilmcehennemiScraper } = require('../src/lib/scraper')

async function main() {
  console.log('🎬 Starting film scraping...')
  
  const scraper = new HdfilmcehennemiScraper()
  const result = await scraper.runFullScraping()
  
  console.log('\n📊 RESULTS:')
  console.log(`Total URLs: ${result.total}`)
  console.log(`Successful: ${result.success}`)
  console.log(`Failed: ${result.failed}`)
}

main()
  .then(() => {
    console.log('✅ Done')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
