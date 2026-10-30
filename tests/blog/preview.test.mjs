import { test } from 'node:test'
import assert from 'node:assert/strict'
import { prepareArticle } from '../../scripts/blog/preview.mjs'
const source = body =>
  `---\ntitle: 测试文章\nslug: test-article\nsummary: 一段摘要\ncategory: 技术分享\ntags: [前端, AI]\ndate: 2026-10-26\n---\n${body}`
test('保留标题、代码块、列表与表格，输出始终是草稿', () => {
  const result = prepareArticle(
    source(
      '## 小节\n\n```js\nconst a = 1\n```\n\n- 项目\n\n|A|B|\n|-|-|\n|1|2|'
    )
  )
  assert.equal(result.meta.status, 'Draft')
  for (const tag of ['<h2>', '<pre>', '<ul>', '<table>'])
    assert.ok(result.html.includes(tag))
})
test('隔离 HTML、危险链接和未上传图片，不静默丢图', () => {
  const result = prepareArticle(
    source(
      '<script>alert(1)</script>\n\n[点击](javascript:alert%281%29)\n\n![本地图](./photo.png)'
    )
  )
  assert.ok(!result.html.includes('<script>'))
  assert.ok(!result.html.includes('href="javascript:'))
  assert.equal(result.warnings.length, 2)
  assert.ok(result.html.includes('待补充图片'))
})
test('拒绝不完整元信息和路径穿越 slug', () => {
  assert.throws(() => prepareArticle('# 没有元信息'))
  assert.throws(() =>
    prepareArticle(source('正文').replace('test-article', '../escape'))
  )
  assert.throws(() =>
    prepareArticle(source('正文').replace('2026-10-26', '2026-02-30'))
  )
})
