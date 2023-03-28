<script setup lang="ts">
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { ElButton, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { PropType, reactive, ref, unref } from 'vue'
import { createRechargeCard } from '@/api/rechargeCard'

const props = defineProps({
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} }
})

const { required } = useValidator()
const rules = {
  typeId: [required()],
  count: [required()]
}

const emit = defineEmits(['set-tab-click-callback'])
const { register, elFormRef, methods } = useForm()
const schema = reactive<FormSchema[]>([])

const cardresult = ref('')

emit('set-tab-click-callback', 'createRechargeCard', () => {
  methods.delSchema('typeId')
  methods.delSchema('count')
  methods.delSchema('description')
  methods.addSchema({
    field: 'typeId',
    label: '卡类型',
    colProps: {
      span: 24
    },
    component: 'RechargeCardTypeSelect',
    componentProps: {
      app: props.app,
      zeroname: ''
    },
    value: 0
  })
  methods.addSchema({
    field: 'count',
    label: '创建数量 单次最多1000',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入数量',
      type: 'number'
    }
  })
  methods.addSchema({
    field: 'description',
    label: '同批卡密描述 可通过描述快速找到该批次卡',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入描述'
    }
  })
})

const loading = ref(false)

const onCreate = (formData: any) => {
  loading.value = true
  const data = { ...formData }
  data.count = parseInt(data.count)
  createRechargeCard(props.app.id, data)
    .then((res) => {
      let str = ''
      for (const item of res.data.cards) {
        str += '卡号：' + item.card
        if (item.password) {
          str += ' 密码：' + item.password
        }
        str += ' 类型：' + item.cardTypeName + '\n'
      }
      cardresult.value = str
      ElMessage.success('创建成功')
    })
    .finally(() => {
      loading.value = false
    })
}

const submit = async () => {
  const form = unref(elFormRef)
  await form?.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    const { getFormData } = methods
    const formData = await getFormData()
    if (formData?.typeId <= 0) {
      ElMessage.error('请选择卡类型')
      return
    }
    ElMessageBox.confirm('确认创建' + formData?.count + '张充值卡？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      onCreate(formData)
    })
  })
}
</script>

<template>
  <div>
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      @register="register"
    />
    <ElButton
      style="margin-top: 15px; margin-left: 10px"
      size="large"
      :loading="loading"
      type="primary"
      @click="submit"
    >
      创建充值卡
    </ElButton>
    <div style="padding: 10px">
      创建结果：
      <ElInput
        v-model="cardresult"
        style="margin-top: 10px"
        :autosize="{ minRows: 4, maxRows: 20 }"
        type="textarea"
        placeholder="充值卡创建结果"
        readonly
      />
    </div>
  </div>
</template>
