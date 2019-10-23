<template>
  <div class="auxiliary-modal">
    <Modal
      class-name="auxiliary-modal"
      v-model="value"
      :closable="false"
      :mask-closable="false"
      draggable
      scrollable
      width="1000">
      <header class="modal-header" slot="header">
        <div class="modal-header-name">{{title}}</div>
        <div class="modal-header-actions">
          <span @click="doCancel" class="close-company-modal"><common-icon type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article class="centent">
        <Row class="query-conditions">
          <Col span="6">
            <Input clearable v-model="codeOrName" placeholder="核算主体编码或名称" @on-enter="doSearch" @on-clear="doSearch">
              <Button slot="append" icon="ios-search" @click="doSearch" size="small"></Button>
            </Input>
          </Col>
        </Row>
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
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-row">
              <span class="select-title">已选{{ title.split('选择')[1] }}(<span class="textBtn">{{selectedList.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectedList" :key="index" class="selected-div">
                 <Poptip  trigger="hover"  placement="top" :content="item.entityName" :transfer=true>
                    {{maxlen(item.entityName)}}
                    <Icon type="md-close" @click="doIconDeleteUser(index)" class="md-close"/>
                 </Poptip>
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page">
          <div class="div-page-lf">共<strong>{{totalPage}}</strong>条数据</div>
          <div class="div-page-btn">
            <Page
              id="pageId"
              class-name="pages"
              :total="totalPage"
              :current="pageNo"
              :page-size="pageSize"
              :page-size-opts="[20, 50, 100, 200, 500, 1000]"
              show-elevator
              show-sizer
              @on-page-size-change="changeModalPageSize"
              @on-change="handleModalChangePage"/>
            <Button size="small" @click="goElevatorPage('pageId')">GO</Button>
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
import { saasMixin } from '@/libs/mixins.js'
import nodata from '_c/nodata'
import CommonIcon from '_c/common-icon'

export default {
  name: 'auxiliaryModal',
  components: {
    CommonIcon,
    nodata
  },
  props: {
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
      type: Array,
      default: () => []
    },
    data: {
      type: Object
    }
  },
  mixins: [saasMixin],
  data () {
    return {
      codeOrName: '',
      totalPage: 0,
      pageSize: 20,
      pageNo: 1,
      show: true,
      tableData: [],
      selectedList: [],
      tableColumns: [
        {
          type: 'selection',
          key: 'selection',
          width: 50,
          minWidth: 50,
          align: 'center'
        },
        {
          title: '编码',
          key: 'entityCode',
          minWidth: 90,
          tooltip: true
        },
        {
          title: '名称',
          key: 'entityName',
          minWidth: 90,
          tooltip: true
        },
        {
          title: '核算账簿',
          key: 'accountBookName',
          minWidth: 180,
          tooltip: true
        }
      ]
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.doGetAllCompanyAccountEntity()
      } else {
        this.selectedList = []
        this.codeOrName = ''
        this.pageSize = 20
        this.pageNo = 1
      }
    }
  },
  methods: {
    // 获取公司下所有核算主体数据
    doGetAllCompanyAccountEntity () {
      let reqdata = this.data
      reqdata.codeOrName = this.codeOrName
      reqdata.page = {
        size: this.pageSize,
        current: this.pageNo
      }
      this.selectedList = []
      this.$request.post('/financeback/bankAccount/findAccountBookEntityList', reqdata).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          this.tableData = data.records
          this.totalPage = data.total
          this.pageNo = data.current
          this.pageSize = data.size
          // 如有默认选中的值，默认勾选
          this.tableData.forEach(item => {
            if (this.selectedValues.includes(item.id)) {
              this.selectedList.push(item)
              delete item._checked
              this.$set(item, '_checked', true)
            } else {
              delete item._checked
              this.$set(item, '_checked', false)
            }
          })
        }
      })
    },
    // 点击搜索
    doSearch () {
      this.doGetAllCompanyAccountEntity()
    },
    maxlen (val) {
      let str
      if (val.length > 29) {
        str = val.substr(0, 29) + '...'
      } else {
        str = val
      }
      return str
    },
    // 点击确定
    doConfirm () {
      this.$emit('on-select', this.selectedList)
    },
    // 点击取消
    doCancel () {
      this.$emit('on-visibe-change', false)
    },
    // 单选选中
    doSelect (data, row) {
      // 判断,如果选中的数据没在这里面，添加进入
      let selectedIds = this.selectedList.map(item => item.id)
      if (!selectedIds.includes(row.id)) {
        this.selectedList.push(row)
      }
    },
    // 单选取消
    doSelectCancel (data, row) {
      // 判断，如果选中的数据的id在里面，删掉
      this.selectedList = this.selectedList.filter(item => item.id !== row.id)
    },
    // 全选选中
    doAllSelect (data) {
      // 判断，如果选中的数据的有没在这里的，添加进去
      let selectedIds = this.selectedList.map(item => item.id)
      data.forEach(item => {
        if (!selectedIds.includes(item.id)) {
          this.selectedList.push(item)
        }
      })
    },
    // 全选取消
    doAllSelectCancel (data) {
      // 判断，如果里面的数据有在当前页的，删掉
      let seleTable = this.tableData.map(item => item.id)
      this.selectedList = this.selectedList.filter(n => !seleTable.includes(n.id))
    },
    // 点击删除图标-删除已选内容
    doIconDeleteUser (index) {
      this.selectedList.splice(index, 1)
      let _selectedIds = this.selectedList.map(item => item.id)
      this.tableData.forEach(item => {
        if (_selectedIds.includes(item.id)) {
          delete item._checked
          this.$set(item, '_checked', true)
        } else {
          delete item._checked
          this.$set(item, '_checked', false)
        }
      })
    },
    // 点击清空
    doCloseModalData () {
      this.selectedList = []
      this.tableData.forEach(item => {
        delete item._checked
        this.$set(item, '_checked', false)
      })
    },
    // 改变当前页
    handleModalChangePage (pageNo) {
      this.pageNo = pageNo
      this.doGetAllCompanyAccountEntity()
    },
    // 改变每页数量
    changeModalPageSize (e) {
      this.pageSize = e
      this.doGetAllCompanyAccountEntity()
    }
  }
}
</script>
<style lang="less">
@import './auxiliaryModal.less';
</style>
