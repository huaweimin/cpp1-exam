import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  build: {
    // antd-vendor 约 830KB（gzip 260KB，含 rc-* 与 icons），属合理体积，
    // 调高告警阈值避免误报；真正的体积控制靠按需摇树 + vendor 长缓存。
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // 把稳定的第三方依赖拆成独立 vendor chunk：
        // 1) 长缓存 —— 业务代码更新时浏览器只需下载小的业务 chunk
        // 2) 避免单个 chunk 超过 500KB 的构建告警
        // 3) antd v5 具名导入天然 tree-shaking，这里只做分包，不改引入方式
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // React 运行时（含 jsx-runtime / scheduler / react-dom）
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/')
          ) {
            return 'react-vendor'
          }

          // antd 及其依赖（rc-* 组件、@ant-design/icons、cssinjs、dayjs）。
          // 注：icons 单独分包会与 antd-vendor 形成循环 chunk（antd 组件内部引用 icons），
          // 故合并在一起，依赖 rollup 按需摇树。
          if (
            id.includes('/antd/') ||
            id.includes('@ant-design') ||
            id.includes('/rc-') ||
            id.includes('@rc-component') ||
            id.includes('/dayjs/')
          ) {
            return 'antd-vendor'
          }

          // CloudBase SDK（前端当前用 fetch 直连公开路由，未引入 SDK；
          // 若未来改用官方 SDK 将自动拆到此 chunk）
          if (id.includes('@cloudbase')) {
            return 'cloudbase-vendor'
          }
        },
      },
    },
  },
})
