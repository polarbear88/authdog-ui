<script setup lang="ts">
import { TableColumn } from '@/types/table'
import { ref } from 'vue'
import { getList, deleteCloudfun, runCloudfun } from '@/api/clouddata/cloudfun'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import {
  ElAlert,
  ElButton,
  ElEmpty,
  ElInput,
  ElMessage,
  ElMessageBox,
  ElTooltip
} from 'element-plus'
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
    field: 'type',
    label: '类型'
  },
  // {
  //   field: 'description',
  //   label: '描述'
  // },
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

let currentFun
let argsInput = ref<string[]>([])

const showRunCloudfun = ref(false)

const onRunCloudfun = async (data: any) => {
  argsInput.value = []
  currentFun = data
  showRunCloudfun.value = true
}

const onAddParam = () => {
  argsInput.value.push('')
}

const onSubParam = () => {
  argsInput.value.pop()
}

const run = async () => {
  runCloudfun(currentFun.id, argsInput.value)
    .then((res) => {
      ElMessageBox.alert(res.data.result + '', '运行结果', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      })
    })
    .catch((error) => {
      ElMessageBox.alert(error.message, '发生错误', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      })
    })
}

const getTypeName = (type: string) => {
  switch (type) {
    case 'VM-JS':
      return '虚拟机JS'
    case 'NODE-JS':
      return 'NodeJS'
    case 'NATIVE-LIB':
      return '本机库'
    default:
      return '未知'
  }
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
    <ElAlert style="margin-top: 8px"
      >云函数允许您将一些不希望放在客户端的功能放到云上来执行并且可以在函数中扣减用户点数</ElAlert
    >
    <div>
      <ContentWrap style="margin-top: 10px">
        <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
          <template #empty>
            <ElEmpty description="快去添加云函数吧" />
          </template>
          <template #type="data">
            {{ getTypeName(data.row.type) }}
          </template>
          <template #ascription="data">
            {{ data.row.isGlobal ? '全局' : data.row.applicationName }}
          </template>
          <template #action="data">
            <ElButton type="primary" size="small" @click="onRunCloudfun(data.row)">运行</ElButton>
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
      <Dialog v-model="showRunCloudfun" title="测试运行">
        <h2 style="color: #f56c6c"
          >注意：测试运行脚本$getUser将返回空对象，$reduceUserBalance不会执行任何操作</h2
        >
        <ElInput
          style="margin-top: 10px"
          v-for="(_item, index) in argsInput"
          :key="index"
          v-model="argsInput[index]"
        >
          <template #prepend>参数{{ index + 1 }}</template>
        </ElInput>
        <div style="margin-top: 10px">
          <ElButton @click="onAddParam">增加参数</ElButton>
          <ElButton @click="onSubParam">减少参数</ElButton>
          <ElButton type="primary" @click="run">运行</ElButton>
        </div>
      </Dialog>
    </div>
  </div>
</template>
