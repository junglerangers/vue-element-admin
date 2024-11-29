<template>
  <div>
    <div style="margin-top: 15px;">
      <el-input v-model="searchContent" placeholder="请输入内容" class="input-with-select" :disabled="advanceSearchSign" @keyup.enter.native="searchHandler">
        <el-dropdown slot="prepend" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ searchtype }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="人员编号">人员编号</el-dropdown-item>
            <el-dropdown-item command="人员姓名">人员姓名</el-dropdown-item>
            <el-dropdown-item command="科室名称">科室名称</el-dropdown-item>
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
          <el-input v-model="searchModel.EMP_CODE" placeholder="人员编号" class="sub-advance-input" />
        </el-form-item>
        <el-form-item label="人员姓名">
          <el-input v-model="searchModel.EMP_NAME" placeholder="人员姓名" class="sub-advance-input" />
        </el-form-item>
        <el-form-item label="科室名称">
          <el-input v-model="searchModel.DEPT_NAME" />
        </el-form-item>
        <el-form-item label="发放状态">
          <el-select v-model="searchModel.STATUS" placeholder="发放状态" class="sub-advance-input" clearable>
            <el-option label="停发" value="1" />
            <el-option label="正常" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员性质">
          <el-select v-model="searchModel.KIND_CODE" placeholder="人员性质" class="sub-advance-input" clearable filterable>
            <el-option v-for="item in natureList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员分类">
          <el-select v-model="searchModel.EMP_CLASS" placeholder="人员分类" class="sub-advance-input" clearable filterable>
            <el-option v-for="item in typeList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="院区名称">
          <el-select v-model="searchModel.HOSAREA" placeholder="院区名称" class="sub-advance-input">
            <el-option v-for="item in hosAreaList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="停薪周期">
          <el-select v-model="txzq" placeholder="停薪周期" class="sub-advance-input" clearable filterable>
            <el-option v-for="item in txzqList" :key="item.Code" :label="item.Label" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="人员属库">
          <el-select v-model="searchModel.ryk" :style="{'width':'250px'}" placeholder="人员库" class="sub-advance-input" multiple clearable filterable>
            <el-option v-for="item in rykList" :key="item.Name" :label="item.Label" :value="item.Name" />
          </el-select>
        </el-form-item>
        <el-button class="primary" @click="searchEmpty">清空搜索</el-button>
      </el-form>
    </transition>
  </div>
</template>

<script>
import { getGridList } from '@/api/department'
import { getNatureList, getHosAreaList, getEmpClassList, getRYKList } from '@/api/enum'

const mapDict = {
  '人员编号': 'EMP_CODE',
  '人员姓名': 'EMP_NAME',
  '科室名称': 'DEPT_NAME'
}

const defaultSearchModel = {
  DEPT_NAME: '', // 科室名称
  EMP_CODE: '', // 人员编号
  EMP_NAME: '', // 人员姓名
  STATUS: '', // 人员工资发放状态
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
      rykList: [], // 人员库表
      txzqList: [
        { Code: 1, Label: '近一月' },
        { Code: 2, Label: '近两月' },
        { Code: 3, Label: '近三月' },
        { Code: 6, Label: '近半年' }
      ], // 停薪周期表
      searchtype: '人员编号',
      advanceSearchSign: true,
      searchContent: '',
      txzq: '', // 停薪周期
      /** 搜索模型 */
      searchModel: {
        DEPT_NAME: '', // 科室名称
        EMP_CODE: '', // 人员编号
        EMP_NAME: '', // 人员姓名
        STATUS: '', // 人员工资发放状态
        KIND_CODE: '', // 人员性质
        EMP_CLASS: '', // 人员分类
        HOSAREA: '' // 院区名称
      }
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
  watch: {
    monthNo: function(newValue, oldValue) {
      var params = {
        monthNo: newValue
      }
      getGridList(params).then(res => {
        this.depList = res.data
      })
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
    getRYKList().then(res => {
      this.rykList = res.data
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
      if (!this.advanceSearchSign) {
        this.searchModel[mapDict[this.searchtype]] = this.searchContent
      } else {
        if (this.txzq) {
          const today = new Date()
          this.searchModel.resignetime = today.toISOString().split('T')[0]
          today.setMonth(today.getMonth() - this.txzq)
          this.searchModel.resignbtime = new Date(today.getFullYear(), today.getMonth(), 2).toISOString().split('T')[0]
        }
      }
      console.log(this.searchModel)
      this.$emit('search', this.searchModel)
    },
    handleCommand(command) {
      this.searchtype = command
      this.searchContent = ''
      this.searchModel = Object.assign({}, defaultSearchModel)
    },
    showAdvanceSearch() {
      this.advanceSearchSign = !this.advanceSearchSign
    },
    searchEmpty() {
      this.searchModel = Object.assign({}, defaultSearchModel)
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
.sub-advance-input{
  width: 200px;
}
</style>
