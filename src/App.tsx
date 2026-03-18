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

  // 开发环境自动加载模拟数据，方便调试
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
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Navbar
        imageCount={currentImages.length}
        status={status}
        isZipping={isZipping}
        downloadLabel={downloadLabel}
        onDownloadAll={handleDownload}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
            处理失败，请检查控制台获取详情。
          </div>
        )}

        {status === 'done' && (
          <>
            <div className="flex items-center gap-1 mb-6 bg-white rounded-lg p-1 border border-gray-200 shadow-sm w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 text-xs ${
                      activeTab === tab.key
                        ? 'text-blue-200'
                        : 'text-gray-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentImages.map((img) => (
                <BoardCard
                  key={img.id}
                  image={img}
                  variant={activeTab === 'original' ? 'original' : 'result'}
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
