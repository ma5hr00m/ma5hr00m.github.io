import type { NavLink } from './components/type'

type NavData = {
  title: string
  items: NavLink[]
}

export const NAV_DATA: NavData[] = [
  {
    title: '设计资源',
    items: [
      {
        icon: 'https://www.svgrepo.com/favicon.ico',
        title: 'SVG Repo',
        desc: '超齐全SVG免费图片素材，支持多种导出方式，提供SVG源码',
        link: 'https://www.svgrepo.com/',
      },
      {
        icon: 'https://static.lottiefiles.com/favicons-new/favicon-96x96.png',
        title: 'LottieFiles',
        desc: 'Web页面动画资源，部分免费',
        link: 'https://lottiefiles.com/',
      },
      {
        icon: 'https://webframe.xyz/site-image.png',
        title: 'Webframe',
        desc: 'Web页面UI设计参考，分类细致到组件级别',
        link: 'https://webframe.xyz/',
      },
      {
        icon: 'https://s.pinimg.com/webapp/logo_trans_144x144-a77ee814.png',
        title: 'Pinterest',
        desc: '全球范围内祖宗级别的美术资源站，素材种类齐全且数量庞大，网站功能完善',
        link: 'https://www.pinterest.com/',
      },
      {
        icon: 'https://color.adobe.com/apple-touch-icon.png',
        title: 'Adobe Color',
        desc: 'Adobe色彩工具站，取色、色彩分析、色彩提取等系列功能齐全且强大',
        link: 'https://color.adobe.com/zh/',
      },
      {
        icon: 'https://smashicons.com/assets/img/favicon/new/favicon-96x96.png',
        title: 'smashicons',
        desc: 'ICON图标资源站，种类齐全，部分免费',
        link: 'https://smashicons.com/',
      },
      {
        icon: 'https://nipponcolors.com/images/site_thumb.jpg',
        title: '日本の伝統色',
        desc: '日本传统色彩资源，网站非常美观',
        link: 'https://nipponcolors.com/',
      },
      {
        icon: 'http://zhongguose.com/img/favicon.ico',
        title: '中国色',
        desc: '提供各种中国的传统颜色的名称，CMYK值，RGB值，16进制表示',
        link: 'http://zhongguose.com/',
      },
      {
        icon: 'https://static.alphacoders.com/wallpaper_abyss.jpg',
        title: 'Wallpaper Abyss',
        desc: '一个壁纸社区，支持浏览、下载和评论高清壁纸',
        link: 'https://wall.alphacoders.com/',
      },
      {
        icon: 'https://wallpapercave.com/favicon.ico',
        title: 'WallpaperCave',
        desc: '强大的壁纸资源网站',
        link: 'https://wallpapercave.com/',
      },
    ],
  },
]