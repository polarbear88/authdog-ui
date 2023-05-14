<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import { ElSwitch, ElMessageBox } from 'element-plus'
import { setOnlineUserManagerStatus } from '@/api/application'
import { useI18n } from '@/hooks/web/useI18n'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} }
})
const { t } = useI18n()
const schema = reactive([
  {
    field: 'enableOnlineUserMgr',
    label: '启用状态'
  },
  {
    field: ''
  }
])

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const onSetStatus = () => {
  // eslint-disable-next-line vue/no-mutating-props
  props.app.enableOnlineUserMgr = !props.app.enableOnlineUserMgr
  const msg = props.app.enableOnlineUserMgr
    ? '关闭后该应用将不具有在线用户管理器功能'
    : '开启后该应用将具有在线用户管理器功能，但是当前在线用户会被强制下线，并且用户在超过4-5分钟左右没有心跳后会失去登录状态'
  ElMessageBox.confirm(msg, '确认操作', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(() => {
      setOnlineUserManagerStatus(props.app.id + '', !props.app.enableOnlineUserMgr)
        .then(() => {
          getAppData()
        })
        .catch(() => {})
    })
    .catch(() => {})
}
</script>

<template>
  <div
    ><Descriptions :collapse="false" title="在线用户管理器" :data="app" :schema="schema">
      <template #enableOnlineUserMgr="data">
        <ElSwitch @change="onSetStatus" v-model="data.row.enableOnlineUserMgr" />
      </template>
    </Descriptions>
  </div>
</template>
