import Link from 'next/link'

interface SectionTitleProps {
  title: string
  href?: string
  showMore?: boolean
}

export function SectionTitle({ title, href, showMore = true }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-gradient-to-b from-brand-500 to-brand-700 rounded-full" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      
      {showMore && href && (
        <Link
          href={href}
          className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors flex items-center gap-1"
        >
          Tümünü Gör
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}
