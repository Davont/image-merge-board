import type { InputImage, ProcessResult } from './types'
import { processImages as engineProcess } from './engine'

/**
 * 处理入口 —— 串联黑盒引擎和页面。
 * 这个文件不需要改，真实逻辑在 src/engine/index.ts 中实现。
 */
export async function processImages(
  images: InputImage[],
  dsl: unknown,
): Promise<ProcessResult> {
  return engineProcess(images, dsl)
}
