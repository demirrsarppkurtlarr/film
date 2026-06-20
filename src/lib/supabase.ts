import { createClient } from '@supabase/supabase-js'
import { Film, Actor, Category, FilmWithActors } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
)

// Film CRUD operations
export async function getFilms({
  page = 1,
  limit = 20,
  genre,
  year,
  search,
  language,
  orderBy = 'created_at',
  orderDirection = 'desc'
}: {
  page?: number
  limit?: number
  genre?: string
  year?: string
  search?: string
  language?: string
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}) {
  try {
    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('films')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(start, end)

    if (genre) {
      query = query.contains('genres', [genre])
    }

    if (year) {
      query = query.eq('year', parseInt(year))
    }

    if (language) {
      query = query.contains('language_types', [language])
    }

    if (search) {
      query = query.ilike('title', `%${search}%`)
    }

    const { data: films, error, count } = await query

    if (error) {
      console.error('Error fetching films:', error)
      return {
        films: [] as Film[],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }

    return {
      films: films as Film[],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching films:', error)
    return {
      films: [] as Film[],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    }
  }
}

export async function getFilmBySlug(slug: string) {
  try {
    const { data: film, error } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Error fetching film:', error)
      return null
    }

    return film as Film
  } catch (error) {
    console.error('Error fetching film:', error)
    return null
  }
}

export async function getFilmWithActors(slug: string): Promise<FilmWithActors | null> {
  try {
    const { data: film, error: filmError } = await supabase
      .from('films')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (filmError || !film) {
      console.error('Error fetching film with actors:', filmError)
      return null
    }

    const { data: filmActors, error: actorsError } = await supabase
      .from('film_actors')
      .select('character_name, voice_role, actors(*)')
      .eq('film_id', film.id)

    if (actorsError) {
      console.error('Error fetching actors:', actorsError)
      return { ...film, actors: [] }
    }

    const actors = (filmActors || []).map((fa: any) => ({
      ...fa.actors,
      character_name: fa.character_name,
      voice_role: fa.voice_role
    })) as Actor[]

    return { ...film, actors }
  } catch (error) {
    console.error('Error fetching film with actors:', error)
    return null
  }
}

export async function getCategories() {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('film_count', { ascending: false })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return categories as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getFeaturedFilms(limit = 12) {
  try {
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .eq('status', 'active')
      .order('imdb_rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured films:', error)
      return []
    }

    return films as Film[]
  } catch (error) {
    console.error('Error fetching featured films:', error)
    return []
  }
}

export async function getLatestFilms(limit = 12) {
  try {
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching latest films:', error)
      return []
    }

    return films as Film[]
  } catch (error) {
    console.error('Error fetching latest films:', error)
    return []
  }
}

export async function getRelatedFilms(film: Film, limit = 8) {
  try {
    const { data: films, error } = await supabase
      .from('films')
      .select('*')
      .eq('status', 'active')
      .neq('id', film.id)
      .or(`genres.cs.{${film.genres.join(',')}},year.eq.${film.year}`)
      .limit(limit)

    if (error) {
      console.error('Error fetching related films:', error)
      return []
    }

    return films as Film[]
  } catch (error) {
    console.error('Error fetching related films:', error)
    return []
  }
}

export async function incrementFilmViews(id: number) {
  try {
    await supabase.rpc('increment_views', { film_id: id })
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}
