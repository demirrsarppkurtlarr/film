import { Suspense } from 'react'
import { FilmGrid } from '@/components/FilmGrid'

export const metadata = {
  title: 'IMDb 7+ Filmler - HD Film Cehennemi',
  description: 'IMDb puanı 7 ve üzeri olan en kaliteli filmler.'
}

export default function ImdbPage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">IMDb 7+ Filmler</h1>
          <p className="text-dark-400">
            IMDb puanı 7 ve üzeri olan en kaliteli filmler.
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-dark-800 rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <FilmGrid
            title="IMDb 7+ Filmler"
            orderBy="imdb_rating"
            orderDirection="desc"
            showLoadMore={true}
          />
        </Suspense>
      </div>
    </div>
  )
}
