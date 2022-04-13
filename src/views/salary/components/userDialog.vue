<template>
  <div>
    <el-button @click="togglevisible">test</el-button>
    <el-dialog :visible.sync="visible">
      <div class="userdialog-container">
        <div class="header">
          个人收入明细
        </div>
        <div class="flex-column">
          <el-descriptions class="margin-top" title="工资" :column="1" size="small">
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user" />
                工资一
              </template>
              kooriookami
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone" />
                工资二
              </template>
              18100000000
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline" />
                工资三
              </template>
              苏州市
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets" />
                工资四
              </template>
              <el-tag size="small">学校</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building" />
                工资五十
              </template>
              江苏省
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="flex-column">
          <div>2</div>
          <div>2</div>
          <div>2</div>
          <div>2</div>
        </div>
        <div class="flex-column">
          <div>3</div>
          <div>3</div>
          <div>3</div>
          <div>3</div>
        </div>
        <div class="header">
          123
        </div>
        <div class="header">
          1223
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    }
  },
  methods: {
    togglevisible() {
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="scss" scoped>
.userdialog-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .flex-column{
        display: flex;
        flex-flow: column wrap;
        align-content: center;
        width:33%
    }
    .header{
        flex-basis: 100%;
    }
}
</style>
