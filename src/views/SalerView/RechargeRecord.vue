<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import { ElButton, ElEmpty, ElPagination } from 'element-plus'
import { TableColumn } from '@/types/table'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { DateUtils } from '@/utils/dateUtils'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { StringUtils } from '@/utils/stringUtils'
import { useTable } from '@/hooks/web/useTable'
import { getRechargeRecordList } from '@/api/salerApi/rechargeRecord'

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'createdAt',
    label: '时间'
  },
  {
    field: 'appName',
    label: '应用'
  },
  {
    field: 'cardTypeName',
    label: '卡类型'
  },
  {
    field: 'cardNumber',
    label: '卡号'
  },
  {
    field: 'salerName',
    label: '制作人'
  },
  {
    field: 'userName',
    label: '用户'
  }
]

const loading = ref(true)

let tableDataList = ref<any[]>([])

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

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
  getRechargeRecordList(data)
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
      zeroname: '全局',
      isSaler: true
    }
  },
  {
    field: 'cardTypeName',
    label: '卡类型',
    component: 'Input',
    componentProps: {
      placeholder: '输入类型名称'
    }
  },
  {
    field: 'cardNumber',
    label: '卡号',
    component: 'Input',
    componentProps: {
      placeholder: '输入卡号'
    }
  },
  {
    field: 'salerName',
    label: '制作人',
    component: 'Input',
    componentProps: {
      placeholder: '输入制作人'
    }
  },
  {
    field: 'userName',
    label: '用户',
    component: 'Input',
    componentProps: {
      placeholder: '输入用户'
    }
  },
  {
    field: 'createdAtStart',
    label: '开始时间',
    component: 'DatePicker',
    componentProps: {
      placeholder: '开始时间',
      type: 'datetime'
    }
  },
  {
    field: 'createdAtEnd',
    label: '结束时间',
    component: 'DatePicker',
    componentProps: {
      placeholder: '结束时间',
      type: 'datetime'
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
</script>

<template>
  <div>
    <div>
      <ContentWrap>
        <div>
          <Form
            :isCol="false"
            :inline="true"
            labelWidth="80px"
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
          <Table
            @register="rTable.register"
            style="margin-top: 8px"
            :columns="columns"
            :data="tableDataList"
            :loading="loading"
            :selection="false"
          >
            <template #empty>
              <ElEmpty description="暂时没有充值记录哦" />
            </template>
            <template #createdAt="data">
              {{ DateUtils.formatDateTime(data.row.createdAt) }}
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
