<template>
  <div ref="main" class="app-container">
    <div class="block">
      <el-date-picker
        v-model="monthNo"
        type="month"
        placeholder="请选择相应月份"
        :clearable="false"
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
          {{ scope.row.SUPERNAME }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="锁定状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ISLOCK === '0'" type="success">未锁定</el-tag>
          <el-tag v-else type="info">锁定</el-tag>
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
            <el-button type="primary" size="small" icon="el-icon-document-copy" title="薪资类别复制" @click="dialogVisible=true" />
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
        <el-date-picker
          v-model="startCopyMonth"
          type="month"
          placeholder="选择月"
          class="year-class"
        />
        至
        <el-date-picker
          v-model="monthNo"
          type="month"
          placeholder="选择月"
          disabled
          class="month-class"
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
import { pageQuery, localDelete, localCopy, isExist as salaryTypeIsExist } from '@/api/salaryType'
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
      dataList: [], // 所有数据列表
      startCopyMonth: '',
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
      rawTime: '',
      searchString: '',
      dialogVisible: false
    }
  },
  computed: {
    monthNo: {
      get: function() { return this.$store.state.universal.monthNo },
      set: function(v) {
        if (v !== this.monthNo) {
          this.monthChange(v, this.searchEmpty)
        }
      }
    }
  },
  created() {
    this.rawTime = this.monthNo
    this.getDataList()
  },
  activated() {
    if (this.rawTime !== this.monthNo) {
      this.rawTime = this.monthNo
      this.monthChange(this.monthNo, this.searchEmpty)
    } else {
      this.getDataList()
    }
  },
  methods: {
    async beforeRmoeteTest(fun, params) {
      var vue = this
      async function confirm() {
        var result = false
        await vue.$confirm('已经存在相应月份的数据,是否需要重新导入?(重新导入会覆盖原本的数据!)', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          result = true
        }).catch(() => {
          result = false
        })
        return result
      }
      var temp = params || this.monthNo
      var sign1 = await fun(temp)
      var sign2 = true
      if (sign1) {
        sign2 = await confirm()
      }
      if (sign1 && !sign2) {
        return false
      }
      return true
    },
    /**
     * 获取字典列表
     */
    async getDataList() {
      this.searchModel.monthNo = this.monthNo
      var params = {
        queryModel: this.searchModel,
        pageHandler: {
          currentPage: this.page_currentPage,
          size: this.page_size
        }
      }
      this.loading = true
      pageQuery(params).then(res => {
        this.dataList = res.data
        this.page_total = res.pageHandler.records
        this.loading = false
      })
    },
    /**
     * 添加新项
     */
    handleAddSalaryType() {
      var date = new Date(this.monthNo)
      this.currentModel = Object.assign({}, defaultModel)
      // bug?
      this.currentModel.BEGINDATE = new Date(date.getFullYear(), date.getMonth(), 1)
      this.currentModel.ENDDATE = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)
      this.$store.dispatch('formula/getFormula', this.currentModel)
      this.$router.push('/formula/detail?type=new')
    },
    /**
     * 修改现有项
     */
    handleEdit(scope) {
      this.currentModel = Object.assign({}, scope.row)
      this.$store.dispatch('formula/getFormula', this.currentModel)
      this.$router.push('/formula/detail/?type=edit')
    },
    searchEmpty() {
      this.searchString = ''
      this.searchModel = {}
    },
    async salaryTypeCopy() {
      if (!this.startCopyMonth) {
        this.$message({
          message: '请先选择相应的复制时间',
          type: 'warning'
        })
        return
      }
      var sign = await this.beforeRmoeteTest(salaryTypeIsExist)
      if (!sign) {
        this.dialogVisible = false
      } else {
        var start = this.startCopyMonth
        start = start.getFullYear() + '-' + (start.getMonth() + 1).toString().padStart('2', '0')
        var params = {
          'monthNo': this.monthNo,
          'copyFromMonthNo': start
        }
        localCopy(params).then(res => {
          this.$message({
            message: '薪资复制成功!',
            type: 'success'
          })
          this.dialogVisible = false
          this.$nextTick().then(() => {
            this.getDataList()
          })
        })
      }
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
.year-class{
  width:180px;
  display: inline-block;
}
.month-class{
  width:180px;
  display: inline-block;
}
</style>
