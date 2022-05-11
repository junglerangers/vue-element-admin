<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="monthTime"
        type="month"
        placeholder="请选择相应月份"
        @change="monthChange"
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
      <el-table-column align="center" label="科室编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.DEPT_CODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室名称" width="">
        <template slot-scope="scope">
          {{ scope.row.DEPT_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="上级科室编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.SUPER_CODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室层级" width="100">
        <template slot-scope="scope">
          {{ scope.row.DEPT_LEVEL }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生效日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.BEGINDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="失效日期" width="150">
        <template slot-scope="scope">
          {{ scope.row.ENDDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="停用标志" width="100">
        <template slot-scope="scope">
          {{ scope.row.IS_STOP }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定标志" width="100">
        <template slot-scope="scope">
          {{ scope.row.ISLOCK }}
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { pageQuery } from '@/api/department'
import { search } from './components'
// import * as defaultModel from '@/dataModel/CodeDictModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'

export default {
  components: {
    search
  },
  mixins: [resize, tablePage, searchMethod],
  data: function() {
    return {
      loading: false,
      monthTime: '',
      date: new Date(),
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      searchModel: {
        'DEPT_CODE': '',
        'DEPT_NAME': '',
        'IS_STOP': '',
        'SPELL_CODE': '',
        'WBX_CODE': '',
        'SUPER_CODE': '',
        'monthNo': ''
      }
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
    // this.getDepList()
    // this.getTypeList()
  },
  activated: function() {
    this.monthTime = this.monthNo
  },
  methods: {
    async getDataList() {
      this.loading = true
      this.searchModel.monthNo = this.monthNo
      var temp = {
        queryModel: this.searchModel,
        pageHandler: {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      const res = await pageQuery(temp)
      // console.log(res.data)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
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
