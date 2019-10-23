<template>
  <div class="home-container">
    <h1 class="title">欢迎使用财务SaaS系统</h1>
    <img src="../assets/images/home.png" class="img-home"/>
    <div class="footer-home">
      <p class="desc">如果要获得最佳的产品用户体验，建议您使用1920*1080分辨率的显示器操作</p>
      <p class="desc">上海餐易通科技有限公司 沪ICP备18046026号-1 版权所有 2019</p>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.home-container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
  .title {
    font-size: 60px;
    line-height: 84px;
    font-weight: 600;
    margin-top: 27.0vh;
  }
  .img-home {
    width: 375px;
    margin-top: 11.3vh;
  }
  .footer-home {
    position: absolute;
    left: 0;
    right: 0px;
    bottom: 40px;
    font-size: 14px;
    color: rgba(51, 51, 51, .6);
    line-height: 20px;
    text-align: center;
  }
}
</style>
