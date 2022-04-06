<template>
  <div
    class="el-input-tag input-tag-wrapper"
    :class="[size ? 'el-input-tag--' + size : '']"
    @click="focusTagInput"
  >
    <el-tag
      v-for="(tag, idx) in innerTags"
      :key="idx"
      v-bind="$attrs"
      :size="size"
      :closable="!readOnly"
      :disable-transitions="true"
      @close="remove(idx)"
    >
      {{ tag }}
    </el-tag>
    <input
      v-if="!readOnly"
      class="tag-input"
      :value="newTag"
      @input="inputTag"
      @keydown.delete.stop="removeLastTag"
      @keydown="addNew"
      @blur="addNew"
    >
  </div>
</template>

<script>
export default {
  name: 'TagsInput',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    addTagOnKeys: {
      type: Array,
      default: () => [13, 188, 9]
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      newTag: '',
      innerTags: [...this.value]
    }
  },
  watch: {
    value() {
      this.innerTags = [...this.value]
    }
  },
  methods: {
    /**
    * 聚焦到当前输入框上
    */
    focusTagInput() {
      if (this.readOnly || !this.$el.querySelector('.tag-input')) {
        return
      } else {
        this.$el.querySelector('.tag-input').focus()
      }
    },
    /**
     * 同步获取输入框的输入,赋予到tag上
     */
    inputTag(ev) {
      this.newTag = ev.target.value
    },
    addNew(e) {
      if (e && (!this.addTagOnKeys.includes(e.keyCode)) && (e.type !== 'blur')) {
        return
      }
      if (e) {
        e.stopPropagation()
        e.preventDefault()
      }
      let addSuccess = false
      if (this.newTag.includes(',')) {
        this.newTag.split(',').forEach(item => {
          if (this.addTag(item.trim())) {
            addSuccess = true
          }
        })
      } else {
        if (this.addTag(this.newTag.trim())) {
          addSuccess = true
        }
      }
      if (addSuccess) {
        this.tagChange()
        this.newTag = ''
      }
    },
    /**
     * 如果当前tags数组中没有包括相同的tag,就增加进来
     */
    addTag(tag) {
      tag = tag.trim()
      if (tag && !this.innerTags.includes(tag)) {
        this.innerTags.push(tag)
        return true
      }
      return false
    },
    /**
     * 删除指定索引的tag
     */
    remove(index) {
      this.innerTags.splice(index, 1)
      this.tagChange()
    },
    /**
     * 这里做了一个区分,是删除tag,还是删除input中原本的文字
     */
    removeLastTag() {
      if (this.newTag) {
        return
      }
      this.innerTags.pop()
      this.tagChange()
    },
    tagChange() {
      this.$emit('input', this.innerTags)
    }
  }
}
</script>

<style scoped>
  .el-form-item.is-error .el-input-tag {
      border-color: #f56c6c;
  }
  .input-tag-wrapper {
    position: relative;
    font-size: 14px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    outline: none;
    padding: 0 10px 0 5px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
  .el-tag {
    margin-right: 4px;
  }

  .tag-input {
    background: transparent;
    border: 0;
    font-size: inherit;
    outline: none;
    padding-left: 0;
    width: 100px;
  }
  .el-input-tag {
    min-height: 42px;
  }
  .el-input-tag--mini {
    min-height: 28px;
    line-height: 28px;
    font-size: 12px;
  }

  .el-input-tag--small {
    min-height: 32px;
    line-height: 32px;
  }

  .el-input-tag--medium {
    min-height: 36px;
    line-height: 36px;
  }

</style>
