<template>
  <div
    v-loading="loading"
    class="app-container margin50"
    element-loading-text="数据导入中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-steps :active="active" finish-status="success">
      <el-step title="选择相应期数" />
      <el-step title="获取部门数据" />
      <el-step title="获取员工数据" />
      <el-step title="薪酬类别导入" />
      <el-step title="新增工资单主表" />
      <el-step title="工资单明细导入" />
    </el-steps>
    <el-collapse v-model="activeName" accordion :style="{'margin-top':'50px'}">
      <el-collapse-item title="1.新增工资单期数选择" name="1">
        <div class="year-class">
          <el-date-picker
            v-model="time.yearNo"
            type="year"
            value-format="yyyy"
            placeholder="请选择相应年份"
            :disabled="active !== 0"
          />
        </div>
        年
        <div class="year-class">
          <el-date-picker
            v-model="time.monthNo"
            format="MM"
            type="month"
            value-format="MM"
            placeholder="请选择相应月份"
            :disabled="active !== 0"
          />
        </div>
        月
        <div class="month-class">
          <el-input
            v-model="time.num"
            placeholder="请选择相应期数"
            :disabled="active !== 0"
          />
        </div>期
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="setTime">下一步</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="setTime">数据一键导入</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="initial">重新开始</el-button>
      </el-collapse-item>
      <el-collapse-item title="2.获取部门数据" name="2">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="getDepartmentList">导入部门数据</el-button>
      </el-collapse-item>
      <el-collapse-item title="3.获取员工数据" name="3">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="getUserList">导入员工数据</el-button>
      </el-collapse-item>
      <el-collapse-item title="4.薪酬类别导入" name="4">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="dialogVisible = true">薪酬类别复制</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}">薪酬类别新增</el-button>
      </el-collapse-item>
      <el-collapse-item title="5.工资单主表新增" name="5">
        <el-button type="primary" plain :style="{'margin-left':'50px'}">工资单主表新增</el-button>
      </el-collapse-item>
      <el-collapse-item title="6.工资单明细表导入" name="6">
        <el-button type="primary" plain :style="{'margin-left':'50px'}">工资单明细表导入</el-button>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="薪资复制选择框"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="block">
        <span>薪资复制(月份)</span>
        <el-date-picker
          v-model="copyMonth"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :picker-options="pickerOptions"
          class="dialogContent"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="salaryTypeCopy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { localImport as departmentImport, isExist as isDepartmentExist } from '@/api/department'
import { localImport as userImport, isExist as isEmployeeExist } from '@/api/employee'
import { localCopy } from '@/api/salaryType'

export default {
  data() {
    return {
      loading: false,
      dialogVisible: false,
      activeName: '1',
      active: 0,
      time: {
        monthNo: new Date(),
        yearNo: new Date(),
        num: 1
      }
    }
  },
  computed: {
    params: function() {
      return this.time.yearNo.getFullYear() + '-' + (1 + this.time.monthNo.getMonth()).toString().padStart(2, '0')
    }
  },
  created() {
  },
  methods: {
    async test() {
      await new Promise(resolve => {
        setTimeout(() => {
          resolve('Done!')
        }, 2000)
      }).then(value => {
        this.active = '2'
      })
    },
    async getDepartmentList() {
      if (!this.timeTest()) {
        return
      }
      var sign1 = await isDepartmentExist(this.params)
      var sign2 = await this.confirm()
      if (sign1 && !sign2) {
        this.activeName = '3'
        this.active = 2
      } else {
        this.loading = true
        departmentImport({ monthNo: this.params }).then(res => {
          this.$message({
            message: '部门信息导入成功',
            type: 'success'
          })
          this.activeName = '3'
          this.active = 2
          this.loading = false
        })
      }
    },
    async getUserList() {
      if (!this.timeTest()) {
        return
      }
      var sign1 = await isEmployeeExist(this.params)
      var sign2 = await this.confirm()
      if (sign1 && !sign2) {
        // 如果已经存在已经有的数据,提示用户是重新导入数据,还是使用现有的数据
        this.activeName = '4'
        this.active = 3
      } else {
        this.loading = true
        userImport({ monthNo: this.params }).then(res => {
          this.$message({
            message: '员工信息导入成功',
            type: 'success'
          })
          this.activeName = '4'
          this.active = 3
          this.loading = false
        })
      }
    },
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
    },
    timeTest() {
      if (!this.time.yearNo) {
        this.$message({
          message: '请先选择相应年份',
          type: 'warning'
        })
        return false
      }
      if (!this.time.monthNo) {
        this.$message({
          message: '请先选择相应月份',
          type: 'warning'
        })
        return false
      }
      if (!this.time.num) {
        this.$message({
          message: '请先选择相应期数',
          type: 'warning'
        })
        return false
      }
      return true
    },
    setTime() {
      if (this.timeTest()) {
        this.activeName = '2'
        this.active = 1
      }
    },
    salaryTypeCopy() {
      this.dialogVisible = false
      var start = this.copyMonth[0]
      start = start.getFullYear() + '-' + (start.getMonth() + 1)
      var end = this.copyMonth[1]
      end = end.getFullYear() + '-' + (end.getMonth() + 1)
      var params = {
        'monthNo': start,
        'copyFromMonthNo': end
      }
      localCopy(params).then(res => {
        this.$message({
          message: '薪资复制成功!',
          type: 'success'
        })
      })
      // 发送复制的请求
    },
    initial() {
      this.activeName = '1'
      this.active = 0
      this.time.yearNo = new Date()
      this.time.monthNo = new Date()
    }
  }
}
</script>

<style lang="scss" scoped>
.margin50{
  margin: 50px;
}
.year-class{
  width:220px;
  display: inline-block;
}
.month-class{
  width:240px;
  display: inline-block;
}
.el-step__main{
    transition: color 5s;
}
.el-step__head.is-success{
  transition: color 5s;
}
.is-success{
  transition: all 5s;
}
.animate:hover{
    background-color: green;
  cursor: pointer;
  transition: background-color 5s ease-out;
}
</style>
