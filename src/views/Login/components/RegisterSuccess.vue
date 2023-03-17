<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton } from 'element-plus'
const { t } = useI18n()
const emit = defineEmits(['to-login'])
const toLogin = () => {
  emit('to-login')
}
</script>

<template>
  <div
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    style="text-align: center; padding: 80px"
  >
    <Icon color="#19be6b" :size="100" icon="carbon:checkmark-filled" />
    <h2 class="text-2xl text-center w-[100%]" style="margin-top: 10px">恭喜🎉 注册成功！</h2>
    <div class="w-[100%] mt-15px" style="margin-top: 40px">
      <ElButton type="primary" class="w-[100%]" @click="toLogin">
        {{ t('login.gobacklogin') }}
      </ElButton>
    </div>
  </div>
</template>
