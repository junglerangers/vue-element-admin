<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="数据字典详细信息" :column="3" size="mini" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          父级组件
        </template>
        <el-cascader v-model="currentModel.SUPERCODE" :options="depOptions" filterable :props="props">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.options.length }}) </span>
          </template>
        </el-cascader>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          代码类别
        </template>
        <el-input :value="localSuperCode" :disabled="true" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          代码ID
        </template>
        <el-input v-model="currentModel.DCODE" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          代码名称
        </template>
        <el-input v-model="currentModel.DNAME" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          系统ID
        </template>
        <el-input v-model="currentModel.SYSCODE" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          创建用户
        </template>
        {{ currentModel.CREATEUSER }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          创建日期
        </template>
        {{ currentModel.CREATEDATE|timeFormatter }}
      </el-descriptions-item>
      <el-descriptions-item />
      <el-descriptions-item />
      <el-descriptions-item span="3">
        <template slot="label">
          <i class="el-icon-tickets" />
          备注
        </template>
        <el-input v-model="test" type="textarea" :readonly="false" />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="close">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { localUpdate, getTreeList, localAdd } from '@/api/codeDict'

export default {
  props: {
    rawModel: {
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
    type: {
      type: String,
      default: 'new'
    }
  },
  data: function() {
    return {
      test: '',
      // currentModel: this.rawModel,
      depOptions: [],
      props: {
        checkStrictly: true,
        children: 'options',
        leaf: 'id'
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
    },
    userName: function() {
      return this.$store.state.user.userInfo.name
    },
    currentModel: function() {
      return this.rawModel
    },
    localSuperCode: function() {
      var temp = this.currentModel.SUPERCODE
      if (temp instanceof String) {
        return temp
      }
      if (temp instanceof Array) {
        return temp[temp.length - 1]
      }
      return null
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    async save() {
      var params = Object.assign({}, this.currentModel)
      var localfun = null
      //  是调用新增方法还是调用修改方法
      if (this.type === 'edit') {
        localfun = localUpdate
      } else if (this.type === 'new') {
        params.CREATEUSER = this.userName
        localfun = localAdd
      }
      params.SUPERCODE = this.localSuperCode
      await localfun(params).then(res => {
        // console.log(res)
        if (this.type === 'new') {
          this.$message({
            message: '数据新增成功!',
            type: 'success'
          })
        } else if (this.type === 'edit') {
          this.$message({
            message: '数据修改成功!',
            type: 'success'
          })
        }
        // 返回讯息重新加载一下当前页面
        this.$emit('update')
      }).catch((ex) => {
        console.log(ex)
      }).finally(() => {
        this.toggleDialogVisible()
      })
    },
    close() {
      this.toggleDialogVisible()
    },
    async getTreeList() {
      var params = {
        'syscode': '0101'
      }
      getTreeList(params).then(res => {
        this.depOptions = res.data
      })
    },
    /**
     * 关闭当前model窗口
     */
    toggleDialogVisible() {
      this.$emit('toggleVisible')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getSupercode(val) {
      return
      // this.currentModel.SUPERCODE = val[val.length - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-input{
   width:100px
 }
</style>
