/** 黑盒函数的入参：图片 ID + Blob */
export interface InputImage {
  id: string
  blob: Blob
}

/** 黑盒函数的返回：合并后的图片 ID + Blob */
export interface OutputImage {
  id: string
  blob: Blob
}

/** 黑盒函数的完整返回值 */
export interface ProcessResult {
  images: OutputImage[]
  code: string
}

/** UI 展示用：在 OutputImage 基础上附加预览 URL */
export interface DisplayImage extends OutputImage {
  previewUrl: string
}

/** 整体处理状态 */
export type ProcessStatus = 'idle' | 'processing' | 'done' | 'error'
