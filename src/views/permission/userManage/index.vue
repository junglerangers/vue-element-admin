<template>
  <div ref="main" class="app-container">
    <search @search="searchHandler" />
    <el-table
      v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="userList"
      class="table"
      border
    >
      <el-table-column type="index" :index="CurrentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="工号" width="200">
        <template slot-scope="scope">
          {{ scope.row.workNumber }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="科室" width="100">
        <template slot-scope="scope">
          {{ scope.row.dep }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="100">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.state === true?'启用':'停用' }}
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-user" title="添加新用户" @click="handleAddUser" />
            <el-button type="primary" size="small" icon="el-icon-download" title="数据导出" />
            <el-button type="primary" size="small" icon="el-icon-upload2" title="数据上传" />
            <el-button type="primary" size="small" icon="el-icon-view" title="数据可视化" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="info" size="small" icon="el-icon-edit" title="编辑" round @click="handleEdit(scope)" />
          <el-button type="warning" size="small" icon="el-icon-close" title="禁用" round @click="handleAbandon(scope)" />
          <el-button type="danger" size="small" icon="el-icon-delete" title="删除" round @click="handleDelete(scope)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="block footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="dataModel.currentPage"
        :page-sizes="[20,100,200,400]"
        :page-size="dataModel.size"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 用户界面创建/编辑框 -->
  </div>
</template>

<script>

import $ from 'jquery'
import { getUserList } from '@/api/user'
import search from './components/search'
const md5 = require('js-md5')

const defaultUser = {
  workNumber: '',
  name: '',
  dep: '',
  type: '',
  state: true,
  remark: ''
}

export default {
  components: {
    search
  },
  data: function() {
    return {
      loading: false,
      CurrentUser: Object.assign({}, defaultUser), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      userList: [], // 所有用户列表
      footerWidth: 0, // 控制底边栏的宽度
      total: 0, // 数据总数量
      dataModel: {
        token: md5(''), // 控制筛选条件是否发生改变 --> 如果可以,最好只传一个token然后后台解码之后执行
        currentPage: 1, // 当前页码
        /** 以下为筛选条件 */
        size: 20, // 每页数据数量
        dep: '', // 科室
        type: '', // 人员类型
        workNumber: '', // 人员工号
        name: '' // 人员姓名
      }
    }
  },
  computed: {
    CurrentIndex: function() {
      return this.dataModel.size * (this.dataModel.currentPage - 1) + 1
    }
  },
  created() {
    this.getUserList()
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
    }, 100)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.adjustFooterWidth)
  },
  methods: {
    async getUserList() {
      this.loading = true
      const res = await getUserList(this.dataModel)
      this.userList = res.data.data
      this.total = res.data.total
      this.loading = false
    },
    handleAddUser() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      this.currentPage = 1
      this.size = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getUserList()
    },
    searchHandler(searchModel) {
      this.dataModel = { ...searchModel }
      console.log(this.dataModel)
    },
    /**
     * 宽度自适应
     */
    adjustFooterWidth() {
      var parentwidth = $('.app-container').width()
      console.log(parentwidth)
      $('.footer').width(parentwidth)
    }
  }
}
</script>

<style>
.footer{
  position: fixed;
  bottom: 0;
  /* width: 100%; */
  /* line-height: var(--footer-height); */
  background: #304156;
  text-align: center;
  /* color: #fff; */
}
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
