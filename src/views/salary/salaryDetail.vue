<template>
  <div class="app-container">
    <div class="subinline">
      <el-date-picker
        v-model="timePicker.YEARNO"
        type="year"
        value-format="yyyy"
        :disabled="true"
        size="mini"
      />
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
      <el-input
        v-model="timePicker.NUM"
        :disabled="true"
        size="mini"
      />
    </div>
    <span>期</span>
    <search @search="searchHandler" />
    <el-table
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
    >
      <el-table-column type="index" :index="page_CurrentIndex" width="50" align="center" label="序号" fixed />
      <el-table-column align="center" label="员工姓名" width="100" fixed>
        <template slot-scope="scope">
          {{ scope.row.员工姓名 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工工号" width="100" fixed>
        <template slot-scope="scope">
          {{ scope.row.员工工号 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室名称" width="100">
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
      <el-table-column v-for="item in tableHeaders" :key="item" align="center" :label="item" width="100">
        <template slot-scope="scope">
          {{ scope.row[item] }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="100">
        <template slot="header">
          <el-button-group>
            <el-upload
              action="blank"
              :show-file-list="false"
              accept="xlsx,xls"
              :http-request="salaryUpload"
            >
              <el-button
                size="small"
                type="primary"
                title="上传"
                icon="el-icon-upload2"
              />
            </el-upload>
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <detailDialog :current-user="currentModel" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" @update="getDataList" />

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
  </div>
</template>

<script>
import { getSlvPageQuery, localImport as salaryImport, isExist as isSalaryExist, GetSlvFormModel } from '@/api/salary'
import { getGridList } from '@/api/salaryType'
import { search, detailDialog } from './components'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import confirm from '@/mixins/confirm'
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
      currentModel: {
        mst: {
          'MSTID': '',
          'ENUM': '',
          'ENAME': '',
          'DEPT_CODE': '',
          'DEPT_NAME': '',
          'SEX_NAME': '',
          'ID_CARD': '',
          'KIND_CODE': '',
          'KIND_NAME': '',
          'EMP_CLASS': '',
          'EMP_CLASSNAME': '',
          'HOSAREA': '',
          'HOSAREANAME': ''
        },
        slvList: []
      }, // 当前选中的模型
      dialogVisible: false, // 对话框是否可见
      dataList: [], // 所有数据列表
      searchModel: {
        mstid: '',
        enum: '',
        ename: ''
      },
      originalSalary: null,
      salaryTypeDict: [], // 薪酬类型字典
      timePicker: {
        YEARNO: '',
        MONTHNO: '',
        NUM: ''
      },
      sumObject: {},
      tableHeaders: []
    }
  },
  computed: {
    salary: function() { // 薪资单主表
      return this.$store.state.salary.cachedSalary
    },
    mstid: function() { // 薪资单ID
      return this.salary.AUTOID
    },
    monthNo: function() {
      return this.salary.YEARNO + '-' + this.salary.MONTHNO
    }
  },
  async created() {
    await this.pageInitial()
  },
  async activated() {
    await this.pageInitial()
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
      if (this.salary) { // 如果与原页面数据相同,则无需重复加载
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
    /**
     * 获取薪资类别
     */
    async getSalaryType() {
      var res = await getGridList({ monthNo: this.monthNo })
      this.salaryTypeDict = res.data
    },
    /**
     * 表格数据汇总展示
     */
    getSummaries(param) {
      const { columns } = param
      const sum = []
      columns.forEach((element, index) => {
        if (Object.prototype.hasOwnProperty.call(this.sumObject, element.label)) {
          sum[index] = this.sumObject[element.label]
        } else {
          sum[index] = 'N/A'
        }
      })
      sum[0] = ''
      sum[1] = '所有人员合计'
      return sum
    },
    /**
     * 薪资明细上传
     */
    async salaryUpload(e) {
      var sign = await this.confirm('已经存在相应月份的数据,是否需要重新导入?(重新导入会覆盖原本的数据!)', isSalaryExist, this.mstid)
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
      await Excelupload(this.mstid, e.file, this.salaryTypeDict).then(async params => {
        await salaryImport(params)
      }).then(res => {
        task.endTime = getCurrentTime()
        task.taskState = '完成'
      }).catch(err => {
        task.taskState = '错误'
        task.endTime = getCurrentTime()
        task.info = err
      }).finally(() => {
        const h = this.$createElement
        this.$notify({
          title: '通知',
          message: h('i', { style: 'color: teal' }, task.taskName + task.taskState)
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
        'queryModel': this.searchModel,
        'pageHandler': {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      const res = await getSlvPageQuery(params)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.tableHeaders = []
      res.slvSumList.forEach(element => {
        this.sumObject[element.TNAME] = element.AMOUNT// 展示所有的合计项
        this.tableHeaders.push(element.TNAME)// 获得相应的表头信息
      })
      this.loading = false
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
        .then(res => {
          this.currentModel = res.data
          this.dialogVisible = true
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.subtable{
  margin-bottom: 30px;
  margin-top: 30px;
  width: 100%;
  font-size: x-small;
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
.subinline{
  display: inline-block;
}
</style>
