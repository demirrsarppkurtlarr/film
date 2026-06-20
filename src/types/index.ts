export interface Film {
  id: number
  title: string
  slug: string
  original_title?: string
  imdb_id?: string
  imdb_rating?: number
  year?: number
  country?: string
  description?: string
  poster_url?: string
  language_types: string[]
  genres: string[]
  view_count: number
  status: string
  scraped_at: string
  created_at: string
  updated_at: string
  source_url?: string
}

export interface Actor {
  id: number
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  film_count: number
  character_name?: string
  voice_role?: string
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  type: string
  film_count: number
  created_at: string
}

export interface FilmWithActors extends Film {
  actors: Actor[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FilmsResponse {
  films: Film[]
  pagination: Pagination
}

export interface ScrapingResult {
  title: string
  slug: string
  original_title?: string
  imdb_id?: string
  imdb_rating?: number
  year?: number
  country?: string
  description?: string
  poster_url?: string
  language_types: string[]
  genres: string[]
  actors: Array<{
    name: string
    character?: string
    voice_role?: string
  }>
  source_url: string
}

export interface ScrapingLog {
  id: number
  source_url: string
  action: string
  status: string
  message: string
  films_count: number
  created_at: string
}
