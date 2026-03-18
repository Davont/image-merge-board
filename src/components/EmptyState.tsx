import { Loader2, Inbox } from 'lucide-react'

interface EmptyStateProps {
  isProcessing: boolean
}

export function EmptyState({ isProcessing }: EmptyStateProps) {
  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-36 animate-fade-in-up">
        <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-5">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
        <p className="text-sm font-medium text-ink-secondary">正在处理中</p>
        <p className="text-xs text-ink-muted mt-1.5">稍等片刻，马上就好</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-36 animate-fade-in-up">
      <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center mb-5">
        <Inbox className="w-6 h-6 text-ink-muted" />
      </div>
      <p className="text-sm font-medium text-ink-secondary">等待数据输入</p>
      <p className="text-xs text-ink-muted mt-1.5">通过 postMessage 发送图片和 DSL 开始处理</p>
    </div>
  )
}
