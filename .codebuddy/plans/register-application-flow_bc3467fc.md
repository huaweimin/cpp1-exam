---
name: register-application-flow
overview: 将注册权限收紧为"联系管理员申请制"：登录页移除直接注册，展示管理员微信二维码 + 申请注册表单（提交到云端 PG 新表），教师页新增"注册申请"审核管理入口。
design:
  architecture:
    framework: react
  styleKeywords:
    - 渐变紫现代风
    - 简洁引导
    - 移动优先
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 600
    subheading:
      size: 16px
      weight: 500
    body:
      size: 14px
      weight: 400
  colorSystem:
    primary:
      - "#7C3AED"
      - "#8B5CF6"
      - "#6D28D9"
    background:
      - "#F5F3FF"
      - "#FFFFFF"
    text:
      - "#1F2937"
      - "#6B7280"
    functional:
      - "#F59E0B"
      - "#10B981"
      - "#EF4444"
todos:
  - id: cloud-function-apply-api
    content: 扩展 examSync 云函数：新增 exam_register_applications 建表注释与 applyRegister/listRegisterApplications/reviewRegisterApplication 三个 action（含教师鉴权与防重复校验）
    status: completed
  - id: cloudsync-api-types
    content: 在 src/utils/cloudSync.ts 新增 RegisterApplication 类型与申请提交/列表/审核三个 API 封装
    status: completed
    dependencies:
      - cloud-function-apply-api
  - id: authpage-rework
    content: 重构 src/pages/AuthPage.tsx：移除注册 Tab 与教师密钥注册，新增二维码展示区（public/wechat-qrcode.png + onError 兜底）、说明文字与「已联系，申请注册」Modal 表单，做好移动端适配
    status: completed
    dependencies:
      - cloudsync-api-types
  - id: teacher-review-tab
    content: 在 src/pages/TeacherPage.tsx 新增「注册申请」审核 Tab：申请列表 Table、状态筛选与通过/拒绝操作
    status: completed
    dependencies:
      - cloudsync-api-types
  - id: build-verify
    content: 运行 npm run build 验证类型与构建通过，检查移动端布局与二维码加载兜底
    status: completed
    dependencies:
      - authpage-rework
      - teacher-review-tab
---

## 用户需求

收紧注册权限：新访客无法直接自助注册，必须先联系管理员审核开通。

## 产品概述

在登录页（AuthPage）移除直接注册入口，改为展示管理员微信二维码与引导文案；提供「已联系，申请注册」按钮，弹出申请表单（用户名、联系方式、申请理由），提交后写入云端数据库，由管理员（教师身份）在教师页面审核，审核通过后由管理员手动开通账号。

## 核心功能

- 登录页展示微信二维码（`public/wechat-qrcode.png`，图片未提供前有加载兜底占位）与说明文字「新用户注册需先联系管理员，请扫描下方二维码添加微信」
- 「已联系，申请注册」按钮 → 弹出 antd Modal 表单（用户名、联系方式、申请理由，含必填校验与重复申请/重复用户名提示）
- 完全移除直接注册 Tab 及教师密钥注册通道，仅保留登录 + 申请流程
- 云端新表 `exam_register_applications` 持久化申请记录（pending/approved/rejected 状态）
- TeacherPage 新增「注册申请」审核 Tab（教师可见）：列表展示申请、按状态筛选、标记通过/拒绝
- 交互简洁，二维码清晰可见，移动端适配良好（沿用 sm: 断点 + flex-col 堆叠模式）

## 技术栈

- 前端：React + TypeScript + Vite + Tailwind CSS + antd v5（沿用现有栈，不引入新依赖）
- 后端：CloudBase 云函数 `cloudfunctions/examSync/index.js`（@cloudbase/node-sdk app.rdb()，PostgreSQL，database: 'public'）
- 存储：PG 新表 `exam_register_applications`；前端统一走 `src/utils/cloudSync.ts` 的 `call()` 协议（`{ action, data, token }`，返回 `{ code, data, message }`）
- 静态资源：新建 `public/wechat-qrcode.png`（Vite 标准静态目录），`<img>` 加 onError 兜底占位

## 实现方案

1. **云函数扩展**（examSync/index.js）

- 新增 action：`applyRegister`（公开，无需 token；校验必填、用户名长度≤20、联系方式格式；查 `exam_users` 防用户名冲突、查申请表防同用户名 pending 重复申请；插入记录含 status='pending'、created_at）
- 新增 action：`listRegisterApplications`（仅教师 token）、`reviewRegisterApplication`（仅教师 token，更新 status 为 approved/rejected + reviewed_at；通过后提示管理员在微信中联系用户并手动在后台开通账号，即教师用现有注册能力或直接插入 exam_users 完成开通）
- 建表 SQL（id 主键、username、contact、reason、status、created_at、reviewed_at）以注释形式提供，部署时在 CloudBase 控制台执行
- 移除/不再暴露 `register` action 中的公开注册语义：保留 handleRegister 函数供管理员开通账号使用（内部），前端删除全部调用

2. **前端 API 层**（src/utils/cloudSync.ts）：新增 `submitRegisterApplication` / `listRegisterApplications` / `reviewRegisterApplication` 与 `RegisterApplication` interface（对齐项目 interface 类型规范）
3. **AuthPage 重构**：删除注册 Tab 与 handleRegister/teacherKey 逻辑；登录卡片下方新增二维码区块（圆角白底卡片 + 说明文字 + 「已联系，申请注册」主按钮）；antd Modal 内联表单（遵循项目现有 Modal 用法，不新建通用封装）；提交成功 message 提示并关闭
4. **TeacherPage 扩展**：新增「注册申请」Tab，antd Table 展示申请（用户名/联系方式/理由/时间/状态 Tag），通过/拒绝按钮带确认弹窗；沿用现有教师 token 调用方式
5. **移动端**：二维码区块居中自适应宽度（约 180-220px），Modal 宽度 `width="calc(100vw - 32px)"` 或响应式，沿用项目 `sm:` 断点模式

## 性能与可靠性

- 申请提交为单条 insert，O(1)；教师列表查询加 `order by created_at desc limit 100`
- 防刷：同用户名存在 pending 申请时拒绝重复提交；联系方式做简单格式与长度校验
- 二维码图片加载失败走 onError 兜底占位，避免破图
- 兼容性：不改登录链路（login/logout/verifyAuth/RequireAuth 全部保留），回归风险仅限 AuthPage 注册区

## 目录结构

```
cpp1-exam/
├── public/
│   └── wechat-qrcode.png                      # [NEW] 管理员微信二维码（用户提供，先放兜底占位）
├── cloudfunctions/examSync/index.js           # [MODIFY] 新增 applyRegister/listRegisterApplications/reviewRegisterApplication action 与建表注释
├── src/utils/cloudSync.ts                     # [MODIFY] RegisterApplication 类型 + 申请提交/列表/审核 API 封装
├── src/pages/AuthPage.tsx                     # [MODIFY] 移除注册 Tab，新增二维码区块 + 申请注册 Modal 表单
└── src/pages/TeacherPage.tsx                  # [MODIFY] 新增「注册申请」审核 Tab
```

## 设计风格

沿用登录页现有渐变紫背景 + 白色 Card 风格，保持视觉一致，重点做信息层级与引导动线。

### 登录页（AuthPage 改造）

- 顶部：保留现有品牌标题
- 登录卡片：仅保留「登录」单卡片（Tabs 移除），用户名/密码输入 + 登录按钮
- 卡片下方新增「注册引导区块」：白色圆角卡片，内含说明文字（「新用户注册需先联系管理员，请扫描下方二维码添加微信」，居中、次要文字色）、二维码图片（白底、圆角、约 200px 见方、清晰可扫）、主色渐变按钮「已联系，申请注册」（hover 微缩放/阴影过渡）
- 申请 Modal：标题「申请注册」，三个必填输入（用户名、联系方式、申请理由用 Textarea），底部取消/提交按钮，提交 loading 态

### 教师页（TeacherPage 新增 Tab）

- 「注册申请」Tab：antd Table 列表（用户名、联系方式、申请理由、申请时间、状态 Tag：pending 橙/approved 绿/rejected 红），操作列「通过」「拒绝」按钮带 Popconfirm，默认展示 pending 优先
- 移动端：区块堆叠布局，二维码居中，Table 横向滚动