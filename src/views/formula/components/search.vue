<template>
  <div class="search-container">
    <div style="margin-top: 15px;">
      <el-input v-model="localSearchString" placeholder="请输入内容" class="input-with-select" @keyup.enter.native="searchHandler">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="薪资编码">薪资编码</el-dropdown-item>
            <el-dropdown-item command="类别编码">类别编码</el-dropdown-item>
            <el-dropdown-item command="类别名称">类别名称</el-dropdown-item>
            <el-dropdown-item command="备注信息">备注信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template slot="append">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">搜索(Enter)</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script>

const mapDict = {
  '薪资编码': 'dcode',
  '类别编码': 'tcode',
  '类别名称': 'tname',
  '父级代码': 'supercode',
  '系统代码': 'syscode',
  '备注信息': 'remark'
}

export default {
  model: {
    prop: 'searchString',
    event: 'change'
  },
  props: {
    searchString: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      searchtype: '类别编码',
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
    },
    localSearchString: {
      get: function() {
        return this.searchString
      },
      set: function(v) {
        this.$emit('change', v)
      }
    }
  },
  methods: {
    searchHandler() {
      const st = mapDict[this.searchtype]
      var searchModel = { [st]: this.searchString }
      this.$emit('search', searchModel)
    },
    handleCommand(command) {
      // 通过一个字典进行映射吧
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
.timePicker{
  width: fit-content!important;
  margin-right: 30px!important;
}
.center{
  text-align: center;
}
</style>
