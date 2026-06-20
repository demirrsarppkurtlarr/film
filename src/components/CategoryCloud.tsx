'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCategories } from '@/lib/supabase'

export function CategoryCloud() {
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(categories.slice(0, 12))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  if (categories.length === 0) {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-24 h-9 bg-dark-800 rounded-full animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/tur/${category.slug}/`}
          className="px-4 py-2 bg-dark-800/80 hover:bg-dark-700 border border-dark-600 rounded-full text-sm text-dark-200 hover:text-white transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
