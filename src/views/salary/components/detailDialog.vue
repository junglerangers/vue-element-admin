<template>
  <el-dialog :visible.sync="localDialogVisible" :before-close="handleClose" width="1200px">
    <el-descriptions class="margin-top" title="人员详细信息" :column="4" size="mini" border>
      <el-descriptions-item label="工号">{{ localUser.mst[0].ENUM }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ localUser.mst[0].ENAME }}</el-descriptions-item>
      <el-descriptions-item label="科室编码">{{ localUser.mst[0].DEPT_CODE }}</el-descriptions-item>
      <el-descriptions-item label="科室名称">{{ localUser.mst[0].DEPT_NAME }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ localUser.mst[0].SEX_NAME }}</el-descriptions-item>
      <el-descriptions-item label="身份证号" span="2">{{ localUser.mst[0].ID_CARD }}</el-descriptions-item>
      <el-descriptions-item label="院区">{{ localUser.mst[0].HOSAREANAME }}</el-descriptions-item>
      <el-descriptions-item label="人员性质">{{ localUser.mst[0].KIND_NAME }}</el-descriptions-item>
      <el-descriptions-item label="人员类型">{{ localUser.mst[0].EMP_CLASSNAME }}</el-descriptions-item>
      <el-descriptions-item span="2" />
      <el-descriptions-item v-for="item in localUser.slvList" :key="item.AUTOID" :label="item.TNAME">
        <el-input v-model="item.AMOUNT" />
      </el-descriptions-item>
    </el-descriptions>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="toggleDialogVisible">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { UpdateSlv } from '@/api/salary'

export default {
  name: 'DetailDialog',
  props: {
    currentUser: {
      type: Object,
      default: function() {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    dict: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data: function() {
    return {
      test: ''
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
    localUser: function() {
      var data = Object.assign(this.currentUser)
      console.log(this.dict)
      var slvList = data.slvList
      var i = 0
      var temp = ''
      for (i = 0; i < slvList.length; i++) {
        temp = this.dict.find(element => element.TCODE === slvList[i].TCODE)
        console.log(temp + slvList[i].TCODE)
        if (temp === undefined) {
          this.$message({
            message: '存在未发生对照的薪资代码,代码值为' + slvList[i].TCODE,
            type: 'warning'
          })
        } else {
          slvList[i].TNAME = temp.TNAME
        }
      }
      console.log(data)
      return data
    }
  },
  methods: {
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
    save() {
      var params = {
        mst: {
          mstid: this.localUser.mst[0].MSTID,
          enum: this.localUser.mst[0].ENUM,
          ename: this.localUser.mst[0].ENAME
        },
        slvList: this.localUser.slvList
      }
      console.log(params)
      UpdateSlv(params).then(res => {
        console.log('更新成功')
      })
    }
  }
}
</script>
