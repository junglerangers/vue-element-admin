<template>
  <div class="search-container">
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select" @keyup.enter.native="searchHandler">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="姓名">姓名</el-dropdown-item>
            <el-dropdown-item command="工号">工号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">搜索(Enter)</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="initialSearchHandler">重置</el-button>
        </template>
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
      searchModel: {
        enum: '',
        ename: ''
      },
      test: '',
      visible: false,
      mapDict: {
        '姓名': 'ename',
        '工号': 'enum'
      }
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
      this.searchModel[this.mapDict[this.searchtype]] = this.searchContent
      this.$emit('search', this.searchModel)
    },
    initialSearchHandler() {
      this.emptySearch()
      this.$emit('search', this.searchModel)
    },
    handleCommand(command) {
      this.emptySearch()
      this.searchtype = command
    },
    showAdvanceSearch() {
      this.visible = !this.visible
    },
    emptySearch() {
      this.searchContent = ''
      this.searchModel = {
        enum: '',
        ename: ''
      }
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
