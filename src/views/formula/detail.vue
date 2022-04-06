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
      <el-input v-model="rawFormular" />
    </div>
  </div>
</template>

<script>
import { tagshow } from './components'
import { splictStringByOperation } from '@/utils/stringAdvanced'

export default {
  components: {
    tagshow
  },
  data: function() {
    return {
      rawFormular: '',
      tableData: [{
        date: '工资一',
        name: '福利一',
        address: '奖金一',
        test: '社保一'
      }, {
        date: '工资二',
        name: '福利二',
        address: '奖金二',
        test: '社保二'
      }, {
        date: '工资三',
        name: '福利三',
        address: '奖金三',
        test: '社保三'
      }, {
        date: '工资四',
        name: '福利四',
        address: '奖金四',
        test: '社保四'
      }]
    }
  },
  computed: {
    showFormular: function() {
      return splictStringByOperation(this.rawFormular)
    }
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
    /**
     * 根据点击添加到input输入框中
     */
    cellClickHandler: function(row, column, cell, event) {
      alert(row + ',' + column + ' has been clicked')
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
</style>
