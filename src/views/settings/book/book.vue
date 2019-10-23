<template>
  <div class="book-show">
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="page-header">
      <div class="page-header-name">核算账簿列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doAllOpenChild()" >批量启用子系统</Button>
        <Button @click="doUnAllOpenChild()" >批量反启用子系统</Button>
        <Button @click="doAllDelete()" >删除</Button>
        <Button @click.native = "doClickConfig" >
          <common-icon type="_table"></common-icon>
        </Button>
        <Button icon="md-refresh" @click="doRefresh"></Button>
      </div>
    </div>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <multi-select :data="companyParams"
            class="maright inputs-width"
            @on-select="doGetCompanyId"
            @on-clear="isCheck"
            placeholder="公司编码或名称"
            title="选择公司"
            type="company"
            width="100%"
            :defaultArray="codeList"
            isEnterpriseAdmin = 1
            :isClear="isClear">
              <Row :gutter="10" slot="search">
                <Col span="3">
                  <Select v-model="companyFormId" @on-change="doSelect">
                    <Option v-for="item in formList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </Col>
                <Col span="5">
                  <Input v-model="companyCodeOrName" search placeholder="编码或名称" @on-search="doSearch"/>
                </Col>
                <Col span="2">
                  <Button @click="doReset1">重置</Button>
                </Col>
              </Row>
          </multi-select>
          <Select class="maright select-width" v-model="formValidate.ledgerStatus" placeholder="全部总账启用状态" @on-change="doChangeGeneral">
            <Option v-for="item in generalList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select class="maright select-width" v-model="formValidate.assetsStatus" placeholder="全部资产启用状态" @on-change="doChangeAssets">
            <Option v-for="item in assetsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Select class="maright select-width" v-model="formValidate.receivableStatus" placeholder="全部应收启用状态" @on-change="doChangeReceivable">
            <Option v-for="item in receivableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input class="query-input" v-model="formValidate.codeOrName" placeholder="账簿名称或编码" :maxlength="40" @on-enter="enterBookName" @on-clear="enterBookName" @on-change="doInputChange" clearable/>
          <Button class="maright btn-query-input" slot="append" icon="ios-search" @click="enterBookName"></Button>
          <Button @click="doReset">重置</Button>
        </div>
      </div>
      <div :class="tableLoading ? 'period-table page-content-table' : 'period-table-no page-content-table'">
        <Spin fix v-if="tableLoading">
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
          <template v-for="item in tableColumns2">
            <vxe-table-column type="selection" width="40" v-if="item.key === 'selection'" :key="item.key" :resizable="false"></vxe-table-column>
            <vxe-table-column field="code" title="编码" :min-width="item.minWidth" v-else-if="item.key === 'code'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doLocationDetail('update_book', { hasSubAccount: row.hasSubAccount, accountBookId: row.id, accountingStandardId: row.accountingStandardId })">{{row.code}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="accountBookTypeId" title="账簿类型" :min-width="item.minWidth" v-else-if="item.key === 'accountBookTypeId'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{row.accountBookTypeId === 1 ? '核算账簿' : ''}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="hasSubAccount" title="启用分账核算" :min-width="item.minWidth" v-else-if="item.key === 'hasSubAccount'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{row.hasSubAccount === 0 ? '否' : '是'}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="balanceSheetId" title="资产负债表" :min-width="item.minWidth" v-else-if="item.key === 'balanceSheetId'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{(row.assetList.filter(n => n.id === row.balanceSheetId))[0].name}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="incomeStatementId" title="利润表" :min-width="item.minWidth" v-else-if="item.key === 'incomeStatementId'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{(row.profitList.filter(n => n.id === row.incomeStatementId))[0].name}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="cashFlowId" title="现金流量表" :min-width="item.minWidth" v-else-if="item.key === 'cashFlowId'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{(row.cashFlowList.filter(n => n.id === row.cashFlowId))[0].name}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="cashFlowItemId" title="现金流量项目表" :min-width="item.minWidth" v-else-if="item.key === 'cashFlowItemId'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span>{{(cashFlowItemList.filter(n => n.value === row.cashFlowItemId))[0].label}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="ledgerStatus" title="总账启用状态" :min-width="item.minWidth" v-else-if="item.key === 'ledgerStatus'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.ledgerStatus === null" class="accountant-point"></span>
                  <span v-show="row.ledgerStatus === null" class="no-accountant">未启用</span>
                  <span v-show="row.ledgerStatus === 1" class="accountant-point2"></span>
                  <span v-show="row.ledgerStatus === 1" class="already-accountant">已启用</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'opreationCol'" :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span table-right" v-show="row.flag0 === 1 && row.flag1 === 0" @click="doDelete({ row })">删除</span>
                  <span class="table-span table-right" v-show="row.flag0 === 1" @click="doOpenChild({ row })">启用子系统</span>
                  <span class="table-span table-right" v-show="row.flag1 === 1" @click="doUnOpenChild({ row })">反启用子系统</span>
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
    <div class="page-footer">
      <div class="page-footer-lf">
        已选择<strong>{{selectData.length}}</strong>项，共 {{total}} 条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageId"
        class-name="pages"
        :total="total"
        :current="current"
        :page-size="size"
        :page-size-opts="[20, 50, 100, 200, 500, 1000]"
        @on-page-size-change="changePageSize"
        @on-change="handleChangePage"
         show-elevator
         show-sizer />
        <Button size="small" @click="doGoPage('pageId')">Go</Button>
      </div>
    </div>
    <div class="book-drawer">
      <Drawer :title="allConfig?'批量启用子系统':'启用子系统'" :transfer="false" :closable="true" class="drawer" v-model="openChildDrawer" width="330">
        <div class="drawer-main">
          <div class="drawer-title">
            <span>已选账簿</span>
            <Poptip trigger="hover" :content="bookTitle" :transfer="accountTips" width="300" :word-wrap="accountTips">
              <div>{{bookTitle}}</div>
            </Poptip>
          </div>
          <ul>
            <li class="child-list" v-for="(item, index) in openChildData" :key="index" @click="item.iconType = !item.iconType">
              <div class="child-list-left child-list-left-gary" v-if="!item.iconType">
                <common-icon type="_zixitong" class="child-list-left-icon" />
                <p>{{item.name}}</p>
              </div>
              <div class="child-list-left box-background" v-if="item.iconType">
                <common-icon type="_Shape" class="child-list-left-icon" />
                <p class="p-color">{{item.name}}</p>
              </div>
              <div class="child-list-right-gary" v-if="!item.iconType">
                <p>点击后设置启用期间</p>
              </div>
              <div class="child-list-right-light" v-if="item.iconType" >
                <div @click.stop>
                  <Select class="select-input" v-model="item.periodYear" @on-change="doChangeYear(item.periodYear, item)">
                    <Option v-for="data in item.yearMonthList" :value="data.yearItem" :key="data.yearItem">{{ data.yearItem + '年' }}</Option>
                  </Select>
                  <Select class="select-input2" v-model="item.periodNum">
                    <Option v-for="data in item.timeList" :value="data" :key="data">{{ '第' + data + '期' }}</Option>
                  </Select>
                  <Checkbox v-show="item.name === '总账'" class="checkbox" v-model="item.cashFlowEnableStatus" :true-value="1" :false-value="0">启用现金流量</Checkbox>
                </div>
              </div>
              <common-icon type="_yixuanzhong" class="right-icon right-icon-gray" v-if="!item.iconType"/>
              <common-icon type="_yixuanzhong" class="right-icon textBtn" v-if="item.iconType"/>
            </li>
          </ul>
        </div>
        <div class="drawer-foot">
          <div>
            <Button type="primary" class="confim-button" @click="doDrawerOpenChildOk">确定</Button>
            <Button @click="doDrawerOpenChildCancle">取消</Button>
          </div>
        </div>
        <span class="top-border"></span>
      </Drawer>
      <Drawer :title="allConfig?'批量反启用子系统':'反启用子系统'" :transfer="false" :closable="true" class="drawer" v-model="unOpenChildDrawer" width="330">
        <div class="drawer-main">
          <div class="drawer-title">
            <span>已选账簿</span>
            <Poptip trigger="hover" :content="bookTitle" :transfer="accountTips"  width="300" :word-wrap="accountTips">
              <div>{{bookTitle}}</div>
            </Poptip>
          </div>
          <ul>
            <li class="child-list" v-for="(item, index) in unOpenChildData" :key="index" @click="doSelcetUnOpenChild(item)">
              <div class="child-list-left box-background">
                <common-icon type="_Shape" class="child-list-left-icon" />
                <p class="p-color">{{item.name}}</p>
              </div>
              <div class="child-list-right-light">
                <p>{{item.time?item.time:'启用期间'}}</p>
              </div>
              <common-icon type="_yixuanzhong" class="right-icon right-icon-gray" v-if="!item.iconType"/>
              <common-icon type="_yixuanzhong" class="right-icon textBtn" v-if="item.iconType"/>
            </li>
          </ul>
        </div>
        <div class="drawer-foot">
          <div>
            <Button type="primary" class="confim-button" @click="doDrawerUnOpenChildOk">确定</Button>
            <Button @click="doDrawerUnOpenChildCancle">取消</Button>
          </div>
        </div>
        <span class="top-border"></span>
      </Drawer>
    </div>
    <table-config @close="doTableClose" :drawer="configDrawerShow" ></table-config>
    <!-- 分配用户弹窗 -->
    <company-user-modal closable @modalClose="assignClose" @selectCompany="doGetCompanyList" :assignModal="assignModal" :titleName="titleName"></company-user-modal>
    <table-config @close="doTableClose" :drawer="configDrawerShow"></table-config>
    <!-- 批量提示 -->
    <batch-handle-modal
    @modalClose="doCloseBatchAccount"
    :batchHandleModal="batchHandleModal"
    :titleName="titleName"
    :checked="checked"
    :batchhandleColumns="batchhandleColumns"
    :batchhandleData="batchhandleData"></batch-handle-modal>
  </div>
</template>

<script type="text/jsx">
import { saasMixin } from '@/libs/mixins.js'
import nodata from '_c/nodata'
import CommonIcon from '_c/common-icon'
import { session } from '@/libs/location.js'
import { sortArr, getHeight } from '@/libs/tools.js'
import { mapMutations } from 'vuex'
import companyUserModal from '@/components/companyUserModal/companyUserModal.vue' // 多条查询
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import batchHandleModal from '_c/batchHandleModal'
import multiSelect from '_c/multi-select'
export default {
  name: 'book_index',
  components: {
    nodata,
    CommonIcon,
    multiSelect,
    batchHandleModal,
    tableConfig,
    companyUserModal // 多条查询
  },
  mixins: [saasMixin],
  data () {
    return {
      isXTable: false,
      accountTips: true,
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
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      companyFormId: 0,
      companyCodeOrName: '',
      tableHeight: 0,
      height: getHeight(66),
      tableLoading: false, // table的loading
      loading: false, // loading框的出现
      current: 1, // 当前页
      size: 20, // 每页展示的个数
      pages: null,
      total: 0, // 总数据
      selectData: null, // 多选的数据
      bookTitle: '',
      assignModal: false,
      configDrawerShow: false, // 表格配置的drawer的出现
      isConfig: false, // 表格配置是否显示
      showCompany: false, // 公司筛选modal框的出现
      unOpenChildDrawer: false, // 单个反启用抽屉出现
      openChildDrawer: false, // 单个启用抽屉出现
      drawerTitle: '反启用子系统', // 抽屉的名称
      allSelectIds: [], // selection已选的id数组
      formValidate: {
        ledgerStatus: -1, // 总账启用状态
        assetsStatus: -1,
        receivableStatus: -1,
        idList: null, // 公司的筛选条件
        codeOrName: ''
      },
      tableData: [], // 列表数据
      tableColumns2: [], // 改变后的表格数据
      tableColumns0: [], // 初始化把动态数据加进去的表格配置数据
      tableColumns1: [
        {
          title: '账簿类型',
          key: 'accountBookTypeId',
          minWidth: 130
        },
        {
          title: '公司编码',
          key: 'companyCode',
          minWidth: 180
        },
        {
          title: '公司名称',
          key: 'companyName',
          minWidth: 180
        },
        {
          title: '会计准则',
          key: 'accountingStandardName',
          minWidth: 200
        },
        {
          title: '记账本位币',
          key: 'accountingCurrencyName',
          minWidth: 130
        },
        {
          title: '启用分账核算',
          key: 'hasSubAccount',
          minWidth: 130
        },
        {
          title: '会计日历',
          key: 'accountingCalendarName',
          minWidth: 180
        },
        {
          title: '科目表',
          key: 'subjectName',
          minWidth: 200
        },
        {
          title: '资产负债表',
          key: 'balanceSheetId',
          minWidth: 180
        },
        {
          title: '利润表',
          key: 'incomeStatementId',
          minWidth: 200
        },
        {
          title: '现金流量表',
          key: 'cashFlowId',
          minWidth: 200
        },
        {
          title: '现金流量项目表',
          key: 'cashFlowItemId',
          minWidth: 200
        },
        {
          title: '创建人',
          key: 'creatorName',
          minWidth: 200
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 200
        },
        {
          title: '修改人',
          key: 'updatorName',
          minWidth: 200
        },
        {
          title: '修改时间',
          key: 'updateTime',
          minWidth: 200
        },
        {
          title: '总账启用状态',
          key: 'ledgerStatus',
          minWidth: 200
        }
      ],
      generalList: [
        {
          value: -1,
          label: '全部总账启用状态'
        },
        {
          value: 1,
          label: '已启用'
        },
        {
          value: 0,
          label: '未启用'
        }
      ], // 总账列表
      assetsList: [
        {
          value: -1,
          label: '全部资产启用状态'
        },
        {
          value: 1,
          label: '已启用'
        },
        {
          value: 0,
          label: '未启用'
        }
      ], // 资产列表
      receivableList: [
        {
          value: -1,
          label: '全部应收启用状态'
        },
        {
          value: 1,
          label: '已启用'
        },
        {
          value: 0,
          label: '未启用'
        }
      ], // 应收列表
      yearList: [],
      timeList: [],
      unOpenChildData: [],
      openChildData: [],
      myYear: null,
      accountBookId: null,
      accountBookName: '',
      accountBookCode: null, // 账簿编码
      accountingCalendarId: null, // 会计日历id
      deleteId: null, // 单个删除的账簿id
      allConfig: false, // 是否为批量的控制
      batchHandleModal: false, // 批量启用/反启用成功提示
      titleName: '', // 批量启用/反启用成功提示的标题
      checked: '', // 批量启用/反启用成功提示的check
      batchhandleColumns: [ // 批量启用/反启用成功提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center',
          tooltip: true,
          className: 'table-index'
        },
        {
          title: '详情',
          tooltip: true,
          key: 'details'
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.status === 0 || params.row.status === null ? '失败' : '成功')
          }
        },
        {
          title: '说明',
          key: 'directions',
          tooltip: true,
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.status === 0 ? '#fa790e' : '#00a597'
              }
            }, params.row.directions)
          }
        }
      ],
      batchhandleData: [], // 批量启用/反启用成功提示的表格数据
      codeList: [],
      firstFlag: 1, // 解决子组件第一次进来带空值
      codeColumns: {
        title: '编码',
        key: 'code',
        minWidth: 110
      },
      nameColumns: {
        title: '账簿名称',
        key: 'name',
        minWidth: 200
      },
      header: {
        key: 'selection'
      },
      opreation: {
        title: '操作',
        key: 'opreationCol'
      },
      getTableList: [], // 接口获取的表头数组
      cashFlowItemList: [], // 现金流量项目表
      profitList: [], // 利润表
      cashFlowList: [], // 现金流量表
      assetList: [], // 资产负债表
      isClear: false,
      yearMonthList: [],
      myMonth: null
    }
  },
  created () {
    if (this.$store.state.app.acountBook.companyId && this.$store.state.app.acountBook.companyId.length > 0) {
      this.formValidate.idList = this.$store.state.app.acountBook.companyId
      this.codeList = JSON.parse(JSON.stringify(this.$store.state.app.acountBook.codeList))
    } else {
      this.formValidate.idList = null
    }
    this.querySchemeList1()
    this.getAccount({})
  },
  mounted () {
    this.loading = true
    this.querySchemeList1()
  },
  methods: {
    ...mapMutations([
      'getYearList', 'getAccount'
    ]),
    doSelect () {
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
    },
    doSearch () {
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    doReset1 () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    isCheck (val) {
      this.isClear = val
    },
    doGetCompanyId (data) {
      let idList = []
      data.forEach(item => {
        idList.push(item.id)
      })
      this.formValidate.idList = idList.length <= 0 ? null : idList
      this.querySchemeList1()
    },
    // 即时查询----账簿或名称输入内容，按下回车键触发
    enterBookName () {
      this.querySchemeList1()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (!this.formValidate.codeOrName) {
        this.formValidate.codeOrName = ''
        this.querySchemeList1()
      }
    },
    // 即时查询--总账
    doChangeGeneral (val) {
      this.querySchemeList1()
    },
    doChangeAssets (val) {
      this.querySchemeList1()
    },
    doChangeReceivable (val) {
      this.querySchemeList1()
    },
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.$route.name, // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
      }
      const that = this
      that.$request.post('/financeback/tableConfig/findList', req).then(res => {
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
          that.tableColumns2 = sortArr(that.tableColumns0, that.getTableList)
          that.tableColumns2.push(this.opreation)
          that.tableColumns2.unshift(this.header, this.codeColumns, this.nameColumns)
          this.isXTable = true
        }
      })
    },
    // 通过去列表后，查询，添加的表头后的查询的封装
    querySchemeList1 () {
      this.selectData = []
      this.allSelectIds = []
      this.querySchemeList().then(data => {
        if (data === 'success') {
          this.doGettableHeader()
        }
      })
    },
    // 查询列表
    querySchemeList () {
      let that = this
      let reqdata = {
        idList: this.formValidate.idList,
        ledgerStatus: this.formValidate.ledgerStatus === -1 ? null : this.formValidate.ledgerStatus,
        assetsStatus: this.formValidate.assetsStatus === -1 ? null : this.formValidate.assetsStatus,
        receivableStatus: this.formValidate.receivableStatus === -1 ? null : this.formValidate.receivableStatus,
        page: {
          size: this.size,
          current: this.current
        },
        codeOrName: this.formValidate.codeOrName,
        isEnterpriseAdmin: JSON.parse(session.getItem('userInfo')).isAdmin,
        menuCode: this.$route.name
      }
      this.tableLoading = true
      return this.$request.post('/financeback/accountBook/findAccountBookPage', reqdata).then(response => {
        this.loading = false
        this.tableLoading = false
        let { status, data } = response.data
        if (status === 'success') {
          if (data.records[0] && data.records[0].accountCashFlow) {
            [data.records[0].accountCashFlow].forEach(i => {
              this.cashFlowItemList.push({
                value: i.id,
                label: i.cashFlowName
              })
            })
          }
          if (data.records[0] && data.records[0].assetList) {
            data.records[0].assetList.forEach(i => {
              this.assetList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data.records[0] && data.records[0].profitList) {
            data.records[0].profitList.forEach(i => {
              this.profitList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data.records[0] && data.records[0].cashFlowList) {
            data.records[0].cashFlowList.forEach(i => {
              this.cashFlowList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          this.isClear = false
          if (data.records.length === 0 && data.current >= 2) {
            this.current--
            this.querySchemeList1()
          } else {
            this.total = data.total
            this.size = data.size
            this.current = data.current
            if (data.records[0]) {
              that.tableHeight = this.height
              this.doSearchTime(data.records[0].accountingCalendarId).then(res => {
                if (res === 'success') {
                  let _tableColumnPart = []
                  if (data.records[0].sysSystemVos.length > 0) {
                    data.records[0].sysSystemVos.forEach(m => {
                      _tableColumnPart.push({
                        title: `${m.systemName}启用期间`,
                        key: `${m.systemSign}Period`,
                        minWidth: 180
                      })
                    })
                  }
                  if (_tableColumnPart.length > 0) {
                    this.tableColumns0 = [...this.tableColumns1, ..._tableColumnPart]
                  }
                  data.records.forEach(n => {
                    n.flag1 = 0
                    n.flag0 = 0
                    if (n.sysSystemVos.length > 0) {
                      n.sysSystemVos.forEach(m => {
                        n[`${m.systemSign}Status`] = m.status
                        n[`${m.systemSign}Period`] = m.periodYear ? m.periodYear + '年第' + m.periodNum + '期' : ''
                        if (m.status === 1) {
                          n.flag1 = 1
                        }
                        if (m.status === null) {
                          n.flag0 = 1
                        }
                      })
                    }
                  })
                  this.tableData = data.records
                }
              })
            } else {
              that.tableHeight = 36
              this.tableData = []
            }
          }
          return status
        }
      })
    },
    // 查询启用子系统的期间
    doSearchTime (data) {
      let reqdata = {
        accCalendarId: data
      }
      return this.$request.post('/financeback/accountBook/findAccountingPeriod', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let _yearList = []
          this.yearMonthList = []
          data.forEach((i, index) => {
            if (index !== 0) {
              _yearList.push(i.periodYear)
            }
          })
          _yearList = [...new Set(_yearList)]
          _yearList.forEach(item => {
            let _monthList = []
            this.yearList.push({
              value: item,
              label: item + '年'
            })
            data.forEach(d => {
              if (item === d.periodYear) {
                _monthList.push(d.periodNum)
                this.timeList.push({
                  value: d.periodNum,
                  label: d.periodNum + '期'
                })
              }
            })
            this.yearMonthList.push({
              yearItem: item,
              monthList: _monthList
            })
          })
          this.myYear = data[0].customPeriodYear
          this.myMonth = data[0].customPeriodNum
        }
        return status
      })
    },
    // 监听改变年的值
    doChangeYear (year, data) {
      this.yearMonthList.forEach(item => {
        if (item.yearItem === year) {
          data.timeList = item.monthList
          data.periodNum = item.monthList[0]
        }
      })
    },
    // 监听授权弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // selection的change
    handleChangePage (pageNo) {
      this.current = pageNo
      this.querySchemeList1()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.querySchemeList1()
    },
    // GO按钮跳转
    doGoPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 子组件点击选择的带过来的数据
    setComName (data) {
      this.formValidate.company = data.name
      this.showCompany = false
    },
    // 子组件的出现控制变化传false过来关闭
    setShowFlag (data) {
      this.showCompany = data
    },
    // 关闭分配用户弹窗
    assignClose (msg) {
      this.assignModal = false
    },
    // 监听分配用户弹窗传来的用户，生成用户列表
    doGetCompanyList (msg) {},
    // 重置
    doReset () {
      this.isClear = true
      this.formValidate = {
        ledgerStatus: -1, // 总账启用状态
        assetsStatus: -1,
        receivableStatus: -1,
        codeOrName: '',
        idList: null // 公司的筛选条件
      }
      this.selectData = []
      this.allSelectIds = []
      this.querySchemeList1()
    },
    // 列表多选
    doSelectTableData (data) {
      this.selectData = data.selection
      this.allSelectIds = data.selection.map(n => n.id)
    },
    // 单个启用子系统
    doOpenChild (row) {
      this.openChildData = []
      this.allConfig = false
      this.openChildDrawer = true
      this.bookTitle = row.row.name
      this.accountBookName = row.row.name
      this.accountBookCode = row.row.code
      this.accountBookId = row.row.id
      this.accountingCalendarId = row.row.accountingCalendarId
      row.row.sysSystemVos.forEach(i => {
        if (i.status !== 1) {
          this.openChildData.push({
            name: i.systemName,
            iconType: false,
            systemSign: i.systemSign,
            yearMonthList: this.yearMonthList,
            timeList: this.yearMonthList[0].monthList,
            periodYear: this.myYear,
            periodNum: this.myMonth,
            cashFlowEnableStatus: i.cashFlowEnableStatus ? i.cashFlowEnableStatus : 1
          })
        }
      })
    },
    // 批量启用子系统
    doAllOpenChild () {
      this.allConfig = true
      if (this.selectData && this.selectData.length > 0) {
        this.openChildData = []
        this.openChildDrawer = true
        // 名字拼接
        let nameArr = []
        this.selectData.forEach(n => {
          nameArr.push(n.name)
        })
        this.bookTitle = nameArr.join(',')
        this.selectData[0].sysSystemVos.forEach(i => {
          this.openChildData.push({
            name: i.systemName,
            iconType: false,
            systemSign: i.systemSign,
            yearMonthList: this.yearMonthList,
            timeList: this.yearMonthList[0].monthList,
            periodYear: this.myYear,
            periodNum: this.myMonth,
            cashFlowEnableStatus: i.cashFlowEnableStatus ? i.cashFlowEnableStatus : 1
          })
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击批量启用子系统！')
      }
    },
    // 单个反启用子系统
    doUnOpenChild (row) {
      this.unOpenChildData = []
      this.allConfig = false
      this.bookTitle = row.row.name
      this.accountBookName = row.row.name
      this.accountBookCode = row.row.code
      this.accountBookId = row.row.id
      row.row.sysSystemVos.forEach(i => {
        if (i.status === 1) {
          let yearLabel = ''
          let timeLabel = ''
          if (i.periodYear && i.periodNum) {
            this.yearList.forEach(n => {
              if (n.value === i.periodYear) {
                yearLabel = n.label
              }
            })
            this.timeList.forEach(n => {
              if (n.value === i.periodNum) {
                timeLabel = n.label
              }
            })
          }
          this.unOpenChildData.push({
            id: i.id,
            name: i.systemName,
            systemSign: i.systemSign,
            time: yearLabel + timeLabel,
            iconType: false
          })
        }
      })
      this.unOpenChildDrawer = true
    },
    // 批量反启用子系统
    doUnAllOpenChild () {
      this.allConfig = true
      if (this.selectData && this.selectData.length > 0) {
        this.unOpenChildDrawer = true
        this.unOpenChildData = []
        // 名字拼接
        let nameArr = []
        this.selectData.forEach(n => {
          nameArr.push(n.name)
        })
        this.bookTitle = nameArr.join(',')
        this.selectData[0].sysSystemVos.forEach(i => {
          this.unOpenChildData.push({
            id: i.id,
            name: i.systemName,
            iconType: false,
            systemSign: i.systemSign
          })
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击批量反启用子系统！')
      }
    },
    // 反启用子系统Drawer的确定
    doDrawerUnOpenChildOk () {
      let selectSign = false
      this.unOpenChildData.forEach(i => {
        if (i.iconType) {
          selectSign = true
        }
      })
      if (selectSign) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: '请确认需要将这些子系统全部反启用吗？',
          button: ['确认', '取消'],
          yes () {
            that.doModalUnOpenChildOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须选择一个子系统！')
      }
    },
    // 反启用子系统Drawer的取消
    doDrawerUnOpenChildCancle () {
      this.unOpenChildDrawer = false
    },
    // 反启用子系统的modal框的确定
    doModalUnOpenChildOk () {
      if (!this.allConfig) {
        let arr = []
        this.unOpenChildData.forEach(i => {
          if (i.iconType) {
            arr.push({
              id: i.id,
              systemName: i.name,
              systemSign: i.systemSign
            })
          }
        })
        let reqdata = {
          id: this.accountBookId,
          name: this.accountBookName,
          code: this.accountBookCode,
          accountBookSystemDtoList: arr
        }
        this.$request.post('/financeback/accountBook/antiEnableAccountBookSystem', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            if (data.batchOperationMessageList[0].status === 2) {
              this.$Message.success('已被引用，反启用失败！')
            } else {
              this.$Message.success('反启用成功！')
            }
            this.querySchemeList1()
          }
        })
      } else {
        this.isOpenFlag = 0
        let arrAll = []
        let sendArr = []
        // 批量反启用
        this.unOpenChildData.forEach(i => {
          if (i.iconType) {
            arrAll.push({
              id: i.id,
              systemName: i.name,
              systemSign: i.systemSign
            })
          }
        })
        this.selectData.forEach(n => {
          sendArr.push({
            id: n.id,
            name: n.name,
            code: n.code,
            accountBookSystemDtoList: arrAll
          })
        })
        this.$request.post('/financeback/accountBook/antiEnableAccountBookSystemBatch', sendArr).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let selectNum = this.selectData.length // 总选择的个数
            let aName = null // 总账
            let aNum = 0 // 总账成功的个数
            let bName = null // 资产
            let bNum = 0 // 资产成功的个数
            let cName = null // 应收
            let cNum = 0 // 应收成功的个数
            let nameList = []
            this.batchHandleModal = true
            arrAll.forEach(n => {
              nameList.push(n.systemName)
            })
            sendArr[0].accountBookSystemDtoList.forEach(n => {
              if (n.systemSign === 'ledger') {
                aName = '总账'
              }
              if (n.systemSign === 'asset') {
                bName = '资产'
              }
              if (n.systemSign === 'receive') {
                cName = '应收'
              }
            })
            data.batchOperationMessageList.forEach(i => {
              if (i.status === 1) {
                if (i.sign === 'ledger') {
                  aNum++
                }
                if (i.sign === 'asset') {
                  bNum++
                }
                if (i.sign === 'receive') {
                  cNum++
                }
                i.directions = '反启用成功'
              } else if (i.status === 0) {
                i.directions = '当前子系统未启用，反启用失败！'
              } else if (i.status === 2) {
                i.directions = '当前子系统已被引用，反启用失败！'
              }
            })
            data.batchOperationMessageList.forEach(n => {
              n += '反启用:'
            })
            this.batchhandleData = data.batchOperationMessageList
            let aInfos = aName ? aName + '管理子系统成功' + aNum + '个，失败' + (selectNum - aNum) + '个' : ''
            let bInfos = bName ? bName + '管理子系统成功' + bNum + '个，失败' + (selectNum - bNum) + '个' : ''
            let cInfos = cName ? cName + '管理子系统成功' + cNum + '个，失败' + (selectNum - cNum) + '个' : ''
            this.checked = aInfos + ((bName && aName) || (cName && aName) ? ';' : '') + bInfos + (bName && cName ? ';' : '') + cInfos
            this.querySchemeList1()
          }
        })
      }
      this.unOpenChildDrawer = false
    },
    // 单个删除
    doDelete (row) {
      this.allConfig = false
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '删除后不可恢复，请确认?',
        button: ['确认', '取消'],
        yes () {
          that.doModalDeleteOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.deleteId = row.row.id
    },
    // 批量删除
    doAllDelete () {
      this.allConfig = true
      if (this.selectData && this.selectData.length > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: '删除后不可恢复，请确认?',
          button: ['确认', '取消'],
          yes () {
            that.doModalDeleteOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击批量删除！')
      }
    },
    // 删除modal的确认
    doModalDeleteOk () {
      if (!this.allConfig) {
        // 单个删除
        let reqdata = {
          accountBookIdList: [this.deleteId]
        }
        this.$request.post('/financeback/accountBook/deleteBatchById', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            this.$Message.success('删除成功！')
            this.querySchemeList1()
          }
        })
      } else {
        // 批量删除
        let reqdata = {
          accountBookIdList: this.allSelectIds
        }
        this.$request.post('/financeback/accountBook/deleteBatchById', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let deleteData = []
            this.batchHandleModal = true
            this.selectData.forEach(n => {
              data.successList.forEach(i => {
                if (n.id === i) {
                  // 删除成功
                  deleteData.push({
                    status: 1,
                    details: '删除:' + n.code + n.name,
                    directions: '删除成功'
                  })
                }
              })
              data.failList.forEach(i => {
                if (n.id === i.businessId) {
                  // 删除失败
                  deleteData.push({
                    status: 0,
                    details: '删除:' + n.code + n.name,
                    directions: i.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = deleteData
            this.checked = '删除成功' + data.successList.length + '条，失败' + data.failList.length + '条'
            this.querySchemeList1()
          }
        })
      }
    },
    // 点击选择反启用子系统图标变绿
    doSelcetUnOpenChild (item) {
      item.iconType = !item.iconType
    },
    // 单个启用子系统Drawer的确定
    doDrawerOpenChildOk () {
      let selectSign = false
      this.openChildData.forEach(i => {
        if (i.iconType) {
          selectSign = true
        }
      })
      if (selectSign) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: '确定要启用子系统吗？',
          button: ['确认', '取消'],
          yes () {
            that.doModalOpenChildOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须选择一个子系统！')
      }
    },
    // 启用子系统Drawer的取消
    doDrawerOpenChildCancle () {
      this.openChildDrawer = false
    },
    // 启用子系统的modal框的确定
    doModalOpenChildOk () {
      if (!this.allConfig) {
        // 单个启用
        let arr = []
        this.openChildData.forEach(i => {
          if (i.iconType) {
            arr.push({
              systemName: i.name,
              systemSign: i.systemSign,
              periodYear: i.periodYear,
              periodNum: i.periodNum,
              cashFlowEnableStatus: i.name === '总账' ? i.cashFlowEnableStatus : null
            })
          }
        })
        let reqdata = {
          id: this.accountBookId,
          name: this.accountBookName,
          code: this.accountBookCode,
          accountingCalendarId: this.accountingCalendarId,
          accountBookSystemDtoList: arr
        }
        this.$request.post('/financeback/accountBook/enableAccountBookSystem', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            this.$Message.success('启用成功！')
            this.querySchemeList1()
          }
        })
      } else {
        let arrAll = []
        let sendArr = []
        // 批量启用
        this.openChildData.forEach(i => {
          if (i.iconType) {
            arrAll.push({
              systemName: i.name,
              systemSign: i.systemSign,
              periodYear: i.periodYear,
              periodNum: i.periodNum,
              cashFlowEnableStatus: i.name === '总账' ? i.cashFlowEnableStatus : null
            })
          }
        })
        this.selectData.forEach(n => {
          sendArr.push({
            id: n.id,
            name: n.name,
            code: n.code,
            accountingCalendarId: n.accountingCalendarId,
            accountBookSystemDtoList: arrAll
          })
        })
        this.$request.post('/financeback/accountBook/enableAccountBookSystemBatch', sendArr).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let selectNum = this.selectData.length // 总选择的个数
            let aName = null // 总账
            let aNum = 0 // 总账成功的个数
            let bName = null // 资产
            let bNum = 0 // 资产成功的个数
            let cName = null // 应收
            let cNum = 0 // 应收成功的个数
            let nameList = []
            this.batchHandleModal = true
            arrAll.forEach(n => {
              nameList.push(n.systemName)
            })
            sendArr[0].accountBookSystemDtoList.forEach(n => {
              if (n.systemSign === 'ledger') {
                aName = '总账'
              }
              if (n.systemSign === 'asset') {
                bName = '资产'
              }
              if (n.systemSign === 'receive') {
                cName = '应收'
              }
            })
            data.batchOperationMessageList.forEach(i => {
              if (i.status === 1) {
                if (i.sign === 'ledger') {
                  aNum++
                }
                if (i.sign === 'asset') {
                  bNum++
                }
                if (i.sign === 'receive') {
                  cNum++
                }
                i.directions = '启用成功'
              } else {
                i.directions = '当前子系统已启用，不能重复启用'
              }
            })
            data.batchOperationMessageList.forEach(n => {
              n += '启用:'
            })
            this.batchhandleData = data.batchOperationMessageList
            let aInfos = aName ? aName + '管理子系统成功' + aNum + '个，失败' + (selectNum - aNum) + '个' : ''
            let bInfos = bName ? bName + '管理子系统成功' + bNum + '个，失败' + (selectNum - bNum) + '个' : ''
            let cInfos = cName ? cName + '管理子系统成功' + cNum + '个，失败' + (selectNum - cNum) + '个' : ''
            this.checked = aInfos + ((bName && aName) || (cName && aName) ? ';' : '') + bInfos + (bName && cName ? ';' : '') + cInfos
            this.querySchemeList1()
          }
        })
      }
      this.openChildDrawer = false
    },
    // 表格配置
    doClickConfig () {
      this.configDrawerShow = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.isXTable = false
        this.doGettableHeader()
        this.querySchemeList1()
      }
      this.configDrawerShow = false
    },
    // 刷新
    doRefresh () {
      this.querySchemeList1()
    }
  }
}
</script>

<style lang="less" >
@import '../../../assets/css/redefine.less';
@import '../../../assets/css/base.less';
@import '../../organization/business/title.less';
.book-show{
  .period-table {
    padding: 0 16px;
    position: relative;
  }
  .period-table-no {
    position: relative;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .query-condition-lf {
    .maright {
      margin-right: 8px;
    }
    .inputs-width {
      width: 213px !important;
    }
    .select-width {
      width: 142px;
    }
    .query-input {
      width: 250px;
    }
  }
  .book-drawer {
    .ivu-table td {
      height: 32px;
    }
    .ivu-drawer-mask {
      top: 80px !important;
      bottom: 8px !important;
      left: 175px !important;
      height: 90.5% !important;
    }
    .ivu-drawer-content {
      height: 90.5% !important;
      position: absolute !important;
      top: 80px !important;
      bottom: 8px !important;
    }
    .drawer{
      position: relative;
      .drawer-main{
        height:92%;
        overflow-y:auto;
        padding: 16px;
        .drawer-title{
          display: flex;
          height: 28px;
          span{
            width: 40%;
          }
          div{
            width: 60%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap
          }
        }
        .child-list{
          position: relative;
          height: 100px;
          width: 100%;
          display: flex;
          border-radius:10px;
          box-shadow:2px 3px 6px 0px rgba(0,0,0,0.15);
          margin-bottom: 8px;
          .child-list-left{
            width: 30%;
            text-align: center;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            padding-top:25px;
            .child-list-left-icon{
              width: 18px;
              height: 18px;
            }
            p{
              margin-top: 5px;
            }
            .p-color{
              color: #fff;
            }
          }
          .child-list-left-gary{
            background:rgba(210,210,210,1);
          }
          .child-list-right-gary{
            display: flex;
            width: 70%;
            align-items: center;
            justify-content: space-around;
            color: #999999;
          }
          .child-list-right-light{
            display: flex;
            width: 70%;
            align-items: center;
            justify-content: space-around;
            box-sizing: border-box;
            padding: 0 20px;
            p{
              font-size: 16px;
              color: #333;
              font-weight: bold;
              opacity: 85%;
            }
            .ivu-select-item {
              padding: 8px !important;
            }
            .select-input{
              width:75px;
              margin-right: 5px;
            }
            .select-input2{
              width:75px;
              .ivu-select-dropdown {
                min-width: 82px !important;
              }
            }
            .checkbox {
              margin-top: 5px;
              .ivu-checkbox {
                margin-right: 5px;
              }
            }
          }
          .right-icon{
            position: absolute;
            right: 0;
            top: 0;
            width: 35px;
            height: 35px;
          }
          .right-icon-gray{
            color:rgba(210,210,210,1);
          }
        }
      }
      .drawer-foot{
        height:8%;
        box-sizing: border-box;
        padding-top:13%;
        div{
          text-align: right;
          .confim-button{
            margin-right: 10px;
          }
        }
      }
      .top-border{
        position: absolute;
        height: 1px;
        background: #e8eaec;
        bottom:7%;
        width: 100%;
        left: 0;
      }
    }
  }
  .table-span {
    margin-right: 24px
  }
  .table-span-active{
    display: inline-block;
    width: 14%;
  }
  .table-span-active1{
    display: inline-block;
    width: 33%;
  }
  .table-span-active2{
    display: inline-block;
    width: 40%;
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
