<script>
export default {
  created() {
    const { params, query } = this.$route// 对象解构
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
