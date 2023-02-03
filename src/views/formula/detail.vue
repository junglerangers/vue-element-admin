<template>
  <div
    v-loading="loading"
    class="app-container"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-descriptions title="公式详细信息" :column="2">
      <el-descriptions-item label="类别编码">
        <el-input v-model="localFormula.TCODE" class="width220" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="类别名称">
        <el-input v-model="localFormula.TNAME" class="width220" />
        <span class="must">*</span>
      </el-descriptions-item>
      <el-descriptions-item label="薪资编码">
        <el-input v-model="localFormula.DCODE" class="width220" disabled />
      </el-descriptions-item>
      <el-descriptions-item label="薪资名称">
        <el-select v-model="localFormula.DNAME" placeholder="请选择" class="width220" @change="updateDCODE">
          <el-option
            v-for="item in slaryCateDict"
            :key="item.DCODE"
            :label="item.DNAME"
            :value="item.DNAME"
          />
        </el-select>
        <span class="must">*</span>
      </el-descriptions-item>
      <el-descriptions-item label="生效时间">
        <el-date-picker
          v-model="localFormula.BEGINDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          disabled
        />
      </el-descriptions-item>
      <el-descriptions-item label="失效时间">
        <el-date-picker
          v-model="localFormula.ENDDATE"
          align="right"
          type="date"
          placeholder="选择日期"
          disabled
        />
      </el-descriptions-item>
      <el-descriptions-item label="父级节点">
        <el-cascader :key="cascaderIndex" v-model="localFormula.SUPERCODE" :options="salaryTypeTreeListUpdate" :props="props" filterable clearable>
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.options.length }}) </span>
          </template>
        </el-cascader>
      </el-descriptions-item>
      <el-descriptions-item label="是否锁定">
        <el-tag v-if="localFormula.ISLOCK !== '0'" type="info">锁定</el-tag>
        <el-tag v-else type="success">未锁定</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="备注" span="2">
        <el-input v-model="localFormula.REMARK" type="textarea" :readonly="false" :style="{'width':'800px'}" />
      </el-descriptions-item>
    </el-descriptions>
    <!-- 其它信息模块 -->
    <el-divider />
    <!-- 显示模块 -->
    <tagshow :content="standFormula" :result="localFormula.TNAME" />
    <div class="inputFormular">
      主公式:
      <!-- 输入模块(输入这里要增加智能搜索模块,智能提示需要的输入) -->
      <el-autocomplete
        ref="input"
        v-model="formularContent"
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
    <div :style="{'line-height':'2'}">条件公式:</div>
    <el-table
      :data="formularSlv"
      style="width: 100%"
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
          {{ scope.row.FORMULARCONTENT }}
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
    <el-dialog
      title="条件公式"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="1200px"
    >
      <el-form
        label-position="left"
        label-width="100px"
        :model="currentSlvFormular"
      >
        <el-form-item label="人员性质">
          <el-select v-model="naturalChoice" multiple placeholder="请选择">
            <el-option
              v-for="item in naturalList"
              :key="item.Code"
              :label="item.Label"
              :value="item.Code.toString()"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间范围" :style="{'width':'400px'}">
          <el-col :span="11">
            <el-form-item prop="HOSTIMEBMONTH">
              <el-date-picker v-model="currentSlvFormular.HOSTIMEBMONTH" type="month" placeholder="开始时间" style="width: 100%;" clearble />
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-date-picker v-model="currentSlvFormular.HOSTIMEEMONTH" type="month" placeholder="结束时间" style="width: 100%;" clearble />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="主计算公式">
          <tagshow :content="standFormula" :result="localFormula.TNAME" />
        </el-form-item>
        <el-form-item label="子计算公式">
          <tagshow :content="slvStandFormula" :result="localFormula.TNAME" />
          <el-autocomplete
            ref="subInput"
            v-model="subFormularContent"
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
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="subSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tagshow } from './components'
import { splictStringByOperator, getLastStrByOperator } from '@/utils/stringAdvanced'
import { debounce } from '@/utils/index'
import { getTreeList, getGridList, localAdd, localUpdate, getSalaryTypeList as getSalaryCateDict } from '@/api/salaryType'
import { getGridList as getFormularSlv, localAdd as subAdd, localUpdate as subUpdate, localDelete as subDelete } from '@/api/formularSlv'
import { getNatureList } from '@/api/enum'
export default {
  name: 'FormularDetail',
  components: {
    tagshow
  },
  filters: {
    timeFormatS: function(value) {
      if (!value) {
        return '-∞'
      } else {
        return value
      }
    },
    timeFormatE: function(value) {
      if (!value) {
        return '+∞'
      } else {
        return value
      }
    },
    lockFormat: function(value) {
      var temp = value.toString()
      if (temp === '0') {
        return '未锁定'
      } else if (temp === '1') {
        return '锁定'
      } else {
        return '未定义'
      }
    }
  },
  data: function() {
    return {
      formularContent: '', // 存储的是字符串的形式
      formularSlv: [],
      loading: false,
      currentSlvFormular: {},
      dialogVisible: false,
      naturalList: [], // 人员性质表
      naturalChoice: [],
      subFormularContent: '',
      dialogType: '',
      rawID: '',
      cascaderIndex: 0, // 用于解决级联选择器重新渲染时的报错问题
      salaryTypeDict: [], // 用于公式自动补全框中的输入提示
      slaryCateDict: [], // 存储工资类别,包括工资,奖金,福利,社保缴费等
      searchDebounce: debounce(this.querySearchRemote, 500),
      rawTemp: '',
      salaryTypeTreeList: [],
      salaryTypeTreeListUpdate: [],
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
      }
    }
  },
  computed: {
    standFormula: function() {
      return splictStringByOperator(this.formularContent, this.salaryTypeDict) // 前台存储的字符串转换为展示用的字符串
    },
    slvStandFormula: function() {
      var items = splictStringByOperator(this.subFormularContent, this.salaryTypeDict)
      return items
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
    if (this.formula) {
      this.pageInitial()
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
    if (this.formula) {
      if (this.rawID !== this.formula.AUTOID) {
        this.pageInitial()
      }
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
    pageInitial() {
      const type = this.$route.query.type
      this.localFormula = Object.assign({}, this.formula)
      this.getSalaryCateDict().then(() => {
        this.getSalaryTypeTreeList(this.localFormula.DCODE)
      })
      this.getSalaryTypeList()
      this.getNatureList().then(() => {
        if (type === 'edit') {
          this.getFormularSlv()
        }
      })
      this.rawID = this.formula.AUTOID
    },
    convertToUploadFormula(type, standFormula) {
      // console.log(standFormula)
      let i = 0
      let str = ''
      let temp = ''
      for (i = 0; i < standFormula?.length; i++) {
        if (standFormula[i].type === 'undefined') {
          this.$message({
            type: 'error',
            message: '当前公式中存在错误,请检查修正后重新保存'
          })
          return
        }
        if (standFormula[i].type === 'element') {
          temp = '[' + standFormula[i].code.replace('T', '') + ']'
        } else {
          temp = standFormula[i].code
        }
        str += temp
      }
      return str
    },
    save() { // 父级页面传递进来的时候,是值,选择的时候是数组
      const type = this.$route.query.type
      this.localFormula.FORMULA = this.convertToUploadFormula(type, this.standFormula)
      // console.log(this.localFormula.SUPERCODE)
      if (this.localFormula.SUPERCODE !== null && this.localFormula.SUPERCODE !== undefined && this.localFormula.SUPERCODE.length > 0) {
        if (Array.isArray(this.localFormula.SUPERCODE)) {
          this.localFormula.SUPERCODE = this.localFormula.SUPERCODE[this.localFormula.SUPERCODE.length - 1]
        }
      } else {
        this.localFormula.SUPERCODE = ''
      }
      // console.log(this.localFormula)
      if (type === 'edit') {
        localUpdate(this.localFormula).then(res => {
          this.$message({
            message: '薪资更新成功!',
            type: 'success'
          })
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/formula/index')
        })
      } else if (type === 'new') {
        var params = {
          'dcode': this.localFormula.DCODE,
          'dname': this.localFormula.DNAME,
          'tname': this.localFormula.TNAME,
          'begindate': this.localFormula.BEGINDATE.format('yyyy-MM-dd hh:mm:ss'),
          'enddate': this.localFormula.ENDDATE.format('yyyy-MM-dd hh:mm:ss'),
          'remark': this.localFormula.REMARK,
          'supercode': this.localFormula.SUPERCODE
        }
        localAdd(params).then(res => {
          this.$message({
            message: '薪资新增成功',
            type: 'success'
          })
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.replace('/formula/index')
        })
      }
    },
    async getSalaryTypeTreeList(DCODE) { // 获取树状薪酬类型,用于指定父级节点
      var param = {
        monthNo: this.monthNo
      }
      await getTreeList(param).then(res => {
        this.salaryTypeTreeList = res.data
        this.salaryTypeTreeListUpdate = this.salaryTypeTreeList.filter(el => el.Attribute.toString() === DCODE.toString())
      })
    },
    async getSalaryCateDict() { // 获取最基础的四个薪酬类型,即获取dcode
      getSalaryCateDict().then(res => {
        this.slaryCateDict = res.data
      })
    },
    async getSalaryTypeList() { // 获取用于自动补全所使用的薪酬类型字典
      var param = {
        monthNo: this.monthNo
      }
      getGridList(param).then(res => {
        this.salaryTypeDict = res.data
        this.formulaInitial()
      })
    },
    async getNatureList() { // 获取人员性质
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
      getFormularSlv(params).then(res => {
        this.formularSlv = res.data
        for (var i = 0; i < res.data.length; i++) {
          var array = this.formularSlv[i].KINDCODELIST.split(',')// 获取当前自子公式适用的人员性质
          var label = ''
          for (var j = 0; j < array.length; j++) {
            var item = this.naturalList.find(element => element.Code.toString() === array[j])
            // console.log(item)
            label += item.Label + ','
          }
          this.formularSlv[i].NATURALLABEL = label
          var splitarr = splictStringByOperator(this.formularSlv[i].FORMULA, this.salaryTypeDict)
          let str = ''
          for (let i = 0; i < splitarr?.length; i++) {
            str += splitarr[i].element
          }
          this.formularSlv[i].FORMULARCONTENT = str
          console.log(this.formularSlv)
        }
      })
    },
    updateDCODE(value) { // 选择薪酬类别名称的时候,自动更新薪酬类别代码
      this.cascaderIndex++ // 用于解决vue自身渲染的问题
      if (value === null || value === undefined) {
        this.salaryTypeTreeListUpdate = this.salaryTypeTreeList
      } else {
        var temp = this.slaryCateDict.find(element => element.DNAME === value)
        this.localFormula.DCODE = temp.DCODE
        this.localFormula.SUPERCODE = null
        // console.log(this.salaryTypeTreeList)
        var temp2 = this.salaryTypeTreeList.filter(el => el.Attribute.toString() === temp.DCODE.toString())
        this.salaryTypeTreeListUpdate = temp2 ?? []
      }
    },
    formulaInitial() { // 将数据库存储的字符串形式的公式转换为前端的形式
      if (this.localFormula.FORMULA) {
        var temp = this.localFormula.FORMULA
        const splitarr = splictStringByOperator(temp, this.salaryTypeDict) // 数据库存储的转换为前台存储的字符串
        let str = ''
        for (let i = 0; i < splitarr?.length; i++) {
          str += splitarr[i].element
        }
        this.formularContent = str
      }
    },
    queryAsync(rawString, cb) { // 返回自动补全中的待候选列表
      var queryString = getLastStrByOperator(rawString)
      if (!queryString) {
        cb([])
      } else {
        this.rawTemp = rawString
        return this.searchDebounce(queryString, cb)
      }
    },
    async querySearchRemote(queryString, cb) { // 该函数会在用户每次input时调用
      var result = queryString ? this.salaryTypeDict.filter(state => state.TCODE.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || state.TNAME.indexOf(queryString) === 0) : this.salaryTypeDict
      cb(result)
    },
    autoFixInput(item) { // el-input中的下拉框发生点击事件之时,已经将input中的内容更新成了item中的内容
      // console.log('this is test')
      let index = 0
      index = this.rawTemp.search(/[\/\+\-\*%()\\=][\u4e00-\u9fa5\w]*$/) // 匹配中文字母数字下划线
      // console.log(index)
      if (this.dialogVisible) {
        this.subFormularContent = this.rawTemp.slice(0, index + 1) + item.TNAME
        this.$refs.subInput.focus()
      } else {
        this.formularContent = this.rawTemp.slice(0, index + 1) + item.TNAME
        this.$refs.input.focus()
      }
    },
    handleSubEdit(scope) {
      // console.log(scope)
      this.currentSlvFormular = Object.assign({}, scope.row)
      this.subFormularContent = this.currentSlvFormular.FORMULARCONTENT
      this.naturalChoice = this.currentSlvFormular.KINDCODELIST.split(',')
      this.dialogType = 'edit'
      this.dialogVisible = true
    },
    handleSubDelete(scope) {
      // console.log(`删除当前${scope}`)
      // console.log(scope.row)
      var AUTOID = scope.row.AUTOID
      var params = {
        AUTOID: AUTOID
      }
      this.$confirm('确认删除当前子公式?(此操作无法撤销!!!)', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        subDelete(params).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getFormularSlv()
        })
      }).catch(() => {})
    },
    handleSubAdd() {
      this.currentSlvFormular = Object.assign({}, {
        'AUTOID': 0,
        'TCODE': this.formula.TCODE,
        'KINDCODELIST': '',
        'HOSTIMEBMONTH': '',
        'HOSTIMEEMONTH': '',
        'FORMULA': '',
        'BEGINDATE': this.formula.BEGINDATE,
        'ENDDATE': this.formula.ENDDATE
      })
      this.naturalChoice = ''
      this.subFormularContent = ''
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    subSave() {
      // console.log('subSave')
      function timeToMonth(str) {
        if (str) {
          var time = new Date(str)
          return time.getFullYear() + '-' + (time.getMonth() + 1).toString().padStart('2', '0')
        } else {
          return ''
        }
      }
      this.currentSlvFormular.FORMULA = this.convertToUploadFormula(this.dialogType, this.slvStandFormula)
      this.currentSlvFormular.HOSTIMEBMONTH = timeToMonth(this.currentSlvFormular.HOSTIMEBMONTH)
      this.currentSlvFormular.HOSTIMEEMONTH = timeToMonth(this.currentSlvFormular.HOSTIMEEMONTH)
      this.currentSlvFormular.KINDCODELIST = this.naturalChoice.toString()
      // console.log(this.currentSlvFormular)
      var fun
      var message
      if (this.dialogType === 'new') {
        fun = subAdd
        message = '子公式新增成功'
      } else if (this.dialogType === 'edit') {
        fun = subUpdate
        message = '子公式更新成功'
      }
      this.currentSlvFormular.autoid = this.currentSlvFormular.AUTOID
      fun(this.currentSlvFormular).then(res => {
        // console.log(res)
        this.getFormularSlv()
        this.$message({
          type: 'success',
          message: message
        })
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .inputFormular{
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 2;
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
  .must{
    color: red;
  }
</style>
