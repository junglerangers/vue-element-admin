<template>
  <div ref="main" class="app-container">
    时间:
    <div class="year-class">
      <el-date-picker
        v-model="timeYear"
        type="year"
        value-format="yyyy"
        clearable
        placeholder="请选择相应年份"
      />
    </div>
    -
    <div class="month-class">
      <el-date-picker
        v-model="timeMonth"
        format="MM"
        type="month"
        value-format="MM"
        clearable
        placeholder="请选择相应月份"
      />
    </div>
    <el-button-group>
      <el-button class="primary" @click="searchHandler">确认</el-button>
      <el-button class="primary" @click="initialTime">重置</el-button>
    </el-button-group>
    <!-- <search @search="searchHandler" /> -->
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
      <el-table-column align="center" label="年份" width="100">
        <template slot-scope="scope">
          {{ scope.row.YEARNO }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="月份" width="100">
        <template slot-scope="scope">
          {{ scope.row.MONTHNO }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人员" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEUSER }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ISLOCK === '0'" type="success">未锁定</el-tag>
          <el-tag v-else type="info">锁定</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="明细" @click="handleEdit(scope)">明细</el-button>
          <el-button v-if="scope.row.ISLOCK === '0'" type="text" size="small" icon="el-icon-lock" title="锁定" circle @click="handleClock(scope)">锁定</el-button>
          <el-button v-else type="text" size="small" icon="el-icon-unlock" title="解锁" circle @click="handleClock(scope)">解锁</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
          <el-button type="text" size="small" icon="el-icon-s-promotion" title="发送" circle @click="beforeSend(scope)">OA发送</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 用户界面创建/编辑框 -->
    <el-dialog
      title="备注信息"
      :visible.sync="OASendDialogVisible"
      width="40%"
    >
      <textarea v-model="OARemark" class="oaremark" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" @click="handleSend">发送OA</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMstPageQuery, lockData, localDelete } from '@/api/salary'
import * as defaultModel from '@/dataModel/SalaryTypeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import { OAapplyForm } from '@/api/OA'
import { getCurrentTime } from '@/utils/time'
import { mapActions } from 'vuex'

export default {
  name: 'SalaryIndex',
  components: {
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      OASendDialogVisible: false,
      checkedSlv: {},
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      dataList: [], // 所有数据列表
      timeYear: null,
      timeMonth: null,
      OARemark: '',
      searchModel: {
        'autoid': '',
        'dcode': '',
        'yearno': '',
        'monthno': '',
        'num': '',
        'islock': '',
        'remark': ''
      }
    }
  },
  computed: {
    userCode: function() {
      return this.$store.state.user.userInfo.code
    }
  },
  created() {
    this.getDataList()
    // this.getDepList()
    // this.getTypeList()
  },
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    async getDataList() {
      //   var temp = {
      //     ...this.searchModel,
      //     currentPage: this.page_currentPage,
      //     size: this.page_size
      //   }
      this.loading = true
      var temp = {
        'queryModel': this.searchModel,
        'pageHandler': {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      const res = await getMstPageQuery(temp)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    dialogClose() {
      this.OASendDialogVisible = false
      this.OARemark = ''
    },
    beforeSend(scope) {
      console.log(scope.row)
      this.OASendDialogVisible = true
      this.checkedSlv = scope.row
    },
    async handleSend() {
      if (this.OARemark.trim() === '' || this.OARemark == null) {
        this.$message({
          message: '备注信息不允许为空',
          type: 'warning',
          duration: '3000'
        })
        return
      }
      var params = {
        mstId: this.checkedSlv.AUTOID,
        remark: this.OARemark,
        userCode: this.userCode
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: this.checkedSlv.YEARNO + '-' + this.checkedSlv.MONTHNO + 'OA流程发送',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.addEvent(task)
      console.log(params)
      this.dialogClose()
      OAapplyForm(params).then((res) => {
        console.log(res)
        task.taskState = '完成'
        task.endTime = getCurrentTime()
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
      })
    },
    handleEdit(scope) {
      this.currentModel = scope.row
      this.$store.dispatch('salary/getSalary', this.currentModel)
      this.$router.push('/salary/salaryDetail')
    },
    searchHandler(searchModel) {
      this.searchModel = Object.assign(this.searchModel, searchModel)
      this.searchModel.monthno = this.timeMonth
      this.searchModel.yearno = this.timeYear
      this.getDataList()
      // console.log(this.dataModel)
    },
    initialTime() {
      this.timeMonth = null
      this.timeYear = null
      this.searchHandler()
    },
    initialSearchModel() {
      this.searchModel.monthno = ''
      this.searchModel.yearno = ''
    },
    handleDelete(scope) {
      var AutoId = scope.row.AUTOID
      var params = {
        AutoId: AutoId
      }
      this.$confirm('确认删除当前工资单?(此操作无法撤销!!!)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localDelete(params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.initialSearchModel()
          this.getDataList()
        })
      }).catch(() => {})
    },
    handleClock(scope) {
      var monthNo = scope.row.YEARNO + '-' + scope.row.MONTHNO
      var islock = scope.row.ISLOCK === '0'
      var params = {
        monthNo: monthNo,
        islock: islock
      }
      var tipStr = islock ? `此操作将锁定${monthNo}时间段的所有数据,是否继续?` : `此操作将解锁${monthNo}时间段的所有数据,是否继续?`
      var finishTipStr = islock ? '锁定成功!' : '解锁成功!'
      this.$confirm(tipStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lockData(params).then(() => {
          this.$message({
            type: 'success',
            message: finishTipStr
          })
          scope.row.ISLOCK = islock ? '1' : '0'
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
.oaremark{
  width:100%;
  height: 80px;
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
.year-class{
  width:220px;
  display: inline-block;
}
.month-class{
  width:240px;
  display: inline-block;
}
</style>
