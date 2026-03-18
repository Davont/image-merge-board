# Image Merge Board

图片合并看板 —— 作为 iframe 嵌入到父系统中，接收图片和 DSL 数据，经黑盒引擎处理后展示合并结果，支持一键打包下载。

## 工作流程

1. 父页面通过 `postMessage` 推送数据（图片数组 + DSL）
2. 页面自动调用引擎处理（合并图片 + 生成代码）
3. 看板展示处理结果，支持 Tab 切换查看原始图片
4. 用户点击下载按钮，得到 ZIP 包（`images/` 文件夹 + `output.html` 代码文件）

## 项目结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 主页面（postMessage 监听 → 处理 → 展示）
├── types.ts                 # 类型定义
├── process.ts               # 处理入口（透传调用 engine）
├── engine/
│   └── index.ts             # ⭐ 黑盒函数（接入真实逻辑的位置）
├── mock/
│   └── data.ts              # 静态模拟数据（开发调试用）
├── components/
│   ├── Navbar.tsx            # 顶部导航栏
│   ├── BoardCard.tsx         # 图片卡片
│   └── EmptyState.tsx        # 空状态 / 加载中
├── utils/
│   └── download.ts           # ZIP 打包下载
└── index.css                 # Tailwind 全局样式
```

## 快速开始

```bash
npm install
npm run dev
```

开发环境会自动加载 `mock/data.ts` 中的模拟数据，无需父页面推送即可看到完整效果。

## 父页面接入

通过 `postMessage` 向 iframe 发送数据：

```js
const iframe = document.getElementById('merge-board')
iframe.contentWindow.postMessage({
  type: 'process',
  images: [
    { id: 'img_1', blob: blob1 },
    { id: 'img_2', blob: blob2 },
  ],
  dsl: { layout: 'grid', columns: 2 }
}, '*')
```

### 数据格式

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | `'process'` | 固定值 |
| `images` | `Array<{ id: string, blob: Blob }>` | 原始图片数组 |
| `dsl` | `unknown` | DSL 配置，结构由引擎定义 |

## 接入真实引擎

编辑 `src/engine/index.ts`，将 mock 替换为真实实现：

```ts
import type { InputImage, ProcessResult } from '../types'

export async function processImages(
  images: InputImage[],
  dsl: unknown,
): Promise<ProcessResult> {
  // 在这里实现真实的图片合并逻辑
  // 返回 { images: OutputImage[], code: string }
}
```

入参和返回值类型保持不变，页面无需任何修改。

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Lucide React（图标）
- JSZip（打包下载）
