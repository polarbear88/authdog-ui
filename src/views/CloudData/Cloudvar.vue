<script setup lang="ts">
import { CloudvarInfo } from '@/api/types/CloudvarInfo'
import { TableColumn } from '@/types/table'
import { ref } from 'vue'
import { getList } from '@/api/clouddata/cloudvar'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ElButton, ElEmpty, ElInput, ElMessage, ElSwitch, ElTooltip } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { CreateCloudvar, UpdateCloudvar } from './components'
import useClipboard from 'vue-clipboard3'
import { Search } from '@element-plus/icons-vue'
import { ApplicationSelect } from '@/components/ApplicationSelect'

const { toClipboard } = useClipboard()

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

const currentCloudvar = ref({})

const copyInfo = async (str: string) => {
  try {
    await toClipboard(str)
    ElMessage.success('复制成功')
  } catch (e) {
    ElMessage.error('复制失败')
  }
}

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
const showUpdateCloudvar = ref(false)
getTableList()

const onchange = (val: number) => {
  getTableList(val)
}
const onUpdateCloudvar = (data: any) => {
  currentCloudvar.value = data
  showUpdateCloudvar.value = true
}
</script>
<template>
  <div>
    <div>
      <ElButton @click="showCreateApp = true" type="primary" :icon="CirclePlus">添加变量</ElButton>
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
            <ElEmpty description="快去添加云变量吧" />
          </template>
          <template #value="data">
            <ElButton @click="copyInfo(data.row.value)" type="primary" link
              ><Icon icon="ph:copy-simple" /></ElButton
            >{{ data.row.value }}
          </template>
          <template #isPublic="data">
            <ElSwitch :before-change="() => false" v-model="data.row.isPublic" />
          </template>
          <template #ascription="data">
            {{ data.row.isGlobal ? '全局' : data.row.applicationName }}
          </template>
          <template #action="data">
            <ElButton @click="onUpdateCloudvar(data.row)" size="small" type="primary"
              >修改</ElButton
            >
          </template>
          <template #ascription-header>
            <ElTooltip
              content="若不是全局模式则只有目标应用可以获取到该变量"
              placement="top-start"
              raw-content
            >
              <span>归属<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
            </ElTooltip>
          </template>
          <template #isPublic-header>
            <ElTooltip
              content="如果不公开那么只有用户授权成功才能获取到该变量"
              placement="top-start"
              raw-content
            >
              <span>公开<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
            </ElTooltip>
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
        <CreateCloudvar
          @success="searchWord == '' && getTableList()"
          @closedialog="showCreateApp = false"
        />
      </Dialog>
    </div>
    <div>
      <Dialog
        :fullscreen="false"
        style="width: 680px; max-width: 80%"
        v-model="showUpdateCloudvar"
        title="修改变量"
      >
        <UpdateCloudvar
          :cloudvar="currentCloudvar"
          @success="getTableList()"
          @closedialog="showUpdateCloudvar = false"
        />
      </Dialog>
    </div>
  </div>
</template>
