<template>
  <div ref="main" class="app-container">
    <svg-icon icon-class="scale_white" />
    <search @search="searchHandler" />
    <el-table
      id="mytable"
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="userList"
      class="table"
      border
    >
      <el-table-column type="index" :index="page_CurrentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="工号" width="200">
        <template slot-scope="scope">
          {{ scope.row.workNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" width="100">
        <template slot-scope="scope">
          {{ scope.row.dep }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生效时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.type }}
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
              <input ref="upload" class="myinput" type="file" accept=".xlsx" @focus="importExcel">
            </el-button>
            <el-button type="primary" size="small" icon="el-icon-view" title="数据可视化" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-close" title="禁用" circle @click="handleAbandon(scope)">禁用</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <user-dialog v-model="CurrentUser" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" />
    <div class="block footer trt_fixed_footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="page_currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        :layout="page_layout"
        :total="total"
        @size-change="handleSizeChange(getUserList)"
        @current-change="handleCurrentChange(getUserList)"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { getUserList } from '@/api/user'
import { search, userDialog } from './components'
import * as defaultUser from '@/dataModel/EmployeeModel'
import resize from './mixins/resize'
import tablePage from '@/mixins/tablePage'
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
      CurrentUser: Object.assign({}, defaultUser), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      userList: [], // 所有用户列表
      total: 0, // 数据总数量
      dataModel: {
        /** 以下为筛选条件 */
        dep: '', // 科室
        type: '', // 人员类型
        workNumber: '', // 人员工号
        name: '' // 人员姓名
      }
    }
  },
  created() {
    this.getUserList()
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
    async getUserList() {
      var temp = {
        ...this.dataModel,
        currentPage: this.page_currentPage,
        size: this.page_size
      }
      this.loading = true
      const res = await getUserList(temp)
      this.userList = res.data.data
      this.total = res.data.total
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      console.log(this.dialogVisible)
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
