---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const friends = [
  {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=761042182&s=640',
    name: 'ek1ng',
    org: 'Vidar强大学长 | 仍在努力',
    orgLink: 'https://ek1ng.com/'
  }, {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=2497091708&s=640',
    name: 'r1esbyfe',
    org: '专注于CTF | 一条努力的咸鱼',
    orgLink: 'https://r1esbyfe.top/'
  }, {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=3331491980&s=640',
    name: 'ripple',
    org: '高数小王子 | 狂暴摆烂组长',
    orgLink: 'http://rippleqaq.top'
  }, {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=1286518974&s=640',
    name: 'ch405',
    org: 'Vidar Misc/Web | 互联网史官',
    orgLink: 'http://ch405.live'
  }, {
    avatar: 'http://q1.qlogo.cn/g?b=qq&nk=1641064392&s=640',
    name: 'zbwer',
    org: '前端开发进行时 | 华科学长',
    orgLink: 'https://blog.zbwer.work/'
  }, {
    avatar: 'https://ec3o.github.io/images/avatar.webp',
    name: 'Ec3o',
    org: 'Vidar Web | HDUHelper',
    orgLink: 'https://ec3o.github.io'
  }, {
    avatar: 'http://119.91.208.190/img/mysid.png',
    name: 'mysid',
    org: 'Vidar Web | 努力-ing',
    orgLink: 'http://119.91.208.190'
  },
]
</script>

<VPTeamPage>
  <br/>
  <VPTeamMembers size="small" :members="friends" />
</VPTeamPage>