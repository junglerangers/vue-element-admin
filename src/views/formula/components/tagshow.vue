<template>
  <div class="tagshow">
    <!-- <div>公式结果展示:</div> -->
    {{ deResult }}
    <template v-for="item in content">
      <!-- eslint-disable-next-line vue/valid-v-for -->
      <el-tag v-if="isTag(item.type)" :type="getTagType(item.type)">{{ item.element }}</el-tag>
      <template v-else>{{ item.element }}</template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: function() {
        return []
      }
    },
    result: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      test: [
        'code标签一',
        '+',
        'code标签二'
      ]
    }
  },
  computed: {
    deResult: function() {
      if (this.result) {
        return this.result + '='
      } else {
        return this.result
      }
    }
  },
  methods: {
    isTag(type) {
      return type !== 'op'
    },
    getTagType(type) {
      switch (type) {
        case 'pureNums':return 'info'
        case 'element' :return 'success'
        case 'undefined': return 'danger'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tagshow{
    line-height: 30px;
  }
</style>
