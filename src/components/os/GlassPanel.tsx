import * as React from 'react'
import { cn } from '@/lib/utils'

type GlassPanelProps = {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
} & React.HTMLAttributes<HTMLElement>

/**
 * Glassmorphism wrapper — reserved for overlays / hero surfaces (blueprint §8).
 * Server-safe (no hooks). Consumes --kx-* brand tokens directly.
 */
export function GlassPanel({
  children,
  className,
  as: Comp = 'div',
  style,
  ...props
}: GlassPanelProps) {
  return (
    <Comp
      className={cn('relative rounded-xl border backdrop-blur-md', className)}
      style={{
        borderColor: 'var(--kx-border)',
        background:
          'color-mix(in srgb, var(--kx-surface) 72%, transparent)',
        ...style,
      }}
      {...props}
    >
      {children}
    </Comp>
  )
}
