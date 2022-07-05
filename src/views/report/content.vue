<template>
  <div :style="{height:container_height+'px'}">
    <iframe
      :src="reportSrc"
      frameborder="0"
      width="100%"
      height="100%"
    />
  </div>
</template>
<script>

export default {
  data() {
    return {
      container_height: 1200
    }
  },
  computed: {
    reportSrc: function() {
      return this.$store.state.universal.reportUrl
    }
  },
  mounted: function() {
    const vue = this
    setTimeout(() => {
      this.$nextTick(function() {
        vue.test()
      })
    }, 150)
  },
  created: function() {
    if (!this.reportSrc) {
      this.$message({
        message: '请先选择一个报表页面!',
        type: 'warning'
      })
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/report/index')
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.test)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.test)
  },
  methods: {
    test() {
      this.container_height = window.innerHeight - 94
    }
  }
}
</script>

<style lang="scss">
    .container{
        height:1200px;
    }
</style>
