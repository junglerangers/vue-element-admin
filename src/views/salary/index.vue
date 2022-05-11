<template>
  <div ref="main" class="app-container">
    时间:
    <div class="year-class">
      <el-date-picker
        v-model="timeYear"
        type="year"
        value-format="yyyy"
        clearable
        placeholder="请选择相应年份"
      />
    </div>
    -
    <div class="month-class">
      <el-date-picker
        v-model="timeMonth"
        format="MM"
        type="month"
        value-format="MM"
        clearable
        placeholder="请选择相应月份"
      />
    </div>
    <el-button class="primary" @click="searchHandler">确认</el-button>
    <!-- <search @search="searchHandler" /> -->
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
      <el-table-column align="center" label="薪酬类型代码" width="100">
        <template slot-scope="scope">
          {{ scope.row.DCODE }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="薪酬类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.DNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="年份" width="100">
        <template slot-scope="scope">
          {{ scope.row.YEARNO }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="月份" width="100">
        <template slot-scope="scope">
          {{ scope.row.MONTHNO }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人员" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEUSER }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建日期" width="100">
        <template slot-scope="scope">
          {{ scope.row.CREATEDATE| timeFormatter }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定标志" width="100">
        <template slot-scope="scope">
          {{ scope.row.ISLOCK }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-document-add" title="工资单新增" @click="handleAddUser" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button v-if="scope.row.ISLOCK === '0'" type="text" size="small" icon="el-icon-lock" title="锁定" circle @click="handleClock(scope)">锁定</el-button>
          <el-button v-else type="text" size="small" icon="el-icon-unlock" title="解锁" circle @click="handleClock(scope)">解锁</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <salaryTypeDialog v-model="currentModel" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" />
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
import { getMstPageQuery, lockData, localDelete } from '@/api/salary'
import { salaryTypeDialog } from './components'
import * as defaultModel from '@/dataModel/SalaryTypeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'

export default {
  name: 'SalaryIndex',
  components: {
    // search,
    salaryTypeDialog
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      timeYear: null,
      timeMonth: null,
      searchModel: {
        'autoid': '',
        'dcode': '',
        'yearno': '',
        'monthno': '',
        'num': '',
        'islock': '',
        'remark': ''
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
      //   var temp = {
      //     ...this.searchModel,
      //     currentPage: this.page_currentPage,
      //     size: this.page_size
      //   }
      this.loading = true
      var temp = {
        'queryModel': this.searchModel,
        'pageHandler': {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      const res = await getMstPageQuery(temp)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.currentModel = Object.assign({}, defaultModel)
      this.dialogVisible = true
      this.$store.dispatch('salary/getSalary', this.currentModel)
      this.$router.push('/salary/salaryDetail?type=new')
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.currentModel = scope.row
      this.$store.dispatch('salary/getSalary', this.currentModel)
      this.$router.push('/salary/salaryDetail?type=edit')
    },
    searchHandler(searchModel) {
      this.searchModel = Object.assign(this.searchModel, searchModel)
      this.searchModel.monthno = this.timeMonth
      this.searchModel.yearno = this.timeYear
      this.getDataList()
      // console.log(this.dataModel)
    },
    initialSearchModel() {
      this.searchModel.monthno = ''
      this.searchModel.yearno = ''
    },
    handleDelete(scope) {
      var AutoId = scope.row.AUTOID
      var params = {
        AutoId: AutoId
      }
      this.$confirm('确认删除当前工资单?(此操作无法撤销!!!)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localDelete(params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.initialSearchModel()
          this.getDataList()
        })
      }).catch(() => {})
    },
    importExcel(e) {
      // if (e.target.files.length > 0) {
      //   const file = e.target.files
      //   console.log(file)
      // }
      // return
    },
    handleClock(scope) {
      var monthNo = scope.row.YEARNO + '-' + scope.row.MONTHNO
      var islock = scope.row.ISLOCK === '0'
      var params = {
        monthNo: monthNo,
        islock: islock
      }
      var tipStr = `此操作将锁定${monthNo}时间段的所有数据,是否继续?`
      var finishTipStr = islock ? '锁定成功!' : '解锁成功!'
      this.$confirm(tipStr, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        lockData(params).then(() => {
          this.$message({
            type: 'success',
            message: finishTipStr
          })
          scope.row.ISLOCK = islock ? '1' : '0'
        })
      }).catch(() => {})
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
.year-class{
  width:220px;
  display: inline-block;
}
.month-class{
  width:240px;
  display: inline-block;
}
</style>
