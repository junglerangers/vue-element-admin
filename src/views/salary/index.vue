<template>
  <div>
    薪酬管理(薪酬总览页面)
    <!-- 显示所有的薪酬公式和计算信息,每一期为一条信息 -->
  </div>
</template>

<style lang="scss">
.footer{
  position: fixed;
  bottom: 0;
  /* width: 100%; */
  /* line-height: var(--footer-height); */
  background: #304156;
  text-align: center;
  transition: all 0.8s;
  /* color: #fff; */
}
.table{
  margin-bottom: 30px;
  margin-top: 30px;
}
.myinput{
  position:absolute;
  opacity: 0;
  top:0;
  left: 0;
  height: 100%;
  width:100%;
}
.el-dialog{
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position:absolute;
  top:50%;
  left:50%;
   width: fit-content;
  transform: translate(-50%,-50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
}
.el-dialog .el-dialog__body{
  flex:1;
  overflow:auto;
}
.margin20{
  margin: 0 20px;
}
.tableCellClass{
  padding: 0px!important;
}
</style>
