<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ElButton, ElMessage, ElMessageBox, ElText } from 'element-plus'
import { PropType } from 'vue'
import { setCustomCryptFunId } from '@/api/application'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const onSetFunid = () => {
  ElMessageBox.confirm('请输入云函数ID，输入0为清除', '设置自定义加密云函数ID', {
    inputType: 'number',
    inputPlaceholder: '请输入云函数ID',
    showInput: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    if (value) {
      setCustomCryptFunId(props.app.id + '', +value).then(() => {
        getAppData()
        ElMessage.success('设置成功')
      })
    }
  })
}
</script>

<template>
  <div>
    <h1 style="font-size: xx-large">自定义加密</h1>
    <ElText class="mx-1"
      >此功能允许你在原通讯加密的基础之外再进行一次自定义的加密，您可以指定一个云函数作为自定义加密处理函数</ElText
    >
    <br />
    <ElText class="mx-1">该函数将得到两个参数：</ElText>
    <br />
    <ElText class="mx-1"
      >1、类型，值为 'en' 或 'de' ，若'en'则需要返回加密后的文本结果，若'de'则需要返回解密后的结果
    </ElText>
    <br />
    <ElText class="mx-1">2、数据字符串</ElText>
    <br />
    <br />
    <h2>当前设置的云函数ID：{{ props.app.customCryptFunId || '未设置' }}</h2>
    <div style="width: 100%; height: 15px"></div>
    <ElButton type="primary" @click="onSetFunid">设置云函数ID</ElButton>
  </div>
</template>
