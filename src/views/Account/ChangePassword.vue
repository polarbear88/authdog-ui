<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { ElButton, ElMessage } from 'element-plus'
import { reactive, unref } from 'vue'
import { changePassword } from '@/api/profile'
import md5 from 'blueimp-md5'

const schema = reactive<FormSchema[]>([
  {
    field: 'oldPassword',
    label: '旧密码',
    component: 'InputPassword',
    componentProps: {
      placeholder: '请输入旧密码'
    }
  },
  {
    field: 'newPassword',
    label: '新密码',
    component: 'InputPassword',
    componentProps: {
      placeholder: '请输入新密码'
    }
  },
  {
    field: 'confirmPassword',
    label: '确认密码',
    component: 'InputPassword',
    componentProps: {
      placeholder: '请再次输入新密码'
    }
  },
  {
    field: 'submit'
  }
])

const { register, methods, elFormRef } = useForm()

const resetForm = () => {
  unref(elFormRef)?.resetFields()
}

const handleChangePassword = async () => {
  const formData = await methods.getFormData()
  if (!formData?.oldPassword || !formData?.newPassword || !formData?.confirmPassword) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (formData?.newPassword !== formData?.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  changePassword(md5(formData?.oldPassword), formData?.newPassword).then(() => {
    ElMessage.success('修改成功')
    resetForm()
  })
}
</script>

<template>
  <div>
    <ContentWrap title="修改密码">
      <Form
        :isCol="false"
        :schema="schema"
        label-position="top"
        hide-required-asterisk
        @register="register"
      >
        <template #submit>
          <div>
            <ElButton type="primary" style="width: 120px" @click="handleChangePassword()">
              确认修改
            </ElButton>
          </div>
        </template>
      </Form>
    </ContentWrap>
  </div>
</template>
