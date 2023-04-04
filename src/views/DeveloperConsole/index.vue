<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { Warning } from '@element-plus/icons-vue'
import { ElCard, ElCol, ElIcon, ElRow, ElStatistic, ElTooltip } from 'element-plus'
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('panel')
</script>

<template>
  <div>
    <ElRow :gutter="20" justify="space-between" :class="prefixCls">
      <ElCol :xl="6" :lg="6" :md="6" :sm="6" :xs="12">
        <ElCard shadow="hover" class="mb-20px">
          <div :class="`${prefixCls}__item flex justify-between`">
            <div class="flex flex-col justify-between">
              <ElStatistic :prefix="'¥'" :value="9993">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    来自代理总利润
                    <ElTooltip
                      effect="dark"
                      content="Number of users who logged into the product in one day"
                      placement="top"
                    >
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
