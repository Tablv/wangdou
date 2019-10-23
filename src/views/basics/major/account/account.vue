<template>
  <section class="bank-container">
    <Spin fix v-if="isLoading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">银行账号列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doAdd">新增</Button>
        <Button class="span-space" @click="doBacthDelete">删除</Button>
        <Button class="span-space" @click="doBacthDisable">禁用</Button>
        <Button class="span-space" @click="doBacthUnDisable">反禁用</Button>
        <Button @click.native="doClickExport">
          <!-- 导入 -->
          <common-icon type="_export" :size="14"></common-icon>
        </Button>
        <Button @click="doClickDown">
          <!-- 导出 -->
          <common-icon type="_import" :size="14"></common-icon>
        </Button>
        <!-- 表格配置 -->
        <Button class="span-space" @click.native = "doClickConfig">
          <common-icon type="_table"></common-icon>
        </Button>
        <Button @click="doRefresh">
          <common-icon type="_refresh" :size="14"/>
        </Button>
      </div>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class="screen">
            <Col span="4" class="first-nospace" style="padding-top: 0;">
              <multi-select :data="companyParams"
              @on-select="doGetCompanyId"
              @on-visibe-change="doReset"
              placeholder="创建公司编码/名称"
              title="选择公司"
              type="company"
              :width="`100%`"
              :isEnterpriseAdmin= "`1`"
              :defaultValue="false"
              :isClear="isCompanyClear">
                <Row :gutter="10" slot="search">
                  <Col span="3">
                    <Select v-model="companyFormId" @on-change="doSelect">
                      <Option v-for="item in formList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                  </Col>
                  <Col span="5">
                    <Input class="search-button" v-model="companyCodeOrName" placeholder="编码/名称" clearable @on-enter="doSearch" @on-clear="doSearch">
                      <Button slot="append" icon="ios-search" @click="doSearch"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doReset">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <!-- 全部账户类型 -->
            <Col span="2" style="padding-top: 0;">
              <Select v-model="params.accType" @on-change='doHandleChange' clearable placeholder="全部账号类型">
                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <!-- 全部账户用途 -->
            <Col span="2" style="padding-top: 0;">
              <Select v-model="params.accUsage" @on-change='doHandleChange' clearable placeholder="全部账户用途">
                <Option v-for="item in useList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <!-- 全部数据数据 -->
            <Col span="2" style="padding-top: 0;">
              <Select v-model="params.isEnable" @on-change='doHandleChange' clearable placeholder="全部数据形态">
                <Option v-for="item in stateList.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="4" style="padding-top: 0;">
               <Input class="search-button" v-model="accountOrBankName" placeholder="银行账号/账户名称"
               @on-enter="doHandleChange"
               @on-change="doInputChange"
               clearable>
                <Button slot="append" icon="ios-search" @click="doHandleChange"></Button>
              </Input>
            </Col>
              <Col span="1" style="padding-top: 0;">
                <Button @click="handleReset">重置</Button>
              </Col>
          </Row>
        </div>
      </div>
      <div class="page-content-table initTable">
        <Spin fix v-if="tableLoading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          :columns="tableColumns"
          :data="tableData"
          :height="tableData.length ? getTableheight : 0"
          @select-all="doSelectTableData"
          @select-change="doSelectTableData"
          >
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-grid>
        <!-- <Table
        :height="getTableheight"
        :columns="tableColumns"
        :no-data-text="null"
        :data="tableData"
        :tooltip="true"
        @on-selection-change="doSelectTableData">
        </Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata> -->
      </div>
    </section>
    <section class="page-footer" v-if="tableData.length">
      <div class="page-footer-lf">
        已选择<span class="page-footer-span"><strong>{{datacount}}</strong></span>项，共<span class="page-footer-span">{{total}}</span>条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="pageAccountList"
          class-name="pages"
          :total="total"
          :current="current"
          :page-size="size"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="handleChangePage"
          />
        <Button size="small" @click="goElevatorPage('pageAccountList')">Go</Button>
      </div>
    </section>
    <a id="a_id"></a>
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" :templateType="templateType"></upload-modal>
    <table-config @close="doTableClose" :drawer="isConfig" ></table-config>
    <!-- 删除提示 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="deleteModalShow"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
          <common-icon type="_guide" class="guide"></common-icon>
          <span>提示信息</span>
      </p>
      <p>
        <span>{{isTitleInModal}}</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalDeleteOk">确认</Button>
        <Button type="default" @click="doModalDeleteCancel">取消</Button>
      </div>
    </Modal>
    <!-- 禁用提示 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disableModalShow"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
          <common-icon type="_guide" class="guide"></common-icon>
          <span>提示信息</span>
      </p>
      <p>
        <span>{{isTitleInModal}}</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalDisableOk">确认</Button>
        <Button type="default" @click="doModalDisableCancel">取消</Button>
      </div>
    </Modal>
    <!-- 反禁用提示 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="unDisableModalShow"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
          <common-icon type="_guide" class="guide"></common-icon>
          <span>提示信息</span>
      </p>
      <p>
        <span>{{isTitleInModal}}</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalUnDisableOk">确认</Button>
        <Button type="default" @click="doModalUnDisableCancel">取消</Button>
      </div>
    </Modal>
    <batchHandleModal ref="upload" :checked="checked" :batchhandleColumns="failInfoColumns" :batchHandleModal="isCheckModal" :batchhandleData="batchhandleData" @modalClose="closeAlertTips"></batchHandleModal>
  </section>
</template>

<script>
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { sortArr, getHeight } from '@/libs/tools.js' // transObjToArr,
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
import multiSelect from '_c/multi-select'
export default {
  name: 'account_index',
  components: {
    CommonIcon,
    uploadModal,
    tableConfig,
    nodata,
    batchHandleModal,
    multiSelect
  },
  data () {
    return {
      checked: '',
      getTableheight: 36,
      batchhandleData: [],
      isCompanyClear: false,
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      companyCodeOrName: '', // 编码或名称
      companyFormId: 0, // 公司形态
      formList: [
        {
          value: 0,
          label: '全部形态'
        },
        {
          value: 1,
          label: '总部'
        },
        {
          value: 2,
          label: '公司'
        },
        {
          value: 3,
          label: '门店'
        },
        {
          value: 4,
          label: '中央厨房'
        },
        {
          value: 5,
          label: '仓储中心'
        },
        {
          value: 6,
          label: '配送中心'
        },
        {
          value: 7,
          label: '采购中心'
        },
        {
          value: 8,
          label: '其他'
        }
      ],
      alertShow: true, // 提示信息
      isLoading: true, // 加载动画
      isTitleInModal: '', // 提示信息
      id: null, // 银行ID
      companyName: null, // 归属公司
      selectClear: false, // 归属公司置空
      singleDeleteId: null, // 单个删除的数据id
      singleDisableId: null, // 单个禁用的数据id
      singleUnDisableId: null, // 单个反禁用的数据id
      deleteModalShow: false, // 批量删除提示
      disableModalShow: null, // 批量禁用提示
      unDisableModalShow: false, // 批量反禁用提示
      allSelectIds: [], // 批量的id
      allVersions: [],
      isAllDelete: false, // 是否为批量删除
      isAllDisable: false, // 是否为批量禁用
      isAllUnDisable: false, // 是否为批量反禁用
      isConfig: false, // 表格配置是否显示
      isupload: false, // 导入弹窗
      templateType: 'bank_account', // 导入模板类型
      isHover: false, // table中提示信息是否显示
      datacount: 0, // 选中的数据个数
      selectData: [], // 多选的数据
      size: 20, // 每页显示的数据个数
      current: 1, // 页码
      total: 0, // 数据总数
      routeName: 'account_index', // 路由name
      lastUpdateTime: null, // 修改时间
      successList: [], // 成功数量
      failList: [], // 失败数量
      isCheckModal: false, // 批量删除失败详情弹窗
      failInfoColumns: [ // 批量删除失败信息表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center',
          className: 'table-index'
        },
        {
          title: '详情',
          key: 'details',
          tooltip: true,
          minWidth: 110
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 40
        },
        {
          title: '说明',
          key: 'referenceDescription',
          minWidth: 90
        }
      ],
      // defaultCompanyList: [], // 默认公司ID列表
      accountOrBankName: '',
      params: { // 查询参数
        isEnterpriseAdmin: 1, // 是否管理员
        companyIdList: [], // 查询的公司Ids
        accType: null, // 账户类型
        accUsage: null, // 账户用途
        isEnable: null, // 数据状态
        accountOrBankName: null // 银行账号/开户银行
      },
      typeList: [], // 全部账户类型
      useList: [], // 全部账户用途
      stateList: {// 全部数据状态
        value: '',
        options: [
          {
            value: 0,
            label: '已失效'
          },
          {
            value: 1,
            label: '已生效'
          }
        ]
      },
      tableColumns: [],
      header: {
        type: 'selection',
        field: 'selection',
        width: 40,
        multiple: true,
        align: 'center'
      },
      account: {
        title: '银行账号',
        key: 'code',
        field: 'code',
        minWidth: 150,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click= { this.toUpdate.bind(this, row) }>{row.account}</span>
              </div>
            ]
          },
          header: ({ row, index, column }, h) => {
            return [
              <div>
                <span style="margin-right: 13px;">银行账号</span>
                <Poptip trigger="hover" content="编码规则:1-30位数字" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            ]
          }
        }
      },
      tableColumn: [
        {
          title: '账户名称',
          key: 'name',
          field: 'name',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '开户银行',
          key: 'depositBankName',
          field: 'depositBankName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '账户类型',
          key: 'accTypeName',
          field: 'accTypeName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '账户用途',
          key: 'accUsageName',
          field: 'accUsageName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '创建公司',
          key: 'companyName',
          field: 'companyName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '核算主体',
          key: 'auxiliaryName',
          field: 'auxiliaryName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '修改时间',
          key: 'updateTime',
          field: 'updateTime',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '修改人',
          key: 'updatorName',
          field: 'updatorName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '反禁用时间',
          key: 'enabledTime',
          field: 'enabledTime',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '反禁用人',
          key: 'enabledUserName',
          field: 'enabledUserName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '禁用时间',
          key: 'disabledTime',
          field: 'disabledTime',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '禁用人',
          key: 'disabledUserName',
          field: 'disabledUserName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          field: 'createTime',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '创建人',
          key: 'creatorName',
          field: 'creatorName',
          minWidth: 150,
          tooltip: true
        }
      ],
      isEnabled: {
        title: '数据状态',
        key: 'isEnable',
        field: 'isEnable',
        align: 'center',
        minWidth: 150,
        slots: {
          default: ({ row }, h) => {
            return [
              <div>
                <span class="is-enable-box" v-show={row.isEnable === 0} disabled><span class="is-enable"></span>已失效</span>
                <span class="is-enable-box" v-show={row.isEnable === 1} useable><span class="is-enable"></span>已生效</span>
              </div>
            ]
          }
        }
      },
      opreation: {
        title: '操作',
        key: 'isAccounting',
        field: 'isAccounting',
        minWidth: 240,
        fixed: 'right',
        align: 'left',
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              h('div', {}, [
                h('span', {
                  class: 'table-span',
                  on: {
                    click: () => {
                      // 删除
                      this.isTitleInModal = '注意：删除后将不可恢复！请确认是否要删除数据？'
                      this.isAllDelete = false
                      this.deleteModalShow = true
                      this.singleDeleteId = row
                    }
                  }
                }, '删除'),
                h('span', {
                  class: 'table-span',
                  style: {
                    display: row.isEnable === 1 ? 'inline' : 'none'
                  },
                  on: {
                    click: () => {
                      // 禁用
                      this.isTitleInModal = '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据'
                      this.isAllDisable = false
                      this.disableModalShow = true
                      this.singleDisableId = row
                    }
                  }
                }, '禁用'),
                h('span', {
                  class: 'table-span',
                  style: {
                    display: row.isEnable === 0 ? 'inline' : 'none'
                  },
                  on: {
                    click: () => {
                      // 反禁用
                      this.isTitleInModal = '请确认是否要反禁用数据？'
                      this.unDisableModalShow = true
                      this.isAllUnDisable = false
                      this.singleUnDisableId = row
                    }
                  }
                }, '反禁用')
              ])
            ]
          }
        }
      },
      tableLoading: false,
      tableData: [], // // 列表数据数组
      getTableList: [] // 接口获取的表头数组
    }
  },
  mixins: [saasMixin],
  created () {
    // this.doGetDefaultCompanList()
    this.doGettableHeader()
    this.doGetInit()
    // 初始化账户类型
    this.initAccUsage()
    // 初始化账户用途
    this.initAccType()
  },
  computed: {
    // 批量操作提示信息
    successNum () {
      return this.successList.length
    },
    failNum () {
      return this.failList.length
    }
  },
  watch: {
    allSelectIds (data, oldData) {
      this.datacount = this.allSelectIds.length
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    doSelect () {
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    doSearch () {
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    doReset () {
      console.log('nihao')
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    doGetCompanyId (itemList) {
      this.isCompanyClear = false
      // this.params.companyIdList = itemList.length === 0 ? this.defaultCompanyList : itemList.map(item => item.id)
      this.params.companyIdList = itemList.map(item => item.id)
      this.doGetInit()
    },
    // doGetDefaultCompanList () {
    //   let params = {
    //     isEnterpriseAdmin: 1,
    //     menuCode: 'account_index',
    //     page: { size: 1000, current: 1 },
    //     rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId
    //   }
    //   this.$request.post('/financeback/company/findCompanyPage', params).then(({ data }) => {
    //     if (data.code === 200) {
    //       // this.params.companyIdList = data.data.records.map(item => item.id)
    //       this.params.companyIdList = []
    //       this.defaultCompanyList = this.params.companyIdList
    //       this.doGetInit()
    //     }
    //   })
    // },
    // 初始化
    doGetInit () {
      this.isLoading = true
      let req = {
        ...this.params,
        isEnterpriseAdmin: 1,
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.$request.post('/financeback/bankAccount/findBankAccountPage', req).then(res => {
        this.isLoading = false
        let { code, data } = res.data
        if (code === 200) {
          if (!data.records.length && this.current > 1) {
            --this.current
            return this.doGetInit()
          }
          this.getListIds({ ids: data.records.map(n => { return n.id }), name: 'account' })
          // 列表数据
          data.records = data.records.map(item => Object.assign(item, item.manageInfo))
          this.getTableheight = data.records.length === 0 ? 36 : getHeight(65)
          this.tableData = data.records
          this.tableData.forEach((item) => {
            if (item.createTime) { // 创建时间
              item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.updateTime) { // 修改时间
              item.updateTime = this.$dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.disabledTime) { // 禁用时间
              item.disabledTime = this.$dayjs(item.disabledTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (item.enabledTime) { // 反禁用时间
              item.enabledTime = this.$dayjs(item.enabledTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          // 分页
          this.id = data.id
          this.total = data.total
          this.size = data.size
          this.current = data.current
        } else {
          this.tableData = []
          this.total = 0
        }
      })
      this.dataCount = 0
    },
    doCurrentReset () {
      this.current = 1
    },
    // 根据公司编码/名称搜索
    // handleGetCompanyIds (ids) {
    //   this.params.companyIdList = ids
    //   this.doCurrentReset()
    //   this.doGetInit()
    // },
    doHandleChange () {
      this.params.accountOrBankName = this.accountOrBankName
      this.doCurrentReset()
      this.doGetInit()
    },
    doInputChange (event) {
      // 查询条件不为空，绑定条件为空时，执行赋值，查询
      if (this.params.accountOrBankName && !this.accountOrBankName) {
        this.doHandleChange()
      }
    },
    // 重置
    handleReset () {
      this.selectClear = true // 重置公司组件
      this.params.accType = null // 账户类型
      this.params.accUsage = null // 账户用途
      this.params.isEnable = null // 数据状态
      this.params.accountOrBankName = null // 银行账号/开户银行
      this.accountOrBankName = null
      this.size = 20
      this.isCompanyClear = true
      this.doCurrentReset()
      this.doGetInit()
    },
    toUpdate (row) {
      this.doLocationDetail('update_account', { id: row.id })
    },
    // 新增按钮
    doAdd () {
      this.doLocationDetail('create_account')
    },
    // 点击批量删除
    doBacthDelete () {
      this.isTitleInModal = '注意：删除后将不可恢复！请确认是否要删除数据？'
      if (this.allSelectIds.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      this.isAllDelete = true
      this.deleteModalShow = true
    },
    // 关闭批量删除提示
    closeAlertTips (data) {
      this.isCheckModal = data
    },
    // 筛选删除失败项数据
    getDeleteFail (failList, successList, message) {
      this.batchhandleData = []
      if (failList.length) {
        failList.forEach(item => {
          this.tableData.forEach((ele, index) => {
            if (item.businessId === ele.id) {
              ele.status = '失败'
              ele.details = `${message}:"${ele.account}"银行账号-${ele.name}`
              ele.referenceDescription = item.referenceDescription
              this.batchhandleData.push(ele)
            }
          })
        })
      }
      if (successList.length) {
        successList.forEach(item => {
          this.tableData.forEach((ele, index) => {
            if (item === ele.id) {
              ele.status = '成功'
              ele.details = `${message}:"${ele.account}"银行账号-${ele.name}`
              ele.referenceDescription = `${message}成功`
              this.batchhandleData.push(ele)
            }
          })
        })
      }
      this.allSelectIds = []
      this.allVersions = []
      this.isCheckModal = true
      this.checked = `${message}成功${successList.length}个,${message}失败${failList.length}个`
    },
    // 删除modal里的确定
    doModalDeleteOk () {
      let reqData = {}
      this.tableLoading = true
      this.deleteModalShow = false
      if (this.isAllDelete) {
        // 多选删除
        reqData.idList = this.allSelectIds
        reqData.versionList = this.allVersions
        reqData.isEnterpriseAdmin = 1
        this.$request.post('/financeback/bankAccount/deleteBankAccountBatch', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false
          this.allSelectIds = []
          this.allVersions = []
          if (status === 'success') {
            this.getDeleteFail(data.failList, data.successList, '删除')
          }
          this.doGetInit()
        })
      } else {
        // 单选删除
        reqData = {
          id: this.singleDeleteId.id,
          version: this.singleDeleteId.version,
          isEnterpriseAdmin: 1
        }
        this.$request.post('/financeback/bankAccount/deleteBankAccount', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false
          this.singleDeleteId = ''
          if (status === 'success') {
            if (data.successList.length) {
              this.$Message.success('删除成功')
              this.doGetInit()
            } else {
              this.$Message.error('删除失败' + data.failList[0].referenceDescription)
            }
          }
        })
      }
    },
    // 删除modal里的取消
    doModalDeleteCancel () {
      this.deleteModalShow = false
      // this.$Message.info('已取消')
    },
    // 点击批量禁用
    doBacthDisable () {
      this.isTitleInModal = '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据'
      if (this.allSelectIds.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      this.isAllDisable = true
      this.disableModalShow = true
    },
    // 禁用modal里的确定
    doModalDisableOk () {
      let reqData = {}
      this.tableLoading = true
      this.disableModalShow = false
      if (this.isAllDisable) {
        // 多选
        reqData.idList = this.allSelectIds
        reqData.versionList = this.allVersions
        reqData.isEnterpriseAdmin = 1
        this.$request.post('/financeback/bankAccount/disableBankAccountBatch', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false
          this.allSelectIds = []
          this.allVersions = []
          if (status === 'success' && data) {
            this.getDeleteFail(data.failList, data.successList, '禁用')
            this.doGetInit()
          }
        })
      } else {
        // 单选
        reqData = {
          id: this.singleDisableId.id,
          version: this.singleDisableId.version,
          isEnterpriseAdmin: 1
        }
        this.$request.post('/financeback/bankAccount/disableBankAccount', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false
          this.singleDisableId = ''
          if (status === 'success') {
            if (data.successList.length) {
              this.$Message.success('禁用成功')
              this.doGetInit()
            } else {
              this.$Message.error('禁用失败' + data.failList[0].referenceDescription)
            }
          }
        })
      }
    },
    // 禁用modal里的取消
    doModalDisableCancel () {
      this.disableModalShow = false
      // this.$Message.info('已取消')
    },
    // 点击批量反禁用
    doBacthUnDisable () {
      this.isTitleInModal = '请确认是否要反禁用数据？'
      if (this.allSelectIds.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      this.isAllUnDisable = true // 操作类型标志 true 批量操作 false 行操作
      this.unDisableModalShow = true // 打开反禁用提示框
    },
    // 反禁用modal里的确定
    doModalUnDisableOk () {
      let reqData = {}
      this.tableLoading = true // 打开loading
      this.unDisableModalShow = false // 关闭弹窗
      if (this.isAllUnDisable) {
        // 多选
        reqData.idList = this.allSelectIds
        reqData.versionList = this.allVersions
        reqData.isEnterpriseAdmin = 1
        this.$request.post('/financeback/bankAccount/enableBankAccountBatch', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false // 取消loading
          this.allSelectIds = [] // 清空选中数据
          this.allVersions = []
          if (status === 'success' && data) {
            this.getDeleteFail(data.failList, data.successList, '反禁用')
          }
          this.doGetInit()
        })
      } else {
        // 单选
        reqData = {
          id: this.singleUnDisableId.id,
          version: this.singleUnDisableId.version,
          isEnterpriseAdmin: 1
        }
        this.$request.post('/financeback/bankAccount/enableBankAccount', reqData).then(res => {
          let { status, data } = res.data
          this.tableLoading = false
          this.singleUnDisableId = '' // 操作数据
          this.unDisableModalShow = false
          if (status === 'success') {
            if (data.successList.length) {
              this.$Message.success('反禁用成功')
              this.doGetInit()
            } else {
              this.$Message.error('反禁用失败' + data.failList[0].referenceDescription)
            }
          }
        })
      }
    },
    // 反禁用里的取消
    doModalUnDisableCancel () {
      this.unDisableModalShow = false
      // this.$Message.info('已取消')
    },
    // // 点击选项配置
    // doClickSelect () {
    //   this.isSelect = true
    // },
    // // 监听选项配置关闭
    // doSelectClose (msg) {
    //   this.isSelect = false
    // },
    // doSelectCancel () {
    //   this.isSelect = !this.isSelect
    // },
    // 获取表格
    doGettableHeader () {
      let req = {
        isEnterpriseAdmin: 1,
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: 'account_index', // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId // 用户ID
      }
      this.$request.post('/financeback/tableConfig/findList', req).then(res => {
        this.getTableList = []
        if (res.data.code === 200) {
          let newHeader = []
          res.data.data.localConfigList.length === 0 ? newHeader = res.data.data.globalConfigList : newHeader = res.data.data.localConfigList
          newHeader.forEach((item) => {
            item.key = item.columnName
            if (item.isShow) {
              this.getTableList.push(item)
            }
          })
          this.tableColumns = sortArr(this.tableColumn, this.getTableList)
          this.tableColumns.push(this.isEnabled)
          this.tableColumns.push(this.opreation)
          this.tableColumns.unshift(this.account)
          this.tableColumns.unshift(this.header)
        }
      })
    },
    // 点击导出
    doClickDown () {
      let params = Object.assign({}, this.params, { isEnterpriseAdmin: 1 })
      this.$request.post('/financeback/bankAccount/exportExcel', params, 'blob').then(({ headers, data }) => {
        let suffix = headers['content-disposition'].split('.')[1]
        const aLink = document.getElementById('a_id')
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = `银行账号列表.${suffix}` // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
      this.$refs.upload.cashFlowId = this.cashFlowId
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = msg
      this.doGetInit()
    },
    // 点击表格配置
    doClickConfig () {
      this.isConfig = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doGetInit()
      }
      this.isConfig = false
    },
    // 刷新
    doRefresh () {
      this.selectData = []
      this.allSelectIds = []
      this.doGetInit()
    },
    // 列表多选
    doSelectTableData ({ selection }) {
      this.selectData = selection
      this.allSelectIds = selection.map(d => d.id)
      this.allVersions = selection.map(d => d.version)
    },
    helpHover () {
      this.isHover = true
    },
    loseHover () {
      this.isHover = false
    },
    // 改变当前页
    handleChangePage (pageNo) {
      this.current = pageNo
      this.doGetInit()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.handleChangePage(1)
    },
    // 初始化账户类型
    initAccType () {
      this.$request.post('/financeback/bankAccount/findAccType', { isEnterpriseAdmin: 1 }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.typeList = res.data.data
        }
      })
    },
    // 初始化账户用途
    initAccUsage () {
      this.$request.post('/financeback/bankAccount/findAccUsage', { isEnterpriseAdmin: 1 }).then(res => {
        if (res.data.code === 200 && res.data) {
          this.useList = res.data.data
        }
      })
    },
    changeClear (data) {
      this.selectClear = !data
    }
  }
}
</script>

<style lang="less" >
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
.bank-container {
  .demo-spin-icon-load{ // loading动画
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-spin-fix { // loading层级
    z-index: 1000 !important;
  }
  .page-content {
    // 搜索条件
    .query-condition {
      .query-condition-lf {
        .screen {
          //消除间距
          .first-nospace {
            padding-left: 0 !important;
          }
          .search-button {
            top: 0 ;
          }
        }
      }
    }
    // 表格
    .page-content-table {
      padding-bottom: 0px !important;
      .ivu-table-wrapper {
        border: none;
        .ivu-table {
          &:after {
            display: none;
          }
          td {
            height: 32px;
          }
        }
      }
      .header-icon { // 表头问号
        width: 10px;
        .ivu-icon {
          margin-left: -5px;
          margin-top: -1px;
          color:#d7d7d7;
          &:hover {
            color: #fa790e;
          }
        }
      }
    }
  }
  // 页脚 数量间距
  .page-footer {
    .page-footer-span {
      margin: 0 5px;
    }
  }
  // 提示框样式
  .title-modal{
    position: absolute;
    .ivu-modal{
      position: absolute;
      width: 480px !important;
      height: 200px;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin:auto;
      .ivu-modal-header{
        border: none;
        padding: 30px 0 0 30px;
        svg.iconfont.guide{
          font-size: 16px !important;
          color: @warning;
          position: absolute;
          top: 34px;
        }
        .checkmark{
          font-size: 20px !important;
          color: #1AD96E;
          font-weight: bold;
          position: absolute;
          top: 30px;
          left: 25px;
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
        padding: 20px 50px 40px 50px
      }
      .ivu-modal-footer{
        border: none;
        padding:0 30px 30px 18px;
      }
      button {
        border-radius: 0 !important;
      }
    }
  }
}
</style>
