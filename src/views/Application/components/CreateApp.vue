<script setup lang="ts">
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElTooltip, ElButton } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { unref } from 'vue'
import { createApplication } from '@/api/application'

const { required } = useValidator()
const rules = {
  name: [required()],
  version: [required()],
  cryptoMode: [required()],
  authMode: [required()]
}

const emit = defineEmits(['closedialog', 'success'])

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '应用名称',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入应用名称'
    }
  },
  {
    field: 'version',
    label: '应用版本',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入应用版本'
    }
  },
  {
    field: 'cryptoMode',
    label: '加密模式',
    colProps: {
      span: 24
    },
    component: 'Select',
    value: 'ecdh',
    componentProps: {
      placeholder: '请选择加密模式',
      clearable: false,
      options: [
        {
          label: '无加密「不安全」',
          value: 'none'
        },
        {
          label: 'AES加密「弱安全」',
          value: 'aes'
        },
        {
          label: 'RSA加密「高安全」',
          value: 'rsa'
        },
        {
          label: 'ECDH加密「极高安全」',
          value: 'ecdh'
        },
        {
          label: '__samenc_test',
          value: 'samenc'
        }
      ]
    }
  },
  {
    field: 'authMode',
    label: '授权模式',
    colProps: {
      span: 24
    },
    component: 'Select',
    value: 'user',
    componentProps: {
      placeholder: '请选择授权模式',
      clearable: false,
      options: [
        {
          label: '用户模式',
          value: 'user'
        },
        {
          label: '设备ID模式',
          value: 'deviceid'
        }
      ]
    }
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
    createApplication(formData)
      .then(() => {
        emit('success')
        emit('closedialog')
      })
      .finally(() => {
        loading.value = false
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
      size="large"
      @register="register"
    >
      <template #authMode-label>
        <ElTooltip
          content="设备ID模式：设备ID授权，不需要用户登录，适用于设备类应用<br />用户模式：用户账号密码登录授权且用户需要注册，适用于用户类应用(用户模式支持绑定/解绑设备)"
          placement="top-start"
          raw-content
        >
          <span>授权模式<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
        </ElTooltip>
      </template>
    </Form>
    <div style="right: 20px; bottom: 10px; position: absolute">
      <ElButton @click="emit('closedialog')">取消</ElButton>
      <ElButton :loading="loading" type="primary" @click="submit"> 确认 </ElButton>
    </div>
  </div>
</template>
