import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        // 将引擎模块（含 mock 依赖）拆分为独立 chunk，便于替换
        manualChunks(id) {
          if (id.includes('/engine/') || id.includes('/mock/')) return 'engine'
        },
        // engine chunk 不加哈希，方便直接替换
        chunkFileNames(chunkInfo) {
          if (chunkInfo.name === 'engine') return 'assets/[name].js'
          return 'assets/[name]-[hash].js'
        },
      },
    },
  },
})
