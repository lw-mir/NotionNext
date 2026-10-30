import Link from 'next/link'
import { useRouter } from 'next/router'
import { createContext, useContext, useState, useRef } from 'react'
import NotionPage from '@/components/NotionPage'
import { siteConfig } from '@/lib/config'
import { uuidToId } from 'notion-utils'
import CONFIG from './config'
import { Style } from './style'

// 统一日期输出，避免服务端与浏览器时区不同导致 hydration 不一致。
const dateText = post =>
  post?.date?.start_date ||
  (post?.publishDate
    ? new Date(post.publishDate).toISOString().slice(0, 10)
    : '')
const href = (kind, name) => `/${kind}/${encodeURIComponent(name)}`

// 保持旧主题组件的导出契约，外部自定义布局仍可使用搜索状态。
const NobeliumContext = createContext(null)
export const useNobeliumGlobal = () => useContext(NobeliumContext)

const LayoutBase = ({ children }) => {
  const { pathname } = useRouter()
  const [filterKey, setFilterKey] = useState('')
  const searchModal = useRef(null)
  return (
    <NobeliumContext.Provider value={{ filterKey, setFilterKey, searchModal }}>
      <div id='theme-nobelium' className='personal-blog'>
        <Style />
        <a className='skip-link' href='#main-content'>
          跳至正文
        </a>
        <header className='site-header'>
          <Link href='/' className='brand'>
            Lvwei<span>个人笔记</span>
          </Link>
          <nav aria-label='主导航'>
            {[
              ['/', '文章'],
              ['/category', '专题'],
              ['/about', '关于'],
              ['/search', '搜索']
            ].map(([url, text]) => (
              <Link
                key={url}
                href={url}
                aria-current={
                  (url === '/' ? pathname === '/' : pathname.startsWith(url))
                    ? 'page'
                    : undefined
                }
              >
                {text}
              </Link>
            ))}
          </nav>
        </header>
        <main id='main-content' className='site-main'>
          {children}
        </main>
        <footer className='site-footer'>
          <span>
            © {new Date().getFullYear()} Lvwei · 认真记录，慢慢积累。
          </span>
          <Link href='/rss/feed.xml'>RSS 订阅 ↗</Link>
        </footer>
      </div>
    </NobeliumContext.Provider>
  )
}

const Labels = ({ post }) => (
  <div className='post-labels'>
    {post.category && (
      <Link href={href('category', post.category)}>{post.category}</Link>
    )}
    {(post.tags || [])
      .filter(tag => tag !== post.category)
      .map(tag => (
        <Link key={tag} href={href('tag', tag)}>
          # {tag}
        </Link>
      ))}
  </div>
)

const Posts = ({ posts = [], page = 1, postCount = 0, paginate = true }) => {
  const router = useRouter()
  const current = Number(page)
  const count = Number(siteConfig('POSTS_PER_PAGE')) || 10
  const prefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/\d+$/, '')
    .replace(/\/$/, '')
  return (
    <>
      <div id='posts-wrapper' className='posts'>
        {posts.length ? (
          posts.map(post => (
            <article className='post-row' key={post.id}>
              <time dateTime={dateText(post)}>{dateText(post)}</time>
              <div>
                <h2>
                  <Link href={`/${post.slug}`}>
                    {post.title || '未命名笔记'}
                  </Link>
                </h2>
                {post.summary && <p>{post.summary}</p>}
                <Labels post={post} />
              </div>
            </article>
          ))
        ) : (
          <p className='empty-state'>这里还没有文章，新的记录正在路上。</p>
        )}
      </div>
      {paginate && postCount > count && (
        <nav className='pagination' aria-label='文章分页'>
          {current > 1 ? (
            <Link
              rel='prev'
              href={
                current === 2 ? `${prefix}/` : `${prefix}/page/${current - 1}`
              }
            >
              ← 上一页
            </Link>
          ) : (
            <span />
          )}
          <span>
            {current} / {Math.ceil(postCount / count)}
          </span>
          {current * count < postCount ? (
            <Link rel='next' href={`${prefix}/page/${current + 1}`}>
              下一页 →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  )
}

const LayoutIndex = props => (
  <>
    <section className='intro'>
      <p className='eyebrow'>前端 · AI · 日常思考</p>
      <h1>
        把实践写下来，
        <br />
        让思考有迹可循。
      </h1>
      <p>
        我是 Lvwei，一名前端工程师。这里记录技术实践、学习笔记，
        <br className='desktop-break' />
        以及生活中值得留下的想法。
      </p>
    </section>
    <div className='section-heading'>
      <h2>最近文章</h2>
      <Link href='/category'>按专题浏览 ↗</Link>
    </div>
    <Posts {...props} />
  </>
)
const LayoutPostList = props => (
  <>
    <section className='page-heading'>
      <p className='eyebrow'>{props.tag ? '标签' : '专题'}</p>
      <h1>{props.tag || props.category || '全部文章'}</h1>
      <Link href='/category'>← 所有专题</Link>
    </section>
    <Posts {...props} />
  </>
)

const LayoutSearch = props => {
  const router = useRouter()
  const keyword = typeof router.query.s === 'string' ? router.query.s : ''
  return (
    <>
      <section className='page-heading'>
        <p className='eyebrow'>找回一段记录</p>
        <h1>搜索文章</h1>
        <form className='search-form' action='/search' role='search'>
          <label htmlFor='blog-search' className='sr-only'>
            搜索标题、摘要或标签
          </label>
          <input
            id='blog-search'
            name='s'
            type='search'
            defaultValue={keyword}
            key={keyword}
            placeholder='输入关键词…'
            required
          />
          <button type='submit'>搜索</button>
        </form>
      </section>
      {keyword ? (
        <>
          <p className='muted'>
            “{keyword}” 找到 {props.posts?.length || 0} 篇文章
          </p>
          <Posts {...props} paginate={false} />
        </>
      ) : (
        <p className='muted'>可以搜索标题、摘要、分类与标签。</p>
      )}
    </>
  )
}

const LayoutCategoryIndex = ({ categoryOptions = [], tagOptions = [] }) => (
  <>
    <section className='page-heading'>
      <p className='eyebrow'>沿着兴趣阅读</p>
      <h1>专题与标签</h1>
      <p>把散落的记录，串成持续积累的线索。</p>
    </section>
    <div className='topic-list'>
      {categoryOptions
        .filter(item => item.count > 0)
        .map(item => (
          <Link key={item.name} href={href('category', item.name)}>
            <h2>{item.name}</h2>
            <span>{item.count} 篇文章 →</span>
          </Link>
        ))}
    </div>
    <section className='tag-section'>
      <h2>标签</h2>
      <div className='tag-list'>
        {tagOptions
          .filter(item => item.count > 0)
          .map(item => (
            <Link key={item.name} href={href('tag', item.name)}>
              # {item.name}
              <span>{item.count}</span>
            </Link>
          ))}
      </div>
    </section>
  </>
)
const LayoutTagIndex = props => (
  <LayoutCategoryIndex {...props} categoryOptions={[]} />
)

const LayoutSlug = ({ post, lock, validPassword }) => {
  const [error, setError] = useState(false)
  if (!post) return <Layout404 />
  if (lock)
    return (
      <section className='page-heading'>
        <h1>这是一篇加密文章</h1>
        <form
          className='search-form'
          onSubmit={event => {
            event.preventDefault()
            setError(
              !validPassword(new FormData(event.currentTarget).get('password'))
            )
          }}
        >
          <label htmlFor='article-password' className='sr-only'>
            文章密码
          </label>
          <input
            id='article-password'
            name='password'
            type='password'
            required
            autoComplete='current-password'
          />
          <button type='submit'>解锁</button>
        </form>
        {error && <p role='alert'>密码不正确，请重试。</p>}
      </section>
    )
  return (
    <div className='reading-layout'>
      <article className='reading-article'>
        <header className='article-header'>
          <Link href='/' className='back-link'>
            ← 全部文章
          </Link>
          <h1>{post.title}</h1>
          <p className='article-meta'>
            <time dateTime={dateText(post)}>{dateText(post)}</time>
            <span>Lvwei</span>
          </p>
          <Labels post={post} />
          {post.summary && <p className='article-summary'>{post.summary}</p>}
        </header>
        <div id='article-wrapper'>
          <NotionPage post={post} />
        </div>
        <div className='article-end'>
          记录于此，持续更新。<Link href='/'>继续阅读其他文章 →</Link>
        </div>
      </article>
      {post.toc?.length > 0 && (
        <aside className='article-toc' aria-label='文章目录'>
          <p>本文目录</p>
          {post.toc.map(item => (
            <a
              key={item.id}
              href={`#${uuidToId(item.id)}`}
              style={{
                paddingLeft: `${Math.min(item.indentLevel || 0, 3) * 12}px`
              }}
            >
              {item.text}
            </a>
          ))}
        </aside>
      )}
    </div>
  )
}
const LayoutArchive = ({ archivePosts = {} }) => (
  <>
    <section className='page-heading'>
      <h1>文章归档</h1>
    </section>
    {Object.entries(archivePosts).map(([year, posts]) => (
      <section key={year}>
        <h2>{year}</h2>
        <Posts posts={posts} paginate={false} />
      </section>
    ))}
  </>
)
const LayoutAbout = () => (
  <article className='about-page'>
    <p className='eyebrow'>关于这个小站</p>
    <h1>你好，我是 Lvwei。</h1>
    <p className='about-lead'>一名前端工程师，也是一名持续学习的记录者。</p>
    <h2>在这里记录什么</h2>
    <p>
      前端开发中的实践与问题、AI
      工具的使用与探索，以及日常生活中的一些想法。希望把零散的经验整理成可以再次找到、再次使用的笔记。
    </p>
    <h2>为什么写下来</h2>
    <p>
      写作是整理思考的一种方式。比起追求完美的答案，我更想留下真实的过程：做过什么、遇到了什么问题，又是如何一步步解决的。
    </p>
    <p>
      这个网站会随着学习和实践慢慢更新。欢迎通过{' '}
      <Link href='/rss/feed.xml'>RSS</Link> 订阅。
    </p>
    <Link href='/'>阅读最近的文章 →</Link>
  </article>
)
const Layout404 = () => (
  <section className='page-heading'>
    <p className='eyebrow'>404</p>
    <h1>这篇记录暂时找不到。</h1>
    <p>文章可能已移走，或尚未公开发布。</p>
    <Link href='/'>← 返回文章列表</Link>
  </section>
)

export {
  Layout404,
  LayoutAbout,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}
