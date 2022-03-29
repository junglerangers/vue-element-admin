<template>
  <div class="search-container">
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="工号">工号</el-dropdown-item>
            <el-dropdown-item command="科室">科室</el-dropdown-item>
            <el-dropdown-item command="姓名">姓名</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button slot="append" icon="el-icon-search">搜索</el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      depList: [], // 科室列表
      typeList: [], // 人员类型列表
      searchtype: '工号',
      searchContent: '',
      /** 搜索模型 */
      search: {
        dep: '', // 科室
        type: '', // 人员类型
        workNumber: '', // 人员工号
        name: '' // 人员姓名
      }
    }
  },
  methods: {
    searchHandler() {
      this.$emit('search', this.search)
    },
    handleCommand(command) {
      this.searchtype = command
    }
  }
}
</script>

<style>
.el-select .el-input{
  width: 180px;
}
</style>
