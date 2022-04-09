<template>
  <div class="app-container">
    <el-descriptions title="公式详细信息" :column="2">
      <el-descriptions-item label="公式名称">慈善一日捐</el-descriptions-item>
      <el-descriptions-item label="公式所属">社会贡献</el-descriptions-item>
      <el-descriptions-item label="备注" span="2">该公式仅适用于行政中层人员.</el-descriptions-item>
    </el-descriptions>
    <!-- 其它信息模块 -->
    <el-divider />
    <!-- 显示模块 -->
    <tagshow :content="showFormular" />
    <div class="inputFormular">
      公式输入:
      <!-- 输入模块(输入这里要增加智能搜索模块,智能提示需要的输入) -->
      <el-autocomplete
        ref="input"
        v-model="rawFormular"
        :fetch-suggestions="searchDebounce"
        :trigger-on-focus="false"
        placeholder="请输入公式内容"
        class="block"
        @select="autoFixInput"
      >
        <template v-slot="{item}">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </template>
      </el-autocomplete>
    </div>
    <el-button type="primary">保存修改</el-button>
  </div>
</template>

<script>
import { tagshow } from './components'
import { splictStringByOperator, getLastStrByOperator } from '@/utils/stringAdvanced'
import { debounce } from '@/utils/index'

export default {
  components: {
    tagshow
  },
  data: function() {
    return {
      rawFormular: '',
      testdata: 0,
      searchDebounce: debounce(this.querySearchRemote, 500),
      rawTemp: ''
    }
  },
  computed: {
    showFormular: function() {
      return splictStringByOperator(this.rawFormular)
    }
  },
  mounted: function() {
  },
  methods: {
    /**
     * 根据所在列控制颜色显示
     */
    columnColorControll: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'backgroundcolor:blue'
      }
    },
    async querySearchRemote(rawString, cb) { // 该函数会在用户每次input时调用
      this.rawTemp = rawString
      var queryString = getLastStrByOperator(rawString.toLowerCase())
      // console.log(queryString)
      // 在这里请求服务器获数据
      var remoteMock = [{ 'value': queryString + 'Tick' }]
      var result = queryString ? remoteMock : []
      cb(result)
    },
    autoFixInput(item) { // el-input中的下拉框发生点击事件之时,已经将input中的内容更新成了item中的内容
      // console.log('this is test')
      let index = 0
      // console.log(this.rawTemp)
      index = this.rawTemp.search(/[\+\-\*%()\\=][\u4e00-\u9fa5\w]*$/)
      // console.log(index)
      this.rawFormular = this.rawTemp.slice(0, index + 1) + item.value
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss">
  .inputFormular{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  #formular.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: rgba(255, 255, 255, 0)
  }
  #formular.el-table--enable-row-hover .el-table__body tr> td.el-table__cell:hover{
    background-color: #F5F7FA;
  }
  .block{
    display: block;
  }
</style>
