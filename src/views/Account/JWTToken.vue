<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElInput, ElMessageBox, ElText } from 'element-plus'
import { signJwtToken, validateUserToken } from '@/api/profile'
import { ref } from 'vue'

const token = ref('')

const appid = ref('')
const usertoken = ref('')

const handleSignJwt = () => {
  signJwtToken().then((res) => {
    token.value = res.data.access_token
  })
}

const handleCheckToken = () => {
  validateUserToken(parseInt(appid.value), usertoken.value).then((res) => {
    ElMessageBox.alert(JSON.stringify(res.data), '校验结果')
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
      <br />
      <br />
      <h2>校验用户token功能</h2>
      <ElInput style="margin-top: 10px" v-model="appid" placeholder="请输入appid" />
      <ElInput style="margin-top: 10px" v-model="usertoken" placeholder="请输入token" />
      <ElButton style="margin-top: 20px" @click="handleCheckToken" type="primary">校验</ElButton>
    </ContentWrap>
  </div>
</template>
