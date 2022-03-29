<template>
  <div ref="main" class="app-container">
    <el-button type="primary" @click="handleAddUser">添加新用户</el-button>
    <div align="right">
      筛选模块
      科室:
      <el-select v-model="searchModel.dep" placeholder="请选择">
        <el-option
          v-for="item in depList"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
      ...
      <el-button type="primary">筛选</el-button>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="userList"
      class="table"
      border
    >
      <el-table-column type="index" :index="CurrentIndex" width="50" align="center" label="序号" />
      <el-table-column align="center" label="工号" width="200">
        <template slot-scope="scope">
          {{ scope.row.key }}
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleAbandon(scope)">禁用</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block footer" :style="{width:footerWidth}">
      <el-pagination
        :current-page.sync="PageHandler.currentPage"
        :page-sizes="[20,100,200,400]"
        :page-size="PageHandler.size"
        layout="sizes, prev, pager, next"
        :total="PageHandler.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'创建用户'">
      <el-form :model="CurrentUser" label-width="80px" label-position="left">
        <el-form-item label="工号">
          <el-input v-model="CurrentUser.key" placeholder="工号" maxlength="10" style="width:250px" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="CurrentUser.name" placeholder="姓名" style="width:250px" />
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="CurrentUser.dep" filterable placeholder="请选择">
            <el-option
              v-for="item in depList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="CurrentUser.type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-switch
            v-model="CurrentUser.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="CurrentUser.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注信息"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import $ from 'jquery'
import { getUserList } from '@/api/user'
const md5 = require('js-md5')

const defaultUser = {
  key: '',
  name: '',
  dep: '',
  type: '',
  state: true,
  remark: ''
}

export default {
  data() {
    return {
      loading: false,
      CurrentUser: Object.assign({}, defaultUser), // 当前选中的用户
      dialogVisible: false, // 对话框是否可见
      dialogType: 'new', // 对话框属性
      userList: [], // 所有用户列表
      typeList: [], // 所有人员类型表
      depList: [], // 所有部门表
      footerWidth: 0,
      PageHandler: { // 页面模型
        total: 0,
        size: 20,
        currentPage: 1
      },
      searchModel: { // 搜索模型
        dep: '',
        type: '',
        key: '',
        name: ''
      },
      dataHandler: {
        hash: md5(''),
        total: 0,
        size: 20,
        currentPage: 1,
        dep: '',
        type: '',
        key: '',
        name: ''
      }
    }
  },
  computed: {
    CurrentIndex: function() {
      return this.PageHandler.size * (this.PageHandler.currentPage - 1) + 1
    }
  },
  created() {
    this.getUserList()
    this.getDepList()
    this.getTypeList()
  },
  mounted: function() {
    const vue = this
    setTimeout(() => {
      this.$nextTick(function() {
        vue.adjustFooterWidth()
      })
    }, 100)
    $(window).on('resize', function() {
      vue.adjustFooterWidth()
    })
  },
  methods: {
    async getDepList() { // 获得部门表
      return setTimeout(() => { console.log('testDpes') }, '500')
    },
    async getTypeList() { // 获得人员类型表
      return setTimeout(() => { console.log('testTypes') }, '500')
    },
    /**
     * 获得人员列表
     */
    async getUserList() {
      this.loading = true
      const res = await getUserList(this.currentPage, this.size)// .catch(console.log('error!'))
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
    /**
     * 宽度自适应
     */
    adjustFooterWidth() {
      var parentwidth = $('.app-container').width()
      console.log(parentwidth)
      $('.footer').width(parentwidth)

      // this.$refs.footer.offsetWidth = parentwidth
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
  background: rgb(124, 122, 122);
  text-align: center;
  /* color: #fff; */
}
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
