<template>
  <div class="container">
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
    }
  },
  computed: {
    reportSrc: function() {
      return this.$store.state.universal.reportUrl
    }
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
  }
}
</script>

<style lang="scss">
    .container{
        height:1200px;
    }
</style>
