<script setup lang="ts">
import { TableColumn } from '@/types/table'
import { ref } from 'vue'
import { getList, deleteCloudfun } from '@/api/clouddata/cloudfun'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ElButton, ElEmpty, ElInput, ElMessage, ElMessageBox, ElTooltip } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { CreateCloudfun, UpdateCloudfun } from './components'
import { Search } from '@element-plus/icons-vue'
import { ApplicationSelect } from '@/components/ApplicationSelect'

const columns: TableColumn[] = [
  {
    field: 'id',
    label: 'ID'
  },
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'description',
    label: '描述'
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
const showCreate = ref(false)
let tableDataList = ref<any[]>([])

const currentCloudfun = ref({})

const getTableList = async (appid?: number) => {
  const res = await getList(
    searchWord.value,
    appid === undefined ? selectAppid.value + '' : appid + ''
  )
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data
  }
}

const searchWord = ref('')
const selectAppid = ref(0)
const showUpdateCloudfun = ref(false)
getTableList()

const onchange = (val: number) => {
  getTableList(val)
}
const onUpdateCloudfun = (data: any) => {
  currentCloudfun.value = data
  showUpdateCloudfun.value = true
}

const onDelete = async (data: any) => {
  ElMessageBox.confirm('确定删除函数?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const res = await deleteCloudfun(data.id)
      if (res) {
        ElMessage.success('删除成功')
        getTableList()
      }
    })
    .catch(() => {})
}
</script>
<template>
  <div>
    <div>
      <ElButton @click="showCreate = true" type="primary" :icon="CirclePlus">添加函数</ElButton>
      <ElInput
        style="width: 200px; margin-left: 10px"
        v-model="searchWord"
        placeholder="输入关键词回车来搜索"
        @keyup.enter="getTableList()"
      />
      <ApplicationSelect
        v-model="selectAppid"
        :zeroname="'全局'"
        style="margin-left: 10px; display: inline-block"
        @change="onchange"
      />
      <ElButton @click="getTableList()" style="margin-left: 10px" type="primary" :icon="Search" />
    </div>
    <div>
      <ContentWrap style="margin-top: 10px">
        <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
          <template #empty>
            <ElEmpty description="快去添加云函数吧" />
          </template>
          <template #ascription="data">
            {{ data.row.isGlobal ? '全局' : data.row.applicationName }}
          </template>
          <template #action="data">
            <ElButton size="small" @click="onUpdateCloudfun(data.row)">编辑</ElButton>
            <ElButton size="small" @click="onDelete(data.row)" type="danger">删除</ElButton>
          </template>
          <template #ascription-header>
            <ElTooltip
              content="若不是全局模式则只有目标应用可以运行该函数"
              placement="top-start"
              raw-content
            >
              <span>归属<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
            </ElTooltip>
          </template>
        </Table>
      </ContentWrap>
    </div>
    <div>
      <Dialog fullscreen v-model="showCreate" title="添加函数">
        <CreateCloudfun
          @success="searchWord == '' && getTableList()"
          @closedialog="showCreate = false"
        />
      </Dialog>
    </div>
    <div>
      <Dialog fullscreen v-model="showUpdateCloudfun" title="修改函数">
        <UpdateCloudfun
          :cloudfun="currentCloudfun"
          @success="getTableList()"
          @closedialog="showUpdateCloudfun = false"
        />
      </Dialog>
    </div>
  </div>
</template>
