// Monaco 编辑器本地化初始化
// 目的：让 Monaco 核心包与 worker 都从本地打包加载，不依赖任何 CDN。
// 课堂机房网络不稳定时也能正常加载编辑器、运行 C++ 沙箱。
import * as monaco from 'monaco-editor'
import { loader } from '@monaco-editor/react'
import editorWorker from 'monaco-editor/editor/editor.worker?worker'

// 仅 C++ 高亮/编辑是同步 tokenizer，不需要专门的语言 worker，
// 所有 label 统一返回基础 editorWorker 即可。
window.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

// 使用本地 monaco 实例，避免 @monaco-editor/react 默认从 CDN 拉取核心包
loader.config({ monaco })
