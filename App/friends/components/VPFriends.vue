<script setup lang="ts">
import { defineProps, h } from 'vue';

export interface Friend {
  name: string;
  avatar: string;
  link: string;
}

defineProps<{ friends: Friend[] }>();
</script>

<template>
  <div class="friends">
    <div class="content">
    <!-- <h1>Friends</h1> -->
      <div v-for="friend in friends" :key="friend.name"  class="VPFriend-card" :style="{ '--tag-color': friend.color }">
        <a class="VPFriend-link" :href="friend.link">
          <div class="VPFriend-image">
            <img class="VPFriend-avatar" :src="friend.avatar" :alt="friend.name" />
          </div>
          <div class="VPFriend-text">
            <p class="VPFriend-name">{{ friend.name }}</p>
            <span class="VPFriend-tag">{{ friend.tag }}</span>
            <p class="VPFriend-descriptionAndHref">
              <span class="VPFriend-desc">{{ friend.desc }}</span>
              <span class="VPFriend-href">{{ friend.link.replace(/^https?:\/\//i, '') }}</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.friends {
  position: relative;
  width: 100%;
  height: fit-content;
  padding: 32px 32px 0;
  display: flex;
  justify-content: center;
}

.content {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media screen and (max-width: 1024px) and (min-width: 790px) {
  .content {
    grid-template-columns: repeat(3, 1fr); /* 大于680小于1024时，每行3列 */
  }
}

@media screen and (max-width: 790px) and (min-width: 560px) {
  .content {
    grid-template-columns: repeat(2, 1fr); /* 小于680时，每行2列 */
  }
}

@media screen and (max-width: 560px) {
  .content {
    grid-template-columns: repeat(1, 1fr); /* 小于680时，每行2列 */
  }
}

.VPFriend-card {
  background-color: var(--vp-c-friend-card);
  width: 15rem;
  height: 15rem;
  transition: all .3s;
  border: 1px solid transparent;

  &:hover {
    background-color: var(--vp-c-friend-card-hover);
    border: 1px solid var(--tag-color);
  }

  p {
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .VPFriend-link {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    transform: translateY(-0.5rem);
  }

  &:hover .VPFriend-text .VPFriend-descriptionAndHref .VPFriend-desc {
		opacity: 0;
		-webkit-filter: blur(1.5rem);
	}

	&:hover .VPFriend-text .VPFriend-descriptionAndHref .VPFriend-href {
    opacity: 1 !important;
		-webkit-filter: blur(0) !important;
    text-decoration: underline;
	}

  .VPFriend-image {
    width: 4rem;
    height: 4rem;
    display: flex;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .VPFriend-avatar {
      width: 100%;
      height: 100%;
    }
  }

  .VPFriend-text {
    margin-top: .75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .VPFriend-name {
      color: #fff;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .VPFriend-tag {
      margin-top: .25rem;
      font-size: .75rem;
      padding: 0 1rem;
      background-color: var(--tag-color);
      border-radius: 10rem;
      color: #fff;
    }

    .VPFriend-descriptionAndHref {
      position: relative;
      margin-top: .75rem;
      color: #fff;
      font-size: .875rem;

      span {
        text-overflow: ellipsis;
        text-wrap: nowrap;
        transition: all .3s;
			}

      .VPFriend-href {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
				-webkit-filter: blur(1rem);
        opacity: 0;
			}
    }
  }
}
</style>
