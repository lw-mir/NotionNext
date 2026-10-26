import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

export default function About(props) {
  return <DynamicLayout theme='nobelium' layoutName='LayoutAbout' {...props} />
}

// 关于页与博客共用站点元信息，保持导航、SEO 和布局一致。
export async function getStaticProps({ locale }) {
  const props = await fetchGlobalAllData({ from: 'about-props', locale })
  delete props.allPages
  return { props, revalidate: 60 }
}
