import type { NavLink } from './components/type'

type NavData = {
  title: string
  items: NavLink[]
}

export const NAV_DATA: NavData[] = [
  {
    "title": "技术平台",
    "items": [
      {
        icon: 'https://github.githubassets.com/favicons/favicon.svg',
        title: 'GitHub',
        desc: '全球最大的代码托管平台，含金量不必多说',
        link: 'https://github.com/',
      },
      {
        icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png',
        title: '稀土掘金',
        desc: '面向全球中文开发者的技术内容分享与交流平台，质量不错',
        link: 'https://juejin.cn/',
      },
      {
        icon: 'https://wx.zsxq.com/assets/images/favicon_32.ico',
        title: '知识星球',
        desc: '知识分享讨论平台，鱼龙混杂，其中不乏含金量很高的星球',
        link: 'https://zsxq.com/',
      },
      {
        icon: '',
        title: '',
        desc: '',
        link: '',
      },
    ]
  },
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
  {
    "title": "AI工具",
    "items": [
      {
        icon: 'https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png',
        title: 'ChatGPT Next Web',
        desc: 'Vidar-Team拼车ChatGPT，目前开放3.5版本，协会成员专享',
        link: 'https://chatgpt.potat0.cc/#/chat',
      },
      {
        icon: 'https://www.bing.com/sa/simg/bing_p_rr_teal_min.ico',
        title: 'New Bing',
        desc: '具有 GPT-4 的 Copilot，可以使用多媒体数据或者分析在线链接',
        link: 'https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx',
      },
      {
        icon: 'https://www.phind.com/images/favicon.png',
        title: 'phind',
        desc: 'Phind是一款面向程序员的 AI 搜索引擎',
        link: 'https://www.phind.com/search?home=true',
      },
      {
        icon: 'https://devv.ai/favicon-dark.png',
        title: 'devv_',
        desc: '最懂程序员的新一代 AI 搜索引擎，计算机领域特化',
        link: 'https://devv.ai/zh',
      },
      {
        icon: 'https://chat.aimakex.com/favicon.svg',
        title: '智造喵',
        desc: '智造喵，智造猫，AI中文智能对话，内置多种prompt',
        link: 'https://chat.aimakex.com/chat',
      },
    ]
  },
  {
    "title": "",
    "items": [
      {
        icon: '',
        title: '',
        desc: '',
        link: '',
      },
    ]
  },
]