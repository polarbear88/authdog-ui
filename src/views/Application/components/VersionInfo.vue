<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import { ElSwitch, ElButton, ElMessageBox, ElMessage } from 'element-plus'
import {
  setDisableForceUpgrade,
  setEnableForceUpgrade,
  setDownloadUrl,
  setVersion
} from '@/api/application'
import { useI18n } from '@/hooks/web/useI18n'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} },
  notUpdate: { type: Boolean, default: false }
})
const { t } = useI18n()
const schema = reactive([
  {
    field: 'version',
    label: '版本号'
  },
  {
    field: 'forceUpgrade',
    label: '强制升级'
  },
  {
    field: 'downloadUrl',
    label: '下载地址',
    span: 3
  }
])

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const onSetEnableForceUpgrade = () => {
  if (!props.app.forceUpgrade) {
    setDisableForceUpgrade(props.app.id + '')
      .then(() => {
        getAppData()
      })
      .catch(() => {
        // eslint-disable-next-line vue/no-mutating-props
        props.app.forceUpgrade = !props.app.forceUpgrade
      })
  } else {
    setEnableForceUpgrade(props.app.id + '')
      .then(() => {
        getAppData()
      })
      .catch(() => {
        // eslint-disable-next-line vue/no-mutating-props
        props.app.forceUpgrade = !props.app.forceUpgrade
      })
  }
}

const onSetDownloadUrl = () => {
  ElMessageBox.confirm('', '请输入内容：', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showInput: true
  })
    .then(async (res) => {
      if (res.value) {
        setDownloadUrl(props.app.id + '', res.value).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onSetVersion = () => {
  ElMessageBox.confirm('', '请输入新的版本号：', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showInput: true
  })
    .then(async (res) => {
      if (res.value) {
        setVersion(props.app.id + '', res.value).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}
</script>

<template>
  <div
    ><Descriptions :collapse="false" title="版本信息" :data="app" :schema="schema">
      <template #forceUpgrade="data">
        <ElSwitch
          :before-change="() => !notUpdate"
          @change="onSetEnableForceUpgrade"
          v-model="data.row.forceUpgrade"
        />
      </template>
      <template #downloadUrl="data">
        {{ data.row.downloadUrl ? data.row.downloadUrl : '未设置' }}
        <ElButton v-if="!notUpdate" @click="onSetDownloadUrl" type="primary" link
          ><Icon icon="mdi:circle-edit-outline"
        /></ElButton>
      </template>
      <template #version="data">
        {{ data.row.version }}
        <ElButton v-if="!notUpdate" @click="onSetVersion" type="primary" link
          ><Icon icon="mdi:circle-edit-outline"
        /></ElButton>
      </template>
    </Descriptions>
  </div>
</template>
