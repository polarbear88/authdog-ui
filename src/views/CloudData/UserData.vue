<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { getList, deleteUserData } from '@/api/clouddata/userdata'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElPagination
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
    field: 'name',
    label: '数据名称'
  },
  {
    field: 'value',
    label: '数据值'
  },
  {
    field: 'uniqueValue',
    label: '唯一值'
  },
  {
    field: 'createdAt',
    label: '创建时间'
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
  // DateUtils.formatDateTimeAll(data, [
  //   'expirationTimeStart',
  //   'expirationTimeEnd',
  //   'createdAtStart',
  //   'createdAtEnd'
  // ])
  if (!data.appid) {
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
    field: 'name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '名称'
    }
  },
  {
    field: 'uniqueValue',
    label: '唯一值',
    component: 'Input',
    componentProps: {
      placeholder: '唯一值'
    }
  },
  {
    field: 'submit'
  }
])

const { register, methods, elFormRef } = useForm()

const handleQuery = () => {
  currentPage.value = 1
  getTableList()
}

const resetForm = () => {
  unref(elFormRef)?.resetFields()
  handleQuery()
}

const onAction = async (userdata: any, item: string, isBatch = false) => {
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择数据')
      return
    }
  }
  if (item === 'delete') {
    ElMessageBox.confirm('确定删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteUserData(isBatch ? currentActionIds.value : [userdata.id]).then((res) => {
          ElMessage.success('删除成功，影响' + res.data.affectedCount + '条数据')
          getTableList()
        })
      })
      .catch(() => {})
  }
}

getTableList()
</script>

<template>
  <div>
    <div>
      <div>
        <Form
          :isCol="false"
          :inline="true"
          labelWidth="70px"
          :schema="schema"
          label-position="left"
          hide-required-asterisk
          @register="register"
          :itemStyle="'width: 300px'"
        >
          <template #submit>
            <div>
              <ElButton type="primary" style="width: 120px" @click="handleQuery()"> 查询 </ElButton>
              <ElButton style="width: 120px; margin-left: 20px" @click="resetForm"> 重置 </ElButton>
            </div>
          </template>
        </Form>
      </div>
      <ContentWrap style="margin-top: 10px">
        <ElDropdown trigger="click" @command="(item) => onAction(null, item, true)">
          <span style="font-size: small" class="el-dropdown-link">
            批量操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem style="color: #f56c6c" command="delete">删除数据</ElDropdownItem>
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
            <ElEmpty description="暂时没有用户数据哦" />
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
                  <ElDropdownItem style="color: #f56c6c" command="delete">删除数据</ElDropdownItem>
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
