<template>
  <Layout style="height: 100%" class="main">
    <Header class="header-con">
      <header-bar :userName="userName" :rootEnterpriseName="rootEnterpriseName">
        <!-- <div class="header-icon-notice">
          <Badge dot class-name="header-badge">
            <common-icon type="md-notifications" :size="16" color="#fff"/>
          </Badge>
          <common-icon type="md-help-circle" :size="16" color="#fff"/>
        </div> -->
      </header-bar>
    </Header>
    <Layout class="layout-container">
      <Sider  hide-trigger collapsible :width="160" :collapsed-width="50" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-coll-change="onColChange" @on-select="turnToPage" :menu-list="menuList">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <div class="logo-con" v-show="!collapsed">应用</div>
          <div class="logo-con" v-show="collapsed">
            <common-icon type="_app" :size="16" />
          </div>
        </side-menu>
      </Sider>
      <Content class="main-content-con" >
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <div class="box-container">
              <router-view/>
              <!-- 消息弹框 -->
              <Modal
                :closable="false"
                :transfer="confirm.transfer"
                :mask-closable="false"
                v-model="confirm.visible"
                @on-visible-change="doShowConfirmModal"
                class-name="title-modal">
                <p slot="header" style="text-align:left">
                  <common-icon type="_guide" class="guide"></common-icon>
                  <span>{{ confirm.title }}</span>
                </p>
                <p>
                  <span>{{ confirm.message }}</span>
                </p>
                <div slot="footer">
                  <div v-if="confirm.type === 'control'">
                    <Button type="primary" @click="confirm.yes">{{ confirm.button[0] }}</Button>
                    <Button @click="confirm.no">{{ confirm.button[1] }}</Button>
                    <Button @click="confirm.cancel">{{ confirm.button[2] }}</Button>
                  </div>
                  <div v-else>
                    <Button type="primary" @click="confirm.yes">{{ confirm.button[0] }}</Button>
                    <Button @click="confirm.cancel">{{ confirm.button[1] }}</Button>
                  </div>
                </div>
              </Modal>
            </div>
            <ABackTop :height="100" :bottom="40" :right="40" container=".box-container"></ABackTop>
          </Content>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import { local } from '@/libs/location'
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import ABackTop from './components/a-back-top'
import CommonIcon from '_c/common-icon'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    ABackTop,
    CommonIcon
  },
  data () {
    return {
      collapsed: false
    }
  },
  computed: {
    ...mapState({
      routes: state => state.user.routes
    }),
    userName () {
      return this.$store.state.user.userName
    },
    tagRouter () {
      return this.$store.state.user.tagRouter
    },
    rootEnterpriseName () {
      return this.$store.state.user.rootEnterpriseName
    },
    menuList () {
      return this.$store.getters.menuList
    },
    tagNavList () {
      return this.$store.state.user.tagNavList
    },
    skin () {
      return this.$store.state.user.skin
    },
    // 返回confirm信息
    confirm () {
      return this.$store.state.app.confirm
    }
  },
  methods: {
    doShowConfirmModal (type) {
      this.confirm.close()
    },
    ...mapMutations([
      'setBreadCrumb',
      'setIsShowEditModal'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    onColChange (state) {
      this.collapsed = state
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute)
      this.$refs.sideMenu.updateOpenName(newRoute.name)
    },
    skin: {
      handler (val, oldval) {
        this.$nextTick(() => {
          // body根节点下面的颜色覆盖
          let allPopperClassList = document.querySelectorAll('.ivu-poptip-popper')
          let allDropClassList = document.querySelectorAll('.ivu-dropdown-menu')
          let allTransferDomList = document.querySelectorAll('.v-transfer-dom')
          let allMenuTitleList = document.querySelectorAll('.menu-title')
          for (let name of allPopperClassList) {
            if (oldval) {
              name.classList.remove(oldval)
            }
            name.classList.add(local.getItem('skin'))
          }
          for (let name of allDropClassList) {
            if (oldval) {
              name.classList.remove(oldval)
            }
            name.classList.add(local.getItem('skin'))
          }
          for (let name of allTransferDomList) {
            if (oldval) {
              name.classList.remove(oldval)
            }
            name.classList.add(local.getItem('skin'))
          }
          for (let name of allMenuTitleList) {
            if (oldval) {
              name.classList.remove(oldval)
            }
            name.classList.add(local.getItem('skin'))
          }
          // app 入口文件内的颜色覆盖
          if (val) document.getElementById('app').classList.add(val)
          if (oldval) {
            document.getElementById('app').classList.remove(oldval)
          }
          document.getElementById('app').classList.add(local.getItem('skin'))
        })
      },
      immediate: true
    }
  },
  mounted () {
    // 如果local里面有已选皮肤，则使用
    if (local.getItem('skin')) {
      this.$store.commit('setSkin', local.getItem('skin'))
    }
    this.setBreadCrumb(this.$route)
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.homeName
      })
    }
  }
}
</script>
<style lang="less">
@import './main.less';
// 信息提示
.title-modal{
  position: absolute;
  .ivu-modal{
    position: absolute;
    width: 480px !important;
    height: 200px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .ivu-modal-header{
      border: none;
      padding: 30px 0 0 30px;
      svg.iconfont.guide{
        font-size: 16px !important;
        color: #FA790E;
        position: absolute;
      }
      span{
        font-size: 16px;
        color: #333333;
        margin-left: 22px;
      }
    }
    .ivu-modal-body{
      font-size: 14px;
      color: #333333;
      opacity: 0.85;
      padding: 20px 0 40px 50px
    }
    .ivu-modal-footer{
      border: none;
      padding:0 30px 30px 18px;
      button {
        min-width: 60px;
      }
    }
  }
}
</style>
