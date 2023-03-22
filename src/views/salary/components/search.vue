<template>
  <div>
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" :disabled="advanceSearchSign" placeholder="请输入内容" @keyup.enter.native="searchHandler">
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
          <el-button type="primary" :icon="advanceSearchIcon" title="高级搜索" @click="showAdvanceSearch" />
        </template>
      </el-input>
    </div>
    <transition name="advancesearchshow">
      <el-form v-if="advanceSearchSign" :inline="true" class="search-form">
        <el-form-item label="人员编号">
          <el-input v-model="searchModel.enum" placeholder="人员编号" class="sub-advance-input" />
        </el-form-item>
        <el-form-item label="人员姓名">
          <el-input v-model="searchModel.ename" placeholder="人员姓名" class="sub-advance-input" />
        </el-form-item>
        <el-form-item label="科室名称">
          <el-select v-model="searchModel.DEPT_NAME" placeholder="科室名称" clearable filterable class="sub-advance-input">
            <el-option v-for="item in depList" :key="item.AUTOID" :label="item.DEPT_NAME" :value="item.DEPT_NAME" />
          </el-select>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="searchModel.SEX_NAME" placeholder="性别" class="sub-advance-input" clearable>
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员性质">
          <el-select v-model="searchModel.KIND_CODE" placeholder="人员性质" clearable filterable class="sub-advance-input">
            <el-option v-for="item in natureList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员分类">
          <el-select v-model="searchModel.EMP_CLASS" placeholder="人员分类" clearable filterable class="sub-advance-input">
            <el-option v-for="item in typeList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="院区名称">
          <el-select v-model="searchModel.HOSAREA" placeholder="院区名称" class="sub-advance-input">
            <el-option v-for="item in hosAreaList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-button class="primary" @click="searchEmpty">清空搜索</el-button>
      </el-form>
    </transition>
  </div>
</template>

<script>
import { searchTypeDict } from '../dict/searchTypeDict'
import { getGridList } from '@/api/department'
import { getNatureList, getHosAreaList, getEmpClassList } from '@/api/enum'

const defaultSearchModel = {
  DEPT_NAME: '', // 科室名称
  EMP_CODE: '', // 人员编号
  EMP_NAME: '', // 人员姓名
  SEX_NAME: '', // 人员性别
  KIND_CODE: '', // 人员性质
  EMP_CLASS: '', // 人员分类
  HOSAREA: '' // 院区名称
}

export default {
  data: function() {
    return {
      depList: [], // 科室列表
      typeList: [], // 人员类型列表
      natureList: [], // 人员性质表
      hosAreaList: [], // 院区表
      searchtype: Object.keys(searchTypeDict)[0],
      searchContent: '',
      /** 搜索模型 */
      searchModel: {
        enum: '',
        ename: ''
      },
      test: '',
      advanceSearchSign: true,
      mapDict: searchTypeDict
    }
  },
  computed: {
    advanceSearchIcon: function() {
      if (this.advanceSearchSign === false) {
        return 'el-icon-more'
      } else {
        return 'el-icon-arrow-down'
      }
    },
    monthNo: function() {
      return this.$store.getters.monthNo
    }
  },
  created: function() {
    getNatureList().then(res => {
      this.natureList = res.data
    })
    getEmpClassList().then(res => {
      this.typeList = res.data
    })
    getHosAreaList().then(res => {
      this.hosAreaList = res.data
    })
    var params = {
      monthNo: this.monthNo
    }
    getGridList(params).then(res => {
      this.depList = res.data
    })
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
      this.advanceSearchSign = !this.advanceSearchSign
    },
    emptySearch() {
      this.searchContent = ''
      this.searchModel = {
        enum: '',
        ename: ''
      }
    },
    searchEmpty() {
      this.searchModel = Object.assign({}, defaultSearchModel)
    }
  }
}
</script>

<style scoped>
.search-form{
  margin-top:20px;
}
.advancesearchshow-enter-active, .advancesearchshow-leave-active{
  transition: opacity .5s;
}
.advancesearchshow-enter,.advancesearchshow-leave-to{
  opacity: 0;
}
.sub-advance-input{
  width: 200px;
}
</style>
