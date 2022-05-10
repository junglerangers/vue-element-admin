<template>
  <div>
    <el-button type="primary" size="small" icon="el-icon-upload2">
      <input ref="excel-upload-input" class="myinput" type="file" accept=".xlsx, .xls" title="薪资明细导入" @change="handleClick">
    </el-button>
  </div>
</template>

<script>
import { getGridList } from '@/api/salaryType'
import { getBase64 } from '@/utils/file'
import XLSX from 'xlsx'

export default {
  name: 'UploadExcelButton',
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function,// eslint-disable-line
    monthNo: {
      required: true,
      type: String,
      default: '2022-03'
    }
  },
  data() {
    return {
      loading: false,
      excelData: {
        mstId: 0,
        headValueList: [
          {
            readName: '',
            realValue: ''
          }
        ],
        fileBase64: '',
        fileName: ''
      },
      salaryType: []
    }
  },
  methods: {
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results
      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleClick(e) {
      console.log('start loading')
      const files = e.target.files
      const rawFile = files[0] // only use files[0] 获得第一个文件
      if (!rawFile) return
      this.upload(rawFile)
    },
    async getSalaryType() {
      var params = {
        monthNo: this.monthNo
      }
      var res = await getGridList(params)
      this.salaryType = res.data
    },
    findTCODE(tname, dict) {
      if (tname === '人员编码') {
        return 'ENUM'
      }
      if (tname === '姓名') {
        return 'ENAME'
      }
      const result = dict.find(item => item.TNAME === tname)
      if (result !== undefined) {
        return result.TCODE
      } else {
        return null
      }
    },
    async upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel
      this.excelData.fileName = rawFile.name
      if (!this.beforeUpload) {
        await this.getSalaryType()
        await this.readerData(rawFile)
        var fileStr = await getBase64(rawFile)
        this.excelData.fileBase64 = fileStr
        console.log(this.excelData)
      } else {
        const before = this.beforeUpload(rawFile)
        if (before) {
          await this.readerData(rawFile)
        }
      }
      this.onSuccess && this.onSuccess(this.excelData)
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        var time = new Date()
        const reader = new FileReader()
        /**
         * 该事件在读取完成时触发
         */
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRow(worksheet)
          // const results = XLSX.utils.sheet_to_json(worksheet)
          var i = 0
          for (i = 0; i < header.length; i++) {
            var tcode = this.findTCODE(header[i], this.salaryType)
            if (tcode !== null) {
              this.excelData.headValueList.push({
                readName: header[i],
                realValue: tcode
              })
            } else {
              this.$message({
                message: `发生错误,${header[i]}未能找到对应代码,请检查薪资类别字典后重新上传`,
                type: 'warning',
                duration: '5000'
              })
              break
            }
          }
          console.log(this.excelData)
          // 如果表头检查没有问题,就发送文件到远程客户端
          // console.log(results)
          // this.generateData({ header, results })
          this.loading = false
          console.log(new Date() - time)
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.myinput{
  position:absolute;
  opacity: 0;
  top:0;
  left: 0;
  height: 100%;
  width:100%;
}
</style>
