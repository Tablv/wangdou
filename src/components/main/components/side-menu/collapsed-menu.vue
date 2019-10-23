<template>
  <Poptip ref="poptip" trigger="hover" placement="right-start" transfer :popper-class="`menu-poptip ${ skinClass }`" @on-popper-show="doGetTheme">
    <a class="drop-menu-a" :active="isCurrentMenu(children)" type="text" @mouseover="handleMousemove($event, children)" :style="{textAlign: !hideTitle ? 'left' : ''}"><common-icon :size="rootIconSize" :color="textColor" :type="parentItem.icon"/><span class="menu-title" v-if="!hideTitle">{{ showTitle(parentItem) }}</span></a>
    <div class="drop-menu-container" slot="content">
      <template v-for="child in children">
        <div class="drop-menu-item" :key="child.name" v-if="!child.meta.hide">
          <template v-if="child.children && child.children.length > 0">
            <common-icon :size="rootIconSize" :color="textColor" :type="child.icon"/>
            <span class="menu-title">{{ showTitle(child) }}</span>
            <template v-for="item in child.children">
              <p v-if="!item.meta.hide" class="menu-name" :key="item.name" @click="handleClick(item.name)">
                {{showTitle(item)}}
              </p>
            </template>
          </template>
          <template v-else>
            <span v-if="!child.meta.hide" class="title" @click="handleClick(child.name)">{{ showTitle(child) }}</span>
          </template>
        </div>
      </template>
    </div>
  </Poptip>
</template>
<script>
import mixin from './mixin'
import { local } from '@/libs/location'
import itemMixin from './item-mixin'

export default {
  name: 'CollapsedMenu',
  mixins: [ mixin, itemMixin ],
  props: {
    hideTitle: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 16
    }
  },
  data () {
    return {
      placement: 'right-end',
      skinClass: ''
    }
  },
  methods: {
    handleClick (name) {
      // poptip弹框消失
      this.$refs.poptip.cancel()
      this.$emit('on-click', name)
    },
    handleMousemove (event, children) {
      const { pageY } = event
      const height = children.length * 38
      const isOverflow = pageY + height < window.innerHeight
      this.placement = isOverflow ? 'right-start' : 'right-end'
    },
    doGetTheme () {
      this.skinClass = local.getItem('skin')
    }
  }
}
</script>
