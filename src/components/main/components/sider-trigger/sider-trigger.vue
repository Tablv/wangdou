<template>
  <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
    <common-icon :type="icon" :size="size" />
  </a>
</template>
<script>
import commonIcon from '_c/common-icon'
export default {
  name: 'siderTrigger',
  components: {
    commonIcon
  },
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
