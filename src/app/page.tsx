import { Suspense } from 'react'
import { SectionTitle } from '@/components/SectionTitle'
import { FilmGrid } from '@/components/FilmGrid'
import { CategoryCloud } from '@/components/CategoryCloud'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 py-12 md:py-16 border-b border-dark-700">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              HD Film İzleme Platformu
            </h1>
            <p className="text-dark-400 text-lg mb-8">
              En yeni ve popüler filmleri Türkçe dublaj ve altyazılı seçeneklerle keşfedin.
            </p>
            
            {/* Categories quick access */}
            <Suspense fallback={
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-24 h-9 bg-dark-800 rounded-full animate-pulse" />
                ))}
              </div>
            }>
              <CategoryCloud />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Featured Films */}
        <section>
          <SectionTitle title="IMDb 7+ Filmler" href="/imdb/" />
          <FilmGrid
            orderBy="imdb_rating"
            orderDirection="desc"
            showLoadMore={false}
          />
        </section>

        {/* Latest Films */}
        <section>
          <SectionTitle title="Yeni Eklenenler" href="/latest/" />
          <FilmGrid
            orderBy="created_at"
            orderDirection="desc"
            showLoadMore={false}
          />
        </section>

        {/* Browse All Section */}
        <section>
          <SectionTitle title="Tüm Filmler" href="/films/" showMore={true} />
          <FilmGrid
            orderBy="created_at"
            orderDirection="desc"
            showLoadMore={true}
          />
        </section>
      </div>
    </div>
  )
}
