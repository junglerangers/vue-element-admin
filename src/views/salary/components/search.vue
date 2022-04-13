<template>
  <div class="search-container">
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="期数">期数</el-dropdown-item>
            <el-dropdown-item command="时间范围">时间范围</el-dropdown-item>
            <el-dropdown-item command="金额范围">金额范围</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot="append">
          <el-button type="primary" icon="el-icon-search">搜索</el-button>
          <el-button type="primary" :icon="advanceSearchIcon" title="高级搜索" @click="showAdvanceSearch" />
        </template>
      </el-input>
    </div>
    <transition name="advancesearchshow">
      <el-form v-if="visible" v-model="test" :inline="true" class="search-form">
        <el-form-item label="审批人">
          <el-input v-model="test" placeholder="审批人" />
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="test" placeholder="活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
    </transition>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      depList: [], // 科室列表
      typeList: [], // 人员类型列表
      searchtype: '期数',
      searchContent: '',
      /** 搜索模型 */
      search: {
        dep: '', // 科室
        type: '', // 人员类型
        workNumber: '', // 人员工号
        name: '' // 人员姓名
      },
      test: '',
      visible: false
    }
  },
  computed: {
    advanceSearchIcon: function() {
      if (this.visible === false) {
        return 'el-icon-more'
      } else {
        return 'el-icon-arrow-down'
      }
    }
  },
  methods: {
    searchHandler() {
      this.$emit('search', this.search)
    },
    handleCommand(command) {
      this.searchtype = command
    },
    showAdvanceSearch() {
      this.visible = !this.visible
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
</style>
