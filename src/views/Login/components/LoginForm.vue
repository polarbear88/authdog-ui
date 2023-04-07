<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { ElButton, ElCheckbox, ElLink, ElMessage } from 'element-plus'
import { useForm } from '@/hooks/web/useForm'
import { loginApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import md5 from 'blueimp-md5'
import { GeetestCaptcha } from '@/components/GeetestCaptcha'
import { getManMachineInspectConfig } from '@/api/manMachineInspect'

const { required } = useValidator()

const emit = defineEmits(['to-register', 'to-forget-password'])

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute } = useRouter()

const { wsCache } = useCache()

const { t } = useI18n()

const rules = {
  username: [required()],
  password: [required()]
}

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: t('login.username'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder')
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'tool',
    colProps: {
      span: 24
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  },
  {
    field: 'otherIcon',
    colProps: {
      span: 24
    }
  }
])

const remember = ref(false)

const { register, elFormRef, methods } = useForm()

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

let submitData: any = {}

const login = async () => {
  const res = await loginApi(submitData)
  if (res) {
    if (res.data && !res.data.role) {
      res.data.role = 'developer'
    }
    wsCache.set(appStore.getUserInfo, res.data)
    // 是否使用动态路由
    if (appStore.getDynamicRouter) {
      // getRole()
    } else {
      await permissionStore.generateRoutes('developer').catch(() => {})
      permissionStore.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
      })
      permissionStore.setIsAddRouters(true)
      window.location.href = '/'
    }
  }
}

// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  await formRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserType>()
      try {
        const data = { ...formData }
        data.password = md5(formData.password)
        submitData = data
        if (manMachineInspectConfig.value.validate_enable_login) {
          if ((window as any).captchaObj) {
            ;(window as any).captchaObj.showCaptcha()
          } else {
            ElMessage.error('验证码未初始化')
          }
        } else {
          await login()
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const captchaHandler = (captchaObj: any) => {
  ;(window as any).captchaObj = captchaObj
  captchaObj
    .appendTo('#captcha')
    .onReady(function () {
      console.log('ready')
    })
    .onNextReady(function () {
      console.log('nextReady')
    })
    .onBoxShow(function () {
      console.log('boxShow')
    })
    .onError(function (e: any) {
      console.log(e)
    })
    .onSuccess(function () {
      submitData.geetest_captcha = (window as any).captchaObj.getValidate()
      login()
    })
}

const captchaConfig = reactive({
  config: {
    captchaId: '',
    language: 'zh-cn',
    product: 'bind'
  },
  handler: captchaHandler
})

const manMachineInspectConfig = ref<any>({})

getManMachineInspectConfig().then((res) => {
  manMachineInspectConfig.value = res.data
  if (manMachineInspectConfig.value.validate_enable_login) {
    captchaConfig.config.captchaId = res.data.geetest_id_login
  }
})

// 去注册页面
const toRegister = () => {
  emit('to-register')
}
</script>

<template>
  <div>
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="dark:(border-[var(--el-border-color)] border-solid)"
      @register="register"
    >
      <template #title>
        <h2 class="text-2xl font-bold text-center w-[100%]">{{ t('login.login') }}</h2>
      </template>

      <template #tool>
        <div class="flex justify-between items-center w-[100%]">
          <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
          <!-- 注册开启了短信验证才允许使用短信进行重置密码 -->
          <ElLink
            v-if="manMachineInspectConfig.developer_register_enable_sms"
            @click="emit('to-forget-password')"
            type="primary"
            :underline="false"
            >{{ t('login.forgetPassword') }}</ElLink
          >
        </div>
      </template>

      <template #login>
        <div class="w-[100%]">
          <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
            {{ t('login.login') }}
          </ElButton>
        </div>
        <div class="w-[100%] mt-15px">
          <ElButton class="w-[100%]" @click="toRegister">
            {{ t('login.register') }}
          </ElButton>
        </div>
      </template>
    </Form>
    <div id="captcha"><GeetestCaptcha :captcha-config="captchaConfig" /></div>
  </div>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
