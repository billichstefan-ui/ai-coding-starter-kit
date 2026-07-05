import Link from 'next/link'
import { cn } from '@/lib/utils'

type SettingsTab = 'ai-providers' | 'organization' | 'users'

const TABS: { key: SettingsTab; label: string; href: string }[] = [
  { key: 'ai-providers', label: 'KI-Provider', href: '/qualipilot/settings/ai-providers' },
  { key: 'organization', label: 'Organisation', href: '/qualipilot/settings/organization' },
  { key: 'users', label: 'Nutzer', href: '/qualipilot/settings/users' },
]

export function SettingsNav({ active }: { active: SettingsTab }) {
  return (
    <nav className="flex flex-wrap gap-1 border-b border-white/10 pb-px" aria-label="Einstellungen">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={tab.key === active ? 'page' : undefined}
          className={cn(
            'rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors',
            tab.key === active
              ? 'border-[#0078FF] font-medium text-white'
              : 'border-transparent text-white/50 hover:text-white'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
