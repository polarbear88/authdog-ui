<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import * as echarts from 'echarts'
import china from '@/china.json'
import { onMounted } from 'vue'
import { ElCol, ElRadioButton, ElRadioGroup, ElRow } from 'element-plus'
import {
  getAreaStatistics,
  getBrandStatistics,
  getPeriodic,
  getUseRechargeType
} from '@/api/statistics'
import { ref } from 'vue'
import { Echart } from '@/components/Echart'
import { useDesign } from '@/hooks/web/useDesign'
import { DateUtils } from '@/utils/dateUtils'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')

let mapData: any[] = []
let tooltipMap: any = {}
let userDeviceTotal = 0

let brandMapData: any[] = []

let rechargeMapData: any[] = []

const mYecharts = () => {
  echarts.registerMap('china', china as any, {})
  let myChart = echarts.init(document.getElementById('dataMapecharts') as any)
  let chinaMap = {
    grid: {
      containLabel: true,
      top: 'middle' // 设置图表在垂直方向的位置为中间
    },
    tooltip: {
      show: true,
      formatter: function (item: any) {
        if (tooltipMap[item.name]) {
          return item.name + '：' + tooltipMap[item.name]
        } else {
          return item.name + '：' + 0
        }
      }
    },
    series: [
      {
        type: 'map',
        map: 'china',
        data: mapData
      }
    ],
    visualMap: {
      left: 'right',
      min: 0,
      max: userDeviceTotal > 100 ? userDeviceTotal : 100,
      inRange: {
        color: [
          '#E0F7FA',
          '#B3E5FC',
          '#81D4FA',
          '#4FC3F7',
          '#29B6F6',
          '#039BE5',
          '#0277BD',
          '#01579B',
          '#004D79',
          '#002E4D'
        ]
      }
    }
  }
  myChart.setOption(chinaMap)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

const getSubDate = (day: number) => {
  if (day === 0) return DateUtils.formatDateTime(undefined, 'yyyy-MM-DD')
  const time = new Date(DateUtils.formatDateTime(undefined, 'yyyy-MM-DD')).getTime()
  const newTime = time - 1000 * 60 * 60 * 24 * day
  return DateUtils.formatDateTime(new Date(newTime), 'yyyy-MM-DD')
}

const pieOptions = ref<any>({})
const rechargePieOptions = ref<any>({})
const getRechargeType = ref('7days')
const userAddBarOptions = ref<any>({})
const userAddBarStartTime = ref<string>(getSubDate(30))
const userAddBarDayCount = ref<number>(30)

const isEmptyBrand = ref(false)
const isEmptyRecharge = ref(false)

const userRechargeBarOptions = ref<any>({})
const userRechargeBarStartTime = ref<string>(getSubDate(30))
const userRechargeBarDayCount = ref<number>(30)

const currentRechargeDataType = ref('近7天')

const getUserAddedData = () => {
  const dateData: any[] = []
  for (let i = 0; i < userAddBarDayCount.value; i++) {
    dateData.push(getSubDate(i + 1))
  }
  dateData.reverse()
  const tmpData = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 50,
      right: 20,
      bottom: 20
    },
    xAxis: {
      type: 'category',
      data: dateData,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '用户数量',
        data: new Array(userAddBarDayCount.value).fill(0),
        type: 'bar'
      }
    ]
  }
  getPeriodic('USER_ADDED', userAddBarStartTime.value)
    .then((res) => {
      if (res.data && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i]
          const index = dateData.indexOf(DateUtils.formatDateTime(item.startTime, 'yyyy-MM-DD'))
          if (index !== -1) {
            tmpData.series[0].data[index] += Number(item.result)
          }
        }
      }
    })
    .finally(() => {
      userAddBarOptions.value = tmpData
    })
}

const getUserRechargeData = () => {
  const dateData: any[] = []
  for (let i = 0; i < userRechargeBarDayCount.value; i++) {
    dateData.push(getSubDate(i + 1))
  }
  dateData.reverse()
  const tmpData = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: 50,
      right: 20,
      bottom: 20
    },
    xAxis: {
      type: 'category',
      data: dateData,
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '用户数量',
        data: new Array(userRechargeBarDayCount.value).fill(0),
        type: 'bar'
      }
    ]
  }
  getPeriodic('USER_RECHARGE', userRechargeBarStartTime.value)
    .then((res) => {
      if (res.data && res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          const item = res.data[i]
          const index = dateData.indexOf(DateUtils.formatDateTime(item.startTime, 'yyyy-MM-DD'))
          if (index !== -1) {
            tmpData.series[0].data[index] += Number(item.result)
          }
        }
      }
    })
    .finally(() => {
      userRechargeBarOptions.value = tmpData
    })
}

const getProvince = (name: string) => {
  if (
    name.includes('北京') ||
    name.includes('天津') ||
    name.includes('上海') ||
    name.includes('重庆')
  ) {
    if (name.endsWith('市')) {
      return name
    } else {
      return name + '市'
    }
  }
  if (name.includes('台湾')) {
    return '台湾省'
  }
  if (name.includes('香港')) {
    return '香港特别行政区'
  }
  if (name.includes('澳门')) {
    return '澳门特别行政区'
  }
  if (name.includes('内蒙古')) {
    return '内蒙古自治区'
  }
  if (name.includes('广西')) {
    return '广西壮族自治区'
  }
  if (name.includes('西藏')) {
    return '西藏自治区'
  }
  if (name.includes('宁夏')) {
    return '宁夏回族自治区'
  }
  if (name.includes('新疆')) {
    return '新疆维吾尔自治区'
  }
  if (!name.includes('省')) {
    return name + '省'
  }
  return name
}

const getRechargeMapData = () => {
  getUseRechargeType(getRechargeType.value).then((res) => {
    rechargeMapData = []
    if (res.data) {
      isEmptyRecharge.value = res.data.length === 0
      res.data.forEach((item: any) => {
        rechargeMapData.push({
          name: item.name,
          value: parseInt(item.value)
        })
        rechargePieOptions.value = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: rechargeMapData
            }
          ],
          grid: {
            containLabel: true,
            top: 'middle' // 设置图表在垂直方向的位置为中间
          }
        }
      })
    }
  })
}

onMounted(() => {
  getAreaStatistics().then((res) => {
    if (res.data && res.data.length > 0) {
      res.data.forEach((item: any) => {
        mapData.push({
          name: getProvince(item.name),
          value: parseInt(item.value)
        })
        tooltipMap[item.name] = item.value
        userDeviceTotal += parseInt(item.value)
      })
      mYecharts()
    }
  })
  getBrandStatistics().then((res) => {
    if (res.data) {
      isEmptyBrand.value = res.data.length === 0
      res.data.forEach((item: any) => {
        brandMapData.push({
          name: item.name,
          value: parseInt(item.value)
        })
        pieOptions.value = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: brandMapData
            }
          ],
          grid: {
            containLabel: true,
            top: 'middle' // 设置图表在垂直方向的位置为中间
          }
        }
      })
    }
  })
  getUserAddedData()
  getUserRechargeData()
  getRechargeMapData()
})

const onSelectRechargeDataType = (_value: string) => {
  getRechargeType.value = _value === '近7天' ? '7days' : '30days'
  getRechargeMapData()
}
</script>

<template>
  <div>
    <ElRow :gutter="20" :class="prefixCls">
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap class="mb-20px" title="用户地区分布" message="数据不实时，缓存5分钟">
          <div id="dataMapecharts"></div>
        </ContentWrap>
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap class="mb-20px" title="用户设备品牌分布" message="数据不实时，缓存5分钟">
          <p v-if="isEmptyBrand">没有数据</p>
          <Echart :options="pieOptions" :height="400" />
        </ContentWrap>
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap class="mb-20px" title="近期新增用户">
          <Echart :options="userAddBarOptions" :height="300" />
        </ContentWrap>
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap class="mb-20px" title="近期充值用户">
          <Echart :options="userRechargeBarOptions" :height="300" />
        </ContentWrap>
      </ElCol>
      <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <ContentWrap class="mb-20px" title="充值卡类型使用" message="数据不实时，缓存5分钟">
          <div style="position: relative; top: -63px; left: 160px">
            <ElRadioGroup
              @change="onSelectRechargeDataType"
              v-model="currentRechargeDataType"
              size="small"
            >
              <ElRadioButton label="近7天" />
              <ElRadioButton label="近30天" />
            </ElRadioGroup>
          </div>
          <p v-if="isEmptyRecharge">没有数据</p>
          <Echart :options="rechargePieOptions" :height="400" />
        </ContentWrap>
      </ElCol>
    </ElRow>
  </div>
</template>

<style lang="less" scoped>
#dataMapecharts {
  width: 100%;
  height: 400px;
}
</style>
