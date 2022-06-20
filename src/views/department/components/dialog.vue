<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="数据字典详细信息" :column="3" size="mini" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          科室编号
        </template>
        <el-input v-model="rawModel.DCODE" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          科室名称
        </template>
        <el-input v-model="rawModel.DEPT_NAME" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          生效日期
        </template>
        {{ rawModel.BEGINDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          失效日期
        </template>
        {{ rawModel.ENDDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          锁定标志
        </template>
        {{ rawModel.ISLOCK }}
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="userRequest">保 存</el-button>
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  model: {
    prop: 'currentModel',
    event: 'change'
  },
  props: {
    currentModel: {
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
    rawModel: function() {
      return this.currentModel
    }
  },
  methods: {
    userRequest: function() {
      // console.log('request')
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

<style lang="scss" scoped>
 .el-input{
   width:100px
 }
</style>
