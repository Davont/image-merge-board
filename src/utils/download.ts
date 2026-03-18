import type { OutputImage, InputImage } from '../types'

export async function downloadResultAsZip(
  images: OutputImage[],
  code: string,
): Promise<void> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  const imgFolder = zip.folder('images')!
  images.forEach((img) => {
    imgFolder.file(`${img.id}.png`, img.blob)
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
    imgFolder.file(`${img.id}.png`, img.blob)
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
