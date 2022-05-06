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
      <el-table-column align="center" label="手机号" width="100">
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
      <el-table-column align="center" label="失效时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.state === true?'启用':'停用' }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-user" title="添加新用户" @click="handleAddUser" />
            <el-button type="primary" size="small" icon="el-icon-download" title="数据导出" />
            <!-- input type="file" 点击然后取消时,有概率出现浏览器卡死的情况 -->
            <el-button type="primary" size="small" icon="el-icon-upload2">
              <input ref="upload" class="myinput" type="file" accept=".xlsx" title="数据上传" @focus="importExcel">
            </el-button>
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-close" title="停用" circle @click="handleAbandon(scope)">禁用</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
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
        @size-change="handleSizeChange(getDataList)"
        @current-change="handleCurrentChange(getDataList)"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { search, userDialog } from './components'
import * as defaultModel from '@/dataModel/EmployeeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import { pageQuery } from '@/api/employee'
// import xlsx from 'xlsx'

export default {
  components: {
    search,
    userDialog
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      searchString: '',
      CurrentModel: Object.assign({}, defaultModel), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有用户列表
      monthTime: new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
      searchModel: {
        'depT_CODE': '',
        'depT_NAME': '',
        'emP_CODE': '',
        'emP_NAME': '',
        'seX_NAME': '',
        'iD_CARD': '',
        'age': '',
        'phone': '',
        'c01RJ': '',
        'c01RH': '',
        'c01RE_NAME': '',
        'banK_NO': '',
        'kinD_CODE': '',
        'kinD_CODE2': '',
        'emP_CLASS': '',
        'hosarea': '',
        'monthNo': new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
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
  beforeDestroy() {
    window.removeEventListener('resize', this.adjustFooterWidth)
  },
  methods: {
    async getDataList() {
      var temp = {
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      console.log(temp)
      this.loading = true
      const res = await pageQuery(temp)
      console.log(res)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.CurrentModel = defaultModel
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.CurrentModel = scope.row
      this.dialogVisible = true
    },
    searchHandler(searchModel) {
      // this.searchModel = { ...searchModel }
      // console.log(this.dataModel)
    },
    importExcel(e) {
      // if (e.target.files.length > 0) {
      //   const file = e.target.files
      //   console.log(file)
      // }
      // return
    },
    monthChange(value) {
      var date = new Date(value)
      this.searchString = ''
      this.searchModel = {}
      this.searchModel.monthNo = date.getFullYear() + '-' + (1 + date.getMonth()).toString().padStart(2, '0')
      this.initialPage()
      this.getDataList()
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
