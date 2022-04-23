<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose">
    <el-descriptions class="margin-top" title="数据字典详细信息" :column="3" size="mini" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          父级组件
        </template>
        <el-cascader v-model="currentModel.SUPERCODE" :options="depOptions" filterable :props="props" @change="getSupercode">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.options.length }}) </span>
          </template></el-cascader>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          代码类别
        </template>
        <el-input v-model="currentModel.SUPERCODE" />
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          代码ID
        </template>
        <el-input v-model="currentModel.DCODE" />
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
        <el-input v-model="currentModel.SYSCODE" />
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
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          作废判别
        </template>
        <el-switch
          v-model="currentModel.ISDEL"
          active-text="正常"
          inactive-text="作废"
          active-value="0"
          inactive-value="1"
        />
      </el-descriptions-item>
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

import { localUpdate, getTreeList } from '@/api/codeDict'

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
    },
    type: {
      type: String,
      default: 'new'
    }
  },
  data: function() {
    return {
      test: '',
      rawModel: this.currentModel,
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
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    async save() {
      var params = {
        'DCODE': '15',
        'DNAME': 'test',
        'SUPERCODE': null,
        'ISDEL': '0',
        'SYSCODE': '0101',
        'REMARK': null,
        'CREATEUSER': '2016210'
      }
      console.log('saveRequest')
      await localUpdate(params).then(res => {
        console.log(res)
        this.toggleDialogVisible('update')
      }).catch(() => {
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
    toggleDialogVisible(val) {
      if (val !== 'update') {
        this.$emit('unchange')
      }
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
      this.currentModel.SUPERCODE = val[val.length - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-input{
   width:100px
 }
</style>
