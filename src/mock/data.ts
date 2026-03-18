import type { InputImage, ProcessResult } from '../types'

// ====== 模拟输入数据 ======

/** 模拟的原始图片（6 张 1x1 彩色 PNG） */
export const MOCK_IMAGES: InputImage[] = [
  { id: 'img_1', blob: createColorBlob('#E8D5B7') },
  { id: 'img_2', blob: createColorBlob('#B7D5E8') },
  { id: 'img_3', blob: createColorBlob('#D5E8B7') },
  { id: 'img_4', blob: createColorBlob('#E8B7D5') },
  { id: 'img_5', blob: createColorBlob('#B7E8D5') },
  { id: 'img_6', blob: createColorBlob('#D5B7E8') },
]

/** 模拟的 DSL */
export const MOCK_DSL = { layout: 'grid', columns: 2 }

// ====== 模拟处理结果 ======

/** 模拟的黑盒函数输出（3 张合并图 + 代码） */
export const MOCK_RESULT: ProcessResult = {
  images: [
    { id: 'merged_1', blob: createColorBlob('#C4B0A0') },
    { id: 'merged_2', blob: createColorBlob('#A0C4B0') },
    { id: 'merged_3', blob: createColorBlob('#B0A0C4') },
  ],
  code: [
    '<!-- 由 DSL 自动生成 -->',
    '<div class="merged-layout">',
    '  <img src="merged_1.png" alt="merged_1" />',
    '  <img src="merged_2.png" alt="merged_2" />',
    '  <img src="merged_3.png" alt="merged_3" />',
    '</div>',
  ].join('\n'),
}

// ====== 工具 ======

function createColorBlob(hex: string): Blob {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="${hex}"/></svg>`
  return new Blob([svg], { type: 'image/svg+xml' })
}
