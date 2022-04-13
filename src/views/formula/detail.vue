<template>
  <div class="app-container">
    <el-descriptions title="公式详细信息" :column="2">
      <el-descriptions-item label="公式名称">慈善一日捐</el-descriptions-item>
      <el-descriptions-item label="公式所属">
        <el-cascader :options="options">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="2">该公式仅适用于行政中层人员.</el-descriptions-item>
    </el-descriptions>
    <!-- 其它信息模块 -->
    <el-divider />
    <!-- 显示模块 -->
    <tagshow :content="showFormular" />
    <div class="inputFormular">
      公式输入:
      <!-- 输入模块(输入这里要增加智能搜索模块,智能提示需要的输入) -->
      <el-autocomplete
        ref="input"
        v-model="rawFormular"
        :fetch-suggestions="searchDebounce"
        :trigger-on-focus="false"
        placeholder="请输入公式内容"
        class="block"
        @select="autoFixInput"
      >
        <template v-slot="{item}">
          <span style="float: left">{{ item.value }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
        </template>
      </el-autocomplete>
    </div>
    <el-button type="primary">保存修改</el-button>
  </div>
</template>

<script>
import { tagshow } from './components'
import { splictStringByOperator, getLastStrByOperator } from '@/utils/stringAdvanced'
import { debounce } from '@/utils/index'

export default {
  components: {
    tagshow
  },
  data: function() {
    return {
      rawFormular: '',
      testdata: 0,
      searchDebounce: debounce(this.querySearchRemote, 500),
      rawTemp: '',
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }]
    }
  },
  computed: {
    showFormular: function() {
      return splictStringByOperator(this.rawFormular)
    }
  },
  mounted: function() {
  },
  methods: {
    /**
     * 根据所在列控制颜色显示
     */
    columnColorControll: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'backgroundcolor:blue'
      }
    },
    async querySearchRemote(rawString, cb) { // 该函数会在用户每次input时调用
      this.rawTemp = rawString
      var queryString = getLastStrByOperator(rawString.toLowerCase())
      // console.log(queryString)
      // 在这里请求服务器获数据
      var remoteMock = [{ 'value': queryString + 'Tick' }]
      var result = queryString ? remoteMock : []
      cb(result)
    },
    autoFixInput(item) { // el-input中的下拉框发生点击事件之时,已经将input中的内容更新成了item中的内容
      // console.log('this is test')
      let index = 0
      // console.log(this.rawTemp)
      index = this.rawTemp.search(/[\+\-\*%()\\=][\u4e00-\u9fa5\w]*$/)
      // console.log(index)
      this.rawFormular = this.rawTemp.slice(0, index + 1) + item.value
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
  .inputFormular{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  #formular.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: rgba(255, 255, 255, 0)
  }
  #formular.el-table--enable-row-hover .el-table__body tr> td.el-table__cell:hover{
    background-color: #F5F7FA;
  }
  .block{
    display: block;
  }
</style>
