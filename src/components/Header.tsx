'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { getCategories } from '@/lib/supabase'
import { Category } from '@/types'
import { SearchBar } from './SearchBar'

function HeaderContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)

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

  return (
    <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">Film</span>
              <span className="text-xl font-bold gradient-text">Cehennemi</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-dark-200 hover:text-white transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/latest/" className="text-sm font-medium text-dark-200 hover:text-white transition-colors">
              Yeni Eklenenler
            </Link>
            <Link href="/imdb/" className="text-sm font-medium text-dark-200 hover:text-white transition-colors">
              IMDb 7+
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-sm font-medium text-dark-200 hover:text-white transition-colors flex items-center gap-1"
              >
                Türler
                <svg className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoriesOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-lg shadow-xl py-2 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/tur/${category.slug}/`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm text-dark-200 hover:text-white hover:bg-dark-700 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-dark-200 hover:text-white"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-dark-200 hover:text-white hover:bg-dark-700 rounded-md"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/latest/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-dark-200 hover:text-white hover:bg-dark-700 rounded-md"
            >
              Yeni Eklenenler
            </Link>
            <Link
              href="/imdb/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-dark-200 hover:text-white hover:bg-dark-700 rounded-md"
            >
              IMDb 7+
            </Link>
            
            <div className="px-3 py-2 text-sm font-semibold text-dark-400 uppercase tracking-wider">
              Türler
            </div>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/tur/${category.slug}/`}
                onClick={() => setIsMenuOpen(false)}
                className="block pl-6 pr-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-700 rounded-md"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export function Header() {
  return (
    <Suspense fallback={
      <header className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 h-16" />
    }>
      <HeaderContent />
    </Suspense>
  )
}
