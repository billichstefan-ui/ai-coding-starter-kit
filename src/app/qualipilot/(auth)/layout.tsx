import { ShieldCheck } from 'lucide-react'

export default function QualiPilotAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070B1E] px-4 py-12 text-white">
      {/* dezenter Brand-Glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-64 opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(600px 200px at 50% 0%, #0078FF44, transparent)' }}
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#38E5FF] to-[#A720FF]">
            <ShieldCheck className="h-7 w-7 text-[#070B1E]" />
          </div>
          <h1 className="text-xl font-semibold">QualiPilot</h1>
          <p className="mt-1 text-sm text-white/50">
            Local AI powered GMP Qualification Platform
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
