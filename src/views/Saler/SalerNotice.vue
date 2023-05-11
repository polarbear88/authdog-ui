<script setup lang="ts">
import { getNotice, setNotice } from '@/api/saler'
import { Editor, EditorExpose } from '@/components/Editor'
import { ElAlert, ElButton, ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { ref, unref } from 'vue'

const editorRef = ref<typeof Editor & EditorExpose>()

onMounted(async () => {
  const editor = await unref(editorRef)?.getEditorRef()
  getNotice().then((res) => {
    editor?.setHtml(res.data)
  })
})

const onSave = async () => {
  const editor = await unref(editorRef)?.getEditorRef()
  setNotice(editor?.getHtml() as string).then(() => {
    ElMessage.success('保存成功')
  })
}
</script>
<template>
  <div>
    <ElAlert type="warning" description="目前不支持上传图片，但支持引用网络图片" show-icon />
    <div style="margin-top: 10px">
      <Editor ref="editorRef" />
    </div>
    <div style="margin-top: 10px">
      <ElButton @click="onSave" type="primary">保存</ElButton>
    </div>
  </div>
</template>
