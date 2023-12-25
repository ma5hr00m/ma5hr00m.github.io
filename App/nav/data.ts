import type { NavLink } from './components/type'

type NavData = {
  title: string
  items: NavLink[]
}

export const NAV_DATA: NavData[] = [
  {
    "title": "技术交流平台",
    "items": [
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'GitHub',
        desc: '全球最大的代码托管平台，含金量不必多说',
        link: 'https://github.com/',
      },
      {
        icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196',
        title: 'Stack Overflow',
        desc: 'Stack Overflow is the largest, most trusted online community for developers to learn, share​ ​their programming ​knowledge, and build their careers',
        link: 'https://stackoverflow.com/',
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
        icon: 'https://static.zhihu.com/heifetz/favicon.ico',
        title: '知乎',
        desc: '中文互联网高质量的问答社区和创作者聚集的原创内容平台（故事汇）',
        link: 'https://www.zhihu.com/',
      },
      {
        icon: 'https://www.v2ex.com/static/icon-192.png',
        title: 'V2EX',
        desc: 'V2EX 是一个关于分享和探索的地方',
        link: 'https://www.v2ex.com/',
      },
      {
        icon: 'https://static.segmentfault.com/main_site_next/20baa25b/touch-icon.png',
        title: '思否',
        desc: '思否是中国专业的开发者技术社区。我们以技术问答、技术博客、技术课程、技术资讯为核心的产品形态，为开发者提供纯粹、高质的技术交流平台',
        link: 'https://segmentfault.com/',
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
    "title": "高质量周刊/资料",
    "items": [
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'AI绘画资料合集',
        desc: 'AI绘画资料合集（包含国内外可使用平台、使用教程、参数教程、部署教程、业界新闻等等',
        link: 'https://github.com/hua1995116/awesome-ai-painting',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'Python 潮流周刊',
        desc: 'Python 潮流周刊，分享文章、教程、开源项目、软件工具、播客和视频、热门话题等内容 ',
        link: 'https://github.com/chinesehuazhou/python-weekly',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: '科技爱好者周刊',
        desc: '阮一峰的网络日志：周刊，每周五发布 ',
        link: 'https://www.ruanyifeng.com/blog/weekly/',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: '科技爱好者周刊 issue',
        desc: '阮一峰科技爱好者周刊仓库下的issue，优质的技术文章和产品聚集地，非常热闹',
        link: 'https://github.com/ruanyf/weekly/issues',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'favorite link',
        desc: '每天收集喜欢的开源项目 | RSS 订阅 | 快知 app 订阅 ',
        link: 'https://github.com/guanguans/favorite-link',
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
    "title": "学习资料/文档",
    "items": [
      {
        icon: 'https://roadmap.sh/manifest/favicon.ico',
        title: 'Developer Roadmap',
        desc: 'Interactive roadmaps, guides and other educational content to help developers grow in their careers',
        link: 'https://roadmap.sh/',
      },
      {
        icon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
        title: 'MDN',
        desc: 'Documenting web technologies, including CSS, HTML, and JavaScript, since 2005.',
        link: 'https://developer.mozilla.org/zh-CN/',
      },
      {
        icon: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_200x200-min.png',
        title: 'GeeksforGeeks',
        desc: '面向程序员和计算机科学爱好者的网站，提供了大量关于数据结构、算法、编程语言、系统设计、操作系统、数据库等方面的教程和文章。',
        link: 'https://www.geeksforgeeks.org/',
      },
      {
        icon: 'https://static.runoob.com/images/favicon.ico',
        title: '菜鸟教程',
        desc: '菜鸟教程(www.runoob.com)提供了编程的基础技术教程, 介绍了HTML、CSS、Javascript、Python，Java，Ruby，C，PHP , MySQL等各种编程语言的基础知识',
        link: 'https://www.runoob.com/',
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
    "title": "安全社区/文档",
    "items": [
      {
        icon: 'https://1517081779-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/collections%2FmuMguNrsRx2mNyNqEox4%2Ficon%2F1qCJ0VIDlWcvGSecYCDq%2Ffondo.png?alt=media&token=1e721267-450f-43f3-861b-6c4f93278e93',
        title: 'HackTricks',
        desc: 'Welcome to the wiki where you will find each hacking trick/technique/whatever I have learnt from CTFs, real life apps, reading researches, and news.',
        link: 'https://book.hacktricks.xyz/welcome/readme',
      },
      {
        icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cve.mitre.org/',
        title: 'CVE',
        desc: 'The mission of the CVE® Program is to identify, define, and catalog publicly disclosed cybersecurity vulnerabilities',
        link: 'https://cve.mitre.org/',
      },
      {
        icon: 'https://forum.butian.net/ico.png',
        title: '奇安信攻防社区',
        desc: '奇安信攻防社区,白帽子,漏洞,安全技术,360,补天,安全研究,攻防',
        link: 'https://forum.butian.net/',
      },
      {
        icon: 'https://www.freebuf.com/favicon.ico',
        title: 'FreeBuf',
        desc: '国内领先的网络安全行业门户，同时也是爱好者们交流与分享安全技术的社区',
        link: 'https://www.freebuf.com/',
      },
      {
        icon: 'https://ctf-wiki.org/assets/images/favicon.png',
        title: 'CTF Wiki',
        desc: 'CTF Wiki 对 CTF 中的各个方向的知识进行介绍，以便于初学者更好地学习 CTF 相关的知识。',
        link: 'https://ctf-wiki.org/',
      },
      {
        icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://websec.readthedocs.io',
        title: 'Web安全学习笔记',
        desc: 'Study Notes For Web Hacking / Web安全学习笔记 ',
        link: 'https://websec.readthedocs.io/zh/latest/index.html',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'sec-note',
        desc: '记录安全方面的笔记/工具/漏洞合集',
        link: 'https://github.com/reidmu/sec-note',
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
    "title": "云服务平台",
    "items": [
      {
        icon: 'https://img.alicdn.com/tfs/TB1_ZXuNcfpK1RjSZFOXXa6nFXa-32-32.ico',
        title: '阿里云',
        desc: '开启云上动手实践，探索技术创意边界',
        link: 'https://home.console.aliyun.com/',
      },
      {
        icon: '//cloudcache.tencent-cloud.com/qcloud/app/resource/ac/favicon.ico',
        title: '腾讯云',
        desc: '性能强大、安全、稳定的云产品，腾讯多年技术沉淀，300+ 款产品共筑腾讯云产品矩阵',
        link: 'https://console.cloud.tencent.com/',
      },
      {
        icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.dynadot.com',
        title: 'Dynadot',
        desc: '一家经过ICANN认证的智能域名注册商，专注于为用户提供简洁、优惠、安全的域名管理和网络托管服务',
        link: 'https://www.dynadot.com/zh/',
      },
      {
        icon: 'https://www.cloudflare.com/favicon.ico',
        title: 'Cloudflare',
        desc: '集成化云服务平台，专注网站应用和SaaS访问加速、安全防护、稳定在线。提供免费CDN、无限制服务器ddos防御，防cc攻击、sql注入、僵尸网络攻击',
        link: 'https://www.cloudflare.com/zh-cn/',
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
    "title": "笔记/知识库工具",
    "items": [
      {
        icon: 'https://p1-hera.feishucdn.com/tos-cn-i-jbbdkfciu3/1ec7129d900e442d8501d810efdaa369~tplv-jbbdkfciu3-image:0:0.image',
        title: '飞书文档',
        desc: '强大，无需多言，不论是单人使用还是多人协作，体验均极佳',
        link: 'https://www.feishu.cn/product/docs',
      },
      {
        icon: 'https://typora.io/img/favicon-64.png',
        title: 'Typora',
        desc: '强大的 Markdown 编辑/阅读器，支持即时渲染，平台支持广泛，旧版本免费',
        link: 'https://typora.io/',
      },
      {
        icon: 'https://www.notion.so/front-static/favicon.ico',
        title: 'Notion',
        desc: 'A new tool that blends your everyday work apps into one. It\'s the all-in-one workspace for you and your team.',
        link: 'https://www.notion.so/',
      },
      {
        icon: 'https://obsidian.md/favicon.svg',
        title: 'Obsidian',
        desc: 'Obsidian is the private and flexible writing app that adapts to the way you think',
        link: 'https://obsidian.md/',
      },
      {
        icon: 'https://c1-onenote-15.cdn.office.net/o/resources/1033/FavIcon_OneNote.ico',
        title: 'OneNote',
        desc: 'Microsoft旗下的在线笔记软件，功能非常强大，但加载速度略慢',
        link: 'https://www.onenote.com/',
      },
      {
        icon: 'https://marktext.github.io/website/favicon.png',
        title: 'MarkText',
        desc: '简洁优雅的Markdon编辑器，注重速度和可用性。官方仓库最近一次更新在2022年03月',
        link: 'https://www.marktext.cc/',
      },
      {
        icon: 'https://excalidraw.com/favicon-32x32.png',
        title: 'Excalidraw',
        desc: 'Excalidraw is a virtual collaborative whiteboard tool that lets you easily sketch diagrams that have a hand-drawn feel to them',
        link: 'https://excalidraw.com/',
      },
      {
        icon: 'https://mdn.alipayobjects.com/huamei_0prmtq/afts/img/A*vMxOQIh4KBMAAAAAAAAAAAAADvuFAQ/original',
        title: '语雀',
        desc: '优秀的文档和知识库工具（网传快停止维护了，见仁见智）',
        link: 'https://www.yuque.com/',
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
    "title": "AI问答工具",
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
      {
        icon: 'https://www.perplexity.ai/favicon.svg',
        title: 'Perplexity',
        desc: 'Perplexity AI unlocks the power of knowledge with information discovery and sharing',
        link: 'https://www.perplexity.ai/',
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
    "title": "绘画设计工具",
    "items": [
      {
        icon: 'https://static.figma.com/app/icon/1/favicon.svg',
        title: 'figma',
        desc: 'Figma is the leading collaborative design tool for building meaningful products. ',
        link: 'https://www.figma.com/',
      },
      {
        icon: 'https://krita.org/wp-content/themes/krita-org-theme/images/favicon.ico',
        title: 'Krita',
        desc: 'Krita 是一款自由开源的免费绘画软件，无需注册、无广告、试用期或者商用限制，让每一位画师都可以有尊严地表达创意',
        link: 'https://krita.org/zh/',
      },
      {
        icon: 'https://www.adobe.com/content/dam/acom/one-console/icons_rebrand/ps_appicon.svg',
        title: 'Photoshop',
        desc: '由Adobe 开发和发行的最专业、强大、功能齐全的图像处理软件，提供对Windows 和 macOS 操作系统的支持',
        link: 'https://www.adobe.com/hk_zh/products/photoshop/landpa.html?gclid=CjwKCAiAvoqsBhB9EiwA9XTWGYk75uLm49qb0OBjH5EBDLiVYFVno2i-_6w-4vxoqbuekH5TBxaupBoC_9oQAvD_BwE&sdid=GVTYXXRQ&mv=search&mv2=paidsearch&ef_id=CjwKCAiAvoqsBhB9EiwA9XTWGYk75uLm49qb0OBjH5EBDLiVYFVno2i-_6w-4vxoqbuekH5TBxaupBoC_9oQAvD_BwE:G:s&s_kwcid=AL!3085!3!474060793403!e!!g!!photoshop!706204247!37727711995&gad_source=1',
      },
      {
        icon: 'https://www.painttoolsai2.com/img/paint-tool-sai-2-favican.png',
        title: 'SAI2',
        desc: 'Paint Tool SAI 2 Free Download Full Version 2023 is Best graphics editor and painting tools. Latest version available for Windows & Mac. It\'s Free and Safe.',
        link: 'https://www.painttoolsai2.com/',
      },
    ]
  },
  {
    title: '美术设计资源',
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
      {
        icon: 'https://www.emojiall.com/favicon.ico',
        title: 'EMOJIALL',
        desc: '该网站提供了最新、完整的Emoji搜索和相关信息，包括表情符号含义、使用示例、Unicode代码点、高分辨率图片、复制和粘贴，以及Emoji大数据排名、矢量图形和动态图表、智能算法情感分析和表情符号语言学研究',
        link: 'https://www.emojiall.com/zh-hans',
      },
      {
        icon: 'https://css.gg/fav/favicon-96x96.png',
        title: 'CSS Icons',
        desc: 'Open-source CSS, SVG and Figma UI Icons. Available in SVG Sprite, styled-components, NPM & API',
        link: 'https://css.gg/',
      },
      {
        icon: 'https://github.githubassets.com/favicons/favicon-dark.png',
        title: 'Noise Creator',
        desc: '在线生成噪点图像，数十种噪点图可选，支持自定义参数',
        link: 'https://noisecreater.com/',
      },
      {
        icon: 'https://www.gstatic.com/images/icons/material/apps/fonts/1x/catalog/v5/favicon.svg',
        title: 'Google Fonts',
        desc: 'Google 官方字体仓库，海量字体素材，支持在线预览以及下载字体文件',
        link: 'https://fonts.google.com/',
      },
      {
        icon: 'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.chuangkit.com/',
        title: '创客贴',
        desc: '极简好用的平面设计作图软件,在线图片编辑器,免费使用.提供免费设计模板，有海报、名片、公众号图片、PPT、邀请函等65个场景模板,一键搞定设计印刷',
        link: 'https://www.chuangkit.com/',
      },
      {
        icon: 'https://res.cloudinary.com/practicaldev/image/fetch/s--eWZ6RXEZ--/c_limit,f_png,fl_progressive,q_80,w_180/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8j7kvp660rqzt99zui8e.png',
        title: 'Awesome Badges ',
        desc: 'How often do you find yourself struggling to create a readme file after finishing a project so that...',
        link: 'https://dev.to/envoy_/150-badges-for-github-pnk',
      },
      {
        icon: 'https://shields.io/img/favicon.ico',
        title: 'Shields.io',
        desc: 'Concise, consistent, and legible badges',
        link: 'https://shields.io/',
      },
      {
        icon: '',
        title: '',
        desc: '',
        link: '',
      },
    ],
  },
  {
    "title": "在线阅读/文献参考",
    "items": [
      {
        icon: 'https://z-lib.is/favicon-32x32.svg?v=2',
        title: 'Z-Library',
        desc: 'Z-Library. The world\'s largest ebook library | Ebooks library. Find books Download Free Online books store on Z-Library.',
        link: 'https://z-lib.is/',
      },
      {
        icon: 'https://www.cnki.net/favicon.ico',
        title: '中国知网',
        desc: '中国知识基础设施建设工程',
        link: 'https://www.cnki.net/index/',
      },
      {
        icon: 'https://pubscholar.cn/static/favicon-wfn3fg.ico',
        title: 'PubScholar公益学术平台',
        desc: 'PubScholar公益学术平台是中国科学院作为国家战略科技力量的主力军，履行学术资源保障“国家队”职责，为满足全国科技界和全社会科技创新的学术资源基础保障需求，建设的提供公益性学术资源的检索发现、内容获取和交流共享等服务的平台。平台在尊重知识产权和国际通行规范的前提下，发挥中国科学院自身拥有丰富且高质量学术资源的优势，带动国内外的学术资源机构积极合作，最大限度地开放优质学术资源。目前，平台整合集成了中国科学院的科技成果资源、科技出版资源和学术交流资源；OA环境下允许集成服务的学术资源；以及通过协议授权或其它合作共建模式获得授权许可的学术资源。',
        link: 'https://pubscholar.cn/',
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