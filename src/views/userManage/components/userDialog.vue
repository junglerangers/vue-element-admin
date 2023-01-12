<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="人员详细信息" :column="4" size="mini" border>
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
        {{ rawUser.EMP_NAME }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
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
        {{ rawUser.KIND_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-notebook-1" />
          人员分类
        </template>
        {{ rawUser.EMP_CLASSNAME }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          院区名称
        </template>
        {{ rawUser.HOSAREANAME }}
      </el-descriptions-item>
      <el-descriptions-item span="1">
        <template slot="label">
          <i class="el-icon-office-building" />
          工资银行
        </template>
        {{ rawUser.GZYH }}
      </el-descriptions-item>
      <el-descriptions-item span="3">
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
      <el-descriptions-item span="3">
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
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-bank-card" />
          福利卡号
        </template>
        {{ rawUser.FLKH }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-time" />
          生效日期
        </template>
        {{ rawUser.BEGINDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-time" />
          失效日期
        </template>
        {{ rawUser.ENDDATE|timeFormatter }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-notebook-1" />
          人员性质2
        </template>
        <el-select v-model="rawUser.KIND_CODE2" placeholder="请选择" size="mini" style="width:90px" disabled>
          <el-option key="0" value="0" label="不区分" />
          <el-option key="1" value="1" label="儿童" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-tickets" />
          备注
        </template>
        <el-input v-model="test" :readonly="false" disabled />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button type="primary" @click="save">保 存</el-button> -->
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  model: {
    prop: 'currentUser',
    event: 'change'
  },
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
      test: ''
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
  methods: {
    async save() {
      console.log('this is save!')
    },
    toggleDialogVisible() {
      this.$emit('toggleVisible')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
