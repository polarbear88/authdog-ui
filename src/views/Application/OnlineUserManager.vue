<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import {
  ElAlert,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElPagination,
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
import { getOnlineUserList } from '@/api/onlineUserManager'
import { kickOnlineUser } from '@/api/onlineUserManager'

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'appName',
    label: '应用'
  },
  {
    field: 'userName',
    label: '用户'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'deviceId',
    label: '设备'
  },
  {
    field: 'lastOnlineTime',
    label: '最后在线时间'
  },
  {
    field: 'userName',
    label: '用户'
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
  getOnlineUserList(data)
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
    field: 'userName',
    label: '用户',
    component: 'Input',
    componentProps: {
      placeholder: '用户'
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

const onAction = async (onlineuser: any, item: string, isBatch = false) => {
  currentItem.value = onlineuser
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择项目')
      return
    }
  }
  if (item === 'kick') {
    ElMessageBox.confirm('确定要踢下线?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      kickOnlineUser(isBatch ? currentActionIds.value : [onlineuser.id]).then(() => {
        ElMessage.success('已踢下线')
        getTableList()
      })
    })
  }
}
</script>

<template>
  <div>
    <ElAlert
      >同一个用户在多个设备登录会产生多条在线记录；列表中可能会有下线状态的是因为查询出来的结果为近几分钟活跃过的，而不是根据在线作为查询结果的</ElAlert
    >
    <div>
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
                <ElDropdownItem style="color: #f56c6c" command="kick">踢下线</ElDropdownItem>
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
          >
            <template #empty>
              <ElEmpty description="没有在线用户哦" />
            </template>
            <template #status="row">
              <ElTag type="success" v-if="row.row.isOnline">在线</ElTag>
              <ElTag type="info" v-if="!row.row.isOnline">下线</ElTag>
            </template>
            <template #lastOnlineTime="data">
              {{ DateUtils.formatDateTime(data.row.lastOnlineTime, 'MM-DD HH:mm') }}
            </template>
            <template #action="data">
              <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
                <span class="el-dropdown-link">
                  操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem style="color: #f56c6c" command="kick">踢下线</ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
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
