import { Metadata } from 'next'
import { YearPageClient } from '@/components/YearPageClient'

export const metadata: Metadata = {
  title: 'Yıl Filmleri - HD Film Cehennemi',
  description: 'Yıl bazlı en popüler filmler.'
}

export default function YearPage() {
  return <YearPageClient />
}
