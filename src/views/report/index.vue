<template>
  <div class="app-container">
    <el-table
      :v-loading="loading"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="dataList.filter(data => !search || (data.TITLE.toLowerCase().includes(search.toLowerCase())||data.ID.toLowerCase().includes(search.toLowerCase())))"
      style="width: 100%;margin-bottom: 20px;"
      row-key="ID"
      border
      default-expand-all
      :tree-props="{children: 'ChildNav'}"
    >
      <el-table-column
        prop="ID"
        label="ID"
        sortable
        align="left"
        width="120"
      />
      <el-table-column
        prop="TITLE"
        label="报表名称"
        sortable
        align="center"
        width="400"
      />
      <el-table-column align="center">
        <!--eslint-disable-next-line vue/no-unused-vars-->
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入表名或者ID进行搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-share" title="浏览" @click="View(scope)">跳转</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { GetTreeList, Encryption } from '@/api/report'

export default {
  data() {
    return {
      EncryptionCode: '',
      dataList: [],
      loading: false,
      search: ''
    }
  },
  computed: {
    code: function() {
      return this.$store.state.user.userInfo.code
    }
  },
  created: function() {
    // console.log(this.code)
    Encryption(this.code).then(res => {
      this.EncryptionCode = res.data
    })
    this.loading = true
    GetTreeList().then(res => {
      this.dataList = res.data[0].ChildNav
      this.loading = false
    })
  },
  methods: {
    View(scope) {
      // console.log(scope.row)
      var url = scope.row.LINK_URL + '&ssoToken=' + encodeURIComponent(this.EncryptionCode)
      console.log(url)
      this.$store.commit('universal/SET_REPORTURL', url)
      // 这里可以直接修改route中的meta信息吗?然后加上ID信息
      var id = scope.row.ID
      // this.$router.push(`/report/content/${id}`)
      // this.$router.push({ name: 'ReportContent', query: { id: id }, params: { Id: id, title: scope.row.TITLE }})
      this.$router.push({ path: `/report/content/${id}`, query: { title: scope.row.TITLE }})
    }
  }
}
</script>
