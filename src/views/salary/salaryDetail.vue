<template>
  <div class="app-container">
    <div class="subinline">
      <el-date-picker v-model="timePicker.YEARNO" type="year" value-format="yyyy" :disabled="true" size="mini" />
    </div>
    <span>年</span>
    <div class="subinline">
      <el-date-picker
        v-model="timePicker.MONTHNO"
        format="MM"
        type="month"
        value-format="MM"
        :disabled="true"
        size="mini"
      />
    </div>
    <span>月</span>
    <div class="subinline">
      <el-input v-model="timePicker.NUM" :disabled="true" size="mini" />
    </div>
    <span>期</span>
    <search @search="searchHandler" />
    <el-button type="primary" size="mini" style="font-size: 10px" @click="updateAllMembersSpecSlv">工资全部更新(筛选后结果,共计{{
      page_total }}条)</el-button>
    <el-table
      ref="dataTable"
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList"
      class="subtable"
      max-height="450"
      :summary-method="getSummaries"
      show-summary
      border
      :sort-orders="['ascending', 'descending', null]"
      @sort-change="changeTableSort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" :index="page_CurrentIndex" width="50" align="center" label="序号" fixed />
      <el-table-column align="center" label="员工工号" width="80" fixed>
        <template slot-scope="scope">
          {{ scope.row.员工工号 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工姓名" width="80" fixed>
        <template slot-scope="scope">
          {{ scope.row.员工姓名 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.部门名称 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员性质" width="100">
        <template slot-scope="scope">
          {{ scope.row.人员性质 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员分类" width="100">
        <template slot-scope="scope">
          {{ scope.row.人员分类 }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableHeaders"
        :key="item"
        align="center"
        :label="item"
        width="100"
        :sortable="'custom'"
      >
        <template slot-scope="scope">
          {{ scope.row[item] }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="250">
        <template slot="header">
          <el-button-group class="sub-btngroup">
            <el-button class="sub-btn" type="primary" size="small" @click="updateMembersSpecSlv">
              <div style="display: inline-block">
                选中更新
                <p class="sub-btn-destext">(选中{{ checkedPeopleNums }}条)</p>
              </div>
            </el-button>
            <el-button class="sub-btn" type="primary" size="small" @click="changeCheckedMembers">
              <div style="display: inline-block">
                选中停用
                <p class="sub-btn-destext">(选中{{ checkedPeopleNums }}条)</p>
              </div>
            </el-button>
            <el-upload action="blank" :show-file-list="false" accept="xlsx,xls" :http-request="salaryUpload">
              <el-button size="small" type="primary" title="上传" icon="el-icon-download" />
            </el-upload>
            <el-upload action="blank" :show-file-list="false" accept="xlsx,xls" :http-request="salaryPartUpload">
              <el-button size="small" type="primary" title="部分上传" icon="el-icon-sort-down" />
            </el-upload>
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-remove-outline"
            title="停发"
            @click="handleChangeUserStatus(scope)"
          >停发</el-button>
        </template>
      </el-table-column>
    </el-table>

    <detailDialog
      :current-user="currentModel"
      :dialog-visible="dialogVisible"
      @toggleVisible="dialogVisible = !dialogVisible"
      @update="getDataList"
    />
    <el-dialog v-loading="typeloading" :title="salaryEditTitle" :visible.sync="membersUpdateDialogVisibel" width="60%">
      <div class="sub-flex-row">
        <el-table
          ref="salaryChangeTab"
          :data="salaryTypeDict.filter(
            (data) =>
              !search ||
              data.TNAME.toLowerCase().includes(search.toLowerCase())
          )
          "
          :row-key="getRowKey"
          style="width: 33%"
          max-height="350"
          class="sub-salary-choice"
          @selection-change="salaryTypehandleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" width="50" />
          <el-table-column width="120" align="left">
            <template slot="header">
              <el-input v-model="search" size="mini" placeholder="搜索" />
            </template>
            <template slot-scope="scope">{{ scope.row.TNAME }}</template>
          </el-table-column>
        </el-table>
        <div class="sub-salary-edit">
          <el-input
            v-for="item in selectedSalaryType"
            :key="item.TCODE"
            v-model="item.amount"
            placeholder="请输入金额"
            class="item"
          >
            <template slot="prepend">{{ item.TNAME }}</template>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSlvChange">取消</el-button>
        <el-button type="primary" @click="saveSlvChange">保存</el-button>
      </span>
    </el-dialog>
    <div class="block footer pagination_fixed_footer" :style="{ width: footerWidth }">
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
import {
  getSlvPageQuery,
  localImport as salaryImport,
  isExist as isSalaryExist,
  GetSlvFormModel,
  AmountReplace,
  localPartImport
} from '@/api/salary'
import { getGridList } from '@/api/salaryType'
import { search, detailDialog } from './components'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import confirm from '@/mixins/confirm'
import { UpdSalaryStatus, getGridList as getMembersList } from '@/api/employee'
import { upload as Excelupload } from '@/utils/excel'
import { mapActions } from 'vuex'
import { getCurrentTime } from '@/utils/time'

export default {
  name: 'SalaryDetail',
  components: {
    search,
    detailDialog
  },
  mixins: [resize, tablePage, searchMethod, confirm],
  data: function() {
    return {
      loading: false,
      typeloading: false,
      currentModel: {
        mst: {
          MSTID: '',
          ENUM: '',
          ENAME: '',
          DEPT_CODE: '',
          DEPT_NAME: '',
          SEX_NAME: '',
          ID_CARD: '',
          KIND_CODE: '',
          KIND_NAME: '',
          EMP_CLASS: '',
          EMP_CLASSNAME: '',
          HOSAREA: '',
          HOSAREANAME: ''
        },
        slvList: []
      }, // 当前选中的模型
      sortModel: [],
      dialogVisible: false, // 对话框是否可见
      membersUpdateDialogVisibel: false,
      dataList: [], // 所有数据列表
      searchModel: {
        mstid: '',
        enum: '',
        ename: ''
      },
      originalSalary: null,
      salaryTypeDict: [], // 薪酬类型字典
      selectedSalaryType: [],
      timePicker: {
        YEARNO: '',
        MONTHNO: '',
        NUM: ''
      },
      sumObject: {},
      tableHeaders: [],
      checkedPeople: [],
      checkedPeopleNums: 0,
      slvEditPeopel: [],
      search: ''
    }
  },
  computed: {
    salary: function() {
      // 薪资单主表
      return this.$store.state.salary.cachedSalary
    },
    mstid: function() {
      // 薪资单ID
      return this.salary.AUTOID
    },
    monthNo: function() {
      return this.salary.YEARNO + '-' + this.salary.MONTHNO
    },
    salaryEditTitle: function() {
      return `金额批量更新(目前选中${this.checkedPeopleNums}人)`
    }
  },
  async created() {
    await this.pageInitial()
  },
  async activated() {
    await this.pageInitial()
    this.$nextTick(() => {
      this.$refs.dataTable.doLayout()
    })
  },
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    /**
     * 页面初始化操作
     */
    async pageInitial() {
      if (this.salary) {
        // 如果与原页面数据相同,则无需重复加载
        if (this.salary !== this.originalSalary) {
          this.originalSalary = this.salary
          await this.getDataList()
          this.getSalaryType()
          this.timePicker.YEARNO = this.salary.YEARNO
          this.timePicker.MONTHNO = this.salary.MONTHNO
          this.timePicker.NUM = this.salary.NUM
        }
      } else {
        this.$message({
          message: '请优先选择一张工资单主表!',
          type: 'warning'
        })
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.replace('/salary/index')
      }
    },
    getRowKey(row) {
      return row.TCODE
    },
    /**
     * 获取薪资类别
     */
    async getSalaryType() {
      var res = await getGridList({ monthNo: this.monthNo })
      this.salaryTypeDict = res.data
      // console.log(this.salaryTypeDict)
    },
    /**
     * 表格数据汇总展示
     */
    getSummaries(param) {
      const { columns } = param
      const sum = []
      columns.forEach((element, index) => {
        if (
          Object.prototype.hasOwnProperty.call(this.sumObject, element.label)
        ) {
          sum[index] = this.sumObject[element.label]
        } else {
          sum[index] = ' '
        }
      })

      sum[3] = this.page_total + '人'
      sum[2] = '合计'
      return sum
    },
    /**
     * 薪资明细上传
     */
    async salaryUpload(e) {
      var sign = await this.confirm(
        '已经存在相应月份的数据,是否需要重新导入?(重新导入会覆盖原本的数据!)',
        isSalaryExist,
        this.mstid
      )
      if (!sign) {
        return
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: this.monthNo + '薪资明细上传',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.addEvent(task)
      await Excelupload(this.mstid, e.file, this.salaryTypeDict)
        .then(async(params) => {
          await salaryImport(params)
        })
        .then((res) => {
          task.endTime = getCurrentTime()
          task.taskState = '完成'
        })
        .catch((err) => {
          task.taskState = '错误'
          task.endTime = getCurrentTime()
          task.info = err
        })
        .finally(() => {
          const h = this.$createElement
          this.$notify({
            title: '通知',
            message: h(
              'i',
              { style: 'color: teal' },
              task.taskName + task.taskState
            )
          })
        })
    },
    /**
     * 薪资部分上传
     */
    async salaryPartUpload(e) {
      var sign = await this.confirm(
        '已经存在相应月份的数据,是否需要导入?(导入会更新原本的数据!)',
        isSalaryExist,
        this.mstid
      )
      if (!sign) {
        return
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: this.monthNo + '薪资明细更新上传',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.addEvent(task)
      await Excelupload(this.mstid, e.file, this.salaryTypeDict)
        .then(async(params) => {
          await localPartImport(params)
        })
        .then((res) => {
          task.endTime = getCurrentTime()
          task.taskState = '完成'
        })
        .catch((err) => {
          task.taskState = '错误'
          task.endTime = getCurrentTime()
          task.info = err
        })
        .finally(() => {
          const h = this.$createElement
          this.$notify({
            title: '通知',
            message: h(
              'i',
              { style: 'color: teal' },
              task.taskName + task.taskState
            )
          })
        })
    },
    /**
     * 获取选中条件下所有人员的薪资信息
     */
    async getDataList() {
      this.loading = true
      this.searchModel.mstid = this.mstid
      var params = {
        queryModel: this.searchModel,
        pageHandler: {
          size: this.page_size,
          currentPage: this.page_currentPage
        }
      }
      params.queryModel.sortList = this.sortModel
      // console.log(params)
      const res = await getSlvPageQuery(params)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.tableHeaders = []
      res.slvSumList.forEach((element) => {
        this.sumObject[element.TNAME] = element.AMOUNT // 展示所有的合计项
        this.tableHeaders.push(element.TNAME) // 获得相应的表头信息
      })
      this.$nextTick(() => {
        this.$refs.dataTable.doLayout()
      })
      this.loading = false
    },
    /**
     * 暂停发放所有选中人员工资发放
     */
    async changeCheckedMembers() {
      const tips = '二次确认!是否确认停发选中员工'
      var result = await this.confirm(
        `${tips}(目前共选中${this.checkedPeopleNums})`
      )
      if (!result) {
        return
      }
      var params = this.checkedPeople.map((item) => ({
        emp_code: item,
        status: '1'
      }))
      // console.log(params)
      await UpdSalaryStatus(this.monthNo, params).then((res) => {
        this.$message({
          message: '员工工资停发成功!',
          type: 'success'
        })
        this.getDataList()
      })
      // 调用相应的批量更新接口
    },
    /**
     * 获取特定人员的薪资详情,并进行编辑
     */
    async handleEdit(scope) {
      this.loading = true
      GetSlvFormModel({
        mstid: this.mstid,
        enum: scope.row.员工工号,
        ename: scope.row.员工姓名
      })
        .then((res) => {
          this.currentModel = res.data
          this.dialogVisible = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    /**
     * 后端排序函数
     * @param column
     */
    changeTableSort(column) {
      if (column.order != null) {
        this.sortModel = [
          {
            sort_Field: column.column.label,
            sort_Type: column.order === 'descending' ? 'DESC' : 'ASC'
          }
        ]
      } else {
        this.sortModel = null
      }
      this.getDataList()
    },
    /**
     * 控制所有选中人员
     */
    handleSelectionChange(val) {
      this.checkedPeopleNums = val.length
      this.checkedPeople = val.map((item) => item.员工工号)
    },
    salaryTypehandleSelectionChange(val) {
      this.selectedSalaryType = val.map((item) => ({
        TCODE: item.TCODE,
        TNAME: item.TNAME,
        amount: ''
      }))
      // console.log(this.selectedSalaryType)
    },
    /**
     * 修改特定人员的停发/启用状态
     */
    async handleChangeUserStatus(scope) {
      var state = '1'
      var params = [
        {
          emp_code: scope.row.ENUM,
          status: state
        }
      ]
      await UpdSalaryStatus(this.monthNo, params).then((res) => {
        this.$message({
          message: '员工工资发放状态更新成功!',
          type: 'success'
        })
        var index = this.dataList.indexOf(scope.row)
        this.dataList.splice(index, 1)
      })
    },
    async updateAllMembersSpecSlv() {
      this.membersUpdateDialogVisibel = true
      this.checkedPeopleNums = this.page_total
      var params = { ...this.searchModel }
      params.monthNo = this.monthNo
      params.EMP_CODE = params.enum
      params.EMP_NAME = params.ename
      params.mstid = ''
      params.status = '0'
      // 获取当月所有人员的数据信息
      await getMembersList(params).then((res) => {
        this.slvEditPeopel = res.data.map((item) => ({
          emP_CODE: item.EMP_CODE
        }))
        // console.log(params)
        // console.log(res)
      })
    },
    async updateMembersSpecSlv() {
      this.membersUpdateDialogVisibel = true
      this.checkedPeopleNums = this.checkedPeople.length
      this.slvEditPeopel = this.checkedPeople.map((item) => ({
        emp_code: item
      }))
    },
    cancelSlvChange() {
      this.membersUpdateDialogVisibel = false
      this.selectedSalaryType = []
      this.$refs.salaryChangeTab.clearSelection()
    },
    async saveSlvChange() {
      this.typeloading = true
      // console.log(this.typeloading)
      var params2 = {
        mstid: this.mstid,
        slvList: this.selectedSalaryType,
        empList: this.slvEditPeopel
      }
      // console.log(params2)
      await AmountReplace(params2)
        .then((res) => {
          // console.log(res)
          this.$message({
            message: '工资批量更新成功!',
            type: 'success'
          })
          this.membersUpdateDialogVisibel = false
          this.getDataList()
          this.selectedSalaryType = []
          this.checkedPeopleNums = 0
        })
        .finally((this.typeloading = false))
      this.$refs.salaryChangeTab.clearSelection()
    }
  }
}
</script>

<style lang="scss" scoped>
.subtable {
  margin-bottom: 30px;
  margin-top: 30px;
  width: 100%;
  font-size: x-small;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  width: fit-content;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}

.el-dialog .el-dialog__body {
  flex: 1;
  overflow: auto;
}

.subinline {
  display: inline-block;
}

.sub-btn-destext {
  font-size: 9px;
  margin-top: 5px;
  margin-bottom: 0px;
  font-weight: bold;
}

.sub-btngroup {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}

.sub-btn {
  font-size: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
}

.sub-flex-row {
  display: flex;
  flex-direction: row;
}

.sub-salary-edit {
  width: 67%;
  flex-wrap: wrap;
  display: flex;
  height: fit-content;
  justify-content: flex-start;
}

.sub-salary-edit .item {
  width: 45%;
  margin: 10px;
}
</style>
