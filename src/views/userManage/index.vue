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
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-document-add" title="从上月复制数据" @click="dialogVisibleEmployeeCopy=true" />
            <el-upload
              action="blank"
              :show-file-list="false"
              accept="xlsx,xls"
              :http-request="employeeUpload"
              :style="{'display':'inline-block'}"
            >
              <el-button type="primary" size="small" icon="el-icon-document-copy" title="从Excel导入数据" />
            </el-upload>
            <el-upload
              action="blank"
              :show-file-list="false"
              accept="xlsx,xls"
              :http-request="employeeAddUpload"
              :style="{'display':'inline-block'}"
            >
              <el-button type="primary" size="small" icon="el-icon-plus" title="Excel追加数据" />
            </el-upload>
          </el-button-group>
        </template>
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
    <el-dialog
      title="人员信息复制选择框"
      :visible.sync="dialogVisibleEmployeeCopy"
      width="30%"
    >
      <div class="block">
        <div>
          <el-date-picker
            v-model="startCopyMonth"
            type="month"
            placeholder="选择月"
            class="year-class"
          /><span class="must">*</span>
          至
          <el-date-picker
            v-model="monthTime"
            type="month"
            placeholder="选择月"
            disabled
            class="month-class"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEmployeeCopy = false">取 消</el-button>
        <el-button type="primary" @click="employeeInfoCopy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { search, userDialog } from './components'
import * as defaultModel from '@/dataModel/EmployeeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import { pageQuery, isExist as isEmployeeExist, copyEmployee } from '@/api/employee'
import { getCurrentTime } from '@/utils/time'
import { upload as Excelupload } from '@/utils/excel'
import { getEmployeeByExcel as employeeImport, AddEmployeeByExcel as employeeAdd } from '@/api/import'
import { mapActions } from 'vuex'
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
      dialogVisibleEmployeeCopy: false,
      searchString: '',
      startCopyMonth: '',
      CurrentModel: Object.assign({}, defaultModel), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogVisible2: false,
      dialogType: 'new', // 对话框属性
      monthTime: new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
      dataList: [], // 所有用户列表
      searchModel: {
        monthNo: ''
      },
      test: '',
      /**
       * 员工表单属性字典
       */
      EmployeeTypeDict: [
        { TNAME: '人员编码', TCODE: 'EMP_CODE' },
        { TNAME: '姓名', TCODE: 'EMP_NAME' },
        { TNAME: '人员性质', TCODE: 'KIND_NAME' },
        { TNAME: '人员性质2', TCODE: 'KIND_CODE2' },
        { TNAME: '人员分类', TCODE: 'EMP_CLASSNAME' }
      ]
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
    /**
     * 将事件管理函数映射进来
     */
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
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
    },
    /**
     * 人员信息通过excel上传
     */
    async employeeUpload(e) {
      console.log(this.monthNo)
      var sign = await this.beforeRmoeteTest(isEmployeeExist, this.monthNo)
      if (!sign) {
        return
      } else {
        var task = {
          taskID: Math.floor(Math.random() * 100),
          taskName: this.monthNo + '人员信息Excel导入',
          startTime: getCurrentTime(),
          endTime: '',
          taskState: '运行中',
          info: ''
        }
        this.addEvent(task)
        this.loading = true
        await Excelupload('', e.file, this.EmployeeTypeDict).then(async params => {
          params.monthNo = this.monthNo
          await employeeImport(params)
        }).then(res => {
          task.taskState = '完成'
          task.endTime = getCurrentTime()
          this.$message({
            message: this.monthNo + '员工信息导入成功!',
            type: 'success'
          })
          this.getDataList()
        }).catch(err => {
          task.endTime = getCurrentTime()
          task.taskState = '错误'
          task.info = err
        }).finally(() => {
          const h = this.$createElement
          this.$notify({
            title: '通知',
            message: h('i', { style: 'color: #0084ff' }, task.taskName + task.taskState),
            duration: 0
          })
          this.loading = false
        })
      }
    },
    async employeeInfoCopy() {
      var sign = await this.beforeRmoeteTest(isEmployeeExist, this.monthNo)
      if (!sign) {
        this.dialogVisibleEmployeeCopy = false
      } else {
        var start = this.startCopyMonth
        start = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart('2', '0')
        var params = {
          'monthNo': this.monthNo,
          'copyFromMonthNo': start
        }
        // console.log(params)
        this.loading = true
        copyEmployee(params).then(res => {
          this.$message({
            message: '员工信息复制成功!',
            type: 'success'
          })
          this.dialogVisibleEmployeeCopy = false
        })
          .finally(() => {
            this.dialogVisibleEmployeeCopy = false
            this.getDataList()
            this.loading = false
          })
      }
    },
    /**
     * 人员信息通过excel补充上传
     */
    async employeeAddUpload(e) {
      // var sign = await this.beforeRmoeteTest(isEmployeeExist)
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: this.monthNo + '人员信息Excel追加导入',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.addEvent(task)
      this.loading = true
      await Excelupload('', e.file, this.EmployeeTypeDict).then(async params => {
        params.monthNo = this.monthNo
        await employeeAdd(params)
      }).then(res => {
        task.taskState = '完成'
        task.endTime = getCurrentTime()
        this.$message({
          message: this.monthNo + '员工信息追加导入成功!',
          type: 'success'
        })
        this.getDataList()
      }).catch(err => {
        task.endTime = getCurrentTime()
        task.taskState = '错误'
        task.info = err
      }).finally(() => {
        const h = this.$createElement
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: #0084ff' }, task.taskName + task.taskState),
          duration: 0
        })
        this.loading = false
      })
    },
    /**
     * 指定特定的函数进行检测,以及是否覆盖重传的确认
     */
    async beforeRmoeteTest(fun, params) {
      var temp = params || this.params
      var sign1 = await fun(temp)
      var sign2 = true
      if (sign1) {
        sign2 = await this.confirm()
      }
      if (sign1 && !sign2) {
        return false
      }
      return true
    },
    /**
     * 重传确认弹窗
     */
    async confirm() {
      var result = false
      await this.$confirm('已经存在相应月份的数据,是否需要重新导入?(重新导入会覆盖原本的数据!)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        result = true
      }).catch(() => {
        result = false
      })
      return result
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
.must{
  color: red;
}
.year-class{
  width:180px;
  display: inline-block;
}
.month-class{
  width:180px;
  display: inline-block;
}
</style>
