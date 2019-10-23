<template>
  <div class="tags-nav">
    <div class="close-con">
      <Dropdown transfer placement="bottom-end" trigger="hover" @on-click="handleTagsOption" style="margin-top:7px;" @on-visible-change="onVisibleChange">
        <span :class="{'arrow-left': true, 'arrow-down': is_rotate}"><common-icon :size="16" type="_moretags"></common-icon></span>
        <DropdownMenu slot="list">
          <DropdownItem :name="index" @click.native="handleClick(item)" v-for="(item, index) in list" :key="item.name" :selected="isCurrentTag(item)">
            {{item.meta.title}}
          </DropdownItem>
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown transfer placement="bottom-end" trigger="hover" style="margin:7px 0 0 12px;">
        <common-icon :size="16" type="_skin"></common-icon>
        <DropdownMenu slot="list">
          <div class="change-skin-box">
            <span class="skin skin-default" @click="onChangeSkin('default')"></span>
            <span class="skin skin-black" @click="onChangeSkin('black')"></span>
            <span class="skin skin-blue" @click="onChangeSkin('blue')"></span>
            <span class="skin skin-red" @click="onChangeSkin('red')"></span>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
    <ul v-show="visible" :style="{left: contextMenuLeft + 'px', top: contextMenuTop + 'px'}" class="contextmenu">
      <li v-for="(item, key) of menuList" @click="handleTagsOption(key)" :key="key">{{item}}</li>
    </ul>
    <div class="btn-con left-btn">
      <Button type="text" @click="handleScroll(240)">
        <Icon :size="16" type="ios-arrow-back"/>
      </Button>
    </div>
    <div class="btn-con right-btn">
      <Button type="text" @click="handleScroll(-240)">
        <Icon :size="16" type="ios-arrow-forward"/>
      </Button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <transition-group name="taglist-moving-animation">
          <Tag
            v-for="(item, index) in list"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :name="item.name"
            :data-route-item="item"
            @on-close="handleClose(item)"
            @click.native="handleClick(item)"
            :closable="item.name !== $config.homeName"
            :color="isCurrentTag(item) ? 'primary' : 'default'"
            @contextmenu.prevent.native="contextMenu(item, $event)"
          >{{ showTitleInside(item) }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { showTitle, routeEqual } from '@/libs/util'
import { local, session } from '@/libs/location'
import commonIcon from '_c/common-icon'
import { mapMutations } from 'vuex'
export default {
  name: 'TagsNav',
  components: {
    commonIcon
  },
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      is_rotate: false, // 动画
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 4,
      contextMenuLeft: 0,
      contextMenuTop: 0,
      visible: false,
      menuList: {
        others: '关闭其他页签',
        all: '关闭所有页签'
      }
    }
  },
  computed: {
    currentRouteObj () {
      const { name, params, query } = this.value
      this.$store.commit('setCurrentRouteObj', this.value)
      return { name, params, query }
    },
    tagElementUpdate () {
      return this.$store.state.user.tagElementUpdate
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    onVisibleChange (visible) {
      this.is_rotate = visible
    },
    handleTagsOption (type) {
      // 判断是页面跳转还是关闭操作
      if (typeof type === 'number') {
        return false
      }
      this.$store.dispatch('handleTagsOption', type)
    },
    handleClose (current) {
      // 点击关闭的时候高亮当前操作页签页面
      this.handleClick(current)
      this.closeTag({ route: current })
    },
    // 切换皮肤
    onChangeSkin (name) {
      local.setItem('skin', `skin-${name}`)
      this.$store.commit('setSkin', `skin-${name}`)
    },
    handleClick (item) {
      this.$emit('input', item)
    },
    showTitleInside (item) {
      return showTitle(item, this)
    },
    isCurrentTag (item) {
      return routeEqual(this.currentRouteObj, item)
    },
    moveToView (tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth
      const bodyWidth = this.$refs.scrollBody.offsetWidth
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding
      } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding)
      } else {
        // 标签在可视区域右侧
        if (tag.offsetLeft) this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - this.outerPadding - tag.offsetWidth))
      }
    },
    getTagElementByName (route) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened
        this.refsTag.forEach((item, index) => {
          if (routeEqual(route, item.$attrs['data-route-item'])) {
            let tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
    },
    contextMenu (item, e) {
      if (item.name === this.$config.homeName) {
        return
      }
      this.visible = true
      const offsetLeft = this.$el.getBoundingClientRect().left
      this.contextMenuLeft = e.clientX - offsetLeft + 10
      this.contextMenuTop = e.clientY - 64
    },
    closeMenu () {
      this.visible = false
    }
  },
  watch: {
    '$route' (to) {
      this.getTagElementByName(to)
    },
    // 从状态机得知关闭动作执行完毕
    tagElementUpdate (value) {
      if (value) {
        setTimeout(() => {
          this.getTagElementByName(this.$route)
        }, 200)
        this.$store.commit('setTagElementUpdate', false)
      }
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.getTagElementByName(this.$route)
    }, 200)
    // 监听页面刷新
    window.onbeforeunload = e => {
      session.setItem('onload', true)
      // 关闭所有，除了home
      let res = this.list.filter(item => item.name === this.$config.homeName)
      session.setItem('tagNaveList', JSON.stringify(res))
      session.setItem('tagNaveListCopy', JSON.stringify(res))
      return false
    }
  }
}
</script>

<style lang="less">
@import './tags-nav.less';
</style>
