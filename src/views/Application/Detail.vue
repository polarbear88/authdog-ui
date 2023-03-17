<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import { getDetail } from '@/api/application'
import { useRouter } from 'vue-router'
import { BaseInfo } from './components'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'

const activeName = ref('info')

const handleTabsClick = (tab: any, event: any) => {
  console.log(tab, event)
}

const router = useRouter()

const appinfo = ref<ApplicationInfo>({} as ApplicationInfo)

const getAppData = () => {
  getDetail(router.currentRoute.value.params.id as string).then((res) => {
    appinfo.value = res.data
  })
}
getAppData()
</script>
<template>
  <div>
    <ElTabs type="border-card" v-model="activeName" class="demo-tabs" @tab-click="handleTabsClick">
      <ElTabPane label="基本信息" name="info">
        <BaseInfo @get-appdata="getAppData" :app="appinfo" />
      </ElTabPane>
      <ElTabPane label="授权" name="authorization">authorization</ElTabPane>
      <ElTabPane label="版本" name="version">version</ElTabPane>
      <ElTabPane label="安全" name="security">security</ElTabPane>
    </ElTabs>
  </div>
</template>
