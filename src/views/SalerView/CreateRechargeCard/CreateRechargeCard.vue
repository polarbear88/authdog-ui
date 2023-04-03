<script setup lang="ts">
import {
  getAppList,
  getRechargeCardType,
  getRechargeCardPrice,
  createRecharge
} from '@/api/salerApi/rechargeCard'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElInput, ElMessage, ElMessageBox, ElOption, ElSelect } from 'element-plus'
import { ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

const loading = ref(false)

const onCreate = (data: any) => {
  loading.value = true
  createRecharge(data)
    .then((res) => {
      let str = ''
      for (const item of res.data.cards) {
        str += '卡号：' + item.card
        if (item.password) {
          str += ' 密码：' + item.password
        }
        str += ' 类型：' + item.cardTypeName + '\n'
      }
      cardresult.value = str
      ElMessage.success('创建成功')
    })
    .finally(() => {
      loading.value = false
    })
}

const submit = async () => {
  const data = {
    appid: Number(currentApp.value),
    typeId: Number(currentCardType.value),
    count: Number(countInput.value),
    description: descriptionInput.value
  }
  if (isNaN(data.appid) || isNaN(data.typeId) || isNaN(data.count)) {
    ElMessage.error('请填写完整信息')
    return
  }
  if (data.count > 1000) {
    ElMessage.error('单次最多创建1000张')
    return
  }
  if (!data.description) {
    delete (data as any).description
  }
  ElMessageBox.confirm('确认创建' + data.count + '张充值卡？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    onCreate(data)
  })
}

const cardTypePrice = ref(0)
const appList = ref<any[]>([])

const currentApp = ref('')

const cardTypeList = ref<any[]>([])

const currentCardType = ref('')

const descriptionInput = ref('')

const countInput = ref('')

const cardresult = ref('')

const getApps = async () => {
  const res = await getAppList()
  appList.value = res.data
  cardTypeList.value = []
  currentCardType.value = ''
}
getApps()

const getCardType = () => {
  currentCardType.value = ''
  cardTypePrice.value = 0
  totalPrice.value = 0
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
    sumPrice(countInput.value)
  })
}

const totalPrice = ref(0)

const sumPrice = (val: string) => {
  totalPrice.value = Number(val) * cardTypePrice.value
}
</script>

<template>
  <div>
    <ContentWrap title="制作充值卡" style="padding: 10px">
      <div>
        <p>应用</p>
        <ElSelect
          @change="onSelectApp"
          style="margin-top: 8px"
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
      <div style="margin-top: 10px">
        <p>卡类型</p>
        <ElSelect
          @change="onSelectCardType"
          style="margin-top: 8px"
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
      <div style="width: 400px; margin-top: 10px; max-width: 100%">
        <p>同批卡密描述 可通过描述快速找到该批次卡</p>
        <ElInput style="margin-top: 8px" v-model="descriptionInput" />
      </div>
      <div style="width: 400px; margin-top: 10px; max-width: 100%">
        <p>创建数量</p>
        <ElInput @input="sumPrice" style="margin-top: 8px" v-model="countInput" />
        <p style="color: red; margin-top: 8px">制作总价：{{ totalPrice }}</p>
      </div>
      <div style="margin-top: 15px">
        <ElButton @click="submit" :loading="loading" type="primary">制作充值卡</ElButton>
      </div>
      <div style="margin-top: 15px">
        创建结果：
        <ElInput
          v-model="cardresult"
          style="margin-top: 10px"
          :autosize="{ minRows: 4, maxRows: 20 }"
          type="textarea"
          placeholder="充值卡创建结果"
          readonly
        />
      </div>
    </ContentWrap>
  </div>
</template>
