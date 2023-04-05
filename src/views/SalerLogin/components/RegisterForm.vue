<script setup lang="ts">
import { Form } from '@/components/Form'
import { reactive, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElButton, ElInput, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { RegisterType } from '@/api/login/types'
import { registerApi } from '@/api/salerApi/auth'
import { ElMessage } from 'element-plus'
import { GeetestCaptcha } from '@/components/GeetestCaptcha'
import { getManMachineInspectConfig } from '@/api/manMachineInspect'

const props = defineProps({
  token: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['to-register-success', 'to-login'])

const { register, elFormRef, methods } = useForm()

const { t } = useI18n()

const { required } = useValidator()

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    colProps: {
      span: 24
    }
  },
  {
    field: 'username',
    label: t('login.registerUsername'),
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
    field: 'mobile',
    label: t('login.mobile'),
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.mobilePlaceholder'),
      type: 'number'
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
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  {
    field: 'check_password',
    label: t('login.checkPassword'),
    value: '',
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      strength: true,
      placeholder: t('login.passwordPlaceholder')
    }
  },
  // {
  //   field: 'code',
  //   label: t('login.code'),
  //   colProps: {
  //     span: 24
  //   }
  // },
  {
    field: 'register',
    colProps: {
      span: 24
    }
  }
])

const rules: FormRules = {
  username: [required()],
  password: [required()],
  check_password: [required()],
  mobile: [required()]
  // code: [required()]
}

const toRegisterSuccess = () => {
  emit('to-register-success')
}

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

let submitData: any = {}

const loginRegister = async () => {
  const formRef = unref(elFormRef)
  formRef?.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true
        const { getFormData } = methods
        const formData = await getFormData<RegisterType>()
        if (formData.password !== (formData as any).check_password) {
          ElMessage.error(t('login.passwordNotSame'))
          return
        }
        const data = {
          ...formData,
          token: props.token
        }
        data['name'] = data.username
        // delete data['username']
        if (manMachineInspectConfig.value.validate_enable_register) {
          submitData = data
          if ((window as any).captchaObj) {
            ;(window as any).captchaObj.showCaptcha()
          } else {
            ElMessage.error('验证码未初始化')
          }
          return
        }
        const res = await registerApi(data)
        if (res) {
          // 注册成功
          toRegisterSuccess()
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
      registerApi(submitData).then((res) => {
        if (res) {
          // 注册成功
          toRegisterSuccess()
        }
      })
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
  if (manMachineInspectConfig.value.validate_enable_register) {
    captchaConfig.config.captchaId = res.data.geetest_id_register
  }
})
</script>

<template>
  <div>
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      size="large"
      class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
      @register="register"
    >
      <template #title>
        <h2 class="text-2xl font-bold text-center w-[100%]">代理注册</h2>
      </template>

      <template #code="form">
        <div class="w-[100%] flex">
          <ElInput v-model="form['code']" :placeholder="t('login.codePlaceholder')" />
        </div>
      </template>

      <template #register>
        <div class="w-[100%]">
          <ElButton type="primary" class="w-[100%]" :loading="loading" @click="loginRegister">
            {{ t('login.register') }}
          </ElButton>
        </div>
        <div class="w-[100%] mt-15px">
          <ElButton class="w-[100%]" @click="toLogin">
            {{ t('login.hasUser') }}
          </ElButton>
        </div>
      </template>
    </Form>
    <div id="captcha"><GeetestCaptcha :captcha-config="captchaConfig" /></div>
  </div>
</template>
