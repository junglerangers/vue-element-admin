<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="monthTime"
        type="month"
        placeholder="请选择相应月份"
        @change="decorateMonthChange"
      />
    </div>
    <search v-model="searchString" @search="searchHandler" />
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
      <el-table-column align="center" label="类别名称" width="200">
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
            <el-button type="primary" size="small" icon="el-icon-document-add" title="薪资类别新增" @click="handleAddSalaryType" />
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
    <el-dialog
      title="薪资复制选择框"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="block">
        <span>薪资复制(月份)</span>
        <el-date-picker
          v-model="copyMonth"
          type="monthrange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :picker-options="pickerOptions"
          class="dialogContent"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="salaryTypeCopy">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageQuery, localDelete, localCopy } from '@/api/salaryType'
import { search } from './components'
import { salaryTypeModel as defaultModel } from '@/dataModel/SalaryTypeModel'
import resize from '@/mixins/resize'
import tablePage from '@/mixins/tablePage'
import searchMethod from '@/mixins/search'
import { MessageBox } from 'element-ui'

export default {
  name: 'FormularIndex',
  components: {
    search
  },
  mixins: [resize, tablePage, searchMethod],
  data: function() {
    return {
      loading: false,
      currentModel: Object.assign({}, defaultModel), // 当前选中的模型
      monthTime: '',
      dataList: [], // 所有数据列表
      copyMonth: [],
      searchModel: { // 搜索模型
        'dcode': '',
        'tcode': '',
        'tname': '',
        'remark': '',
        'supercode': '',
        'formula': '',
        'monthNo': '',
        'islock': ''
      },
      searchString: '',
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            end.setMonth(end.getMonth() + 1)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  computed: {
    monthNo: function() {
      return this.$store.state.universal.monthNo
    }
  },
  created() {
    var time = new Date()
    console.log(time)
    this.monthTime = this.monthNo
    this.getDataList()
    // this.getDepList()
    // this.getTypeList()
  },
  activated() {
    this.monthTime = this.monthNo
    this.getDataList()
  },
  methods: {
    /**
     * 获取字典列表
     */
    async getDataList() {
      this.searchModel.monthNo = this.monthTime
      var params = {
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      console.log(params)
      this.loading = true
      const res = await pageQuery(params)
      this.dataList = res.data
      this.page_total = res.pageHandler.records
      this.loading = false
    },
    /**
     * 添加新项
     */
    handleAddSalaryType() {
      var date = new Date(this.monthNo)
      this.currentModel = Object.assign({}, defaultModel)
      // bug?
      this.currentModel.BEGINDATE = new Date(date.getFullYear(), date.getMonth(), 1)
      this.currentModel.ENDDATE = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      this.$store.dispatch('formula/getFormula', this.currentModel)
      this.$router.push('/formula/detail?type=new')
    },
    /**
     * 修改现有项
     */
    handleEdit(scope) {
      this.currentModel = Object.assign({}, scope.row)
      this.$store.dispatch('formula/getFormula', this.currentModel)
      this.$router.push('/formula/detail?type=edit')
    },
    searchEmpty() {
      this.searchString = ''
      this.searchModel = {}
    },
    decorateMonthChange(value) {
      return this.monthChange(value, this.searchEmpty)
    },
    salaryTypeCopy() {
      this.dialogVisible = false
      var start = this.copyMonth[0]
      start = start.getFullYear() + '-' + (start.getMonth() + 1)
      var end = this.copyMonth[1]
      end = end.getFullYear() + '-' + (end.getMonth() + 1)
      var params = {
        'monthNo': start,
        'copyFromMonthNo': end
      }
      localCopy(params).then(res => {
        this.$message({
          message: '薪资复制成功!',
          type: 'success'
        })
      })
      // 发送复制的请求
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
        localDelete({ autoId: scope.row.AUTOID }).then(() => {
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.getDataList()
        })
      }).catch((val) => {
        console.log(val)
      })
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
.dialogContent{
  margin-top: 10px;
}
</style>
