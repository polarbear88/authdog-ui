<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { ref, watch } from 'vue'
import { ElRow, ElCol, ElInput } from 'element-plus'
import { DateUtils } from '@/utils/dateUtils'

const props = defineProps({
  modelValue: propTypes.number.def(0)
})

const emit = defineEmits(['update:modelValue', 'change'])

const ymd = DateUtils.getDHMSFromMinutes(props.modelValue)

const day = ref(ymd.days + '')

const hour = ref(ymd.hours + '')

const minute = ref(ymd.minutes + '')

watch(day, (val) => {
  emit(
    'update:modelValue',
    DateUtils.DHMSSum({
      days: val,
      hours: hour.value,
      minutes: minute.value
    })
  )
})

watch(hour, (val) => {
  emit(
    'update:modelValue',
    DateUtils.DHMSSum({
      days: day.value,
      hours: val,
      minutes: minute.value
    })
  )
})

watch(minute, (val) => {
  emit(
    'update:modelValue',
    DateUtils.DHMSSum({
      days: day.value,
      hours: hour.value,
      minutes: val
    })
  )
})
</script>

<template>
  <div>
    <ElRow>
      <ElCol :span="7">
        <ElInput v-model="day" placeholder="天"> <template #suffix>天</template></ElInput>
      </ElCol>
      <ElCol :offset="1" :span="7">
        <ElInput v-model="hour" placeholder="时"><template #suffix>时</template></ElInput>
      </ElCol>
      <ElCol :offset="1" :span="7">
        <ElInput v-model="minute" placeholder="分"><template #suffix>分</template></ElInput>
      </ElCol>
    </ElRow>
  </div>
</template>
