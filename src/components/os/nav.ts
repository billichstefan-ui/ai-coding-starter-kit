import {
  Home,
  FolderKanban,
  Bot,
  Users,
  Wallet,
  Megaphone,
  Package,
  BookOpen,
  FileText,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

/**
 * Single source of truth for the OS navigation (blueprint §1.3 / §2.1).
 * Reused by the Sidebar (F6) and the CommandMenu (F9) Navigate group.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Decide',
    items: [
      { label: 'Home', href: '/', icon: Home },
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Copilot', href: '/copilot', icon: Sparkles },
    ],
  },
  {
    label: 'Operate',
    items: [
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Agents', href: '/agents', icon: Bot },
      { label: 'CRM', href: '/crm', icon: Users },
      { label: 'Finance', href: '/finance', icon: Wallet },
      { label: 'Marketing', href: '/marketing', icon: Megaphone },
      { label: 'Products', href: '/products', icon: Package },
    ],
  },
  {
    label: 'Remember',
    items: [
      { label: 'Knowledge', href: '/knowledge', icon: BookOpen },
      { label: 'Documents', href: '/documents', icon: FileText },
    ],
  },
]

export const NAV_ITEMS_FLAT: NavItem[] = NAV_GROUPS.flatMap((g) => g.items)
