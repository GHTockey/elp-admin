<script setup lang="ts">
import { computed, unref } from 'vue'
import { ElIcon } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'
import { Icon } from '@iconify/vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('icon')

const props = defineProps({
  // icon name
  icon: propTypes.string,
  // icon color
  color: propTypes.string,
  // icon size
  size: propTypes.number.def(16),
  hoverColor: propTypes.string
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))
const isSvgUrl = computed(() => props.icon.startsWith('svg-url:'))
// console.log('props.icon',props.icon)

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon
})

// 是否使用在线图标
const isUseOnline = computed(() => {
  return import.meta.env.VITE_USE_ONLINE_ICON === 'true'
})

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color
  }
})

</script>

<template>
  <ElIcon :class="prefixCls" :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <!-- svg url -->
    <!-- 处理SVG URL图标 使用<object>元素加载外部SVG文件-->
    <div v-else-if="isSvgUrl" :style="getIconifyStyle">
      <object class="svg_icon_normal" type="image/svg+xml" :data="symbolId.split('svg-url:')[1].split(',')[0]"
        :style="{ width: `${size}px`, height: `${size}px` }">
      </object>
      <object class="svg_icon_active" type="image/svg+xml" :data="symbolId.split('svg-url:')[1].split(',')[1]"
        :style="{ width: `${size}px`, height: `${size}px` }">
      </object>
      <!-- 为不支持<object>的浏览器提供备用参数 -->
      <!-- <param name="src" :value="symbolId.split('svg-url:')[1]" /> -->
    </div>

    <template v-else>
      <Icon v-if="isUseOnline" :icon="icon" :style="getIconifyStyle" />
      <div v-else :class="`${icon} iconify`" :style="getIconifyStyle"></div>
    </template>
  </ElIcon>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-icon';

.@{prefix-cls},
.iconify {
  :deep(svg) {
    &:hover {
      // stylelint-disable-next-line
      color: v-bind(hoverColor) !important;
    }
  }
}

.iconify {
  &:hover {
    // stylelint-disable-next-line
    color: v-bind(hoverColor) !important;
  }
}
</style>
