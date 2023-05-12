<script setup lang="ts">
import { ElLink } from 'element-plus'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import { ref } from 'vue'

const link = import.meta.env.VITE_HELP_URL

const showlink = ref(false)

try {
  const { wsCache } = useCache()
  const appStore = useAppStoreWithOut()
  wsCache.get(appStore.getUserInfo)
  const userInfo = wsCache.get(appStore.getUserInfo)
  if (userInfo?.role === 'developer') {
    showlink.value = true
  }
} catch (error) {}
</script>

<template>
  <ElLink
    :href="link"
    target="_blank"
    :underline="false"
    v-if="link && showlink"
    style="margin-right: 10px"
  >
    帮助和API文档
  </ElLink>
</template>
