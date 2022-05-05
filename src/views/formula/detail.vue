<template>
  <div class="app-container">
    <el-descriptions title="公式详细信息" :column="2">
      <el-descriptions-item label="类别编码">
        <el-input v-model="localFormula.TCODE" class="width220" />
      </el-descriptions-item>
      <el-descriptions-item label="类别名称">
        <el-input v-model="localFormula.TNAME" class="width220" :disabled="true" />
      </el-descriptions-item>
      <el-descriptions-item label="薪资编码">
        <el-input v-model="localFormula.DCODE" class="width220" :disabled="true" />
      </el-descriptions-item>
      <el-descriptions-item label="薪资名称">
        <el-input v-model="localFormula.DNAME" class="width220" />
      </el-descriptions-item>
      <el-descriptions-item label="生效时间">
        <el-date-picker
          v-model="localFormula.BEGINDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
        />
      </el-descriptions-item>
      <el-descriptions-item label="失效时间">
        <el-date-picker
          v-model="localFormula.ENDDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
        />
      </el-descriptions-item>
      <el-descriptions-item label="父级节点">
        <el-cascader v-model="localFormula.SUPERCODE" :options="typeOptions" :props="props" filterable clearable>
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.options.length }}) </span>
          </template>
        </el-cascader>
      </el-descriptions-item>
      <el-descriptions-item label="是否锁定">
        {{ localFormula.ISLOCK }}
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="2">
        <el-input v-model="localFormula.REMARK" type="textarea" :readonly="false" :style="{'width':'800px'}" />
      </el-descriptions-item>
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
        :fetch-suggestions="queryAsync"
        :trigger-on-focus="false"
        placeholder="请输入公式内容"
        value-key="TCODE"
        class="block"
        @select="autoFixInput"
      >
        <template v-slot="{item}">
          <span style="float: left">{{ item.TNAME }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.TCODE }}</span>
        </template>
      </el-autocomplete>
    </div>
    <el-button type="primary" @click="save">保存修改</el-button>
  </div>
</template>

<script>
import { tagshow } from './components'
import { splictStringByOperator, getLastStrByOperator, splictStringByOperatorSign } from '@/utils/stringAdvanced'
import { debounce } from '@/utils/index'
// import { salaryTypeModel as defaultModel } from '@/dataModel/SalaryTypeModel'
import { getTreeList, getGridList, localAdd, localUpdate } from '@/api/salaryType'
export default {
  components: {
    tagshow
  },
  data: function() {
    return {
      rawFormular: '', // 存储的是字符串的形式
      dict: [],
      testdata: 0,
      localTime: null,
      searchDebounce: debounce(this.querySearchRemote, 500),
      rawTemp: '',
      typeOptions: [],
      props: {
        checkStrictly: true,
        children: 'options',
        leaf: 'id'
      },
      localFormula: {
        AUTOID: '',
        DCODE: '',
        DNAME: '',
        TCODE: '',
        TNAME: '',
        REMARK: '',
        SUPERCODE: '',
        FORMULA: '',
        SEQINDEX: '',
        BEGINDATE: '',
        ENDDATE: '',
        ISLOCK: '',
        RNUM: ''
      },
      datePickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '本月第一天',
          onClick(picker) {
            const date = new Date()
            var firstday = new Date(date.getFullYear(), date.getMonth(), 1)
            picker.$emit('pick', firstday)
          }
        }, {
          text: '本月最后一天',
          onClick(picker) {
            const date = new Date()
            var lastday = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            picker.$emit('pick', lastday)
          }
        }]
      }
    }
  },
  computed: {
    showFormular: function() {
      return splictStringByOperator(this.rawFormular, this.dict)
    },
    formula: function() {
      // 先computed,然后再created
      return this.$store.state.formula.cachedFormula
    },
    monthDate: function() {
      if (this.localFormula.BEGINDATE) {
        var temp = new Date(this.localFormula.BEGINDATE)
        return temp.getFullYear() + '-' + (1 + temp.getMonth())
      }
      return null
    }
  },
  mounted: function() {
  },
  created: function() {
    if (this.formula != null) {
      this.localFormula = Object.assign({}, this.formula)
      this.getSalaryType()
      this.getSalaryDict()
    } else {
      this.$message({
        message: '请选择一条公式或者选择新增公式!',
        type: 'warning'
      })
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/formula/index')
      // 关闭当前页面
    }
  },
  methods: {
    save() {
      const type = this.$route.query.type
      let i = 0
      let str = ''
      let temp = ''
      for (i = 0; i < this.showFormular.length; i++) {
        if (this.showFormular[i].type === 'primary') {
          temp = '[' + this.showFormular[i].code.replace('T', '') + ']'
        } else {
          temp = this.showFormular[i].code
        }
        str += temp
      }
      this.localFormula.FORMULA = str
      console.log(this.localFormula)
      if (type === 'edit') {
        console.log('edit')
        localUpdate(this.localFormula).then(res => {
          this.$message({
            message: '薪资更新成功!',
            type: 'success'
          })
        })
      } else if (type === 'new') {
        console.log('new')
        localAdd(this.localFormula).then(res => {
          this.$message({
            message: '薪资新增成功',
            type: 'success'
          })
        })
      }
      console.log(this.localFormula)
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/formula/index?monthNo=' + this.monthDate)
    },
    async getSalaryType() {
      const time = new Date(this.formula.ENDDATE)
      this.localTime = time.getFullYear() + '-' + (time.getMonth() + 1).toString()
      var param = {
        monthNo: this.localTime
      }
      await getTreeList(param).then(res => {
        this.typeOptions = res.data
      })
    },
    async getSalaryDict() {
      var param = {
        monthNo: this.localTime
      }
      getGridList(param).then(res => {
        this.dict = res.data
        this.initialFormular()
      })
    },
    initialFormular() {
      if (this.localFormula.FORMULA) {
        var temp = this.localFormula.FORMULA
        const splitarr = splictStringByOperatorSign(temp, this.dict)
        let str = ''
        for (let i = 0; i < splitarr.length; i++) {
          str += splitarr[i].element
        }
        this.rawFormular = str
      }
    },
    /**
     * 根据所在列控制颜色显示
     */
    columnColorControll: function({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'backgroundcolor:blue'
      }
    },
    queryAsync(rawString, cb) {
      var queryString = getLastStrByOperator(rawString)
      if (!queryString) {
        cb([])
      } else {
        return this.searchDebounce(rawString, cb)
      }
    },
    async querySearchRemote(rawString, cb) { // 该函数会在用户每次input时调用
      this.rawTemp = rawString
      // this.rawTemp2 = rawString
      var queryString = getLastStrByOperator(rawString)
      var result = queryString ? this.dict.filter(state => state.TCODE.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : this.dict
      cb(result)
    },
    autoFixInput(item) { // el-input中的下拉框发生点击事件之时,已经将input中的内容更新成了item中的内容
      // console.log('this is test')
      let index = 0
      // console.log(this.rawTemp)
      index = this.rawTemp.search(/[\/\+\-\*%()\\=][\u4e00-\u9fa5\w]*$/)
      // console.log(index)
      this.rawFormular = this.rawTemp.slice(0, index + 1) + item.TNAME
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
  .width220{
    width: 220px;
  }
</style>
