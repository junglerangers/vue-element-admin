<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="searchModel.monthNo"
        type="month"
        placeholder="请选择相应月份"
        @change="monthChange"
      />
    </div>
    {{ test }}
    <button @click="test++">++</button>
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
      <el-table-column align="center" label="代码ID" width="100">
        <template slot-scope="scope">
          {{ scope.row.DCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别编码" width="100">
        <template slot-scope="scope">
          {{ scope.row.TCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.TNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="父节点" width="100">
        <template slot-scope="scope">
          {{ scope.row.SUPERCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定标志" width="100">
        <template slot-scope="scope">
          {{ scope.row.ISLOCK }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="生效日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.BEGINDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="失效日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.ENDDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-document-add" title="添加字典新项" @click="handleAddUser" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block footer trt_fixed_footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="page_currentPage"
        :page-sizes="page_sizes"
        :page-size="page_size"
        :layout="page_layout"
        :total="page_total"
        @size-change="decorateSizeChange"
        @current-change="decoreateCurrentChange"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>
import { pageQuery, localDelete } from '@/api/salaryType'
import { search } from './components'
import { codeDictModel as defaultModel } from '@/dataModel/CodeDictModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import { MessageBox } from 'element-ui'

export default {
  components: {
    search
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      searchModel: { // 搜索模型
        'dcode': '',
        'tcode': '',
        'tname': '',
        'remark': '',
        'supercode': '',
        'formula': '',
        'monthNo': new Date().getFullYear() + '-' + (1 + new Date().getMonth()).toString().padStart(2, '0'),
        'islock': ''
      },
      test: 0
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
    window.removeEventListener('resize', this.adjustFooterWidth)
  },
  methods: {
    /**
     * 获取字典列表
     */
    async getDataList() {
      var params = {
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      this.loading = true
      const res = await pageQuery(params)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    /**
     * 添加新项
     */
    handleAddUser() {
      this.dialogType = 'new'
      this.currentModel = Object.assign({}, defaultModel)
      this.currentModel.SYSCODE = '0101'
      this.dialogVisible = true
    },
    /**
     * 修改现有项
     */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.currentModel = Object.assign({}, scope.row)
      this.dialogVisible = true
      this.$router.push('/dashboard')
    },
    /**
     * 搜索新项目
     */
    searchHandler(searchModel) {
      this.searchModel = { ...searchModel }
      this.page_currentPage = 1
      this.page_size = 20
      this.getDataList()
    },
    monthChange(value) {
      var date = new Date(value)
      this.searchModel.monthNo = date.getFullYear() + '-' + (1 + date.getMonth()).toString().padStart(2, '0')
      this.getDataList()
    },
    /**
     * 导入excel表格
     */
    importExcel(e) {
      // if (e.target.files.length > 0) {
      //   const file = e.target.files
      //   console.log(file)
      // }
      // return
    },
    /**
     * 删除特定项目
     */
    handleDelete(scope) {
      MessageBox.confirm('你确认要删除当前条目吗?', '确认删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((val) => {
        console.log('确认删除')
        localDelete({ DCODE: scope.row.DCODE }).then(() => {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.getDataList()
        })
      }).catch((val) => {
        console.log(val)
      })
    },
    /**
     * 因为ui-element 不支持在html中return function.
     */
    decoreateCurrentChange(val) {
      return this.handleCurrentChange(this.getDataList)(val)
    },
    decorateSizeChange(val) {
      return this.handleSizeChange(this.getDataList)(val)
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
