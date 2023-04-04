<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { useDesign } from '@/hooks/web/useDesign'
import { Warning } from '@element-plus/icons-vue'
import {
  ElCard,
  ElCol,
  ElIcon,
  ElRadioButton,
  ElRadioGroup,
  ElRow,
  ElStatistic,
  ElTooltip
} from 'element-plus'
import { getBase, getLately } from '@/api/statistics'
import { ref } from 'vue'
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')
const getLatelyType = ref('今日')
const baseInfo = ref<any>({})
const latelyInfo = ref<any>({})

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

getBaseInfo()
getLatelyInfo('today')
</script>

<template>
  <div>
    <ContentWrap message="数据不实时，缓存60秒" title="基本数据">
      <ElRow :gutter="20" :class="prefixCls">
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic :prefix="'¥'" :value="baseInfo.income">
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
                <ElStatistic suffix="个" :value="baseInfo.activatedByUserMode">
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
                <ElStatistic suffix="个" :value="baseInfo.activatedByDeviceMode">
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
