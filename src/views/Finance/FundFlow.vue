<script setup lang="ts">
import { reactive, ref, unref } from 'vue'
import { ElButton, ElEmpty, ElPagination, ElText } from 'element-plus'
import { TableColumn } from '@/types/table'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { DateUtils } from '@/utils/dateUtils'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { StringUtils } from '@/utils/stringUtils'
import { NumberUtils } from '@/utils/numberUtils'
import { useTable } from '@/hooks/web/useTable'
import { getList } from '@/api/fundflow'
import { onMounted } from 'vue'

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'createdAt',
    label: '时间'
  },
  {
    field: 'roleType',
    label: '明细类型'
  },
  {
    field: 'salerName',
    label: '代理名'
  },
  {
    field: 'direction',
    label: '方向'
  },
  {
    field: 'amount',
    label: '金额'
  },
  {
    field: 'reason',
    label: '原因'
  },
  {
    field: 'before',
    label: '之前'
  },
  {
    field: 'other',
    label: '信息'
  }
]

const loading = ref(true)

let tableDataList = ref<any[]>([])

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

const amount_total = ref('')

const getTableList = async () => {
  loading.value = true
  const { getFormData } = methods
  const formData = await getFormData()
  const data = StringUtils.deleteObjectEmptyProperty(formData)
  DateUtils.formatDateTimeAll(data, ['createdAtStart', 'createdAtEnd'])
  NumberUtils.allToNumber(data, ['amountLessOrEq', 'amountThanOrEq'])
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
        amount_total.value = res.data.amount_total
      }
    })
}

onMounted(() => {
  getTableList()
})

const schema = reactive<FormSchema[]>([
  {
    field: 'roleType',
    label: '明细类型',
    component: 'Select',
    componentProps: {
      placeholder: '不筛选',
      options: [
        {
          label: '开发者',
          value: 'developer'
        },
        {
          label: '代理',
          value: 'saler'
        }
      ]
    }
  },
  {
    field: 'direction',
    label: '方向',
    component: 'Select',
    componentProps: {
      placeholder: '不筛选',
      options: [
        {
          label: '入账',
          value: 'in'
        },
        {
          label: '支出',
          value: 'out'
        }
      ]
    }
  },
  {
    field: 'salerName',
    label: '代理名',
    component: 'Input',
    componentProps: {
      placeholder: '代理名'
    }
  },
  {
    field: 'reason',
    label: '原因',
    component: 'Input',
    componentProps: {
      placeholder: '原因'
    }
  },
  {
    field: 'amountThanOrEq',
    label: '金额大于',
    component: 'Input',
    componentProps: {
      placeholder: '金额大于等于',
      type: 'number'
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'amountLessOrEq',
    label: '金额小于',
    component: 'Input',
    componentProps: {
      placeholder: '金额小于等于',
      type: 'number'
    },
    colProps: {
      span: 6
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
        <ElText>当前条件金额总和：{{ amount_total }}</ElText>
        <Table
          @register="rTable.register"
          style="margin-top: 8px"
          :columns="columns"
          :data="tableDataList"
          :loading="loading"
          :selection="false"
        >
          <template #empty>
            <ElEmpty description="暂时没有明细哦" />
          </template>
          <template #createdAt="data">
            {{ DateUtils.formatDateTime(data.row.createdAt) }}
          </template>
          <template #roleType="data">
            {{ data.row.roleType === 'developer' ? '开发者' : '代理' }}
          </template>
          <template #direction="data">
            {{ data.row.direction === 'in' ? '入账' : '支出' }}
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
