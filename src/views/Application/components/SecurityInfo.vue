<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ElButton, ElText, ElDialog, ElSelect, ElOption } from 'element-plus'
import { PropType, ref } from 'vue'
import { resetCryptoMode } from '@/api/application'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const getCryptMode = () => {
  switch (props.app.cryptoMode) {
    case 'none':
      return '无加密「不安全」'
    case 'aes':
      return 'AES加密「弱安全」'
    case 'rsa':
      return 'RSA加密「高安全」'
    case 'ecdh':
      return 'ECDH加密「极高安全」'
    case 'samenc':
      return '__samenc_test'
    default:
      return ''
  }
}

const showSelectCryptoMode = ref(false)
const selectCryptoMode = ref(props.app.cryptoMode)

const onResetCryptoMode = () => {
  showSelectCryptoMode.value = true
  selectCryptoMode.value = props.app.cryptoMode
}

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const onConfirmResetCryptoMode = () => {
  showSelectCryptoMode.value = false
  resetCryptoMode(props.app.id + '', selectCryptoMode.value).then(() => {
    getAppData()
  })
}
</script>
<template>
  <div>
    <h1 style="font-size: xx-large">通讯加密</h1>
    <ElText class="mx-1">保护您的软件数据通信免受中间人劫持和防破解</ElText>
    <div style="margin-top: 10px; padding: 15px">
      <h2>加密模式</h2>
      <ElText class="content">{{ getCryptMode() }}</ElText>
      <div v-if="['aes', 'rsa', 'ecdh'].includes(app.cryptoMode)" style="margin-top: 15px">
        <h2>{{
          (app.cryptoMode === 'aes' ? '加密密钥' : '加密私钥') +
          (app.cryptoMode === 'ecdh' ? '「HEX」' : '') +
          (app.cryptoMode === 'aes' ? '「字符串」' : '')
        }}</h2>
        <ElText class="content">
          {{ app.cryptoSecret }}<br />
          <span v-if="app.cryptoMode === 'aes'" style="color: #f56c6c"
            >AES加密模式 aes-256-cbc iv 0000000000000000「字符串」autoPadding PKCS7
            详见API文档</span
          >
          <span v-if="app.cryptoMode === 'ecdh'" style="color: #f56c6c"
            >EC曲线：secp521r1 协商密钥后使用aes-256-cbc iv 0000000000000000「字符串」autoPadding
            PKCS7加密 详见API文档</span
          >
          <span v-if="app.cryptoMode === 'rsa'" style="color: #f56c6c"
            >RSA模式 rsa-2048 RSA_PKCS1_PADDING 详见API文档</span
          >
        </ElText>
      </div>
      <div v-if="['rsa', 'ecdh'].includes(app.cryptoMode)" style="margin-top: 15px">
        <h2>加密公钥{{ app.cryptoMode === 'ecdh' ? '「HEX」' : '' }}</h2>
        <ElText class="content">{{ app.cryptoPublicKey }}</ElText>
      </div>
      <div style="width: 100%; height: 15px"></div>
      <ElButton type="primary" @click="onResetCryptoMode">重置加密模式「可重置密钥」</ElButton>
    </div>
    <ElDialog
      width="500px"
      style="max-width: 90%"
      v-model="showSelectCryptoMode"
      title="选择加密模式"
    >
      <div>
        <h2 style="color: #f56c6c"
          >注意：重置之后可能造成该软件请求失败，需要客户端重新修改加密代码</h2
        >
        <ElSelect
          style="margin-top: 15px; width: 100%"
          v-model="selectCryptoMode"
          placeholder="Select"
        >
          <ElOption label="无加密「不安全」" value="none" />
          <ElOption label="AES加密「弱安全」" value="aes" />
          <ElOption label="RSA加密「高安全」" value="rsa" />
          <ElOption label="ECDH加密「极高安全」" value="ecdh" />
          <ElOption label="__samenc_test" value="samenc" />
        </ElSelect>
        <div style="width: 100%; height: 40px"></div>
        <div style="right: 20px; bottom: 10px; position: absolute">
          <ElButton @click="showSelectCryptoMode = false">取消</ElButton>
          <ElButton type="primary" @click="onConfirmResetCryptoMode"> 确认 </ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>

<style scoped>
.content {
  margin-top: 16px;
  white-space: pre-wrap;
}
</style>
