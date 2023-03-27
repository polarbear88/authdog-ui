<script setup lang="ts">
import { deleteRecgargeType, getList } from '@/api/rechargeCardType'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { TableColumn } from '@/types/table'
import { ElButton, ElEmpty, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { PropType, ref } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { CreateRechargeType } from '.'
import { DateUtils } from '@/utils/dateUtils'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const emit = defineEmits(['set-tab-click-callback'])
let isFirstLoad = false

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'time',
    label: '时间'
  },
  {
    field: 'money',
    label: '次数'
  },
  {
    field: 'price',
    label: '价格'
  },
  {
    field: 'salerPrice',
    label: '代理价格'
  },
  {
    field: 'isNeedPassword',
    label: '需要密码'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)

const showCreate = ref(false)

const showUpdate = ref(false)

const currentUpdateData = ref({})

let tableDataList = ref([])

const getTableList = () => {
  getList(props.app.id)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
    .then((res) => {
      if (res) {
        tableDataList.value = res.data
      }
    })
}

const showUpdateDialog = (data: any) => {
  currentUpdateData.value = data
  showUpdate.value = true
}

emit('set-tab-click-callback', 'rechargeCardType', () => {
  if (!isFirstLoad) {
    isFirstLoad = true
    getTableList()
  }
})

const onDelete = (data: any) => {
  ElMessageBox.confirm('确定要删除该类型，注意：删除不会影响已生产的充值卡?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteRecgargeType(props.app.id, data.id).then(() => {
      getTableList()
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
    })
  })
}
</script>
<template>
  <div>
    <div>
      <ElButton @click="showCreate = true" type="primary" :icon="CirclePlus">创建类型</ElButton>
    </div>
    <ContentWrap style="margin-top: 10px">
      <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
        <template #empty>
          <ElEmpty description="快去创建类型吧" />
        </template>
        <template #time="data">
          {{ DateUtils.convertMinutesToFormattedTime(data.row.time) }}
        </template>
        <template #isNeedPassword="data">
          <ElSwitch :before-change="() => false" v-model="data.row.isNeedPassword" />
        </template>
        <template #action="data">
          <ElButton size="small" @click="showUpdateDialog(data.row)">编辑</ElButton>
          <ElButton size="small" @click="onDelete(data.row)" type="danger">删除</ElButton>
        </template>
      </Table>
    </ContentWrap>
    <div>
      <Dialog
        :fullscreen="false"
        style="width: 680px; max-width: 80%"
        v-model="showCreate"
        title="创建充值卡类型"
      >
        <CreateRechargeType
          :app="props.app"
          @closedialog="showCreate = false"
          @success="getTableList"
        />
      </Dialog>
      <Dialog
        :fullscreen="false"
        style="width: 680px; max-width: 80%"
        v-model="showUpdate"
        title="修改充值卡类型"
      >
        <CreateRechargeType
          :is-update="true"
          :data="currentUpdateData"
          :app="props.app"
          @closedialog="showUpdate = false"
          @success="getTableList"
        />
      </Dialog>
    </div>
  </div>
</template>
