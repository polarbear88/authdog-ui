<script setup lang="ts">
import { createRechargeType, updateRechargeType } from '@/api/rechargeCardType'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { NumberUtils } from '@/utils/numberUtils'
import { StringUtils } from '@/utils/stringUtils'
import { ElButton } from 'element-plus'
import { PropType, reactive, ref, unref } from 'vue'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} },
  isUpdate: { type: Boolean, default: false },
  data: { type: Object, default: () => {} }
})

const { required } = useValidator()
const rules = {
  name: [required()],
  price: [required()],
  salerProfit: [required()]
}

// const currentPrice = ref(props.isUpdate ? props.data.price : 0)
// const currentSalerProfit = ref(props.isUpdate ? props.data.salerProfit : 0)
// const currentSalerPrice = ref(0)

// const calcSalerPrice = () => {
//   currentSalerPrice.value =
//     currentPrice.value - currentPrice.value * (currentSalerProfit.value / 100)
//   if (!currentSalerPrice.value || !currentPrice.value || !currentSalerProfit.value) {
//     currentSalerPrice.value = 0
//   }
// }

// calcSalerPrice()

const emit = defineEmits(['closedialog', 'success'])

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '类型名称',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入类型名称'
    },
    value: props.isUpdate ? props.data.name : ''
  },
  {
    field: 'prefix',
    label: '卡号前缀',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入卡号前缀 可空'
    },
    value: props.isUpdate ? props.data.prefix : ''
  },
  {
    field: 'isNeedPassword',
    label: '需要密码',
    colProps: {
      span: 12
    },
    component: 'Switch',
    value: props.isUpdate ? props.data.isNeedPassword : false
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
      placeholder: '请输入面值次数 可空'
    },
    value: props.isUpdate ? props.data.money + '' : ''
  },
  {
    field: 'topSalerPrice',
    label: '顶级代理价格',
    colProps: {
      span: 12
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入顶级代理价格',
      type: 'number'
    },
    value: props.isUpdate ? props.data.price + '' : ''
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
    NumberUtils.allToNumber(data, ['topSalerPrice', 'salerProfit', 'money', 'time'])
    if (data.money === undefined) {
      data.money = 0
    }
    if (props.isUpdate) {
      data.id = props.data.id
      updateRechargeType(props.app.id, data)
        .then(() => {
          emit('success')
          emit('closedialog')
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      createRechargeType(props.app.id, data)
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
    <div style="margin-left: 10px; color: #f56c6c" v-if="props.isUpdate"
      >修改类型不会影响已生产的充值卡</div
    >
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      @register="register"
    >
      <template #salerProfit-append> % </template>
    </Form>
    <div style="right: 20px; bottom: 10px; position: absolute">
      <ElButton @click="emit('closedialog')">取消</ElButton>
      <ElButton :loading="loading" type="primary" @click="submit"> 确认 </ElButton>
    </div>
  </div>
</template>
