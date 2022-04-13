import $ from 'jquery'

export default {
  data() {
    return {
      page_size: 20,
      page_total: 0,
      page_currentPage: 1,
      page_sizes: [20, 100, 200, 400],
      page_layout: 'sizes, prev, pager, next',
      footerWidth: 0
    }
  },
  computed: {
    page_CurrentIndex: function() {
      return this.page_size * (this.page_currentPage - 1) + 1
    }
  },
  methods: {
    /**
     * 宽度自适应
     */
    adjustFooterWidth() {
      var parentwidth = $('.app-container').width()
      // console.log(parentwidth)
      $('.footer').width(parentwidth)
    },
    /**
     * 当每页检索的数据量大小发生改变时
     * @param {*} val
     * @param {*} myfun
     */
    handleSizeChange(myfun) {
      return (val) => {
        this.page_currentPage = 1
        this.page_size = val
        myfun()
      }
    },
    /**
     * 当页码发生变化时
     * @param {*} val
     * @param {*} myfun
     */
    handleCurrentChange(myfun) {
      return (val) => {
        this.page_currentPage = val
        myfun()
      }
    }
  }
}
