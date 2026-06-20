import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-800 border-t border-dark-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-lg font-bold text-white">Film</span>
              <span className="text-lg font-bold gradient-text">Cehennemi</span>
            </Link>
            <p className="text-dark-400 text-sm max-w-md">
              En yeni ve popüler filmleri HD kalitede, Türkçe dublaj ve altyazılı seçeneklerle izleyin. 
              Gelişmiş arama ve kategori sistemiyle istediğiniz filmi kolayca bulun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/latest/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Yeni Eklenenler
                </Link>
              </li>
              <li>
                <Link href="/imdb/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  IMDb 7+
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/dmca/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="text-dark-400 hover:text-white text-sm transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 text-center">
          <p className="text-dark-500 text-sm">
            © {currentYear} Film Cehennemi. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
