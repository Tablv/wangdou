<template>
  <div class="drop-down-input">
    <span @mouseenter="enter" @mouseleave="leave">
      <input :value="value" :maxlength="maxlength" :placeholder="placeholder" @input="updateVal($event.target.value)" @focus="onFocus" @blur="onBlur($event.target.value)" :disabled="disabled" :error="!!errorMessage"/>
      <common-icon type="ios-arrow-down" :size="14" :color="errorMessage ? '#ed4014' : '#808695'" :class="{'icon-close': true, 'icon-select-animate': is_show}" v-if="is_show_arrow"></common-icon>
      <common-icon type="ios-close-circle" :size="14" color="#808695" class="icon-close" v-if="is_close_show" @click.native="onClear"></common-icon>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </span>
    <transition name="drop">
      <ul class="datalist" v-if="is_show">
        <template v-if="options.length">
          <li class="option" v-for="item in options" :key="item.label" :selected="item.label === value" @click="selectOption(item.label)">{{ item.label }}</li>
        </template>
        <template v-else>
          <li class="option not-find">无匹配数据</li>
        </template>
      </ul>
    </transition>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
export default {
  components: {
    CommonIcon
  },
  data () {
    return {
      is_show: false, // 下拉框
      is_close_show: false, // 清除按钮
      errorMessage: '',
      options: [] // 过滤后下拉列表
    }
  },
  props: {
    // 下拉列表
    dropDownList: {
      type: Array,
      required: true
    },
    // 是否展示下拉箭头
    is_show_arrow: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 输入框最多可输入
    maxlength: {
      type: Number,
      default: 50
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // v-model值
    value: {
      type: String,
      default: '',
      required: true
    },
    // 遍历的子元素keyName
    keyName: {
      type: String,
      dafault: 'label',
      required: true
    }
  },
  watch: {
    value (val) {
      // 解决下拉选择后，错误提示依然存在bug
      if (val) this.errorMessage = ''
      this.$emit('onQueryChange', val)
    },
    dropDownList (val) {
      this.options = val
      // 下拉列表初始化
      this.options.forEach(n => {
        // 找到子元素keyname的value值
        for (const key in n) {
          if (key === this.keyName) {
            n.label = n[key]
          }
        }
      })
    }
  },
  methods: {
    // 输入框聚焦
    onFocus () {
      this.is_show = true
      this.is_close_show = false
      this.$emit('focus')
    },
    // 输入框失焦
    onBlur (val) {
      this.is_show = false
      if (val) {
        if (val.length > this.maxlength) {
          this.errorMessage = '最大长度限制50个字符'
        } else {
          this.errorMessage = ''
        }
      } else {
        this.errorMessage = '请补充开户行信息'
      }
    },
    // 鼠标移入
    enter () {
      if (this.value) this.is_close_show = true
    },
    // 鼠标离开
    leave () {
      this.is_close_show = false
    },
    // 清除操作
    onClear () {
      this.$emit('input', '')
      this.errorMessage = '请补充开户行信息'
      this.$emit('clear', '')
    },
    // 自定义v-model
    updateVal (val) {
      // 手动触发父组件的input事件并将值传给父组件
      this.$emit('input', val)
      this.options = this.dropDownList.filter(n => n.label.indexOf(val) > -1)
    },
    // 选择列表项
    selectOption (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less">
.drop-down-input {
  color: #515a6e;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  input {
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 0 24px 0 8px;
    font-size: 14px;
    outline: none;
    border: 1px solid #dcdee2;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #515a6e;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:focus {
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
    }
    &::-webkit-calendar-picker-indicator{
      display: none;
      -webkit-appearance: none;
    }
    &::-webkit-input-placeholder { /* WebKit browsers */
      color: #C7CBD0;
      font-size: 14px;
    }
    &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #C7CBD0;
      font-size: 14px;
    }
    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #C7CBD0;
      font-size: 14px;
    }
    &:-ms-input-placeholder { /* Internet Explorer 10+ */
      color: #C7CBD0;
      font-size: 14px;
    }
    &[disabled] {
      background-color: #F3F3F3;
      cursor: not-allowed;
    }
    &[error] {
      border: 1px solid #ed4014;
    }
  }
  .icon-close {
    position: absolute;
    top: 50%;
    right: 8px;
    line-height: 1;
    margin-top: -7px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  .datalist {
    max-height: 200px;
    overflow: auto;
    width: 100%;
    margin: 5px 0;
    padding: 5px 0;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    position: absolute;
    color: #515a6e;
    z-index: 900;
    .option {
      margin: 0;
      line-height: normal;
      padding: 7px 16px;
      clear: both;
      color: #515a6e;
      font-size: 14px !important;
      white-space: nowrap;
      list-style: none;
      cursor: pointer;
      transition: 0.2s ease-in-out;
      &[selected] {
        color: #2d8cf0;
        background-color: #F3F3F3;
      }
      &:hover {
        background-color: #F3F3F3;
      }
    }
    .not-find {
      color: #C7CBD0;
      text-align: center;
      padding: 0;
    }
  }
  .error-message {
    position: absolute;
    top: 100%;
    left: 0;
    line-height: 1;
    padding-top: 6px;
    color: #ed4014;
  }
}
// 下拉动画
.drop-enter-active {
  animation: ivuSlideUpIn .2s;
}
.drop-leave-active {
  animation: ivuSlideUpIn .2s reverse;
}
@keyframes ivuSlideUpIn {
  0% {
    opacity: 0;
    transform-origin: 0% 0%;
    transform: scaleY(0.8);
  }
  100% {
    opacity: 1;
    transform-origin: 0% 0%;
    transform: scaleY(1);
  }
}
// 下拉icon动画
.icon-select-animate {
  transform: rotate(180deg);
}
</style>
