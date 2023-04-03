<script setup lang="ts">
import {
  getList,
  createSalerRoles,
  setSalerRoleConfig,
  deleteSalerRoles
} from '@/api/saler/SalerRoles'
import { TableColumn } from '@/types/table'
import { ElAlert, ElButton, ElEmpty, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { CirclePlus } from '@element-plus/icons-vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { getList as getApplist } from '@/api/application'
import { ApplicationSelect } from '@/components/ApplicationSelect'
import { RechargeCardTypeSelect } from '@/components/RechargeCardTypeSelect'

const columns: TableColumn[] = [
  {
    field: 'name',
    label: '名称'
  },
  {
    field: 'configCount',
    label: '配置数量'
  },
  {
    field: 'action',
    label: '操作'
  }
]

const loading = ref(true)
let tableDataList = ref<any[]>([])

const getTableList = async () => {
  const res = await getList()
    .catch(() => {})
    .finally(() => {
      loading.value = false
    })
  if (res) {
    tableDataList.value = res.data
  }
}
getTableList()

const onCreate = () => {
  ElMessageBox.confirm('请输入角色名称', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showInput: true
  })
    .then((res) => {
      createSalerRoles(res.value)
        .then(() => {
          getTableList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}

const showEdit = ref(false)
const currentItem = ref<any>({})
const applist = ref<any[]>([])
const priceConfig = ref<any[]>([])

const onEdit = (row: any) => {
  currentItem.value = row
  priceConfig.value = JSON.parse(JSON.stringify(row.priceConfig))
  showEdit.value = true
}

getApplist().then((res) => {
  if (res) {
    applist.value = res.data
  }
})

const onAddConfig = () => {
  priceConfig.value.push({
    appid: 0,
    cardTypeId: 0,
    salerProfit: 0
  })
}

const onSave = () => {
  // console.log(priceConfig.value)

  const data = priceConfig.value.map((item: any) => {
    return {
      appid: item.appid,
      cardTypeId: item.cardTypeId,
      salerProfit: Number(item.salerProfit)
    }
  })

  if (data.length === 0) {
    ElMessage.error('配置未完成，请检查')
    return
  }

  for (let i = 0; i < data.length; i++) {
    if (data[i].appid === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
    if (data[i].cardTypeId === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
    if (data[i].salerProfit === 0) {
      ElMessage.error('配置未完成，请检查')
      return
    }
  }

  setSalerRoleConfig({
    id: currentItem.value.id,
    priceConfig: data
  })
    .then(() => {
      getTableList()
    })
    .catch(() => {})
    .finally(() => {
      showEdit.value = false
    })
}

const appSelectChange = (index: number) => {
  return (val: any) => {
    priceConfig.value[index].appid = val
    priceConfig.value[index].cardTypeId = 0
  }
}

const onDelete = (row: any) => {
  ElMessageBox.confirm('删除该角色后如果有代理为该角色则会自动修改为未设置?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteSalerRoles(row.id)
        .then(() => {
          getTableList()
        })
        .catch(() => {})
    })
    .catch(() => {})
}
</script>

<template>
  <div>
    <div>
      <ElButton @click="onCreate" type="primary" :icon="CirclePlus">添加角色</ElButton>
      <div>
        <ElAlert style="margin-top: 8px"
          >代理角色允许您创建一个指定角色并配置其单独每种卡类型的顶级代理利润，对于未配置的都将使用卡类型所设置的值，然后您可以为您的顶级代理设置该角色</ElAlert
        >
      </div>
    </div>
    <div>
      <ContentWrap style="margin-top: 10px">
        <Table :selection="false" :columns="columns" :data="tableDataList" :loading="loading">
          <template #empty>
            <ElEmpty description="快去添加角色吧" />
          </template>
          <template #configCount="data"> {{ data.row.priceConfig.length }}个 </template>
          <template #action="data">
            <ElButton size="small" @click="onEdit(data.row)">配置</ElButton>
            <ElButton size="small" @click="onDelete(data.row)" type="danger">删除</ElButton>
          </template>
        </Table>
      </ContentWrap>
    </div>
    <Dialog v-model="showEdit" :title="'配置 ' + currentItem.name">
      <div>
        <div style="margin-top: 10px" v-for="(_item, index) in priceConfig" :key="index">
          <ApplicationSelect
            @change="appSelectChange(index)"
            style="display: inline-block; margin-left: 8px"
            :applist="applist"
            :zeroname="''"
            v-model="priceConfig[index].appid"
          /><RechargeCardTypeSelect
            style="display: inline-block; margin-left: 8px"
            :zeroname="''"
            v-model="priceConfig[index].cardTypeId"
            :app="{ id: priceConfig[index].appid } as any"
            :notShowRefresh="true"
            :isWatchApp="true"
          />
          <div style="display: inline-block; margin-left: 8px">
            <ElInput
              v-model="priceConfig[index].salerProfit"
              type="number"
              placeholder="代理利润百分比"
            >
              <template #append>%</template>
            </ElInput>
          </div>
        </div>
        <div style="margin-left: 8px; margin-top: 15px">
          <ElButton @click="onAddConfig">添加配置</ElButton>
          <ElButton type="primary" @click="onSave">保存</ElButton>
        </div>
      </div>
    </Dialog>
  </div>
</template>
