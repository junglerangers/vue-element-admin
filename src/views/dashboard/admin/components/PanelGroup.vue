<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当期实发奖金人数
          </div>
          <count-to :start-val="0" :end-val="1024" :duration="2600" class="card-panel-num" />
          (人次)
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当前实发金额总数
          </div>
          <count-to :start-val="0" :end-val="123600" :duration="3000" class="card-panel-num" />
          (元)
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            总计发放期数
          </div>
          <count-to :start-val="0" :end-val="13" :duration="3200" class="card-panel-num" />
          (期)
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" justify="center" align="center" style="height:108px">
      <div>
        <el-button type="primary" round @click="updateUsersInfo">更新人员信息</el-button>
      </div>
      <div>
        <el-button type="primary" class="margin20" round @click="test">更新部门信息</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { mapActions } from 'vuex'
import { getGridList } from '@/api/codeDict'

export default {
  components: {
    CountTo
  },
  computed: {
  },
  methods: {
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    updateUsersInfo() {
      var datetime = new Date()
      this.$message({
        message: '任务调用成功,开始导入本期人员数据',
        type: 'success'
      })
      const date = datetime.toISOString().split('T')[0]
      const time = datetime.getHours() + ':' + datetime.getMinutes() + ':' + datetime.getSeconds()
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: 'test',
        startTime: date + ' ' + time,
        endTime: '',
        taskState: '运行中'
      }
      this.addEvent(task)
      this.getTestInfo(task)
    },
    async getTestInfo(task) {
      console.log('进入异步')
      await new Promise(resolve => {
        setTimeout(() => {
          resolve('Done!')
        }, Math.random() * 5000)
      }).then(value => {
        console.log(value)
        const h = this.$createElement
        this.$notify({
          title: '任务完成通知',
          message: h('i', { style: 'color: teal' }, '恭喜您!' + task.taskName + '已经完成')
        })
        task.taskState = '已经完成'
        this.changeEventState(task)
      })
    },
    test() {
      console.log('This is test')
      var params = {
        decode: '0101'
      }
      getGridList(params).then(data => console.log(data))
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }
  .el-button{
    box-shadow: -2px 3px 3px 0px #333;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: -6px 7px 10px 0px #333;
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.margin20{
  margin: 20px;
}
</style>
