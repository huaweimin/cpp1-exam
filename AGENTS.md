# AGENTS.md

- 本项目为 React + TypeScript 前端应用（Vite 构建，非 SSR）
- 包管理器：npm
- 样式方案：Tailwind CSS + 全局 CSS（`src/index.css`）
- UI 组件库：antd v5
- 数据存储：localStorage，零后端零数据库

## Project Structure

src/
├── components/     # 通用组件（PascalCase 命名）
├── pages/          # 页面组件（HomePage / ExamPage / ResultPage / TeacherPage）
├── data/           # 考试题目等静态数据
├── styles/         # 样式文件
├── types/          # 类型定义
├── utils/          # 工具函数（批改、存储）
├── App.tsx         # 应用入口，页面状态切换
├── index.css       # 全局样式
└── main.tsx        # 挂载入口

## Coding Style

**TypeScript**
- 使用 interface 定义 Props 与业务类型（见 `src/types/exam.ts`）
- 组件使用函数声明 + `export default`（非 `React.FC`）
- Never 使用 any 类型
- 使用 `import type` 导入纯类型

**样式**
- 优先使用 Tailwind CSS 工具类
- 组件级样式写入 `src/styles/` 或使用 antd 主题定制
- Never 使用内联样式
- Never 硬编码颜色值（取色用 Tailwind 调色板）

**状态管理**
- 页面状态通过 `App.tsx` 的 state + 回调 props 逐级传递（useCallback 包裹）
- 持久化数据走 `src/utils/storage.ts`，不引入全局状态库

**导入路径**
- 项目未配置路径别名，统一使用相对路径导入（如 `./types/exam`）
- Never 新增 `@/*` 别名配置，除非同步更新 vite.config.ts 与 tsconfig.json

## Build Commands

```bash
npm run dev       # 启动开发服务器（端口 3000）
npm run build     # 生产构建（tsc 类型检查 + vite build）
npm run preview   # 预览生产构建产物
```

## Never 规则

- Never 修改框架自动生成的目录
- Never 修改 dist/ 构建产物
- Never 在组件内使用 any 类型
- Never 使用内联样式
- Never 在渲染路径中执行耗时操作
- Never 在列表渲染中省略 key
- Never 硬编码敏感信息
- Never 修改 lock 文件
- Never 在 UI 层直接操作 localStorage（统一走 `src/utils/storage.ts`）
- Never 在组件内直接引用原始考试数据（统一从 `src/data/exams.ts` 导入）

## Commit 规范

- 格式：type(scope): description
- 类型：feat / fix / docs / style / refactor / test / chore
