<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { CirclePlus } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { reactive, ref, unref } from 'vue'
import { Form } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { FormSchema } from '@/types/form'
import { useValidator } from '@/hooks/web/useValidator'
import { getList, createEntryLink, deleteEntryLink } from '@/api/entryLink'

const showCreateLink = ref(false)
const { register, methods, elFormRef } = useForm()

const { required } = useValidator()
const createRules = {
  name: [required()],
  type: [required()]
}

const handleCreate = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (!isValid) {
      return
    }
    const { getFormData } = methods
    const formData = await getFormData()
    createEntryLink(formData?.name, formData?.type)
      .then(() => {
        getTableList()
        ElMessage.success('创建成功')
      })
      .finally(() => {
        showCreateLink.value = false
      })
  })
}

const linkArr = ref<any[]>([])

const getTableList = async () => {
  const res = await getList()
  linkArr.value = res.data
}

getTableList()

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '名称'
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'type',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '登录',
          value: 'login'
        },
        {
          label: '注册',
          value: 'register'
        }
      ]
    },
    value: 'login',
    colProps: {
      span: 24
    }
  },
  {
    field: 'submit'
  }
])

const getlink = (token: string, type: string) => {
  return `${window.location.origin}/#/${
    type === 'login' ? 'salerLogin' : 'salerRegister'
  }?token=${token}`
}

const handleDeleteEntryLink = (token: string) => {
  ElMessageBox.confirm('此操作将永久删除该链接, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteEntryLink(token).then(() => {
        getTableList()
        ElMessage.success('删除成功')
      })
    })
    .catch(() => {})
}
</script>

<template>
  <div>
    <ContentWrap title="代理入口链接">
      <div>
        <h1>您可以在此管理你的代理的登录入口和注册入口</h1>
        <h1>你可以创建多个入口链接，多个注册入口链接有助于您管理代理注册来源</h1>
        <h1>如果你没有创建任何链接则代理无法注册或登录</h1>
      </div>
      <div style="margin-top: 10px">
        <ElButton type="primary" @click="showCreateLink = true" :icon="CirclePlus"
          >创建链接</ElButton
        >
      </div>
      <div style="margin-top: 20px">
        <h1 style="font-size: large">已创建的链接</h1>
        <div style="margin-top: 20px">
          <div style="margin-top: 8px" v-for="(item, index) in linkArr" :key="index">
            <span>名称：{{ item.name }}</span>
            <span style="margin-left: 10px">{{
              item.type === 'login' ? '   登录链接：' : '注册链接：'
            }}</span>
            <span
              ><a style="color: #409eff" :href="getlink(item.token, item.type)">{{
                getlink(item.token, item.type)
              }}</a></span
            >
            <span style="margin-left: 12px"
              ><ElButton @click="handleDeleteEntryLink(item.token)" link type="danger"
                >删除</ElButton
              ></span
            >
          </div>
        </div>
      </div>
    </ContentWrap>
    <Dialog style="max-width: 650px" v-model="showCreateLink" title="创建链接">
      <Form
        :rules="createRules"
        label-position="top"
        :schema="schema"
        hide-required-asterisk
        @register="register"
      >
        <template #submit>
          <div>
            <ElButton type="primary" @click="handleCreate" style="width: 120px"> 提交 </ElButton>
          </div>
        </template>
      </Form>
    </Dialog>
  </div>
</template>
