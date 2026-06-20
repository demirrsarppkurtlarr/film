import { NextRequest, NextResponse } from 'next/server'
import { getFilms } from '@/lib/supabase'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const genre = searchParams.get('genre') || undefined
    const year = searchParams.get('year') || undefined
    const search = searchParams.get('search') || undefined
    const language = searchParams.get('language') || undefined
    const orderBy = searchParams.get('orderBy') || 'created_at'
    const orderDirection = (searchParams.get('orderDirection') as 'asc' | 'desc') || 'desc'

    const result = await getFilms({
      page,
      limit,
      genre,
      year,
      search,
      language,
      orderBy,
      orderDirection
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Films API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
