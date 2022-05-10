<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="人员详细信息" :column="4" size="mini" border>
      <el-descriptions-item v-for="item in currentUser" :key="item.key" :label="item.key">
        {{ item.value }}
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary">保 存</el-button>
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DetailDialog',
  props: {
    currentUser: {
      type: Array,
      default: function() {
        return []
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
    }
  },
  methods: {
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
