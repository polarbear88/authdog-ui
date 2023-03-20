<script setup lang="ts">
import { CloudvarInfo } from '@/api/types/CloudvarInfo'
import { TableColumn } from '@/types/table'
import { ref } from 'vue'
import { getList } from '@/api/clouddata/cloudvar'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ElButton, ElEmpty } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { CreateCloudvar } from './components'

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'desc',
    label: '描述'
  },
  {
    field: 'value',
    label: '值'
  },
  {
    field: 'isPublic',
    label: '公开'
  },
  {
    field: 'ascription',
    label: '归属'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)
const showCreateApp = ref(false)
let tableDataList = ref<CloudvarInfo[]>([])

const getTableList = async () => {
  const res = await getList()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data
  }
}
getTableList()
</script>
<template>
  <div>
    <div>
      <ElButton @click="showCreateApp = true" type="primary" :icon="CirclePlus">添加变量</ElButton>
    </div>
    <div>
      <ContentWrap style="margin-top: 10px">
        <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
          <template #empty>
            <ElEmpty description="快去添加云变量吧" />
          </template>
          <template #action>
            <ElButton link type="primary">管理</ElButton>
          </template>
        </Table>
      </ContentWrap>
    </div>
    <div>
      <Dialog
        :fullscreen="false"
        style="width: 680px; max-width: 80%"
        v-model="showCreateApp"
        title="添加变量"
      >
        <CreateCloudvar @success="getTableList" @closedialog="showCreateApp = false" />
      </Dialog>
    </div>
  </div>
</template>
