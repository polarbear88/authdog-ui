<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import { getList, createSaler } from '@/api/saler'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElMessage,
  ElMessageBox,
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
import { NumberUtils } from '@/utils/numberUtils'

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '代理名'
  },
  {
    field: 'parentName',
    label: '上级'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'mobile',
    label: '手机号'
  },
  {
    field: 'balance',
    label: '余额'
  },
  {
    field: 'apps',
    label: '授权应用'
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
  DateUtils.formatDateTimeAll(data, ['createdAtStart', 'createdAtEnd'])
  NumberUtils.allToNumber(data, ['balanceLessOrEq', 'balanceThanOrEq'])
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
})

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '代理名',
    component: 'Input',
    componentProps: {
      placeholder: '代理名'
    }
  },
  {
    field: 'parentName',
    label: '上级',
    component: 'Input',
    componentProps: {
      placeholder: '上级代理名称'
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
          label: '禁用',
          value: 'disabled'
        }
      ]
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
    field: 'createdAtStart',
    label: '注册开始',
    component: 'DatePicker',
    componentProps: {
      placeholder: '注册开始',
      type: 'datetime'
    }
  },
  {
    field: 'createdAtEnd',
    label: '注册结束',
    component: 'DatePicker',
    componentProps: {
      placeholder: '注册结束',
      type: 'datetime'
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
  // setStatus(ids, status).then(() => {
  //   ElMessage.success('操作成功')
  //   getTableList()
  //   getCount()
  //     .catch(() => {})
  //     .then((res) => {
  //       if (res) {
  //         statCount.pending = res.data.pending
  //         statCount.resolved = res.data.resolved
  //         statCount.rejected = res.data.rejected
  //       }
  //     })
  // })
}

const onAction = async (saler: any, item: string, isBatch = false) => {
  currentItem.value = saler
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择项目')
      return
    }
  }

  // if (item === 'delete') {
  //   ElMessageBox.confirm('确定删除?', '提示', {
  //     confirmButtonText: '确定',
  //     cancelButtonText: '取消',
  //     type: 'warning'
  //   }).then(() => {
  //     deleteByIds(isBatch ? currentActionIds.value : [feedback.id]).then(() => {
  //       ElMessage.success('删除成功')
  //       getTableList()
  //       getCount()
  //         .catch(() => {})
  //         .then((res) => {
  //           if (res) {
  //             statCount.pending = res.data.pending
  //             statCount.resolved = res.data.resolved
  //             statCount.rejected = res.data.rejected
  //           }
  //         })
  //     })
  //   })
  // }
}

const schemaDesc = reactive([
  {
    field: 'name',
    label: '代理名称'
  },
  {
    field: 'parentName',
    label: '上级代理'
  },
  {
    field: 'createdAt',
    label: '注册时间'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'mobile',
    label: '手机号'
  },
  {
    field: 'lastLoginTime',
    label: '最后登录'
  },
  {
    field: 'balance',
    label: '余额'
  },
  {
    field: 'registerIp',
    label: '注册IP'
  },
  {
    field: 'registerIAP',
    label: 'IP归属'
  }
])
</script>

<template>
  <div>
    <div>
      <ContentWrap style="margin-top: 10px">
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
                <ElDropdownItem divided style="color: #f56c6c" command="delete"
                  >删除</ElDropdownItem
                >
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
              <ElEmpty description="暂时没有代理哦" />
            </template>
            <template #status="row">
              <ElTag v-if="row.row.status === 'normal'" type="success">正常</ElTag>
              <ElTag v-if="row.row.status !== 'normal'" type="danger">禁用</ElTag>
            </template>
            <template #createdAt="data">
              {{ DateUtils.formatDateTime(data.row.createdAt) }}
            </template>
            <template #apps="row"> {{ row.row.apps.length }} 个 </template>
            <template #action="data">
              <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
                <span class="el-dropdown-link">
                  操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="resolved">已处理</ElDropdownItem>
                    <ElDropdownItem command="rejected">拒绝</ElDropdownItem>
                    <ElDropdownItem divided style="color: #f56c6c" command="delete"
                      >删除</ElDropdownItem
                    >
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
                <template #lastLoginTime="row">
                  {{ DateUtils.formatDateTime(row.row.lastLoginTime) }}
                </template>
                <template #status="row">
                  <ElTag v-if="row.row.status === 'normal'" type="success">正常</ElTag>
                  <ElTag v-if="row.row.status !== 'normal'" type="danger">禁用</ElTag>
                </template>
                <template #registerIp="row">
                  {{ row.row.ip.ipv4 }}
                </template>
                <template #registerIAP="row">
                  {{ row.row.ip.city + '-' + row.row.ip.isp }}
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
