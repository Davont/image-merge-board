import { CheckCircle2, Image as ImageIcon } from 'lucide-react'
import type { DisplayImage } from '../types'

interface BoardCardProps {
  image: DisplayImage
  variant?: 'result' | 'original'
  index?: number
}

export function BoardCard({ image, variant = 'result', index = 0 }: BoardCardProps) {
  const isResult = variant === 'result'

  return (
    <div
      className={`animate-fade-in-up stagger-${Math.min(index + 1, 8)} group relative bg-surface-2 rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:border-border-strong hover:shadow-[0_8px_30px_-12px_oklch(0.3_0.02_260/0.12)]`}
    >
      <div className="relative aspect-[4/3] bg-surface-1 flex items-center justify-center p-5">
        <img
          src={image.previewUrl}
          alt={image.id}
          className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <div
          className={`absolute top-3 right-3 text-[11px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
            isResult
              ? 'bg-success-soft text-success'
              : 'bg-info-soft text-info'
          }`}
        >
          {isResult ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              已合并
            </>
          ) : (
            <>
              <ImageIcon className="w-3 h-3" />
              原图
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-3 flex items-baseline justify-between gap-2 border-t border-border">
        <h3
          className="text-[13px] font-semibold text-ink-primary truncate"
          title={image.id}
        >
          {image.id}
        </h3>
        <span className="text-[11px] text-ink-muted font-mono tabular-nums shrink-0">
          {(image.blob.size / 1024).toFixed(1)} KB
        </span>
      </div>
    </div>
  )
}
