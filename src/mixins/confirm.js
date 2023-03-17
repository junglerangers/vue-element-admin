export default {
  methods: {
    /**
     * 重要操作前的确认步骤
     */
    async confirm(
      tips = '已存在相应数据,是否需要重新导入?(重新导入会覆盖原本的数据!)',
      fn,
      param
    ) {
      // fn是自定义的验证函数,tips是自定义的说明信息
      var vue = this
      async function confirmBox() {
        var result = false
        await vue
          .$confirm(tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            result = true
          })
          .catch(() => {
            result = false
          })
        return result
      }
      var sign1
      if (typeof fn === 'function') {
        sign1 = await fn(param)
      } else {
        sign1 = true
      }
      var sign2
      if (sign1) {
        sign2 = await confirmBox()
      }
      if (sign1 && !sign2) {
        // 如果已经存在已经有的数据,提示用户是重新导入数据,还是使用现有的数据
        return false
      }
      return true
    }
  }
}
