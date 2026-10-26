// 个人站点使用固定展示配置，避免模板配置中心覆盖已确认的设计。
const PERSONAL_BLOG = {
  BLOG_FAVICON: '/favicon.svg',
  THEME: 'nobelium',
  TITLE: 'Lvwei · 个人笔记',
  AUTHOR: 'Lvwei',
  BIO: '前端工程师，记录技术实践与日常思考。',
  DESCRIPTION: 'Lvwei 的个人博客，记录前端开发、AI 实践与日常思考。',
  LINK: 'https://www.lwtal.top',
  APPEARANCE: 'light',
  POST_LIST_STYLE: 'page',
  POSTS_PER_PAGE: 10,
  POST_LIST_PREVIEW: false,
  DISABLE_PLUGIN: true,
  FONT_URL: [],
  GLOBAL_JS: '',
  GLOBAL_CSS: '',
  CUSTOM_EXTERNAL_JS: [],
  CUSTOM_EXTERNAL_CSS: [],
  TOP_TAG: ''
}

// 仅移除已核对的模板页面 ID，后续同名真实文章不会被误伤。
const TEMPLATE_IDS = new Set([
  '72d4eb72fef24c74aae41cf1237637fc',
  'b69a1be3d07d48039f92ea81512f28d5',
  'c3e22c5fd73b4b1e93c2b95d77dbc249',
  'f0f03ff35c864ea1a0c1acb6ad514021',
  '438f377a65ad4536b68ed545115da4c6',
  '9681aa80caaa44e7ae4fb5276918524d',
  '6a69692b99714149b0ee7cf7c8e595de',
  '5d801aa7c82f481e8657ca0a41e4013e',
  '65f92f3e204b469b909d70372ac845c7',
  '2aba94f91ceb454385774248e5ca761f',
  '5d362c55742d44419458dcee08bb6f02',
  '82191560d31447379269ceb80a224c37',
  'b24be78c0d59480584cda14256183e2c'
])
const normalizeId = id =>
  String(id || '')
    .replace(/-/g, '')
    .toLowerCase()

// 发布状态在数据入口统一检查，列表、RSS、搜索和 UUID 访问遵循同一规则。
function isPublicPage(page) {
  return (
    ['Post', 'Page'].includes(page?.type) &&
    page.status === 'Published' &&
    !TEMPLATE_IDS.has(normalizeId(page.id))
  )
}
function findPublicPost(pages, slug) {
  return (
    pages?.find(
      page =>
        isPublicPage(page) &&
        (page.slug === slug || normalizeId(page.id) === normalizeId(slug))
    ) || null
  )
}
function searchPosts(posts, keyword) {
  if (typeof keyword !== 'string' || !keyword.trim()) return []
  const query = keyword.trim().toLocaleLowerCase()
  return (posts || []).filter(post =>
    [post.title, post.summary, post.category, ...(post.tags || [])]
      .flat()
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase()
      .includes(query)
  )
}
module.exports = {
  PERSONAL_BLOG,
  TEMPLATE_IDS,
  isPublicPage,
  findPublicPost,
  searchPosts
}
