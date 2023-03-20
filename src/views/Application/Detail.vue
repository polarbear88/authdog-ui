<script setup lang="ts">
import { ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import { getDetail } from '@/api/application'
import { useRouter } from 'vue-router'
import { BaseInfo, VersionInfo, SecurityInfo, Authorization } from './components'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'

const activeName = ref('info')
const topActiveName = ref('application')

// const handleTabsClick = (tab: any, event: any) => {
//   console.log(tab, event)
// }

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
    <ElTabs tabPosition="top" type="border-card" v-model="topActiveName">
      <ElTabPane label="应用管理" name="application">
        <ElTabs tabPosition="top" v-model="activeName">
          <ElTabPane label="应用信息" name="info">
            <BaseInfo @get-appdata="getAppData" :app="appinfo" />
            <VersionInfo @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="授权" name="authorization">
            <Authorization @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="安全" name="security">
            <SecurityInfo @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
        </ElTabs>
      </ElTabPane>
      <ElTabPane label="用户管理" name="user" />
      <ElTabPane label="设备管理" name="deviceid" />
      <ElTabPane label="激活卡管理" name="activateCard" />
      <ElTabPane label="生产激活卡" name="makeActivateCard" />
    </ElTabs>
  </div>
</template>
