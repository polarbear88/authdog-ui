<script setup lang="ts">
// import { Form } from '@/components/Form'
// import { useForm } from '@/hooks/web/useForm'
// import { useValidator } from '@/hooks/web/useValidator'
// import { FormSchema } from '@/types/form'
// import { ElButton, ElInput, ElMessage, ElMessageBox } from 'element-plus'
// import { reactive, ref, unref } from 'vue'
import { getAppList, getRechargeCardType, getRechargeCardPrice } from '@/api/salerApi/rechargeCard'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElOption, ElSelect } from 'element-plus'
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

// const { required } = useValidator()
// const rules = {
//   typeId: [required()],
//   count: [required()]
// }

// const emit = defineEmits(['set-tab-click-callback'])
// const { register, elFormRef, methods } = useForm()
// const schema = reactive<FormSchema[]>([])

// const cardresult = ref('')

// emit('set-tab-click-callback', 'createRechargeCard', () => {
//   methods.delSchema('typeId')
//   methods.delSchema('count')
//   methods.delSchema('description')
//   methods.addSchema({
//     field: 'typeId',
//     label: '卡类型',
//     colProps: {
//       span: 24
//     },
//     component: 'RechargeCardTypeSelect',
//     componentProps: {
//       app: props.app,
//       zeroname: ''
//     },
//     value: 0
//   })
//   methods.addSchema({
//     field: 'count',
//     label: '创建数量 单次最多1000',
//     colProps: {
//       span: 24
//     },
//     component: 'Input',
//     componentProps: {
//       placeholder: '请输入数量',
//       type: 'number'
//     }
//   })
//   methods.addSchema({
//     field: 'description',
//     label: '同批卡密描述 可通过描述快速找到该批次卡',
//     colProps: {
//       span: 24
//     },
//     component: 'Input',
//     componentProps: {
//       placeholder: '请输入描述'
//     }
//   })
// })

// const loading = ref(false)

// const onCreate = (formData: any) => {
//   loading.value = true
//   const data = { ...formData }
//   data.count = parseInt(data.count)
//   createRechargeCard(props.app.id, data)
//     .then((res) => {
//       let str = ''
//       for (const item of res.data.cards) {
//         str += '卡号：' + item.card
//         if (item.password) {
//           str += ' 密码：' + item.password
//         }
//         str += ' 类型：' + item.cardTypeName + '\n'
//       }
//       cardresult.value = str
//       ElMessage.success('创建成功')
//     })
//     .finally(() => {
//       loading.value = false
//     })
// }

// const submit = async () => {
//   const form = unref(elFormRef)
//   await form?.validate(async (isValid) => {
//     if (!isValid) {
//       return
//     }
//     const { getFormData } = methods
//     const formData = await getFormData()
//     if (formData?.typeId <= 0) {
//       ElMessage.error('请选择卡类型')
//       return
//     }
//     ElMessageBox.confirm('确认创建' + formData?.count + '张充值卡？', '提示', {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(async () => {
//       onCreate(formData)
//     })
//   })
// }

const cardTypePrice = ref(0)
const appList = ref<any[]>([])

const currentApp = ref('')

const cardTypeList = ref<any[]>([])

const currentCardType = ref('')

const getApps = async () => {
  const res = await getAppList()
  appList.value = res.data
  cardTypeList.value = []
  currentCardType.value = ''
}
getApps()

const getCardType = () => {
  getRechargeCardType(currentApp.value).then((res) => {
    cardTypeList.value = res.data
  })
}

const onSelectApp = (val: string) => {
  currentApp.value = val
  getCardType()
}

const onSelectCardType = (val: string) => {
  currentCardType.value = val
  getRechargeCardPrice(currentApp.value, currentCardType.value).then((res) => {
    cardTypePrice.value = res.data.price
  })
}
</script>

<template>
  <div>
    <ContentWrap title="制作充值卡">
      <div>
        <p>应用</p>
        <ElSelect
          @change="onSelectApp"
          style="margin-top: 10px"
          v-model="currentApp"
          placeholder="选择应用"
        >
          <ElOption
            v-for="(item, index) in appList"
            :key="index"
            :value="item.id + ''"
            :label="item.name"
          />
        </ElSelect>
        <span
          ><ElButton
            type="primary"
            style="font-size: 20px; margin-left: 5px; margin-top: 8px"
            size="large"
            link
            :icon="Refresh"
            @click="getApps"
        /></span>
      </div>
      <div style="margin-top: 20px">
        <p>卡类型</p>
        <ElSelect
          @change="onSelectCardType"
          style="margin-top: 10px"
          v-model="currentCardType"
          placeholder="选择卡类型"
        >
          <ElOption
            v-for="(item, index) in cardTypeList"
            :key="index"
            :value="item.id + ''"
            :label="item.name"
          />
        </ElSelect>
        <p v-if="cardTypePrice" style="color: red; margin-top: 10px"
          >制卡单价：{{ cardTypePrice }}元</p
        >
      </div>
    </ContentWrap>
    <!-- <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      @register="register"
    />
    <ElButton
      style="margin-top: 15px; margin-left: 10px"
      size="large"
      :loading="loading"
      type="primary"
      @click="submit"
    >
      创建充值卡
    </ElButton>
    <div style="padding: 10px">
      创建结果：
      <ElInput
        v-model="cardresult"
        style="margin-top: 10px"
        :autosize="{ minRows: 4, maxRows: 20 }"
        type="textarea"
        placeholder="充值卡创建结果"
        readonly
      />
    </div> -->
  </div>
</template>
