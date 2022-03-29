const Mock = require('mockjs')

const NameList = []
const count = 100

for (let i = 0; i < count; i++) {
  NameList.push(Mock.mock({
    name: '@first'// mock 中的占位符,代表取一个符合要求的随机值.
  }))
}
NameList.push({ name: 'mock-Pan' })

module.exports = [
  // username search -- 搜索功能,搜索包含该查询字符串所有的名字
  {
    url: '/vue-element-admin/search/user', // 路由
    type: 'get', // 访问方式
    response: config => { // 名字检索功能
      const { name } = config.query
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.name.toLowerCase()
        return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      })
      return {
        code: 20000,
        data: { items: mockNameList }
      }
    }
  },

  // transaction list -- 返回模拟的事务列表
  {
    url: '/vue-element-admin/transaction/list',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          total: 20,
          'items|20': [{
            order_no: '@guid()',
            timestamp: +Mock.Random.date('T'),
            username: '@name()',
            price: '@float(1000, 15000, 0, 2)',
            'status|1': ['success', 'pending']
          }]
        }
      }
    }
  }
]
