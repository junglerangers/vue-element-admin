<template>
  <el-dialog
    v-loading="loading"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :visible.sync="localDialogVisible"
  >
    <el-descriptions class="margin-top" title="人员详细信息" :column="3" size="mini" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员工号
        </template>
        {{ rawUser.EMP_CODE }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员姓名
        </template>
        <el-input v-model="rawUser.EMP_NAME" size="mini" class="userinput" />
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-c-scale-to-original" />
          证件编号
        </template>
        {{ rawUser.SFZ }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-notebook-1" />
          人员性质
        </template>
        <!-- {{ rawUser.KIND_NAME }} -->
        <el-select v-model="rawUser.KIND_NAME" placeholder="请选择" size="mini" class="userinput" @change="KindCodeChange">
          <el-option v-for="item in NatureList" :key="item.Code" :value="item.Code" :label="item.Label" />

        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-notebook-1" />
          实际岗位
        </template>
        <!-- {{ rawUser.EMP_CLASSNAME }} -->
        <el-select v-model="rawUser.EMP_CLASSNAME" placeholder="请选择" size="mini" class="userinput" @change="EmpClassChange">
          <el-option v-for="item in EmpClassList" :key="item.Code" :value="item.Code" :label="item.Label" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-user" />
          聘任资格
        </template>
        <el-input v-model="rawUser.QUALIFICATION" size="mini" class="userinput" />
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          科室名称
        </template>
        <el-input v-model="rawUser.DEPT_NAME" size="mini" />
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-notebook-1" />
          人员性质2
        </template>
        <el-select v-model="rawUser.KIND_CODE2" placeholder="请选择" size="mini" style="width:90px">
          <el-option key="0" value="0" label="不区分" />
          <el-option key="1" value="1" label="儿童" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-time" />
          生效日期
        </template>
        {{ rawUser.BEGINDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-time" />
          失效日期
        </template>
        {{ rawUser.ENDDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-office-building" />
          工资银行
        </template>
        {{ rawUser.GZYH }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-bank-card" />
          工资卡号
        </template>
        {{ rawUser.GZKH }}
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-office-building" />
          奖金银行
        </template>
        {{ rawUser.JJYH }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-bank-card" />
          奖金卡号
        </template>
        {{ rawUser.JJKH }}
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-office-building" />
          福利银行
        </template>
        {{ rawUser.FLYH }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-bank-card" />
          福利卡号
        </template>
        {{ rawUser.FLKH }}
      </el-descriptions-item>
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-tickets" />
          备注
        </template>
        <el-input v-model="remark" :readonly="false" disabled />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { UpdateEmployee } from '@/api/employee'
import { getNatureList, getEmpClassList } from '@/api/enum'

export default {
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
    }
  },
  data: function() {
    return {
      remark: '',
      loading: false,
      NatureList: [],
      EmpClassList: []
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
    },
    rawUser: function() {
      return this.currentUser
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    KindCodeChange(val) {
      this.rawUser.KIND_CODE = val
    },
    EmpClassChange(val) {
      this.rawUser.EMP_CLASS = val
    },
    async getDataList() {
      this.loading = true
      await getNatureList().then(res => {
        this.NatureList = res.data
      })
      await getEmpClassList().then(res => {
        this.EmpClassList = res.data
      })
      this.loading = false
    },
    async save() {
      var UpdateUser = {
        autoid: this.rawUser.AUTOID,
        depT_NAME: this.rawUser.DEPT_NAME,
        emP_CODE: this.rawUser.EMP_CODE,
        emP_NAME: this.rawUser.EMP_NAME,
        kinD_CODE: this.rawUser.KIND_CODE,
        kinD_NAME: this.NatureList.find(element => element.Code === Number(this.rawUser.KIND_CODE)).Label, //
        kinD_CODE2: this.rawUser.KIND_CODE2,
        emP_CLASS: this.rawUser.EMP_CLASS,
        emP_CLASSNAME: this.EmpClassList.find(element => element.Code === Number(this.rawUser.EMP_CLASS)).Label, //
        qualification: this.rawUser.QUALIFICATION
      }
      console.log(UpdateUser)
      await UpdateEmployee(UpdateUser).then(res => {
        this.$message({
          message: '员工信息更新成功!',
          type: 'success'
        })
        this.$emit('toggleVisible', true)
      })
    },
    toggleDialogVisible() {
      this.$emit('toggleVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.userinput{
  width: 100px;
}
</style>
