// Single source of truth for suggestion categories.
//
// Holds the allowed category values plus their display metadata (label, neon badge
// color) and the dashboard render order. Dependency-free on purpose: it is imported by
// both client components (suggestion card, dashboard, history) and server code (the Zod
// output schema in anthropic.ts), so it must not pull in any heavy dependency.
//
// Adding a new category here propagates automatically to the AI output schema
// (z.enum), the Category type, the badge, and the grouped dashboard sections.

export const CATEGORIES = ['marketing', 'product', 'operations', 'design'] as const
export type Category = (typeof CATEGORIES)[number]

type CategoryMeta = { label: string; color: string }

// Neon-Palette (siehe docs/design-system.md):
//   Marketing  = Neon Cyan     #38E5FF
//   Produkt    = Electric Blue #0078FF
//   Operations = Hot Pink      #FF2D9C
//   Design     = Neon Violett  #A720FF  (Teal #0E9594 ist der „Umgesetzt"-Status)
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  marketing: { label: 'Marketing', color: '#38E5FF' },
  product: { label: 'Produkt', color: '#0078FF' },
  operations: { label: 'Operations', color: '#FF2D9C' },
  design: { label: 'Design & Brand', color: '#A720FF' },
}

// Reihenfolge der gruppierten Abschnitte im Dashboard.
export const CATEGORY_ORDER: readonly Category[] = CATEGORIES

// Label + Farbe für eine Kategorie; fällt für unbekannte/Legacy-Werte robust zurück.
export function categoryMeta(category: string): CategoryMeta {
  return CATEGORY_META[category as Category] ?? { label: category, color: '#8892B0' }
}
