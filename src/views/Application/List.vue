<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ref } from 'vue'
import { ElButton, ElTag } from 'element-plus'
import { TableColumn, TableSlotDefault } from '@/types/table'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { getList } from '@/api/application'
import { useRouter } from 'vue-router'

const columns: TableColumn[] = [
  {
    field: 'id',
    label: '应用ID'
  },
  {
    field: 'name',
    label: '应用名称'
  },
  {
    field: 'version',
    label: '版本'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'cryptoMode',
    label: '加密模式'
  },
  {
    field: 'authMode',
    label: '授权模式'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)

let tableDataList = ref<ApplicationInfo[]>([])

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

const router = useRouter()

const toDetail = (id: number) => {
  router.push({
    name: 'Application-Detail',
    params: {
      id
    }
  })
}

const actionFn = (data: TableSlotDefault) => {
  toDetail(data.row.id)
}
</script>

<template>
  <ContentWrap>
    <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
      <template #authMode="data">
        {{ data.row.authMode === 'user' ? '用户模式' : '设备ID模式' }}
      </template>
      <template #cryptoMode="data">
        {{ data.row.cryptoMode === 'none' ? '无' : data.row.cryptoMode.toUpperCase() }}
      </template>
      <template #status="data">
        <ElTag v-if="data.row.status === 'published'" type="success">正常</ElTag>
        <ElTag v-if="data.row.status === 'disabled'" type="danger">禁用</ElTag>
      </template>
      <template #action="data">
        <ElButton link type="primary" @click="actionFn(data as TableSlotDefault)">管理</ElButton>
      </template>
    </Table>
  </ContentWrap>
</template>
