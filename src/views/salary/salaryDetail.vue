
<template>
  <div ref="main" class="app-container">
    <div class="year-class">
      <el-date-picker
        v-model="MstModel.YEARNO"
        type="year"
        value-format="yyyy"
        placeholder="请选择相应年份"
        :disabled="type === 'edit'"
      />
    </div>
    年-
    <div class="year-class">
      <el-date-picker
        v-model="MstModel.MONTHNO"
        format="MM"
        type="month"
        value-format="MM"
        placeholder="请选择相应月份"
        :disabled="type === 'edit'"
      />
    </div>
    月-
    <div class="month-class">
      <el-input
        v-model="MstModel.NUM"
        placeholder="请选择相应期数"
        :disabled="type === 'edit'"
      />
    </div>期
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
      <el-table-column align="center" label="科室" width="100">
        <template slot-scope="scope">
          {{ scope.row.DEPT_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.ENAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工号" width="100">
        <template slot-scope="scope">
          {{ scope.row.ENUM }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="人员类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.KIND_NAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.EMP_CLASSNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="应发合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.T01 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="扣款合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.T02 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="实发合计" width="100">
        <template slot-scope="scope">
          {{ scope.row.T03 }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <UploadExcelButton />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="详情" @click="handleEdit(scope)">详情</el-button>
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
        @size-change="handleSizeChange(getDataList)"
        @current-change="handleCurrentChange(getDataList)"
      />
    </div>
    <el-button type="primary" @click="save">保存</el-button>
  </div>
</template>

<script>
import { getSlvPageQuery } from '@/api/salary'
import { getGridList } from '@/api/salaryType'
import { search, salaryTypeDialog } from './components'
import * as defaultModel from '@/dataModel/SalaryMstModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import UploadExcelButton from '@/components/UploadExcel/index.vue'

export default {
  components: {
    search,
    salaryTypeDialog,
    UploadExcelButton
  },
  mixins: [resize, tablePage],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      dataList: [], // 所有数据列表
      searchModel: {
        'dcode': '',
        'tcode': '',
        'tname': '',
        'remark': '',
        'supercode': '',
        'formula': '',
        'monthNo': new Date(),
        'islock': ''
      },
      salaryTypeDict: [], // 薪酬类型字典
      type: '',
      MstModel: {
        AUTOID: '',
        DCODE: '',
        DNAME: '',
        YEARNO: '',
        MONTHNO: '',
        NUM: '',
        CREATEUSER: '',
        CREATEDATE: '',
        ISDEL: '',
        ISLOCK: '',
        REMARK: '',
        RNUM: ''
      }
    }
  },
  computed: {
    salary: function() {
      return this.$store.state.salary.cachedSalary
    }
  },
  created() {
    if (this.salary) {
      this.type = this.$route.query.type
      if (this.type === 'edit') {
        this.getDataList()
        this.getSalaryType()
        this.MstModel.YEARNO = this.salary.YEARNO
        this.MstModel.MONTHNO = this.salary.MONTHNO
        this.MstModel.NUM = this.salary.NUM
      }
    // this.getDepList()
    // this.getTypeList()
    } else {
      this.$message({
        message: '请优先选择一张工资单主表!',
        type: 'warning'
      })
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/salary/index')
    }
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
    async getSalaryType() {
      var monthNo = this.salary.YEARNO + '-' + this.salary.MONTHNO
      var param = {
        monthNo: monthNo
      }
      const res = await getGridList(param)
      this.salaryTypeDict = res.data
    },
    uploadClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0] 获得第一个文件
      if (!rawFile) return
      this.upload(rawFile)
      console.log('upload')
    },
    save() {
      console.log('save')
    },
    async getDataList() {
      //   var temp = {
      //     ...this.searchModel,
      //     currentPage: this.page_currentPage,
      //     size: this.page_size
      //   }
      this.loading = true
      var temp = {
        'queryModel': {
          'mstid': this.salary.AUTOID

        },
        'pageHandler': {
          'size': this.page_size,
          'currentPage': this.page_currentPage
        }
      }
      const res = await getSlvPageQuery(temp)
      this.dataList = res.data
      this.total = res.pageHandler.records
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.currentModel = Object.assign({}, defaultModel)
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.currentModel = scope.row
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
