<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { getProfile, setSubordinatePrice } from '@/api/salerApi/profile'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { ref } from 'vue'
import { CloseBold } from '@element-plus/icons-vue'
import { ApplicationSelect } from '@/components/ApplicationSelect'
import { RechargeCardTypeSelect } from '@/components/RechargeCardTypeSelect'

const subordinateConfig = ref<any[]>([])

const getSubordinateConfig = async () => {
  const res = await getProfile()
  subordinateConfig.value = res.data.subordinatePrice
}

getSubordinateConfig()

const appSelectChange = (index: number) => {
  return (val: any) => {
    subordinateConfig.value[index].appid = val
    subordinateConfig.value[index].cardTypeId = 0
  }
}

const onAddConfig = () => {
  subordinateConfig.value.push({
    appid: 0,
    cardTypeId: 0,
    percentage: 0
  })
}

const onSave = async () => {
  const data = subordinateConfig.value.map((item: any) => {
    return {
      appid: item.appid,
      cardTypeId: item.cardTypeId,
      percentage: Number(item.percentage)
    }
  })

  if (data.length === 0) {
    ElMessage.error('配置未完成，请检查')
    return
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].appid === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
    if (data[i].cardTypeId === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
    if (data[i].percentage === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
  }

  const uniqueValues = new Set()
  data.filter((item) => {
    if (uniqueValues.has(item['cardTypeId'])) {
      return false
    } else {
      uniqueValues.add(item['cardTypeId'])
      return true
    }
  })
  if (uniqueValues.size !== data.length) {
    ElMessage.error('配置重复，请检查')
    return
  }

  setSubordinatePrice(data)
    .then(() => {
      ElMessage.success('保存成功')
    })
    .catch(() => {})
    .finally(() => {})
}

const onDelConfig = (index: number) => {
  subordinateConfig.value.splice(index, 1)
}
</script>

<template>
  <div>
    <ContentWrap title="下级代理溢价配置">
      <h2>您必须配置每种卡类型对于下级代理的溢价后您的下级代理才能正常产卡</h2>
      <h2
        >下级代理溢价是基于您当前制卡价格的百分比，例如你设置下级代理溢价为30%，那么若您制卡价格为100，您的下级代理制卡价格则是130，其中30元会进您的账户，算作收益</h2
      >
      <div style="margin-top: 15px">
        <span style="margin-left: 10px">应用</span>
        <span style="margin-left: 160px">卡类型</span>
        <span style="margin-left: 160px">溢价百分比</span>
        <div style="margin-top: 10px" v-for="(_item, index) in subordinateConfig" :key="index">
          <ApplicationSelect
            @change="appSelectChange(index)"
            style="display: inline-block; margin-left: 8px"
            :is-saler="true"
            :zeroname="''"
            v-model="subordinateConfig[index].appid"
            :is-watch-app="true"
          />
          <RechargeCardTypeSelect
            style="display: inline-block; margin-left: 8px"
            :is-saler="true"
            :is-watch-value="true"
            :isWatchApp="true"
            :notShowRefresh="true"
            :zeroname="''"
            :app="{ id: subordinateConfig[index].appid } as any"
            v-model="subordinateConfig[index].cardTypeId"
          />
          <div style="display: inline-block; margin-left: 8px">
            <ElInput
              v-model="subordinateConfig[index].percentage"
              type="number"
              placeholder="溢价百分比"
            >
              <template #append>%</template>
            </ElInput>
          </div>
          <ElButton
            @click="onDelConfig(index)"
            style="margin-left: 8px"
            size="small"
            circle
            type="danger"
            :icon="CloseBold"
          />
        </div>
        <div style="margin-left: 8px; margin-top: 15px">
          <ElButton @click="onAddConfig">添加配置</ElButton>
          <ElButton type="primary" @click="onSave">保存</ElButton>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>
