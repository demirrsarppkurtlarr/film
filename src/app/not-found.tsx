import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-brand-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Sayfa Bulunamadı</h2>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">
          Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}
