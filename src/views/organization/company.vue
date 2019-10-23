<template>
  <section class="company-container">
    <Spin fix v-if="loading2" style="z-index: 10">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">公司</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doAddCompany">新增</Button>
        <Button class="span-space" @click="doBatchAccount">批量建账</Button>
        <Button class="span-space" @click="doOpenBatch">批量授权用户</Button>
        <Button class="span-space" @click="doBatchDelete">删除</Button>
        <Button @click.native="doImport">
          <common-icon type="_export" :size="14"></common-icon>
        </Button>
        <Button @click.native="doExport">
          <common-icon type="_import" :size="14"></common-icon>
        </Button>
        <Button class="span-space" @click.native = "doTableConfig">
          <common-icon type="_table"></common-icon>
        </Button>
        <Button icon="md-refresh" @click="doRefresh"></Button>
      </div>
    </section>
    <section class="page-content">
      <!-- 建账提示 -->
      <Alert :type="types" show-icon v-if="alertShow" class="account_alert" :class="{success_color: isColor,error_color: !isColor}">
        <common-icon type="_warn" slot="icon" class="icon_warn"></common-icon>
        {{content}}
      </Alert>
      <Row class="screen" :gutter='10'>
        <Col span="2">
          <Select v-model="params.isAccounting" @on-change="doGetInit">
            <Option v-for="(item,index) in accountList"  :value="item.id" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="2">
          <Select v-model="params.companyFormId" @on-change="doGetInit">
            <Option v-for="(item,index) in formList" :value="item.id" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="2">
          <Select v-model="params.companyTypeId" @on-change="doGetInit">
            <Option v-for="(item,index) in typeList" :value="item.id" :key="index">{{item.label}}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input v-model="params.codeOrName" placeholder="公司编码/名称" @on-enter="doGetInit" @on-clear="doClearCode" clearable>
            <Button slot="append" icon="ios-search" @click="doGetInit" size="small"></Button>
          </Input>
        </Col>
        <Col span="2">
          <Button @click="doReset">重置</Button>
        </Col>
      </Row>
      <div class="page-content-table">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <vxe-table
          ref="xTable"
          :data="tableData"
          :height="tableHeight"
          v-if="isXTable"
          @select-all="doSelectTableData"
          @select-change="doSelectTableData"
        >
          <template v-for="item in tableColumns">
            <vxe-table-column type="selection" width="40" v-if="item.key === 'selection'" :key="item.key" :resizable="false"></vxe-table-column>
            <vxe-table-column field="code" title="编码" :min-width="item.minWidth" v-else-if="item.key === 'code'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doLocationDetail('update_company', { id: row.id })">{{row.code}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="hasSubAccount" title="是否分账核算" :min-width="item.minWidth" v-else-if="item.key === 'hasSubAccount'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.hasSubAccount ===1">是</span>
                  <span v-show="row.hasSubAccount ===0">否</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isAccounting" title="建账状态" :min-width="item.minWidth" v-else-if="item.key === 'isAccounting'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isAccounting === 0" class="accountant-point"></span>
                  <span v-show="row.isAccounting === 0" class="no-accountant">未建账</span>
                  <span v-show="row.isAccounting === 1" class="accountant-point2"></span>
                  <span v-show="row.isAccounting === 1" class="already-accountant">已建账</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'actionAccounting'" :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span table-right" v-show="row.isAccounting === 0" @click="doDeleteCompany({ row })">删除</span>
                  <span class="table-span table-right" v-show="row.isAccounting === 0 && !row.accounting" @click="doBuildAccount({ row })" style="margin-left: 24px;">建账</span>
                  <span class="table-span table-right" v-show="row.isAccounting === 0 && row.accounting" style="position: relative; color:#B4B4B4; margin-left: 24px;">建账中<img src="../../assets/images/loading.gif" style="position: absolute; top: -1px; left: 40px;"/></span>
                  <span class="table-span table-right" v-show="row.isAccounting === 1" @click="doOpenAuth({ row })">授权用户</span>
                  <span class="table-span table-right" v-show="row.isAccounting === 1" @click="docheckAccount({ row })">查看账簿</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column :field="item.key" :title="item.title" :min-width="item.minWidth" v-else :key="item.key"></vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-table>
      </div>
    </section>
    <section class="page-footer" v-if="!!tableData.length">
      <div class="page-footer-lf">
        已选择 <strong>{{selectData.length}}</strong> 项，共 {{total}} 条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="pageCompany"
          class-name="pages"
          :total="total"
          :current="current"
          :page-size="size"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="handleChangePage"/>
        <Button size="small" @click="goElevatorPage('pageCompany')">GO</Button>
      </div>
    </section>
    <!-- 提示弹窗 -->
    <Modal
        :closable="false"
        :transfer="false"
        :mask-closable="false"
        v-model="deleteModal"
        class-name="reminder-modal">
        <p slot="header" style="text-align:left;">
            <common-icon type="_guide" class="guide"></common-icon>
            <span>确认删除</span>
        </p>
        <p>
          <span>确认删除选中的数据吗？删除后将不可恢复</span>
        </p>
        <div slot="footer">
          <Button type="primary" @click="doConfirm">确定</Button>
          <Button type="default" @click="doCancel">取消</Button>
        </div>
    </Modal>
    <!-- 建账成功提示 -->
    <Modal
        :closable="false"
        :transfer="false"
        :mask-closable="false"
        v-model="accountModal"
        class-name="reminder-modal">
        <p slot="header" style="text-align:left;">
            <Icon type="ios-checkmark-circle-outline" class="checkmark"/>
            <span>建账成功</span>
        </p>
        <p>
          <span>【{{this.name}}】的核算账簿已经创建成功，您可以到</span>
          <span class="table-span" @click="goAccount">系统设置-账簿设置-核算账簿</span>
          <span>功能中查看</span>
        </p>
        <div slot="footer">
          <Button type="primary" @click="doClose">关闭</Button>
        </div>
    </Modal>
    <!--  导入 -->
    <upload-modal @modalClose="doCloseUpload" :isupload="isImport" template-type="company"></upload-modal>
    <!-- 表格配置 -->
    <table-config @close="doTableClose" :drawer="drawer"></table-config>
    <!-- 授权用户 -->
    <auth-user-modal @modalClose="doCloseAuth" :authModal="authModal" :titleName='title' :companyId='id'
                     :companyCode='code' :companyName='name' :hasSubAccount='hasSubAccount' :companyData='this.selectData'></auth-user-modal>
    <!-- 批量建账成功提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal"
                        :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <a id="exportFlag" style="display: none"></a>
  </section>
</template>

<script type="text/jsx">
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import authUserModal from './companyModule/components/authUserModal'
import batchHandleModal from '_c/batchHandleModal'
import { sortArr, getHeight } from '@/libs/tools.js'
export default {
  name: 'company_index',
  components: {
    CommonIcon,
    uploadModal,
    tableConfig,
    authUserModal,
    batchHandleModal,
    nodata
  },
  data () {
    return {
      isXTable: false,
      tableHeight: 0, // 表格高度
      height: getHeight(66),
      loading: false, // 加载
      loading2: false,
      drawer: false, // drawer组件的值
      isConfig: false, // 表格配置是否显示
      isImport: false, // 导入弹窗
      title: '', // 弹窗名称
      authModal: false, // 授权用户弹窗
      deleteModal: false, // 提示弹窗
      batchDelete: false, // 提示弹窗批量删除
      alertShow: false, // 建账提示
      accountModal: false, // 建账成功提示
      batchHandleModal: false, // 批量建账成功提示
      checked: '', // 批量建账成功提示的check
      content: '', // 建账提示文字
      types: '', // 建账提示类型
      isColor: null,
      selectData: [], // 多选的数据
      size: 20, // 每页显示的数据个数
      current: 1, // 页码
      total: 0, // 数据总数
      id: null, // 公司ID
      isAccounting: null,
      hasSubAccount: null,
      isRef: null,
      code: null, // 公司编码
      name: null, // 公司名称
      params: { // 查询参数
        isAccounting: 2, // 建账状态
        companyFormId: 0, // 全部形态
        companyTypeId: 0, // 全部公司类型
        codeOrName: '' // 公司编码/名称
      },
      accountList: [ // 建账状态列表
        {
          id: 2,
          label: '全部建账状态'
        },
        {
          id: 1,
          label: '已建账'
        },
        {
          id: 0,
          label: '未建账'
        }
      ],
      formList: [], // 全部形态列表
      typeList: [], // 全部公司类型列表
      visiable_condition: false, // 控制查询条件显隐
      value: '',
      tableColumns: [],
      header: {
        key: 'selection'
      },
      companyCode: {
        title: '编码',
        key: 'code',
        minWidth: 80
      },
      tableColumn: [
        {
          title: '名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '简称',
          key: 'simpleName',
          minWidth: 100
        },
        {
          title: '公司类型',
          key: 'companyTypeName',
          minWidth: 100
        },
        {
          title: '公司形态',
          key: 'companyFormName',
          minWidth: 100
        },
        {
          title: '建账状态',
          key: 'isAccounting',
          minWidth: 90
        },
        {
          title: '成立日期',
          key: 'establishDate',
          minWidth: 120
        },
        {
          title: '法人',
          key: 'legalPerson',
          minWidth: 100
        },
        {
          title: '注册地址',
          key: 'registeAddress',
          minWidth: 100
        },
        {
          title: '固定电话',
          key: 'fixedPhone',
          minWidth: 100
        },
        {
          title: '手机号',
          key: 'mobile',
          minWidth: 100
        },
        {
          title: '统一社会信用代码',
          key: 'creditCode',
          minWidth: 170
        },
        {
          title: '纳税人识别号',
          key: 'taxPayerNumber',
          minWidth: 120
        },
        {
          title: '工商注册号',
          key: 'registeNumber',
          minWidth: 100
        },
        {
          title: '开户行',
          key: 'bankName',
          minWidth: 100
        },
        {
          title: '银行账户',
          key: 'bankNumber',
          minWidth: 100
        },
        {
          title: '会计准则',
          key: 'accountingStandardName',
          minWidth: 100
        },
        {
          title: '税制',
          key: 'taxSystemName',
          minWidth: 100
        },
        {
          title: '记账本位币',
          key: 'accountingCurrencyName',
          minWidth: 100
        },
        {
          title: '纳税人资格',
          key: 'taxQualificationName',
          minWidth: 100
        },
        {
          title: '是否分账核算',
          key: 'hasSubAccount',
          minWidth: 110
        },
        {
          title: '创建人',
          key: 'creatorName',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 160
        },
        {
          title: '修改人',
          key: 'updatorName',
          minWidth: 100
        },
        {
          title: '修改时间  ',
          key: 'updateTime',
          minWidth: 160
        }
      ],
      opreation: {
        title: '操作',
        key: 'actionAccounting'
      },
      tableData: [],
      batchhandleColumns: [], // 批量提示的表头
      batchhandleData: [], // 批量提示的表格数据
      batchAccountColumns: [ // 批量建账提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          className: 'table-index'
        },
        {
          title: '公司编码',
          key: 'code',
          width: 100
        },
        {
          title: '公司名称',
          key: 'name'
        },
        {
          title: '说明',
          key: 'result',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.result === 0 ? '#fa790e' : '#00a597'
              }
            }, params.row.result === 0 ? '公司已建账，不能重复建账' : '建账成功')
          }
        }
      ],
      batchDeleteColumns: [ // 批量删除提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          className: 'table-index'
        },
        {
          title: '公司编码',
          key: 'code',
          width: 100
        },
        {
          title: '公司名称',
          key: 'name'
        },
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
      ]
    }
  },
  mixins: [saasMixin],
  activated () {
    if (this.$store.state.user.isRefreshTable) {
      this.doRefresh()
      this.$store.commit('setIsRefreshTable', false)
    }
  },
  created () {
    this.doGettableHeader()
    this.doGetSelectList()
    this.doGetInit()
  },
  methods: {
    ...mapMutations([
      'getListIds', 'getAccount'
    ]),
    // 获取选择器列表
    doGetSelectList () {
      this.loading2 = true
      this.$request.post('/financeback/company/findSysAuxDataList').then(res => {
        this.loading2 = false
        let { code, data } = res.data
        if (code === 200) {
          let _formList = [{
            id: 0,
            label: '全部形态'
          }]
          data.form.forEach(item => {
            _formList.push({
              id: item.id,
              label: item.name
            })
          })
          this.formList = _formList
          let _typeList = [{
            id: 0,
            label: '全部类型'
          }]
          data.company_type.forEach(item => {
            _typeList.push({
              id: item.id,
              label: item.name
            })
          })
          this.typeList = _typeList
        }
      })
    },
    // 获取表头
    doGettableHeader () {
      this.loading2 = true
      let req = {
        menuCode: this.$route.name, // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
      }
      const that = this
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
            if (item.isShow !== 0) {
              that.getTableList.push(item)
            }
          })
          that.tableColumns = sortArr(that.tableColumn, that.getTableList)
          that.tableColumns.push(this.opreation)
          that.tableColumns.unshift(this.header, this.companyCode)
          this.isXTable = true
        }
      })
    },
    // 初始化
    doGetInit () {
      this.selectData = []
      let req = {
        isAccounting: this.params.isAccounting === 2 ? '' : this.params.isAccounting,
        companyFormId: this.params.companyFormId === 0 ? '' : this.params.companyFormId,
        companyTypeId: this.params.companyTypeId === 0 ? '' : this.params.companyTypeId,
        codeOrName: this.params.codeOrName,
        page: {
          size: this.size,
          current: this.current
        },
        isEnterpriseAdmin: 1
      }
      this.loading = true
      this.$request.post('/financeback/company/findCompanyPage', req).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          if (res.data.data.records.length === 0 && res.data.data.current >= 2) {
            this.current = 1
            this.doGetInit()
          } else {
            // 列表数据
            this.tableData = res.data.data.records
            this.tableData.forEach(item => {
              item.accounting = false
            })
            // 分页
            this.total = res.data.data.total
            this.size = res.data.data.size
            this.current = res.data.data.current
            this.getListIds({ ids: res.data.data.records.map(n => { return n.id }), name: 'company' })
            let that = this
            this.tableData.forEach(item => {
              that.selectData.forEach(i => {
                if (item.id === i.id) {
                  that.$set(item, '_checked', true)
                }
              })
            })
          }
          if (this.tableData.length === 0) {
            this.tableHeight = 36
          } else {
            this.tableHeight = this.height
          }
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    // 新增
    doAddCompany () {
      this.doLocationDetail('create_company')
    },
    // 点击批量建账
    doBatchAccount () {
      if (this.selectData.length === 0) {
        this.$Message.info('必须在列表中至少选择一条数据才能点击按钮！')
      } else {
        let accounted = []
        let noAccount = []
        for (let i in this.selectData) {
          // 已建账
          if (this.selectData[i].isAccounting === 1) {
            this.selectData[i].result = 0
            accounted.push(this.selectData[i])
          } else {
            noAccount.push(this.selectData[i])
          }
        }
        noAccount.forEach(item => {
          delete item.isRef
        })
        this.$request.post('/financeback/company/enableAccountBookBatch', noAccount).then(res => {
          let { code, data } = res.data
          if (code === 200) {
            this.batchHandleModal = true
            this.batchhandleColumns = this.batchAccountColumns
            this.batchhandleData = noAccount.concat(accounted)
            this.checked = '建账成功' + data.successList.length + '条,' + '建账失败' + accounted.length + '条'
          }
          this.selectData = []
          this.doGetInit()
        })
      }
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 点击打开批量授权弹窗
    doOpenBatch () {
      if (this.selectData.length === 0) {
        this.$Message.info('必须在列表中至少选择一条数据才能点击按钮！')
      } else {
        for (let i = 0, len = this.selectData.length; i < len; i++) {
          if (this.selectData[i].isAccounting === 0) {
            this.$Message.info('存在未建账的数据，请先建账！')
            return
          }
        }
        this.authModal = true
        this.title = '批量授权用户'
      }
    },
    // 监听批量授权弹窗关闭
    doCloseBatch (msg) {
      this.authModal = msg
    },
    // 点击批量删除
    doBatchDelete () {
      if (this.selectData.length === 0) {
        this.$Message.info('必须在列表中至少选择一条数据才能点击按钮！')
      } else {
        this.batchDelete = true
        this.deleteModal = true
      }
    },
    // 点击导出
    doExport () {
      let req = {
        isAccounting: this.params.isAccounting === 2 ? '' : this.params.isAccounting,
        companyFormId: this.params.companyFormId === 0 ? '' : this.params.companyFormId,
        companyTypeId: this.params.companyTypeId === 0 ? '' : this.params.companyTypeId,
        codeOrName: this.params.codeOrName,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/company/exportExcel', req, 'blob').then(res => {
        let postfix = res.headers ? res.headers['content-disposition'] ? res.headers['content-disposition'].split('.')[1] : 'xls' : 'xls'
        this.$download(res.data, '公司列表', 'exportFlag', postfix)
      })
    },
    // 点击导入按钮
    doImport () {
      this.isImport = true
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isImport = false
      this.doGetInit()
    },
    // 点击表格配置
    doTableConfig () {
      this.drawer = true
      this.isConfig = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.isXTable = false
        this.doGettableHeader()
        this.doGetInit()
      }
      this.drawer = false
    },
    // 点击刷新按钮
    doRefresh () {
      this.doGetInit()
    },
    // 根据输入条件查询
    doClearCode (value) {
      this.params.codeOrName = ''
      this.doGetInit()
    },
    // 重置
    doReset () {
      this.params.isAccounting = 2
      this.params.companyFormId = 0
      this.params.companyTypeId = 0
      this.params.codeOrName = ''
      this.selectData = []
      this.doGetInit()
    },
    // 列表多选
    doSelectTableData (data) {
      this.selectData = data.selection
    },
    // 点击删除
    doDeleteCompany ({ row }) {
      this.id = row.id
      this.deleteModal = true
    },
    // 删除提示弹窗----确定
    doConfirm () {
      if (this.batchDelete) {
        let idList = []
        this.selectData.forEach(item => {
          idList.push(item.id)
        })
        let req = {
          idList: idList
        }
        this.$request.post('/financeback/company/deleteBatch', req).then(res => {
          let { code, data } = res.data
          if (code === 200) {
            this.batchHandleModal = true
            this.batchhandleColumns = this.batchDeleteColumns
            let dataList = []
            this.selectData.forEach(m => {
              data.successList.forEach(n => {
                if (m.id === n) {
                  // 删除成功
                  dataList.push({
                    code: m.code,
                    name: m.name,
                    referenceDescription: n.referenceDescription
                  })
                }
              })
              data.failList.forEach(n => {
                if (m.id === n.businessId) {
                  // 删除成功
                  dataList.push({
                    code: m.code,
                    name: m.name,
                    referenceDescription: n.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = dataList
            let success = data.successList ? data.successList.length : 0
            let fail = data.failList ? data.failList.length : 0
            this.checked = '删除成功' + success + '条,' + '删除失败' + fail + '条'
            this.selectData = []
            this.doGetInit()
          }
        })
      } else {
        let req = {
          idList: [this.id]
        }
        this.$request.post('/financeback/company/deleteBatch', req).then(res => {
          let { code, data } = res.data
          if (code === 200) {
            if (data.successList.length > 0) {
              this.$Message.success('删除成功')
              this.doGetInit()
              this.selectData.forEach((item, index, arr) => {
                if (item.id === this.id) {
                  arr.splice(index, 1)
                }
              })
            } else if (data.failList.length > 0) {
              this.$Message.error(data.failList[0].referenceDescription)
            }
          }
        })
      }
      this.batchDelete = false
      this.deleteModal = false
    },
    // 删除提示弹窗----取消
    doCancel () {
      this.batchDelete = false
      this.deleteModal = false
    },
    // 点击打开授权弹窗
    doOpenAuth ({ row }) {
      this.authModal = true
      this.title = '授权用户'
      this.id = row.id
      this.code = row.code
      this.name = row.name
      this.hasSubAccount = row.hasSubAccount
    },
    // 监听授权弹窗关闭
    doCloseAuth (msg) {
      this.authModal = msg
    },
    // 查看账簿
    docheckAccount ({ row }) {
      this.$router.push({
        name: 'update_book',
        query: {
          companyId: row.id,
          hasSubAccount: row.hasSubAccount,
          accountingStandardId: row.accountingStandardId
        }
      })
    },
    // 点击建账
    doBuildAccount ({ row }) {
      this.code = row.code
      this.id = row.id
      row.accounting = true
      setTimeout(() => {
        delete row.isRef
        this.$request.post('/financeback/company/enableAccountBook', row).then(res => {
          if (res.data.code === 200) {
            this.accountModal = true
            this.name = row.name
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          } else {
            this.types = 'error'
            this.content = '建账失败!'
            this.alertShow = true
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          }
          this.doGetInit()
        })
        row.accounting = false
      }, 1500)
    },
    // 跳转核算账簿列表
    goAccount () {
      this.doLocationDetail('book_index')
      this.getAccount({
        flag: true,
        codeList: [{ name: this.name, code: this.code, id: this.id }],
        companyId: [this.id]
      })
      this.doClose()
    },
    // 关闭建账成功提示
    doClose () {
      this.accountModal = false
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
    }
  }
}
</script>

<style lang="less">
@import '../../assets/css/base.less';
.company-container{
  .reminder-modal{
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
          font-size: 20px !important;
          color: @warning;
          position: absolute;
          top: 30px;
          left: 24px;
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
          margin-left: 20px;
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
      Button{
        border-radius: 0;
      }
    }
    }
  }
  .ivu-input-search{
      padding: 0 8px !important;
      color: #999999 !important;
      background: #FAFAFA !important;
      border-color: #e5e5e5 !important;
  }
  .ivu-input-search:before{
    background: none
  }
  .ivu-input-search-icon {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
  }
  .screen {
    .ivu-input-icon-clear {
      right: 32px;
      position: absolute;
    }
  }
}
</style>

<style lang="less" scoped>
@import '../../assets/css/base.less';
.company-container {
  .text-btn {
    .textBtn(0, 4px);
  }
  .span-space {
    .span-space(8px, 0)
  }
  .page-content{
    .page-content-table{
      position: relative;
      padding-bottom: 8px;
    }
    // 建账提示
    .account_alert{
      position: absolute;
      left: 9px;
      right: 1px;
      z-index: 10;
      font-size: 14px;
      border: none;
      border-radius: 0;
      .icon_warn{
        font-size: 16px !important;
      }
      .success_color{
      color: #00A497;
      background-color: #E5F9F7;
      }
      .error_color{
        color: #F92424;
        background-color: #FFECEB;
      }
    }
  }
  .company-input {
    display: inline-block;
  }
  .company-input-find {
    width: 120px;
  }
  .tableHeight {
    height: 36px;
  }
  .company-input-code {
    width: 215px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .no-accountant {
    color: #F73E3E;
    vertical-align: middle;
  }
  .already-accountant {
    color: #595959;
    vertical-align: middle;
  }
  .accountant-point {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #F73E3E;
    border-radius: 50%;
    margin-right: 4px
  }
  .accountant-point2 {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #595959;
    border-radius: 50%;
    margin-right: 4px
  }
}
</style>
