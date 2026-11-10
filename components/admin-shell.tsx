'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AimMark } from '@/components/aim-mark'

const items = [
  { href: '/admin', label: 'Dashboard', match: 'exact' as const },
  { href: '/admin#/contacts', label: 'Contacts' },
  { href: '/admin#/companies', label: 'Companies' },
  { href: '/admin#/deals', label: 'Deals' },
  { href: '/admin/inbox', label: 'Inbox' },
  { href: '/admin/articles', label: 'Articles' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/research-documents', label: 'Research' },
  { href: '/admin/rag-documents', label: 'Knowledge' }
]

function isCurrent(pathname: string, href: string, match?: 'exact') {
  if (href.includes('#')) return false
  if (match === 'exact') return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || ''

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4 px-4">
          <Link href="/admin" className="shrink-0 py-3" aria-label="Admin home">
            <AimMark className="h-7 w-auto" />
          </Link>
          <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto" aria-label="Admin">
            {items.map(item => {
              const active = isCurrent(pathname, item.href, item.match)
              const className = `shrink-0 border-b-2 px-3 py-4 text-sm font-medium ${
                active
                  ? 'border-[#0D9488] text-[#1E3A8A]'
                  : 'border-transparent text-slate-600 hover:text-[#1E3A8A]'
              }`
              const leavesNext = item.href === '/admin' || item.href.includes('#')
              return leavesNext ? (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={className}>
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Link href="/" className="shrink-0 text-sm text-slate-500 hover:text-[#1E3A8A]">
            View site
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
