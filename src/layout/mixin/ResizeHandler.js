import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    /**
     * 表示监视$route,如果只有一个参数,表示new_route,如果有两个参数,就表示new_route and old_route.
     * 如果在移动设备上,且发生了路由切换,且侧边栏是开启的状态,就关闭它.
     * @param {Object} route
     */
    $route(route) { // 监视当前的路由地址. this.$route 指向当前的路由地址,如果当前的路由地址发生变动
      if (this.device === 'mobile' && this.sidebar.opened) {
        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    // 添加事件监听器,如果触发了resize事件,就调用$_resizeHandler函数
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      const rect = body.getBoundingClientRect()// 返回body的模型大小,长,宽,高等
      return rect.width - 1 < WIDTH
    },
    $_resizeHandler() {
      if (!document.hidden) { // 返回页面是否隐藏
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}
