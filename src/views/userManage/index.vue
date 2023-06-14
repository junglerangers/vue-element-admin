<template>
  <div class="app-container">
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
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList"
      class="table"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
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
      <el-table-column align="center" label="发放状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.STATUS === '0'" type="success">正常</el-tag>
          <el-tag v-else type="info">停发</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot="header">
          <el-button-group class="sub-btngroup">
            <el-dropdown @command="changeCheckedMembers">
              <el-button class="sub-btn" type="primary" size="small">
                <div style="display:inline-block">
                  状态修改
                  <p class="sub-btn-destext">
                    (选中{{ checkedPeopleNums }}条)
                  </p>
                </div>
                <div style="display:inline-block"><i class="el-icon-arrow-down el-icon--right" /></div>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">全部停用</el-dropdown-item>
                <el-dropdown-item command="0">全部启用</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
            <ExportExcel :search-model="searchModel" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-view" title="编辑" @click="handleViewUser(scope)">编辑</el-button>
          <el-button v-if="scope.row.STATUS==='0'" type="text" size="small" icon="el-icon-remove-outline" title="停发" @click="handleChangeUserStatus(scope)">停发</el-button>
          <el-button v-else type="text" size="small" icon="el-icon-circle-check" title="启用" @click="handleChangeUserStatus(scope)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <user-dialog :current-user="CurrentModel" :dialog-visible="dialogVisible" @toggleVisible="toggleDialogVisible" />
    <div class="block footer pagination_fixed_footer" :style="{width:footerWidth}">
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
import confirm from '@/mixins/confirm'
import { pageQuery, isExist as isEmployeeExist, copyEmployee, UpdSalaryStatus } from '@/api/employee'
import { getCurrentTime } from '@/utils/time'
import { upload as Excelupload } from '@/utils/excel'
import { getEmployeeByExcel as employeeImport, AddEmployeeByExcel as employeeAdd } from '@/api/import'
import { mapActions } from 'vuex'
import ExportExcel from '../excel/export-excel.vue'

export default {
  name: 'UserManageIndex',
  components: {
    search,
    userDialog,
    ExportExcel
  },
  mixins: [resize, tablePage, searchMethod, confirm],
  data: function() {
    return {
      loading: false,
      dialogVisibleEmployeeCopy: false,
      startCopyMonth: '',
      CurrentModel: Object.assign({}, defaultModel), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      monthTime: new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
      dataList: [], // 所有用户列表
      searchModel: {
        monthNo: ''
      },
      /**
       * 员工表单属性字典
       */
      EmployeeTypeDict: [
        { TNAME: '人员编号', TCODE: 'EMP_CODE' },
        { TNAME: '姓名', TCODE: 'EMP_NAME' },
        { TNAME: '科室', TCODE: 'DEPT_NAME' },
        { TNAME: '人员性质', TCODE: 'KIND_CODE_NAME' },
        { TNAME: '实际岗位', TCODE: 'C01RY_NAME' },
        { TNAME: '聘任资格', TCODE: 'QUALIFICATION' }
      ],
      checkedPeopleNums: 0,
      checkedPeople: []
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
  activated() {
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
      this.loading = true
      // console.log(this.searchModel)
      const res = await pageQuery({
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }})
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
      console.log(res.data)
    },
    handleViewUser(scope) {
      this.CurrentModel = scope.row
      this.dialogVisible = true
    },
    decorateMonthChange(value) {
      return this.monthChange(value, this.searchHandler)
    },
    /**
     * 人员信息通过excel上传
     */
    async employeeUpload(e) {
      var sign = await this.confirm('已经存在相应数据,是否需要重新导入', isEmployeeExist, this.monthNo)
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
    /**
     * 人员信息从特定月份进行复制
     */
    async employeeInfoCopy() {
      var sign = await this.confirm('已经存在相应的数据,是否需要重复导入', isEmployeeExist, this.monthNo)
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
     * 暂停发放所有选中人员工资发放
     */
    async changeCheckedMembers(state) {
      let tips = ''
      if (state === '1') {
        tips = '二次确认!是否确认停发选中员工'
      } else {
        tips = '二次确认!是否确认启用选中员工'
      }
      var result = await this.confirm(`${tips}(目前共选中${this.checkedPeopleNums})`)
      if (!result) {
        return
      }
      var params = this.checkedPeople.map(item => ({
        emp_code: item,
        status: state
      }))
      console.log(params)
      await UpdSalaryStatus(this.monthNo, params)
        .then((res) => {
          this.$message({
            message: '员工工资发放状态更新成功!',
            type: 'success'
          })
          this.getDataList()
        })
      // 调用相应的批量更新接口
    },
    /**
     * 控制所有选中人员
     */
    handleSelectionChange(val) {
      this.checkedPeopleNums = val.length
      this.checkedPeople = val.map(item => item.EMP_CODE)
    },
    /**
     * 修改特定人员的停发/启用状态
     */
    async handleChangeUserStatus(scope) {
      var state
      if (scope.row.STATUS === '0') {
        state = '1'
      } else {
        state = '0'
      }
      var params = [{
        emp_code: scope.row.EMP_CODE,
        status: state
      }]
      // console.log(this.monthNo)
      await UpdSalaryStatus(this.monthNo, params)
        .then((res) => {
          this.$message({
            message: '员工工资发放状态更新成功!',
            type: 'success'
          })
          scope.row.STATUS = state
        })
    },
    /**
     * 导出EXCEL文件
     */
    async exportEmployeeExcel() {

    },
    toggleDialogVisible(val) {
      this.dialogVisible = !this.dialogVisible
      if (val === true) {
        this.getDataList()
      }
    }
  }
}
</script>

<style lang ='scss' scoped>
.table{
  margin-bottom: 30px;
  margin-top: 30px;
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
.sub-btngroups{
  display: flex;
  flex-direction: row-reverse;
  margin-top: 30px;
}
.sub-btn-destext{
  font-size: 9px;
  margin-top: 5px;
  margin-bottom: 0px;
  font-weight: bold;
}
.sub-btn{
  font-size: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}
.sub-btngroup{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}
</style>
