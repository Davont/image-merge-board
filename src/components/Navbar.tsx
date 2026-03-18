import { Package, Layers } from 'lucide-react'
import type { ProcessStatus } from '../types'

interface NavbarProps {
  imageCount: number
  status: ProcessStatus
  isZipping: boolean
  downloadLabel: string
  onDownloadAll: () => void
}

export function Navbar({
  imageCount,
  status,
  isZipping,
  downloadLabel,
  onDownloadAll,
}: NavbarProps) {
  const showDownload = status === 'done' && imageCount > 0

  return (
    <nav className="bg-surface-2/80 backdrop-blur-xl border-b border-border sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold text-ink-primary tracking-tight">
            资源看板
          </span>
        </div>

        {showDownload && (
          <div className="flex items-center gap-5">
            <span className="text-xs text-ink-muted font-mono tabular-nums">
              {imageCount} 项
            </span>

            <button
              onClick={onDownloadAll}
              disabled={isZipping}
              className="flex items-center gap-1.5 bg-ink-primary hover:bg-accent text-surface-2 pl-3.5 pr-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 disabled:opacity-40 cursor-pointer"
            >
              {isZipping ? (
                <span className="flex items-center gap-1.5" style={{ animation: 'pulse-gentle 1.5s ease-in-out infinite' }}>
                  <Package className="w-3.5 h-3.5" />
                  打包中…
                </span>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5" />
                  {downloadLabel}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
