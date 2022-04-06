<template>
  <div class="tagshow">
    <div>公式结果展示:</div>
    <template v-for="item in content">
      <!-- eslint-disable-next-line vue/valid-v-for -->
      <el-tag v-if="isTag(item.type)" :type="item.type">{{ item.element }}</el-tag>
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
  },
  methods: {
    isTag(type) {
      return type !== 'op'
    }
  }
}
</script>

<style lang="scss">
  .tagshow{
    margin-top: 20px;
    line-height: 30px;
  }
</style>
