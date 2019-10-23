<template>
  <div class="drop-down-multi-select" :style="{ 'width': width, 'display': 'inline-block' }">
    <!-- :max-tag-count="0"
      :max-tag-placeholder="maxTagPlaceholder" -->
     <Poptip  trigger="hover" width='400' :word-wrap = true :disabled ="selectedValues.length=== 0 ? true: false" :content="selectedValues.length=== 0 ? '' : (selectedValues.map(item =>JSON.parse(item)).map(item => item.name || item.typeName || item.entityName)).join()" placement="top" :transfer=true>
      <Select
        v-model="selectedValues"
        :remote-method="doRemoteList"
        @on-change="onChangeSelect"
        @on-open-change='onOpenChangeSelect'
        @on-query-change='wordChange'
        :placeholder="placeholder"
        :max-tag-count='1'
        :max-tag-placeholder="maxTagPlaceholder"
        multiple
        filterable
        remote>
          <Option v-for="(item, index) in optionList" :key="index" :label="item.name || item.userName || item.entityName || item.typeName" :value="JSON.stringify(item)" selected>
             <span style="margin-right:10px;">{{item.code}} </span>
            {{ maxlen(item.name) || maxlen(item.userName) || maxlen(item.entityName) || maxlen(item.typeName)}}
          </Option>
      </Select>
    </Poptip>
    <Icon class="select-icon" type="md-more" size="20" @click="modalShow = true"></Icon>
    <!-- 多选框弹框组件 -->
    <multi-modal
      @on-select="doGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="onVisibeChange"
      :value="modalShow"
      :selectedValues="selectedValues"
      :type="type"
      :title="title"
      :data="data"
      :grop="grop"
      :isEnterpriseAdmin="isEnterpriseAdmin"
      :modalPageId="modalPageId"
      ref="modalChild"
      :compareId="compareId">
      <slot name="search" slot="search"></slot>
    </multi-modal>
  </div>
</template>

<script>
import multiModal from '_c/multi-modal'
import { multiUrls } from '_c/multi-modal/columns'
// import { transObjToArr } from '@/libs/tools.js'
export default {
  components: {
    multiModal
  },
  props: {
    modalPageId: {
      type: String,
      default: 'modalPageId'
    },
    compareId: {
      type: String
    },
    width: {
      type: String,
      default: '250px'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    title: {
      type: String,
      default: '选择区域'
    },
    type: {
      type: String,
      default: 'company'
    },
    data: {
      type: Object
    },
    defaultValue: {
      type: Boolean
    },
    isClear: {
      type: Boolean
    },
    tabClose: {
      type: Boolean
    },
    isEnterpriseAdmin: {
      type: String,
      default: '0'
    },
    defaultArray: {
      type: Array,
      default: () => []
    },
    searchText: {
      type: Object
    },
    only: {
      type: Boolean,
      default: false
    },
    grop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalShow: false, // 多选modal
      selectedValues: [], // 选中列表
      optionList: [], // 可选列表
      defaultList: [],
      clear: false,
      word: '',
      disabled: false,
      arrShit: true
    }
  },
  watch: {
    // 动态设置弹框Id
    modaPageId: {
      handler (val) {
        this.modaPageId = val
      },
      deep: true
    },
    // 监听传参变化
    data: {
      handler (val) {
        if (val) {
          if (val.type) {
            this.$nextTick(() => {
              this.$refs.modalChild.doModalInit(val)
            })
          }
        }
      },
      deep: true
    },
    // 是否添加集团
    grop: {
      handler (val) {
        if (val) {
          this.grop = val
        }
      },
      deep: true
    },
    // 监听弹框显隐
    modalShow (val) {
      this.$emit('on-visibe-change', val)
    },
    // 多选默认选项
    defaultArray: {
      handler (val) {
        this.doGetDataList(this.defaultArray)
        this.defaultChange(val)
      },
      deep: true,
      immediate: true
    },
    isClear (val) {
      this.clear = val
      if (this.clear) {
        let list = []
        this.doGetDataList(list)
      }
    },
    tabClose: {
      handler (val) {
        this.modalShow = val
      },
      deep: true,
      immediate: true
    },
    isEnterpriseAdmin: {
      handler (val) {
        this.isEnterpriseAdmin = val
      },
      deep: true,
      immediate: true
    },
    only: {
      handler (val) {
        this.only = val
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.doGetDataList(this.defaultArray)
  },
  methods: {
    defaultChange (val) {
      if (val.length !== 0) {
        this.arrShit = false
      } else {
        this.arrShit = true
      }
    },
    maxlen (max) {
      if (max === null || max === undefined) {
        return false
      }
      let str
      if (max.length > 19) {
        str = max.substring(0, 16) + '...'
      } else {
        str = max
      }
      return str
    },
    isCheck (val) {
      this.$emit('on-clear', val)
    },
    // 展开下拉列表触发
    onOpenChangeSelect (flag) {
      if (flag) {
        this.optionList = this.selectedValues.map(n => { return JSON.parse(n) })
      }
    },
    // 远程查询
    doRemoteList (query, val) {
      if (val) {
        this.doGetDataList(val)
      }
      this.word = query
      // 查询参数
      this.$emit('searchWord', query)
      let search = this.searchText
      let _reqParam = {
        isEnterpriseAdmin: parseInt(this.isEnterpriseAdmin),
        menuCode: this.$route.name,
        // codeOrName: query,
        page: { size: 1000, current: 1 },
        ...search
      }
      this.$request.post(multiUrls[this.type], _reqParam).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          // 查询结果作为可选列表
          this.optionList = data.records
        }
      })
    },
    // 选中数据变化触发
    onChangeSelect (list) {
      if (this.only === true) {
        if (list.length === 1) {
          this.defaultList = list
          this.optionList = list.map(n => { return JSON.parse(n) })
        }
        if (list.length === 0) {
          this.$Message.warning('请至少保留一条数据！')
          this.optionList = this.defaultList.map(n => { return JSON.parse(n) })
          this.selectedValues = this.defaultList.map(n => { return JSON.parse(n) })
          this.doGetDataList(this.selectedValues)
        }
      }
      if (this.arrShit === false) {
        this.arrShit = true
        return false
      }
      let params = this.selectedValues.length > 0 ? this.selectedValues : []
      let data = []
      for (let i = 0; i < params.length; i++) {
        data.push(JSON.parse(params[i]))
      }
      this.$emit('on-select', data, this.type)
    },
    wordChange (query) {
      if (this.word === query) {
        this.doRemoteList(query)
      }
    },
    maxTagPlaceholder (num) {
      return `...+${num}`
    },
    // 监听选择公司组件
    doGetDataList (selectedList) {
      this.modalShow = false
      if (selectedList) {
        if (selectedList.length) {
          this.optionList = selectedList
        }
      }
      this.selectedValues = selectedList.map(item => JSON.stringify(item))
    },
    // modal弹框显隐回调方法
    onVisibeChange (val) {
      this.modalShow = val
      this.$emit('on-cancel', val)
    }
  }
}
</script>

<style lang="less">
  .drop-down-multi-select {
    position: relative;
    .select-icon {
      position: absolute;
      top: 6px;
      right: 2px;
      cursor: pointer;
    }
    .ivu-select-selection {
      height:32px;
    }
    .ivu-select-dropdown {
      overflow:hidden;
      overflow: auto;
    }
    .ivu-select-multiple .ivu-select-item-selected {
      color:#7C7D7E;
    }
    .ivu-select-selection div:last-child {
      white-space: nowrap;
      overflow:hidden
    }
  }
</style>
