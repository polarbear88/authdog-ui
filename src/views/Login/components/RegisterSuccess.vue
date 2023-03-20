<script setup lang="ts">
import { ElButton, ElResult } from 'element-plus'
const emit = defineEmits(['to-login'])
const toLogin = () => {
  emit('to-login')
}
</script>

<template>
  <ElResult icon="success" title="恭喜🎉注册成功" sub-title="去登录体验强大的网络验证系统吧">
    <template #extra>
      <el-button @click="toLogin" type="primary">去登录</el-button>
    </template>
  </ElResult>
</template>
