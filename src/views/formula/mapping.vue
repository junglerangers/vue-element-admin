<template>
  <div class="app-container">
    <div class="block">
      <el-date-picker
        v-model="monthNo"
        type="month"
        placeholder="请选择相应月份"
        :clearable="false"
      />
    </div>
    <div>
      <el-table
        v-loading="loading"
        :data="OASalaryType.filter(item=>!searchText||item.SaTypeName.includes(searchText))"
        style="width: 100%"
        max-height="450"
        class="table"
        element-loading-text="数据拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
      >
        <el-table-column
          align="center"
          prop="SaTypeName"
          label="OA项目名称"
          width="600"
        />
        <el-table-column
          align="center"
          label="映射状态"
          width="100"
          :filters="[{ text: '未映射', value: 'false' }, { text: '已映射', value: 'true' }]"
          :filter-method="filterMappingState"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.TCode==null" type="warning">未映射</el-tag>
            <el-tag v-else type="success">已映射</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="映射结果" align="center">
          <el-table-column
            align="center"
            prop="TCode"
            label="映射结果-代码"
          />
          <el-table-column
            align="center"
            prop="TName"
            label="映射结果-名称"
          />
        </el-table-column>
        <el-table-column
          align="center"
          width="240"
          label="操作"
        >
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="searchText"
              size="mini"
              :info="scope"
              placeholder="请输入OA项目名称进行搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="mapping(scope)">映射</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="工资系统当月项目表"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-table
        v-loading="loading"
        :data="SalaryTypeDict.filter(item=>!salarySearchText||item.TNAME.includes(salarySearchText))"
        style="width: 100%"
        max-height="400"
        class="table"
        element-loading-text="数据拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        border
      >

        <el-table-column
          align="center"
          prop="TCODE"
          label="项目代码"
        />
        <el-table-column
          align="center"
          prop="TNAME"
          label="项目名称"
        />
        <el-table-column
          align="center"
          width="240"
          label="操作"
        >
          <template slot="header" slot-scope="scope">
            <el-input
              v-model="salarySearchText"
              size="mini"
              :info="scope"
              placeholder="请输入奖金名称进行搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="confirm(scope)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetWelfareGridList, Mapping, getGridList } from '@/api/salaryType'

export default {
  data: function() {
    return {
      loading: false,
      dialogVisible: false,
      OASalaryType: [],
      SalaryTypeDict: [],
      searchText: '',
      salarySearchText: '',
      checkedOASalaryType: '',
      checkedSalaryType: ''
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
    this.getDataList()
  },
  methods: {
    mapping(scope) {
      this.dialogVisible = true
      // console.log(scope)
      this.checkedOASalaryType = scope.row.SaTypeName
    },
    async confirm(scope) {
      var date = new Date(this.monthNo)
      var params = {
        tcode: scope.row.TCODE,
        satypename: this.checkedOASalaryType,
        begindate: new Date(date.getFullYear(), date.getMonth(), 1).format('yyyy-MM-dd hh:mm:ss'),
        enddate: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).format('yyyy-MM-dd hh:mm:ss')
      }
      console.log(params)
      await Mapping(params).then(res => {
        console.log(res.data)
      }).finally(() => {
        this.dialogVisible = false
        this.getDataList()
      })
    },
    async getDataList() {
      var params = {
        monthNo: this.monthNo
      }
      this.loading = true
      await GetWelfareGridList(params).then(res => {
        this.OASalaryType = res.data
        // console.log(res.data)
      })
      params.supercode = 'T05'
      params.dcode = '1103'
      await getGridList(params).then(res => {
        this.SalaryTypeDict = res.data
        // console.log(res)
      })
      this.loading = false
    },
    filterMappingState(value, row) {
      console.log(value)
      if (value === 'false') {
        return row.TCode == null
      } else {
        return row.TCode != null
      }
    },
    searchEmpty() {
      this.searchText = null
    },
    monthChange(value, beforefun = null) {
      if (beforefun !== null) {
        beforefun()
      }
      var date = new Date(value)
      var temp =
        date.getFullYear() +
        '-' +
        (1 + date.getMonth()).toString().padStart(2, '0')
      this.$store.commit('universal/SET_MONTHNO', temp)
      this.getDataList()
    }
  }
}
</script>

<style lang="scss" scoped>

.flex{
    display: flex;
    margin-top: 15px;
}
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
