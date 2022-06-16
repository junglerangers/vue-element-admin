<template>
  <div>
    <de-input
      v-for="item,index in formList"
      :key="item.TCODE"
      v-model="item.AMOUNT"
      :label="item.TCODE"
      :level="level"
      :has-child="!!item.Chilist"
      @expand="toggleChiList(index)"
      @update="update"
    >
      <transition name="fade">
        <form-item
          v-if="!!item.Chilist"
          v-show="ChiListVisible[index]"
          :level="level+1"
          :form-list="item.Chilist"
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
      ChiListVisible: Array(this.formList.length).fill(false)
    }
  },
  methods: {
    toggleChiList(index) { // vue 在监听数组时,无法监听到数组内的值所发生的变化
      this.ChiListVisible[index] = !this.ChiListVisible[index]
      this.ChiListVisible = [...this.ChiListVisible]
    },
    update() {
      console.log('get input update')
      this.$emit('update')
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
.el-icon{
  position:absolute;
  left: 50%;
  top:50%;
  margin-left: -5px;
  margin-top:-5px
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
  {
  opacity: 0;
}
</style>
