import { LayoutDashboard, Package } from 'lucide-react'
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">自动化资源看板</h1>
        </div>

        {showDownload && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              共{' '}
              <span className="font-semibold text-gray-900">
                {imageCount}
              </span>{' '}
              张图片
            </div>

            <button
              onClick={onDownloadAll}
              disabled={isZipping}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
            >
              {isZipping ? (
                <span className="animate-pulse flex items-center gap-2">
                  <Package className="w-4 h-4" /> 打包中...
                </span>
              ) : (
                <>
                  <Package className="w-4 h-4" />
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
