<script setup lang="ts">
import { getNotices, getProfile } from '@/api/salerApi/profile'
import { getAppList } from '@/api/salerApi/rechargeCard'
import { getBaseStatistics } from '@/api/salerApi/statistics'
import { ContentWrap } from '@/components/ContentWrap'
import { useDesign } from '@/hooks/web/useDesign'
import { ElCard, ElCol, ElRow, ElStatistic, ElText } from 'element-plus'
import { ref } from 'vue'
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')

const userProfile = ref<any>({})
const baseInfo = ref<any>({})
const appList = ref<any>([])
const developerNotice = ref<any>('')
const parentNotice = ref<any>('')

const getBaseInfo = async () => {
  const res = await getBaseStatistics()
  baseInfo.value = res.data
}

const getAplicationpList = async () => {
  const res = await getAppList()
  appList.value = res.data
}

const getUserProfile = async () => {
  const res = await getProfile()
  res.data.balance = Number(res.data.balance)
  userProfile.value = res.data
}

getNotices().then((res) => {
  developerNotice.value = res.data.developer || '无公告'
  parentNotice.value = res.data.parent || '无公告'
})

getUserProfile()
getBaseInfo()
getAplicationpList()
</script>

<template>
  <div>
    <ContentWrap title="基本数据">
      <ElRow :gutter="20" :class="prefixCls">
        <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
          <ElCard shadow="hover" class="mb-20px">
            <div :class="`${prefixCls}__item flex justify-between`">
              <div class="flex flex-col justify-between">
                <ElStatistic :precision="2" :prefix="'¥'" :value="userProfile.balance">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 余额 </div>
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
                <ElStatistic suffix="个" :value="appList.length">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 授权应用数量 </div>
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
                <ElStatistic suffix="个" :value="baseInfo.subordinateCount">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 下级代理数量 </div>
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
                <ElStatistic suffix="张" :value="baseInfo.unusedCardCount">
                  <template #title>
                    <div style="display: inline-flex; align-items: center"> 未使用充值卡数量 </div>
                  </template>
                </ElStatistic>
              </div>
            </div>
          </ElCard>
        </ElCol>
      </ElRow>
    </ContentWrap>
    <ElRow>
      <ElCol :span="12" style="padding-right: 4px">
        <ContentWrap style="margin-top: 20px" title="开发者公告">
          <div class="scrollable-div">
            <div class="scrollable-content" v-html="developerNotice"></div>
          </div>
        </ContentWrap>
      </ElCol>
      <ElCol :span="12" style="padding-left: 4px">
        <ContentWrap style="margin-top: 20px" title="上级代理公告">
          <div class="scrollable-div">
            <div class="scrollable-content" v-html="parentNotice"></div>
          </div>
        </ContentWrap>
      </ElCol>
    </ElRow>
    <ContentWrap style="margin-top: 20px" title="授权应用">
      <div v-for="(item, index) in appList" :key="index" style="margin-top: 10px">
        应用名称：{{ item.name }}
      </div>
    </ContentWrap>
    <ContentWrap style="margin-top: 20px" title="代理说明">
      <div class="mb-20px">
        <ElText>1. 代理商可以发展下级，在“下级代理”页面进行管理。</ElText>
        <br />
        <ElText>2. 您可以在“下级代理入口”中创建您的下级代理专属注册链接或手动添加下级代理。</ElText>
        <br />
        <ElText
          >3.
          若您有下级代理则您必须在“下级代理价格”中配置每种卡类型的溢价百分比，否则您的下级将无法制卡。</ElText
        >
        <br />
        <ElText
          >4.
          您配置的溢价百分比为您的收入，例如你的制卡价如果是100元，溢价配置为30%，则下级代理制卡价为130，其中30元是您的收入。</ElText
        >
        <br />
        <ElText>5. 您可以在“制作充值卡”页面选择对应的应用和卡类型来查询您的制卡价格</ElText>
      </div>
    </ContentWrap>
  </div>
</template>

<style lang="less" scoped>
.scrollable-div {
  height: 295px;
  overflow: hidden;
  position: relative;
}
.scrollable-content {
  width: 100%;
  height: 100%;
  overflow-y: scroll; /* 允许内容纵向滚动 */
  // padding-right: 17px; /* 增加右侧填充，以防止内容超出div时出现滚动条 */
}

.scrollable-div::-webkit-scrollbar {
  display: none;
}
</style>
