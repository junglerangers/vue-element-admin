<template>
  <div :class="{flex:level===0}">
    <de-input
      v-for="item,index in formList"
      :key="item.TCODE"
      v-model="item.AMOUNT"
      :label="item.TNAME"
      :level="level"
      :has-child="!!item.ChilList"
      :readonly="item.readonly"
      @expand="toggleChiList(index)"
      @update="update"
    >
      <transition name="fade">
        <form-item
          v-if="!!item.ChilList"
          v-show="ChiListVisible[index]"
          :level="level+1"
          :form-list="item.ChilList"
          @update="update"
        />
      </transition>
    </de-input>
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
    },
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      ChiListVisible: Array(this.formList.length).fill(this.level === 0)
    }
  },
  methods: {
    toggleChiList(index) { // vue 在监听数组时,无法监听到数组内的值所发生的变化
      this.ChiListVisible[index] = !this.ChiListVisible[index]
      this.ChiListVisible = [...this.ChiListVisible]
    },
    update() {
      this.$emit('update')
    }
  }
}
</script>

<style lang='scss' scoped>
.flex{
  display: flex;
  justify-content: flex-start;
}
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
.el-icon{
  position:absolute;
  left: 50%;
  top:50%;
  margin-left: -5px;
  margin-top:-5px
}
.fade-enter-active,
.fade-leave-active {
  transition: all .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
  transform: translateY(-30px);
}
</style>
