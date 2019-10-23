<template>
  <transition name="fade" mode="out-in" appear>
    <section class="welcome-container">
      <div class="welcome-content">
        <p class="welcome-title">欢迎登录餐易通财务SAAS系统</p>
        <div class="welcome-loading">
          <div class="linear-background"><span class="circle"></span></div>
        </div>
        <p class="welcome-loading-text table-span">数据加载中...</p>
      </div>
    </section>
  </transition>
</template>

<script>
import { local, session } from '@/libs/location'
export default {
  name: 'welcome',
  computed: {
    skin () {
      return this.$store.state.user.skin
    }
  },
  watch: {
    skin (val, oldval) {
      // app 入口文件内的颜色覆盖
      document.getElementById('app').classList.add(val)
      if (oldval) {
        document.getElementById('app').classList.remove(oldval)
      }
      document.getElementById('app').classList.add(local.getItem('skin'))
    }
  },
  created () {
    this.doGetInitStatus()
  },
  mounted () {
    // 如果local里面有已选皮肤，则使用
    if (local.getItem('skin')) {
      this.$store.commit('setSkin', local.getItem('skin'))
    }
    session.setItem('welcome', 'first')
  },
  methods: {
    doGetInitStatus () {
      this.$request.post('/financeback/sysInitData/findSysInitData').then(res => {
        const { code, data } = res.data
        if (code === 200) {
          if (data.status === 0) {
            this.doGetInit()
          } else {
            setTimeout(() => {
              this.$router.push({ name: 'home' })
            }, 2000)
          }
          console.log('初始化数据状态')
        }
      })
    },
    doGetInit () {
      this.$request.post('/financeback/sysInitData/init').then(res => {
        const { code, data } = res.data
        if (code === 200) {
          if (data.status === 1) {
            setTimeout(() => {
              this.$router.push({ name: 'home' })
            }, 2000)
          } else {
            this.$Message.warning('初始化数据失败！')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/css/base.less';
.welcome-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #091019;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1009;
  .welcome-content {
    text-align: center;
    .welcome-title {
      font-size: 34px;
      color: #ffffff;
      margin-bottom: 50px;
    }
    .welcome-loading {
      height: 30px;
      width: 400px;
      border-radius: 18px;
      padding: 2px 0;
      overflow: hidden;
      margin: auto;
      .linear-background {
        height: 24px;
        animation: changeBgColor 2.04s ease-in-out infinite;
        // animation: changeBgColor 2.04s ease-in-out infinite alternate;
      }
      .circle{
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        animation: changePosition 2.04s ease-in-out infinite;
      }
    }
    .welcome-loading-text {
      margin-top: 16px;
      text-align: center;
    }
  }
  @keyframes changeBgColor{
    0%{
      width: 10px;
    }
    100%{
      width: 386px;
    }
  }
  @keyframes changePosition{
    0%{
      margin-left: 0;
    }
    100%{
      margin-left: 374px;
    }
  }
}
</style>
