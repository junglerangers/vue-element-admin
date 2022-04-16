<template>
  <div ref="main" class="app-container">
    <svg-icon icon-class="scale_white" />
    <search @search="searchHandler" />
    <el-table
      id="mytable"
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList"
      class="table"
      border
    >
      <el-table-column type="index" :index="page_CurrentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="代码ID" width="200">
        <template slot-scope="scope">
          {{ scope.row.DCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="代码名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.DNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="代码类别" width="100">
        <template slot-scope="scope">
          {{ scope.row.SUPERCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="系统ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.SYSCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建用户" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEUSER }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="作废判别" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ISDEL == '1'" type="danger">停用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-user" title="添加字典新项" @click="handleAddUser" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <localDialog v-model="currentModel" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" @unchange="unchange" />
    <div class="block footer trt_fixed_footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="page_currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        :layout="page_layout"
        :total="page_total"
        @size-change="handleSizeChange(getDataList)"
        @current-change="handleCurrentChange(getDataList)"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { pageQuery } from '@/api/codeDict'
import { search, localDialog } from './components'
import { codeDictModel as defaultModel } from '@/dataModel/CodeDictModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'

export default {
  components: {
    search,
    localDialog
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      rawModel: null,
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      searchModel: {
        dcode: '',
        dname: '',
        supercode: '',
        syscode: '',
        remark: ''
      }
    }
  },
  created() {
    this.getDataList()
    // this.getDepList()
    // this.getTypeList()
  },
  beforeMount() {
    window.addEventListener('resize', this.adjustFooterWidth)
  },
  mounted: function() {
    const vue = this
    setTimeout(() => {
      this.$nextTick(function() {
        vue.adjustFooterWidth()
      })
    }, 150)
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.adjustFooterWidth)
  },
  methods: {
    async getDataList() {
      var params = {
        queryModel: {},
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      this.loading = true
      const res = await pageQuery(params)
      this.dataList = res.data
      this.total = res.pageHandler.records
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.currentModel = Object.assign({}, defaultModel)
      this.rawModel = Object.assign({}, this.currentModel)
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.currentModel = scope.row
      this.rawModel = Object.assign({}, this.currentModel)
      this.dialogVisible = true
    },
    searchHandler(searchModel) {
      this.dataModel = { ...searchModel }
      // console.log(this.dataModel)
    },
    importExcel(e) {
      // if (e.target.files.length > 0) {
      //   const file = e.target.files
      //   console.log(file)
      // }
      // return
    },
    unchange() {
      this.currentModel = Object.assign(this.currentModel, this.rawModel)
    }
  }
}
</script>

<style lang='scss' scoped>
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
.myinput{
  position:absolute;
  opacity: 0;
  top:0;
  left: 0;
  height: 100%;
  width:100%;
}
.margin20{
  margin: 0 20px;
}
.el-dialog{
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position:absolute;
  top:50%;
  left:50%;
   width: fit-content;
  transform: translate(-50%,-50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body{
  flex:1;
  overflow:auto;
}
</style>
