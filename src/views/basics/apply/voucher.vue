<template>
  <section class="voucher-container">
    <Spin fix v-if="loading2" style="left: 8px;z-index: 10">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">常用摘要列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreateUnit">新增</Button>
        <Button @click="doDeleteBtn">删除</Button>
        <Button @click="doSetTable"><common-icon type="_table" :size="14"/></Button>
        <Button @click="doInit"><common-icon type="_refresh" :size="14"/></Button>
      </div>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class="screen query-change">
            <Form :model="toReq" :label-width="0" class="form-item">
              <Col span="4">
              <multi-select :data="companyParams"
                class="maright inputs-width"
                @on-select="doGetCompanyId"
                @on-cancel="doCancelCompany"
                @on-clear="isCheck"
                placeholder="公司编码或名称"
                title="选择公司"
                type="company"
                width="100%"
                isEnterpriseAdmin = 1
                :isClear="isCompanyClear"
                @searchWord="searchWord"
                :searchText="searchText"
                ref="modalSelect">
                  <Row :gutter="10" slot="search">
                    <Col span="3">
                      <Select v-model="companyFormId" @on-change="doSelect">
                        <Option v-for="item in formList" :value="item.value" :key="item.value">{{item.label}}</Option>
                      </Select>
                    </Col>
                    <Col span="5">
                      <!-- <Input v-model="companyCodeOrName" search placeholder="编码或名称" @on-search="doSearch"/> -->
                      <Row class-name="search-input-content">
                        <Col span="21">
                          <Input v-model="companyCodeOrName" :maxlength="50" placeholder="编码或名称" clearable
                            @on-enter="doSearch" enter-button @on-clear="doSearch"></Input>
                        </Col>
                        <Col span="3" style="padding-left:0px">
                          <Button icon="ios-search" class="search-icon-button" @click="doSearch"></Button>
                        </Col>
                      </Row>
                    </Col>
                    <Col span="2">
                      <Button  @click="doReset1">重置</Button>
                    </Col>
                  </Row>
              </multi-select>
            </Col>
            <Col span="4">
              <Input v-model="toReq.contentOrCode" :maxlength="50" clearable  placeholder="摘要内容/助记码" @on-search="doInit" @on-clear="doInit" @on-enter="doInit"></Input>
            </Col>
            <Col span="1">
                <Button icon="ios-search" @click="doInit" class="search-icon-button searchButton"></Button>
              </Col>
            <Col span="1">
              <Button class="reset-button" @click="handleResetParams">重置</Button>
            </Col>
            </Form>
          </Row>
        </div>
      </div>
      <div class="page-content-table">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <Table
        :max-height='tableHeight'
        :columns="tableColumns"
        :no-data-text="null"
        :class="tableData.length ? null : 'tableHeight'"
        :data="tableData"
        @on-selection-change="onSelectCheckboxChange"
        ></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
      </div>
    </section>
    <section class="page-footer" v-show="!!maxItems">
      <div class="page-footer-lf">
        已选择 <strong>{{ selectMore.length }}</strong>项，共 <strong>{{ maxItems }}</strong>条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageIdg" class-name="pages" :total="maxItems" :page-size="page.size" :page-size-opts="[20, 50, 100, 200, 500, 1000]" show-elevator show-sizer @on-change="doUpdateCurrentPage" @on-page-size-change="doUpdatePageSize"></Page>
        <Button type="primary" size="small" @click="goElevatorPage('pageIdg')">GO</Button>
      </div>
    </section>
    <!-- 批量删除提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 表格配置 -->
    <table-config  @close="doTableClose" :drawer="drawer"></table-config>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins'
import multiSelect from '_c/multi-select'
import { getHeight, sortArr } from '@/libs/tools.js'
import batchHandleModal from '_c/batchHandleModal' // 批量删除
import tableConfig from '_c/tableConfigModal/tableConfig.vue' // 表格配置
export default {
  name: 'voucher_index',
  mixins: [saasMixin],
  components: {
    nodata,
    CommonIcon,
    batchHandleModal,
    tableConfig,
    multiSelect
  },
  data () {
    return {
      // 加载loading
      loading: false,
      loading2: false,
      // 多选弹窗公司参数
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      companyFormId: 0,
      companyCodeOrName: '',
      codeList: [],
      formList: [], // 公司编码或名称 - 弹窗中的形态
      // 表格高度
      tableHeight: 0,
      height: getHeight(60),
      // 接口请求参数
      toReq: {
        companyIdList: [],
        contentOrCode: ''
      },
      selectMore: [],
      selectData: [],
      maxItems: 1,
      page: {
        current: 1,
        size: 20
      },
      isClear: false,
      isCompanyClear: false,
      /**
       * table 的表头
       */
      tableColumns: [],
      header: {
        type: 'selection',
        width: 54,
        multiple: true,
        key: 'select',
        align: 'center'
      },
      code: {
        title: '摘要内容',
        key: 'abstractContent',
        minWidth: 90,
        tooltip: true,
        render: (h, { row, index, column }) => {
          return (
            <span class="table-span readonly" on-click={this.doLocationDetail.bind(this, 'update_voucher', { id: row.id })}>{row.abstractContent}</span>
          )
        }
      },
      tableColumn: [
        {
          title: '助记码',
          key: 'abstractCode',
          minWidth: 80,
          tooltip: true
        },
        {
          title: '创建公司',
          key: 'createEnterpriseName',
          minWidth: 90,
          tooltip: true
        },
        {
          title: '使用公司',
          key: 'useEnterpriseName',
          minWidth: 80,
          tooltip: true
        },
        {
          title: '创建人',
          key: 'creatorName',
          minWidth: 80,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 160,
          tooltip: true,
          render: (h, { row }) => {
            return (
              <span>{ this.$dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }</span>
            )
          }
        },
        {
          title: ' 修改人',
          key: 'updatorName',
          minWidth: 80,
          tooltip: true
        },
        {
          title: ' 修改时间',
          key: 'updateTime',
          minWidth: 160,
          tooltip: true,
          render: (h, { row }) => {
            return (
              <span>{ row.updateTime ? this.$dayjs(row.updateTime).format('YYYY-MM-DD HH:mm:ss') : '' }</span>
            )
          }
        }
      ],
      opreation: {
        title: '操作',
        key: 'action',
        width: 240,
        align: 'center',
        fixed: 'right',
        render: (h, { row, index, column }) => {
          return (
            <div>
              <span class="table-span" on-click={ this.handleDelRow.bind(this, { row }) }>删除</span>
            </div>
          )
        }
      },
      // 表格数据
      tableData: [],
      formItem: {},
      searchText: {},
      // 删除弹窗参数
      batchHandleModal: false, // 批量删除成功提示
      checked: '', // 批量删除成功提示的check
      batchhandleColumns: [], // 批量提示的表头
      batchhandleData: [], // 批量提示的表格数据
      batchDeleteColumns: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          className: 'table-index'
        },
        {
          title: '摘要内容',
          key: 'abstractContent',
          tooltip: true
        },
        {
          title: '助记码',
          key: 'abstractCode',
          tooltip: true
        },
        {
          title: '创建公司',
          key: 'createEnterpriseName',
          tooltip: true
        },
        // {
        //   title: '使用公司',
        //   key: 'useEnterpriseName',
        //   tooltip: true
        // },
        {
          title: '说明',
          key: 'referenceDescription',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.referenceDescription ? '#fa790e' : '#00a597'
              }
            }, params.row.referenceDescription ? params.row.referenceDescription : '删除成功')
          }
        }
      ],
      // 表格配置参数
      drawer: false
    }
  },
  created () {
    this.doGetUnitFormId()
  },
  mounted () {
    this.doInit()
    this.doGettableHeader()
  },
  methods: {
    // 用于存储列表数据的id
    ...mapMutations([
      'getListIds'
    ]),
    searchWord (val) {
      this.searchText.codeOrName = val
    },
    // 获取公司编码或名称中弹窗的形态
    doGetUnitFormId () {
      this.$request.post('/financeback/businessUnit/findFormList').then(result => {
        let { code, data } = result.data
        if (code === 200) {
          let _data = [{
            value: 0,
            label: '全部形态'
          }]
          data.forEach(item => {
            _data.push({
              value: item.id,
              label: item.name
            })
          })
          this.formList = _data
        }
      })
    },
    // 新增
    toCreateUnit () {
      this.doLocationDetail('create_voucher')
    },
    // 批量删除 --组件
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 多选弹窗公司-获取id
    doGetCompanyId (list) {
      this.isCompanyClear = false
      this.toReq.companyIdList = list
      let companyList = []
      this.toReq.companyIdList.forEach(item => {
        this.toReq.companyIdList = JSON.parse(item.id)
        companyList.push(this.toReq.companyIdList)
        this.toReq.companyIdList = companyList
      })
      this.doInit()
    },
    isCheck (val) {
      console.log(val)
      this.doReset1()
      this.isClear = val
    },
    // 多选弹窗公司-切换形态
    doSelect () {
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    // 多选弹窗公司-搜索
    doSearch () {
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    // 多选弹窗公司-重置
    doReset1 () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
      this.$set(this.companyParams, 'type', true)
    },
    // 多选弹窗公司-取消
    doCancelCompany () {
      this.doReset1()
    },
    // 初始化
    doInit () {
      let page = this.page
      this.loading = true
      if (this.toReq.companyIdList.length === 0) {
        this.toReq.companyIdList = null
      }
      this.$request.post('/financeback/commonAbstract/findCommonAbstractPage', { ...this.toReq, page, isEnterpriseAdmin: 1 }).then(res => {
        this.loading = false
        if (!this.toReq.companyIdList) {
          this.toReq.companyIdList = []
        }
        let { code, data } = res.data
        if (code === 200) {
          if (data.records.length === 0 && data.current >= 2) {
            this.page.current--
            this.doInit()
            return false
          }
          let that = this
          this.getListIds({ ids: data.records.map(n => { return n.id }), name: 'voucher' })
          this.tableData = data.records
          this.tableData.forEach(item => {
            that.selectMore.forEach(id => {
              if (item.id === id) {
                that.$set(item, '_checked', true)
              }
            })
          })
          if (this.tableData.length === 0) {
            this.tableHeight = 36
          } else {
            this.tableHeight = this.height
            console.log(this.tableHeight)
          }
          this.maxItems = data.total
        } else {
          this.tableData = []
          this.maxItems = 0
        }
      })
    },
    // 重置
    handleResetParams () {
      this.toReq.companyIdList = []
      this.toReq.contentOrCode = null
      this.isCompanyClear = true
      this.selectMore = []
      this.doInit()
    },
    onSelectCheckboxChange (val) {
      this.selectData = val
      let arr = []
      val.map(item => {
        arr.push(item.id)
      })
      this.selectMore = arr
    },
    // 单个删除
    handleDelRow (row) {
      console.log(row)
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        transfer: true,
        message: '注意：确认删除该数据？',
        button: ['确认', '取消'],
        yes () {
          that.$request.post('/financeback/commonAbstract/deleteCommonAbstractBatch', { idList: [row.row.id], isEnterpriseAdmin: 1 }).then(res => {
            let { code, data, message } = res.data
            if (code === 200) {
              console.log(data)
              that.selectMore.map((item, index, arr) => {
                if (item === row.row.id) {
                  arr.splice(index, 1)
                }
              })
              if (data.successList.length) {
                that.$Message.success('删除成功')
              } else {
                that.$Message.error('删除失败，' + data.failList[0].referenceDescription)
              }
              that.doInit()
            } else {
              that.$Message.error(message)
            }
          })
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 批量删除
    doDeleteBtn () {
      if (this.selectMore.length === 0) {
        this.$Message.info('必须在列表中至少选择一条数据才能点击删除！')
      } else {
        console.log('有数据')
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          transfer: true,
          message: '注意：确认删除该数据？',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl()
            that.doDeleteConfirm()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 批量删除调接口
    doDeleteConfirm () {
      this.$request.post('/financeback/commonAbstract/deleteCommonAbstractBatch', { idList: this.selectMore, isEnterpriseAdmin: 1 }).then(res => {
        let { data } = res.data
        if (res.status === 200) {
          this.batchHandleModal = true
          this.batchhandleColumns = this.batchDeleteColumns
          console.log(data)
          let dataList = []
          this.selectData.forEach(m => {
            data.successList.forEach(n => {
              if (m.id === n) {
                // 删除成功
                dataList.push({
                  abstractContent: m.abstractContent,
                  abstractCode: m.abstractCode,
                  createEnterpriseName: m.createEnterpriseName,
                  useEnterpriseName: m.useEnterpriseName,
                  referenceDescription: n.referenceDescription
                })
              }
            })
            data.failList.forEach(n => {
              if (m.id === n.businessId) {
                // 删除失败
                dataList.push({
                  abstractContent: m.abstractContent,
                  abstractCode: m.abstractCode,
                  createEnterpriseName: m.createEnterpriseName,
                  useEnterpriseName: m.useEnterpriseName,
                  referenceDescription: n.referenceDescription
                })
              }
            })
          })
          this.batchhandleData = dataList
          let success = data.successList ? data.successList.length : 0
          let fail = data.failList ? data.failList.length : 0
          this.checked = '删除成功' + success + '条,' + '删除失败' + fail + '条'
          this.doInit()
          this.selectMore = []
        }
      })
    },
    // 表格配置-按钮
    doSetTable () {
      this.drawer = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doInit()
      }
      this.drawer = false
    },
    // 表格配置-表头
    doGettableHeader () {
      let req = {
        menuCode: this.$route.name, // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
      }
      const that = this
      this.loading2 = true
      that.$request.post('/financeback/tableConfig/findList', req).then(res => {
        this.loading2 = false
        that.getTableList = []
        if (res.data.code === 200) {
          let newHeader = []
          if (res.data.data.localConfigList.length === 0) {
            newHeader = res.data.data.globalConfigList
          } else {
            newHeader = res.data.data.localConfigList
          }
          newHeader.forEach((item) => {
            item.key = item.columnName
            if (item.isShow) {
              that.getTableList.push(item)
            }
          })
          that.tableColumns = sortArr(that.tableColumn, that.getTableList)
          that.tableColumns.push(this.opreation)
          that.tableColumns.unshift(this.code)
          that.tableColumns.unshift(this.header)
        }
      })
    },
    // 分页功能
    doUpdateCurrentPage (val) {
      this.selectMore = []
      this.page.current = val
      this.doInit()
    },
    // 改变每页条数
    doUpdatePageSize (val) {
      this.selectMore = []
      this.page.size = val
      this.doUpdateCurrentPage(1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/css/base.less';
@import '../../../assets/css/redefine.less';
.voucher-container {
  .page-content {
    .query-condition {
      height: 40px;
      .ivu-row {
        top: -11px;
        left: -8px;
      }
      .ivu-form {
        .ivu-col-span-4 {
          display: block;
          width: 15.266667%;
        }
      }
      .ivu-form-item-content {
        line-height: 29px
      }
    }
    .page-content-table {
      margin-top: 0px;
      position: relative;
      padding-bottom: 10px;
    }
    .tableHeight {
      height: 36px;
    }
    .ivu-input-icon {
      color: #999
    }
  }
  .search-style {
    position: absolute;
    top: 8px;
    right:2px;
  }
}
</style>

<style lang="less">
@import '../../../assets/css/base.less';
@import '../../../assets/css/redefine.less';
.voucher-container {
  .ivu-input-search-icon {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
  }
  .page-content {
    .ivu-form-item-content {
      line-height: 29px
    }
  }
  .ivu-input-icon {
    color: #999
  }
  .ivu-checkbox-wrapper {
    margin-right: 0px;
  }
  .query-condition-lf {
    .maright {
      margin-right: 8px;
    }
    .select-width {
      width: 142px;
    }
    .query-input {
      width: 250px;
    }
    .searchButton {
      margin-left: -10px;
      // padding: 3px 8px 3px;
    }
    .ivu-btn-icon-only {
      padding: 2.9px 14px
    }
    .ivu-col-span-1 {
      width: 36px;
    }
  }
  .readonly {
    display: block;
    width: 100%;
    height: 32px;
    line-height: 32px;
    // padding: 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .iconfont {
      vertical-align: middle;
    }
  }
}
.title-modal{
  position: absolute;
  .ivu-modal{
    position: absolute;
    width: 480px !important;
    height: 200px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .ivu-modal-header{
      border: none;
      padding: 30px 0 0 30px;
      svg.iconfont.guide{
        font-size: 16px !important;
        color: #FA790E;
        position: absolute;
        top: 33px;
      }
      span{
        font-size: 16px;
        color: #333333;
        margin-left: 22px;
      }
    }
    .ivu-modal-body{
      font-size: 14px;
      color: #333333;
      opacity: 0.85;
      padding: 20px 0 40px 50px
    }
    .ivu-modal-footer{
      border: none;
      padding:0 30px 30px 18px;
      Button{
        border-radius: 4px;
      }
    }
  }
}
</style>
