<template>
  <div class="app-container">
    <el-descriptions title="公式详细信息" :column="2">
      <el-descriptions-item label="类别编码">
        <el-input v-model="localFormula.TCODE" class="width220" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="类别名称">
        <el-input v-model="localFormula.TNAME" class="width220" />
      </el-descriptions-item>
      <el-descriptions-item label="薪资编码">
        <el-input v-model="localFormula.DCODE" class="width220" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="薪资名称">
        <el-select v-model="localFormula.DNAME" placeholder="请选择" class="width220" @change="updateDCODE">
          <el-option
            v-for="item in salaryTypeDict"
            :key="item.DCODE"
            :label="item.DNAME"
            :value="item.DNAME"
          />
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item label="生效时间">
        <el-date-picker
          v-model="localFormula.BEGINDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
          disabled
        />
      </el-descriptions-item>
      <el-descriptions-item label="失效时间">
        <el-date-picker
          v-model="localFormula.ENDDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="datePickerOptions"
          disabled
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
    <tagshow :content="showFormular" :result="localFormula.TNAME" />
    <div class="inputFormular">
      主公式:
      <!-- 输入模块(输入这里要增加智能搜索模块,智能提示需要的输入) -->
      <el-autocomplete
        ref="input"
        v-model="formualrContent"
        :fetch-suggestions="queryAsync"
        :trigger-on-focus="false"
        placeholder="请输入公式内容"
        value-key="TCODE"
        class="block"
        @select="autoFixInput"
      >
        <template slot="prepend">{{ localFormula.TNAME }} =</template>
        <template v-slot="{item}">
          <span style="float: left">{{ item.TNAME }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.TCODE }}</span>
        </template>
      </el-autocomplete>
    </div>
    <div class="right">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
    <div>条件公式:</div>
    <el-table
      v-loading="loading"
      :data="formularSlv"
      style="width: 100%"
      element-loading-text="数据拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="table"
      border=""
    >
      <el-table-column label="人员性质" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.NATURALLABEL }}
        </template>
      </el-table-column>
      <el-table-column label="人员入职时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.HOSTIMEBMONTH|timeFormatS }} 至 {{ scope.row.HOSTIMEEMONTH|timeFormatE }}
        </template>
      </el-table-column>
      <el-table-column label="公式" align="center">
        <template slot-scope="scope">
          <tagshow :content="scope.row.FORMULALABEL" />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header">
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-document-add" title="条件公式新增" @click="handleSubAdd" />
          </el-button-group>
        </template>
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" title="编辑" @click="handleSubEdit(scope)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" title="删除" circle @click="handleSubDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <detail-dialog :raw-model="currentSlvFormular" :type="dialogType" :dialog-visible="dialogVisible" @toggleVisible="dialogVisible = !dialogVisible" @update="getFormularSlv" />
  </div>
</template>

<script>
import { tagshow, detailDialog } from './components'
import { splictStringByOperator, getLastStrByOperator, splictStringByOperatorSign } from '@/utils/stringAdvanced'
import { debounce } from '@/utils/index'
// import { salaryTypeModel as defaultModel } from '@/dataModel/SalaryTypeModel'
import { getTreeList, getGridList, localAdd, localUpdate, getSalaryTypeList } from '@/api/salaryType'
import { getGridList as getFormularSlv } from '@/api/formularSlv'
import { getNatureList } from '@/api/enum'
export default {
  name: 'FormularDetail',
  components: {
    tagshow,
    detailDialog
  },
  setup(props) {
    console.log(props)
  },
  filters: {
    timeFormatS: function(value) {
      if (!value) {
        return '-∞'
      }
    },
    timeFormatE: function(value) {
      if (!value) {
        return '+∞'
      }
    }
  },
  data: function() {
    return {
      formualrContent: '', // 存储的是字符串的形式
      formularSlv: [],
      loading: false,
      currentSlvFormular: {},
      dialogVisible: false,
      naturalList: [], // 人员性质表
      dialogType: '',
      rawID: '',
      dict: [], // 用于公式自动补全框中的输入提示
      salaryTypeDict: [], // 存储工资类别,包括工资,奖金,福利,社保缴费等
      testdata: 0,
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
      return splictStringByOperator(this.formualrContent, this.dict) // 前台存储的字符串转换为展示用的字符串
    },
    formula: function() {
      // 先computed,然后再created
      return this.$store.state.formula.cachedFormula
    },
    monthNo: function() {
      return this.$store.getters.monthNo
    }
  },
  created: function() {
    console.log('created')
    if (this.formula) {
      this.localFormula = Object.assign({}, this.formula)
      this.getSalaryType()
      this.getSalaryDict()
      this.getSalaryType2()
      this.getNatureList().then(() => {
        this.getFormularSlv()
      })
      this.rawID = this.formula.AUTOID
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
  activated: function() {
    if (this.rawID !== this.formula.AUTOID) {
      this.localFormula = Object.assign({}, this.formula)
      this.getSalaryType()
      this.getSalaryDict()
      this.getSalaryType2()
      this.getNatureList().then(() => {
        this.getFormularSlv()
      })
      this.rawID = this.formula.AUTOID
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
        var params = {
          'dcode': this.localFormula.DCODE,
          'dname': this.localFormula.DNAME,
          'tname': this.localFormula.TNAME,
          'begindate': this.localFormula.BEGINDATE.format('yyyy-MM-dd hh:mm:ss'),
          'enddate': this.localFormula.ENDDATE.format('yyyy-MM-dd hh:mm:ss'),
          'remark': this.localFormula.REMARK
        }
        console.log(params)
        localAdd(params).then(res => {
          this.$message({
            message: '薪资新增成功',
            type: 'success'
          })
        })
      }
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/formula/index')
    },
    async getSalaryType() { // 获取树状薪酬类型,用于指定父级节点
      var param = {
        monthNo: this.monthNo
      }
      await getTreeList(param).then(res => {
        this.typeOptions = res.data
      })
    },
    async getSalaryType2() { // 获取最基础的四个薪酬类型,即获取dcode
      getSalaryTypeList().then(res => {
        this.salaryTypeDict = res.data
      })
    },
    async getSalaryDict() { // 获取用于自动补全所使用的薪酬类型字典
      var param = {
        monthNo: this.monthNo
      }
      getGridList(param).then(res => {
        this.dict = res.data
        this.initialFormular()
      })
    },
    async getNatureList() {
      return getNatureList().then(res => {
        this.naturalList = res.data
      })
    },
    async getFormularSlv() { // 获取薪酬公式子公式
      // var stid = this.formula.AUTOID
      var params = {
        stid: this.formula.AUTOID
      }
      // console.log(params)
      this.loading = true
      getFormularSlv(params).then(res => {
        this.formularSlv = res.data
        for (var i = 0; i < res.data.length; i++) {
          var array = this.formularSlv[i].KINDCODELIST.split(',')
          var label = ''
          for (var j = 0; j < array.length; j++) {
            var item = this.naturalList.find(element => element.Code.toString() === array[j])
            // console.log(item)
            label += item.Label + ','
          }
          this.formularSlv[i].NATURALLABEL = label
          var splitarr = splictStringByOperatorSign(this.formularSlv[i].FORMULA, this.dict)
          let str = ''
          for (let i = 0; i < splitarr.length; i++) {
            str += splitarr[i].element
          }
          this.formularSlv[i].FORMULCONTENT = str
          this.formularSlv[i].FORMULALABEL = splictStringByOperator(str, this.dict)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    updateDCODE(value) { // 选择薪酬类别名称的时候,自动更新薪酬类别代码
      var temp = this.salaryTypeDict.find(element => element.DNAME === value)
      this.localFormula.DCODE = temp.DCODE
    },
    initialFormular() {
      if (this.localFormula.FORMULA) {
        var temp = this.localFormula.FORMULA
        const splitarr = splictStringByOperatorSign(temp, this.dict) // 数据库存储的转换为前台存储的字符串
        let str = ''
        for (let i = 0; i < splitarr.length; i++) {
          str += splitarr[i].element
        }
        this.formualrContent = str
      }
    },
    queryAsync(rawString, cb) {
      var queryString = getLastStrByOperator(rawString)
      if (!queryString) {
        cb([])
      } else {
        this.rawTemp = rawString
        return this.searchDebounce(queryString, cb)
      }
    },
    async querySearchRemote(queryString, cb) { // 该函数会在用户每次input时调用
      var result = queryString ? this.dict.filter(state => state.TCODE.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || state.TNAME.indexOf(queryString) === 0) : this.dict
      cb(result)
    },
    autoFixInput(item) { // el-input中的下拉框发生点击事件之时,已经将input中的内容更新成了item中的内容
      // console.log('this is test')
      let index = 0
      index = this.rawTemp.search(/[\/\+\-\*%()\\=][\u4e00-\u9fa5\w]*$/) // 匹配中文字母数字下划线
      // console.log(index)
      this.formualrContent = this.rawTemp.slice(0, index + 1) + item.TNAME
      this.$refs.input.focus()
    },
    handleSubEdit(scope) {
      // console.log(scope)
      this.currentSlvFormular = scope.row
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    handleSubDelete(scope) {
      console.log(`删除当前${scope}`)
    },
    handleSubAdd() {
      this.currentSlvFormular = {
        // 'autoid': 0,
        tcode: this.formula.TCODE,
        'kindcodelist': '',
        'hostimebmonth': '',
        'hostimeemonth': '',
        'formula': '',
        'begindate': this.formula.BEGINDATE,
        'enddate': this.formula.ENDDATE
      }
      this.dialogType = 'new'
      this.dialogVisible = true
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
  .right{
    text-align: right;
    margin-bottom: 20px;
    margin-right: 60px;
  }
</style>
