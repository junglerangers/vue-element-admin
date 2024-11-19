<template>
  <el-dialog
    v-loading="loading"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :visible.sync="localDialogVisible"
    :destroy-on-close="true"
    @open="dialogInitial"
  >
    <el-form ref="userForm" :model="rawUser" class="margin-top" :title="Title" size="mini" :rules="rules">
      <el-descriptions :column="3" border size="mini">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            人员工号
          </template>
          <el-form-item class="inline-user-form-item" prop="EMP_CODE">
            <el-input v-model="rawUser.EMP_CODE" size="mini" class="userinput" :disabled="DISABLELED.EMP_CODE_DISABLE" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            人员姓名
          </template>
          <el-form-item class="inline-user-form-item" prop="EMP_NAME">
            <el-input v-model="rawUser.EMP_NAME" size="mini" class="userinput" :disabled="DISABLELED.EMP_NAME_DISABLE" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-c-scale-to-original" />
            证件编号
          </template>
          <el-form-item class="user-form-item">
            <el-input v-model="rawUser.SFZ" size="mini" :disabled="true" :style="{width:'200px'}" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-notebook-1" />
            人员性质
          </template>
          <el-form-item class="inline-user-form-item" prop="KIND_NAME">
            <!-- {{ rawUser.KIND_NAME }} -->
            <el-select v-model="rawUser.KIND_NAME" placeholder="请选择" size="mini" class="userinput" :disabled="DISABLELED.KIND_NAME_DISABLE" @change="KindCodeChange">
              <el-option v-for="item in NatureList" :key="item.Code" :value="item.Code" :label="item.Label" />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-notebook-1" />
            实际岗位
          </template>
          <el-form-item class="inline-user-form-item" prop="EMP_CLASSNAME">
            <!-- {{ rawUser.EMP_CLASSNAME }} -->
            <el-select v-model="rawUser.EMP_CLASSNAME" placeholder="请选择" size="mini" class="userinput" :disabled="DISABLELED.EMP_CLASSNAME_DISABLE" @change="EmpClassChange">
              <el-option v-for="item in EmpClassList" :key="item.Code" :value="item.Code" :label="item.Label" />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            聘任资格
          </template>
          <el-form-item class="inline-user-form-item" prop="QUALIFICATION">
            <el-input v-model="rawUser.QUALIFICATION" size="mini" :style="{width:'200px'}" class="userinput" :disabled="DISABLELED.QUALIFICATION_DISABLE" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline" />
            科室名称
          </template>
          <el-form-item class="user-form-item" prop="DEPT_NAME">
            <el-input v-model="rawUser.DEPT_NAME" :disabled="DISABLELED.DEPT_NAME_DISABLE" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="1">
          <template slot="label">
            <i class="el-icon-notebook-1" />
            工作单位
          </template>
          <el-form-item class="inline-user-form-item" prop="KIND_NAME2">
            <el-select v-model="rawUser.KIND_NAME2" placeholder="请选择" size="mini" :style="{width:'200px'}" class="userinput" :disabled="DISABLELED.KIND_CODE2_NAME_DISABLE" @change="KindCode2Change">
              <el-option v-for="item in Nature2List" :key="item.Code" :value="item.Code" :label="item.Label" />
            </el-select>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="1">
          <template slot="label">
            <i class="el-icon-time" />
            生效日期
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.BEGINDATE|timeFormatter }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="1">
          <template slot="label">
            <i class="el-icon-time" />
            失效日期
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.ENDDATE|timeFormatter }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="1">
          <template slot="label">
            <i class="el-icon-notebook-1" />
            工作职位
          </template>
          <el-form-item class="inline-user-form-item" prop="POSITION">
            <el-input v-model="rawUser.POSITION" />
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            工资银行
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.GZYH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-bank-card" />
            工资卡号
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.GZKH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            奖金银行
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.JJYH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-bank-card" />
            奖金卡号
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.JJKH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building" />
            福利银行
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.FLYH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-bank-card" />
            福利卡号
          </template>
          <el-form-item class="inline-user-form-item">
            {{ rawUser.FLKH }}
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets" />
            备注
          </template>
          <el-form-item class="user-form-item">
            <el-input v-model="remark" type="textarea" :readonly="false" disabled />
          </el-form-item>
        </el-descriptions-item>
      </el-descriptions>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { UpdateEmployee } from '@/api/employee'
import { getCurrentTime } from '@/utils/time'
import { getNatureList, getEmpClassList, getNature2List } from '@/api/enum'
import { ManualAddEmployee } from '@/api/employee'

export default {
  name: 'UserDialog',
  props: {
    currentUser: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    monthNo: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      remark: '',
      Title: '',
      rawUser: {},
      loading: false,
      opType: 2, // 1为新增,2为修改
      NatureList: [],
      rules: {
        EMP_CODE: [{ required: true, message: '请输入人员编号', trigger: 'blur' }],
        EMP_NAME: [{ required: true, message: '请输入人员姓名', trigger: 'change' }],
        KIND_NAME: [{ required: true, message: '请选择人员性质', trigger: 'change' }],
        KIND_NAME2: [{ required: true, message: '请选择人员工作单位', trigger: 'change' }],
        DEPT_NAME: [{ required: true, message: '请输入人员科室', trigger: 'change' }],
        EMP_CLASSNAME: [{ required: true, message: '请选择实际岗位', trigger: 'change' }],
        QUALIFICATION: [{ required: true, message: '请输入聘任资格', trigger: 'change' }]
      },
      Nature2List: [],
      EmpClassList: [],
      DISABLELED: {
        EMP_CODE_DISABLE: true,
        EMP_NAME_DISABLE: true,
        KIND_NAME_DISABLE: true,
        EMP_CLASSNAME_DISABLE: true,
        QUALIFICATION_DISABLE: true,
        DEPT_NAME_DISABLE: true,
        KIND_CODE2_NAME_DISABLE: true
      }

    }
  },
  computed: {
    localDialogVisible: {
      get: function() {
        return this.dialogVisible
      },
      set: function(v) {
        this.toggleDialogVisible()
      }
    }
    // rawUser: function() {
    //   return this.currentUser
    // }
  },
  created() {
    // console.log('dialog created!')
    // console.log(this.$refs)
    // console.log(this.$refs.userForm)
    // console.log(this.$refs.userDialog)
    this.getDataList()
  },
  activated() {
    // console.log('dialog activated')
  },
  methods: {
    KindCodeChange(val) {
      this.rawUser.KIND_CODE = val
    },
    EmpClassChange(val) {
      this.rawUser.EMP_CLASS = val
    },
    KindCode2Change(val) {
      this.rawUser.KIND_CODE2 = val
    },
    async getDataList() {
      this.loading = true
      await getNatureList().then(res => {
        this.NatureList = res.data
      })
      await getNature2List().then(res => {
        this.Nature2List = res.data
      })
      await getEmpClassList().then(res => {
        this.EmpClassList = res.data
      })
      this.loading = false
    },
    async save() {
      if (this.opType === 2) {
        var UpdateUser = {
          autoid: this.rawUser.AUTOID,
          depT_NAME: this.rawUser.DEPT_NAME,
          emP_CODE: this.rawUser.EMP_CODE,
          emP_NAME: this.rawUser.EMP_NAME,
          kinD_CODE: this.rawUser.KIND_CODE,
          kinD_NAME: this.NatureList.find(element => Number(element.Code) === Number(this.rawUser.KIND_CODE)).Label, //
          kinD_CODE2: this.rawUser.KIND_CODE2,
          emP_CLASS: this.rawUser.EMP_CLASS,
          emP_CLASSNAME: this.EmpClassList.find(element => Number(element.Code) === Number(this.rawUser.EMP_CLASS)).Label, //
          qualification: this.rawUser.QUALIFICATION,
          position: this.rawUser.POSITION
        }
        // console.log(this.Nature2List)
        console.log(UpdateUser)
        await UpdateEmployee(UpdateUser).then(res => {
          this.$message({
            message: '员工信息更新成功!',
            type: 'success'
          })
          this.$emit('toggleVisible', true)
        })
      } else if (this.opType === 1) {
        this.ManualAddEmployeeSubmit()
      }
    },
    toggleDialogVisible() {
      this.$emit('toggleVisible', false)
    },
    async ManualAddEmployeeSubmit() {
      // console.log('ManualAdd')
      // console.log(this.rawUser)
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          var year = this.monthNo.slice(0, 4)
          var month = parseInt(this.monthNo.substring(5, 7)) - 1
          var beginDate = getCurrentTime(new Date(year, month, 2))
          var endDate = getCurrentTime(new Date(year, month + 1, 1, 23, 59, 59))
          this.rawUser.begindate = beginDate
          this.rawUser.enddate = endDate
          // console.log(this.ManualEmployeeModel)
          console.log(this.rawUser)
          await ManualAddEmployee(this.rawUser).then((res) => {
            this.$message({
              message: '员工新增成功!',
              type: 'success'
            })
            this.$emit('toggleVisible', true)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogInitial() {
      this.rawUser = Object.assign({}, this.currentUser)
      // this.$refs.userForm.resetFields()
      // console.log('dialogInitial open')
      // console.log(this.rawUser.EMP_NAME)
      // 1 为新增用户;2 为修改用户
      if (this.currentUser?.AUTOID == null) {
        this.opType = 1
      } else {
        this.opType = 2
      }
      switch (this.opType) {
        case 1:this.DISABLELED = {
          EMP_CODE_DISABLE: false,
          EMP_NAME_DISABLE: false,
          KIND_NAME_DISABLE: false,
          EMP_CLASSNAME_DISABLE: false,
          QUALIFICATION_DISABLE: false,
          DEPT_NAME_DISABLE: false,
          KIND_CODE2_NAME_DISABLE: false
        }
          this.Title = '人员新增'; break
        case 2:this.DISABLELED = {
          EMP_CODE_DISABLE: true,
          EMP_NAME_DISABLE: false,
          KIND_NAME_DISABLE: false,
          EMP_CLASSNAME_DISABLE: false,
          QUALIFICATION_DISABLE: false,
          DEPT_NAME_DISABLE: false,
          KIND_CODE2_NAME_DISABLE: false
        }
          this.Title = '人员详细信息'; break
        default:break
      }
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.userinput{
  width: 100px;
}
.user-form-item{
  margin-bottom: 10px;
}
.inline-user-form-item{
  margin-bottom: 0px;
}
</style>
