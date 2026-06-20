'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { FilmGrid } from '@/components/FilmGrid'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams?.get('search') || ''

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {query ? `"${query}" Arama Sonuçları` : 'Film Ara'}
          </h1>
          <p className="text-dark-400">
            {query
              ? `Arama sonuçlarını aşağıda görüntüleyebilirsiniz.`
              : 'Yukarıdaki arama çubuğundan film arayabilirsiniz.'}
          </p>
        </div>

        {query ? (
          <FilmGrid
            search={query}
            orderBy="created_at"
            orderDirection="desc"
            emptyMessage={`"${query}" için film bulunamadı.`}
            showLoadMore={true}
          />
        ) : (
          <div className="text-center py-16 bg-dark-800 rounded-lg border border-dark-700">
            <p className="text-dark-400 text-lg">Arama yapmak için yukarıdaki arama çubuğunu kullanın.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-dark-800 rounded w-1/3 mb-4 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-dark-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
