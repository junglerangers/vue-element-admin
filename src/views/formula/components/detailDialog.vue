<template>
  <el-dialog
    v-loading="loading"
    title="条件公式"
    :visible.sync="localDialogVisible"
    :before-close="handleClose"
    width="1200px"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-form
      label-position="left"
      label-width="100px"
      :model="rawModel"
    >
      <el-form-item label="人员性质">
        <el-select v-model="naturalChoice" multiple placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间范围" :style="{'width':'400px'}">
        <el-col :span="11">
          <el-form-item prop="HOSTIMEBMONTH">
            <el-date-picker v-model="localRawModual.HOSTIMEBMONTH" type="date" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker v-model="localRawModual.HOSTIMEEMONTH" type="date" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="计算公式">
        <el-input v-model="test" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleDialogVisible">取 消</el-button>
      <el-button type="primary" @click="testMethod()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DetailDialog',
  props: {
    rawModel: { // 子公式模型
      type: Object,
      default: function() {
        return {
          'HOSTIMEBMONTH': null,
          'HOSTIMEEMONTH': null
        }
      }
    },
    naturalList: { // 人员性质字典
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    salryTypeDict: { // 薪酬类型字典
      type: Array,
      default: function() {
        return []
      },
      required: true
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    type: { // 调用的接口类型
      type: String,
      default: 'new'
    }
  },
  data: function() {
    return {
      loading: false,
      test: '',
      naturalChoice: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      testModel: this.rawModel
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
    localRawModual: {
      get: function() {
        return this.rawModel
      }
    }
  },
  created: function() {
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
    },
    testMethod() {
      var sign = /^[0-9]$/.test('2')
      console.log(sign)
    }
  }
}
</script>

<style style="scss" scoped>
.dynamic-salary{
  display: flex;
  flex-direction: row;
}
.column{
  display: flex;
  flex-direction: column;
}
.salary{
  margin-right: 20px;
}
.title{
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 20px 0;
}
.right{
  position: absolute;
  right: 20px;
}
.line{
  text-align: center;
}
</style>
