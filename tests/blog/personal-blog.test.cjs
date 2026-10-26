const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  isPublicPage,
  findPublicPost,
  searchPosts
} = require('../../lib/site/personal-blog')
const post = {
  id: '33d96235-68d5-4ee9-a3be-ff1b9b6638f2',
  type: 'Post',
  status: 'Published',
  slug: 'article/SSO登录',
  title: '统一登录',
  category: '技术分享',
  tags: ['SSO']
}
test('只公开当前库内已发布正文，UUID 无法绕过草稿状态', () => {
  assert.equal(isPublicPage(post), true)
  assert.equal(findPublicPost([post], '33d9623568d54ee9a3beff1b9b6638f2'), post)
  assert.equal(findPublicPost([{ ...post, status: 'Draft' }], post.id), null)
  assert.equal(findPublicPost([post], 'unknown-uuid'), null)
  assert.equal(isPublicPage({ ...post, type: 'Menu' }), false)
  assert.equal(
    isPublicPage({ ...post, id: 'b69a1be3-d07d-4803-9f92-ea81512f28d5' }),
    false
  )
})
test('搜索兼容字符串分类、中文和路由重复参数', () => {
  assert.equal(searchPosts([post], '技术').length, 1)
  assert.equal(searchPosts([post], ' sso ').length, 1)
  assert.deepEqual(searchPosts([post], ['sso', 'login']), [])
  assert.deepEqual(searchPosts([post], '  '), [])
})
