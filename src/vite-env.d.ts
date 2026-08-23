/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TCB_ENV_ID?: string
  readonly VITE_TCB_REGION?: string
  readonly VITE_TCB_SYNC_URL?: string
  readonly VITE_TEACHER_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
