import { Suspense } from 'react'
import { FilmGrid } from '@/components/FilmGrid'
import { LanguageFilter } from '@/components/LanguageFilter'

export const metadata = {
  title: 'Tüm Filmler - HD Film Cehennemi',
  description: 'Tüm filmleri keşfedin. Türkçe dublaj ve altyazılı seçeneklerle.'
}

export default function FilmsPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Tüm Filmler</h1>
          <p className="text-dark-400 mb-6">
            Tüm film arşivimizi keşfedin. Türkçe dublaj ve altyazılı seçeneklerle.
          </p>
          <Suspense fallback={
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-28 h-9 bg-dark-800 rounded-full animate-pulse" />
              ))}
            </div>
          }>
            <LanguageFilter />
          </Suspense>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-dark-800 rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <FilmGrid
            orderBy="created_at"
            orderDirection="desc"
            showLoadMore={true}
          />
        </Suspense>
      </div>
    </div>
  )
}
