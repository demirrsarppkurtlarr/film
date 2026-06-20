'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-red-600 mb-4">500</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Bir Hata Oluştu</h2>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">
          Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-dark-800 hover:bg-dark-700 text-white font-semibold rounded-lg border border-dark-600 transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
