<template>
  <div class="app-container">
    <div class="inline220">
      <el-date-picker
        v-model="timePicker.YEARNO"
        type="year"
        value-format="yyyy"
        placeholder="请选择相应年份"
        :disabled="true"
      />
    </div>
    年-
    <div class="inline220">
      <el-date-picker
        v-model="timePicker.MONTHNO"
        format="MM"
        type="month"
        value-format="MM"
        placeholder="请选择相应月份"
        :disabled="true"
      />
    </div>
    月-
    <div class="inline240">
      <el-input
        v-model="timePicker.NUM"
        placeholder="请选择相应期数"
        :disabled="true"
      />
    </div>期
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
      <el-table-column align="center" label="科室名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.部门名称 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.员工姓名 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工工号" width="100">
        <template slot-scope="scope">
          {{ scope.row.员工工号 }}
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
      <el-table-column align="center" label="应发合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.应发合计 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣款合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.扣款合计 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实发合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.实发合计===null?0:scope.row.实发合计 }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-upload
              action="blank"
              :show-file-list="false"
              accept="xlsx,xls"
              :http-request="salaryUpload"
              :style="{'margin-left':'50px'}"
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
import { getSlvPageQuery, localImport as salaryImport, isExist as isSalaryExist, GetSlvFormModel } from '@/api/salary'
import { getGridList } from '@/api/salaryType'
import { search, detailDialog } from './components'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import { upload as Excelupload } from '@/utils/excel'
import { mapActions } from 'vuex'
import { getCurrentTime } from '@/utils/time'

export default {
  name: 'SalaryDetail',
  components: {
    search,
    detailDialog
  },
  mixins: [resize, tablePage, searchMethod],
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
      tempSalary: null,
      salaryTypeDict: [], // 薪酬类型字典
      timePicker: {
        YEARNO: '',
        MONTHNO: '',
        NUM: ''
      }
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
  created() {
    if (this.salary) { // 如果已经选中了一个薪资单
      if (this.salary !== this.tempSalary) {
        this.tempSalary = this.salary
        this.getDataList()
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
  activated: function() {
    if (this.salary) { // 如果已经选中了一个薪资单
      if (this.salary !== this.tempSalary) {
        this.tempSalary = this.salary
        this.getDataList()
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
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    async getSalaryType() {
      var params = {
        monthNo: this.monthNo
      }
      // console.log(params)
      var res = await getGridList(params)
      this.salaryTypeDict = res.data
    },
    async salaryUpload(e) {
      var sign = await this.confirm(isSalaryExist)
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
    async confirm(fn) {
      var vue = this
      async function confirmBox() {
        var result = false
        await vue.$confirm('已经存在相应月份的数据,是否需要重新导入?(重新导入会覆盖原本的数据!)', '提示', {
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
      var sign1 = await fn(this.mstid)
      var sign2 = true
      if (sign1) {
        sign2 = await confirmBox()
      }
      if (sign1 && !sign2) {
        // 如果已经存在已经有的数据,提示用户是重新导入数据,还是使用现有的数据
        return false
      }
      return true
    },
    async getDataList() { // 获取所有人员的薪资信息
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
      this.loading = false
    },
    async handleEdit(scope) { // 获取特定人员的薪资详情,并进行编辑
      this.loading = true
      var params = {
        mstid: this.mstid,
        enum: scope.row.员工工号,
        ename: scope.row.员工姓名
      }
      GetSlvFormModel(params)
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
.inline220{
  width:220px;
  display: inline-block;
}
.inline240{
  width:240px;
  display: inline-block;
}
</style>
