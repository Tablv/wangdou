<template>
    <div class="options-drawer" :class="{'hide-drawer': visible}">
      <CommonDrawer v-model="common_visible" :config="common_config" @close="handleCloseDrawer">
        <template>
          <div v-if="options_config && options_config.length > 0">
            <div class="option-contain" v-for="(item,key) in options_config" :key="key">
              <h3>{{ item.title }}</h3>
              <div class="option-item" :class="{'has-title': item.title}" v-if="item.type === 'checkbox' && item.data && item.data.length > 0">
                <CheckboxGroup v-model="item.keyValue">
                  <div v-for="(checkbox,checkboxIdx) in item.data" :key="checkboxIdx">
                    <Checkbox :disabled="checkbox.disabled" :label="checkbox.value">{{ checkbox.label }}</Checkbox>
                    <Tooltip v-show="checkbox.hint" theme="light" :content="checkbox.hint" placement="bottom-end">
                      <Icon class="notice-style" type="md-help-circle" size="18" />
                    </Tooltip>
                  </div>
                </CheckboxGroup>
              </div>
              <div class="option-item" :class="{'has-title': item.title}" v-if="item.type === 'radio' && item.data && item.data.length > 0">
                <RadioGroup v-model="item.keyValue">
                  <Radio :disabled="radio.disabled" v-for="(radio,radioIdx) in item.data" :key="radioIdx" :label="radio.value">{{ radio.label }}</Radio>
                </RadioGroup>
              </div>
            </div>
          </div>
        </template>
        <div slot="footer" class="footer-container">
          <Button type="primary" @click="handleConfirmFilter">确定</Button>
          <Button type="default" @click="handleCloseDrawer">取消</Button>
        </div>
      </CommonDrawer>
    </div>
</template>

<script>
import CommonDrawer from '_c/commonDrawer'
export default {
  name: 'optionsDrawer',
  components: { CommonDrawer },
  props: ['value', 'config', 'optionConfig'],
  data () {
    return {
      common_visible: false, // 公共抽屉显示
      common_config: {},
      visible: false, // 当前抽屉显示
      options_config: [
        // {
        //   title: '控制策略', // 标题
        //   type: 'checkbox', // 选项类型
        //   keyName: 'control', // 字段名
        //   keyValue: [], // 值
        //   data: [// 选项items
        //     {
        //       label: '集团创建，集团共享',
        //       value: 0,
        //       hint: '这是集团创建'// 是否有提示有直接写，没有不给该字段
        //     },
        //     {
        //       label: '公司创建，引用共享',
        //       value: 1,
        //       hint: '这是公司创建'
        //     }
        //   ]
        // }
      ] // 配置内容
    }
  },
  watch: {
    value: function (val) {
      this.visible = val
      this.common_visible = val
    },
    config: {
      handler: function (val) {
        this.common_config = Object.assign({}, this.common_config, val)
      },
      deep: true,
      immediate: true
    },
    optionConfig: {
      handler: function (val) {
        this.options_config = val
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCloseDrawer () {
      if (this.options_config.length > 0) {
        this.options_config.filter(item => {
          item.keyValue = Array.isArray(item.keyValue) ? [] : ''
        })
      }
      this.visible = false
      this.common_visible = false
      this.$emit('close')
    },
    handleConfirmFilter () {
      var params = {}
      this.options_config.map((item, idx) => {
        params[item.keyName ? item.keyName : 'params' + (idx + 1)] = item.keyValue
      })
      this.$emit('confirm', params)
    }
  }
}
</script>

<style lang="less">
  .options-drawer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -10;
    transition: all ease .3s;
  }
  .hide-drawer {
    z-index: 1000;
  }
  .footer-container {
    text-align: right;
    padding: 0 10px;
    button:not(:last-child) {
      margin-right: 5px;
    }
  }
  .option-contain {
    .ivu-radio-group-item {
      white-space: normal;
    }
    h3 {
      font-weight: bold;
      margin: 10px 0 10px 20px;
    }
    .option-item {
      .ivu-checkbox-group-item, .ivu-radio-group-item {
        margin: 5px;
      }
      .notice-style {
        cursor: pointer;
        color: #D9D9D9;
        &:hover {
          color: #FB883F;
        }
      }
    }
    .has-title {
      margin-left: 30px;
    }
  }
</style>
