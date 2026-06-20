'use client'

import { useParams } from 'next/navigation'
import { FilmGrid } from './FilmGrid'

export function CategoryPageClient() {
  const params = useParams()
  const genre = typeof params?.slug === 'string' ? params.slug : ''
  const displayName = genre.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{displayName} Filmleri</h1>
          <p className="text-dark-400">
            {displayName} türündeki en popüler ve yeni filmler.
          </p>
        </div>

        <FilmGrid
          title={`${displayName} Filmleri`}
          genre={displayName}
          orderBy="created_at"
          orderDirection="desc"
          showLoadMore={true}
        />
      </div>
    </div>
  )
}
