<template>
  <div class="search-container">
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="科室编号">科室编号</el-dropdown-item>
            <el-dropdown-item command="科室名称">科室名称</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">搜索</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>

const mapDict = {
  '科室编号': 'DEPT_CODE',
  '科室名称': 'DEPT_NAME'
}

export default {
  data: function() {
    return {
      depList: [], // 科室列表
      typeList: [], // 人员类型列表
      searchtype: '科室名称',
      searchContent: '',
      /** 搜索模型 */
      searchModel: {
        'DEPT_CODE': '',
        'DEPT_NAME': '',
        'IS_STOP': '',
        'SPELL_CODE': '',
        'WBX_CODE': '',
        'SUPER_CODE': '',
        'monthNo': ''
      },
      visible: false
    }
  },
  computed: {
    monthNo: function() {
      return this.$store.getters.monthNo
    }
  },
  methods: {
    searchHandler() {
      this.searchModel.monthNo = this.monthNo
      this.searchModel[mapDict[this.searchtype]] = this.searchContent
      this.$emit('search', this.searchModel)
    },
    handleCommand(command) {
      this.searchtype = command
    }
  }
}
</script>

<style scoped>
.el-select .el-input{
  width: 180px;
}
.search-form{
  margin-top:20px;
}
.none{
  display: none;
}
.advancesearchshow-enter-active, .advancesearchshow-leave-active{
  transition: opacity .5s;
}
.advancesearchshow-enter,.advancesearchshow-leave-to{
  opacity: 0;
}
.search-form .el-form-item{
  width: 23%;
}
.timePicker{
  width: fit-content!important;
  margin-right: 30px!important;
}
.center{
  text-align: center;
}
</style>
