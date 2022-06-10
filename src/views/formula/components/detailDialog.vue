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
        <el-select v-model="test" multiple placeholder="请选择">
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
            <el-date-picker v-model="rawModel.HOSTIMEBMONTH" type="date" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker v-model="rawModel.HOSTIMEEMONTH" type="date" placeholder="选择时间" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="计算公式">
        <el-input v-model="test" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleDialogVisible">取 消</el-button>
      <el-button type="primary" @click="toggleDialogVisible">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'DetailDialog',
  props: {
    rawModel: {
      type: Object,
      default: function() {
        return {
          'HOSTIMEBMONTH': null,
          'HOSTIMEEMONTH': null
        }
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
      loading: false,
      test: [],
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
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        HOSTIMEBMONTH: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
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
    localRawModual: function() {
      console.log(this.rawModel)
      return this.rawModel
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
