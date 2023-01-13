<template>
  <div
    v-loading="loading"
    class="app-container margin50"
    element-loading-text="数据导入中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-button type="primary" plain class="resetButton" @click="initial">重置</el-button>
    <el-steps :active="active" finish-status="success">
      <el-step v-for="op in opOrder" :key="op.index" :title="op.info" />
    </el-steps>
    <el-collapse v-model="activeName" accordion :style="{'margin-top':'50px'}">
      <el-collapse-item :title="opOrder[0].index+'.'+opOrder[0].info" name="1">
        期数
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
        <span class="must">*</span>
        <el-descriptions title="" class="marginTB50" :column="2" :style="{'width':'875px'}">
          <el-descriptions-item label="薪资名称">
            <el-select v-model="MST.DNAME" placeholder="请选择" class="width220" :disabled="active !==0" @change="updateDCODE">
              <el-option
                v-for="item in salaryTypeDict"
                :key="item.DCODE"
                :label="item.DNAME"
                :value="item.DNAME"
              />
            </el-select>
            <span class="must">*</span>
          </el-descriptions-item>
          <el-descriptions-item label="薪资编码">
            <el-input v-model="MST.DCODE" class="width220" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="备注" span="2">
            <el-input v-model="MST.REMARK" type="textarea" :readonly="false" :style="{'width':'685px'}" :disabled="active !==0" />
          </el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==0" @click="setTime">下一步</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[1].index+'.'+opOrder[1].info" name="2">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==1" @click="getSalaryandBank">获取工资与银行卡信息</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[2].index+'.'+opOrder[2].info" name="3">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==2" @click="dialogVisibleEmployeeCopy=true">导入员工数据(从上月复制)</el-button>
        <el-upload
          action="blank"
          :show-file-list="false"
          accept="xlsx,xls"
          :http-request="employeeUpload"
          :style="{'display':'inline-block'}"
          :disabled="active!==2"
        >
          <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==2">从Excel中手工获取</el-button>
        </el-upload>
        <el-upload
          action="blank"
          :show-file-list="false"
          accept="xlsx,xls"
          :http-request="employeeAddUpload"
          :style="{'display':'inline-block'}"
          :disabled="active!==2"
        >
          <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==2">员工数据追加(Excel)</el-button>
        </el-upload>
        <el-divider content-position="center">
          请先获取数据(上述三种方式任选其一)
          <i class="el-icon-s-custom" />
          再进行数据追加操作,最后点击下一步
        </el-divider>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==2" @click="()=>active=3">下一步</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[3].index+'.'+opOrder[3].info" name="4">
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==3" @click="dialogVisible = true">薪酬类别复制</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==3" @click="showSalaryType">薪酬类别管理</el-button>
        <el-button type="primary" plain :style="{'margin-left':'50px'}" :disabled="active!==3" @click="getSalaryDetailType">下一步</el-button>
      </el-collapse-item>
      <el-collapse-item :title="opOrder[4].index+'.'+opOrder[4].info" name="5">
        <el-upload
          action="blank"
          :show-file-list="false"
          accept="xlsx,xls"
          :http-request="salaryUpload"
          :style="{'margin-left':'50px'}"
          :disabled="active!==4"
        >
          <el-button size="small" type="primary" plain :disabled="active!==4">工资明细Excel文件上传</el-button>
        </el-upload>
        <p>因为工资明细表文件过大,上传时可能发生卡顿现象,请耐心等待.</p>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      title="薪资复制选择框"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="block">
        <div>
          <el-date-picker
            v-model="startCopyMonth"
            type="month"
            placeholder="选择月"
            class="year-class"
          /><span class="must">*</span>
          至
          <el-date-picker
            v-model="params"
            type="month"
            placeholder="选择月"
            disabled
            class="month-class"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="salaryTypeCopy">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="人员信息复制选择框"
      :visible.sync="dialogVisibleEmployeeCopy"
      width="30%"
    >
      <div class="block">
        <div>
          <el-date-picker
            v-model="startCopyMonth"
            type="month"
            placeholder="选择月"
            class="year-class"
          /><span class="must">*</span>
          至
          <el-date-picker
            v-model="params"
            type="month"
            placeholder="选择月"
            disabled
            class="month-class"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleEmployeeCopy = false">取 消</el-button>
        <el-button type="primary" @click="employeeInfoCopy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

// import { isExist as isDepartmentExist } from '@/api/department'
import { localImport as userImport, isExist as isEmployeeExist, copyEmployee } from '@/api/employee'
import { getSalaryTypeList, getGridList } from '@/api/salaryType'
import { localCopy, isExist as salaryTypeIsExist } from '@/api/salaryType'
import { localAdd, localImport as salaryImport, UpdateMst, isExist as salaryDetailExist } from '@/api/salary'
import { upload as Excelupload } from '@/utils/excel'
import { mapActions } from 'vuex'
import { getEmployeeByExcel as employeeImport, AddEmployeeByExcel as employeeAdd, SalaryImport } from '@/api/import'
import { getCurrentTime } from '@/utils/time'

export default {
  name: 'SalaryAdd',
  components: {
  },
  data() {
    return {
      /**
       * 是否展示数据加载标志
       */
      loading: false,
      /**
       * 薪资复制时间选择框界面是否展示
       */
      dialogVisible: false,
      /**
       * 人员复制时间选择框界面是否展示
       */
      dialogVisibleEmployeeCopy: false,
      /**
       * 控制进度条进度位置
       */
      active: 0,
      /**
       * 工资单的年份,月份与期数
       */
      time: {
        beforeMonthNo: (new Date().getMonth()).toString().padStart(2, '0'),
        monthNo: (1 + new Date().getMonth()).toString().padStart(2, '0'),
        yearNo: new Date().getFullYear().toString(),
        num: 1
      },
      /**
       * 工资单主表信息
       */
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
      /**
       * 代表当前表单的ID,是其它一切操作的前提
       */
      mstID: '',
      /**
       * 步骤条信息
       */
      opOrder: [
        {
          index: 1,
          info: '工资单新增'
        }, {
          index: 2,
          info: '获取工资与银行卡信息'
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
      /**
       * 复制月份时选择的月份
       */
      startCopyMonth: '',
      /**
       * 薪酬大类字典
       */
      salaryTypeDict: [],
      /**
       * 薪酬细节小类字典
       */
      salaryDetailTypeDict: [],
      /**
       * 员工表单属性字典
       */
      EmployeeTypeDict: [
        { TNAME: '人员编码', TCODE: 'EMP_CODE' },
        { TNAME: '姓名', TCODE: 'EMP_NAME' },
        { TNAME: '人员性质', TCODE: 'KIND_NAME' },
        { TNAME: '人员性质2', TCODE: 'KIND_CODE2' },
        { TNAME: '人员分类', TCODE: 'EMP_CLASSNAME' }
      ]
    }
  },
  computed: {
    /**
     * 返回年-月参数
     */
    params: function() {
      return this.time.yearNo + '-' + this.time.monthNo
    },
    /**
     * 返回登录用户名
     */
    userName: function() {
      return this.$store.state.user.userInfo.name
    },
    activeName: {
      get() {
        return (this.active + 1).toString()
      },
      set(newValue) {

      }
    }
  },
  created() {
    this.getSalaryTypeList()
    this.startCopyMonth = this.time.yearNo + '-' + this.time.beforeMonthNo
  },
  methods: {
    /**
     * 将事件管理函数映射进来
     */
    ...mapActions({
      addEvent: 'app/addEvent',
      changeEventState: 'app/changeEventState'
    }),
    /**
     * 指定特定的函数进行检测,以及是否覆盖重传的确认
     */
    async beforeRmoeteTest(fun, params) {
      var temp = params || this.params
      var sign1 = await fun(temp)
      var sign2 = true
      if (sign1) {
        sign2 = await this.confirm()
      }
      if (sign1 && !sign2) {
        return false
      }
      return true
    },
    /**
     * 获取部门列表
     */
    async getSalaryandBank() {
      if (!this.timeTest()) {
        return false
      }
      // var sign = await this.beforeRmoeteTest(isDepartmentExist)
      this.loading = true
      SalaryImport({ monthNo: this.params }).then(res => {
        this.$message({
          message: '工资与银行卡信息导入成功',
          type: 'success'
        })
        this.active = 2
        this.loading = false
      })
    },
    /**
     * 从hrp端获取员工数据
     */
    async getUserList() {
      if (!this.timeTest()) {
        return
      }
      var sign = await this.beforeRmoeteTest(isEmployeeExist)
      if (!sign) {
        // 如果已经存在已经有的数据,提示用户是重新导入数据,还是使用现有的数据
      } else {
        this.loading = true
        userImport({ monthNo: this.params }).then(res => {
          this.$message({
            message: '员工信息导入成功',
            type: 'success'
          })
          this.loading = false
        })
      }
    },
    /**
     * 获取薪酬小类字典
     */
    async getSalaryDetailType() {
      this.loading = true
      getGridList({ monthNo: this.params }).then(res => {
        this.salaryDetailTypeDict = res.data
        this.loading = false
        this.active = 4
      })
    },
    /**
     * 重传确认弹窗
     */
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
    /**
     * 获取薪酬基本类型(无需参数,指代工资,奖励,福利等),在窗口创建时获取
     */
    async getSalaryTypeList() {
      getSalaryTypeList().then(res => {
        this.salaryTypeDict = res.data
      })
    },
    /**
     * 找到相应薪酬名称的代码
     */
    updateDCODE(value) {
      var temp = this.salaryTypeDict.find(element => element.DNAME === value)
      this.MST.DCODE = temp.DCODE
    },
    /**
     * 人员信息通过excel上传
     */
    async employeeUpload(e) {
      if (!this.timeTest()) {
        return
      }
      if (!this.mstID) {
        this.$message({
          type: 'warning',
          message: '请按顺序完成之前的步骤后,再继续操作'
        })
        return
      }
      var sign = await this.beforeRmoeteTest(isEmployeeExist)
      if (!sign) {
        return
      } else {
        var task = {
          taskID: Math.floor(Math.random() * 100),
          taskName: this.params + '人员信息Excel导入',
          startTime: getCurrentTime(),
          endTime: '',
          taskState: '运行中',
          info: ''
        }
        this.addEvent(task)
        this.loading = true
        await Excelupload(this.mstID, e.file, this.EmployeeTypeDict).then(async params => {
          params.monthNo = this.params
          await employeeImport(params)
        }).then(res => {
          task.taskState = '完成'
          task.endTime = getCurrentTime()
          this.$message({
            message: this.params + '员工信息导入成功!',
            type: 'success'
          })
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
          this.loading = false
        })
      }
    },
    /**
     * 人员信息通过excel补充上传
     */
    async employeeAddUpload(e) {
      if (!this.timeTest()) {
        return
      }
      if (!this.mstID) {
        this.$message({
          type: 'warning',
          message: '请按顺序完成之前的步骤后,再继续操作'
        })
        return
      }
      // var sign = await this.beforeRmoeteTest(isEmployeeExist)
      var task = {
        taskID: Math.floor(Math.random() * 100),
        taskName: this.params + '人员信息Excel追加导入',
        startTime: getCurrentTime(),
        endTime: '',
        taskState: '运行中',
        info: ''
      }
      this.addEvent(task)
      this.loading = true
      await Excelupload(this.mstID, e.file, this.EmployeeTypeDict).then(async params => {
        params.monthNo = this.params
        await employeeAdd(params)
      }).then(res => {
        task.taskState = '完成'
        task.endTime = getCurrentTime()
        this.$message({
          message: this.params + '员工信息追加导入成功!',
          type: 'success'
        })
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
        this.loading = false
      })
    },
    /**
     * 薪酬明细通过excel上传
     */
    async salaryUpload(e) {
      if (!this.timeTest()) {
        return
      }
      if (!this.mstID) {
        this.$message({
          type: 'warning',
          message: '请按顺序完成之前的步骤后,再继续操作'
        })
        return
      }
      var sign = await this.beforeRmoeteTest(salaryDetailExist, this.mstID)
      if (!sign) {
        // console.log('test')
        return
      } else {
        var task = {
          taskID: Math.floor(Math.random() * 100),
          taskName: this.params + '薪资明细上传',
          startTime: getCurrentTime(),
          endTime: '',
          taskState: '运行中',
          info: ''
        }
        this.addEvent(task)
        await Excelupload(this.mstID, e.file, this.salaryDetailTypeDict).then(async params => {
          await salaryImport(params)
        }).then(res => {
          task.taskState = '完成'
          task.endTime = getCurrentTime()
          this.$message({
            message: this.params + '薪资明细上传成功!',
            type: 'success'
          })
          this.active = 5
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
      }
    },
    /**
     * 先检查是否已经选择了相应的时间
     */
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
    /**
     * 工资单新增操作
     */
    setTime() {
      if (!this.timeTest()) {
        return false
      }
      this.MST.CREATEUSER = this.userName
      this.MST.CREATEDATE = new Date().format('yyyy-MM-dd hh:mm:ss')
      this.MST.YEARNO = this.time.yearNo
      this.MST.MONTHNO = this.time.monthNo
      this.MST.NUM = this.time.num
      var params = {
        mst: this.MST,
        slvList: []
      }
      localAdd(params).then(async(res) => {
        if (res.status === 'W09') {
          this.mstID = res.data.autoid
          await this.$confirm('已经存在相应月份的工资单,继续操作会覆盖原有数据,是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            var params = Object.assign(this.MST)
            params.autoid = this.mstID
            await UpdateMst(params)
          }).then(() => {
            this.active = 1
            this.$message({
              message: '工资单更新成功!',
              type: 'success'
            })
          }).catch(() => {
          })
        } else {
          this.mstID = res.data.autoid
          this.active = 1
          this.$message({
            message: '工资单创建成功!',
            type: 'success'
          })
        }
      }).catch(res => {
        // console.log(res)
      })
    },
    /**
     * 薪酬类型复制,从指定月份复制到当前月份
     */
    async salaryTypeCopy() {
      if (!this.timeTest()) {
        return
      }
      var sign = await this.beforeRmoeteTest(salaryTypeIsExist)
      if (!sign) {
        this.dialogVisible = false
      } else {
        var start = this.startCopyMonth
        start = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart('2', '0')
        var params = {
          'monthNo': this.params,
          'copyFromMonthNo': start
        }
        localCopy(params).then(res => {
          this.$message({
            message: '薪资复制成功!',
            type: 'success'
          })
          this.dialogVisible = false
        })
          .finally(() => {
            this.dialogVisible = false
          })
      }
    },
    /**
     * 员工信息复制,从指定月份复制到当前月份
     */
    async employeeInfoCopy() {
      if (!this.timeTest()) {
        return
      }
      var sign = await this.beforeRmoeteTest(isEmployeeExist)
      if (!sign) {
        this.dialogVisibleEmployeeCopy = false
      } else {
        var start = this.startCopyMonth
        start = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart('2', '0')
        var params = {
          'monthNo': this.params,
          'copyFromMonthNo': start
        }
        copyEmployee(params).then(res => {
          this.$message({
            message: '员工信息复制成功!',
            type: 'success'
          })
          this.dialogVisibleEmployeeCopy = false
        })
          .finally(() => {
            this.dialogVisibleEmployeeCopy = false
          })
      }
    },
    /**
     * 页面跳转,跳转至薪酬类型管理页面
     */
    showSalaryType() {
      this.$store.commit('universal/SET_MONTHNO', this.params)
      this.$router.push('/formula/index')
    },
    /**
     * 初始化操作,用于重新开始按钮
     */
    initial() {
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
  background-color: rgb(0, 128, 0);
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
.year-class{
  width:180px;
  display: inline-block;
}
.month-class{
  width:180px;
  display: inline-block;
}
.resetButton{
  margin-bottom: 50px;
  position: absolute;
  top: 80px;
  left: 0px;
}
.must{
  color: red;
}
</style>
