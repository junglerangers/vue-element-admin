<template>
  <div
    v-loading="loading"
    class="app-container margin50"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div>奖金福利导入:<el-date-picker v-model="monthTime" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="updateWelfare">导入</el-button>
    </div>
    <div>
      重新计算社保:<el-date-picker v-model="monthTime2" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="updateSocialInsurance">计算</el-button>
    </div>
    <div>
      获取工资与银行卡信息:<el-date-picker v-model="monthTime3" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="updateSalaryandBankcard">获取</el-button>
    </div>
    <div>
      人事部门信息:<el-date-picker v-model="monthTime4" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="ImportDept">获取</el-button>
    </div>
    <div>
      人事员工信息:<el-date-picker v-model="monthTime5" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="ImportEmployee">获取</el-button>
    </div>
    <div>
      总收入报表导出:<el-date-picker v-model="monthTime6Start" type="month" placeholder="请选择相应月份" :clearable="false" />
      至<el-date-picker v-model="monthTime6End" type="month" placeholder="请选择相应月份" :clearable="false" />
      <el-button type="primary" @click="ExportSalaryInfo">获取</el-button>
    </div>
  </div>
</template>

<script>
import { Import, CompInsCal } from '@/api/welfare'
import { getCurrentTime } from '@/utils/time'
import { SalaryImport, DeptImport, EmployeeImport } from '@/api/import'
import { AnnualIncomeExp } from '@/api/salary'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      monthTime: '',
      monthTime2: '',
      monthTime3: '',
      monthTime4: '',
      monthTime5: '',
      monthTime6Start: '',
      monthTime6End: '',
      loading: false,
      dataObject: {
        dataList: [
          { TCODE: 'T01', AMOUNT: '500', Chilist: [
            { AMOUNT: '50', TCODE: 'T0101' },
            { AMOUNT: '450', TCODE: 'T0102' }
          ] },
          { TCODE: 'T02', AMOUNT: '253' }
        ]
      }
    }
  },
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    updateWelfare() {
      this.importGeneric(Import, this.monthTime, '奖金福利导入')
    },
    updateSocialInsurance() {
      this.importGeneric(CompInsCal, this.monthTime2, '社保数据导入')
    },
    updateSalaryandBankcard() {
      this.importGeneric(SalaryImport, this.monthTime3, '工资与银行卡信息导入')
    },
    ImportDept() {
      console.log(this.monthTime4)
      this.importGeneric(DeptImport, this.monthTime4, '人事部门信息导入')
    },
    ImportEmployee() {
      this.importGeneric(EmployeeImport, this.monthTime5, '人事员工信息导入')
    },
    ExportSalaryInfo() {
      if (!this.monthTime6Start || !this.monthTime6End) {
        this.$message.error('请先选择开始时间与结束时间后再操作!')
        return
      }
      var date = new Date(this.monthTime6Start)
      var temp1 =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      date = new Date(this.monthTime6End)
      var temp2 =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      var params = {
        'beginMonthNo': temp1,
        'endMonthNo': temp2
      }
      // console.log(params)
      this.importGeneric(AnnualIncomeExp, '', '总收入报表导出', params)
    },
    importGeneric(fun, monthTime, taskName, params = null) {
      var temp = ''
      if (!params) {
        if (!monthTime) {
          this.$message.error('请先选择时间后再操作!')
          return
        }
        var date = new Date(monthTime)
        temp =
          date.getFullYear() +
          '-' +
          (1 + date.getMonth()).toString().padStart(2, '0')
        params = {
          'monthNo': temp
        }
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: temp + taskName,
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.$message({
        message: temp + taskName + '开始,请稍等'
      })
      this.addEvent(task)
      fun(params)
        .then(res => {
          task.taskState = '完成'
          task.endTime = getCurrentTime()
        })
        .catch(err => {
          console.log(err)
          task.endTime = getCurrentTime()
          task.taskState = '错误'
          task.info = err
        })
        .finally(() => {
          const h = this.$createElement
          this.$notify({
            title: '通知',
            message: h('i', { style: 'color: #0084ff' }, task.taskName + task.taskState),
            duration: 5000
          })
        })
    }
  }
}
</script>

<style lang="scss">
.margin50{
  margin: 50px;
  line-height: 3;
}
.flex{
  display: flex;
  justify-content: flex-start;
  width: 1200px;
}
</style>
