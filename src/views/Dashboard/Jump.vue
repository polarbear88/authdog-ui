<script setup lang="ts">
import { useCache } from '@/hooks/web/useCache'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useRouter } from 'vue-router'

const { wsCache } = useCache()

const appStore = useAppStoreWithOut()
const userInfo = wsCache.get(appStore.getUserInfo)
const router = useRouter()

let isJump = false

if (userInfo.role === 'developer') {
  router.push({ name: 'Dashboard-Developer' })
  isJump = true
}
if (userInfo.role === 'saler') {
  console.log(router)
  router.push({ name: 'Dashboard-Saler' })
  isJump = true
}

if (!isJump) {
  router.push({ name: 'Root' })
}
</script>

<template>
  <div>跳转页</div>
</template>
