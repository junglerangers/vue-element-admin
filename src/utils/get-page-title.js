import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Element Admin'
// 获取页面title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
