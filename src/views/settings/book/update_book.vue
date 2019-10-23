<template>
  <div class="update-book">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="page-header">
      <div class="page-header-name">查看核算账簿</div>
    </div>
    <section class="page-content page-content1">
       <Form  :model="formValidate" :label-width="120" class="form_init form_init1">
          <Row class="row-bottom">
            <Col span="8" >
              <FormItem label="账簿编码" >
                <div class="preview-div">
                  <p >{{formValidate.code}}</p>
                </div>
              </FormItem>
            </Col>
            <Col span="8" >
              <FormItem label="账簿名称" >
                <div class="preview-div">
                  <p >{{formValidate.name}}</p>
                </div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="公司名称" >
                <div class="preview-div">
                  <p >{{formValidate.companyName}}</p>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row class="row-bottom">
            <Col span="8" >
              <FormItem label="会计准则" >
                <div class="preview-div">
                  <p >{{formValidate.accountingStandardName}}</p>
                </div>
              </FormItem>
            </Col>
            <Col span="8" >
              <FormItem label="记账本位币" >
                <div class="preview-div">
                  <p >{{formValidate.accountingCurrencyName}}</p>
                </div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="启用分账核算" >
                <Checkbox v-model="formValidate.hasSubAccount" :true-value=1 :false-value=0 class="checkbox" disabled></Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row class="row-bottom">
            <Col span="8" >
              <FormItem label="会计日历" >
                <div class="preview-div">
                  <p >{{formValidate.accountingCalendarName}}</p>
                  <span class="preview textBtn" @click="doPreviewAccountingCalendarItem(formValidate.accountingCalendarName)">预览</span>
                </div>
              </FormItem>
            </Col>
            <Col span="8" >
              <FormItem label="科目表" >
                <div class="preview-div">
                  <p >{{formValidate.subjectListName}}</p>
                  <span class="preview textBtn" @click="doPreviewSubjectItem(formValidate.subjectListId)">预览</span>
                </div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="资产负债表" >
                <div class="preview-div">
                  <Select v-model="formValidate.assetItem"   class="select-input">
                    <Option v-for="item in assetList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <span class="preview textBtn" @click="doPreviewAssetItem(formValidate.assetItem)">预览</span>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row class="row-bottom">
            <Col span="8">
              <FormItem label="利润表" >
                <div class="preview-div">
                  <Select v-model="formValidate.profitItem"   class="select-input">
                    <Option v-for="item in profitList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <span class="preview textBtn"  @click="doPreviewProfitItem(formValidate.profitItem)">预览</span>
                </div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="现金流量表" >
                <div class="preview-div">
                  <Select v-model="formValidate.cashFlow"  class="select-input">
                    <Option v-for="item in cashFlowList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <span class="preview textBtn"  @click="doPreviewCashFlow(formValidate.cashFlow)">预览</span>
                </div>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label="现金流量项目表" >
                <div class="preview-div">
                  <Select v-model="formValidate.cashFlowItem"  class="select-input">
                    <Option v-for="item in cashFlowItemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <span class="preview textBtn" @click="doPreviewCashFlowItem(formValidate.cashFlowItem)">预览</span>
                </div>
              </FormItem>
            </Col>
          </Row>
       </Form>
    </section>
    <section class="page-content page-content2 ivu-tabs-content">
      <Tabs value="name1">
        <TabPane label="核算主体" name="name1" >
          <div class="query-condition">
            <div class="query-condition-lf">
              <Row class="screen">
                <Col span="4">
                  <Input v-model="BookEntityCondition.codeOrName" placeholder="核算主体编码或名称" :maxlength="40" search  @on-search="enterBookName" @on-clear="enterBookName" clearable />
                </Col>
                <Col span="5">
                  <Button @click="doReset">重置</Button>
                </Col>
              </Row>
            </div>
          </div>
          <div :class="tableLoading ? 'period-table page-content-table' : 'period-table-no page-content-table'">
            <Spin fix v-if="tableLoading">
              <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
              <div>正在载入数据</div>
            </Spin>
            <Table :columns="tableColumns" max-height="540" :no-data-text="null" :class="tableData.length ? null : 'tableHeight'" :data="tableData" ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </div>
        </TabPane>
        <TabPane label="子系统状态" name="name2">
          <div class="page-content-table">
            <Table :columns="ChildTableColumns" max-height="570" :no-data-text="null" :class="ChildTableData.length ? null : 'tableHeight'" :data="ChildTableData" ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="ChildTableData.length===0"></nodata>
          </div>
        </TabPane>
      </Tabs>
    </section>
    <!-- 科目表的modal -->
    <Modal
        v-model="subjectShow"
        width="1000"
        :mask-closable="false"
        :transfer="false"
        draggable
        scrollable
        class="querCompany"
        >
        <p slot="header" style="color:#333;text-align:left">
            <span>科目表</span>
        </p>
        <div class="page-content-table modal-table">
            <Table
            :columns="subjectTableColumns"
            :data="subjectTableData"
            :no-data-text="null"
            :class="subjectTableData.length ? null : 'tableHeight'"
            max-height="340"
            ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="subjectTableData.length===0"></nodata>
        </div>
        <section class="book-active">
          <div class="page-footer-lf left">
            共 <strong>{{ subjectTableDataTotal }}</strong>条数据
          </div>
          <div class="page-footer-rt right">
            <Page id="pageId" class-name="pages" :total="subjectTableDataTotal" :page-size="subjectPageSize" :page-size-opts="[20, 50, 100, 200, 500, 1000]" show-elevator show-sizer @on-change="doUpdateSubjectCurrentPage" @on-page-size-change="doUpdateSubjectPageSize"></Page>
            <Button size="small" @click="goElevatorPage('pageId')">GO</Button>
          </div>
        </section>
        <div slot="footer" class="book-modal-foot foot">
          <Button  @click="doSubjectModalCancle">关闭</Button>
        </div>
    </Modal>
    <!-- 现金流量项目表的modal -->
    <Modal
        v-model="cashFlowItemShow"
        width="1000"
        :mask-closable="false"
        :transfer="false"
        draggable
        scrollable
        class="querCompany"
        >
        <p slot="header" style="color:#333;text-align:left">
            <span>现金流量项目表</span>
        </p>
        <div class="page-content-table modal-table">
            <Table
            :columns="cashFlowItemTableColumns"
            :data="cashFlowItemTableData"
            :no-data-text="null"
            :class="cashFlowItemTableData.length ? null : 'tableHeight'"
            max-height="340"
            ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="cashFlowItemTableData.length===0"></nodata>
        </div>
        <div slot="footer" class="book-modal-foot">
          <Button  @click="doCashFlowItemModalCancle">关闭</Button>
        </div>
    </Modal>
    <!-- 会计日历的modal -->
    <Modal
      v-model="accountingCalendarShow"
      width="720"
      :mask-closable="false"
      :transfer="false"
      draggable
      scrollable
      class="querCompany"
      >
      <p slot="header" style="color:#333;text-align:left">
        <span>{{formValidate.accountingCalendarName}}</span>
      </p>
      <div class="page-content-table modal-table1">
        <div class="table-title"><span @click="doPrevious">《</span>{{accountingCalendarYear}}<span @click="doNext">》</span></div>
        <Table
        :columns="accountingCalendarColumns"
        :data="accountingCalendarTableData"
        :no-data-text="null"
        :class="accountingCalendarTableData.length ? null : 'tableHeight'"
        max-height="340"
        ></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="accountingCalendarTableData.length===0"></nodata>
      </div>
      <div slot="footer" class="book-modal-foot">
        <Button  @click="doAccountingCalendarCancle">关闭</Button>
      </div>
    </Modal>
    <!-- 资产负债表的modal -->
    <Modal
        v-model="assetShow"
        width="720"
        :mask-closable="false"
        :transfer="false"
        draggable
        scrollable
        class="querCompany"
        >
        <p slot="header" style="color:#333;text-align:left">
            <span>资产负债表</span>
        </p>
        <div class="page-content-table modal-table">
            <Table
            :columns="assetTableColumns"
            :data="assetTableData"
            :no-data-text="null"
            :class="assetTableData.length ? null : 'tableHeight'"
            max-height="340"
            ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="assetTableData.length===0"></nodata>
        </div>
        <div slot="footer" class="book-modal-foot">
          <Button  @click="doAssetModalCancle">关闭</Button>
        </div>
    </Modal>
    <!-- 利润表的modal -->
    <Modal
        v-model="profitsShow"
        width="720"
        :mask-closable="false"
        :transfer="false"
        draggable
        scrollable
        class="querCompany"
        >
        <p slot="header" style="color:#333;text-align:left">
            <span>{{modalTitle}}</span>
        </p>
        <div class="page-content-table modal-table">
            <Table
            :columns="profitsTableColumns"
            :data="profitsTableData"
            :no-data-text="null"
            :class="profitsTableData.length ? null : 'tableHeight'"
            max-height="340"
            ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="profitsTableData.length===0"></nodata>
        </div>
        <div slot="footer" class="book-modal-foot">
          <Button  @click="doProfitsModalCancle">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import nodata from '_c/nodata'
import store from '@/store'
import { saasMixin } from '@/libs/mixins'
export default {
  name: 'update_book',
  components: {
    nodata
  },
  created () {
    if (this.$route.query.accountBookId) {
      this.querySchemeList().then(response => {
        if (response) {
          this.queryBookEntity(response)
          this.queryChildStatus(response)
        }
      })
    } else if (this.$route.query.companyId) {
      this.queryCompanySchemeList().then(response => {
        if (response) {
          this.queryBookEntity(response)
          this.queryChildStatus(response)
        }
      })
    }
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      formValidate: {
        hasSubAccount: 0, // 启用分账核算
        debt: -1
      },
      BookEntityCondition: {
        codeOrName: '',
        companyCodeOrName: ''
      },
      tableColumns: [
        {
          title: '核算主体编码',
          key: 'entityCode'
        },
        {
          title: '核算主体名称',
          key: 'entityName'
        },
        {
          title: '主体类型',
          key: 'formName'
        }
      ],
      ChildTableColumns: [
        {
          title: '子系统名称',
          key: 'systemName'
        },
        {
          title: '启用期间',
          key: 'time'
        },
        {
          title: '启用状态',
          key: 'status',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  backgroundColor: params.row.status === 1 ? '#595959' : '#f73e3e',
                  borderRadius: '50%',
                  marginRight: '4px'
                }
              }),
              h('span', {
                style: {
                  color: params.row.status === 1 ? '#595959' : '#f73e3e',
                  verticalAlign: 'middle'
                }
              }, params.row.status === null ? '未启用' : '已启用')
            ])
          }
        },
        {
          title: '启用现金流量',
          key: 'cashFlowEnableStatus',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  backgroundColor: params.row.cashFlowEnableStatus === 1 ? '#595959' : '#f73e3e',
                  borderRadius: '50%',
                  marginRight: '4px'
                }
              }),
              h('span', {
                style: {
                  color: params.row.cashFlowEnableStatus === 1 ? '#595959' : '#f73e3e',
                  verticalAlign: 'middle'
                }
              }, params.row.cashFlowEnableStatus ? '已启用' : '未启用')
            ])
          }
        },
        {
          title: '启用人',
          key: 'operatorName'
        },
        {
          title: '启用时间',
          key: 'operateTime'
        }
      ],
      tableData: [],
      ChildTableData: [],
      subjectTableData: [], // 科目表数据
      subjectTableDataTotal: 0, // 科目表总数
      subjectPageSize: 20, // 科目表请求数量
      subjectShow: false, // 科目表modal框出现
      subjectTableColumns: [
        {
          title: '科目编码',
          tooltip: true,
          key: 'code'
        },
        {
          title: '科目名称',
          tooltip: true,
          key: 'name'
        },
        {
          title: '类别属性',
          tooltip: true,
          key: 'typeAttributeName'
        },
        {
          title: '余额方向',
          tooltip: true,
          key: 'balanceDirection',
          render: (h, params) => {
            return h('span', params.row.balanceDirection === 1 ? '贷方' : '借方')
          }
        },
        {
          title: '分类',
          tooltip: true,
          key: 'accountCategoryName',
          render: (h, params) => {
            return h('span', params.row.accountCategoryName === 'A01' ? '现金科目' : params.row.accountCategoryName === 'A02' ? '银行科目' : params.row.accountCategoryName === 'A03' ? '现金等价物' : '一般科目')
          }
        },
        {
          title: '辅助核算',
          tooltip: true,
          key: 'auxiliaryNames'
        },
        {
          title: '现金流量项目',
          tooltip: true,
          key: 'cashFlowNames'
        }
      ], // 科目modal配置
      subjectPage: {
        size: 20,
        current: 1
      }, // 科目表分页
      cashFlowItemShow: false, // 现金流量项目表modal的出现
      cashFlowItemTableColumns: [
        {
          title: '现金流量编码',
          tooltip: true,
          key: 'code'
        },
        {
          title: '现金流量名称',
          tooltip: true,
          key: 'name'
        },
        {
          title: '现金流向',
          tooltip: true,
          key: 'cashFlowDirectionName'
        }
      ], // 金流量项目表modal的配置
      cashFlowItemTableData: [], // 现金流量项目表数据
      yearList: store.state.app.yearList,
      cashFlowItemList: [], // 现金流量项目表
      profitList: [], // 利润表
      cashFlowList: [], // 现金流量表
      assetList: [], // 资产负债表
      accountBookId: null, // 账簿id
      accountingCalendarShow: false, // 会计日历modal的出现
      accountingCalendarColumns: [
        {
          title: '会计年度',
          tooltip: true,
          key: 'periodYear'
        },
        {
          title: '期间号',
          tooltip: true,
          key: 'periodNum'
        },
        {
          title: '开始日期',
          tooltip: true,
          key: 'startDate'
        },
        {
          title: '结束日期',
          tooltip: true,
          key: 'endDate'
        }
      ], // 会计日历modal的配置
      allAccountingCalendarTableData: [],
      accountingCalendarYear: null,
      allYear: [],
      numYear: 0,
      accountingCalendarTableData: [], // 会计日历数据
      modalTitle: '',
      assetShow: false, // 资产负债表modal的出现
      assetTableColumns: [
        {
          title: '资产',
          tooltip: true,
          key: 'name',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span style="font-weight: bold;" v-show={row.level === 0}>{row.name}</span>
                <span style="margin-left: 1px;" v-show={row.level === 1}>{row.name}</span>
                <span style="margin-left: 20px;" v-show={row.level === 2}>{row.name}</span>
                <span style="margin-left: 30px;" v-show={row.level === 3}>{row.name}</span>
                <span style="margin-left: 40px;" v-show={row.level === 4}>{row.name}</span>
              </div>
            )
          }
        },
        {
          title: '行次',
          type: 'index',
          width: 100,
          align: 'center'
        }
      ], // 资产负债表modal的配置
      assetTableData: [], // 资产负债表数据
      profitsShow: false, // 资产负债表modal的出现
      titles: ['一、', '二、', '三、', '四、', '五、'],
      profitsTableColumns: [
        {
          title: '项目',
          tooltip: true,
          key: 'name',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span style="font-weight: bold;" v-show={row.level === 0}>{this.titles[index] + row.name}</span>
                <span style="margin-left: 1px;" v-show={row.level === 1}>{row.name}</span>
                <span style="margin-left: 20px;" v-show={row.level === 2}>{row.name}</span>
                <span style="margin-left: 30px;" v-show={row.level === 3}>{row.name}</span>
                <span style="margin-left: 40px;" v-show={row.level === 4}>{row.name}</span>
              </div>
            )
          }
        },
        {
          title: '行次',
          type: 'index',
          width: 100,
          align: 'center'
        }
      ], // 资产负债表modal的配置
      profitsTableData: [] // 资产负债表数据
    }
  },
  mixins: [saasMixin],
  methods: {
    // 通过公司传过来的初始化
    queryCompanySchemeList () {
      // let that = this
      let reqdata = {
        companyId: this.$route.query.companyId,
        accountingStandardId: this.$route.query.accountingStandardId
      }
      this.loading = true
      return this.$request.post('/financeback/accountBook/findAccountBookByCompanyId', reqdata).then(response => {
        this.loading = false
        let { status, data } = response.data
        if (status === 'success') {
          if (data && data.accountCashFlow) {
            [data.accountCashFlow].forEach(i => {
              this.cashFlowItemList.push({
                value: i.cashFlowId,
                label: i.cashFlowName
              })
            })
          }
          if (data && data.assetList) {
            data.assetList.forEach(i => {
              this.assetList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data && data.profitList) {
            data.profitList.forEach(i => {
              this.profitList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data && data.cashFlowList) {
            data.cashFlowList.forEach(i => {
              this.cashFlowList.push({
                value: i.id,
                label: i.name,
                year: i.year
              })
            })
          }
          this.formValidate = {
            code: data.code,
            name: data.name,
            companyName: data.companyName,
            accountingStandardName: data.accountingStandardName,
            accountingCurrencyName: data.accountingCurrencyName,
            hasSubAccount: data.hasSubAccount,
            accountingCalendarName: data.accountingCalendarName,
            subjectListName: data.subjectName,
            subjectListId: data.subjectId,
            cashFlowItem: data.cashFlowItemId,
            cashFlow: data.cashFlowId,
            assetItem: data.balanceSheetId, // 资产负债表id
            profitItem: data.incomeStatementId, // 利润表id
            accountBookTypeId: data.accountBookTypeId, // 账簿ID
            accountingCalendarId: data.accountingCalendarId // 日历ID
          }
          this.accountBookId = data.id
          return {
            accountBookId: data.id
          }
        }
      })
    },
    // 查询列表
    querySchemeList () {
      let reqdata = {
        id: this.$route.query.accountBookId,
        accountingStandardId: this.$route.query.accountingStandardId
      }
      this.loading = true
      return this.$request.post('/financeback/accountBook/findAccountBookById', reqdata).then(response => {
        this.loading = false
        let { status, data } = response.data
        if (status === 'success') {
          if (data && data.accountCashFlow) {
            [data.accountCashFlow].forEach(i => {
              this.cashFlowItemList.push({
                value: i.cashFlowId,
                label: i.cashFlowName
              })
            })
          }
          if (data && data.assetList) {
            data.assetList.forEach(i => {
              this.assetList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data && data.profitList) {
            data.profitList.forEach(i => {
              this.profitList.push({
                value: i.id,
                label: i.name
              })
            })
          }
          if (data && data.cashFlowList) {
            data.cashFlowList.forEach(i => {
              this.cashFlowList.push({
                value: i.id,
                label: i.name,
                year: i.year
              })
            })
          }
          this.formValidate = {
            code: data.code,
            name: data.name,
            companyName: data.companyName,
            accountingStandardName: data.accountingStandardName,
            accountingCurrencyName: data.accountingCurrencyName,
            hasSubAccount: data.hasSubAccount,
            accountingCalendarName: data.accountingCalendarName,
            subjectListName: data.subjectName,
            subjectListId: data.subjectId,
            cashFlowItem: data.cashFlowItemId,
            cashFlow: data.cashFlowId,
            assetItem: data.balanceSheetId, // 资产负债表id
            profitItem: data.incomeStatementId, // 利润表id
            accountBookTypeId: data.accountBookTypeId, // 账簿ID
            accountingCalendarId: data.accountingCalendarId // 日历ID
          }
          this.accountBookId = data.id
          return {
            accountBookId: data.id
          }
        }
      })
    },
    // 查询核算主体
    queryBookEntity (res) {
      let reqdata = {
        codeOrName: this.BookEntityCondition.codeOrName,
        companyHasSubAccount: this.$route.query.hasSubAccount,
        id: res.accountBookId
      }
      this.tableLoading = true
      this.$request.post('/financeback/accountBookEntity/findAccountBookEntityList', reqdata).then(response => {
        let { status, data } = response.data
        this.tableLoading = false
        if (status === 'success') {
          this.tableData = data
        }
      })
    },
    // 查询子系统状态
    queryChildStatus (res) {
      let reqdata = {
        accountBookId: res.accountBookId
      }
      this.$request.post('/financeback/accountBookSystem/findList', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          data.forEach(i => {
            if (i.periodYear && i.periodNum) {
              i.time = i.periodYear + '年第' + i.periodNum + '期'
            } else {
              i.time = ''
            }
            i.operateTime = i.operateTime ? this.$dayjs(i.operateTime).format('YYYY-MM-DD') : ''
          })
          this.ChildTableData = data
        }
      })
    },
    // 核算主体查询
    enterBookName () {
      let res = {
        accountBookId: this.accountBookId
      }
      this.queryBookEntity(res)
    },
    // 预览科目表
    doPreviewSubjectItem (data) {
      this.subjectShow = true
      let reqdata = {
        subjectId: data,
        page: this.subjectPage
      }
      this.$request.post('/financeback/accountSubject/findPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.subjectTableDataTotal = data.total
          this.subjectTableData = data.records
        }
      })
    },
    // 科目表分页功能
    doUpdateSubjectCurrentPage (val) {
      this.subjectPage.current = val
      this.doPreviewSubjectItem(this.formValidate.subjectListId)
    },
    // 科目表大小功能
    doUpdateSubjectPageSize (val) {
      this.subjectPage.size = val
      this.doPreviewSubjectItem(this.formValidate.subjectListId)
    },
    // 科目表modal框关闭按钮
    doSubjectModalCancle () {
      this.subjectShow = false
    },
    // 预览现金流量项目表
    doPreviewCashFlowItem (data) {
      console.log('data', data)
      this.cashFlowItemShow = true
      let reqdata = {
        cashFlowId: data
      }
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemTempleteByPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.cashFlowItemTableData = data.records
        }
      })
    },
    // 现金流量项目表的取消
    doCashFlowItemModalCancle () {
      this.cashFlowItemShow = false
    },
    // 预览现金流量表
    doPreviewCashFlow (data) {
      console.log('流量', data)
      let reqdata = {
        cashFlowId: data
      }
      this.profitsShow = true
      this.modalTitle = '现金流量表'
      this.$request.post('/financeback/accountBook/findCashFlowReportList', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let item = data.find(r => r.level === 0)
          if (!item) {
            data.unshift({
              level: 0,
              name: ''
            })
          }
          this.profitsTableData = data
        }
      })
    },
    // 预览资产负债表
    doPreviewAssetItem (data) {
      console.log('资产', data)
      this.assetShow = true
      let reqdata = {
        balanceSheetId: data
      }
      this.$request.post('/financeback/accountBook/findAssetReportList', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.assetTableData = data
        }
      })
    },
    // 资产负债表的取消
    doAssetModalCancle () {
      this.assetShow = false
    },
    // 预览利润表
    doPreviewProfitItem (data) {
      console.log('data', data)
      this.profitsShow = true
      let reqdata = {
        incomeStatementId: data
      }
      this.modalTitle = '利润表'
      this.$request.post('/financeback/accountBook/findProfitReportList', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let item = data.find(r => r.level === 0)
          if (!item) {
            data.unshift({
              level: 0,
              name: ''
            })
          }
          this.profitsTableData = data
        }
      })
    },
    // 利润表的取消
    doProfitsModalCancle () {
      this.profitsShow = false
    },
    // 预览会计日历
    doPreviewAccountingCalendarItem (name) {
      this.accountingCalendarShow = true
      let reqdata = {
        accCalendarId: this.formValidate.accountingCalendarId
      }
      this.accountingCalendarTableData = []
      this.$request.post('/financeback/accountBook/findAccountBookPeriod', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let _years = []
          data.forEach(r => {
            r.periodYear += '年'
            r.startDate = this.$dayjs(r.startDate).format('YYYY年MM月DD日')
            r.endDate = this.$dayjs(r.endDate).format('YYYY年MM月DD日')
            _years.push(r.periodYear)
          })
          this.allYear = [...new Set(_years)]
          this.accountingCalendarYear = _years[0]
          this.allAccountingCalendarTableData = data
        }
        this.allAccountingCalendarTableData.forEach(item => {
          if (item.periodYear === this.accountingCalendarYear) {
            this.accountingCalendarTableData.push(item)
          }
        })
      })
    },
    doPrevious () {
      this.accountingCalendarTableData = []
      this.numYear--
      if (this.accountingCalendarYear === this.allYear[0]) {
        this.numYear = 0
      }
      this.accountingCalendarYear = this.allYear[this.numYear]
      this.allAccountingCalendarTableData.forEach(item => {
        if (item.periodYear === this.accountingCalendarYear) {
          this.accountingCalendarTableData.push(item)
        }
      })
      console.log(this.numYear)
    },
    doNext () {
      this.accountingCalendarTableData = []
      this.numYear++
      if (this.accountingCalendarYear === this.allYear[this.allYear.length - 1]) {
        this.numYear = this.allYear.length - 1
      }
      this.accountingCalendarYear = this.allYear[this.numYear]
      this.allAccountingCalendarTableData.forEach(item => {
        if (item.periodYear === this.accountingCalendarYear) {
          this.accountingCalendarTableData.push(item)
        }
      })
      console.log(this.numYear)
    },
    // 会计日历的取消
    doAccountingCalendarCancle () {
      this.accountingCalendarShow = false
    },
    // 重置
    doReset () {
      let res = {
        accountBookId: this.accountBookId
      }
      this.BookEntityCondition = {
        codeOrName: '',
        companyCodeOrName: ''
      }
      this.queryBookEntity(res)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../organization/business/title.less';
.update-book{
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
  .page-content1{
    border-bottom: 1px solid #E5E5E5;
    .ivu-form-item {
      margin-bottom: 0;
    }
    .row-bottom{
      margin-bottom: 4px;
    }
    p{
      color: #999999;
      width: 45%;
      display: inline-block;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      margin-left: 20px;
      margin-right: 10%;
    }
    .preview-div{
      display: flex;
      .select-input{
        width: 45%;
        margin-right: 10%;
        margin-left: 20px;
      }
      .preview{
        cursor: pointer;
      }
    }
    .checkbox{
      margin-left: 20px;
    }
  }
  .page-content2 {
    .query-condition .query-condition-lf .screen .ivu-col {
      padding-top: 0px !important;
      padding-left: 0px !important;
      margin-right: 10px;
    }
  }
  .ivu-tabs-bar{
    margin-bottom: 0;
  }
  .book-active{
    position: absolute;
    width: 100%;
    display: flex;
    bottom: 48px;
    justify-content: space-between;
    padding: 0 16px 10px 16px;
    align-items: bottom;
    .left{
      // padding-top:16px;
      padding-top:8px;
    }
    .right{
      display: flex;
    }
  }
  .modal-table {
    margin: 16px;
    height: 360px;
  }
  .modal-table1 {
    margin: 0px 16px;
    height: 392px;
    .table-title {
      padding: 10px 0px;
      text-align: center;
      span {
        margin: 0px 10px;
        cursor: pointer;
      }
    }
  }
  .book-modal-foot{
    position: absolute;
    bottom: -32px;
    right: 0px;
    width: 100%;
    padding-right: 16px;
    padding-top:8px;
    border-top: 1px solid #e8eaec;
  }
  .foot {
    bottom: -72px;
  }
}
</style>
