<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive, ref, unref } from 'vue'
import { getList } from '@/api/user'
import { ElButton, ElEmpty, ElPagination, ElTag } from 'element-plus'
import { TableColumn } from '@/types/table'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { DateUtils } from '@/utils/dateUtils'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { StringUtils } from '@/utils/stringUtils'
import { NumberUtils } from '@/utils/numberUtils'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const emit = defineEmits(['set-tab-click-callback'])

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '用户名'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'expirationTime',
    label: '到期时间'
  },
  {
    field: 'balance',
    label: '余额'
  },
  {
    field: 'mobile',
    label: '手机号'
  },
  {
    field: 'createdAt',
    label: '注册时间'
  },
  {
    field: 'useDeviceName',
    label: '设备名称'
  },
  {
    field: 'otherInfo',
    label: '其他信息'
  },
  {
    field: 'isTrial',
    label: '试用中'
  },
  {
    field: 'lastLoginTime',
    label: '最后登录'
  },
  {
    field: 'currentDeviceId',
    label: '绑定'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)

let tableDataList = ref<any[]>([])

let isFirstLoad = false

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

const getTableList = async () => {
  loading.value = true
  const { getFormData } = methods
  const formData = await getFormData()
  const data = StringUtils.deleteObjectEmptyProperty(formData)
  DateUtils.formatDateTimeAll(data, ['expirationTimeStart', 'expirationTimeEnd'])
  const isTrial = data.isTrial
  delete data.isTrial
  if (isTrial !== undefined && isTrial !== null) {
    if (isTrial) {
      data.isTrial = true
    } else {
      data.isNotTrial = true
    }
  }
  NumberUtils.allToNumber(data, ['balanceLessOrEq', 'balanceThanOrEq'])
  data.page = currentPage.value
  data.pageSize = pageSize.value
  getList(props.app.id, data)
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

emit('set-tab-click-callback', 'user', () => {
  if (!isFirstLoad) {
    isFirstLoad = true
    getTableList()
  }
})

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '用户名',
    component: 'Input',
    componentProps: {
      placeholder: '用户名'
    }
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    componentProps: {
      placeholder: '手机号'
    }
  },
  {
    field: 'otherInfo',
    label: '其他信息',
    component: 'Input',
    componentProps: {
      placeholder: '其他信息'
    }
  },
  {
    field: 'balanceThanOrEq',
    label: '余额大于',
    component: 'Input',
    componentProps: {
      placeholder: '余额大于等于',
      type: 'number'
    }
  },
  {
    field: 'balanceLessOrEq',
    label: '余额小于',
    component: 'Input',
    componentProps: {
      placeholder: '余额小于等于',
      type: 'number'
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
          label: '正常',
          value: 'normal'
        },
        {
          label: '禁止',
          value: 'disabled'
        }
      ]
    }
  },
  {
    field: 'isTrial',
    label: '试用中',
    component: 'Select',
    componentProps: {
      placeholder: '不筛选',
      options: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ]
    }
  },
  {
    field: 'expirationTimeStart',
    label: '到期开始',
    component: 'DatePicker',
    componentProps: {
      placeholder: '到期开始',
      type: 'datetime'
    }
  },
  {
    field: 'expirationTimeEnd',
    label: '到期结束',
    component: 'DatePicker',
    componentProps: {
      placeholder: '到期结束',
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
          :isCol="true"
          :inline="false"
          labelWidth="80px"
          :schema="schema"
          label-position="left"
          hide-required-asterisk
          @register="register"
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
        <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
          <template #empty>
            <ElEmpty description="暂时没有用户哦" />
          </template>
          <template #status="data">
            <ElTag v-if="data.row.status === 'normal'" type="success">正常</ElTag>
            <ElTag v-if="data.row.status !== 'normal'" type="danger">禁用</ElTag>
          </template>
          <template #expirationTime="data">
            {{ DateUtils.formatDateTime(data.row.expirationTime) }}
          </template>
          <template #createdAt="data">
            {{ DateUtils.formatDateTime(data.row.createdAt) }}
          </template>
          <template #isTrial="data">
            <ElTag v-if="data.row.trialExpiration > Date.now()">是</ElTag>
            <ElTag v-if="data.row.trialExpiration < Date.now()" type="info">否</ElTag>
          </template>
          <template #lastLoginTime="data">
            {{ DateUtils.formatDateTime(data.row.lastLoginTime, 'yyyy-MM-DD') }}
          </template>
          <template #action>
            <ElButton size="small" type="primary">管理</ElButton>
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
