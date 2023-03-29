<script setup lang="ts">
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { onMounted, reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElTooltip, ElButton, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { unref } from 'vue'
import { createCloudfun } from '@/api/clouddata/cloudfun'

// placeholder
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/addon/display/autorefresh'

// language
import 'codemirror/mode/javascript/javascript.js'

import Codemirror, { CmComponentRef } from 'codemirror-editor-vue3'
import type { Editor } from 'codemirror'

const { required } = useValidator()
const rules = {
  name: [required()],
  applicationId: [required()]
}

const emit = defineEmits(['closedialog', 'success'])

const schema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '函数名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入函数名称'
    },
    colProps: {
      span: 8
    }
  },
  {
    field: 'description',
    label: '描述',
    component: 'Input',
    componentProps: {
      placeholder: '请输入描述 可空'
    },
    colProps: {
      span: 8
    }
  },
  {
    field: 'applicationId',
    label: '归属应用',
    component: 'ApplicationSelect',
    value: 0,
    componentProps: {
      zeroname: '全局'
    },
    colProps: {
      span: 8
    }
  }
])

const { register, elFormRef, methods } = useForm()

const loading = ref(false)

const code =
  ref(`// js脚本示例代码，脚本不要过于复杂，脚本最大运行时间为3秒 且仅接受字符串传参和返回 最大支持10个参数
var arg1 = $0; // $0 是 传入的第一个参数
var arg2 = $1; // $1 是 传入的第二个参数
// ... 以此类推
var user = $getUser(); // 获取当前用户信息(设备模式下则获取当前设备信息)
$reduceUserBalance(100); // 扣除当前用户100次，异步的 无返回值

return "hello world"; // 返回给调用者的结果
`)

const cmComponentRef = ref<CmComponentRef>(null)
const cminstance = ref<Editor>()

const cmOptions = reactive({
  autorefresh: true,
  tabSize: 4,
  mode: 'text/javascript',
  line: true,
  viewportMargin: Infinity, //处理高度自适应时搭配使用
  highlightDifferences: true,
  autofocus: true,
  indentUnit: 2,
  smartIndent: true,
  showCursorWhenSelecting: true,
  firstLineNumber: 1,
  lineNumbers: true
})

const submit = async () => {
  if (!code.value) {
    ElMessage.error('请输入脚本')
    return
  }
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
      description: formData?.description,
      script: code.value,
      applicationId: formData?.applicationId,
      isGlobal: formData?.applicationId === 0
    }
    createCloudfun(data)
      .then(() => {
        emit('success')
        emit('closedialog')
      })
      .finally(() => {
        loading.value = false
      })
  })
}

onMounted(() => {
  cminstance.value = cmComponentRef.value?.cminstance
  cminstance.value?.focus()
  cminstance.value?.refresh()
})
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
          content="若不是全局模式则只有目标应用可以运行该函数"
          placement="top-start"
          raw-content
        >
          <span>归属应用<Icon style="margin-left: 3px" icon="entypo:info-with-circle" /></span>
        </ElTooltip>
      </template>
    </Form>
    <div
      style="
        padding-left: 10px;
        padding-right: 10px;
        position: absolute;
        bottom: 40px;
        top: 80px;
        left: 0;
        right: 0;
        direction: ltr;
      "
    >
      <Codemirror
        ref="cmComponentRef"
        style="height: calc(100% - 20px); width: 100%"
        v-model:value="code"
        :options="cmOptions"
        border
      />
    </div>
    <div style="right: 20px; bottom: 10px; position: absolute">
      <ElButton @click="emit('closedialog')">取消</ElButton>
      <ElButton :loading="loading" type="primary" @click="submit"> 确认 </ElButton>
    </div>
  </div>
</template>
