<template>
  <div
    v-loading="loading"
    class="app-container margin50"
    element-loading-text="数据导入中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-steps :active="active" finish-status="success">
      <el-step v-for="op in opOrder" :key="op.index" :title="op.info" />
    </el-steps>
    <el-collapse v-model="activeName" accordion :style="{'margin-top':'50px'}">
      <el-collapse-item :title="opOrder[0].index+'.'+opOrder[0].info" name="1">
        <div class="year-class">
          <el-date-picker
            v-model="time.yearNo"
            format="yyyy"
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
        <el-descriptions title="" class="marginTB50" :column="2" :style="{'width':'875px'}">
          <el-descriptions-item label="薪资名称">
            <el-select v-model="MST.DNAME" placeholder="请选择" class="width220" @change="updateDCODE">
              <el-option
                v-for="item in salaryTypeDict"
                :key="item.DCODE"
                :label="item.DNAME"
                :value="item.DNAME"
              />
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item label="薪资编码">
            <el-input v-model="MST.DCODE" class="width220" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="备注" span="2">
            <el-input v-model="MST.REMARK" type="textarea" :readonly="false" :style="{'width':'685px'}" />
          </el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="setTime">下一步</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="initial">重新开始</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[1].index+'.'+opOrder[1].info" name="2">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="getDepartmentList">导入部门数据</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[2].index+'.'+opOrder[2].info" name="3">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="getUserList">导入员工数据</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[3].index+'.'+opOrder[3].info" name="4">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="dialogVisible = true">薪酬类别复制</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="showSalaryType">薪酬类别管理</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" @click="getSalaryDetailType">下一步</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[4].index+'.'+opOrder[4].info" name="5">
        <el-upload
          action="blank"
          :show-file-list="false"
          accept="xlsx,xls"
          :http-request="salaryUpload"
          :style="{'margin-left':'50px'}"
        >
          <el-button size="small" type="primary" plain>点击上传</el-button>
        </el-upload>
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
import { getSalaryTypeList, getGridList } from '@/api/salaryType'
import { localCopy } from '@/api/salaryType'
import { localAdd, localImport as salaryImport } from '@/api/salary'
import { upload as Excelupload } from '@/utils/excel'

export default {
  name: 'SalaryAdd',
  components: {
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      activeName: '1',
      active: 0,
      time: {
        monthNo: (1 + new Date().getMonth()).toString().padStart(2, '0'),
        yearNo: new Date().getFullYear().toString(),
        num: 1
      },
      MST: {
        'DCODE': '',
        'DNAME': '',
        'YEARNO': '',
        'MONTHNO': '',
        'NUM': '',
        'CREATEUSER': '',
        'CREATEDATE': '',
        'REMARK': ''
      },
      mstID: '',
      opOrder: [
        {
          index: 1,
          info: '工资单新增'
        }, {
          index: 2,
          info: '获取部门数据'
        },
        {
          index: 3,
          info: '获取员工数据'
        },
        {
          index: 4,
          info: '获取薪酬类别'
        },
        {
          index: 5,
          info: '导入工资明细'
        }
      ],
      copyMonth: [],
      salaryTypeDict: [],
      salaryDetailTypeDict: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setMonth(end.getMonth() + 1)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    params: function() {
      return this.time.yearNo + '-' + this.time.monthNo
    }
  },
  created() {
    console.log(this.time)
    this.getSalaryTypeList()
  },
  methods: {
    async test(e) {
      console.log(e)
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
    async getSalaryDetailType() {
      getGridList({ monthNo: this.params }).then(res => {
        this.salaryDetailTypeDict = res.data
        console.log('数据导入成功')
      })
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
    async getSalaryTypeList() {
      getSalaryTypeList().then(res => {
        this.salaryTypeDict = res.data
      })
    },
    updateDCODE(value) {
      var temp = this.salaryTypeDict.find(element => element.DNAME === value)
      this.MST.DCODE = temp.DCODE
    },
    async salaryUpload(e) {
      await Excelupload(22, e.file, this.salaryDetailTypeDict).then(params => {
        console.log(params)
        return salaryImport(params)
      }).then(res => {
        console.log('上传成功')
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
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
      this.MST.CREATEUSER = 'admin'
      this.MST.CREATEDATE = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.MST.YEARNO = this.time.yearNo
      this.MST.MONTHNO = this.time.monthNo
      this.MST.NUM = this.time.num
      var params = {
        mst: this.MST,
        slvList: []
      }
      if (this.timeTest()) {
        localAdd(params).then((res) => {
          console.log(res)
          this.activeName = '2'
          this.active = 1
          console.log('添加完成')
        }).catch(err => {
          console.log(err)
        })
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
    },
    showSalaryType() {
      this.$store.commit('universal/SET_MONTHNO', this.params)
      this.$router.push('/formula/index')
    },
    initial() {
      this.activeName = '1'
      this.active = 0
      this.time.yearNo = new Date().getFullYear().toString()
      this.time.monthNo = (1 + new Date().getMonth()).toString().padStart(2, '0')
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
.width220{
  width: 220px;
}
.marginTB50{
  margin-top:10px;
  margin-bottom :20px
}
</style>
