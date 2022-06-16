<template>
  <div>
    <el-form-item>
      <div class="inputModel">
        <el-input v-model="formList[0].value" class="input" placeholder="审批人" @blur="testmethod">
          <template slot="prepend">实际输入</template>
        </el-input>
      </div>
      <de-input v-model="test" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
  </div>
</template>

<script>
import deInput from './input.vue'

export default {
  name: 'FormItem',
  components: {
    deInput
  },
  props: {
    formList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      formInline: {
        name: '',
        region: ''
      },
      rules: {
        value: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      test: '123'
    }
  },
  computed: {
    localvalue: function() {
      console.log(this.formList)
      return this.formList
    }
  },
  created: function() {
    console.log(this.formList)
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    testmethod(event) {
      var value = event.target.value
      console.log(value)
    }
  }
}
</script>

<style lang='scss' scoped>
.tip{
    margin: 0px;
    color:#f56c6c;
    font-size: 12px;
    position: absolute;
    line-height: 1;
    padding-top: 4px;
    top:100%;
    left:0;
}
.input{
    width:200px
}
.inputModel{
    width:fit-content
}
.local_label{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}
</style>
