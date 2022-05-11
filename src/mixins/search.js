export default {
  methods: {
    searchHandler(searchModel) {
      this.searchModel = Object.assign(this.searchModel, searchModel)
      this.initialPage()
      this.getDataList()
    },
    monthChange(value, beforefun = null) {
      if (beforefun !== null) {
        beforefun()
      }
      var date = new Date(value)
      var temp =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      this.$store.commit('universal/SET_MONTHNO', temp)
      this.initialPage()
      this.getDataList()
    }
  }
}
