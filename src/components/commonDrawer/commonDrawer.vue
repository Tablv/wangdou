<template>
    <div class="common-drawer" :class="{'show-drawer': visible}">
      <Drawer
        :transfer="false"
        :inner="true"
        v-model="visible"
        @on-close="handleCloseDrawer"
        :mask-closable="config_info.shadowClose"
        :closable="config_info.closeBtn"
        :width="config_info.width"
        :placement="config_info.placement"
        :title="config_info.title">
        <main>
          <slot></slot>
        </main>
        <footer v-show="config_info.footer">
          <slot name="footer"></slot>
        </footer>
      </Drawer>
    </div>
</template>

<script>
export default {
  name: 'optionsDrawer',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default: function () {
        return {
          title: '', // 标题
          width: 256, // 宽度
          closeBtn: true, // 是否显示关闭按钮
          shadowClose: false, // 是否点击遮罩关闭
          footer: true, // 是否显示页脚
          placement: 'right' // 弹出方向
        }
      }
    }
  },
  data () {
    return {
      visible: false,
      config_info: {
        title: '',
        width: 256,
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      }
    }
  },
  watch: {
    value: function (val) {
      this.visible = val
    },
    config: {
      handler: function (val) {
        this.config_info = Object.assign({}, this.config_info, val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCloseDrawer () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
  @import "commonDrawer.less";
</style>
