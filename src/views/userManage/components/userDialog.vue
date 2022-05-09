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
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员性别
        </template>
        {{ rawUser.SEX_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员性质
        </template>
        {{ rawUser.KIND_CODE_NAME }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          参加工作时间
        </template>
        {{ rawUser.WORKTIME|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          进单位时间
        </template>
        {{ rawUser.HOSTIME|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-user" />
          证件编号
        </template>
        {{ rawUser.ID_CARD }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          出生日期
        </template>
        {{ rawUser.BIRTH|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          年龄
        </template>
        {{ rawUser.AGE }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          手机号
        </template>
        {{ rawUser.C01RH }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          虚拟网
        </template>
        {{ rawUser.C01RJ }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          工资等级
        </template>
        {{ rawUser.C01RE_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          岗位等级
        </template>
        {{ rawUser.C01RV_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          岗位工资级别
        </template>
        {{ rawUser.C01RS_NAME }}
      </el-descriptions-item>
      <el-descriptions-item />

      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          银行卡号
        </template>
        {{ rawUser.BANK_NO }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          从事岗位
        </template>
        {{ rawUser.C01RX_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          实际岗位
        </template>
        {{ rawUser.C01RY_NAME }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员性质
        </template>
        {{ rawUser.KIND_NAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员分类
        </template>
        {{ rawUser.EMP_CLASSNAME }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          院区名称
        </template>
        {{ rawUser.HOSAREANAME }}
      </el-descriptions-item>
      <el-descriptions-item />

      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          生效日期
        </template>
        {{ rawUser.BEGINDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          失效日期
        </template>
        {{ rawUser.ENDDATE|timeFormatter }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员性质
        </template>
        <el-select v-model="rawUser.KIND_CODE2" placeholder="请选择" size="mini" style="width:90px">
          <el-option key="0" value="0" label="不区分" />
          <el-option key="1" value="1" label="儿童" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-tickets" />
          备注
        </template>
        <el-input v-model="test" :readonly="false" />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
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
    save: function() {
      console.log(this.currentUser)
      console.log(this.rawUser)
      console.log('request')
      // 如果请求失败,就将model复原
      this.$emit('update')
      this.toggleDialogVisible()
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
