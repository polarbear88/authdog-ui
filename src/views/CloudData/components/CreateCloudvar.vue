<script setup lang="ts">
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElTooltip, ElButton } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { unref } from 'vue'
import { createCloudvar } from '@/api/clouddata/cloudvar'

const { required } = useValidator()
const rules = {
  name: [required()],
  value: [required()],
  isPublic: [required()],
  applicationId: [required()]
}

const emit = defineEmits(['closedialog', 'success'])

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '变量名称',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入变量名称'
    }
  },
  {
    field: 'desc',
    label: '描述',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入描述 可空'
    }
  },
  {
    field: 'value',
    label: '值',
    colProps: {
      span: 24
    },
    component: 'Input',
    componentProps: {
      placeholder: '请输入值'
    }
  },
  {
    field: 'applicationId',
    label: '归属应用',
    colProps: {
      span: 24
    },
    component: 'ApplicationSelect',
    value: 0,
    componentProps: {
      zeroname: '全局'
    }
  },
  {
    field: 'isPublic',
    label: '是否公开',
    colProps: {
      span: 24
    },
    component: 'Switch',
    value: false
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

    const data = {
      name: formData?.name,
      desc: formData?.desc,
      value: formData?.value,
      isPublic: formData?.isPublic,
      applicationId: formData?.applicationId,
      isGlobal: formData?.applicationId === 0
    }
    createCloudvar(data)
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
      @register="register"
    >
      <template #applicationId-label>
        <ElTooltip
          content="若不是全局模式则只有目标应用可以获取到该变量"
          placement="top-start"
          raw-content
        >
          <span>归属应用<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
        </ElTooltip>
      </template>
      <template #isPublic-label>
        <ElTooltip
          content="如果不公开那么只有用户授权成功才能获取到该变量"
          placement="top-start"
          raw-content
        >
          <span>是否公开<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
        </ElTooltip>
      </template>
    </Form>
    <div style="right: 20px; bottom: 10px; position: absolute">
      <ElButton @click="emit('closedialog')">取消</ElButton>
      <ElButton :loading="loading" type="primary" @click="submit"> 确认 </ElButton>
    </div>
  </div>
</template>
