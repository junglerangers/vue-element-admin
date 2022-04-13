<template>
  <div class="app-container">
    可以看到一个人每一期的详细信息
    每一个人的详细信息列表(竖着的三列)
    <!-- 每一个人的详细信息为一条记录 -->
    <el-table
      id="mytable"
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="salaryList"
      class="table"
      border
    >
      <el-table-column type="index" :index="currentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="分类类别" width="200">
        <template slot-scope="scope">
          {{ scope.row.dname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类别名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.tname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="公式" width="100">
        <template slot-scope="scope">
          {{ scope.row.formula }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.begindate.replace(/T*/,'') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间" width="100">
        <template slot-scope="scope">
          {{ scope.row.enddate }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否锁定" width="100">
        <template slot-scope="scope">
          {{ scope.row.islock === 1?'锁定':'未锁定' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息" width="100">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-user" title="添加新用户" />
            <el-button type="primary" size="small" icon="el-icon-download" title="数据导出" />
            <!-- input type="file" 点击然后取消时,有概率出现浏览器卡死的情况 -->
            <el-button type="primary" size="small" icon="el-icon-view" title="数据可视化" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-close" title="禁用" circle @click="handleAbandon(scope)">禁用</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="pageHandler.currentPage"
        :page-sizes="[20,100,200,400]"
        :page-size="pageHandler.records"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// import { getGridList } from '@/api/salary'

export default {
  components: {
  },
  data() {
    return {
      loading: false,
      total: 0,
      salaryList: [],
      seaerchHandler: {
        dcode: '1101',
        tcode: '',
        tname: '',
        remark: '',
        supercode: '',
        formula: '',
        monthNo: '',
        islock: ''
      },
      pageHandler: {
        records: 0,
        totalPage: 0,
        size: 20,
        currentPage: 1
      }
    }
  },
  computed: {
    currentIndex: function() {
      console.log(this.currentPage)
      return this.pageHandler.size * (this.currentPage - 1) + 1
    }
  },
  created() {
    this.getSalaryList()
  },
  methods: {
    async getSalaryList() {
      // this.loading = true
      // const res = await getGridList(this.seaerchHandler)
      // console.log(res)
      // this.salaryList = res.data
      // this.pageHandler.records = res.pageHandler.records
      // this.pageHandler.currentPage = 1
      // this.loading = false
    },
    handleEdit(scope) {

    },
    handleAbandon(scope) {

    },
    handleDelete(scope) {

    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.size = val
      // this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // this.getUserList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer{
  position: fixed;
  bottom: 0;
  /* width: 100%; */
  /* line-height: var(--footer-height); */
  background: #304156;
  text-align: center;
  transition: all 0.8s;
  /* color: #fff; */
}
</style>
