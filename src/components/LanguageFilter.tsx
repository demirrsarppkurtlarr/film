'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const languages = [
  { value: '', label: 'Tümü' },
  { value: 'Türkçe Dublaj', label: 'Türkçe Dublaj' },
  { value: 'Dublaj', label: 'Dublaj' },
  { value: 'Türkçe Altyazılı', label: 'Türkçe Altyazılı' },
  { value: 'Altyazılı', label: 'Altyazılı' },
]

export function LanguageFilter() {
  const searchParams = useSearchParams()
  const currentLanguage = searchParams?.get('language') || ''

  const buildUrl = (language: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (language) {
      params.set('language', language)
    } else {
      params.delete('language')
    }
    return `/films/?${params.toString()}`
  }

  return (
    <div className="flex flex-wrap gap-2">
      {languages.map((language) => (
        <Link
          key={language.value}
          href={buildUrl(language.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentLanguage === language.value
              ? 'bg-brand-600 text-white'
              : 'bg-dark-800 text-dark-300 hover:text-white hover:bg-dark-700 border border-dark-700'
          }`}
        >
          {language.label}
        </Link>
      ))}
    </div>
  )
}
