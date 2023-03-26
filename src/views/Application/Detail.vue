<script setup lang="ts">
import { ElPageHeader, ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import { getDetail } from '@/api/application'
import { useRouter } from 'vue-router'
import { BaseInfo, VersionInfo, SecurityInfo, Authorization, User, Device } from './components'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ApplicationSelect } from '@/components/ApplicationSelect'

const activeName = ref('info')
const topActiveName = ref('application')

const handleTabsClick = (tab: any, _event: any) => {
  if (callbacks[tab.paneName]) {
    callbacks[tab.paneName]()
  }
}

const setTabClickCallback = (paneName: string, callback: () => void) => {
  callbacks[paneName] = callback
}

const router = useRouter()

const callbacks = {}

const appinfo = ref<ApplicationInfo>({} as ApplicationInfo)

const getAppData = (val?: number) => {
  if (val) {
    router.push({
      name: 'Application-Detail',
      params: {
        id: val
      }
    })
    return
  }
  getDetail(router.currentRoute.value.params.id as string).then((res) => {
    appinfo.value = res.data
  })
}

const getCurrentAppId = () => {
  return parseInt(router.currentRoute.value.params.id + '')
}

const currentId = ref(getCurrentAppId())
getAppData()
</script>
<template>
  <div>
    <ElPageHeader
      @back="
        router.push({
          name: 'Application'
        })
      "
    >
      <template #content>
        <ApplicationSelect size="small" @change="getAppData" v-model="currentId" :zeroname="''" />
      </template>
    </ElPageHeader>
    <ElTabs
      tabPosition="top"
      type="border-card"
      v-model="topActiveName"
      @tab-click="handleTabsClick"
      style="margin-top: 10px"
    >
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
      <ElTabPane label="用户管理" name="user" v-if="appinfo.authMode === 'user'">
        <User @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
      </ElTabPane>
      <ElTabPane label="设备管理" name="device" v-if="appinfo.authMode === 'deviceid'">
        <Device @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
      </ElTabPane>
      <ElTabPane label="激活卡管理" name="activateCard" />
      <ElTabPane label="生产激活卡" name="makeActivateCard" />
    </ElTabs>
  </div>
</template>
