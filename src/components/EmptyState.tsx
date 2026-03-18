import { Loader2, Inbox } from 'lucide-react'

interface EmptyStateProps {
  isProcessing: boolean
}

export function EmptyState({ isProcessing }: EmptyStateProps) {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 className="w-12 h-12 mb-3 animate-spin opacity-40" />
        <p className="text-sm">正在处理中...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-gray-400">
      <Inbox className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm">等待数据输入...</p>
    </div>
  )
}
