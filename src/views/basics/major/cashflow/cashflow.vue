<template>
  <section class="cashflow-page">
    <Spin fix v-if="isloading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">现金流量项目列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreate({})">新增</Button>
        <Button @click="toDeleteList">删除</Button>
        <Button @click="toProhibitList">禁用</Button>
        <Button @click="toUnProhibitList">反禁用</Button>
        <Button @click="doShowUpload">
          <common-icon type="_export" :size="14"/>
        </Button>
        <Button @click="doImport">
          <common-icon type="_import" :size="14"/>
        </Button>
        <Button @click="tableConfig = !tableConfig">
          <common-icon type="_table" style="margin-top: 3px;"/>
        </Button>
        <Button @click="toRefresh">
          <common-icon type="_refresh" :size="14"/>
        </Button>
      </div>
    </section>
    <section class="page-content">
      <div class="page-content-header">
        <Row>
          <Col span="6">
            <span class="header-span"> 账簿类型 </span>
            <span class="header-font-span"> {{accountBookType.label}} </span>
              <!-- <Select v-model="accountBookType.value">
                <Option v-for="item in accountBookType.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select> -->
          </Col>
          <Col span="6">
            <span class="header-span">会计准则</span>
            <!-- 解决bug 单选不可选 ^ o ^ -->
            <span class="header-font-span"> {{accountingStandardValue}} </span>
              <!-- <Select v-model="accountingStandard.value" @on-change="doChangeAccountingStandard" disabled>
                <Option v-for="item in accountingStandard.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select> -->
          </Col>
          <Col span="8">
            <span class="header-span">现金流量项目</span>
            <span class="header-font-span"> {{cashFlowModal.label}} </span>
              <!-- <Select v-model="cashFlowModal.value" @on-change="doCashFlowCurrentReset">
                <Option v-for="item in cashFlowModal.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select> -->
          </Col>
        </Row>
      </div>
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class='screen'>
            <Col span="4" class="first-nospace">
              <!-- 公司组件 -->
              <radio-select
              v-model="cashFlowCompany.name"
              :config="company_config"
              :reset="company_config.refresh"
              :bloc="isGropFlag"
              @getData="getCompanyData"
              @on-close="doResetCompanyConfig"
              placeholder="创建公司编码/名称">
                <div slot="header" class="search-contain">
                  <Row :gutter="10">
                    <Col span="4" style="padding-top: 0px">
                      <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                        <Option v-for="item in companytype_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8" style="padding-top: 0px">
                      <Input class="search-button" v-model="createCodeOrName" placeholder="编码/名称" clearable @on-enter="doSearchCompany" @on-change="doCompanyChange">
                        <Button slot="append" icon="ios-search" @click="doSearchCompany"></Button>
                      </Input>
                    </Col>
                    <Col span="4" style="padding-top: 0px">
                      <Button style="position: relative;" @click="doResetCompanyConfig">重置</Button>
                    </Col>
                  </Row>
                </div>
              </radio-select>
            </Col>
            <!-- 全部分组 -->
            <Col span="2" style="padding-top: 16px;">
              <Select v-model="cashFlowTpye.value" @on-change="doCashFlowCurrentReset">
                <Option v-for="item in cashFlowTpye.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <!-- 全部方向 -->
            <Col span="2" style="padding-top: 16px;">
               <Select v-model="cashFlowDirection.value" @on-change="doCashFlowCurrentReset">
                <Option v-for="item in cashFlowDirection.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <!-- 全部状态 -->
            <Col span="2" style="padding-top: 16px;">
               <Select v-model="cashFlowState.value" @on-change="doCashFlowCurrentReset">
                <Option v-for="item in cashFlowState.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <!-- 编码或名称 -->
            <Col span="4" style="padding-top: 16px;">
               <Input class="search-button" v-model="cashFlowCodeOrName.value" placeholder="编码/名称" @on-enter="doCheckInput" @on-clear="doCheckInput" @on-change="doInputChange" clearable>
                <Button slot="append" icon="ios-search" @click="doCheckInput"></Button>
              </Input>
            </Col>
            <!-- 重置按钮 -->
            <Col span="1" style="padding-top: 16px;">
              <Button @click="doReset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div class="page-content-table">
        <Spin fix v-if="tableLoading && !isloading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
         <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          :columns="cashFlowList.newcolumns"
          :data="cashFlowList.data"
          :height="cashFlowList.data.length ? getTableheight : 0"
          @select-all="doSelect"
          @select-change="doSelect">
            <template v-slot:empty>
              <nodata :icon-size="60" notice-text="暂无数据"></nodata>
            </template>
          </vxe-grid>
        <!-- <Table
          :no-data-text="null"
          :columns="cashFlowList.newcolumns"
          :data="cashFlowList.data"
          :class="cashFlowList.data.length ? null : 'table-height'"
          :height="getTableheight"
          @on-select="doSelect"
          @on-select-cancel="doSelect"
          @on-select-all="doSelect"
          @on-select-all-cancel="doSelect"
          ></Table> -->
        <!-- <nodata :icon-size="60" notice-text="暂无数据" v-if='!cashFlowList.data.length'></nodata> -->
      </div>
    </section>
    <section class="page-footer" v-if="cashFlowList.data.length">
      <div class="page-footer-lf">
        已选择<span class="page-footer-span"><strong>{{selectionData.length}}</strong></span>项,共<span class="page-footer-span">{{maxItems}}</span>条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageId" class-name="pages" show-elevator show-sizer
          :total="maxItems" :page-size-opts="[20, 50, 100, 200, 500, 1000]" :page-size="20"
          @on-change="doUpdateCurrentPage"
          @on-page-size-change="doUpdatePageSize"
        />
        <Button size="small" @click="goElevatorPage('pageId')" >GO</Button>
      </div>
    </section>
      <!-- 批量操作提示框 -->
      <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
      <!-- 选项 -->
      <OptionsDrawer v-model="optionConfig.visible" :config="optionConfig" :option-config="optionConfig.options_config" @close="optionConfig.visible = false" @confirm="doConfirmOption"></OptionsDrawer>
      <!-- 表格配置 -->
      <table-config @close="doTableClose" :drawer="tableConfig" ></table-config>
      <!-- 导入 -->
      <upload-modal @modalClose="doCloseUpload" ref="upload" :isupload="uploadConfig" class-name="page-modal" templateType="cash_flow_item"></upload-modal>
      <a id="a_id"></a>
    </section>
  </section>
</template>
<script>
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
import { sortArr, getHeight } from '@/libs/tools.js'
import nodata from '_c/nodata'
import OptionsDrawer from '_c/optionsDrawer'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import batchHandleModal from '_c/batchHandleModal'
import RadioSelect from '_c/radio-select'
export default {
  name: 'cashflow_index',
  components: {
    CommonIcon,
    nodata,
    OptionsDrawer,
    tableConfig,
    uploadModal,
    batchHandleModal,
    RadioSelect
  },
  mixins: [saasMixin],
  data () {
    return {
      tableLoading: false,
      company_config: { // 归属公司配置
        type: 'company',
        title: '选择公司',
        refresh: false,
        width: '100%',
        request_params: {
          companyFormId: null,
          codeOrName: '',
          isEnterpriseAdmin: 1,
          menuCode: 'cashflow_index'
        }
      },
      companyFormId: 0, // 公司形态
      companytype_list: [
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
      cashFlowId: '',
      isloading: true, // 全局loading标志
      batchHandleModal: false, // 详细数据展示开关
      checked: '', // 详细提示
      batchhandleColumns: [ // 详细表头
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
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
      batchhandleData: [], // 详细数据
      optionConfig: { // 选项按钮配置
        visible: false, // 控制显隐
        title: '选项',
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right',
        options_config: [ // 内容
          {
            title: '控制策略',
            type: 'checkbox',
            keyName: 'control',
            keyValue: [],
            data: [
              {
                label: '集团创建，集团共享',
                value: 0,
                hint: '集团创建，集团共享',
                disabled: true
              }
            ]
          }
        ]
      },
      tableConfig: false, // 表格配置展示开关
      uploadConfig: false, // 导入展示开关
      maxItems: 0, // 列表页数据总量
      selectionData: [], // 列表页选中数据
      rowData: '', // 行操作数据
      accountBookType: {}, // 单据头-账簿类型
      accountingStandardValue: '', // 控制单据头-会计准则渲染
      accountingStandard: {}, // 单据头-会计准则
      cashFlowModal: {}, // 单据头-现金流量项目表
      cashFlowCompany: {
        name: '',
        id: 0
      },
      cashFlowCodeOrName: { // 查询编码or名称
        value: '',
        result: ''
      },
      cashFlowTpye: { // 查询条件-流量分组类型
        value: 'all',
        options: [
          {
            value: 'all',
            label: '全部分组'
          }
        ]
      },
      cashFlowDirection: { // 查询条件-流量方向
        value: 'all',
        options: [
          {
            value: 'all',
            label: '全部方向'
          },
          {
            value: 1,
            label: '现金流入'
          },
          {
            value: 0,
            label: '现金流出'
          }
        ]
      },
      cashFlowState: { // 查询条件-数据状态类型
        value: 'all',
        options: [
          {
            value: 'all',
            label: '全部数据状态'
          },
          {
            value: 1,
            label: '已生效'
          },
          {
            value: 0,
            label: '已失效'
          }
        ]
      },
      cashFlowCashPage: { // 查询条件-分页
        current: 1,
        size: 20
      },
      getTableList: [], // 接口获取的表头数组
      getTableheight: 36,
      cashFlowList: { // 列表表头And列表数据
        newcolumns: [],
        opreation: [
          {
            type: 'selection',
            key: 'selection',
            width: 40,
            align: 'center'
          },
          {
            title: '编码',
            key: 'code',
            field: 'code',
            minWidth: 150,
            slots: {
              header: ({ row, index, column }, h) => {
                return [
                  <div>
                    <span style="margin-right: 13px;">编码</span>
                    <Poptip trigger="hover" content="编码级次:1-2-2-2-2-2-2-2" class="header-icon" placement="right" transfer>
                      <Icon type="md-help-circle" size="18"/>
                    </Poptip >
                  </div>
                ]
              },
              default: ({ row, index, column }, h) => {
                return [
                  <span class="table-span" on-click={ this.toCode.bind(this, { row }) }>{row.code}</span>
                ]
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            field: 'action',
            fixed: 'right',
            width: 240,
            slots: {
              default: ({ row, index, column }, h) => {
                return [
                  <div>
                    <span class="table-span" v-show={row.isExistNextInit === 0 && row.isInteriorContact === 0} on-click={ this.toCreate.bind(this, { row }) }>新增下级</span>
                    <span class="table-span" v-show={row.isEnable === 1 && row.isInteriorContact === 0} on-click={ this.toProhibitOne.bind(this, { row }) }>禁用</span>
                    <span class="table-span" v-show={row.isEnable === 0 && row.isInteriorContact === 0} on-click={ this.toUnProhibitOne.bind(this, { row }) }>反禁用</span>
                    <span class="table-span" v-show={row.isInit === 0} on-click={ this.doShowTips.bind(this, 'doOneDelete', { row }) }>删除</span>
                  </div>
                ]
              }
            }
          }
        ],
        columns: [
          {
            title: '名称',
            key: 'name',
            field: 'name',
            minWidth: 150
          },
          {
            title: '方向',
            key: 'cashFlowDirection',
            field: 'cashFlowDirection',
            minWidth: 150,
            slots: {
              default: ({ row }, h) => {
                return [
                  <span>{ row.cashFlowDirection ? '现金流入' : '现金流出' }</span>
                ]
              }
            }
          },
          {
            title: '分组',
            key: 'cashFlowGroupName',
            field: 'cashFlowGroupName',
            minWidth: 150
          },
          {
            title: '创建公司',
            key: 'companyName',
            field: 'companyName',
            minWidth: 150
          },
          {
            title: '描述',
            key: 'remark',
            field: 'remark',
            minWidth: 150
          },
          {
            title: '内部往来',
            key: 'isInteriorContact',
            field: 'isInteriorContact',
            minWidth: 150,
            slots: {
              default: ({ row }, h) => {
                return [
                  <span>{ row.isInteriorContact ? '是' : '否' }</span>
                ]
              }
            }
          },
          {
            title: '系统预置',
            key: 'isInit',
            field: 'isInit',
            minWidth: 150,
            slots: {
              default: ({ row }, h) => {
                return [
                  <span>{ row.isInit ? '是' : '否' }</span>
                ]
              }
            }
          },
          {
            title: '创建人',
            key: 'creatorName',
            field: 'creatorName',
            minWidth: 150
          },
          {
            title: '创建时间',
            key: 'createTime',
            field: 'createTime',
            minWidth: 150
          },
          {
            title: '修改人',
            key: 'updatorName',
            field: 'updatorName',
            minWidth: 150
          },
          {
            title: '修改时间',
            key: 'updateTime',
            field: 'updateTime',
            minWidth: 150
          },
          {
            title: '禁用人',
            key: 'disabledUserName',
            field: 'disabledUserName',
            showOverflow: 'tooltip',
            minWidth: 150
          },
          {
            title: '禁用时间',
            key: 'disabledTime',
            field: 'disabledTime',
            minWidth: 150
          },
          {
            title: '反禁用人',
            key: 'enabledUserName',
            field: 'enabledUserName',
            minWidth: 150
          },
          {
            title: '反禁用时间',
            key: 'enabledTime',
            field: 'enabledTime',
            minWidth: 150
          },
          {
            title: '数据状态',
            key: 'isEnable',
            field: 'isEnable',
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
          }
        ],
        data: []
      },
      isGropFlag: true,
      createCodeOrName: '',
      isReset: false
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    /**
     * 选择归数据公司-重新下发查询
     */
    doSearchCompany () {
      let seleStrArr = ['集', '团', '集团', '', '0', '00', '000', '0000']
      let seleFlag = seleStrArr.includes(this.createCodeOrName)
      this.company_config.request_params.codeOrName = this.createCodeOrName
      this.isGropFlag = this.companyFormId === 0 && seleFlag
      this.$set(this.company_config, 'refresh', !this.company_config.refresh)
    },
    /**
     * 选择归属公司-公司形态
     * 公司形态选项变化时触发
     * 主要为了剔除 全部形态 0
     */
    doCompanyFormIdChange (val) {
      this.isGropFlag = this.companyFormId === 0
      let params = val === 0 ? null : val
      this.company_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    /**
     * 查询归属公司重置按钮
     * 重置公司形态
     * 重置编码或名称
     * 执行查询
     */
    doResetCompanyConfig () {
      this.companyFormId = 0
      this.company_config.request_params.companyFormId = null
      this.company_config.request_params.codeOrName = ''
      this.createCodeOrName = ''
      this.isGropFlag = true
      this.doSearchCompany()
    },
    doCompanyChange () {
      if (!this.createCodeOrName && this.company_config.request_params.codeOrName) {
        this.doSearchCompany()
      }
    },
    /**
     * 监听公司组件返回接口
     * data：标准数据
     * item：详细数据
     */
    getCompanyData (data, item) {
      this.$set(this, 'cashFlowCompany', data)
    },
    // 刷新按钮
    toRefresh () {
      this.selectionData = []
      this.doRefresh()
    },
    // 分页查询
    doRefresh () {
      this.tableLoading = true
      if (this.cashFlowId === '') { return }
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemByPage', this.cashFlowParams).then(({ status, data }) => {
        this.tableLoading = false
        if (status === 200 && data.code === 200) {
          if (!data.data.records.length && this.cashFlowCashPage.current > 1) {
            return --this.cashFlowCashPage.current // 当前页删掉最后以条数据后，请求页码自减
          }
          let { records, selectionData } = this.doFilterData(data.data.records, [])
          this.cashFlowList.data = records // 渲染数据
          this.selectionData = selectionData // 选中数据
          this.maxItems = data.data.total // 总记录数
          this.getTableheight = records.length === 0 ? 36 : getHeight(145)
          // 状态机获取列表id
          this.getListIds({ ids: data.data.records.map(n => { return n.id }), name: 'cashflow' })
        }
      })
    },
    // 过滤数据
    doFilterData (records, selectionData) {
      // 过滤一：过滤未被删除$状态值未发生变化的记录
      // let reIdList = records.map(item => item.id + '#$#' + item.isEnable)
      // selectionData = selectionData.filter(item => reIdList.includes(item.id + '#$#' + item.isEnable))
      // 过滤二：给新请求过来的数据加上选中状态
      // let seIdList = selectionData.map(item => item.id)
      records = records.map(item => Object.assign(item, item.manageInfo))
      records.forEach(item => {
        // if (seIdList.includes(item.id)) {
        //   this.$set(item, '_checked', true)
        // }
        item.companyName = item.companyId === 0 ? '集团' : item.companyName
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
      // 测试卡顿
      // records = [...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records, ...records]
      return { records, selectionData }
    },
    /**
     * 初始化分页页数
     */
    doCashFlowCurrentReset () {
      this.cashFlowCashPage.current = 1
    },
    // 控制名称或编码输入框的输入，enter下内容发生变化，下发查询
    doCheckInput () {
      this.cashFlowCodeOrName.result = this.cashFlowCodeOrName.value
      this.doCashFlowCurrentReset()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (!this.cashFlowCodeOrName.value) {
        this.cashFlowCodeOrName.result = ''
        this.doCashFlowCurrentReset()
      }
    },
    // 重置按钮
    doReset () {
      this.cashFlowCompany.name = ''
      this.cashFlowCompany.id = 0
      this.cashFlowCodeOrName.value = ''
      this.cashFlowCodeOrName.result = ''
      this.cashFlowTpye.value = 'all'
      this.cashFlowDirection.value = 'all'
      this.cashFlowState.value = 'all'
      this.doCashFlowCurrentReset()
      this.selectionData = [] // 取消判断选中状态
      this.isReset = !this.isReset // 保证每次重置都触发请求
    },
    // 统一提示模板
    doShowTips (key, row) {
      const tips = {
        doDelete: { title: '确认删除', message: '删除后该条资料不可恢复', yes: key },
        doOneDelete: { title: '确认删除', message: '删除后该条资料不可恢复', yes: key },
        doProhibit: { title: '确认禁用', message: `注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据`, yes: key },
        doOneProhibit: { title: '确认禁用', message: '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据', yes: key },
        doUnProhibit: { title: '确认反禁用', message: '请确认是否要反禁用数据？', yes: key },
        doOneUnProhibit: { title: '确认反禁用', message: '请确认是否要反禁用数据？', yes: key }
      }
      if (this.selectionData.length || row) {
        this.rowData = row
        this.doShowActiveModal(tips[key])
      } else {
        this.$Message.warning('请至少选择一条数据后再操作')
      }
    },
    // 打开模态框
    doShowActiveModal (msgObj) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: msgObj.title,
        message: msgObj.message,
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          msgObj.son ? that[msgObj.yes].apply(that, msgObj.son) : that[msgObj.yes]()
        },
        cancel () {
          that.$CloseCtl()
          // that.$Message.info('已取消')
        }
      })
    },
    /**
     * 过滤结果数据
     * data： 返回结果
     * message： 操作类型
     */
    doFilterDetailsData (data, message) {
      this.sucLen = data.successDetailsList ? data.successDetailsList.length : 0
      this.errLen = data.failList ? data.failList.length : 0
      data.failList = data.failList ? data.failList : []
      data.successDetailsList = data.successDetailsList.map(item => {
        return {
          businessId: item.info.id,
          code: item.info.code,
          status: '成功',
          details: `${message}: "${item.info.code}"现金流量项目-${item.info.name}`,
          referenceDescription: `${message}成功`
        }
      })
      data.failList = data.failList.map(item => {
        return {
          businessId: item.info.id,
          code: item.info.code,
          status: '失败',
          details: `${message}: "${item.info.code}"现金流量项目-${item.info.name}`,
          referenceDescription: item.referenceDescription
        }
      })
      this.checked = '成功' + this.sucLen + '条,失败' + this.errLen + '条'
      this.batchhandleData = [...data.successDetailsList, ...data.failList]
      this.batchHandleModal = true
    },
    /**
     * 过滤删除的数据
     */
    doFilterDeleteData (data) {
      data.failList.forEach(item => {
        this.selectionData.forEach(sele => {
          if (item.businessCode === sele.code || item.businessId === sele.id) {
            item.info = sele
          }
        })
      })
      data.successDetailsList = this.selectionData.filter(item => data.successList.includes(item.id)).map(item => ({ info: item }))
      return data
    },
    /**
     * 批量删除按钮
     */
    toDeleteList () {
      if (this.selectionData.length) {
        // if (this.selectionData.filter(item => item.isInit === 1).length) {
        //   return this.$Message.warning('系统预置项目不可删除')
        // }
        this.doShowTips('doDelete')
      } else {
        this.$Message.warning('请至少选择一条数据后再操作')
      }
    },
    // 删除 批量操作
    doDelete () {
      // if (this.selectionData.filter(item => item.isFinal === 0).length) {
      //   return this.$Message.warning('删除失败，请先删除下级项目')
      // }
      // this.tableLoading = true
      let params = {
        ids: this.selectionData.map(item => item.id),
        codes: this.selectionData.map(item => item.code),
        versions: this.selectionData.map(item => item.version),
        cashFlowId: this.cashFlowId
      }
      this.$request.post('/financeback/cashFlowItem/delBatch', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          data.data = this.doFilterDeleteData(data.data)
          this.doFilterDetailsData(data.data, '删除')
          this.doRefresh()
        }
      })
    },
    // 删除 行操作
    doOneDelete () {
      if (this.rowData.row.isFinal === 0) {
        return this.$Message.warning('删除失败，请先删除下级项目')
      }
      // this.tableLoading = true
      let params = {
        ids: [this.rowData.row.id],
        codes: [this.rowData.row.code],
        versions: [this.rowData.row.version],
        cashFlowId: this.cashFlowId
      }
      this.$request.post('/financeback/cashFlowItem/delBatch', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          this.rowData = ''
          if (data.data.failList.length) {
            this.$Message.error(`删除失败，${data.data.failList[0].referenceDescription}`)
          }
          if (data.data.successList.length || data.data.successDetailsList.length) {
            this.$Message.success('删除成功')
            this.doRefresh()
          }
        }
      })
    },
    /**
     * 批量禁用按钮
     */
    toProhibitList () {
      if (this.selectionData.length) {
        // if (this.selectionData.filter(item => item.isInteriorContact === 1).length) {
        //   return this.$Message.warning('内部往来项目不能禁用')
        // }
        if (this.selectionData.filter(item => item.isFinal === 0).length) {
          let msgObj = { title: '确认禁用', message: '禁用操作将会把本级与下级项目一起禁用', yes: 'doShowTips', son: ['doProhibit'] }
          return this.doShowActiveModal(msgObj)
        }
        this.doShowTips('doProhibit')
      } else {
        this.$Message.warning('请至少选择一条数据后再操作')
      }
    },
    /**
     * 批量禁用
     */
    doProhibit () {
      // this.tableLoading = true
      let params = {
        ids: this.selectionData.map(item => item.id),
        codes: this.selectionData.map(item => item.code),
        versions: this.selectionData.map(item => item.version),
        cashFlowId: this.cashFlowId,
        isEnable: 1
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchDisable', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          this.doFilterDetailsData(data.data, '禁用')
          this.doRefresh()
        }
      })
    },
    /**
     * 行操作禁用按钮
     */
    toProhibitOne ({ row }) {
      this.rowData = row
      if (row.isFinal === 0) {
        let msgObj = { title: '确认禁用', message: '禁用操作将会把本级与下级项目一起禁用', yes: 'doShowTips', son: ['doOneProhibit', row] }
        return this.doShowActiveModal(msgObj)
      } else {
        return this.doShowTips('doOneProhibit', row)
      }
    },
    // 禁用行操作
    doOneProhibit () {
      // this.tableLoading = true
      let params = {
        ids: [this.rowData.id],
        codes: [this.rowData.code],
        versions: [this.rowData.version],
        cashFlowId: this.cashFlowId,
        isEnable: 1
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchDisable', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          this.rowData = ''
          if (data.data.successDetailsList.length) {
            this.doRefresh()
            return this.$Message.success('禁用成功')
          }
          // 操作失败
          if (data.data.failList.length) {
            return this.$Message.error(`禁用失败，${data.data.failList[0].referenceDescription}`)
          }
        }
      })
    },
    /**
     * 批量 反禁用按钮
     */
    toUnProhibitList () {
      if (this.selectionData.length) {
        // if (this.selectionData.filter(item => item.isInteriorContact === 1).length) {
        //   return this.$Message.warning('内部往来项目不能反禁用')
        // }
        // 需要判断是否有已经禁用的上级项目
        let params = this.selectionData.filter(item => item.isEnable === 0).map(item => ({ code: item.code, isEnable: 1, cashFlowId: item.cashFlowId }))
        this.$request.post('/financeback/cashFlowItem/findCashFlowItemForEnable', params).then(({ data }) => {
          if (data.code === 200) {
            if (data.data.length !== params.length) {
              let msgObj = { title: '确认反禁用', message: '反禁用将会将上级项目一起反禁用', yes: 'doShowTips', son: ['doUnProhibit'] }
              this.doShowActiveModal(msgObj)
            } else {
              this.doShowTips('doUnProhibit')
            }
          }
        })
      } else {
        this.$Message.warning('请至少选择一条数据后再操作')
      }
    },
    /**
     * 批量反禁用
     */
    doUnProhibit () {
      // this.tableLoading = true
      let params = {
        ids: this.selectionData.map(item => item.id),
        codes: this.selectionData.map(item => item.code),
        versions: this.selectionData.map(item => item.version),
        cashFlowId: this.cashFlowId,
        isEnable: 0
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchEnable', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          this.doFilterDetailsData(data.data, '反禁用')
          this.doRefresh()
        }
      })
    },
    /**
     * 行操作 反禁用 按钮
     */
    toUnProhibitOne ({ row }) {
      this.rowData = row
      let params = [{ code: row.code, isEnable: 1, cashFlowId: row.cashFlowId }]
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemForEnable', params).then(({ data }) => {
        if (data.code === 200) {
          console.log(data.data)
          if (data.data.length !== params.length) {
            let msgObj = { title: '确认反禁用', message: '反禁用将会将上级项目一起反禁用', yes: 'doShowTips', son: ['doOneUnProhibit', row] }
            this.doShowActiveModal(msgObj)
          } else {
            this.doShowTips('doOneUnProhibit', row)
          }
        }
      })
    },
    // 反禁用 行操作
    doOneUnProhibit () {
      // this.tableLoading = true
      let params = {
        ids: [this.rowData.id],
        codes: [this.rowData.code],
        versions: [this.rowData.version],
        cashFlowId: this.cashFlowId,
        isEnable: 0
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchEnable', params).then(({ status, data }) => {
        // this.tableLoading = false
        if (status === 200 && data.code === 200) {
          this.rowData = ''
          if (data.data.successDetailsList.length) {
            this.doRefresh()
            return this.$Message.success('反禁用成功')
          }
          if (data.data.failList.length) {
            return this.$Message.error(`反禁用失败，${data.data.failList[0].referenceDescription}`)
          }
        }
      })
    },

    // 列表页的分页
    doUpdateCurrentPage (val) {
      this.selectionData = []
      this.cashFlowCashPage.current = val
    },
    doUpdatePageSize (val) {
      this.cashFlowCashPage.size = val
      this.doUpdateCurrentPage(1)
    },
    // 跳转查看页面
    toCode (row) {
      this.doLocationDetail('update_cashflow', { showId: row.row.id, cashFlowId: row.row.cashFlowId })
    },
    /**
     * 跳转新增页面
     */
    toCreate (row) {
      if (row.row) {
        if (row.row.isEnable === 0) { // 解决bug 12381 已失效的现金项目点击新增下级按钮时，应提示错误”已禁用的项目不能增加下级项目“
          return this.$Message.warning('已禁用的项目不能增加下级项目')
        }
        if (row.row.level >= row.row.maxLevel.split('-').length) {
          return this.$Message.warning('最大级次不能增加下级项目')
        }
        let params = {
          id: row.row.id,
          code: row.row.code,
          cashFlowId: row.row.cashFlowId,
          rootEnterpriseId: this.$store.state.user.rootEnterpriseId
        }
        // 判断有没有引用关系
        this.$request.post('/financeback/cashFlowItem/checkIsUsedSingle', params).then(({ status, data }) => {
          if (status === 200 && data.code === 200) {
            if (data.data.reference) {
              this.$Message.warning('当前数据已使用，无法新增下级！')
            } else {
              this.doLocationDetail('create_cashflow', { addId: row.row.id, cashFlowId: row.row.cashFlowId, addType: 2 })
            }
          }
        })
      } else {
        let query = {
          accountingStandard: this.accountingStandard,
          company: { companyId: 0, companyName: '集团' }
        }
        this.doLocationDetail('create_cashflow', { query, addType: 1, cashFlowId: this.cashFlowId })
      }
    },
    // 列表多选
    doSelect ({ selection }) {
      this.selectionData = selection
    },
    // 选项按钮-暂时不做
    doConfirmOption (params) {
      console.log(params)
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doRefresh()
      }
      this.tableConfig = false
    },
    // 获取表格
    doGettableHeader () {
      let req = {
        // menuCode: this.$route.name, // 菜单编码
        menuCode: 'cashflow_index', // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
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
          this.cashFlowList.newcolumns = sortArr(this.cashFlowList.columns, this.getTableList)
          this.cashFlowList.newcolumns.push(this.cashFlowList.opreation[2])
          this.cashFlowList.newcolumns.unshift(this.cashFlowList.opreation[1])
          this.cashFlowList.newcolumns.unshift(this.cashFlowList.opreation[0])
        }
      })
    },
    doShowUpload () {
      this.uploadConfig = true
      this.$refs.upload.isEnterpriseAdmin = 1
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.uploadConfig = false
      this.doRefresh()
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 导出
    doImport () {
      let params = Object.assign({}, this.cashFlowParams, { isEnterpriseAdmin: 1 })
      this.$request.post('/financeback/cashFlowItem/exportCashFlowItemExcel', params, 'blob').then(({ headers, data }) => {
        let suffix = headers['content-disposition'].split('.')[1]
        const aLink = document.getElementById('a_id')
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = `现金流量项目列表.${suffix}` // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    /**
     * 监听会计准则变化
     * 会计准备变化-对应现金流量科目表发生变化
     * 重新获取cashflowId
     * 重新获取分组信息
     */
    async doChangeAccountingStandard (val) {
      let cashFlowHeaderParams = {
        accStandradId: this.accountingStandard.value,
        accountTypeId: this.accountBookType.value,
        isBase: 1
      }
      // 现金流量项目
      this.cashFlowModal = await this.$request.post('/financeback/cashFlowItem/findCashFlowItemSelection', cashFlowHeaderParams).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          return data.data.map(item => ({ value: item.id, label: item.name }))[0]
        }
      })
      // 获取cashflowId
      this.cashFlowId = await this.$request.post('/financeback/cashFlowItem/findCashFlowItemTemplateId', { cashFlowId: this.cashFlowModal.value }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          return data.data ? data.data.id : null
        }
      })
      // 现金流量分组
      this.$request.post('/financeback/cashFlowItem/findGroup', { cashFlowId: this.cashFlowId }).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.cashFlowTpye.options = [{ value: 'all', label: '全部分组' }]
          data.data.filter(item => item.cashFlowGroupName).forEach(item => {
            this.cashFlowTpye.options.push({
              value: item.cashFlowGroup,
              label: item.cashFlowGroupName
            })
          })
        }
      })
    },
    // 初始化数据
    async doInit () {
      // 判断是否需要置入预置数据
      await this.$request.post('/financeback/cashFlowItem/addInitData')
      // 账簿类型
      this.accountBookType = await this.$request.post('/financeback/cashFlowItem/findAccountBookTypeSelection').then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          return data.data.map(item => ({ value: item.id, label: item.name }))[0]
        }
      })
      // 会计准则
      this.accountingStandard = await this.$request.post('/financeback/cashFlowItem/findAccountingStandardSelection').then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          let options = data.data.map(item => ({ value: item.id, label: item.name }))
          this.accountingStandardValue = options[0].label
          return { value: options[0].value, options: options }
        }
      })
      // 获取现金流量项目科目表-获取cashflowId-获取分组信息-判断需不需要下发分页请求
      // 如果cashflow发生变化，将触发分页查询
      this.doChangeAccountingStandard()
    }
  },
  computed: {
    // 现金流量列表页参数
    cashFlowParams () {
      return {
        cashFlowId: this.cashFlowId,
        companyId: this.cashFlowCompany.id,
        codeOrName: this.cashFlowCodeOrName.result ? this.cashFlowCodeOrName.result : null,
        cashFlowGroup: this.cashFlowTpye.value === 'all' ? null : this.cashFlowTpye.value,
        cashFlowDirection: this.cashFlowDirection.value === 'all' ? null : this.cashFlowDirection.value,
        isEnable: this.cashFlowState.value === 'all' ? null : this.cashFlowState.value,
        isEnterpriseAdmin: 1,
        isReset: this.isReset,
        page: {
          total: 0,
          size: this.cashFlowCashPage.size,
          current: this.cashFlowCashPage.current,
          ascs: null,
          desce: null,
          optimizeCountSql: true,
          isSeachCount: true
        }
      }
    }
  },
  watch: {
    // 列表页请求数据
    cashFlowParams () {
      if (this.cashFlowParams.cashFlowId) {
        this.doRefresh()
      }
    }
  },
  created () {
    this.doGettableHeader() // 请求列表头数据
    this.doInit() // 初始化条件
  },
  mounted () {
    setTimeout(() => { this.isloading = false }, 2000) // 关闭loading状态
  }
}
</script>
<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
.cashflow-page {
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  // .vxe-table .vxe-table--empty-block {
  //   min-height: 0px;
  // }
  .page-content {
    // 单据头
    .page-content-header {
      background:#f2f2f2;
      line-height: 60px;
      border:#E5E5E5 solid 1px;
      .header-span {
        margin-left: 16px;
        margin-right: 10px;
        color: #333333;
      }
      .header-font-span {
        color:#999999;
        font-size: 12px;
      }
    }
    // 查询条件
    .query-condition {
      .query-condition-lf {
        .screen {
          //消除间距
          .first-nospace {
            padding-left: 0;
            padding-top: 16px;
          }
        }
      }
    }
    // 表格
    .page-content-table {
      position: relative;
      .header-icon { // 表头问号
        width: 10px; // 解决问号显示半个问题
        .ivu-icon {
          margin-left: -5px;
          margin-top: -1px;
          color:#d7d7d7;
          &:hover {
            color: #fa790e;
          }
        }
      }
      .table-span {
        margin-right: 15px;
      }
      .vxe-checkbox--icon:before {
        right: 0%;
      }
    }
  }
  .page-footer {
    .page-footer-span {
      margin: 0 5px;
    }
  }
}
</style>
