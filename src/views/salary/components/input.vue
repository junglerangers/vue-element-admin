<template>
  <div class="inputModel">
    <el-input v-model="localValue" :class="{'error-border':errorSign}" class="input" @blur="numberValidate">
      <template slot="prepend">{{ label }}</template>
    </el-input>
    <p v-if="errorSign" class="tip">{{ errorTip }}</p>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'inputValue',
    event: 'change'
  },
  props: {
    inputValue: {
      default: '0',
      type: String
    },
    label: {
      default: '测试',
      type: String
    }
  },
  data() {
    return {
      errorSign: false,
      errorTip: '请输入合法内容'
    }
  },
  computed: {
    localValue: {
      get: function() {
        return this.inputValue
      },
      set: function(v) {
        this.$emit('change', v)
      }
    }
  },
  methods: {
    numberValidate() {
      if (this.localValue) {
        this.localValue = 0
      } else if (!/[+-]?[0-9]*[\.]?[0-9]*/.test(this.localValue)) {
        this.errorTip = '请输入合法数字'
        this.errorSign = true
      } else {
        this.errorTip = ''
        this.errorSign = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
.error-border{
    border-color: #f56c6c;
}
</style>
