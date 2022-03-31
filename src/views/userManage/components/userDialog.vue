<template>
  <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="人员详细信息" :column="4" size="small" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员工号
        </template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员姓名
        </template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员性别
        </template>
        kooriookami
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          人员性质
        </template>
        kooriookami
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          参加工作时间
        </template>
        2022-01-01
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          进单位时间
        </template>
        2022-01-01
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-user" />
          证件编号
        </template>
        330327000000000000
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          出生日期
        </template>
        2022-01-01
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          年龄
        </template>
        1
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          手机号
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          虚拟网
        </template>
        18100000000
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          工资等级
        </template>
        1
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          岗位等级
        </template>
        1
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          岗位工资级别
        </template>
        1
      </el-descriptions-item>
      <el-descriptions-item />

      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          银行卡号
        </template>
        1
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          从事岗位
        </template>
        信息
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          实际岗位
        </template>
        信息
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员性质
        </template>
        信息
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员分类
        </template>
        信息
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          院区名称
        </template>
        信息
      </el-descriptions-item>
      <el-descriptions-item />

      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          生效日期
        </template>
        信息
      </el-descriptions-item>
      <el-descriptions-item span="2">
        <template slot="label">
          <i class="el-icon-location-outline" />
          失效日期
        </template>
        信息
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          人员性质
        </template>
        <el-select v-model="test" placeholder="请选择" size="mini">
          <el-option key="1" value="1" label="不区分" />
          <el-option key="2" value="2" label="儿童" />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-tickets" />
          备注
        </template>
        <el-input />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleDialogVisible">取 消</el-button>
      <el-button type="primary" @click="userRequest">确 定</el-button>
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
      required: true
    }
  },
  methods: {
    userRequest: function() {
      console.log('request')
      this.toggleDialogVisible()
      this.$emit('change')
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
