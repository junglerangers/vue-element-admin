<template>
  <div>
    <div class="search_top_margin">
      <el-input v-model="searchContent" placeholder="请输入内容" @keyup.enter.native="searchHandler">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span>
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(value,key) in mapDict" :key="key" :command="key">{{ key }}</el-dropdown-item>
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
import { searchTypeDict } from '../dict/searchTypeDict'

export default {
  data: function() {
    return {
      depList: [], // 科室列表
      typeList: [], // 人员类型列表
      searchtype: Object.keys(searchTypeDict)[0],
      searchContent: '',
      /** 搜索模型 */
      searchModel: {
        enum: '',
        ename: ''
      },
      test: '',
      visible: false,
      mapDict: searchTypeDict
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

</style>
