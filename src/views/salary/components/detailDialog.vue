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
    <el-form class="flex">
      <form-item :form-list="slvList" :level="0" @update="updateSlv" />
    </el-form>
  </el-dialog>
</template>

<script>
import { UpdateSlv } from '@/api/salary'
import { initialDict } from '@/utils/stringAdvanced'
import FormItem from './formItem.vue'
// import Decimal from 'decimal.js'

export default {
  name: 'DetailDialog',
  components: {
    FormItem
  },
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
      uploadSign: true,
      slvList: []
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
    }
  },
  watch: {
    currentUser: function(newValue, oldValue) {
      var slvList = newValue.slvList
      initialDict(slvList, slvList)
      this.slvList = slvList
    }
  },
  created: function() {
  },
  methods: {
    test() {
      var slvList = this.currentUser.slvList
      initialDict(slvList, slvList)
      this.slvList = slvList
      console.log(slvList)
      return slvList
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
    updateSlv() {
      this.initialSlv(this.slvList)
      initialDict(this.slvList, this.slvList)
    },
    initialSlv(list) {
      for (var i = 0; i < list?.length; i++) {
        list[i].sign = false
        if (list[i].ChilList) {
          this.initialSlv(list[i].ChilList)
        }
      }
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
      var slvList = this.slvList
      this.addUpList(result, slvList)
      return result
    },
    addUpList(result, list) {
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        result.slvList.push({
          'autoid': item.AUTOID,
          'mstid': this.currentUser.mst.MSTID,
          'enum': this.currentUser.mst.ENUM,
          'ename': this.currentUser.mst.ENAME,
          'tcode': item.TCODE,
          'amount': item.AMOUNT
        })
        if (list[i].ChilList) {
          this.addUpList(result, list[i].ChilList)
        }
      }
    },
    async save() {
      var params = this.uploadList()
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
.flex{
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 1200px;
}
</style>
