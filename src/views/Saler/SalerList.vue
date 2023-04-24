<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import {
  getList,
  changePasswordSaler,
  setStatusSaler,
  addBalanceSaler,
  setApps,
  createSaler,
  setRolesSaler,
  deleteSaler
} from '@/api/saler'
import { getList as getListForApp } from '@/api/application'
import { getList as getRoleList } from '@/api/saler/SalerRoles'
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
  ElOption,
  ElPagination,
  ElSelect,
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
import { Dialog } from '@/components/Dialog'
import { CirclePlus } from '@element-plus/icons-vue'
import { useValidator } from '@/hooks/web/useValidator'

const rTable = useTable()
const bTable = useTable()

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '代理名'
  },
  {
    field: 'role',
    label: '角色'
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
    field: 'fromToken',
    label: '来自'
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

const applications = ref<any[]>([])

const appListloading = ref(false)

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
    field: 'fromToken',
    label: '来自',
    component: 'Input',
    componentProps: {
      placeholder: '请输入token'
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
    field: 'salerRoleName',
    label: '角色名称',
    component: 'Input',
    componentProps: {
      placeholder: '角色名称'
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
const addSalerForm = useForm()

const handleQuery = () => {
  currentPage.value = 1
  getTableList()
}

const resetForm = () => {
  unref(elFormRef)?.resetFields()
  handleQuery()
}

const onSetStatus = (status: string, ids: Array<number>) => {
  ElMessageBox.confirm(`确定${status === 'normal' ? '启用' : '禁用'}?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    setStatusSaler(ids, status).then(() => {
      ElMessage.success(`${status === 'normal' ? '启用' : '禁用'}成功`)
      getTableList()
    })
  })
}

const onChangePassword = (user: any) => {
  ElMessageBox.confirm(`您正在修改代理${user.name}的密码`, '修改用户密码', {
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
        changePasswordSaler(user.id, res.value).then(() => {
          ElMessage.success('修改成功')
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const isaddBalance = ref(true)

const showSelectApps = ref(false)

const onChangeBalance = (user: any) => {
  ElMessageBox.confirm(
    `您正为${user.name}${isaddBalance.value ? '充值' : '扣减'}余额`,
    (isaddBalance.value ? '充值' : '扣减') + '代理余额',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showInput: true,
      inputPlaceholder: '金额',
      inputType: 'number'
    }
  )
    .then(async (res) => {
      if (res.value) {
        const amount = Number(res.value)
        if (amount < 0 || isNaN(amount)) {
          ElMessage.error('请输入正确的整数')
          return
        }
        addBalanceSaler(user.id, isaddBalance.value ? amount : -amount)
          .then(() => {
            getTableList()
            ElMessage.success('修改成功')
          })
          .catch(() => {
            ElMessage.success('修改失败')
          })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const handleSelectApps = async () => {
  const selectItem = (await bTable.methods.getSelections()).map((item: any) => {
    return {
      id: item.id,
      name: item.name
    }
  })
  setApps(currentItem.value.id, selectItem)
    .then(() => {
      getTableList()
      ElMessage.success('修改成功')
    })
    .finally(() => {
      showSelectApps.value = false
    })
}

const showSetRole = ref(false)

const onSetRole = () => {
  setRolesSaler(
    batchAction.value ? currentActionIds.value : [currentItem.value.id],
    Number(currentRole.value)
  )
    .then(() => {
      ElMessage.success('修改成功')
      getTableList()
    })
    .finally(() => {
      showSetRole.value = false
    })
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
  if (item === 'disable') {
    onSetStatus('disabled', isBatch ? currentActionIds.value : [saler.id])
  }
  if (item === 'enable') {
    onSetStatus('normal', isBatch ? currentActionIds.value : [saler.id])
  }
  if (item === 'changePassword') {
    onChangePassword(saler)
  }
  if (item === 'addBalance') {
    isaddBalance.value = true
    onChangeBalance(saler)
  }
  if (item === 'subBalance') {
    isaddBalance.value = false
    onChangeBalance(saler)
  }
  if (item === 'setapps') {
    if (saler.topSalerId) {
      ElMessage.error('非顶级代理无法设置应用，因为他跟随顶级代理的应用')
      return
    }
    appListloading.value = true
    getListForApp()
      .then((res) => {
        if (res) {
          applications.value = res.data
          setTimeout(() => {
            for (const item of currentItem.value.apps) {
              unref(bTable.elTableRef)?.toggleRowSelection(
                applications.value.find((app: any) => app.id === (item as any).id),
                true
              )
            }
          }, 50)
        }
      })
      .finally(() => {
        appListloading.value = false
      })
    showSelectApps.value = true
  }
  if (item === 'setrole') {
    currentRole.value = ''
    showSetRole.value = true
  }

  if (item === 'delete') {
    ElMessageBox.confirm('删除代理将会删除其所有的下级代理，包含下级的下级，是否确认?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteSaler(saler.id).then((res) => {
        ElMessage.success('删除成功，影响' + res.data.affectedCount + '个代理')
        getTableList()
      })
    })
  }
}

const schemaDesc = reactive([
  {
    field: 'name',
    label: '代理名称'
  },
  {
    field: 'role',
    label: '角色'
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

const showAddSaler = ref(false)
const currentRole = ref<any>('')

const { required } = useValidator()
const addSalerRules = {
  name: [required()],
  mobile: [required()],
  password: [required()]
}

const addSalerSehema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '代理名称',
    component: 'Input',
    componentProps: {
      placeholder: '代理用户名'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'mobile',
    label: '手机号',
    component: 'Input',
    componentProps: {
      placeholder: '代理手机号/联系方式'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'password',
    label: '登录密码',
    component: 'Input',
    componentProps: {
      placeholder: '登录密码'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'submit'
  }
])

const onCreateSaler = async () => {
  const formRef = unref(addSalerForm.elFormRef)
  await formRef?.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    const { getFormData } = addSalerForm.methods
    const formData = await getFormData()
    createSaler(formData)
      .then(() => {
        getTableList()
        ElMessage.success('创建成功')
      })
      .finally(() => {
        showAddSaler.value = false
      })
  })
}

const roleList = ref<any[]>([])

getRoleList()
  .then((res) => {
    if (res) {
      roleList.value = res.data
      roleList.value.unshift({
        id: 0,
        name: '清除角色'
      })
    }
  })
  .catch(() => {})
</script>

<template>
  <div>
    <div>
      <ContentWrap style="margin-top: 10px">
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
        <ElAlert title="别忘记添加代理后要设置授权应用" type="warning" show-icon />
        <ContentWrap style="margin-top: 10px">
          <ElDropdown trigger="click" @command="(item) => onAction(null, item, true)">
            <span style="font-size: small; float: left" class="el-dropdown-link">
              批量操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
            </span>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="disable">禁用</ElDropdownItem>
                <ElDropdownItem command="enable">解禁</ElDropdownItem>
                <ElDropdownItem divided command="setrole">设置角色</ElDropdownItem>
                <!-- <ElDropdownItem divided style="color: #f56c6c" command="delete"
                  >删除</ElDropdownItem
                > -->
              </ElDropdownMenu>
            </template>
          </ElDropdown>

          <ElButton
            style="margin-left: 10px; margin-top: -3px"
            type="primary"
            link
            :icon="CirclePlus"
            @click="showAddSaler = true"
            >添加代理</ElButton
          >

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
            <template #role="row">
              {{ row.row.salerRoleName ? row.row.salerRoleName : '未设置' }}
            </template>
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
            <template #apps="row">
              {{ row.row.topSalerId ? '跟随顶级' : row.row.apps.length + '个' }}
            </template>
            <template #action="data">
              <ElDropdown @command="(item) => onAction(data.row, item)" trigger="click">
                <span class="el-dropdown-link">
                  操作<ElIcon class="el-icon--right"><ArrowDown /></ElIcon>
                </span>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="disable">禁用</ElDropdownItem>
                    <ElDropdownItem command="enable">解禁</ElDropdownItem>
                    <ElDropdownItem divided command="changePassword">修改密码</ElDropdownItem>
                    <ElDropdownItem divided command="addBalance">充值余额</ElDropdownItem>
                    <ElDropdownItem command="subBalance">扣减余额</ElDropdownItem>
                    <ElDropdownItem divided command="setapps">设置授权应用</ElDropdownItem>
                    <ElDropdownItem divided command="setrole">设置角色</ElDropdownItem>
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
                <template #role="row">
                  {{ row.row.salerRoleName ? row.row.salerRoleName : '未设置' }}
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
    <Dialog v-model="showSetRole" title="设置角色">
      <p
        >您正在为{{
          batchAction ? currentActionIds.length + '个代理' : currentItem.name
        }}设置角色</p
      >
      <p style="color: #f56c6c; margin-top: 5px">非顶级代理将不会成功设置</p>
      <ElSelect style="margin-top: 20px" v-model="currentRole" placeholder="请选择角色">
        <ElOption
          v-for="item in roleList"
          :key="item.id"
          :label="item.name"
          :value="item.id + ''"
        />
      </ElSelect>
      <div>
        <ElButton style="margin-top: 20px" type="primary" @click="onSetRole">确定设置</ElButton>
      </div>
    </Dialog>
    <Dialog style="max-width: 650px" v-model="showAddSaler" title="添加代理">
      <Form
        :rules="addSalerRules"
        label-position="top"
        :schema="addSalerSehema"
        hide-required-asterisk
        @register="addSalerForm.register"
      >
        <template #submit>
          <div>
            <ElButton type="primary" @click="onCreateSaler" style="width: 120px"> 提交 </ElButton>
          </div>
        </template>
      </Form>
    </Dialog>
    <Dialog title="选择授权应用" v-model="showSelectApps">
      <ElButton type="primary" @click="handleSelectApps">确定选择</ElButton>
      <Table
        style="margin-top: 10px"
        @register="bTable.register"
        :columns="[
          {
            field: 'id',
            label: 'ID'
          },
          {
            field: 'name'
          }
        ]"
        :data="applications"
        :loading="appListloading"
      >
        <template #empty>
          <ElEmpty description="暂时没有应用哦" />
        </template>
      </Table>
    </Dialog>
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
