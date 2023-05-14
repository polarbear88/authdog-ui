<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElCard, ElCol, ElIcon, ElRow, ElSwitch, ElTag, ElText } from 'element-plus'
import { ApplicationInfo } from '@/api/types/ApplicationInfo'
import { getList } from '@/api/application'
import { useRouter } from 'vue-router'
import { CirclePlus, VideoPause, VideoPlay } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { CreateApp } from './components'
import { DateUtils } from '@/utils/dateUtils'

const showCreateApp = ref(false)

let tableDataList = ref<ApplicationInfo[]>([])

const getTableList = () => {
  getList()
    .catch(() => {})
    .finally(() => {
      // loading.value = false
    })
    .then((res) => {
      if (res) {
        tableDataList.value = res.data
      }
    })
}

getTableList()

const router = useRouter()

const toDetail = (id: number) => {
  router.push({
    name: 'Application-Detail',
    params: {
      id
    }
  })
}

const actionFn = (id: number) => {
  toDetail(id)
}
</script>

<template>
  <div>
    <div
      style="display: inline-block; padding-left: 10px; margin-top: 10px"
      v-for="item in tableDataList"
      :key="item.id"
    >
      <ElCard
        style="width: 340px; height: 330px"
        :body-style="{
          paddingTop: '15px',
          paddingLeft: '15px',
          paddingBottom: '10px',
          paddingRight: '15px'
        }"
        shadow="hover"
      >
        <ElRow>
          <ElCol :span="24">
            <ElText style="font-size: 18px; font-weight: 400" size="large"
              ><ElIcon v-if="item.status === 'published'" style="margin-right: 5px; color: #409eff"
                ><VideoPlay
              /></ElIcon>
              <ElIcon v-if="item.status !== 'published'" style="margin-right: 5px; color: #e6a23c">
                <VideoPause
              /></ElIcon>
              {{ item.name }}</ElText
            >
          </ElCol>
          <ElCol style="padding-top: 10px; margin-top: 10px">
            <ElText size="small" style="float: left">应用ID</ElText>
            <ElText size="small" style="float: right">{{ item.id }}</ElText>
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">状态</ElText>
            <ElTag
              size="small"
              style="float: right"
              v-if="item.status === 'published' && !item.deactivated"
              type="success"
              >正常</ElTag
            >
            <ElTag
              size="small"
              style="float: right"
              v-if="item.status === 'disabled' && !item.deactivated"
              type="warning"
              >禁用</ElTag
            >
            <ElTag size="small" style="float: right" v-if="item.deactivated" type="danger"
              >停用</ElTag
            >
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">应用版本</ElText>
            <ElText size="small" style="float: right">{{ item.version }}</ElText>
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">创建时间</ElText>
            <ElText size="small" style="float: right">{{
              DateUtils.formatDateTime(item.createdAt)
            }}</ElText>
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">加密模式</ElText>
            <ElText size="small" style="float: right">{{
              item.cryptoMode === 'none' ? '无' : item.cryptoMode.toUpperCase()
            }}</ElText>
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">授权模式</ElText>
            <ElText size="small" style="float: right">{{
              item.authMode === 'user' ? '用户模式' : '设备ID模式'
            }}</ElText>
          </ElCol>
          <ElCol style="padding-top: 10px">
            <ElText size="small" style="float: left">强制升级</ElText>
            <ElSwitch
              @change="() => (item.forceUpgrade = !item.forceUpgrade)"
              v-model="item.forceUpgrade"
              size="small"
              style="float: right"
            />
          </ElCol>
          <ElCol style="padding: 10px; margin-top: 10px">
            <ElButton @click="actionFn(item.id)" style="width: 100%" type="primary">管理</ElButton>
          </ElCol>
        </ElRow>
      </ElCard>
    </div>

    <div style="display: inline-block; padding-left: 10px; margin-top: 10px">
      <ElCard
        style="width: 340px; height: 330px"
        :body-style="{
          paddingTop: '15px',
          paddingLeft: '15px',
          paddingBottom: '10px',
          paddingRight: '15px'
        }"
        shadow="hover"
      >
        <div style="text-align: center; margin-top: 125px">
          <ElButton @click="showCreateApp = true" link type="primary" :icon="CirclePlus"
            >创建应用</ElButton
          >
        </div>
      </ElCard>
    </div>
    <div style="height: 40px; width: 100%"></div>
    <div>
      <Dialog
        :fullscreen="false"
        style="width: 680px; max-width: 80%"
        v-model="showCreateApp"
        title="创建应用"
      >
        <CreateApp @success="getTableList" @closedialog="showCreateApp = false" />
      </Dialog>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
