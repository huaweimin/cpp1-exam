/**
 * 云端同步端到端联调测试（CloudBase HTTP 路由版）
 * 用法：node scripts/cloud-e2e-test.mjs
 * 覆盖：test / push / pull / delete 四个 action 的完整往返
 */
import assert from 'node:assert/strict'

const SYNC_URL =
  process.env.VITE_TCB_SYNC_URL ||
  'https://exam-backend-d3gzsicbj7bb6bca0.ap-shanghai.app.tcloudbase.com/examsync'

async function call(action, data = {}) {
  const res = await fetch(SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data }),
    signal: AbortSignal.timeout(15000),
  })
  assert.equal(res.ok, true, `${action} HTTP 状态应为 2xx，实际 ${res.status}`)
  const json = await res.json()
  assert.equal(json.code, 0, `${action} 业务码应为 0，实际 ${json.code}（${json.message}）`)
  return json.data
}

console.log('SYNC_URL =', SYNC_URL)

// 1. 连通性
const t = await call('test')
console.log('✔ test: count =', t.count)

// 2. push 两条测试记录
const now = String(Date.now())
const records = [
  {
    studentName: '小黑e2e',
    examId: 'exam-e2e',
    examName: 'E2E联调',
    totalScore: 90,
    maxScore: 100,
    passed: true,
    details: [{ index: 1, correct: true }],
    submittedAt: now,
    duration: 300,
  },
  {
    studentName: '小红e2e',
    examId: 'exam-e2e',
    examName: 'E2E联调',
    totalScore: 55,
    maxScore: 100,
    passed: false,
    details: [],
    submittedAt: String(Number(now) + 1),
    duration: 400,
  },
]
const p = await call('push', { records })
assert.ok(p.upserted >= 2, `push 应至少写入 2 条，实际 ${p.upserted}`)
console.log('✔ push: upserted =', p.upserted)

// 3. pull 校验字段往返
const pulled = await call('pull')
const mine = pulled.filter((r) => r.examId === 'exam-e2e')
assert.equal(mine.length, 2, `pull 应返回 2 条 exam-e2e 记录，实际 ${mine.length}`)
const he = mine.find((r) => r.studentName === '小黑e2e')
assert.ok(he, '应找到小黑e2e 的记录')
assert.deepEqual(he.details, [{ index: 1, correct: true }], 'details 应原样往返')
assert.equal(he.totalScore, 90, 'totalScore 应原样往返')
console.log('✔ pull: 字段往返校验通过')

// 4. delete 清理测试数据
for (const r of mine) {
  await call('delete', {
    record: { studentName: r.studentName, examId: r.examId, submittedAt: r.submittedAt },
  })
}
const after = await call('pull')
const left = after.filter((r) => r.examId === 'exam-e2e')
assert.equal(left.length, 0, `delete 后应无 exam-e2e 记录，实际剩 ${left.length}`)
console.log('✔ delete: 测试数据已清理')

console.log('\n全部通过 ✅ 云函数 + 云数据库联调正常')
