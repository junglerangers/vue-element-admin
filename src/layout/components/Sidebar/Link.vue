<template>
  <!--组件的动态添加,不但能用于自己的自定义组件,而且也可以用于html自带的标签组件-->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
// 该link要么是一个路由,要么是一个超链接,根据用户给予的信息动态更改
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
