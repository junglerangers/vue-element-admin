import XLSX from 'xlsx'
import { getBase64 } from '@/utils/file'

export function findTCODE(tname, dict) {
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
}

export async function upload(mstID, rawFile, dict) {
  return new Promise((resolve, reject) => {
    var uploadData = {
      mstId: mstID,
      fileBase64: '',
      fileName: ''
    }
    uploadData.fileName = rawFile.name
    checkData(rawFile, dict)
      .then(() => {
        console.log('通过校验')
      })
      .then(async() => {
        uploadData.fileBase64 = await getBase64(rawFile)
      })
      .then(() => {
        resolve(uploadData)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

export function checkData(rawFile, dict) {
  return new Promise((resolve, reject) => {
    var time = new Date()
    const reader = new FileReader()
    /**
     * 该事件在读取完成时触发
     */
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      // const results = XLSX.utils.sheet_to_json(worksheet)
      var i = 0
      for (i = 0; i < header.length; i++) {
        var tcode = findTCODE(header[i], dict)
        if (tcode === null) {
          reject(
            `发生错误,${header[i]}未能找到对应代码,请检查薪资类别字典后重新上传`
          )
        }
      }
      // 如果表头检查没有问题,就发送文件到远程客户端
      // console.log(results)
      // this.generateData({ header, results })
      console.log(new Date() - time)
      resolve('Excel表单表头检查成功,信息导入成功.')
    }
    reader.readAsArrayBuffer(rawFile)
  })
}
export function getHeaderRow(sheet) {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    if (cell === undefined) continue
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}
export function isExcel(file) {
  return /\.(xlsx|xls|csv)$/.test(file.name)
}
