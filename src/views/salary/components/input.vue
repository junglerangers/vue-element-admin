<template>
  <el-form-item class="kr-el-form-item-decorate">
    <div class="kr-inputModel-decorate" :style="{ 'margin-left': leftMargin }">
      <div v-if="hasChild" :class="{ 'kr-icon-box': true, 'kr-icon-box-expand': expandSign }" @click="expandItems">
        <i :class="{ 'el-icon-arrow-right': true }" />
      </div>
      <div v-else class="kr-icon-box-none">
        <i class="el-icon-arrow-right" />
      </div>
      <el-input
        v-model="localValue"
        :class="{'kr-input-error-border':errorSign}"
        :style="{'width':inputWidth}"
        @blur="numberValidate"
      >
        <template slot="prepend">
          <el-popover :disabled="!errorSign" placement="top-start" title="提示" width="200" trigger="hover">
            <p class="kr-input-wrong-tip">{{ errorTip }}</p>
            <span slot="reference">{{ label }}</span>
          </el-popover>
        </template>
      </el-input>
    </div>
    <slot />
  </el-form-item>
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
    },
    level: {
      default: 2,
      type: Number
    },
    hasChild: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      // hasChild: false, // 该节点是否有孩子 --> 由父级组件传入
      errorSign: false, // 该节点输入是否有错误
      expandSign: false, // 该节点是否处于展开状态 --> 展开会触发事件返回父级组件
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
    },
    leftMargin: function() {
      return 10 * this.level + 'px'
    },
    inputWidth: function() {
      return (220 - 10 * this.level) + 'px'
    }
  },
  methods: {
    numberValidate() {
      if (!this.localValue) {
        this.localValue = 0
        this.errorSign = false
      } else if (!/^[+-]?[0-9]*[\.]?[0-9]*$/.test(this.localValue)) {
        this.errorTip = '请输入合法数字'
        this.errorSign = true
      } else {
        this.errorTip = ''
        this.errorSign = false
      }
      console.log('blur')
      if (!this.errorSign) {
        console.log('success')
        this.$emit('update')
      }
    },
    expandItems() {
      this.expandSign = !this.expandSign
      console.log('expand!')
      this.$emit('expand')
    }
  }
}
</script>

<style lang="scss">

.kr-input-wrong-tip{
  //margin: 0px;
  color:#f56c6c;
  font-size: 12px;
  //position: absolute;
  //line-height: 1;
  padding-top: 4px;
  //top:100%;
  //left:0;
}
.kr-input-decorate{
    width:200px;
}
.kr-inputModel-decorate{
    width:fit-content
}
.kr-input-error-border{
    input{
      border-color: #f56c6c;
    }
}
.kr-icon-box{
  display: inline-block;
  position: relative;
  height: 100%!important;
  cursor: pointer;
  color: #666;
  font-size: 12px;
  transition: transform .5s ease-in-out;
  height: 20px;
}
.kr-icon-box-none {
  display: inline-block;
  position: relative;
  height: 100% !important;
  color: transparent;
  font-size: 12px;
  transition: transform .5s ease-in-out;
  height: 20px;
}
.kr-icon-box-expand{
  transform: rotate(90deg);
}
.kr-el-form-item-decorate{
  margin:0px 1px 0px 0px!important
}
</style>
