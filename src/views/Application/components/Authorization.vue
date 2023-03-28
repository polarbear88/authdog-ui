<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { PropType, reactive, ref } from 'vue'
import { Descriptions } from '@/components/Descriptions'
import {
  ElTooltip,
  ElSwitch,
  ElMessageBox,
  ElInput,
  ElButton,
  ElDialog,
  ElMessage,
  ElText
} from 'element-plus'
import {
  setIsFree,
  setTrialTime,
  setBindDevice,
  setAllowUnbind,
  setUnbindDeductTime,
  setUnbindDeductCount,
  setMaxUnbindCount,
  setAllowMultiDevice,
  setMaxMultiDevice,
  setUseCountMode,
  setAllowLoginWhenCountUsedUp,
  setTrialCount,
  setAllowForceLogin
} from '@/api/application'
import { DateUtils } from '@/utils/dateUtils'

const props = defineProps({ app: { type: Object as PropType<ApplicationInfo>, default: () => {} } })

const baseSchema = reactive([
  {
    field: 'authMode',
    label: '授权模式'
  },
  {
    field: 'free',
    label: '是否免费'
  },
  {
    field: 'trialTime',
    label: '试用时间'
  }
])

const bindDeviceSchema_on = [
  {
    field: 'bindDevice',
    label: '绑定设备',
    span: 3
  },
  {
    field: 'allowUnbind',
    label: '允许解绑'
  },
  {
    field: 'unbindDeductTime',
    label: '解绑扣时'
  },
  {
    field: 'unbindDeductCount',
    label: '解绑扣次「启用按次模式有效」'
  },
  {
    field: 'maxUnbindCount',
    label: '最大解绑次数'
  }
]

let bindDeviceSchema = reactive(bindDeviceSchema_on)

const multiDeviceSchema = reactive([
  {
    field: 'allowMultiDevice',
    label: '多设备登录'
  },
  {
    field: 'maxMultiDevice',
    label: '最大同时登录数'
  },
  {
    field: 'allowForceLogin',
    label: '允许强制登录'
  }
])

const countModeSchema = reactive([
  {
    field: 'useCountMode',
    label: '按次收费'
  },
  {
    field: 'allowLoginWhenCountUsedUp',
    label: '次数用尽后允许登录'
  },
  {
    field: 'trialCount',
    label: '试用次数'
  }
])
const getAuthModeTooltip = () => {
  if (props.app.authMode === 'deviceid') {
    return '设备ID模式：设备ID授权，不需要用户登录，适用于设备类应用 不可修改'
  } else {
    return '用户模式：用户账号密码登录授权，适用于用户类应用 不可修改'
  }
}

const emit = defineEmits(['get-appdata'])

const getAppData = () => {
  emit('get-appdata')
}

const onSetIsFree = () => {
  if (props.app.free) {
    // eslint-disable-next-line vue/no-mutating-props
    props.app.free = false
    ElMessageBox.confirm('您确定将应用 ' + props.app.name + ' 设置为免费模式？', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        setIsFree(props.app.id + '', true).then(() => {
          getAppData()
        })
      })
      .catch(() => {})
  } else {
    setIsFree(props.app.id + '', false)
      .then(() => {
        getAppData()
      })
      .catch(() => {
        // eslint-disable-next-line vue/no-mutating-props
        props.app.free = !props.app.free
      })
  }
}

const showSelectTrialTime = ref(false)

const showSelectUnbindDeductTime = ref(false)

const selectTrialTime = ref({
  days: '',
  hours: '',
  minutes: ''
})

const selectUnbindDeductTime = ref({
  days: '',
  hours: '',
  minutes: ''
})

const onShowSelectTrialTime = () => {
  showSelectTrialTime.value = true
  const dhms = DateUtils.getDHMSFromMinutes(props.app.trialTime ? props.app.trialTime : 0)
  selectTrialTime.value = {
    days: dhms.days + '',
    hours: dhms.hours + '',
    minutes: dhms.minutes + ''
  }
}

const onConfirmSetTrialTime = () => {
  const trialTime = DateUtils.DHMSSum(selectTrialTime.value)
  if (trialTime < 0 || isNaN(trialTime)) {
    ElMessageBox.alert('请输入正确的试用时间', '温馨提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }
  if (trialTime === props.app.trialTime) {
    showSelectTrialTime.value = false
    return
  }
  setTrialTime(props.app.id + '', trialTime).then(() => {
    getAppData()
    showSelectTrialTime.value = false
  })
}

const onSetBindDevice = () => {
  // eslint-disable-next-line vue/no-mutating-props
  props.app.bindDevice = !props.app.bindDevice
  ElMessageBox.confirm(
    '您确定将应用 ' +
      props.app.name +
      (!props.app.bindDevice ? ' 设置为绑定设备' : '取消绑定设备') +
      '？',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      setBindDevice(props.app.id + '', !props.app.bindDevice).then(() => {
        getAppData()
      })
    })
    .catch(() => {})
}

const onSetAllowUnbind = () => {
  setAllowUnbind(props.app.id + '', props.app.allowUnbind)
    .then(() => {
      getAppData()
    })
    .catch(() => {
      // eslint-disable-next-line vue/no-mutating-props
      props.app.allowUnbind = !props.app.allowUnbind
    })
}

const onSetUnbindDeductTime = () => {
  showSelectUnbindDeductTime.value = true
  const dhms = DateUtils.getDHMSFromMinutes(
    props.app.unbindDeductTime ? props.app.unbindDeductTime : 0
  )
  selectUnbindDeductTime.value = {
    days: dhms.days + '',
    hours: dhms.hours + '',
    minutes: dhms.minutes + ''
  }
}

const onConfirmSetUnbindDeductTime = () => {
  const time = DateUtils.DHMSSum(selectUnbindDeductTime.value)
  if (time < 0 || isNaN(time)) {
    ElMessageBox.alert('请输入正确的时间', '温馨提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }
  if (time === props.app.unbindDeductTime) {
    showSelectUnbindDeductTime.value = false
    return
  }
  setUnbindDeductTime(props.app.id + '', time).then(() => {
    getAppData()
    showSelectUnbindDeductTime.value = false
  })
}

const onSetUnbindDeductCount = () => {
  ElMessageBox.confirm('', '请输入解绑扣的次数：', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputType: 'number'
  })
    .then(async (res) => {
      if (res.value) {
        const count = parseInt(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的次数')
          return
        }
        setUnbindDeductCount(props.app.id + '', count).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onSetMaxUnbindCount = () => {
  ElMessageBox.confirm('输入0则为不限制', '请输入最大解绑次数：', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputType: 'number'
  })
    .then(async (res) => {
      if (res.value) {
        const count = parseInt(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的次数')
          return
        }
        setMaxUnbindCount(props.app.id + '', count).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onSetAllowMultiDevice = () => {
  setAllowMultiDevice(props.app.id + '', props.app.allowMultiDevice)
    .then(() => {
      getAppData()
    })
    .catch(() => {
      // eslint-disable-next-line vue/no-mutating-props
      props.app.allowMultiDevice = !props.app.allowMultiDevice
    })
}

const onSetUseCountMode = () => {
  setUseCountMode(props.app.id + '', props.app.useCountMode)
    .then(() => {
      getAppData()
    })
    .catch(() => {
      // eslint-disable-next-line vue/no-mutating-props
      props.app.useCountMode = !props.app.useCountMode
    })
}

const onSetAllowLoginWhenCountUsedUp = () => {
  setAllowLoginWhenCountUsedUp(props.app.id + '', props.app.allowLoginWhenCountUsedUp)
    .then(() => {
      getAppData()
    })
    .catch(() => {
      // eslint-disable-next-line vue/no-mutating-props
      props.app.allowLoginWhenCountUsedUp = !props.app.allowLoginWhenCountUsedUp
    })
}
const onSetMaxMultiDevice = () => {
  ElMessageBox.confirm('输入0则为不限制', '请输入最大同时登录设备数：', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputType: 'number'
  })
    .then(async (res) => {
      if (res.value) {
        const count = parseInt(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的整数')
          return
        }
        setMaxMultiDevice(props.app.id + '', count).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onsetTrialCount = () => {
  ElMessageBox.confirm('输入0则为不可试用', '请输入试用次数', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputType: 'number'
  })
    .then(async (res) => {
      if (res.value) {
        const count = parseInt(res.value)
        if (count < 0 || isNaN(count)) {
          ElMessage.error('请输入正确的整数')
          return
        }
        setTrialCount(props.app.id + '', count).then(() => {
          getAppData()
        })
        return
      }
      ElMessage.error('请输入内容')
    })
    .catch(() => {})
}

const onSetAllowForceLogin = () => {
  setAllowForceLogin(props.app.id + '', props.app.allowForceLogin)
    .then(() => {
      getAppData()
    })
    .catch(() => {
      // eslint-disable-next-line vue/no-mutating-props
      props.app.allowForceLogin = !props.app.allowForceLogin
    })
}
</script>

<template>
  <div>
    <div>
      <Descriptions :collapse="false" title="基础设置" :data="app" :schema="baseSchema">
        <template #authMode="data">
          <ElTooltip :content="getAuthModeTooltip()" placement="top-start">
            {{ data.row.authMode === 'deviceid' ? '设备ID模式' : '用户模式' }}
          </ElTooltip>
        </template>
        <template #authMode-label>
          <ElTooltip
            content="设备ID模式：设备ID授权，不需要用户登录，适用于设备类应用<br />用户模式：用户账号密码登录授权且用户需要注册，适用于用户类应用(用户模式支持绑定/解绑设备)"
            placement="top-start"
            raw-content
          >
            <span>授权模式<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
          </ElTooltip>
        </template>
        <template #free="data">
          <ElSwitch @change="onSetIsFree" v-model="data.row.free" />
        </template>
        <template #free-label>
          <ElTooltip
            content="免费模式下任何用户或机器都可以成功授权，但按次模式不受影响"
            placement="top-start"
          >
            <span>是否免费<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
          </ElTooltip>
        </template>
        <template #trialTime="data">
          {{
            data.row.trialTime
              ? DateUtils.convertMinutesToFormattedTime(data.row.trialTime)
              : '不可试用'
          }}
          <ElButton @click="onShowSelectTrialTime" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
      </Descriptions>
    </div>
    <div v-if="app.authMode === 'user'">
      <Descriptions :collapse="false" title="绑定设备设置" :data="app" :schema="bindDeviceSchema">
        <template #bindDevice="data"
          ><ElSwitch @change="onSetBindDevice" v-model="data.row.bindDevice" />
        </template>
        <template #allowUnbind="data"
          ><ElSwitch @change="onSetAllowUnbind" v-model="data.row.allowUnbind" />
        </template>
        <template #unbindDeductTime="data"
          >{{
            data.row.unbindDeductTime
              ? DateUtils.convertMinutesToFormattedTime(data.row.unbindDeductTime)
              : '不扣时'
          }}
          <ElButton @click="onSetUnbindDeductTime" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
        <template #unbindDeductCount="data">
          {{ data.row.unbindDeductCount ? data.row.unbindDeductCount + '次' : '不扣次' }}
          <ElButton @click="onSetUnbindDeductCount" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
        <template #maxUnbindCount="data">
          {{ data.row.maxUnbindCount ? data.row.maxUnbindCount + '次' : '不限制' }}
          <ElButton @click="onSetMaxUnbindCount" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
      </Descriptions>
    </div>
    <div v-if="app.authMode === 'user' && !app.bindDevice">
      <Descriptions :collapse="false" title="多设备登录" :data="app" :schema="multiDeviceSchema">
        <template #allowMultiDevice="data"
          ><ElSwitch @change="onSetAllowMultiDevice" v-model="data.row.allowMultiDevice" />
        </template>
        <template #maxMultiDevice="data">
          {{ data.row.maxMultiDevice ? data.row.maxMultiDevice + '台' : '不限制' }}
          <ElButton @click="onSetMaxMultiDevice" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
        <template #allowForceLogin-label>
          <ElTooltip
            content="如果打开那么当设备数达到上限时新设备登录会踢掉旧设备，否则新设备登录会被拒绝"
            placement="top-start"
            raw-content
          >
            <span
              >允许强制登录<Icon style="margin-left: 3px" icon="entypo:info-with-circle"
            /></span>
          </ElTooltip>
        </template>
        <template #allowForceLogin="data">
          <ElSwitch @change="onSetAllowForceLogin" v-model="data.row.allowForceLogin" />
        </template>
      </Descriptions>
    </div>
    <div>
      <Descriptions :collapse="false" title="按次收费" :data="app" :schema="countModeSchema">
        <template #useCountMode="data">
          <ElSwitch @change="onSetUseCountMode" v-model="data.row.useCountMode" />
        </template>
        <template #allowLoginWhenCountUsedUp="data">
          <ElSwitch
            @change="onSetAllowLoginWhenCountUsedUp"
            v-model="data.row.allowLoginWhenCountUsedUp"
          />
        </template>
        <template #trialCount="data">
          {{ data.row.trialCount ? data.row.trialCount : '不可试用' }}
          <ElButton @click="onsetTrialCount" type="primary" link
            ><Icon icon="mdi:circle-edit-outline"
          /></ElButton>
        </template>
      </Descriptions>
      <ElText type="danger" style="margin-left: 10px"
        >按次收费允许您在按日期收费之外在进行扣点式收费，可用于额外的某项功能单独的收费，当应用为免费模式时按次收费不受影响</ElText
      >
    </div>
    <ElDialog
      width="500px"
      style="max-width: 90%"
      v-model="showSelectTrialTime"
      title="选择试用时间"
    >
      <div>
        <h2 style="color: #f56c6c">全部为零则禁止试用</h2>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectTrialTime.days"
          placeholder="Please input"
        >
          <template #append>天</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectTrialTime.hours"
          placeholder="Please input"
        >
          <template #append>时</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectTrialTime.minutes"
          placeholder="Please input"
        >
          <template #append>分</template>
        </ElInput>
        <div style="width: 100%; height: 40px"></div>
        <div style="right: 20px; bottom: 10px; position: absolute">
          <ElButton @click="showSelectTrialTime = false">取消</ElButton>
          <ElButton type="primary" @click="onConfirmSetTrialTime"> 确认 </ElButton>
        </div>
      </div>
    </ElDialog>

    <ElDialog
      width="500px"
      style="max-width: 90%"
      v-model="showSelectUnbindDeductTime"
      title="选择解绑扣时"
    >
      <div>
        <h2 style="color: #f56c6c">全部为零则不扣时</h2>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectUnbindDeductTime.days"
          placeholder="Please input"
        >
          <template #append>天</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectUnbindDeductTime.hours"
          placeholder="Please input"
        >
          <template #append>时</template>
        </ElInput>
        <ElInput
          type="number"
          style="margin-top: 10px"
          v-model="selectUnbindDeductTime.minutes"
          placeholder="Please input"
        >
          <template #append>分</template>
        </ElInput>
        <div style="width: 100%; height: 40px"></div>
        <div style="right: 20px; bottom: 10px; position: absolute">
          <ElButton @click="showSelectUnbindDeductTime = false">取消</ElButton>
          <ElButton type="primary" @click="onConfirmSetUnbindDeductTime"> 确认 </ElButton>
        </div>
      </div>
    </ElDialog>
  </div>
</template>
