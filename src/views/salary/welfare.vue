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
  </div>
</template>

<script>
import { Import, CompInsCal } from '@/api/welfare'
import { getCurrentTime } from '@/utils/time'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      monthTime: '',
      monthTime2: '',
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
      if (!this.monthTime) {
        this.$message.error('请先选择时间后再操作!')
        return
      }
      var date = new Date(this.monthTime)
      var temp =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      var params = {
        'monthNo': temp
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: temp + '奖金福利导入',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.$message({
        message: temp + '奖金福利开始导入,请稍等'
      })
      this.addEvent(task)
      Import(params)
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
    },
    updateSocialInsurance() {
      if (!this.monthTime2) {
        this.$message.error('请先选择时间后再操作!')
        return
      }
      var date = new Date(this.monthTime2)
      var temp =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      var params = {
        'monthNo': temp
      }
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: temp + '社保重新计算',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.$message({
        message: temp + '社保开始重新计算,请稍等'
      })
      this.addEvent(task)
      CompInsCal(params)
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
