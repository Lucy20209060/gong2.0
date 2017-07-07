<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.el-dialog--small {
    width: 500px ! important;
}
#classify-page-wrap .el-pager li {
    min-width:40px;
    height: 40px;
    line-height: 40px;
}
#classify-page-wrap .el-pagination button,#classify-page-wrap .el-pagination span{
    min-width: 40px;
    height: 40px;
    line-height: 40px;
}
.details-imgs-wrap p{
  line-height: 0;
}
.w-order-detail .el-tabs__item{
  height: 32px;
  line-height: 26px;
  color:#333;
}
.w-order-detail .waitfill .el-tab-pane{
  border: 0;
}
.w-order-detail .el-tabs__header{
  /*display: inline-block;*/
  border-bottom: 0;
  margin: 0 0 30px;
}
.w-order-detail .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    /*border: 1px solid #d8d8d8;*/
    border-bottom-color: #fff;
    border-radius: 4px 4px 0 0;
}
.upload .el-icon-close{
  position: absolute;
  top: 6px;
  right: 10px;
}
.batchList-list .el-select .el-input__inner{
    padding:0;
}
.batchList-list .el-input__inner{
    text-align: center;
    border-radius: 0;
    border-right: 1px solid transparent;
}
.el-select:nth-child(3) .el-input__inner{
    border-right: 1px solid rgb(191, 217, 206);
}
.batchList-list .el-select .el-icon-caret-top{
    display: none;
}
</style>
