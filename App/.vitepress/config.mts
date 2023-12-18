import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Ma5hr00m",
  head: [
    ['link', { rel: 'icon', href: 'http://q1.qlogo.cn/g?b=qq&nk=2048728823&s=640' }],
    [
      'script',
      {
        async: '',
        src: 'http://umami.ma5hr00m.top/script.js',
        datawebsiteId: '326f7654-999a-463a-ba6e-eccf10914e28',
      },
    ]
  ],
  description: "Maintain Enthusiasm and Stay Cheerful",
  ignoreDeadLinks: true,
  lastUpdated: true,
  themeConfig: {
    logo: 'http://q1.qlogo.cn/g?b=qq&nk=2048728823&s=640',
    
    outline: [2,6],

    search: {
      provider: 'local'
    },

    nav: [
      { text: '🧭 网址导航', link: '/nav/' },
      { text: '🔖 归档', link: '/archives/' },
      { text: '🧑🏻‍🤝‍🧑🏻 友链', link: '/friends/' },
      { text: '🪷 关于', link: '/about/' },
    ],

    sidebar: {
      '/archives/': [
        { text: '归档页面', link: '/archives/' },
        { text: '2023年12月', items: [
          { text: 'CVE-2023-32314复现', link: '/archives/2023/12/cve-2023-32314' },
          { text: 'DNSSEC安全拓展', link: '/archives/2023/12/dnssec' },
        ]},
        { text: '2023年11月', items: [
          { text: 'Maven学习笔记', link: '/archives/2023/11/mvn' },
          { text: 'Linux中Python环境管理', link: '/archives/2023/11/python-env' },
          { text: 'JavaWeb Getting Deeper', link: '/archives/2023/11/javaweb-deeper' },
        ]},
        { text: '2023年10月', items: [
          { text: '面向新生的Linux教程', link: '/archives/2023/10/base-linux' },
          { text: '构建Docker镜像时遇到的问题', link: '/archives/2023/10/docker-qa-01' },
          { text: 'HTML的少见标签及<head>优化', link: '/archives/2023/10/html-relearn' },
          { text: '速通计算机网络相关概念', link: '/archives/2023/10/base-network' },
        ]},
        { text: '2023年09月', items: [
          { text: 'Java运行原理', link: '/archives/2023/09/how-java-run' },
          { text: '常见Web鉴权方案', link: '/archives/2023/09/web-usual-auth' },
          { text: '基于UnoCSS实现响应式设计&颜色主题', link: '/archives/2023/09/unocss-theme' },
          { text: 'Docker基础教程', link: '/archives/2023/09/docker-base' },
          { text: '南無摩慈訶廬初音大菩薩', link: '/archives/2023/09/miku-temple' },
          { text: '通过nvm配置Node.js开发环境', link: '/archives/2023/09/nvm-node' },
        ]},
        { text: '2023年08月', items: [
          { text: '基于Koa2+SQLite快速构建CRUD API', link: '/archives/2023/08/koa2-crud-example' },
          { text: '燕市、铜器与《铜匠的花嫁》', link: '/archives/2023/08/bride-of-blackmith' },
        ]},
        { text: '2023年06月', items: [
          { text: 'git基础教程', link: '/archives/2023/06/base-git' },
        ]},
        { text: '在这之前', items: [
          { text: '想说的话', link: '/archives/history/' },
        ]},
      ],
    }, 

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ma5hr00m' },
      { icon: 'twitter', link: 'https://twitter.com/NineLight99/highlights' }
    ],

    editLink: {
      pattern: 'https://github.com/ma5hr00m',
      text: '分享文章请注明出处'
    },

    footer: {
      message: 'Released under the MIT License',
      copyright: 'Copyright © 2022-present Ma5hr00m'
    }
  }
})