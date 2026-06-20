'use client'

import { useParams } from 'next/navigation'
import { FilmGrid } from './FilmGrid'

export function YearPageClient() {
  const params = useParams()
  const year = typeof params?.year === 'string' ? params.year : ''

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{year} Filmleri</h1>
          <p className="text-dark-400">
            {year} yılına ait en popüler ve yeni filmler.
          </p>
        </div>

        <FilmGrid
          title={`${year} Filmleri`}
          year={year}
          orderBy="imdb_rating"
          orderDirection="desc"
          showLoadMore={true}
        />
      </div>
    </div>
  )
}
