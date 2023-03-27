<script setup lang="ts">
import { createRecgargeType, updateRecgargeType } from '@/api/rechargeCardType'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { NumberUtils } from '@/utils/numberUtils'
import { StringUtils } from '@/utils/stringUtils'
import { ElButton, ElTooltip } from 'element-plus'
import { PropType, reactive, ref, unref } from 'vue'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} },
  isUpdate: { type: Boolean, default: false },
  data: { type: Object, default: () => {} }
})

const { required } = useValidator()
const rules = {
  name: [required()],
  cardFormat: [required()],
  price: [required()],
  salerPrice: [required()]
}

const emit = defineEmits(['closedialog', 'success'])

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '类型名称',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入类型名称'
    },
    value: props.isUpdate ? props.data.name : ''
  },
  {
    field: 'cardFormat',
    label: '卡号格式',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入卡号格式'
    },
    value: props.isUpdate ? props.data.cardFormat : ''
  },
  {
    field: 'passwordFormat',
    label: '卡密格式',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入卡密格式'
    },
    value: props.isUpdate ? props.data.passwordFormat : ''
  },
  {
    field: 'time',
    label: '面值时间',
    colProps: {
      span: 12
    },
    component: 'YmdSelect',
    componentProps: {
      placeholder: '请输入面值时间'
    },
    value: props.isUpdate ? props.data.time : 0
  },
  {
    field: 'money',
    label: '面值次数',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入面值次数'
    },
    value: props.isUpdate ? props.data.money + '' : ''
  },
  {
    field: 'price',
    label: '价格',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入卡价格',
      type: 'number'
    },
    value: props.isUpdate ? props.data.price + '' : ''
  },
  {
    field: 'salerPrice',
    label: '代理价格',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入代理价格',
      type: 'number'
    },
    value: props.isUpdate ? props.data.salerPrice + '' : ''
  }
])

const { register, elFormRef, methods } = useForm()

const loading = ref(false)

const submit = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    loading.value = true
    const { getFormData } = methods
    const formData = await getFormData()
    let data = { ...formData }
    data = StringUtils.deleteObjectEmptyProperty(data)
    NumberUtils.allToNumber(data, ['price', 'salerPrice', 'money', 'time'])
    if (data.money === undefined) {
      data.money = 0
    }
    if (data.passwordFormat !== undefined) {
      data.isNeedPassword = true
    } else {
      data.isNeedPassword = false
    }
    if (props.isUpdate) {
      data.id = props.data.id
      updateRecgargeType(props.app.id, data)
        .then(() => {
          emit('success')
          emit('closedialog')
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      createRecgargeType(props.app.id, data)
        .then(() => {
          emit('success')
          emit('closedialog')
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

if (props.isUpdate) {
  const { delSchema } = methods
  delSchema('name')
  rules['name'] = []
}
</script>

<template>
  <div>
    <div style="margin-left: 10px" v-if="props.isUpdate">修改类型不会影响已生产的充值卡</div>
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      @register="register"
    >
      <template #cardFormat-label>
        <ElTooltip
          content="卡号格式自定义，支持变量<br />不会使用直接填 ${randhex}[32]"
          placement="top-start"
          raw-content
          ><div style="color: red"
            >卡号格式: 变量 ${uuid} ${randhex}[数量] ${randnum}[数量] ${randletter}[数量]</div
          ></ElTooltip
        >
      </template>
      <template #passwordFormat-label> 卡密格式: 变量同上，留空则不使用密码 </template>
    </Form>
    <div style="right: 20px; bottom: 10px; position: absolute">
      <ElButton @click="emit('closedialog')">取消</ElButton>
      <ElButton :loading="loading" type="primary" @click="submit"> 确认 </ElButton>
    </div>
  </div>
</template>
