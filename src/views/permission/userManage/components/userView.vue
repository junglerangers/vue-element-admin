<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'创建用户'">
      <el-form :model="CurrentUser" label-width="80px" label-position="left">
        <el-form-item label="工号">
          <el-input v-model="CurrentUser.key" placeholder="工号" maxlength="10" style="width:250px" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="CurrentUser.name" placeholder="姓名" style="width:250px" />
        </el-form-item>
        <el-form-item label="科室">
          <el-select v-model="CurrentUser.dep" filterable placeholder="请选择">
            <el-option
              v-for="item in depList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="CurrentUser.type" placeholder="请选择">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-switch
            v-model="CurrentUser.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="停用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="CurrentUser.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="备注信息"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
