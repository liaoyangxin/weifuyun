import { getToken } from '@/utils/auth'

window.CONFIG = { 
  services: {
    wecom: '/wecom',
    common: '/common',
    system:'/system',
  },
 

  get headers() {
    return { Authorization: 'Bearer ' + getToken() }
  },
}
// 统一为img的src不是绝对地址的拼接接口地址
document.addEventListener(
  'error',
  function(e) {
    let target = e.target
    let src = target.attributes.getNamedItem('src').value
    if (
      target.tagName.toUpperCase() === 'IMG' &&
      src &&
      !src.includes('http')
    ) {
      target.src = process.env.VUE_APP_BASE_API + src
    }
  },
  true
)

export default window.CONFIG
