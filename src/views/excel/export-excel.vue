<template>
  <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document" @click="handleDownload">
    导出
  </el-button>
</template>

<script>
// options components
import { getGridList } from '@/api/employee'

export default {
  name: 'ExportExcel',
  props: {
    searchModel: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: 'test',
      data: []
    }
  },
  methods: {
    async handleDownload() {
      this.downloadLoading = true
      // console.log(this.searchModel)
      await getGridList(this.searchModel).then(data => {
        this.data = data.data
      })
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['EMP_CODE', 'EMP_NAME', 'DEPT_NAME', 'PHONE', 'KIND_NAME', 'EMP_CLASSNAME', 'STATUS']
        const data = this.data
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.searchModel.monthNo + '人员信息'
        })
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
