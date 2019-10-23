<template>
  <div class="nodata" :style="{ 'height': `${height}px`, 'font-size': `${fontSize}px` }">
    <Spin fix v-if="loading"></Spin>
    <div class="nodata-block" v-else>
      <common-icon type="_nodata" :size="iconSize" :color="iconColor"/>
      <p class="nodata-block-text">{{ noticeText }}</p>
    </div>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
export default {
  components: {
    CommonIcon
  },
  props: {
    height: {
      type: Number,
      default: 300
    },
    fontSize: {
      type: Number,
      default: 14
    },
    iconSize: {
      type: Number,
      default: 36
    },
    iconColor: {
      type: String,
      default: '#999'
    },
    noticeText: {
      type: String,
      default: '暂无数据噢'
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
.nodata {
  width: 100%;
  display: table;
  font-size: 14px;
  color: #999;
  text-align: center;
  position: relative;
  &-block {
    display: table-cell;
    vertical-align: middle;
    &-text {
      line-height: 3.0;
    }
  }
}
</style>
