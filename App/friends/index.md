---
layout: page
---

<script setup>
import VPFriends from './components/VPFriends.vue';

const friends = [
  {
    "name": "ek1ng",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=761042182&s=160",
    "tag": "CTFer / Cybersecurity",
    "link": "https://ek1ng.com",
    "desc": "Vidar强大学长",
    "color": "#418fde"
  },
  {
    "name": "ripple",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=3331491980&s=160",
    "tag": "HDUer",
    "link": "https://rippleqaq.top",
    "desc": "上海时区纽约作息",
    "color": "#14C4E3"
  },
  {
    "name": "ch405",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=1286518974&s=160",
    "tag": "CTFer",
    "link": "https://ch405.live",
    "desc": "万能草时&互联网史官",
    "color": "#F22E8A"
  },
  {
    "name": "zbwer",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=1641064392&s=160",
    "tag": "Frontend Developer",
    "link": "https://blog.zbwer.work",
    "desc": "强大のUESTC前端学长",
    "color": "#14C4E3"
  },
  {
    "name": "Ec3o",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=2499302531&s=160",
    "tag": "CTFer",
    "link": "https://ec3o.fun",
    "desc": "新任兔兔妈",
    "color": "#4F9EFF"
  },
  {
    "name": "mysid",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=821675766&s=160",
    "tag": "CTFer",
    "link": "http://mysid.top",
    "desc": "Java&渗透研究-ing",
    "color": "#FF02CB"
  },
  {
    "name": "Pinpe",
    "avatar": "https://agu-img.oss-cn-hangzhou.aliyuncs.com/blog/a2bb7859939871165f438ab2f96d72b8343dae41.jpg%40150w_150h.jpg",
    "tag": "Misc Developer",
    "link": "https://pinpe.top",
    "desc": "一个属于自己的云朵",
    "color": "#47D52A"
  },
  {
    "name": "smilkes",
    "avatar": "https://q1.qlogo.cn/g?b=qq&nk=1937683643&s=160",
    "tag": "HDUer / Machine Learning",
    "link": "http://smilkes.site",
    "desc": "机器学习",
    "color": "#2C9AD4"
  }
];
</script>

<VPFriends :friends="friends" />
