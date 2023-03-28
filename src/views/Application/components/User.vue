<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive, ref, unref } from 'vue'
import {
  getList,
  changePassword,
  addTime,
  unbind,
  resetUnbindCount,
  addBanlance,
  setStatus
} from '@/api/user'
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
    label: '次数'
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
  // {
  //   field: 'lastLoginTime',
  //   label: '最后登录'
  // },
  // {
  //   field: 'currentDeviceId',
  //   label: '绑定'
  // },
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
const currentUser = ref<any>(null)

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

const onChangePassword = (user: any) => {
  ElMessageBox.confirm(`您正在修改用户${user.name}的密码`, '修改用户密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputPlaceholder: '请输入新密码'
  })
    .then(async (res) => {
      if (res.value) {
        if (res.value.length < 6) {
          ElMessage.error('密码长度不能小于6位')
          return
        }
        changePassword(props.app.id, user.id, res.value).then(() => {
          ElMessage.success('修改成功')
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const isaddCount = ref(true)

const showSelectStatus = ref(false)

const selectStatus = ref('normal')

const onChangeCount = (user: any) => {
  ElMessageBox.confirm(
    `您正为${
      batchAction.value ? `${currentActionIds.value.length}个用户` : currentUser.value.name
    }${isaddCount.value ? '增加' : '减少'}次数`,
    (isaddCount.value ? '增加' : '减少') + '用户次数',
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
        const count = parseInt(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的整数')
          return
        }
        const data = batchAction.value ? currentActionIds.value : [user.id]
        addBanlance(props.app.id, data, isaddCount.value ? count : -count)
          .then((res) => {
            getTableList()
            ElMessage.success('修改成功，影响' + res.data.affectedCount + '个用户')
          })
          .catch(() => {
            ElMessage.success('未影响任何用户')
          })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onAction = async (user: any, item: string, isBatch = false) => {
  currentUser.value = user
  batchAction.value = isBatch
  if (isBatch) {
    currentActionIds.value = (await rTable.methods.getSelections()).map((item: any) => item.id)
    if (currentActionIds.value.length === 0) {
      ElMessage.error('请先选择用户')
      return
    }
  }
  if (item === 'changePassword') {
    onChangePassword(user)
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
    onChangeCount(user)
  }
  if (item === 'subCount') {
    isaddCount.value = false
    onChangeCount(user)
  }
  if (item === 'unbind') {
    if (isBatch) {
      ElMessageBox.confirm(
        `您正为${currentActionIds.value.length}个用户 解绑设备`,
        '批量解绑设备',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        onUnbind(user)
      })
    } else {
      onUnbind(user)
    }
  }
  if (item === 'resetUnbindCount') {
    if (isBatch) {
      ElMessageBox.confirm(
        `您正为${currentActionIds.value.length}个用户 重置解绑计数`,
        '批量重置解绑计数',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        onResetUnbindCount(user)
      })
    } else {
      onResetUnbindCount(user)
    }
  }
  if (item === 'setStatus') {
    currentUser.value = user
    showSelectStatus.value = true
  }
}

const onSetStatus = () => {
  const data = batchAction.value ? currentActionIds.value : [currentUser.value.id]
  setStatus(props.app.id, data, selectStatus.value)
    .then((res) => {
      getTableList()
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个用户')
    })
    .catch(() => {
      ElMessage.success('未影响任何用户')
    })
    .finally(() => {
      showSelectStatus.value = false
      selectStatus.value = 'normal'
    })
}

const onResetUnbindCount = (user: any) => {
  const data = batchAction.value ? currentActionIds.value : [user.id]
  resetUnbindCount(props.app.id, data)
    .then((res) => {
      getTableList()
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个用户')
    })
    .catch(() => {
      ElMessage.success('未影响任何用户')
    })
}

const onUnbind = (user: any) => {
  const data = batchAction.value ? currentActionIds.value : [user.id]
  unbind(props.app.id, data)
    .then((res) => {
      getTableList()
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个用户')
    })
    .catch(() => {
      ElMessage.success('未影响任何用户')
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
  const data = batchAction.value ? currentActionIds.value : [currentUser.value.id]

  addTime(props.app.id, data, time)
    .then((res) => {
      ElMessage.success('修改成功，影响' + res.data.affectedCount + '个用户')
      getTableList()
    })
    .catch(() => {
      ElMessage.success('未影响任何用户')
    })
    .finally(() => {
      showSelectTime.value = false
    })
}

const schemaDesc = reactive([
  {
    field: 'name',
    label: '用户名'
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
    field: 'otherInfo',
    label: '其他信息'
  },
  {
    field: 'balance',
    label: '剩余次数'
  },
  {
    field: 'currentDeviceId',
    label: '当前设备'
  },
  {
    field: 'unbindCount',
    label: '解绑计数'
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
    field: 'useDeviceName',
    label: '设备名称'
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
              <ElDropdownItem command="addTime">增加时间</ElDropdownItem>
              <ElDropdownItem command="subTime">减少时间</ElDropdownItem>
              <ElDropdownItem divided command="addCount">增加次数</ElDropdownItem>
              <ElDropdownItem command="subCount">减少次数</ElDropdownItem>
              <ElDropdownItem divided command="unbind">解绑设备</ElDropdownItem>
              <ElDropdownItem command="resetUnbindCount">重置解绑次数</ElDropdownItem>
              <ElDropdownItem divided command="setStatus">设置状态</ElDropdownItem>
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
          <template #action="data">
            <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
              <span class="el-dropdown-link">
                操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
              </span>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem command="changePassword">修改密码</ElDropdownItem>
                  <ElDropdownItem divided command="addTime">增加时间</ElDropdownItem>
                  <ElDropdownItem command="subTime">减少时间</ElDropdownItem>
                  <ElDropdownItem divided command="addCount">增加次数</ElDropdownItem>
                  <ElDropdownItem command="subCount">减少次数</ElDropdownItem>
                  <ElDropdownItem divided command="unbind">解绑设备</ElDropdownItem>
                  <ElDropdownItem command="resetUnbindCount">重置解绑次数</ElDropdownItem>
                  <ElDropdownItem divided command="setStatus">设置状态</ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>
          <template #expand="data">
            <Descriptions
              :collapse="false"
              :title="data.row.name + '的详细信息'"
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
                batchAction ? `${currentActionIds.length}个用户` : currentUser.name
              }增加时间`
            : `您正在为${
                batchAction ? `${currentActionIds.length}个用户` : currentUser.name
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
        `您正在为${batchAction ? `${currentActionIds.length}个用户` : currentUser.name}修改状态`
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
