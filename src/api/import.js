import request from '@/utils/request'

/**
 * 薪资明细导入
 * @returns
 */
export function getNatureList(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BusiManage/Salary/Import', // 假地址 自行替换
    method: 'post',
    data: params
  })
}
/**
 * 从Excel导入复制并替换原有的人员数据
 * @param {*} params
 * @returns
 */
export function getEmployeeByExcel(params) {
  console.log(params)
  return request({
    timeout: 1000 * 500,
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/ImportExcelAndReplace', // 假地址 自行替换
    method: 'post',
    data: params
  })
}

/**
 * 从Excel导入额外的人员数据
 * @param {*} params
 * @returns
 */
export function AddEmployeeByExcel(params) {
  // console.log(params)
  return request({
    timeout: 1000 * 500,
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/ImportExcelAndAdd', // 假地址 自行替换
    method: 'post',
    data: params
  })
}
/**
 * 导入这个月的工资和银行卡信息
 * @param {} params
 * @returns
 */
export function SalaryImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/OARYXX/Import',
    method: 'post',
    data: params
  })
}
/**
 * 导入这个月的部门信息
 * @param {} params
 * @returns
 */
export function DeptImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Department/Import',
    method: 'post',
    data: params
  })
}
/**
 * 导入这个月的员工信息
 * @param {} params
 * @returns
 */
export function EmployeeImport(params) {
  return request({
    url: 'http://10.88.88.193:5000/api/BasicManage/Employee/Import',
    method: 'post',
    data: params
  })
}
