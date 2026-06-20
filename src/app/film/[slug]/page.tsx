import { Metadata } from 'next'
import { FilmDetailClient } from '@/components/FilmDetailClient'

export const metadata: Metadata = {
  title: 'Film Detay - HD Film Cehennemi',
  description: 'Film detay sayfası. Türkçe dublaj ve altyazılı seçeneklerle.'
}

export default function FilmPage() {
  return <FilmDetailClient />
}
