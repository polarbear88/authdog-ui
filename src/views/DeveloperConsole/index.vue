<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useDesign } from '@/hooks/web/useDesign'
import { Warning } from '@element-plus/icons-vue'
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElStatistic,
  ElTag,
  ElText,
  ElTooltip
} from 'element-plus'
import { getBase, getLately } from '@/api/statistics'
import { ref } from 'vue'
import { getList } from '@/api/actionLog'
import { DateUtils } from '@/utils/dateUtils'
import {
  getAuthdogVersion,
  getIsOpenSourceUser,
  getProfile,
  recharge,
  rechargePro
} from '@/api/profile'
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')
const getLatelyType = ref('今日')
const baseInfo = ref<any>({})
const latelyInfo = ref<any>({})

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const actionLogList = ref<any[]>([])
const isOpenSourceUser = ref(false)

const getActionLog = () => {
  getList({
    page: page.value,
    pageSize: pageSize.value
  }).then((res) => {
    actionLogList.value = res.data.list
    total.value = res.data.total
  })
}

const profileInfo = ref<any>({})

const getProfileInfo = () => {
  getProfile().then((res) => {
    profileInfo.value = res.data
  })
}

getIsOpenSourceUser().then((res) => {
  isOpenSourceUser.value = !!res.data.isOpenSourceUser
})

getProfileInfo()

getActionLog()

const getBaseInfo = () => {
  getBase().then((res) => {
    baseInfo.value = res.data
  })
}

const getLatelyInfo = (type: string) => {
  getLately(type).then((res) => {
    latelyInfo.value = res.data
  })
}

const handleRecharge = () => {
  ElMessageBox.confirm(
    '<p style="color: #f56c6c">如果充值的类型与当前类型不符(非免费情况)，则会自动计算补偿时间并切换到目标类型</p>',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showInput: true,
      inputPlaceholder: '请输入充值卡号',
      dangerouslyUseHTMLString: true
    }
  ).then((res) => {
    if (res.value) {
      recharge(res.value).then(() => {
        ElMessage.success('充值成功')
        getProfileInfo()
      })
    }
  })
}

const handleRechargePro = () => {
  ElMessageBox.confirm('', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true,
    inputPlaceholder: '请输入充值卡号',
    dangerouslyUseHTMLString: true
  }).then((res) => {
    if (res.value) {
      rechargePro(res.value).then(() => {
        ElMessage.success('充值成功')
        getProfileInfo()
        getAuthdogVersion().then((res) => {
          authdogVersion.value = res.data.version
          proVersionInfo.value = res.data.proVersionInfo
        })
      })
    }
  })
}

const onSelectLatelyType = (t: string) => {
  let type = 'today'
  if (t === '昨日') {
    type = 'yesterday'
  }
  if (t === '7日') {
    type = '7days'
  }
  if (t === '30日') {
    type = '30days'
  }
  getLatelyInfo(type)
}

const buyurl = import.meta.env.VITE_BUY_URL

const handleOpenBuyUrl = () => {
  window.open(buyurl)
}

const handleOpenBuyProUrl = () => {
  window.open(proVersionInfo.value.buyUrl)
}

getBaseInfo()
getLatelyInfo('today')

const authdogVersion = ref({
  currentVersion: '',
  hasNew: false,
  newVersion: '',
  notice: ''
})

const proVersionInfo = ref<any>({})

getAuthdogVersion().then((res) => {
  authdogVersion.value = res.data.version
  proVersionInfo.value = res.data.proVersionInfo
})
</script>

<template>
  <div>
    <ContentWrap>
      <h2 style="font-weight: bold"
        >欢迎，{{ profileInfo.name }}
        <ElButton
          v-if="!isOpenSourceUser"
          type="primary"
          link
          style="margin-left: 10px"
          @click="handleRecharge"
          >充值</ElButton
        ><ElButton
          v-if="buyurl && !isOpenSourceUser"
          type="primary"
          link
          style="margin-left: 10px"
          @click="handleOpenBuyUrl"
          >购买充值卡</ElButton
        ></h2
      >
      <ElText
        >您当前是{{ profileInfo?.quota?.chinaName
        }}{{
          profileInfo?.quota?.name && profileInfo?.quota?.name !== 'default'
            ? '，到期时间：' + DateUtils.formatDateTime(profileInfo.quotaExpiredAt)
            : ''
        }}</ElText
      >
      <ElText style="margin-left: 10px"
        >当前配额：[应用{{ profileInfo?.quota?.maxAppCount }}个][用户{{
          profileInfo?.quota?.maxUserCount
        }}个][云函数{{ profileInfo?.quota?.maxCloudfunCount }}个][用户数据{{
          profileInfo?.quota?.maxUserDataCount
        }}条][代理{{ profileInfo?.quota?.maxSalerCount }}个]</ElText
      >
      <div style="margin-top: 5px">
        <ElText>当前系统版本：{{ authdogVersion.currentVersion }}</ElText>
        <ElText v-if="authdogVersion.hasNew" type="danger" style="margin-left: 10px"
          >有新版本 {{ authdogVersion.newVersion }}</ElText
        >
        <ElText v-if="!authdogVersion.hasNew" style="margin-left: 10px">已是最新</ElText>
      </div>
    </ContentWrap>
    <ContentWrap v-if="isOpenSourceUser" style="margin-top: 15px">
      <h2 style="font-weight: bold">
        <ElTag type="warning">Pro</ElTag>
        <span style="margin-left: 5px">开源用户Pro版本</span></h2
      >
      <ElAlert style="margin-top: 5px" type="info" v-if="isOpenSourceUser"
        >公告：{{ authdogVersion.notice }}</ElAlert
      >
      <div style="margin-top: 5px">
        <ElText
          >Pro版本目前支持 在线用户管理功能、NodeJs云函数和本机库云函数功能 更多功能开发中</ElText
        >
      </div>
      <div style="margin-top: 5px">
        <ElText
          >您的Pro版本状态：<ElText type="success" v-if="proVersionInfo.auth">{{
            proVersionInfo.isTryTime ? '试用中' : '已授权'
          }}</ElText
          ><ElText type="warning" v-if="!proVersionInfo.auth">未授权</ElText>
          <ElText style="margin-left: 5px" v-if="proVersionInfo.auth"
            >到期时间: {{ DateUtils.formatDateTime(proVersionInfo.expire) }}</ElText
          >
          <ElButton
            type="primary"
            link
            style="margin-left: 10px; margin-top: -3px"
            @click="handleRechargePro"
            >充值</ElButton
          ><ElButton
            type="primary"
            link
            style="margin-left: 10px; margin-top: -3px"
            @click="handleOpenBuyProUrl"
            >购买充值卡</ElButton
          >
        </ElText>
      </div>
    </ContentWrap>
    <ContentWrap style="margin-top: 15px" message="数据不实时，缓存60秒" title="基本数据">
      <ElRow :gutter="20" :class="prefixCls">
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic :precision="2" :prefix="'¥'" :value="baseInfo.income">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      来自代理总利润
                      <ElTooltip content="基于你手动给代理充值和扣减的统计" placement="top">
                        <ElIcon style="margin-left: 4px" :size="12">
                          <Warning />
                        </ElIcon>
                      </ElTooltip>
                    </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.appCount">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 应用数量 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.salerCount">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 代理数量 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.userCountByUserMode">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 用户模式用户总数 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.userCountByDeviceMode">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 设备模式用户总数 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="张" :value="baseInfo.unusedRechargeCardCount">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 未使用充值卡数量 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.activatedByDeviceMode">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 设备模式总已激活 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="baseInfo.activatedByUserMode">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 用户模式总已激活 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </ContentWrap>
    <ContentWrap message="数据不实时，缓存60秒" title="统计数据" style="margin-top: 15px">
      <div style="position: relative; top: -63px; left: 100px">
        <ElRadioGroup @change="onSelectLatelyType" v-model="getLatelyType" size="small">
          <ElRadioButton label="今日" />
          <ElRadioButton label="昨日" />
          <ElRadioButton label="7日" />
          <ElRadioButton label="30日" />
        </ElRadioGroup>
      </div>
      <ElRow style="margin-top: -30px" :gutter="20" justify="space-between" :class="prefixCls">
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="latelyInfo.userModeAdded">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 用户模式新增用户 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="latelyInfo.deviceModeAdded">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 设备模式新增用户 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="latelyInfo.userRecharge">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      用户充值
                      <ElTooltip content="包含用户模式和设备模式" placement="top">
                        <ElIcon style="margin-left: 4px" :size="12">
                          <Warning />
                        </ElIcon>
                      </ElTooltip>
                    </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic suffix="个" :value="latelyInfo.active">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      活跃用户
                      <ElTooltip content="包含用户模式和设备模式" placement="top">
                        <ElIcon style="margin-left: 4px" :size="12">
                          <Warning />
                        </ElIcon>
                      </ElTooltip>
                    </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </ContentWrap>
    <ContentWrap style="margin-top: 15px" title="操作日志">
      <div v-for="(item, index) in actionLogList" :key="index" style="margin-top: 3px">
        <ElText>
          <span style="color: #999"
            >{{ DateUtils.formatDateTime(item.createdAt, 'MM-DD HH:mm') }}[{{ item.ip }}]</span
          >
          <span style="margin-left: 10px; color: #409eff">操作</span>
          <span style="margin-left: 10px">{{ item.action }}</span>
          <span style="margin-left: 10px; color: #f56c6c">影响</span>
          <span style="margin-left: 10px">{{ item.affected ? item.affected : '无' }}</span>
          <span v-if="item.appname" style="margin-left: 10px; color: #e6a23c">应用</span>
          <span v-if="item.appname" style="margin-left: 10px">{{ item.appname }}</span>
        </ElText>
      </div>
      <ElPagination
        style="margin-top: 15px"
        layout="prev, pager, next, total"
        v-model:total="total"
        v-model:pageSize="pageSize"
        v-model:currentPage="page"
        @size-change="getActionLog"
        @current-change="getActionLog"
      />
    </ContentWrap>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-panel';

.@{prefix-cls} {
  &__item {
    &--peoples {
      color: #40c9c6;
    }

    &--message {
      color: #36a3f7;
    }

    &--money {
      color: #f4516c;
    }

    &--shopping {
      color: #34bfa3;
    }

    &:hover {
      :deep(.@{namespace}-icon) {
        color: #fff !important;
      }
      .@{prefix-cls}__item--icon {
        transition: all 0.38s ease-out;
      }
      .@{prefix-cls}__item--peoples {
        background: #40c9c6;
      }
      .@{prefix-cls}__item--message {
        background: #36a3f7;
      }
      .@{prefix-cls}__item--money {
        background: #f4516c;
      }
      .@{prefix-cls}__item--shopping {
        background: #34bfa3;
      }
    }
  }
}
</style>
