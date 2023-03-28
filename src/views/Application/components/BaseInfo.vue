<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import { DateUtils } from '@/utils/dateUtils'
import { ElButton, ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { setDisable, setEnable, setNotice } from '@/api/application'
import { useI18n } from '@/hooks/web/useI18n'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} },
  notUpdate: { type: Boolean, default: false }
})

const { t } = useI18n()
const schema = reactive([
  {
    field: 'name',
    label: '应用名称'
  },
  {
    field: 'id',
    label: '应用ID'
  },
  {
    field: 'createdAt',
    label: '创建时间'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'nitice',
    label: '应用公告',
    span: 3
  }
])

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const disableApp = () => {
  ElMessageBox.confirm('您将禁用应用 ' + props.app.name + ' 是否确认？', t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      setDisable(props.app.id + '').then(() => {
        getAppData()
      })
    })
    .catch(() => {})
}

const enableApp = () => {
  ElMessageBox.confirm('您将启用应用 ' + props.app.name + ' 是否确认？', t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(async () => {
      setEnable(props.app.id + '').then(() => {
        getAppData()
      })
    })
    .catch(() => {})
}

const setNoticeApp = () => {
  ElMessageBox.confirm('', '请输入内容：', {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    showInput: true
  })
    .then(async (res) => {
      if (res.value) {
        setNotice(props.app.id + '', res.value).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
  //   setNotice(props.app.id + '', notice).then(() => {
  //     getAppData()
  //   })
}
</script>

<template>
  <div
    ><Descriptions :collapse="false" title="基本信息" :data="app" :schema="schema">
      <template #createdAt="data">
        {{ DateUtils.formatDateTime(new Date(data.row.createdAt)) }}
      </template>
      <template #status="data">
        <ElTag v-if="data.row.status === 'published'" type="success">正常</ElTag>
        <ElTag v-if="data.row.status === 'disabled'" type="danger">禁用</ElTag>
        <ElButton
          style="margin-left: 8px"
          v-if="data.row.status === 'published' && !notUpdate"
          type="warning"
          @click="disableApp"
          link
          >禁用</ElButton
        >
        <ElButton
          style="margin-left: 8px"
          v-if="data.row.status === 'disabled' && !notUpdate"
          type="success"
          link
          @click="enableApp"
          >启用</ElButton
        >
      </template>
      <template #nitice="data">
        <span v-if="!data.row.notice">未设置</span>
        <span>{{ data.row.notice }}</span>
        <ElButton v-if="!notUpdate" @click="setNoticeApp" type="primary" link
          ><Icon icon="mdi:circle-edit-outline"
        /></ElButton>
      </template>
    </Descriptions>
  </div>
</template>
