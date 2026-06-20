import Link from 'next/link'
import Image from 'next/image'
import { Film } from '@/types'
import { getLanguageBadgeColor, getOptimizedImageUrl, truncateText } from '@/lib/utils'

interface FilmCardProps {
  film: Film
  showGenres?: boolean
}

export function FilmCard({ film, showGenres = true }: FilmCardProps) {
  const optimizedPoster = getOptimizedImageUrl(film.poster_url, 400)

  return (
    <Link href={`/film/${film.slug}/`} className="block group">
      <article className="film-card bg-dark-800 rounded-lg overflow-hidden border border-dark-700 h-full flex flex-col">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden bg-dark-700">
          {optimizedPoster ? (
            <Image
              src={optimizedPoster}
              alt={film.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-dark-700 to-dark-800">
              <span className="text-dark-500 text-sm font-medium">No Poster</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Language badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {film.language_types.slice(0, 2).map((lang, index) => (
              <span
                key={index}
                className={`${getLanguageBadgeColor(lang)} px-2 py-0.5 text-xs font-semibold rounded shadow-sm`}
              >
                {lang}
              </span>
            ))}
          </div>

          {/* IMDb badge */}
          {film.imdb_rating && (
            <div className="absolute bottom-2 left-2 bg-yellow-500/90 text-yellow-950 px-2 py-0.5 rounded text-xs font-bold">
              ⭐ {film.imdb_rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-brand-400 transition-colors">
            {film.title}
          </h3>

          <div className="mt-auto flex items-center justify-between text-xs text-dark-400">
            {film.year && <span>{film.year}</span>}
            {film.country && <span className="text-dark-500">{film.country}</span>}
          </div>

          {showGenres && film.genres.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {film.genres.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="text-xs text-dark-400 bg-dark-700 px-1.5 py-0.5 rounded"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export function FilmCardSkeleton() {
  return (
    <div className="bg-dark-800 rounded-lg overflow-hidden border border-dark-700">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded" />
        <div className="h-3 skeleton rounded w-2/3" />
        <div className="flex gap-1">
          <div className="h-3 skeleton rounded w-12" />
          <div className="h-3 skeleton rounded w-12" />
        </div>
      </div>
    </div>
  )
}
