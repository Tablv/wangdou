<template>
  <div class="header-bar">
    <router-link :to="{name: 'home'}" tag="div" class="header-logo">
      <common-icon type="_logo" :size="120" style="margin-top: -20px;"></common-icon>
    </router-link>
    <div class="header-bar-container">
      <div class="custom-content-con">
        <slot></slot>
        <div class="user-avator-dropdown">
          <Dropdown transfer @on-click="handleUserClick">
            <p class="username">{{ userName }} <common-icon type="md-arrow-dropdown"></common-icon></p>
            <DropdownMenu slot="list">
              <DropdownItem name="loginOut">退出系统</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <p class="root-enterprise-name">{{ rootEnterpriseName }}</p>
      </div>
      <div class="header-tags-nav">
        <div class="tag-nav-wrapper">
          <tags-nav :value="$route" @input="handleClick" :list="tagNavList" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './header-bar.less'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getNewTagList } from '@/libs/util'
import { session } from '@/libs/location'
import commonIcon from '_c/common-icon'
import TagsNav from '../tags-nav'
export default {
  name: 'HeaderBar',
  components: {
    TagsNav,
    commonIcon
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    rootEnterpriseName: {
      type: String,
      default: ''
    }
  },
  watch: {
    '$route' (newRoute) {
      const { name, query, params, meta, path } = newRoute
      // 当前路由如果是列表的话，需要判断该列表有没有打开的新增或查看页，如果有则缓存switch，如果没有则push刷新
      if (name.indexOf('_index') > -1 && this.routeUpdateType === 'push') {
        let _bloon = this.tagNavList.findIndex(n => n.name === `create_${name.split('_')[0]}` || n.name === `update_${name.split('_')[0]}`) === -1
        if (_bloon) this.setUpdateType('push')
        else this.setUpdateType('switch')
      }
      this.addTag({
        route: { name, query, params, meta, path },
        type: 'push'
      })
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      this.setUpdateType('push')
    }
  },
  computed: {
    ...mapState({
      routes: state => state.user.routes
    }),
    tagNavList () {
      return this.$store.state.user.tagNavList
    },
    routeUpdateType () {
      return this.$store.state.user.updateType
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setHomeRoute(this.routes)
    this.setTagNavList()
    this.addTag({
      route: this.$store.state.user.homeRoute
    })
  },
  methods: {
    ...mapActions([
      'doLoginOut',
      'handleTagsOption'
    ]),
    ...mapMutations([
      'setTagNavList',
      'addTag',
      'setUpdateType',
      'setHomeRoute',
      'setIsLoginOut'
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
    handleClick (item) {
      // 标记当前是tag页签切换，而不是新增页签，为了解决查看keepAlive缓存
      this.setUpdateType('switch')
      this.turnToPage(item)
    },
    handleUserClick (name) {
      if (name === 'loginOut') {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确认退出当前系统？</p>',
          onOk: () => {
            let _tagNaveListCopy = JSON.parse(session.getItem('tagNaveListCopy'))
            // 第一个未保存的页面路由
            let _firstEditRoute = _tagNaveListCopy.find(item => item.meta.is_edit)
            if (_firstEditRoute === undefined) {
              this.doLoginOut()
            } else {
              this.setIsLoginOut(true)
              this.handleTagsOption('all')
            }
          }
        })
      }
    }
  }
}
</script>
