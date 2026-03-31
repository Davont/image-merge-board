import type { OutputImage, InputImage } from '../types'

/** 根据 Blob MIME 类型推断文件扩展名 */
const EXT_MAP: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
}

function getExt(blob: Blob): string {
  return EXT_MAP[blob.type] || '.png'
}

export async function downloadResultAsZip(
  images: OutputImage[],
  code: string,
): Promise<void> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  const imgFolder = zip.folder('images')!
  images.forEach((img) => {
    imgFolder.file(`${img.id}${getExt(img.blob)}`, img.blob)
  })

  zip.file('output.html', code)

  await triggerDownload(zip, `processed_assets_${Date.now()}.zip`)
}

export async function downloadOriginalAsZip(
  images: InputImage[],
): Promise<void> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  const imgFolder = zip.folder('images')!
  images.forEach((img) => {
    imgFolder.file(`${img.id}${getExt(img.blob)}`, img.blob)
  })

  await triggerDownload(zip, `original_images_${Date.now()}.zip`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function triggerDownload(zip: any, filename: string) {
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
