<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="searchModel.monthNo"
        type="month"
        placeholder="请选择相应月份"
      />
    </div>
    <search @search="searchHandler" />
    <el-table
      id="mytable"
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList"
      class="table"
      border
    >
      <el-table-column type="index" :index="page_CurrentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="薪酬类型代码" width="100">
        <template slot-scope="scope">
          {{ scope.row.DCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="薪酬类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.DNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别编码" width="100">
        <template slot-scope="scope">
          {{ scope.row.TCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.TNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生效日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.BEGINDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="失效日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.ENDDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定标志" width="100">
        <template slot-scope="scope">
          {{ scope.row.ISLOCK }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-user" title="添加字典新项" @click="handleAddUser" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-close" title="停用" circle @click="handleAbandon(scope)">停用</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <salaryTypeDialog v-model="currentModel" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" />
    <div class="block footer trt_fixed_footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="page_currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        :layout="page_layout"
        :total="total"
        @size-change="handleSizeChange(getDataList)"
        @current-change="handleCurrentChange(getDataList)"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { getGridList, getTreeList, localUpdate, localDelete, localAdd, pageQuery } from '@/api/salaryType'
import { search, salaryTypeDialog } from './components'
import * as defaultModel from '@/dataModel/SalaryTypeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'

export default {
  components: {
    search,
    salaryTypeDialog
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      total: 0, // 数据总数量
      searchModel: {
        'dcode': '',
        'tcode': '',
        'tname': '',
        'remark': '',
        'supercode': '',
        'formula': '',
        'monthNo': new Date(),
        'islock': ''
      }
    }
  },
  created() {
    this.getDataList()
    // this.getDepList()
    // this.getTypeList()
  },
  beforeMount() {
    window.addEventListener('resize', this.adjustFooterWidth)
  },
  mounted: function() {
    const vue = this
    setTimeout(() => {
      this.$nextTick(function() {
        vue.adjustFooterWidth()
      })
    }, 150)
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.adjustFooterWidth)
  },
  methods: {
    async getDataList() {
      //   var temp = {
      //     ...this.searchModel,
      //     currentPage: this.page_currentPage,
      //     size: this.page_size
      //   }
      this.loading = true
      var temp = {
        'queryModel': {
          'monthNo': '2022-04'
        },
        'pageHandler': {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      console.log(temp)
      const res = await pageQuery(temp)
      // console.log(res.data)
      this.dataList = res.data
      this.total = res.pageHandler.records
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.currentModel = Object.assign({}, defaultModel)
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.currentModel = scope.row
    },
    searchHandler(searchModel) {
      this.dataModel = { ...searchModel }
      // console.log(this.dataModel)
    },
    importExcel(e) {
      // if (e.target.files.length > 0) {
      //   const file = e.target.files
      //   console.log(file)
      // }
      // return
    }
  }
}
</script>

<style lang='scss' scoped>
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
.myinput{
  position:absolute;
  opacity: 0;
  top:0;
  left: 0;
  height: 100%;
  width:100%;
}
.margin20{
  margin: 0 20px;
}
.el-dialog{
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position:absolute;
  top:50%;
  left:50%;
   width: fit-content;
  transform: translate(-50%,-50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body{
  flex:1;
  overflow:auto;
}
</style>
