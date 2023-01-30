
<template>
  <div class="wscn-http401-container">
    <div class="wscn-http401">
      <div class="pic-401">
        <img class="pic-401__parent" src="@/assets/401_images/401.png" > 
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">
          401错误
        </div>
        <div class="bullshit__headline">
          {{ message }}
        </div>
        <div class="bullshit__info">
          对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面
        </div>
        <router-link to="/" class="bullshit__return-home">
          返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Page401',
  computed: {
    message() {
      return '您没有访问权限！'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http401-container{
  transform: translate(-50%,-50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http401 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  .pic-401 {
    position: relative;
    float: left;
    width: 600px;
    overflow: hidden; 
  }
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 30px 0;
    overflow: hidden; 
    .bullshit__oops {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
      color: #1482f0;
      opacity: 0;
      margin-bottom: 20px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    .bullshit__headline {
      font-size: 20px;
      line-height: 24px;
      color: #222;
      font-weight: bold;
      opacity: 0;
      margin-bottom: 10px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.1s;
      animation-fill-mode: forwards;
    }
    .bullshit__info {
      font-size: 13px;
      line-height: 21px;
      color: grey;
      opacity: 0;
      margin-bottom: 30px;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.2s;
      animation-fill-mode: forwards;
    }
    .bullshit__return-home {
      display: block;
      float: left;
      width: 110px;
      height: 36px;
      background: #1482f0;
      border-radius: 100px;
      text-align: center;
      color: #ffffff;
      opacity: 0;
      font-size: 14px;
      line-height: 36px;
      cursor: pointer;
      animation-name: slideUp;
      animation-duration: 0.5s;
      animation-delay: 0.3s;
      animation-fill-mode: forwards;
    }
    @keyframes slideUp {
      0% {
        transform: translateY(60px);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
}
</style>

