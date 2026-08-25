// Monaco 编辑器按需加载初始化
// 目的：只有进入编程题/沙箱页面时才动态加载 Monaco 核心包与 worker，
// 首屏不再下载 ~4MB 的 Monaco 引擎，加快国内访问速度。
// 课堂机房网络不稳定时，进入编程题后也能正常加载编辑器。
let monacoReady: Promise<void> | null = null

/**
 * 初始化本地 Monaco 实例（幂等）。
 * 首次调用时动态拉取 monaco-editor 核心包 + worker，并注入 @monaco-editor/react loader。
 * 返回的 Promise resolve 后即可安全渲染 <Editor />。
 */
export function initMonaco(): Promise<void> {
  if (!monacoReady) {
    const load = (async () => {
      const [{ loader }, monaco] = await Promise.all([
        import('@monaco-editor/react'),
        import('monaco-editor'),
      ])
      // 仅 C++ 高亮/编辑是同步 tokenizer，不需要专门的语言 worker，
      // 所有 label 统一返回基础 editorWorker 即可。
      const { default: editorWorker } = await import(
        'monaco-editor/editor/editor.worker?worker'
      )
      window.MonacoEnvironment = {
        getWorker() {
          return new editorWorker()
        },
      }
      // 使用本地 monaco 实例，避免 @monaco-editor/react 默认从 CDN 拉取核心包
      loader.config({ monaco })
      await loader.init()
    })()
    // 失败时清空缓存，允许下次（进入编程题真正使用时）重试，避免预热失败导致永久卡死
    monacoReady = load.catch((err) => {
      monacoReady = null
      throw err
    })
  }
  return monacoReady
}
