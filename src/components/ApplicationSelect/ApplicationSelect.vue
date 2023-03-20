<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { getList } from '@/api/application'
import { ref, watch } from 'vue'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ElSelect, ElOption } from 'element-plus'

const props = defineProps({
  modelValue: propTypes.number.def(0),
  applist: propTypes.array.def([]),
  zeroname: propTypes.string.def('')
})

const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue + '')

watch(value, (val) => {
  emit('update:modelValue', parseInt(val))
})

const optionsData = ref<ApplicationInfo[]>(props.applist as any)

const getTableList = () => {
  getList().then((res) => {
    if (res) {
      optionsData.value = res.data
    }
  })
}

if (props.applist.length === 0) {
  getTableList()
}
</script>

<template>
  <div>
    <ElSelect v-model="value" placeholder="选择应用">
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
