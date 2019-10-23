<template>
  <section class="scheme-container">
    <Spin fix v-if="loading2" style="left: 8px;z-index: 10">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">多栏账方案设置</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreateUnit">新增</Button>
        <Button @click="deleteMore">删除</Button>
        <Button @click="doSetTable"><common-icon type="_table" :size="14"/></Button>
        <Button @click="doInit"><common-icon type="_refresh" :size="14"/></Button>
      </div>
    </section>
    <section class="page-content">
      <!-- <Spin fix v-if="loading" style="left:8px;z-index:20"></Spin> -->
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class="screen query-change">
            <Form :model="formItem" :label-width="0" class="form-item">
              <Col span="4">
              <multi-select
              width="100%"
              title="选择总账账簿"
              type="accountBook"
              :data="paramsList"
              :isClear="clear"
              isEnterpriseAdmin=1
              @on-select="handleGetCompanyIds"
              @on-clear="isCheck"
              @on-cancel="doReset"
              placeholder="总账账簿编码/名称">
              <Row :gutter="16" slot="search">
                <Col span="4" class="page-left-search">
                  <Select v-model="paramsList.status" class="clearList" @on-change="doSearch">
                    <Option v-for="item in modal_typeList" :key="item.value" :value="item.value">
                      {{item.label}}</Option>
                  </Select>
                </Col>
                <Col span="4" class="page-left-search">
                  <Select v-model="defaultAddress" @on-change="doSearch">
                    <Option value="0" label="全部会计准则"></Option>
                    <Option value="1" label="中国大陆企业"></Option>
                  </Select>
                </Col>
                <Col span="4" class="page-left-search">
                  <Select v-model="defaultRMB" @on-change="doSearch">
                    <Option value="0" label="全部记账本位币"></Option>
                    <Option value="1" label="人民币"></Option>
                  </Select>
                </Col>
                <Col span="6">
                  <Row class-name="search-input-content">
                    <Col span="21">
                      <Input v-model="companyCodeOrName" :maxlength="50" placeholder="账簿编码/名称" clearable
                        @on-enter="doSearch" enter-button @on-clear="doSearch"></Input>
                    </Col>
                    <Col span="3" style="padding-left:0px">
                      <Button icon="ios-search" class="search-icon-button" @click="doSearch"></Button>
                    </Col>
                  </Row>
                </Col>
                <Col span="2">
                  <Button class="reset-button" @click="doReset">重置</Button>
                </Col>
              </Row>
            </multi-select>
            </Col>
            <Col span="4">
              <Input class="" v-model="toReq.codeOrName"  @on-enter="doInit" clearable placeholder="多栏账方案编码/名称" @on-clear="doInit"></Input>
            </Col>
            <Col span="1" >
              <Button icon="ios-search" class="search-icon-button search-scheme" @click="doInit"></Button>
            </Col>
            <Col span="1" >
              <Button class="reset-button" @click="doResetScheme">重置</Button>
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
        <Page id="pageIdgg" class-name="pages" :total="maxItems" :page-size="page.size" :page-size-opts="[20, 50, 100, 200, 500, 1000]" show-elevator show-sizer @on-change="doUpdateCurrentPage" @on-page-size-change="doUpdatePageSize"></Page>
        <Button type="primary" size="small" @click="goElevatorPage('pageIdgg')">GO</Button>
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
import multiSelect from '_c/multi-select'
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import batchHandleModal from '_c/batchHandleModal' // 批量删除
import tableConfig from '_c/tableConfigModal/tableConfig.vue' // 表格配置
import { saasMixin } from '@/libs/mixins'
import { getHeight, sortArr } from '@/libs/tools.js'
export default {
  name: 'scheme_index',
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
      select_loading: false,
      // table 的多选
      selectMore: [],
      selectData: [],
      maxItems: 1,
      paramsList: {
        codeOrName: '',
        ledgerStatus: 1,
        status: 1
      },
      defaultAddress: '1',
      defaultRMB: '1',
      clear: false,
      companyCodeOrName: '',
      // 配置表头
      tableColumns: [],
      header: {
        type: 'selection',
        width: 49,
        multiple: true,
        key: 'select',
        align: 'center'
      },
      code: {
        title: '编码',
        key: 'code',
        minWidth: 115,
        tooltip: true,
        render: (h, { row, index, column }) => {
          return (
            <span class="table-span" on-click={this.doLocationDetail.bind(this, 'update_scheme', { id: row.id })}>{row.code}</span>
          )
        }
      },
      tableColumn: [
        {
          title: '名称',
          key: 'schemeName',
          minWidth: 80,
          tooltip: true
        },
        {
          title: '查询类型',
          key: 'schemeType',
          minWidth: 130,
          tooltip: true,
          render: (h, { row, index, column }) => {
            return (
              <span>{ row.schemeType ? '辅助核算多栏账' : '科目多栏账' }</span>
            )
          }
        },
        {
          title: '会计科目',
          key: 'accountSubjectName',
          minWidth: 90,
          tooltip: true
        },
        {
          title: '辅助核算项',
          key: 'auxiliaryItemName',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '总账账簿',
          key: 'accountBookName',
          minWidth: 90,
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
              <span class="table-span" on-click={this.doDeleteScheme.bind(this, { row, index, column })}>删除</span>
            </div>
          )
        }
      },
      tableData: [
        {
          code: 'FGL001',
          schemeName: '管理翻页科目多栏明细账',
          schemeType: '科目多栏账',
          accountSubjectName: '管理费用',
          auxiliaryItemName: '客户',
          accountBookName: '上海餐易通科技有限公司-核算账簿'
        }
      ],
      formItem: {
        input: ''
      },
      select_list: [],
      toReq: {
        codeOrName: null,
        accountBookIds: []
      },
      page: {
        current: 1,
        size: 20
      },
      // 表格高度
      tableHeight: 0,
      height: getHeight(80),
      // 删除弹窗参数
      batchHandleModal: false, // 批量建账成功提示
      checked: '', // 批量建账成功提示的check
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
          title: '编码',
          key: 'code',
          tooltip: true
        },
        {
          title: '名称',
          key: 'schemeName',
          tooltip: true
        },
        {
          title: '查询类型',
          key: 'schemeType',
          tooltip: true,
          render: (h, { row, index, column }) => {
            return (
              <span>{ row.schemeType ? '辅助核算多栏账' : '科目多栏账' }</span>
            )
          }
        },
        {
          title: '会计科目',
          key: 'accountSubjectName',
          tooltip: true
        },
        // {
        //   title: '辅助核算项',
        //   key: 'auxiliaryItemName',
        //   tooltip: true
        // },
        // {
        //   title: '总账账簿',
        //   key: 'accountBookName',
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
  mounted () {
    this.doInit()
    this.doGettableHeader()
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    // 账簿 - 搜索事件
    doSearch () {
      this.$set(this.paramsList, 'status', this.paramsList.status)
      this.$set(this.paramsList, 'codeOrName', this.companyCodeOrName)
      this.$set(this.paramsList, 'type', true)
    },
    // 账簿 - 重置
    doReset () {
      this.defaultAddress = '1'
      this.defaultRMB = '1'
      this.companyCodeOrName = ''
      this.$set(this.paramsList, 'status', 1)
      this.$set(this.paramsList, 'codeOrName', '')
      this.$set(this.paramsList, 'type', true)
    },
    isCheck (val) { // 多选总账账簿---
      console.log(val, 'isCheck')
      this.clear = val
      this.doReset()
    },
    // 账簿 - 获取id列表
    handleGetCompanyIds (list) {
      console.log('账簿', list)
      let ids = []
      list.map(n => ids.push(n.id))
      this.toReq.accountBookIds = ids
      this.doInit()
    },
    // 批量删除 --组件
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 初始化
    doInit () {
      this.loading = true
      let req = {
        codeOrName: this.toReq.codeOrName ? this.toReq.codeOrName : null,
        accountBookIds: this.toReq.accountBookIds.length ? this.toReq.accountBookIds : null,
        page: {
          ...this.page
        }
      }
      this.$request.post('/ledger/multiColumnScheme/findMultiColumnSchemePage', req).then(res => {
        this.loading = false
        if (!this.toReq.accountBookIds) {
          this.toReq.accountBookIds = []
        }
        let { code, data } = res.data
        if (code === 200) {
          if (data.records.length === 0 && data.current >= 2) {
            this.page.current--
            this.doInit()
            return false
          }
          let that = this
          this.getListIds({ ids: data.records.map(n => { return n.id }), name: 'scheme' })
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
    // 新增
    toCreateUnit () {
      this.doLocationDetail('create_scheme')
    },
    // 行删除
    doDeleteScheme (row) {
      console.log('单删', row)
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        transfer: true,
        message: '注意：确认删除该数据？',
        button: ['确认', '取消'],
        yes () {
          that.$request.post('/ledger/multiColumnScheme/batchDeleteMultiColumnScheme', { idList: [row.row.id] }).then(res => {
            let { code, data } = res.data
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
            }
          })
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 多选
    onSelectCheckboxChange (sel) {
      this.selectData = sel
      let req = []
      sel.map(item => {
        req.push(item.id)
      })
      this.selectMore = req
    },
    // 批量删除
    deleteMore () {
      if (this.selectMore.length) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          transfer: true,
          message: '注意：确认删除该数据？',
          button: ['确认', '取消'],
          yes () {
            that.doDeleteConfirm()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.info('必须在列表中至少选择一条数据才能点击删除！')
      }
    },
    doDeleteConfirm () {
      this.$request.post('/ledger/multiColumnScheme/batchDeleteMultiColumnScheme', { idList: this.selectMore }).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          this.batchHandleModal = true
          this.batchhandleColumns = this.batchDeleteColumns
          console.log(data)
          let dataList = []
          this.selectData.forEach(m => {
            data.successList.forEach(n => {
              if (m.id === n) {
                // 删除成功
                dataList.push({
                  code: m.code,
                  schemeName: m.schemeName,
                  schemeType: m.schemeType,
                  accountSubjectName: m.accountSubjectName,
                  // auxiliaryItemName: m.auxiliaryItemName,
                  // accountBookName: m.accountBookName,
                  referenceDescription: n.referenceDescription
                })
              }
            })
            data.failList.forEach(n => {
              if (m.id === n.businessId) {
                // 删除失败
                dataList.push({
                  code: m.code,
                  schemeName: m.schemeName,
                  schemeType: m.schemeType,
                  accountSubjectName: m.accountSubjectName,
                  // auxiliaryItemName: m.auxiliaryItemName,
                  // accountBookName: m.accountBookName,
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
    // 界面重置
    doResetScheme () {
      this.clear = true
      this.toReq.codeOrName = null
      this.toReq.accountBookIds = []
      this.selectMore = []
      this.doInit()
    },
    remoteMethod () {},
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
.scheme-container {
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
          width: 18.20%;
        }
      }
      .ivu-form-item-content {
        line-height: 29px
      }
    }
    .page-content-table {
      margin-top: 0px;
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
  .search-scheme {
    position: relative;
    right: 10px;
  }
  .ivu-col-span-1 {
    width:36px
  }
}
</style>

<style lang="less">
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
.scheme-container {
  .ivu-input-search-icon {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
  }
  .page-content {
    .ivu-form-item-content {
      line-height: 29px
    }
  }
  .ivu-btn-icon-only {
    padding: 3px 10px;
    margin-left: 0px;
  }
}
</style>
