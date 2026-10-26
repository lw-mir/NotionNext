import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'
import YAML from 'yaml'

const escapeHTML = value =>
  String(value ?? '').replace(
    /[&<>"']/g,
    char =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]
  )
const safeURL = value =>
  /^(https?:\/\/|mailto:|#)/i.test(value || '') ? value : null

// 预览仅在本地生成；原始 HTML 转义，链接协议白名单防止文档执行脚本。
export function prepareArticle(source) {
  const match = source
    .replace(/^\uFEFF/, '')
    .match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error('文档开头需要 YAML 元信息（--- 分隔）。')
  const meta = YAML.parse(match[1], { maxAliasCount: 0 })
  if (!meta || typeof meta !== 'object' || Array.isArray(meta))
    throw new Error('元信息必须是对象。')
  for (const key of ['title', 'slug', 'summary', 'category']) {
    if (typeof meta[key] !== 'string' || !meta[key].trim())
      throw new Error(`请填写 ${key}。`)
    meta[key] = meta[key].trim()
  }
  if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(meta.slug))
    throw new Error(
      'slug 只能包含中英文、数字、下划线和短横线，请勿包含 article/。'
    )
  if (
    meta.tags !== undefined &&
    (!Array.isArray(meta.tags) ||
      meta.tags.some(tag => typeof tag !== 'string'))
  )
    throw new Error('tags 必须是字符串数组。')
  if (
    meta.date !== undefined &&
    (typeof meta.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(meta.date) ||
      new Date(meta.date).toISOString().slice(0, 10) !== meta.date)
  )
    throw new Error('date 请使用 YYYY-MM-DD 格式。')
  if (!match[2].trim()) throw new Error('正文不能为空。')
  const warnings = []
  const renderer = new marked.Renderer()
  renderer.html = token => escapeHTML(token.text)
  renderer.link = function (token) {
    const label = this.parser.parseInline(token.tokens)
    const url = safeURL(token.href)
    if (!url) {
      warnings.push(`链接未启用：${token.href}`)
      return label
    }
    return `<a href="${escapeHTML(url)}" rel="noreferrer">${label}</a>`
  }
  renderer.image = token => {
    if (!/^https:\/\//i.test(token.href)) {
      warnings.push(`图片需要补充可公开访问的 HTTPS 地址：${token.href}`)
      return `<p class="notice">待补充图片：${escapeHTML(token.text)}（${escapeHTML(token.href)}）</p>`
    }
    return `<img src="${escapeHTML(token.href)}" alt="${escapeHTML(token.text)}" loading="lazy" referrerpolicy="no-referrer">`
  }
  const html = marked.parse(match[2], {
    renderer,
    gfm: true,
    breaks: false,
    async: false
  })
  return {
    meta: { ...meta, status: 'Draft', type: 'Post' },
    markdown: match[2],
    html,
    warnings: [...new Set(warnings)]
  }
}

async function main() {
  const input = process.argv[2]
  if (!input || process.argv.length !== 3)
    throw new Error('用法：yarn blog:preview 文档.md；此命令不写入 Notion。')
  const article = prepareArticle(await readFile(path.resolve(input), 'utf8'))
  const out = path.resolve('.tmp/blog-preview', article.meta.slug)
  await mkdir(out, { recursive: true })
  const css = `body{margin:0;background:#fff;color:#262c2a;font:16px/1.95 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{max-width:700px;margin:70px auto;padding:0 24px}h1{font-size:34px;line-height:1.5}h2{margin-top:40px}a{color:#28735a}header{border-bottom:1px solid #e8ebe7;padding-bottom:25px;margin-bottom:30px}header p,.meta{color:#7c827e;font-size:13px}pre{background:#f6f8f5;border:1px solid #e8ebe7;padding:20px;overflow:auto;font-size:13px;border-radius:6px}img{max-width:100%;height:auto}table{display:block;overflow:auto;border-collapse:collapse}td,th{border:1px solid #e8ebe7;padding:8px 14px}blockquote{border-left:3px solid #28735a;margin:20px 0;padding-left:20px;color:#68756c}.notice{padding:12px;background:#f6f8f5}code{overflow-wrap:anywhere}pre code{overflow-wrap:normal}@media(max-width:640px){main{margin:35px auto}h1{font-size:27px}}`
  const page = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src https:; base-uri 'none'; form-action 'none'"><title>${escapeHTML(article.meta.title)} · 本地草稿预览</title><style>${css}</style><main><header><p>Lvwei · 本地草稿，尚未发布</p><h1>${escapeHTML(article.meta.title)}</h1><p>${escapeHTML(article.meta.summary)}</p><div class="meta">${escapeHTML(article.meta.date || '')} · ${escapeHTML(article.meta.category)} · ${escapeHTML((article.meta.tags || []).join(' / '))}</div></header>${article.warnings.map(w => `<p class="notice">${escapeHTML(w)}</p>`).join('')}${article.html}</main></html>`
  await writeFile(path.join(out, 'index.html'), page)
  await writeFile(
    path.join(out, 'article.json'),
    JSON.stringify(article, null, 2)
  )
  console.log(
    `本地预览：${path.join(out, 'index.html')}\n发布准备文件：${path.join(out, 'article.json')}`
  )
  for (const warning of article.warnings) console.warn(warning)
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
