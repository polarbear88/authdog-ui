<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import * as echarts from 'echarts'
import china from '@/china.json'
import { onMounted } from 'vue'
import { ElCol, ElRow } from 'element-plus'
import { getAreaStatistics, getBrandStatistics } from '@/api/statistics'
import { ref } from 'vue'
import { Echart } from '@/components/Echart'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')

let mapData: any[] = []
let tooltipMap: any = {}
let userDeviceTotal = 0

let brandMapData: any[] = []

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

let pieOptions = ref<any>({})

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
    if (res.data && res.data.length > 0) {
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
})
</script>

<template>
  <div>
    <ElRow :gutter="20" :class="prefixCls">
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap title="用户地区分布" message="数据不实时，缓存5分钟">
          <div id="dataMapecharts"></div>
        </ContentWrap>
      </ElCol>
      <ElCol :xl="12" :lg="12" :md="12" :sm="12" :xs="24">
        <ContentWrap title="用户设备品牌分布" message="数据不实时，缓存5分钟">
          <Echart :options="pieOptions" :height="400" />
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
