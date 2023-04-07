<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive, ref, unref } from 'vue'
import { getList, addTime, addBalance, setStatus, deleteUsers } from '@/api/device'
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
  ElTag,
  ElDialog,
  ElInput,
  ElSelect,
  ElOption
} from 'element-plus'
import { TableColumn } from '@/types/table'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { DateUtils } from '@/utils/dateUtils'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useForm } from '@/hooks/web/useForm'
import { StringUtils } from '@/utils/stringUtils'
import { NumberUtils } from '@/utils/numberUtils'
import { ArrowDown } from '@element-plus/icons-vue'
import { useTable } from '@/hooks/web/useTable'
import { Descriptions } from '@/components/Descriptions'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const emit = defineEmits(['set-tab-click-callback'])

const rTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'deviceId',
    label: '设备ID'
  },
  {
    field: 'deviceName',
    label: '设备名称'
  },
  {
    field: 'status',
    label: '状态'
  },
  {
    field: 'expirationTime',
    label: '剩余时间'
  },
  {
    field: 'balance',
    label: '次数'
  },
  {
    field: 'createdAt',
    label: '注册时间'
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

const showSelectStatus = ref(false)

const selectStatus = ref('normal')

const getTableList = async () => {
  loading.value = true
  const { getFormData } = methods
  const formData = await getFormData()
  const data = StringUtils.deleteObjectEmptyProperty(formData)
  DateUtils.formatDateTimeAll(data, [
    'expirationTimeStart',
    'expirationTimeEnd',
    'createdAtStart',
    'createdAtEnd'
  ])
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

emit('set-tab-click-callback', 'device', () => {
  if (!isFirstLoad) {
    isFirstLoad = true
    getTableList()
  }
})

const schema = reactive<FormSchema[]>([
  {
    field: 'deviceId',
    label: '设备ID',
    component: 'Input',
    componentProps: {
      placeholder: '设备ID'
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
    },
    colProps: {
      span: 6
    }
  },
  {
    field: 'balanceLessOrEq',
    label: '余额小于',
    component: 'Input',
    componentProps: {
      placeholder: '余额小于等于',
      type: 'number'
    },
    colProps: {
      span: 6
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

const showSelectTime = ref(false)

const inputDay = ref(0)
const inputHour = ref(0)
const inputMinute = ref(0)
const currentDevice = ref<any>(null)

const isaddtime = ref(true)

const { register, methods, elFormRef } = useForm()

const handleQuery = () => {
  currentPage.value = 1
  getTableList()
}

const resetForm = () => {
  unref(elFormRef)?.resetFields()
  handleQuery()
}

const isaddCount = ref(true)

const onChangeCount = (device: any) => {
  ElMessageBox.confirm(
    `您正为${batchAction.value ? `${currentActionIds.value.length}个设备` : device.deviceId}${
      isaddCount.value ? '增加' : '减少'
    }次数`,
    (isaddCount.value ? '增加' : '减少') + '设备次数',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showInput: true,
      inputPlaceholder: '次数',
      inputType: 'number'
    }
  )
    .then(async (res) => {
      if (res.value) {
        const count = Number(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的整数')
          return
        }
        const data = batchAction.value ? currentActionIds.value : [device.id]
        addBalance(props.app.id, data, isaddCount.value ? count : -count)
          .then((res) => {
            getTableList()
            ElMessage.success('修改成功，影响' + res.data.affectedCount + '个设备')
          })
          .catch(() => {
            ElMessage.success('未影响任何设备')
          })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onDelete = (user: any) => {
  const data = batchAction.value ? currentActionIds.value : [user.id]
  deleteUsers(props.app.id, data)
    .then((res) => {
      getTableList()
      ElMessage.success('删除成功，影响' + res.data.affectedCount + '个用户')
    })
    .catch(() => {
      ElMessage.success('未影响任何用户')
    })
}

const onAction = async (device: any, item: string, isBatch = false) => {
  currentDevice.value = device
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择设备')
      return
    }
  }
  if (item === 'addTime') {
    isaddtime.value = true
    inputDay.value = 0
    inputHour.value = 0
    inputMinute.value = 0
    showSelectTime.value = true
  }
  if (item === 'subTime') {
    isaddtime.value = false
    inputDay.value = 0
    inputHour.value = 0
    inputMinute.value = 0
    showSelectTime.value = true
  }
  if (item === 'addCount') {
    isaddCount.value = true
    onChangeCount(device)
  }
  if (item === 'subCount') {
    isaddCount.value = false
    onChangeCount(device)
  }
  if (item === 'setStatus') {
    currentDevice.value = device
    showSelectStatus.value = true
  }
  if (item === 'delete') {
    ElMessageBox.confirm(`注意删除用户将会删除包括该用户的用户数据和财产明细数据`, '批量删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      onDelete(device)
    })
  }
}

const onSetStatus = () => {
  const data = batchAction.value ? currentActionIds.value : [currentDevice.value.id]
  setStatus(props.app.id, data, selectStatus.value)
    .then((res) => {
      getTableList()
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个设备')
    })
    .catch(() => {
      ElMessage.success('未影响任何设备')
    })
    .finally(() => {
      showSelectStatus.value = false
      selectStatus.value = 'normal'
    })
}

const getInputTime = () => {
  const day = inputDay.value
  const hour = inputHour.value
  const minute = inputMinute.value
  const time = day * 24 * 60 + hour * 60 + minute
  if (time <= 0 || isNaN(time)) {
    return 0
  }
  if (isaddtime.value) {
    return time
  } else {
    return -time
  }
}

const onConfirmChangeTime = () => {
  const time = getInputTime()
  if (time === 0) {
    ElMessage.error('请输入正确的时间')
    return
  }
  const data = batchAction.value ? currentActionIds.value : [currentDevice.value.id]

  addTime(props.app.id, data, time)
    .then((res) => {
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个设备')
      getTableList()
    })
    .catch(() => {
      ElMessage.success('未影响任何设备')
    })
    .finally(() => {
      showSelectTime.value = false
    })
}

const schemaDesc = reactive([
  {
    field: 'deviceId',
    label: '设备ID',
    span: 24
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
    field: 'otherInfo',
    label: '其他信息'
  },
  {
    field: 'balance',
    label: '剩余次数'
  },
  {
    field: 'expirationTime',
    label: '到期时间'
  },
  {
    field: 'trialExpiration',
    label: '试用截止'
  },
  {
    field: 'lastLoginTime',
    label: '最后登录'
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

const getExpirationTime = (data: any) => {
  const time = new Date(data.expirationTime)
  if (new Date().getTime() > time.getTime()) {
    return '已过期'
  }
  return DateUtils.convertMinutesToFormattedTime(
    (time.getTime() - new Date().getTime()) / 1000 / 60
  )
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
        <ElDropdown trigger="click" @command="(item) => onAction(null, item, true)">
          <span style="font-size: small" class="el-dropdown-link">
            批量操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
          </span>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="addTime">增加时间</ElDropdownItem>
              <ElDropdownItem command="subTime">减少时间</ElDropdownItem>
              <ElDropdownItem divided command="addCount">增加次数</ElDropdownItem>
              <ElDropdownItem command="subCount">减少次数</ElDropdownItem>
              <ElDropdownItem divided command="setStatus">设置状态</ElDropdownItem>
              <ElDropdownItem divided style="color: #f56c6c" command="delete">删除</ElDropdownItem>
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
            <ElEmpty description="暂时没有设备哦" />
          </template>
          <template #deviceName="data">
            {{ (data.row.brand || '') + '-' + (data.row.model || '') }}
          </template>
          <template #status="data">
            <ElTag v-if="data.row.status === 'normal'" type="success">正常</ElTag>
            <ElTag v-if="data.row.status !== 'normal'" type="danger">禁用</ElTag>
          </template>
          <template #expirationTime="data">
            {{ getExpirationTime(data.row) }}
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
          <template #action="data">
            <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
              <span class="el-dropdown-link">
                操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
              </span>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="addTime">增加时间</ElDropdownItem>
                  <ElDropdownItem command="subTime">减少时间</ElDropdownItem>
                  <ElDropdownItem divided command="addCount">增加次数</ElDropdownItem>
                  <ElDropdownItem command="subCount">减少次数</ElDropdownItem>
                  <ElDropdownItem divided command="setStatus">设置状态</ElDropdownItem>
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
              :title="'设备详细信息'"
              :data="data.row"
              :schema="schemaDesc"
            >
              <template #createdAt="row">
                {{ DateUtils.formatDateTime(row.row.createdAt) }}
              </template>
              <template #lastLoginTime="row">
                {{ DateUtils.formatDateTime(row.row.lastLoginTime) }}
              </template>
              <template #trialExpiration="row">
                {{ DateUtils.formatDateTime(row.row.trialExpiration) }}
              </template>
              <template #expirationTime="row">
                {{ DateUtils.formatDateTime(row.row.expirationTime) }}
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
    </div>
    <ElDialog width="500px" style="max-width: 90%" v-model="showSelectTime" title="输入时间">
      <div>
        <h2 style="color: #f56c6c">{{
          isaddtime
            ? `您正在为${
                batchAction ? `${currentActionIds.length}个设备` : currentDevice.deviceId
              }增加时间`
            : `您正在为${
                batchAction ? `${currentActionIds.length}个设备` : currentDevice.deviceId
              }减少时间`
        }}</h2>
        <h2 v-if="isaddtime">如果用户时间小于当前时间则会在当前时间基础上加时</h2>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="inputDay"
          placeholder="Please input"
        >
          <template #append>天</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="inputHour"
          placeholder="Please input"
        >
          <template #append>时</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="inputMinute"
          placeholder="Please input"
        >
          <template #append>分</template>
        </ElInput>
        <div style="width: 100%; height: 40px"></div>
        <div style="right: 20px; bottom: 10px; position: absolute">
          <ElButton @click="showSelectTime = false">取消</ElButton>
          <ElButton type="primary" @click="onConfirmChangeTime"> 确认 </ElButton>
        </div>
      </div>
    </ElDialog>
    <ElDialog width="500px" style="max-width: 90%" v-model="showSelectStatus" title="选择状态">
      <h2 style="color: #f56c6c">{{
        `您正在为${
          batchAction ? `${currentActionIds.length}个设备` : currentDevice.deviceId
        }修改状态`
      }}</h2>
      <ElSelect style="margin-top: 10px" v-model="selectStatus" placeholder="请选择">
        <ElOption label="正常" value="normal" />
        <ElOption label="禁用" value="disabled" />
      </ElSelect>
      <div style="width: 100%; height: 40px"></div>
      <div style="right: 20px; bottom: 10px; position: absolute">
        <ElButton @click="showSelectStatus = false">取消</ElButton>
        <ElButton type="primary" @click="onSetStatus"> 确认 </ElButton>
      </div>
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
