<script setup lang="ts">
import { ElButton, ElMessageBox, ElPageHeader, ElTabPane, ElTabs } from 'element-plus'
import { ref } from 'vue'
import { getDetail, deleteApp } from '@/api/application'
import { useRouter } from 'vue-router'
import {
  BaseInfo,
  VersionInfo,
  SecurityInfo,
  Authorization,
  User,
  Device,
  RechargeCardType,
  CreateRechargeCard,
  RechargeCardList,
  CustomSecurity
} from './components'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { ApplicationSelect } from '@/components/ApplicationSelect'
import md5 from 'blueimp-md5'

const activeName = ref('info')
const activeNameRecharge = ref('rechargeCard')
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
  return Number(router.currentRoute.value.params.id + '')
}

const currentId = ref(getCurrentAppId())
getAppData()

const onDeleteApp = () => {
  ElMessageBox.confirm(
    `<p style="color: #f56c6c">注意：您正在删除应用${appinfo.value.name}，一旦删除应用则与之关联的数据都将被删除且无法找回，包括 用户、设备、用户数据、用户财产明细、充值卡、卡类型、用户反馈、用户设备统计等</p><p>确认请输入您的登录密码</p>`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true,
      showInput: true,
      inputType: 'password',
      inputPlaceholder: '确认请输入密码'
    }
  ).then((input) => {
    deleteApp(appinfo.value.id, md5(input.value))
      .then(() => {
        router.push({
          name: 'Application'
        })
      })
      .catch(() => {})
  })
}
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
            <ElButton
              @click="onDeleteApp"
              style="float: right; margin-right: 8px; margin-top: 15px"
              type="danger"
              >删除应用</ElButton
            >
          </ElTabPane>
          <ElTabPane label="授权" name="authorization">
            <Authorization @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="通讯加密" name="security">
            <SecurityInfo @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="自定义加密" name="custom_security">
            <CustomSecurity @get-appdata="getAppData" :app="appinfo" />
          </ElTabPane>
        </ElTabs>
      </ElTabPane>
      <ElTabPane label="用户管理" name="user" v-if="appinfo.authMode === 'user'">
        <User @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
      </ElTabPane>
      <ElTabPane label="设备管理" name="device" v-if="appinfo.authMode === 'deviceid'">
        <Device @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
      </ElTabPane>
      <ElTabPane label="充值卡管理" name="rechargeCard">
        <ElTabs tabPosition="top" v-model="activeNameRecharge" @tab-click="handleTabsClick">
          <ElTabPane label="卡管理" name="rechargeCard">
            <RechargeCardList @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="卡类型管理" name="rechargeCardType">
            <RechargeCardType @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
          </ElTabPane>
          <ElTabPane label="生产卡" name="createRechargeCard">
            <CreateRechargeCard @set-tab-click-callback="setTabClickCallback" :app="appinfo" />
          </ElTabPane>
        </ElTabs>
      </ElTabPane>
    </ElTabs>
  </div>
</template>
