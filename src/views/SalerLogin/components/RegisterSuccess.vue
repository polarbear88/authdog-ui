<script setup lang="ts">
import { ElButton, ElResult } from 'element-plus'
const emit = defineEmits(['to-login'])
const toLogin = () => {
  emit('to-login')
}
</script>

<template>
  <ElResult icon="success" title="恭喜🎉注册成功" sub-title="登录立即开始销售充值卡">
    <template #extra>
      <el-button @click="toLogin" type="primary">去登录</el-button>
    </template>
  </ElResult>
</template>
