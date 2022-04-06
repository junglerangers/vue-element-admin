<template>
  <div class="app-container">
    薪酬公式管理
    <!-- 显示所有的薪酬公式和计算信息,可以跳转到编辑界面 -->
    <el-table
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
      />
      <el-table-column
        prop="address"
        label="地址"
      />
    </el-table>
  </div>
</template>
