'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getFilmWithActors, getRelatedFilms } from '@/lib/supabase'
import { FilmCard } from './FilmCard'
import { getLanguageBadgeColor, getOptimizedImageUrl, truncateText } from '@/lib/utils'
import { FilmWithActors, Film } from '@/types'

export function FilmDetailClient() {
  const params = useParams()
  const slug = params?.slug as string
  const [film, setFilm] = useState<FilmWithActors | null>(null)
  const [relatedFilms, setRelatedFilms] = useState<Film[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const loadFilm = async () => {
      try {
        const filmData = await getFilmWithActors(slug)
        setFilm(filmData)

        if (filmData) {
          const related = await getRelatedFilms(filmData, 8)
          setRelatedFilms(related)
        }
      } catch (error) {
        console.error('Error loading film:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFilm()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!film) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Film Bulunamadı</h1>
          <Link href="/" className="text-brand-400 hover:text-brand-300">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  const optimizedPoster = getOptimizedImageUrl(film.poster_url, 600)

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Film Header */}
      <section className="bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Poster */}
            <div className="md:col-span-4 lg:col-span-3">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-dark-700">
                {optimizedPoster ? (
                  <Image
                    src={optimizedPoster}
                    alt={film.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
                    <span className="text-dark-500">No Poster</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-8 lg:col-span-9">
              <nav className="flex items-center gap-2 text-sm text-dark-400 mb-4">
                <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                <span>/</span>
                <span className="text-white">{film.title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {film.title} izle
              </h1>

              {film.original_title && film.original_title !== film.title && (
                <p className="text-dark-400 text-lg mb-4">{film.original_title}</p>
              )}

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {film.imdb_rating && (
                  <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold">{film.imdb_rating.toFixed(1)}</span>
                    <span className="text-xs text-yellow-500/70">IMDb</span>
                  </div>
                )}

                {film.year && (
                  <Link
                    href={`/yil/${film.year}/`}
                    className="bg-dark-800 text-dark-200 px-3 py-1.5 rounded-full text-sm border border-dark-600 hover:border-brand-500 transition-colors"
                  >
                    {film.year}
                  </Link>
                )}

                {film.country && (
                  <span className="bg-dark-800 text-dark-200 px-3 py-1.5 rounded-full text-sm border border-dark-600">
                    {film.country}
                  </span>
                )}

                {film.language_types.map((lang, index) => (
                  <span
                    key={index}
                    className={`${getLanguageBadgeColor(lang)} px-3 py-1.5 rounded-full text-sm font-medium`}
                  >
                    {lang}
                  </span>
                ))}
              </div>

              {/* Genres */}
              {film.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {film.genres.map((genre, index) => (
                    <Link
                      key={index}
                      href={`/tur/${genre.toLowerCase().replace(/\s+/g, '-')}/`}
                      className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      #{genre}
                    </Link>
                  ))}
                </div>
              )}

              {/* Description */}
              {film.description && (
                <div className="bg-dark-800/50 border border-dark-700 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-semibold mb-2">Film Konusu</h3>
                  <p className="text-dark-300 leading-relaxed">{film.description}</p>
                </div>
              )}

              {/* Watch button */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Film İzle
                </button>
                
                {film.source_url && (
                  <a
                    href={film.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-dark-200 font-semibold rounded-lg border border-dark-600 transition-colors"
                  >
                    Kaynak
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast */}
      {film.actors && film.actors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-white mb-6">Oyuncular</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {film.actors.map((actor) => (
              <div
                key={actor.id}
                className="bg-dark-800 border border-dark-700 rounded-lg p-4 text-center hover:border-dark-600 transition-colors"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {actor.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-white font-medium text-sm">{actor.name}</h3>
                {actor.character_name && (
                  <p className="text-dark-500 text-xs mt-1">{actor.character_name}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Films */}
      {relatedFilms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-white mb-6">Benzer Filmler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {relatedFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
