'use client'

import { useState, useEffect, useCallback } from 'react'
import { FilmCard, FilmCardSkeleton } from './FilmCard'
import { getFilms } from '@/lib/supabase'
import { Film, Pagination } from '@/types'

interface FilmGridProps {
  initialFilms?: Film[]
  initialPagination?: Pagination
  genre?: string
  year?: string
  search?: string
  language?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  title?: string
  emptyMessage?: string
  showLoadMore?: boolean
}

export function FilmGrid({
  initialFilms = [],
  initialPagination,
  genre,
  year,
  search,
  language,
  orderBy = 'created_at',
  orderDirection = 'desc',
  title,
  emptyMessage = 'Film bulunamadı.',
  showLoadMore = true
}: FilmGridProps) {
  const [films, setFilms] = useState<Film[]>(initialFilms)
  const [pagination, setPagination] = useState<Pagination | undefined>(initialPagination)
  const [page, setPage] = useState(initialPagination?.page || 1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialPagination ? page < initialPagination.totalPages : false
  )

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const data = await getFilms({
        page: nextPage,
        limit: 20,
        genre,
        year,
        search,
        language,
        orderBy,
        orderDirection
      })

      if (data.films && data.films.length > 0) {
        setFilms(prev => [...prev, ...data.films])
        setPage(nextPage)
        setPagination(data.pagination)
        setHasMore(nextPage < data.pagination.totalPages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more films:', error)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, genre, year, search, language, orderBy, orderDirection])

  useEffect(() => {
    if (initialFilms.length === 0 && !initialPagination) {
      const loadInitial = async () => {
        setLoading(true)
        try {
          const data = await getFilms({
            page: 1,
            limit: 20,
            genre,
            year,
            search,
            language,
            orderBy,
            orderDirection
          })
          setFilms(data.films || [])
          setPagination(data.pagination)
          setPage(1)
          setHasMore(data.pagination?.page < data.pagination?.totalPages)
        } catch (error) {
          console.error('Error loading films:', error)
        } finally {
          setLoading(false)
        }
      }

      loadInitial()
    }
  }, [genre, year, search, language, orderBy, orderDirection, initialFilms.length, initialPagination])

  if (loading && films.length === 0) {
    return (
      <div>
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <FilmCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!loading && films.length === 0) {
    return (
      <div>
        {title && <h2 className="text-xl font-bold text-white mb-6">{title}</h2>}
        <div className="text-center py-16 bg-dark-800 rounded-lg border border-dark-700">
          <p className="text-dark-400 text-lg">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {pagination && (
            <span className="text-sm text-dark-400">
              Toplam {pagination.total} film
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>

      {showLoadMore && hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Yükleniyor...
              </>
            ) : (
              'Daha Fazla Göster'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
