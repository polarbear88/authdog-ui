<template>
  <div class="captcha"></div>
</template>

<script lang="ts">
import { watch } from 'vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'GeetestCaptcha',
  // eslint-disable-next-line vue/require-prop-types
  props: ['captchaConfig'],
  setup(prop) {
    let isInit = false
    if (prop.captchaConfig.config.captchaId) {
      isInit = true
      ;(window as any).initGeetest4(prop.captchaConfig.config, prop.captchaConfig.handler)
    }
    watch(
      () => prop.captchaConfig.config.captchaId,
      (_val) => {
        console.log(_val)

        if (prop.captchaConfig.config.captchaId && !isInit) {
          isInit = true
          ;(window as any).initGeetest4(prop.captchaConfig.config, prop.captchaConfig.handler)
        }
      }
    )
  }
})
</script>
