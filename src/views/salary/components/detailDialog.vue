<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="localDialogVisible"
    :before-close="handleClose"
    width="1200px"
    element-loading-text="数据拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-descriptions
      class="margin-top"
      title="人员详细信息"
      :column="4"
      size="mini"
      border
    >
      <el-descriptions-item label="工号">{{ currentUser.mst.ENUM }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ currentUser.mst.ENAME }}</el-descriptions-item>
      <el-descriptions-item label="科室编码">{{ currentUser.mst.DEPT_CODE }}</el-descriptions-item>
      <el-descriptions-item label="科室名称">{{ currentUser.mst.DEPT_NAME }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ currentUser.mst.SEX_NAME }}</el-descriptions-item>
      <el-descriptions-item label="身份证号" span="2">{{ currentUser.mst.ID_CARD }}</el-descriptions-item>
      <el-descriptions-item label="院区"><el-tag>{{ currentUser.mst.HOSAREANAME }}</el-tag></el-descriptions-item>
      <el-descriptions-item label="人员性质">{{ currentUser.mst.KIND_NAME }}</el-descriptions-item>
      <el-descriptions-item label="人员类型">{{ currentUser.mst.EMP_CLASSNAME }}</el-descriptions-item>
      <el-descriptions-item span="2" />
    </el-descriptions>
    <div class="title">
      金额详细信息
      <span slot="footer" class="right">
        <el-button type="primary" @click="save">保 存</el-button>
        <el-button @click="toggleDialogVisible">关 闭</el-button>
      </span>
    </div>
    <div class="dynamic-salary">
      <el-button type="primary" @click="test">test</el-button>
      <!-- <el-descriptions v-for="(list,i) in currentUser.slvList" :key="list.TCODE" border :column="1" class="salary">
        <el-descriptions-item :label="list.TNAME"><el-input v-model="summarySalary[i].value" :disabled="summarySalary[i].readonly" /></el-descriptions-item>
        <el-descriptions-item>
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="item in list.ChilList" :key="item.TCODE" :label="item.TNAME">
              <el-input v-model="item.AMOUNT" :name="item.TCODE" @input="updateSalary" />
            </el-descriptions-item>
          </el-descriptions>
        </el-descriptions-item>
      </el-descriptions> -->
    </div>
  </el-dialog>
</template>

<script>
import { UpdateSlv } from '@/api/salary'
import { initialDict } from '@/utils/stringAdvanced'
// import Decimal from 'decimal.js'

export default {
  name: 'DetailDialog',
  props: {
    currentUser: {
      type: Object,
      default: function() {
        return {
          slvList: [],
          mst: {}
        }
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data: function() {
    return {
      loading: false,
      uploadSign: true
    }
  },
  computed: {
    localDialogVisible: {
      get: function() {
        return this.dialogVisible
      },
      set: function(v) {
        this.toggleDialogVisible()
      }
    },
    summarySalary: function() {
      return 0
    }
  },
  created: function() {
  },
  methods: {
    test() {
      var slvList = this.currentUser.slvList
      initialDict(slvList, slvList)
      console.log(slvList)
      return slvList
    },
    addList(result, list) {
      if (!list) {
        return
      } else {
        var i = 0
        for (i = 0; i < list.length; i++) {
          result.push({
            'autoid': list[i].AUTOID,
            'mstid': this.currentUser.mst.MSTID,
            'enum': this.currentUser.mst.ENUM,
            'ename': this.currentUser.mst.ENAME,
            'tcode': list[i].TCODE,
            'amount': this.summarySalary[i].value
          })
        }
        this.addList(result, list.ChilList)
      }
    },
    toggleDialogVisible() {
      this.$emit('toggleVisible')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    updateSalary(e) {
      // console.log(e)
      // var name = e.target.getAttribute('name')
      // console.log(name)
    },
    uploadList() {
      var result = {
        mst: {
          mstid: this.currentUser.mst.MSTID,
          enum: this.currentUser.mst.ENUM,
          ename: this.currentUser.mst.ENAME
        },
        slvList: []
      }
      var slvList = this.currentUser.slvList
      var i = 0; var j = 0
      for (i = 0; i < slvList.length; i++) {
        result.slvList.push({
          'autoid': slvList[i].AUTOID,
          'mstid': this.currentUser.mst.MSTID,
          'enum': this.currentUser.mst.ENUM,
          'ename': this.currentUser.mst.ENAME,
          'tcode': slvList[i].TCODE,
          'amount': this.summarySalary[i].value
        })
        for (j = 0; j < slvList[i].ChilList?.length; j++) {
          var temp = slvList[i].ChilList[j]
          result.slvList.push({
            'autoid': temp.AUTOID,
            'mstid': this.currentUser.mst.MSTID,
            'enum': this.currentUser.mst.ENUM,
            'ename': this.currentUser.mst.ENAME,
            'tcode': temp.TCODE,
            'amount': temp.AMOUNT
          })
        }
      }
      return result
    },
    async save() {
      var params = this.uploadList()
      console.log(params)
      this.loading = true
      await UpdateSlv(params).then(res => {
        this.$message({
          message: '数据更新成功!',
          type: 'success'
        })
        this.toggleDialogVisible()
        this.$emit('update')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style style="scss" scoped>
.dynamic-salary{
  display: flex;
  flex-direction: row;
}
.column{
  display: flex;
  flex-direction: column;
}
.salary{
  margin-right: 20px;
}
.title{
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin: 20px 0 20px 0;
}
.right{
  position: absolute;
  right: 20px;
}
</style>
