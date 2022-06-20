<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="monthTime"
        type="month"
        placeholder="请选择相应月份"
        :clearable="false"
        @change="decorateMonthChange"
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
      <el-table-column align="center" label="工号" width="100">
        <template slot-scope="scope">
          {{ scope.row.EMP_CODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.EMP_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" width="200">
        <template slot-scope="scope">
          {{ scope.row.DEPT_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" width="150">
        <template slot-scope="scope">
          {{ scope.row.PHONE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员性质" width="100">
        <template slot-scope="scope">
          {{ scope.row.KIND_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员分类" width="100">
        <template slot-scope="scope">
          {{ scope.row.EMP_CLASSNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-view" title="编辑" @click="handleViewUser(scope)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <user-dialog v-model="CurrentModel" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" />
    <div class="block footer trt_fixed_footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="page_currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        :layout="page_layout"
        :total="page_total"
        @size-change="decorateSizeChange"
        @current-change="decoreateCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { search, userDialog } from './components'
import * as defaultModel from '@/dataModel/EmployeeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import { pageQuery } from '@/api/employee'
// import xlsx from 'xlsx'

export default {
  name: 'UserManageIndex',
  components: {
    search,
    userDialog
  },
  mixins: [resize, tablePage, searchMethod],
  data: function() {
    return {
      loading: false,
      searchString: '',
      CurrentModel: Object.assign({}, defaultModel), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogVisible2: false,
      dialogType: 'new', // 对话框属性
      monthTime: new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
      dataList: [], // 所有用户列表
      searchModel: {
        monthNo: ''
      },
      test: ''
    }
  },
  computed: {
    monthNo: function() {
      return this.$store.getters.monthNo
    }
  },
  created() {
    this.monthTime = this.monthNo
    this.getDataList()
  },
  activated: function() {
    if (this.monthTime !== this.monthNo) {
      this.monthTime = this.monthNo
      this.getDataList()
    }
  },
  methods: {
    async getDataList() {
      this.searchModel.monthNo = this.monthNo
      var temp = {
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      this.loading = true
      const res = await pageQuery(temp)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    handleViewUser(scope) {
      this.dialogType = 'view'
      this.CurrentModel = scope.row
      this.dialogVisible = true
    },
    emptySearch() {
      this.searchString = ''
      this.searchModel = {}
    },
    decorateMonthChange(value) {
      return this.monthChange(value, this.emptySearch)
    }
  }
}
</script>

<style lang ='scss' scoped>
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
