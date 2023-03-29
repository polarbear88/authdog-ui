<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import { getList, getCount, setStatus } from '@/api/feedback'
import {
  ElButton,
  ElCol,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElMessage,
  ElPagination,
  ElRow,
  ElTag
} from 'element-plus'
import { TableColumn } from '@/types/table'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { DateUtils } from '@/utils/dateUtils'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { StringUtils } from '@/utils/stringUtils'
import { ArrowDown } from '@element-plus/icons-vue'
import { useTable } from '@/hooks/web/useTable'
import { Descriptions } from '@/components/Descriptions'

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'appName',
    label: '应用'
  },
  {
    field: 'appVersion',
    label: '版本'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'userName',
    label: '用户'
  },
  {
    field: 'deviceName',
    label: '设备名称'
  },
  {
    field: 'osType',
    label: '系统'
  },
  {
    field: 'createdAt',
    label: '提交时间'
  },
  {
    field: 'content',
    label: '内容'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)

let tableDataList = ref<any[]>([])

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

const currentActionIds = ref<Array<number>>([])

const batchAction = ref(false)

const statCount = reactive({
  pending: 0,
  resolved: 0,
  rejected: 0
})

const getTableList = async () => {
  loading.value = true
  const { getFormData } = methods
  const formData = await getFormData()
  const data = StringUtils.deleteObjectEmptyProperty(formData)
  if (data.appid === 0) {
    delete data.appid
  }
  data.page = currentPage.value
  data.pageSize = pageSize.value
  getList(data)
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
    .then((res) => {
      if (res) {
        tableDataList.value = res.data.list
        total.value = res.data.total
      }
    })
}

onMounted(() => {
  getTableList()
  getCount()
    .catch(() => {})
    .then((res) => {
      if (res) {
        statCount.pending = res.data.pending
        statCount.resolved = res.data.resolved
        statCount.rejected = res.data.rejected
      }
    })
})

const schema = reactive<FormSchema[]>([
  {
    field: 'appid',
    label: '应用',
    component: 'ApplicationSelect',
    value: 0,
    componentProps: {
      zeroname: '全局'
    }
  },
  {
    field: 'appVersion',
    label: '版本',
    component: 'Input',
    componentProps: {
      placeholder: '版本'
    }
  },
  {
    field: 'userName',
    label: '用户',
    component: 'Input',
    componentProps: {
      placeholder: '用户'
    }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '不筛选',
      options: [
        {
          label: '未处理',
          value: 'pending'
        },
        {
          label: '已处理',
          value: 'resolved'
        },
        {
          label: '已拒绝',
          value: 'rejected'
        }
      ]
    }
  },
  {
    field: 'submit'
  }
])

const currentItem = ref<any>(null)

const { register, methods, elFormRef } = useForm()

const handleQuery = () => {
  currentPage.value = 1
  getTableList()
}

const resetForm = () => {
  unref(elFormRef)?.resetFields()
  handleQuery()
}

const onSetStatus = (status: string, ids: Array<number>) => {
  setStatus(ids, status).then(() => {
    ElMessage.success('操作成功')
    getTableList()
    getCount()
      .catch(() => {})
      .then((res) => {
        if (res) {
          statCount.pending = res.data.pending
          statCount.resolved = res.data.resolved
          statCount.rejected = res.data.rejected
        }
      })
  })
}

const onAction = async (feedback: any, item: string, isBatch = false) => {
  currentItem.value = feedback
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择项目')
      return
    }
  }
  if (item === 'resolved') {
    onSetStatus('resolved', isBatch ? currentActionIds.value : [feedback.id])
  }
  if (item === 'rejected') {
    onSetStatus('rejected', isBatch ? currentActionIds.value : [feedback.id])
  }
}

const schemaDesc = reactive([
  {
    field: 'appName',
    label: '应用'
  },
  {
    field: 'createdAt',
    label: '提交时间'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'brand',
    label: '设备品牌'
  },
  {
    field: 'model',
    label: '设备型号'
  },
  {
    field: 'osType',
    label: '系统类型'
  },
  {
    field: 'appVersion',
    label: '版本'
  },
  {
    field: 'userName',
    label: '用户'
  },
  {
    field: 'deviceId',
    label: '设备ID'
  },
  {
    field: 'content',
    label: '内容'
  }
])
</script>

<template>
  <div>
    <div>
      <ContentWrap>
        <div>
          <ElRow>
            <ElCol :span="8" style="text-align: center">{{ statCount.pending }}个未处理</ElCol>
            <ElCol :span="8" style="text-align: center">{{ statCount.resolved }}个已处理</ElCol>
            <ElCol :span="8" style="text-align: center">{{ statCount.rejected }}个已拒绝</ElCol>
          </ElRow>
        </div>
      </ContentWrap>
      <ContentWrap style="margin-top: 10px">
        <div>
          <Form
            :isCol="false"
            :inline="true"
            labelWidth="40px"
            :schema="schema"
            label-position="left"
            hide-required-asterisk
            @register="register"
          >
            <template #submit>
              <div>
                <ElButton type="primary" style="width: 120px" @click="handleQuery()">
                  查询
                </ElButton>
                <ElButton style="width: 120px; margin-left: 20px" @click="resetForm">
                  重置
                </ElButton>
              </div>
            </template>
          </Form>
        </div>
        <ContentWrap>
          <ElDropdown trigger="click" @command="(item) => onAction(null, item, true)">
            <span style="font-size: small" class="el-dropdown-link">
              批量操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
            </span>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="resolved">已处理</ElDropdownItem>
                <ElDropdownItem command="rejected">拒绝</ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>

          <Table
            @register="rTable.register"
            style="margin-top: 8px"
            :columns="columns"
            :data="tableDataList"
            :loading="loading"
            reserveSelection
            row-key="id"
            expand
          >
            <template #empty>
              <ElEmpty description="暂时没有用户反馈哦" />
            </template>
            <template #deviceName="data">
              {{ data.row.brand || '' + '-' + data.row.model || '' }}
            </template>
            <template #status="row">
              <ElTag type="info" v-if="row.row.status === 'rejected'">已拒绝</ElTag>
              <ElTag type="success" v-if="row.row.status === 'resolved'">已处理</ElTag>
              <ElTag v-if="row.row.status === 'pending'">未处理</ElTag>
            </template>
            <template #createdAt="data">
              {{ DateUtils.formatDateTime(data.row.createdAt) }}
            </template>
            <template #action="data">
              <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
                <span class="el-dropdown-link">
                  操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="resolved">已处理</ElDropdownItem>
                    <ElDropdownItem command="rejected">拒绝</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
            <template #expand="data">
              <Descriptions
                :collapse="false"
                :title="'详细信息'"
                :data="data.row"
                :schema="schemaDesc"
              >
                <template #createdAt="row">
                  {{ DateUtils.formatDateTime(row.row.createdAt) }}
                </template>
                <template #status="row">
                  <ElTag type="info" v-if="row.row.status === 'rejected'">已拒绝</ElTag>
                  <ElTag type="success" v-if="row.row.status === 'resolved'">已处理</ElTag>
                  <ElTag v-if="row.row.status === 'pending'">未处理</ElTag>
                </template>
              </Descriptions></template
            >
          </Table>
          <ElPagination
            style="margin-top: 30px"
            background
            layout="sizes, prev, pager, next, total, jumper"
            v-model:total="total"
            v-model:pageSize="pageSize"
            v-model:currentPage="currentPage"
            @size-change="getTableList"
            @current-change="getTableList"
          />
        </ContentWrap>
      </ContentWrap>
    </div>
  </div>
</template>
<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  align-items: center;
  margin-top: 3.482px;
}
</style>
