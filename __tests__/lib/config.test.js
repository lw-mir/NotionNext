/**
 * @jest-environment node
 */
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'

describe('siteConfig', () => {
  const originalPostUrlPrefix = BLOG.POST_URL_PREFIX

  afterEach(() => {
    BLOG.POST_URL_PREFIX = originalPostUrlPrefix
  })

  it('uses BLOG/env config before caller default for server-only keys', () => {
    BLOG.POST_URL_PREFIX = 'blog'

    expect(siteConfig('POST_URL_PREFIX', 'post', {})).toBe('blog')
  })

  it('keeps extend config higher priority than BLOG/env config', () => {
    BLOG.POST_URL_PREFIX = 'blog'

    expect(
      siteConfig('POST_URL_PREFIX', 'post', { POST_URL_PREFIX: 'post' })
    ).toBe('post')
  })

  it('keeps the personal Claude theme and brand above stale Notion settings', () => {
    expect(siteConfig('THEME', 'simple', { THEME: 'nobelium' })).toBe('claude')
    expect(siteConfig('CLAUDE_BLOG_NAME')).toBe('Lvwei · 个人笔记')
  })

  it('reads inner page parent path toggle from Notion Config', () => {
    expect(
      siteConfig('INNER_PAGE_URL_PARENT_PATH', false, {
        INNER_PAGE_URL_PARENT_PATH: 'true'
      })
    ).toBe(true)
  })
})
