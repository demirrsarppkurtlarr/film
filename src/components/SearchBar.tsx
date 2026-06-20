'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = '' }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Film, oyuncu veya tür ara..."
        className="w-full bg-dark-900 border border-dark-600 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-dark-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-dark-400 hover:text-brand-400 transition-colors"
      >
        <MagnifyingGlassIcon className="w-5 h-5" />
      </button>
    </form>
  )
}
