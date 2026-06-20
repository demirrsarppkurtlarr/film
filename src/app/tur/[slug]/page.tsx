import { Metadata } from 'next'
import { CategoryPageClient } from '@/components/CategoryPageClient'

export const metadata: Metadata = {
  title: 'Kategori Filmleri - HD Film Cehennemi',
  description: 'Kategori filmlerini Türkçe dublaj ve altyazılı izleyin.'
}

export default function CategoryPage() {
  return <CategoryPageClient />
}
