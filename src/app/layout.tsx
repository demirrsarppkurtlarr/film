import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Film Cehennemi - HD Film izle',
  description: 'En yeni ve popüler filmleri HD kalitede izleyin. Türkçe dublaj ve altyazılı seçenekler.',
  keywords: 'film izle, hd film izle, türkçe dublaj, türkçe altyazılı, online film',
  openGraph: {
    title: 'Film Cehennemi - HD Film izle',
    description: 'En yeni ve popüler filmleri HD kalitede izleyin',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-dark-900 text-dark-100">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#f5f5f5',
              border: '1px solid #404040',
            },
          }}
        />
      </body>
    </html>
  )
}
