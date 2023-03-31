<script setup lang="ts">
import { Error } from '@/components/Error'
// import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'

const { push } = useRouter()

// const permissionStore = usePermissionStore()

const errorClick = () => {
  push({ name: 'Root' })
}
</script>

<template>
  <Error type="403" @error-click="errorClick" />
</template>
