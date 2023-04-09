<script setup lang="ts">
import { ElLink } from 'element-plus'

const link = import.meta.env.VITE_HELP_URL
</script>

<template>
  <ElLink :href="link" target="_blank" :underline="false" v-if="link" style="margin-right: 10px">
    帮助和API文档
  </ElLink>
</template>
