import type { InputImage, ProcessResult } from '../types'
import { MOCK_RESULT } from '../mock/data'

/**
 * 黑盒处理函数 —— 由外部团队提供。
 *
 * 入参：
 *   images - 原始图片数组 [{ id: string, blob: Blob }]
 *   dsl    - DSL 配置（结构由黑盒定义）
 *
 * 返回：
 *   images - 合并后的图片数组 [{ id: string, blob: Blob }]
 *   code   - 生成的代码字符串
 *
 * TODO: 替换为真实逻辑，删除 mock 引用
 */
export async function processImages(
  _images: InputImage[],
  _dsl: unknown,
): Promise<ProcessResult> {
  return MOCK_RESULT
}
