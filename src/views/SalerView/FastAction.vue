<script setup lang="ts">
import { ApplicationSelect } from '@/components/ApplicationSelect'
import { ContentWrap } from '@/components/ContentWrap'
import { ElButton, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { setStatusByCards, rebuildByCards, findByCards } from '@/api/salerApi/rechargeCard'
import { DateUtils } from '@/utils/dateUtils'

const currentId = ref(0)
const inputcard = ref('')

const getCardsArr = () => {
  if (!inputcard.value) return []
  let cards = inputcard.value
  cards = cards.replaceAll('\r\n', '\n')
  cards = cards.replaceAll(':', '：')
  const cardsArr = cards.split('\n')
  const resArr: string[] = []
  for (let item of cardsArr) {
    if (item.includes('卡号：')) {
      if (item.includes('密码：')) {
        resArr.push(item.substring(item.indexOf('卡号：') + 3, item.indexOf('密码：')).trim())
      } else if (item.includes('类型：')) {
        resArr.push(item.substring(item.indexOf('卡号：') + 3, item.indexOf('类型：')).trim())
      } else {
        resArr.push(item.substring(item.indexOf('卡号：') + 3).trim())
      }
    } else {
      if (item.trim()) {
        resArr.push(item.trim())
      }
    }
  }
  return resArr
}

const checkSelectApp = () => {
  if (!currentId.value) {
    ElMessage.error('请选择应用')
    return false
  }
  return true
}

const onFrozen = () => {
  if (!checkSelectApp()) return
  const cardsArr = getCardsArr()
  if (!cardsArr.length) {
    ElMessage.error('请输入充值卡号')
    return
  }
  ElMessageBox.confirm(`确定要冻结？`, '冻结充值卡', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    setStatusByCards(currentId.value, cardsArr, 'frozen').then((res) => {
      ElMessage.success('冻结成功，影响' + res.data.affectedCount + '张卡')
    })
  })
}

const onUnFrozen = () => {
  if (!checkSelectApp()) return
  const cardsArr = getCardsArr()
  if (!cardsArr.length) {
    ElMessage.error('请输入充值卡号')
    return
  }
  ElMessageBox.confirm(`确定要解除冻结？`, '解冻充值卡', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    setStatusByCards(currentId.value, cardsArr, 'unused').then((res) => {
      ElMessage.success('解冻成功，影响' + res.data.affectedCount + '张卡')
    })
  })
}

const onRebuild = () => {
  if (!checkSelectApp()) return
  const cardsArr = getCardsArr()
  if (!cardsArr.length) {
    ElMessage.error('请输入充值卡号')
    return
  }
  ElMessageBox.confirm(
    '为了使您能找到重新生成的充值卡，您必须输入一个描述文本，重新生成的充值卡的描述会被设置为输入的内容，您可以通过描述快速找到这些充值卡',
    '重新生成',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showInput: true
    }
  ).then(async (res) => {
    if (!res.value) {
      ElMessage.error('请输入描述')
      return
    }
    rebuildByCards(currentId.value, cardsArr, res.value).then((res) => {
      ElMessage.success('重新生成成功，影响' + res.data.affectedCount + '张卡')
    })
  })
}
const getStatusText = (status: string) => {
  switch (status) {
    case 'unused':
      return '未使用'
    case 'used':
      return '已使用'
    case 'frozen':
      return '已冻结'
    default:
      return '未知'
  }
}

const OnFind = () => {
  if (!checkSelectApp()) return
  const cardsArr = getCardsArr()
  if (!cardsArr.length) {
    ElMessage.error('请输入充值卡号')
    return
  }
  findByCards(currentId.value, cardsArr).then((res) => {
    const data = res.data || []
    let str = ''
    for (const card of cardsArr) {
      const find = data.find((item: any) => item.card === card)
      if (find) {
        str += `卡号：${find.card}`
        if (find.password) str += ` 密码：${find.password}`
        str += ` 类型：${find.cardTypeName}`
        str += ` 状态：${getStatusText(find.status)}`
        if (find.status === 'used') str += ` 使用时间：${DateUtils.formatDateTime(find.useTime)}`
        if (find.status === 'used') str += ` 使用者：${find.userName}`
        str += '\n'
      } else {
        str += `卡号：${card} 未找到 \n`
      }
    }
    inputcard.value = str
  })
}
</script>

<template>
  <div>
    <ContentWrap title="充值卡快速操作">
      <h2>在此可以输入充值卡号然后选择应用进行快速操作</h2>
      <div style="margin-top: 15px">
        <span>应用</span>
        <ApplicationSelect
          :is-saler="true"
          style="margin-top: 10px"
          v-model="currentId"
          :zeroname="''"
        />
        <br />
        <span>充值卡号</span>
        <ElInput
          style="margin-top: 10px"
          v-model="inputcard"
          :autosize="{ minRows: 10, maxRows: 20 }"
          type="textarea"
          placeholder="充值卡"
        />
        <p style="color: #f56c6c; font-size: 14px; margin-top: 10px"
          >充值卡支持：`卡号：xx 密码：xx 类型：xx`，`卡号：xx
          类型：xx`，`卡号：xx`格式，或直接每行填入一个卡号</p
        >
        <br />
        <div style="margin-top: 10px">
          <ElButton type="success" @click="OnFind">检查</ElButton>
          <ElButton type="primary" @click="onFrozen">冻结</ElButton>
          <ElButton type="success" @click="onUnFrozen">解除冻结</ElButton>
          <ElButton type="warning" @click="onRebuild">重新生成卡号</ElButton>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>
