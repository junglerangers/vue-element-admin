<template>
  <div
    v-loading="loading"
    class="app-container margin50"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-date-picker
      v-model="monthTime"
      type="month"
      placeholder="请选择相应月份"
      :clearable="false"
    />
    <el-button type="primary" @click="test">导入</el-button>
  </div>
</template>

<script>
import { Import } from '@/api/welfare'
import { getCurrentTime } from '@/utils/time'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      monthTime: '',
      loading: false
    }
  },
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    test() {
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
            duration: 0
          })
        })
    }
  }
}
</script>

<style lang="scss">
.margin50{
  margin: 50px;
}
</style>
