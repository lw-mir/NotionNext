import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'
import { siteConfig } from '@/lib/config'

export default function About(props) {
  return (
    <DynamicLayout
      theme={siteConfig('THEME')}
      layoutName='LayoutAbout'
      {...props}
    />
  )
}

// 关于页与博客共用站点元信息，保持导航、SEO 和布局一致。
export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'about-props', locale })
  props.post = {
    title: '关于',
    slug: 'about',
    type: 'Page',
    summary: props.siteInfo?.description
  }
  delete props.allPages
  return { props, revalidate: 60 }
}
