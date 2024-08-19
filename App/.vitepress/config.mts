import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Ma5hr00m",
  head: [
    ['link', { rel: 'icon', href: 'https://img.ma5hr00m.top/blog/20240216101525.png' }],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-KWZ7L6T7SE',
      },
    ],
    [
      'script',
      { id: 'google-tag' },
      ` window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-KWZ7L6T7SE', {'user_id': '313114514'});`
    ]
  ],
  description: "Maintain Enthusiasm and Stay Cheerful",
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    logo: 'https://img.ma5hr00m.top/blog/title.png',

    outline: [2,6],

    search: {
      provider: 'local'
    },

    nav: [
      { text: '主页', link: '/' },
      { text: '导航', link: '/nav/' },
      { text: '归档', link: '/archives/' },
      { text: '朋友', link: '/friends/' },
      { text: '关于', link: '/about/' },
    ],

    sidebar: {
      '/archives/': [
        { text: '归档页面', link: '/archives/' },
        { text: '2024-06', items: [
          { text: '你知道 Clash 吗？', link: '/archives/2024/06/how-does-clash-work' },
          { text: 'FRP v0.1.0 源码阅读', link: '/archives/2024/06/frp-read' },
          { text: '数字图像处理-灰度共生矩阵', link: '/archives/2024/06/glcm' },
          { text: '浏览器中的 Event Loop', link: '/archives/2024/06/browser-eventloop' },
          { text: '流畅地使用 async/await', link: '/archives/2024/06/async-await' },
          { text: 'Promise使用一览', link: '/archives/2024/06/promise' },
        ]},
        { text: '2024-05', items: [
          { text: 'HelloWeb 致新生', link: '/archives/2024/05/hello-web' },
          { text: '网络通信中的心跳机制', link: '/archives/2024/05/heartbeat' },
          { text: 'FRP工作原理及实现', link: '/archives/2024/05/how-frp-work' },
        ]},
        { text: '2024-04', items: [
          { text: '深圳游-攻防演练', link: '/archives/2024/04/shen-zhen-you' },
          { text: 'JavaSec Note One', link: '/archives/2024/04/javasec-note-one' },
          { text: 'AliyunCTF2024 Writeup', link: '/archives/2024/04/aliyunctf-2024' },
        ]},
        { text: '2024-02', items: [
          { text: 'Nginx进程模型浅析', link: '/archives/2024/02/overview-of-nginx-process-model' },
          { text: 'JavaScript作用域与提升', link: '/archives/2024/02/js-scope-and-hoisting' },
          { text: 'JavaScript原型链详解', link: '/archives/2024/02/js-prototype-chain' },
          { text: 'JavaScript混淆与反混淆', link: '/archives/2024/02/js-obfuscation-deobfuscation' },
          { text: 'JavaScript执行原理', link: '/archives/2024/02/how-js-run' },
        ]},
        { text: '2024-01', items: [
          { text: '网络空间安全技术理论课复习', link: '/archives/2024/01/end-review' },
          { text: '基于GA Reporting API v4实现博客浏览量统计', link: '/archives/2024/01/ga4-counter' },
        ]},
        { text: '2023-12', items: [
          { text: '2023-终总结', link: '/archives/2023/12/year-end-review' },
          { text: 'Learn to live in Terminal', link: '/archives/2023/12/learn-to-live-in-terminal' },
          { text: '为Markdown添加动态内容', link: '/archives/2023/12/markdown-dynamic-content' },
          { text: 'Supabase+Vercel部署Umami', link: '/archives/2023/12/supabase-vercel-umami' },
          { text: '杭州小记·清河坊&伍公山&雷峰塔', link: '/archives/2023/12/hangzhou-trip-02' },
          { text: 'DNSSEC安全拓展', link: '/archives/2023/12/dnssec' },
        ]},
        { text: '2023-11', items: [
          { text: 'Maven学习笔记', link: '/archives/2023/11/mvn' },
          { text: 'Linux中Python环境管理', link: '/archives/2023/11/python-env' },
          { text: 'JavaWeb Getting Deeper', link: '/archives/2023/11/javaweb-deeper' },
        ]},
        { text: '2023-10', items: [
          { text: '面向新生的Linux教程', link: '/archives/2023/10/base-linux' },
          { text: '构建Docker镜像时遇到的问题', link: '/archives/2023/10/docker-qa-01' },
          { text: 'HTML的少见标签及<head>优化', link: '/archives/2023/10/html-relearn' },
          { text: '速通计算机网络相关概念', link: '/archives/2023/10/base-network' },
        ]},
        { text: '2023-09', items: [
          { text: 'Java运行原理', link: '/archives/2023/09/how-java-run' },
          { text: '常见Web鉴权方案', link: '/archives/2023/09/web-usual-auth' },
          { text: '基于UnoCSS实现响应式设计&颜色主题', link: '/archives/2023/09/unocss-theme' },
          { text: 'Docker基础教程', link: '/archives/2023/09/docker-base' },
          { text: '南無摩慈訶廬初音大菩薩', link: '/archives/2023/09/miku-temple' },
          { text: '通过nvm配置Node.js开发环境', link: '/archives/2023/09/nvm-node' },
        ]},
        { text: '2023-08', items: [
          { text: '基于Koa2+SQLite快速构建CRUD API', link: '/archives/2023/08/koa2-crud-example' },
          { text: '燕市、铜器与《铜匠的花嫁》', link: '/archives/2023/08/bride-of-blackmith' },
        ]},
        { text: '2023-06', items: [
          { text: 'git基础教程', link: '/archives/2023/06/base-git' },
        ]},
        { text: '在这之前', items: [
          { text: '想说的话', link: '/archives/history/' },
        ]},
      ],
    }, 

    editLink: {
      pattern: 'https://github.com/ma5hr00m/ma5hr00m.github.io',
      text: '分享文章请注明出处'
    },

    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2022-present Ma5hr00m'
    }
  }
})

/**
 * 
 * socialLinks: [
      { icon: 'github', link: 'https://github.com/ma5hr00m' },
      { icon: {
          svg: '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="256.000000pt" height="256.000000pt" viewBox="0 0 256.000000 256.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)" fill="#97979f" stroke="none"><path d="M535 2543 c-181 -24 -364 -150 -447 -309 -76 -146 -72 -95 -76 -909 -2 -487 1 -752 8 -799 30 -191 143 -353 310 -440 141 -74 92 -70 916 -74 835 -3 825 -4 973 69 159 78 279 235 316 414 22 103 22 1467 0 1570 -37 179 -157 336 -316 414 -145 72 -136 71 -939 69 -393 0 -728 -3 -745 -5z m863 -618 l113 -90 -28 -23 c-15 -13 -68 -55 -117 -93 l-88 -69 -41 32 c-119 95 -179 146 -177 154 1 11 213 184 220 181 4 -1 57 -42 118 -92z m-469 -290 c242 -193 346 -275 351 -275 3 0 93 71 200 156 107 86 201 158 208 161 7 3 34 -12 60 -34 26 -22 59 -48 75 -57 48 -32 66 -12 -238 -251 -104 -81 -214 -168 -244 -192 -29 -24 -57 -43 -61 -43 -5 0 -26 15 -47 33 -22 17 -55 43 -73 57 -19 14 -88 68 -154 120 -67 53 -161 127 -209 165 -48 38 -86 74 -85 81 3 13 138 123 152 124 4 0 34 -20 65 -45z m-363 -268 c40 -34 208 -166 344 -272 42 -33 139 -109 214 -168 76 -59 143 -110 150 -113 7 -3 64 36 127 85 63 50 139 110 169 134 30 24 141 111 245 194 105 82 200 156 211 163 20 12 28 8 98 -46 41 -32 74 -64 73 -71 -1 -6 -31 -34 -67 -62 -77 -61 -209 -165 -578 -456 l-272 -216 -238 188 c-130 103 -255 202 -277 219 -22 18 -121 96 -220 174 -99 77 -181 145 -183 150 -4 10 138 130 154 130 6 0 28 -15 50 -33z"/></g></svg>'
        }, link: 'https://juejin.cn/user/811865333304430' },
    ],
 * 
 */


// 10.10.171.0/24
// 10.88.25.0/24
// 10.10.168.0/24