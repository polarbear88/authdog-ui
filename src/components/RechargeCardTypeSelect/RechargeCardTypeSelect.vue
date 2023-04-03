<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { PropType, ref, watch } from 'vue'
import { ElSelect, ElOption, ElButton, ElMessage } from 'element-plus'
import { getList } from '@/api/rechargeCardType'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: propTypes.number.def(0),
  typelist: propTypes.array.def([]),
  zeroname: propTypes.string.def(''),
  size: propTypes.string.def('default'),
  app: { type: Object as PropType<ApplicationInfo>, default: () => {} },
  notShowRefresh: propTypes.bool.def(false),
  isWatchApp: propTypes.bool.def(false)
})

const emit = defineEmits(['update:modelValue', 'change'])

const value = ref(props.modelValue + '')

if (!props.zeroname && value.value === '0') {
  value.value = ''
}

watch(value, (val) => {
  emit('update:modelValue', Number(val))
})

const optionsData = ref<any[]>(props.typelist as any)

const getTableList = (refresh = false) => {
  if (!props.app.id) return
  getList(props.app.id).then((res) => {
    if (res) {
      optionsData.value = res.data
      if (refresh) {
        ElMessage.success('刷新成功')
      }
    }
  })
}

if (props.typelist.length === 0) {
  getTableList()
}

defineExpose({
  getTableList
})

if (props.isWatchApp) {
  watch(
    () => props.app,
    () => {
      console.log(12)
      getTableList()
    }
  )
}

const onSelect = (val: string) => {
  emit('change', Number(val))
}
</script>

<template>
  <div>
    <ElSelect :size="size as any" @change="onSelect" v-model="value" placeholder="选择类型">
      <ElOption v-if="zeroname" value="0" :label="zeroname" />
      <ElOption
        v-for="(item, index) in optionsData"
        :key="'stype' + index"
        :value="item.id + ''"
        :label="item.name"
      />
    </ElSelect>
    <span v-if="!notShowRefresh"
      ><ElButton
        type="primary"
        style="font-size: 20px; margin-left: 5px"
        size="large"
        link
        :icon="Refresh"
        @click="getTableList(true)"
    /></span>
  </div>
</template>
