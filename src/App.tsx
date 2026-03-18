import { useState, useEffect, useCallback } from 'react'
import type {
  InputImage,
  OutputImage,
  DisplayImage,
  ProcessStatus,
} from './types'
import { processImages } from './process'
import { downloadResultAsZip, downloadOriginalAsZip } from './utils/download'
import { Navbar } from './components/Navbar'
import { BoardCard } from './components/BoardCard'
import { EmptyState } from './components/EmptyState'

function toDisplayImages(images: (InputImage | OutputImage)[]): DisplayImage[] {
  return images.map((img) => ({
    ...img,
    previewUrl: URL.createObjectURL(img.blob),
  }))
}

interface IncomingMessage {
  type: 'process'
  images: InputImage[]
  dsl: unknown
}

type TabKey = 'result' | 'original'

function App() {
  const [status, setStatus] = useState<ProcessStatus>('idle')
  const [activeTab, setActiveTab] = useState<TabKey>('result')
  const [originalImages, setOriginalImages] = useState<DisplayImage[]>([])
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([])
  const [outputImages, setOutputImages] = useState<OutputImage[]>([])
  const [outputCode, setOutputCode] = useState('')
  const [isZipping, setIsZipping] = useState(false)

  const handleIncomingData = useCallback(
    async (images: InputImage[], dsl: unknown) => {
      setStatus('processing')
      setOriginalImages(toDisplayImages(images))
      try {
        const result = await processImages(images, dsl)
        setOutputImages(result.images)
        setOutputCode(result.code)
        setDisplayImages(toDisplayImages(result.images))
        setActiveTab('result')
        setStatus('done')
      } catch (err) {
        console.error('处理失败:', err)
        setStatus('error')
      }
    },
    [],
  )

  useEffect(() => {
    const onMessage = (event: MessageEvent<IncomingMessage>) => {
      if (event.data?.type === 'process' && Array.isArray(event.data.images)) {
        handleIncomingData(event.data.images, event.data.dsl)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [handleIncomingData])

  useEffect(() => {
    if (import.meta.env.DEV) {
      import('./mock/data').then(({ MOCK_IMAGES, MOCK_DSL }) =>
        handleIncomingData(MOCK_IMAGES, MOCK_DSL),
      )
    }
  }, [handleIncomingData])

  const handleDownload = async () => {
    try {
      setIsZipping(true)
      if (activeTab === 'result') {
        if (outputImages.length === 0) return
        await downloadResultAsZip(outputImages, outputCode)
      } else {
        if (originalImages.length === 0) return
        await downloadOriginalAsZip(originalImages)
      }
    } catch (err) {
      console.error('打包下载失败:', err)
    } finally {
      setIsZipping(false)
    }
  }

  const currentImages = activeTab === 'result' ? displayImages : originalImages

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'result', label: '处理结果', count: displayImages.length },
    { key: 'original', label: '原始图片', count: originalImages.length },
  ]

  const downloadLabel =
    activeTab === 'result' ? '下载处理结果' : '下载原始图片'

  return (
    <div className="min-h-screen bg-surface-0 text-ink-primary font-sans">
      <Navbar
        imageCount={currentImages.length}
        status={status}
        isZipping={isZipping}
        downloadLabel={downloadLabel}
        onDownloadAll={handleDownload}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {status === 'error' && (
          <div className="animate-fade-in-up bg-danger-soft border border-danger/20 text-danger rounded-xl px-4 py-3 text-sm font-medium mb-8">
            处理失败，请检查控制台获取详情。
          </div>
        )}

        {status === 'done' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-0.5 bg-surface-2 rounded-xl p-1 border border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                      activeTab === tab.key
                        ? 'bg-ink-primary text-surface-2 shadow-sm'
                        : 'text-ink-muted hover:text-ink-secondary'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-1.5 font-mono text-[11px] tabular-nums ${
                        activeTab === tab.key
                          ? 'text-surface-2/50'
                          : 'text-ink-muted/60'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {currentImages.map((img, i) => (
                <BoardCard
                  key={img.id}
                  image={img}
                  variant={activeTab === 'original' ? 'original' : 'result'}
                  index={i}
                />
              ))}
            </div>
          </>
        )}

        {(status === 'idle' || status === 'processing') && (
          <EmptyState isProcessing={status === 'processing'} />
        )}
      </main>
    </div>
  )
}

export default App
