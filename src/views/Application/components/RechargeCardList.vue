<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive, ref, unref } from 'vue'
import {
  getList,
  setStatus,
  rebuild,
  deleteRechargeCard,
  exportByIds,
  exportByEligible
} from '@/api/rechargeCard'
import {
  ElButton,
  ElDialog,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElEmpty,
  ElIcon,
  ElInput,
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
import { Descriptions } from '@/components/Descriptions'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const emit = defineEmits(['set-tab-click-callback'])

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'id',
    label: 'ID'
  },
  {
    field: 'cardTypeName',
    label: '类型'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'card',
    label: '卡号'
  },
  {
    field: 'description',
    label: '描述'
  },
  {
    field: 'creatorName',
    label: '创建者'
  },
  {
    field: 'userName',
    label: '使用者'
  },
  {
    field: 'useTime',
    label: '使用时间'
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

let isFirstLoad = false

const pageSize = ref(10)

const currentPage = ref(1)

const total = ref(0)

const currentActionIds = ref<Array<number>>([])

const batchAction = ref(false)

let lastSubmitData = {}

const getTableList = async () => {
  loading.value = true
  const { getFormData } = methods
  const formData = await getFormData()
  const data = StringUtils.deleteObjectEmptyProperty(formData)
  DateUtils.formatDateTimeAll(data, [
    'useTimeStart',
    'useTimeEnd',
    'createdAtStart',
    'createdAtEnd'
  ])
  if (!data.cardTypeId) {
    delete data.cardTypeId
  }
  //   NumberUtils.allToNumber(data, ['balanceLessOrEq', 'balanceThanOrEq'])
  lastSubmitData = data
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

const formArr = [
  {
    field: 'card',
    label: '卡号',
    component: 'Input',
    componentProps: {
      placeholder: '卡号'
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'Input',
    componentProps: {
      placeholder: '描述'
    }
  },
  {
    field: 'creatorName',
    label: '创建者',
    component: 'Input',
    componentProps: {
      placeholder: `'开发者' 或代理用户名`
    }
  },
  {
    field: 'userName',
    label: '使用者',
    component: 'Input',
    componentProps: {
      placeholder: '使用者用户名或设备ID'
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
          label: '未使用',
          value: 'unused'
        },
        {
          label: '已使用',
          value: 'used'
        },
        {
          label: '已冻结',
          value: 'frozen'
        }
      ]
    }
  },
  {
    field: 'useTimeStart',
    label: '使用开始',
    component: 'DatePicker',
    componentProps: {
      placeholder: '使用时间开始',
      type: 'datetime'
    }
  },
  {
    field: 'useTimeEnd',
    label: '使用结束',
    component: 'DatePicker',
    componentProps: {
      placeholder: '使用时间结束',
      type: 'datetime'
    }
  },
  {
    field: 'createdAtStart',
    label: '创建开始',
    component: 'DatePicker',
    componentProps: {
      placeholder: '创建时间开始',
      type: 'datetime'
    }
  },
  {
    field: 'createdAtEnd',
    label: '创建结束',
    component: 'DatePicker',
    componentProps: {
      placeholder: '创建时间结束',
      type: 'datetime'
    }
  },
  {
    field: 'submit'
  }
]

const schema = reactive<FormSchema[]>([])

const currentCard = ref<any>(null)

const { register, methods, elFormRef } = useForm()

emit('set-tab-click-callback', 'rechargeCard', () => {
  if (!isFirstLoad) {
    isFirstLoad = true
    getTableList()
    methods.addSchema({
      field: 'cardTypeId',
      label: '类型',
      component: 'RechargeCardTypeSelect',
      componentProps: {
        app: props.app,
        zeroname: '全部'
      },
      value: 0
    })
    for (const item of formArr) {
      methods.addSchema(item as any)
    }
  }
})

const handleQuery = () => {
  currentPage.value = 1
  getTableList()
}

const resetForm = () => {
  unref(elFormRef)?.resetFields()
  handleQuery()
}

const onSetStatus = (status: string) => {
  ElMessageBox.confirm(
    `您正为${batchAction.value ? currentActionIds.value.length : 1}张充值卡设置${
      status === 'frozen' ? '冻结' : '解冻'
    }状态(已使用的不会进行操作)，是否继续？`,
    '设置状态',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    setStatus(
      props.app.id,
      batchAction.value ? currentActionIds.value : [currentCard.value.id],
      status
    )
      .then((res) => {
        ElMessage.success('设置成功，影响' + res.data.affectedCount + '张卡')
        getTableList()
      })
      .catch(() => {})
  })
}

const onRebuild = () => {
  ElMessageBox.confirm(
    `您正为${
      batchAction.value ? currentActionIds.value.length : 1
    }张充值卡重新构建卡号和密码(已使用的不会进行操作)，是否继续？注意：重新构建不会使用卡类型的卡号前缀`,
    '重新构建',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    rebuild(props.app.id, batchAction.value ? currentActionIds.value : [currentCard.value.id])
      .then((res) => {
        ElMessage.success('重新构建成功，影响' + res.data.affectedCount + '张卡')
        getTableList()
      })
      .catch(() => {})
  })
}

const onDelete = () => {
  ElMessageBox.confirm(
    `您正删除${batchAction.value ? currentActionIds.value.length : 1}张充值卡，是否继续？`,
    '删除充值卡',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    deleteRechargeCard(
      props.app.id,
      batchAction.value ? currentActionIds.value : [currentCard.value.id]
    )
      .then((res) => {
        ElMessage.success('删除成功，影响' + res.data.affectedCount + '张卡')
        getTableList()
      })
      .catch(() => {})
  })
}

const showExportResult = ref(false)

const cardresult = ref('')

const onExportSelect = () => {
  exportByIds(props.app.id, currentActionIds.value).then((res) => {
    cardresult.value = res.data
    showExportResult.value = true
  })
}

const onExportEligible = () => {
  exportByEligible(props.app.id, lastSubmitData).then((res) => {
    cardresult.value = res.data
    showExportResult.value = true
  })
}

const onAction = async (card: any, item: string, isBatch = false) => {
  if (item === 'exportSelect') {
    isBatch = true
  }
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择项目')
      return
    }
  }
  currentCard.value = card
  if (item === 'frozen') {
    onSetStatus('frozen')
  }
  if (item === 'unfrozen') {
    onSetStatus('unused')
  }
  if (item === 'rebuild') {
    onRebuild()
  }
  if (item === 'delete') {
    onDelete()
  }
  if (item === 'exportSelect') {
    onExportSelect()
  }
  if (item === 'exportEligible') {
    onExportEligible()
  }
}

const schemaDesc = reactive([
  {
    field: 'cardTypeName',
    label: '卡类型'
  },
  {
    field: 'card',
    label: '卡号'
  },
  {
    field: 'password',
    label: '卡密'
  },
  {
    field: 'description',
    label: '描述'
  },
  {
    field: 'time',
    label: '面值时间'
  },
  {
    field: 'money',
    label: '面值次数'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'creatorName',
    label: '创建者'
  },
  {
    field: 'useTime',
    label: '使用时间'
  },
  {
    field: 'userName',
    label: '使用者'
  },
  {
    field: 'createDetail',
    label: '创建细节'
  },
  {
    field: 'createdAt',
    label: '创建时间'
  }
])
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
        <ElDropdown trigger="click" @command="(item) => onAction(null, item, true)">
          <span style="font-size: small" class="el-dropdown-link">
            批量操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="frozen">冻结</ElDropdownItem>
              <ElDropdownItem divided command="unfrozen">解冻</ElDropdownItem>
              <ElDropdownItem command="rebuild">重建卡号</ElDropdownItem>
              <ElDropdownItem divided command="delete" style="color: #f56c6c">删除</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <ElDropdown
          style="margin-left: 10px"
          trigger="click"
          @command="(item) => onAction(null, item, false)"
        >
          <span style="font-size: small" class="el-dropdown-link">
            批量导出<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="exportSelect">导出选中</ElDropdownItem>
              <ElDropdownItem command="exportEligible">导出符合当前条件</ElDropdownItem>
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
            <ElEmpty description="暂时没有充值卡哦" />
          </template>
          <template #useTime="data">
            {{ data.row.useTime ? DateUtils.formatDateTime(data.row.useTime) : '-' }}
          </template>
          <template #createdAt="data">
            {{ DateUtils.formatDateTime(data.row.createdAt) }}
          </template>
          <template #status="row">
            <ElTag type="danger" v-if="row.row.status === 'frozen'">已冻结</ElTag>
            <ElTag type="success" v-if="row.row.status === 'unused'">未使用</ElTag>
            <ElTag v-if="row.row.status === 'used'">已使用</ElTag>
          </template>
          <template #action="data">
            <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
              <span class="el-dropdown-link">
                操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
              </span>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="frozen">冻结</ElDropdownItem>
                  <ElDropdownItem divided command="unfrozen">解冻</ElDropdownItem>
                  <ElDropdownItem command="rebuild">重建卡号</ElDropdownItem>
                  <ElDropdownItem divided command="delete" style="color: #f56c6c"
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
              <template #useTime="row">
                {{ row.row.useTime ? DateUtils.formatDateTime(row.row.useTime) : '-' }}
              </template>
              <template #time="row">
                {{ DateUtils.convertMinutesToFormattedTime(row.row.time) }}
              </template>
              <template #status="row">
                <ElTag type="danger" v-if="row.row.status === 'frozen'">已冻结</ElTag>
                <ElTag type="success" v-if="row.row.status === 'unused'">未使用</ElTag>
                <ElTag v-if="row.row.status === 'used'">已使用</ElTag>
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
    </div>
    <ElDialog style="width: 680px; max-width: 80%" v-model="showExportResult" title="导出结果">
      <ElInput
        v-model="cardresult"
        :autosize="{ minRows: 15, maxRows: 20 }"
        type="textarea"
        placeholder="充值卡导出结果"
        readonly
      />
    </ElDialog>
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
