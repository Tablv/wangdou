<template>
  <div class="multi-select-modal">
    <Modal
      class-name="multi-select-modal"
      v-model="value"
      :closable="false"
      :mask-closable="false"
      draggable
      scrollable
      width="1000"
      :transfer = 'false'
      @mouseup.native="onMouseUpModal">
      <header class="modal-header" slot="header">
        <div class="modal-header-name">{{title}}</div>
        <div class="modal-header-actions">
          <span @click="doCancel" class="close-company-modal"><common-icon type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article class="centent">
        <slot name="search"></slot>
        <Row>
          <Col span="13" class="page-left">
            <p class="table-title">待选{{ title.split('选择')[1] }}</p>
            <Table style="max-height: 348px"
            border
              :columns="tableColumns"
              :data="tableData"
              @on-select="doSelect"
              @on-select-cancel="doSelectCancel"
              no-data-text=""
              @on-select-all="doAllSelect"
              @on-select-all-cancel="doAllSelectCancel"></Table>
            <nodata :loading="loading" :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-row">
              <span class="select-title">已选{{ title.split('选择')[1] }}(<span class="textBtn">{{selectedList.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectedList" :key="index" class="selected-div">
                 <Poptip  trigger="hover" width='300' :word-wrap = true  placement="top" :content="item.name || item.typeName || item.entityName" :transfer=true>
                    {{maxlen(item.name || item.typeName || item.entityName)}}
                    <Icon type="md-close" @click="doIconDeleteUser(index)" class="md-close"/>
                 </Poptip>
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page">
          <div class="div-page-lf">共<strong>{{ totalPage }}</strong>条数据</div>
          <div class="div-page-btn no-error-modal">
            <Page
              :id="modalPageId"
              class-name="pages"
              :total="totalPage"
              :current="pageNo"
              :page-size="pageSize"
              :page-size-opts="pageOptions"
              show-elevator
              show-sizer
              @on-page-size-change="changeModalPageSize"
              @on-change="handleModalChangePage"/>
            <Button size="small" @click="goElevatorPage(modalPageId)">GO</Button>
          </div>
        </div>
      </article>
      <footer slot="footer">
        <div class="modal-footer-actions">
          <Button type="primary" @click="doConfirm" class="button-space">确定</Button>
          <Button @click="doCancel">取消</Button>
        </div>
      </footer>
    </Modal>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
// import TableAuto from '_c/tableAuto'
import { saasMixin } from '@/libs/mixins.js'
import { multiUrls, multiColumns } from './columns'
import nodata from '_c/nodata'

export default {
  name: 'multiModal',
  components: {
    CommonIcon,
    // TableAuto,
    nodata
  },
  props: {
    modalPageId: {
      default: 'modalPageId',
      type: String
    },
    compareId: {
      type: String,
      default: 'id'
    },
    // 展示弹窗
    value: {
      default: false,
      type: Boolean
    },
    // 组件标题
    title: {
      type: String
    },
    // 默认选中的数据
    selectedValues: {
      type: Array
    },
    type: {
      type: String,
      default: 'company'
    },
    data: {
      type: Object
    },
    isEnterpriseAdmin: {
      type: String,
      default: '0'
    },
    // 分页size可选项
    pageOptions: {
      type: Array,
      default: () => [10, 20, 50, 100, 250, 500]
    },
    grop: {
      default: false,
      type: Boolean
    }
  },
  mixins: [saasMixin],
  data () {
    return {
      totalPage: 0,
      pageSize: 20,
      pageNo: 1,
      show: true,
      loading: true,
      tableData: [],
      selectedList: []
    }
  },
  methods: {
    maxlen (val) {
      let str
      if (val) {
        if (val.length > 29) {
          str = val.substr(0, 29) + '...'
        } else {
          str = val
        }
      }
      return str
    },
    // 点击确定
    doConfirm () {
      let _list = this.selectedList
      this.$emit('on-select', _list)
      this.$emit('isCheck', false)
      let thisPage = document.getElementById(this.modalPageId)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      elevatorDiv[0].getElementsByTagName('input')[0].value = 1
    },
    // 点击取消
    doCancel () {
      this.$emit('on-visibe-change', false)
      let thisPage = document.getElementById(this.modalPageId)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      elevatorDiv[0].getElementsByTagName('input')[0].value = 1
    },
    // 获取表格展示
    doModalInit (val, index) {
      if (val && val.id) {
        this.data.codeOrName = val.coderOrName
      }
      this.data.type = this.data.type ? 1 : 0
      let selectedIds = this.selectedList.map(item => item[this.compareId])
      this.$request.post(multiUrls[this.type], { ...this.data, ...this.params }).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (this.grop === true) {
            if (index) {
              if (index !== 1) {
              } else {
                data.records.unshift({
                  code: '0000',
                  name: '集团',
                  id: 0
                })
              }
            } else {
              data.records.unshift({
                code: '0000',
                name: '集团',
                id: 0
              })
            }
          }
          data.records.forEach(item => {
            // 解决新增用户中核算主体显示问题
            if (item.entityName) {
              item.name = item.entityName
              item.code = item.entityCode
            }
            if (selectedIds.includes(item[this.compareId])) {
              this.$set(item, '_checked', true)
            }
          })
          this.totalPage = data.total
          this.tableData = data.records
          this.loading = false
        }
      })
    },
    // 单选选中
    doSelect (data, row) {
      // 判断,如果选中的数据没在这里面，添加进入
      let selectedIds = this.selectedList.map(item => item[this.compareId])
      if (!selectedIds.includes(row[this.compareId])) {
        this.selectedList.push(row)
      }
    },
    // 单选取消
    doSelectCancel (data, row) {
      // 判断，如果选中的数据的id在里面，删掉
      this.selectedList = this.selectedList.filter(item => item[this.compareId] !== row[this.compareId])
    },
    // 全选选中
    doAllSelect (data) {
      // 判断，如果选中的数据的有没在这里的，添加进去
      let selectedIds = this.selectedList.map(item => item[this.compareId])
      data.forEach(item => {
        if (!selectedIds.includes(item[this.compareId])) {
          this.selectedList.push(item)
        }
      })
    },
    // 全选取消
    doAllSelectCancel (data) {
      // 判断，如果里面的数据有在当前页的，删掉
      let seleTable = this.tableData.map(item => item[this.compareId])
      this.selectedList = this.selectedList.filter(n => !seleTable.includes(n[this.compareId]))
    },
    // 点击删除图标-删除已选内容
    doIconDeleteUser (index) {
      this.selectedList.splice(index, 1)
      this.doModalInit()
    },
    // 点击清空
    doCloseModalData () {
      this.selectedList = []
      this.doModalInit()
    },
    // 改变当前页
    handleModalChangePage (pageNo) {
      this.pageNo = pageNo
      this.doModalInit('', pageNo)
    },
    // 改变每页数量
    changeModalPageSize (e) {
      this.pageSize = e
      this.handleModalChangePage(1)
    }
  },
  computed: {
    params () { // 请求公司数据参数
      return {
        isEnterpriseAdmin: parseInt(this.isEnterpriseAdmin),
        menuCode: this.$route.name,
        rootEnterpriseId: this.$store.state.user.rootEnterpriseId,
        page: {
          size: this.pageSize,
          current: this.pageNo
        }
      }
    },
    tableColumns () {
      const section = {
        type: 'selection',
        key: 'selection',
        width: 50,
        minWidth: 50,
        align: 'center'
      }
      return [ ...[section], ...multiColumns[this.type] ]
    }
  },
  watch: {
    // 动态设置弹框Id
    modalPageId: {
      handler (val) {
        this.modalPageId = val
      },
      deep: true,
      immediate: true
    },
    value (val) {
      if (val) {
        this.selectedList = this.selectedValues.map(item => {
          return JSON.parse(item)
        })
        console.log(this.selectedList)
        this.doModalInit()
      }
    },
    // 监听传参变化
    data: {
      handler (val) {
        this.pageSize = 20
        this.pageNo = 1
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="less">
@import './multi-modal.less';
</style>
