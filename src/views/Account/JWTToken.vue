<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElText } from 'element-plus'
import { signJwtToken } from '@/api/profile'
import { ref } from 'vue'

const token = ref('')

const handleSignJwt = () => {
  signJwtToken().then((res) => {
    token.value = res.data.access_token
  })
}
</script>

<template>
  <div>
    <ContentWrap title="jwt token">
      <ElText
        >在此您可以签发一个长效的jwt
        token用于访问全部的开发者后台功能，具体接口直接浏览器调试工具中查看功能页面的请求</ElText
      >
      <br />
      <ElButton style="margin-top: 20px" @click="handleSignJwt" type="primary">签发Token</ElButton>
      <br />
      <br />
      <ElText style="margin-top: 20px; width: 90%">{{ token }}</ElText>
    </ContentWrap>
  </div>
</template>
