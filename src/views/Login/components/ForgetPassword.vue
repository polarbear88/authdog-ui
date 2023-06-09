<script setup lang="ts">
import { Form } from '@/components/Form'
import { reactive, ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { ElButton, ElInput, FormRules } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { RegisterType } from '@/api/login/types'
import { resetPasswordApi, sendSmsApi } from '@/api/login'
import { ElMessage } from 'element-plus'
import { GeetestCaptcha } from '@/components/GeetestCaptcha'
import { getManMachineInspectConfig } from '@/api/manMachineInspect'

const emit = defineEmits(['to-login'])

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
    label: '新密码',
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
  {
    field: 'smscode',
    label: '验证码',
    value: '',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入短信验证码',
      type: 'number',
      slots: {
        suffix: true
      }
    }
  },
  {
    field: 'register',
    colProps: {
      span: 24
    }
  }
])

const rules: FormRules = {
  password: [required()],
  check_password: [required()],
  mobile: [required()],
  smscode: [required()]
}

const toLogin = () => {
  emit('to-login')
}

const loading = ref(false)

const handleResetPassword = async () => {
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
        const res = await resetPasswordApi(formData)
        if (res) {
          // 注册成功
          ElMessage.success('重置密码成功')
          toLogin()
        }
      } finally {
        loading.value = false
      }
    }
  })
}

let currentMobile = ''
let currentCaptchaAction = ''

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
      if (currentCaptchaAction === 'send_sms') {
        submitSendSms()
      }
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

const smsSubmitText = ref('获取验证码')

const manMachineInspectConfig = ref<any>({})

const disableSendSms = ref(false)

getManMachineInspectConfig().then((res) => {
  manMachineInspectConfig.value = res.data
  if (manMachineInspectConfig.value.validate_enable_sendsms) {
    captchaConfig.config.captchaId = res.data.geetest_id_register
  }
})

const submitSendSms = () => {
  const data: any = {
    mobile: currentMobile
  }
  if (manMachineInspectConfig.value.validate_enable_sendsms) {
    data.geetest_captcha = (window as any).captchaObj.getValidate()
  }
  disableSendSms.value = true
  sendSmsApi(data)
    .then(() => {
      smsSubmitText.value = `79秒后重试`
      let count = 79
      const timer = setInterval(() => {
        count--
        smsSubmitText.value = `${count}秒后重试`
        if (count <= 0) {
          clearInterval(timer)
          smsSubmitText.value = '获取验证码'
          disableSendSms.value = false
        }
      }, 1000)
    })
    .catch(() => {
      disableSendSms.value = false
    })
}

const onSendSms = async () => {
  const { getFormData } = methods
  const formData = await getFormData<RegisterType>()
  if (!formData.mobile || !/^1[3456789]\d{9}$/.test(formData.mobile)) {
    ElMessage.error('请输入正确手机号')
    return
  }
  currentMobile = formData.mobile
  if (manMachineInspectConfig.value.validate_enable_sendsms) {
    currentCaptchaAction = 'send_sms'
    if ((window as any).captchaObj) {
      ;(window as any).captchaObj.showCaptcha()
    } else {
      ElMessage.error('验证码未初始化')
    }
    return
  }
  submitSendSms()
}
</script>

<template>
  <div>
    <Form
      :schema="schema"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
      class="dark:(border-[var(--el-border-color)] border-solid)"
      @register="register"
    >
      <template #title>
        <h2 class="text-2xl font-bold text-center w-[100%]">重置开发者密码</h2>
      </template>

      <template #code="form">
        <div class="w-[100%] flex">
          <ElInput v-model="form['code']" :placeholder="t('login.codePlaceholder')" />
        </div>
      </template>

      <template #register>
        <div class="w-[100%]">
          <ElButton type="primary" class="w-[100%]" :loading="loading" @click="handleResetPassword">
            重置密码
          </ElButton>
        </div>
        <div class="w-[100%] mt-15px">
          <ElButton class="w-[100%]" @click="toLogin"> 返回登录 </ElButton>
        </div>
      </template>
      <template #smscode-suffix>
        <ElButton :disabled="disableSendSms" @click="onSendSms" type="primary" link>{{
          smsSubmitText
        }}</ElButton>
      </template>
    </Form>
    <div id="captcha"><GeetestCaptcha :captcha-config="captchaConfig" /></div>
  </div>
</template>
