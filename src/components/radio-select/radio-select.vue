<template>
  <div class="radio-select" :style="{ width: table_config.width ? table_config.width : '300px' }">
    <div class="input-container">
      <Input v-model="form.name"
             :maxlength="60"
             @on-change="handleInputChange"
             :placeholder="placeholder"
             :disabled="disabled"
             :class="{ 'is-radio-select-error': validate && !form.name }"
             @on-focus="handleFocus" @on-blur="handleCtlBlur"></Input>
      <div @click="handleClear" v-if=" !disabled && clearable && form.name" class="close-btn">
        <CommonIcon
          type="ios-close-circle"
          :size="14"
          color="#808695"
          class="search-close"
        ></CommonIcon>
      </div>
      <Icon class="search-icon" v-if="!disabled" type="md-more" size="20" @click="handleOpenModal"></Icon>
    </div>
    <transition name="drop">
      <div v-if="visible" class="search-result">
        <ul class="search-container1" v-if="data_list.length">
          <li v-for="item in data_list" :key="item.id" @click="handleChooseLi(item)">{{ item.name }}</li>
        </ul>
        <p v-else class="no-data">无匹配数据</p>
      </div>
    </transition>
    <Modal width="750px" footer-hide :draggable="true" :transfer="false" :title="table_config.title"
           v-model="select_visible" @mouseup.native="onMouseUpModal" @on-cancel="handleClose">
      <slot name="header"></slot>
      <Table no-filtered-data-text="" no-data-text="" style="margin-top: 10px" :height="data_list.length ? 340 : 0" :data="data_list" :loading="table_loading" :columns="columns" :border="true"></Table>
      <nodata :icon-size="60" notice-text="暂无数据" v-if="!data_list.length"></nodata>
      <div class="radio-page">
        <span>共 <strong>{{ total }}</strong>条数据</span>
        <div class="no-error-modal">
          <Page
            style="display: inline-block"
            :id="`companyId${getRandom}`"
            class-name="pages"
            :total="total"
            :current="page.current"
            :page-size="page.size"
            :page-size-opts="[10, 20, 50, 100, 250, 500]"
            show-elevator
            show-sizer
            @on-change="handleChangePage"
            @on-page-size-change="handleChangePageSize"></Page>
          <Button style="margin-left: 8px; vertical-align: top;margin-top: 3px" size="small" @click="goElevatorPage(`companyId${getRandom}`)">GO</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import { tableColumns, urls } from './columns'
import { saasMixin } from '@/libs/mixins'
export default {
  name: 'radio-select',
  components: { CommonIcon, nodata },
  mixins: [saasMixin],
  props: {
    chooseTipShow: { // 选中提示
      type: Boolean,
      default: true
    },
    itemTipShow: { // 下拉item// 提示
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    bloc: {
      type: Boolean,
      default: false
    },
    disabled: { // 禁用当前单选框
      type: Boolean,
      default: false
    },
    clearable: { // 显示清除icon，清除显示值
      type: Boolean,
      default: true
    },
    value: { // 显示值，可用作预显
      type: String
    },
    config: { // 配置选项
      type: Object,
      required: true
    },
    validate: { // 是否开启验证
      type: Boolean,
      default: false
    },
    reset: { // 重置，取反即可，清除参数刷新单选框
      type: Boolean,
      default: false
    },
    close: { // 用作外部关闭已经打开的弹框，取反即可
      type: Boolean,
      default: false
    },
    confirm: { // 选择确定 如果为true 配合confirmData 方法使用，方法返回选中row
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: false
    }
  },
  /**
   * config: {
      type: 'company', // 单选类型,在columns.js 文件里定义好
      title: '选择公司',
      refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
      request_params: { } // 请求参数，数据分页必传!
      key: '' // 控制单选显示字段
    },

   组件方法：
   1. @on-close modal弹框关闭回调方法
   2. @getData 获取选中数据
   3. @change input 改变 或者 clear 回调方法
   *
   * */
  watch: {
    close: function () {
      this.select_visible = false
    },
    value: {
      handler: function (val) {
        this.form.name = val || ''
      },
      deep: true,
      immediate: true
    },
    config: {
      handler: function (val) {
        this.table_config = val
      },
      deep: true,
      immediate: true
    },
    reset: function () {
      this.page.current = 1
      this.handleGetData()
    },
    visible: function (val) {
      if (!val) {
        if (!this.form.name || !this.is_input) {
          return false
        }
        let result = this.data_list.filter(item => item.name === this.form.name)
        if (!result.length) {
          if (this.create) {
            this.$emit('getData', {
              name: this.form.name
            })
          } else {
            this.form.name = ''
            this.form.id = ''
            this.$emit('getData', this.form)
          }
        } else {
          this.form.id = result[0].id
          this.table_config.request_params.codeOrName = this.form.name
          this.$emit('getData', this.form, result[0])
        }
        this.is_input = false
      }
    }
  },
  data () {
    return {
      getRandom: 0, // 生成随机数
      is_input: false, // 输入
      table_loading: false,
      table_config: {}, // 参数配置
      table_list: [],
      select_visible: false, // 单选公司
      visible: false, // 显示隐藏下拉菜单
      form: {
        name: '',
        id: ''
      },
      data_list: [], // 数据
      total: 0, // 数据个数
      page: {
        current: 1,
        size: 50
      }
    }
  },
  computed: {
    columns () {
      let type = this.table_config.type || 'company'
      return tableColumns[type].concat([
        {
          title: '操作',
          key: 'action',
          align: 'center',
          tooltip: true,
          render: (h, { row }) => {
            return (
              <div>
                <span class="table-span" on-click={this.handleChooseRow.bind(this, row)}>选择</span>
              </div>
            )
          }
        }
      ])
    }
  },
  methods: {
    // 关闭弹框
    handleClose () {
      this.$emit('on-close')
    },
    // 失焦
    handleCtlBlur () {
      this.$emit('on-blur')
      this.$nextTick(() => {
        this.visible = false
      })
    },
    // 表格单选
    handleChooseRow (row) {
      let key = this.table_config.key ? this.table_config.key : 'name'
      if (this.confirm) {
        this.$emit('confirmData', row)
      } else {
        this.form.name = row[key]
        this.form.id = row.id
        let form = {
          name: row.name,
          id: row.id
        }
        this.$emit('getData', form, row)
        this.select_visible = false
      }
    },
    // input 聚焦
    handleFocus () {
      this.page.size = 50
      this.visible = true
      this.handleGetData()
    },
    // 分页 page
    handleChangePage (page) {
      this.page.current = page
      this.handleGetData()
    },
    // 分页 size
    handleChangePageSize (size) {
      this.page.size = size || 50
      this.handleGetData()
    },
    // 打开弹框 设置size
    handleOpenModal () {
      this.getRandom = Math.ceil(Math.random() * 1000)
      if (this.table_config.request_params && this.table_config.request_params.codeOrName) {
        this.table_config.request_params.codeOrName = ''
      }
      this.page.size = 10
      this.select_visible = true
      this.handleGetData()
    },
    // 获取数据列表
    handleGetData () {
      if (!this.table_config.type || !this.table_config.request_params) {
        throw new Error('Lack of necessary parameters[type|request_params]')
      }
      this.table_loading = true
      let type = this.table_config.type || 'company'
      let _requestParams = JSON.parse(JSON.stringify(this.table_config.request_params))
      Object.entries(_requestParams).forEach(n => {
        if (n[1] === 'all') {
          _requestParams[n[0]] = ''
        }
      })
      this.$request.post(urls[type], {
        ..._requestParams,
        page: this.page
      }).then(res => {
        this.table_loading = false
        if (res.data.code === 200) {
          this.data_list = res.data.data.records
          for (let i = 0; i < this.data_list.length; i++) {
            this.data_list[i].name = this.data_list[i][tableColumns[this.table_config.type][1].key]
          }
          this.total = res.data.data.total
          if (this.bloc && this.page.current === 1) {
            this.data_list.unshift({
              code: '0000',
              name: '集团'
            })
          }
        } else {
          this.data_list = []
          this.total = 0
        }
      })
    },
    // 清除
    handleClear () {
      this.form.name = ''
      this.form.id = ''
      this.$emit('getData', this.form)
      this.$emit('change')
      this.table_config.request_params.codeOrName = ''
      this.visible = false
    },
    // 点击选择某一项
    handleChooseLi (item) {
      if (this.confirm) {
        this.$emit('confirmData', item)
      } else {
        let key = this.table_config.key ? this.table_config.key : 'name'
        this.form.name = item[key]
        this.form.id = item.id
        let form = {
          name: item.name,
          id: item.id
        }
        this.$emit('getData', form, item)
      }
    },
    // input 改变
    handleInputChange (val) {
      this.table_config.request_params.codeOrName = this.form.name
      this.is_input = true
      this.handleGetData()
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="less">
  .radio-select {
    position: relative;
    .ivu-select-selection {
      border-color: #e5e5e5 !important;
    }
    .search-input-margin {
      margin-top: 0;
    }
    th .ivu-table-cell {
      padding: 0 8px !important;
    }
    td .ivu-table-cell {
      padding: 0 8px !important;
    }
    .input-container {
      width: 100%;
      display: inline-block;
      position: relative;
      input {
        padding-right: 24px;
      }
      .close-btn {
        display: none;
      }
      &:hover {
        .close-btn {
          display: block;
        }
      }
    }
    .error-border {
      border: 1px solid #ed4014;
    }
    .search-result {
      width: 100%;
      position: absolute;
      z-index: 990;
    }
    .search-container1 {
      width: 100%;
      max-height: 250px;
      background-color: #fff;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      overflow: auto;
      position: relative;
      top: 0;
      li {
        margin: 0;
        line-height: normal;
        padding: 10px;
        clear: both;
        min-height: 30px;
        cursor: pointer;
        transition: 0.2s ease-in-out;
        &:hover {
          background-color: #F2F2F2;
        }
      }
    }
    .no-data {
      width: 100%;
      position: absolute;
      z-index: 99;
      text-align: center;
      padding: 5px 8px;
      min-height: 30px;
      line-height: 30px;
      background-color: white;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    }
    .search-close {
      position: absolute;
      top: 10px;
      right: 20px;
      cursor: pointer;
    }
    .search-icon {
      position: absolute;
      top: 7px;
      right: -1px;
      cursor: pointer;
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
  // 单选组件 input error border
  .is-radio-select-error > input{
    border-color: #ed4014;
    &:hover {
      border-color: #ed4014 !important;
    }
  }
  .radio-page {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    > span {
      line-height: 30px;
    }
    > div {
      width: 85%;
      text-align: right;
    }
  }
  .radio-page:after {
    content: '';
    clear: both;
  }
</style>
