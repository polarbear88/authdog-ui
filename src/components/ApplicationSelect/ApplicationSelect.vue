<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { getList } from '@/api/application'
import { ref, watch } from 'vue'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ElSelect, ElOption } from 'element-plus'
import { getAppList } from '@/api/salerApi/rechargeCard'

const props = defineProps({
  modelValue: propTypes.number.def(0),
  applist: propTypes.array.def([]),
  zeroname: propTypes.string.def(''),
  size: propTypes.string.def('default'),
  isSaler: propTypes.bool.def(false),
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

if (props.isWatchApp) {
  watch(
    () => props.modelValue,
    (val) => {
      value.value = val + ''
    }
  )
}

const optionsData = ref<ApplicationInfo[]>(props.applist as any)

const getTableList = () => {
  if (props.isSaler) {
    salerGetAppList()
    return
  }
  getList().then((res) => {
    if (res) {
      optionsData.value = res.data
    }
  })
}

const salerGetAppList = () => {
  getAppList().then((res) => {
    if (res) {
      optionsData.value = res.data
    }
  })
}

if (props.applist.length === 0) {
  getTableList()
}

const onSelect = (val: string) => {
  emit('change', Number(val))
}
</script>

<template>
  <div>
    <ElSelect :size="size as any" @change="onSelect" v-model="value" placeholder="选择应用">
      <ElOption v-if="zeroname" value="0" :label="zeroname" />
      <ElOption
        v-for="(item, index) in optionsData"
        :key="'sapp' + index"
        :value="item.id + ''"
        :label="item.name"
      />
    </ElSelect>
  </div>
</template>
