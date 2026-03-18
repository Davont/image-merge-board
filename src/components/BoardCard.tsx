import { CheckCircle2, Image as ImageIcon } from 'lucide-react'
import type { DisplayImage } from '../types'

interface BoardCardProps {
  image: DisplayImage
  variant?: 'result' | 'original'
}

export function BoardCard({ image, variant = 'result' }: BoardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-50 border-b border-gray-100 flex items-center justify-center p-4">
        <img
          src={image.previewUrl}
          alt={image.id}
          className="max-w-full max-h-full object-contain rounded drop-shadow-sm"
        />
        <div
          className={`absolute top-2 right-2 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm font-medium ${
            variant === 'result' ? 'text-green-600' : 'text-blue-500'
          }`}
        >
          {variant === 'result' ? (
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

      <div className="p-4">
        <h3
          className="text-sm font-bold text-gray-900 truncate"
          title={image.id}
        >
          {image.id}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {(image.blob.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  )
}
