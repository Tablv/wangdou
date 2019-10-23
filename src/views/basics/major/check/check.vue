<template>
  <div class="check_index">
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="check_container">
      <section class="page-header">
        <div class="page-header-name">自定义核算项目列表</div>
        <div class="page-header-actions">
          <Button @click="doCreateCheck()" type="primary" >新增</Button>
          <Button @click="toListDelete">删除</Button>
          <Button @click="toListProhibit">禁用</Button>
          <Button @click="toListUnProhibit">反禁用</Button>
          <!-- <Button @click="doOptionSwitch">选项</Button> -->
          <!-- 导入 -->
          <Button @click.native="doClickExport">
            <common-icon type="_export" :size="14"></common-icon>
          </Button>
          <!-- 导出 -->
          <Button @click="doClickDown">
            <common-icon type="_import" :size="14"></common-icon>
          </Button>
          <!-- 表格配置 -->
          <Button class="span-space" @click.native="doClickConfig">
            <common-icon type="_table" style="margin-top: -3px;"></common-icon>
          </Button>
          <!-- 刷新 -->
          <Button @click="doRefresh">
            <common-icon type="_refresh" :size="14"/>
          </Button>
        </div>
      </section>
      <section class="page-content">
        <div class="query-condition">
          <div class="query-condition-lf">
            <Row class="screen">
              <Col span="4" style="padding-left: 0; padding-top: 0;">
                <multi-select :data="companyParams"
                width="100%"
                type="company"
                title="选择公司"
                placeholder="创建公司编码/名称"
                isEnterpriseAdmin= "1"
                :grop="isGropFlag"
                :defaultValue="false"
                :isClear="isCompanyClear"
                @on-select="doGetCompanyId"
                @on-visibe-change="doResetCompany">
                  <Row :gutter="10" slot="search">
                    <Col span="3">
                      <Select v-model="companyFormId" @on-change="doSelectCompanyFormId">
                        <Option v-for="item in companyformList" :value="item.value" :key="item.value">{{item.label}}</Option>
                      </Select>
                    </Col>
                    <Col span="5">
                      <Input class="search-button" v-model="companyCodeOrName" placeholder="编码/名称" clearable @on-enter="doSearchCompanyCodeOrName" @on-clear="doSearchCompanyCodeOrName">
                        <Button slot="append" icon="ios-search" @click="doSearchCompanyCodeOrName"></Button>
                      </Input>
                    </Col>
                    <Col span="2">
                      <Button @click="doResetCompany">重置</Button>
                    </Col>
                  </Row>
                </multi-select>
              </Col>
              <Col span="2" style="padding-top: 0;">
                <Select v-model="queryCriteria.isEnable" @on-change='doTypeChange' placeholder="全部数据状态" >
                  <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
              <Col span="4" style="padding-top: 0;">
                <Input class="search-button" v-model="checkCodeOrName" placeholder="编码/名称"
                @on-enter="doInputEnter"
                @on-change="doInputChange"
                clearable>
                  <Button slot="append" icon="ios-search" @click="doInputEnter"></Button>
                </Input>
              </Col>
              <Col span="1" style="padding-top: 0;">
                <Button @click="doHandleReset">重置</Button>
              </Col>
            </Row>
          </div>
        </div>
        <div class="page-content-table">
          <Spin fix v-if="tableLoading">
            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
            <div>正在载入数据</div>
          </Spin>
          <!-- 680 -->
          <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          :columns="tableColumns"
          :data="tableData"
          :height="tableData.length ? tableHeight : 0"
          @select-all="doSelectTableData"
          @select-change="doSelectTableData">
            <template v-slot:empty>
              <nodata :icon-size="60" notice-text="暂无数据"></nodata>
            </template>
          </vxe-grid>
          <!-- <Table
          :height="tableHeight"
          :columns="tableColumns"
          no-data-text=""
          :data="tableData"
          :class="tableData.length ? null : 'tableHeight'"
          @on-selection-change="doSelectTableData"></Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata> -->
        </div>
      </section>
      <section class="page-footer">
        <div class="page-footer-lf">
          已选择<span class="page-footer-span"><strong>{{selection.length}}</strong></span>项，共<span class="page-footer-span">{{total}}</span>条数据
        </div>
        <div class="page-footer-rt">
          <Page id="checkPageId" class-name="pages" :total="total" :current="current" :page-size="size" :page-size-opts="[20, 50, 100, 200, 500, 1000]"
            show-elevator show-sizer @on-page-size-change="doChangeSize" @on-change="doChangeCurrent"/>
          <Button size="small" @click="doGoElevatorPage('checkPageId')">Go</Button>
        </div>
      </section>
    </section>
    <!-- 选项 -->
    <options-drawer v-model="optionFlag" :config="config" :option-config="options_config" @close="optionFlag = false" @confirm="handleConfirmOption"></options-drawer>
    <!-- 导入 -->
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" template-type="accounting_item"></upload-modal>
    <!-- 表格配置-->
    <table-config @close="doTableClose" :drawer="drawer" ></table-config>
    <!-- 批量建账成功提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 值列表 -->
    <key-list-drawer :isModal="iskeyListFlag" :valueList="valueList"></key-list-drawer>
    <a id="check_id" style="display: none"></a>
  </div>
</template>

<script>
import nodata from '_c/nodata'
import CommonIcon from '_c/common-icon'
import { mapMutations } from 'vuex'
import { saasMixin } from '@/libs/mixins.js'
import OptionsDrawer from '_c/optionsDrawer'
import UploadModal from '_c/uploadModal/uploadModal.vue'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import { sortArr, getHeight } from '@/libs/tools.js'
import batchHandleModal from '_c/batchHandleModal'
import keyListDrawer from '_v/basics/major/check/component/checkKeyListDrawer'
import multiSelect from '_c/multi-select'
export default {
  name: 'check_index',
  components: {
    OptionsDrawer,
    nodata,
    CommonIcon,
    UploadModal,
    tableConfig,
    batchHandleModal,
    keyListDrawer,
    multiSelect
  },
  data () {
    return {
      checkCodeOrName: '',
      isCompanyClear: false,
      isGropFlag: true,
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      companyCodeOrName: '', // 编码或名称
      companyFormId: 0, // 公司形态
      companyformList: [
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
      tableLoading: false, // 操作loading标志
      valueList: {}, // 值列表数据
      iskeyListFlag: false, // 值列表标志
      tableHeight: 36,
      checked: '', // 批量建账成功提示的check
      size: 20, // 每页显示的数据个数
      current: 1, // 页码
      total: null, // 数据总数
      batchHandleModal: false, // 批量建账成功提示
      optionFlag: false, // 选项组件
      loading: false, // loading
      drawer: false, // drawer组件的值
      isConfig: false, // 表格配置是否显示
      isupload: false, // 导入弹窗
      isHover: false,
      tableData: [], // 列表的数据
      getTableList: [], // 接口获取的表头数组
      tableColumns: [], // 冬态表头数据
      rowData: '', // 行操做数据
      selection: [], // 删除的数据
      config: { // 选项组件配置信息
        title: '选项',
        width: 300,
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      },
      options_config: [ // 选项组件数据
        {
          title: '控制策略',
          type: 'checkbox',
          keyName: 'control',
          keyValue: [0],
          data: [
            {
              label: '集团创建，集团共享',
              value: 0,
              disabled: true,
              hint: '集团创建，集团共享'
            }
          ]
        }
      ],
      // 查询自定义核算项目列表
      queryCriteria: {
        companyId: '集团',
        isEnable: 2,
        codeOrName: null
      },
      formList: [ // 数据状态select
        {
          value: 2,
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
      ],
      header: {
        type: 'selection',
        field: 'selection',
        width: 40,
        multiple: true,
        align: 'center'
      },
      checkCode: {
        title: '编码',
        key: 'code',
        field: 'code',
        tooltip: true,
        minWidth: 100,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click={this.doUpdateCheck.bind(this, { row, index, column })}>{row.code}</span>
              </div>
            ]
          },
          header: ({ row, index, column }, h) => {
            return [
              <div>
                <span style="margin-right: 13px;">编码</span>
                <Poptip trigger="hover" content="编码规则:Z+2位流水号" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            ]
          }
        }
      },
      tableColumn: [
        {
          title: '数据状态',
          key: 'isEnable',
          field: 'isEnable',
          tooltip: true,
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
        {
          title: '编码名称',
          key: 'name',
          field: 'name',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '创建公司',
          key: 'companyName',
          field: 'companyName',
          tooltip: true,
          minWidth: 150,
          slots: {
            default: ({ row, index, column }, h) => {
              return [
                <div> {row.companyId === 0 ? '集团' : row.companyName} </div>
              ]
            }
          }
        }, {
          title: '创建人',
          key: 'creatorName',
          field: 'creatorName',
          tooltip: true,
          minWidth: 150
        }, {
          title: '创建时间',
          key: 'createTime',
          field: 'createTime',
          tooltip: true,
          minWidth: 150
        }, {
          title: '修改人',
          key: 'updatorName',
          field: 'updatorName',
          tooltip: true,
          minWidth: 150
        }, {
          title: '修改时间',
          key: 'updateTime',
          field: 'updateTime',
          tooltip: true,
          minWidth: 150
        }, {
          title: '禁用人',
          key: 'disabledUserName',
          field: 'disabledUserName',
          minWidth: 150,
          tooltip: true
        }, {
          title: '禁用时间',
          key: 'disabledTime',
          field: 'disabledTime',
          minWidth: 150,
          tooltip: true
        }, {
          title: '反禁用人',
          key: 'enabledUserName',
          field: 'enabledUserName',
          minWidth: 150,
          tooltip: true
        }, {
          title: '反禁用时间',
          key: 'enabledTime',
          field: 'enabledTime',
          minWidth: 150,
          tooltip: true
        }, {
          title: '描述',
          key: 'remark',
          field: 'remark',
          tooltip: true,
          minWidth: 150
        }, {
          title: '资料类型',
          key: 'dataType',
          field: 'dataType',
          tooltip: true,
          minWidth: 150,
          slots: {
            default: ({ row, index, column }, h) => {
              return [
                <div>
                  <span v-show = { row.dataType === 1 } >共享型</span>
                  <span v-show = { row.dataType === 2 } >分配型</span>
                  <span v-show = { row.dataType === 3 } >私有型</span>
                </div>
              ]
            }
          }
        }
      ],
      opreation: {
        title: '操作',
        fixed: 'right',
        minWidth: 240,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click={this.doValListData.bind(this, { row, index, column })}>值列表</span>
                <span class="table-span" v-show={row.isEnable === 1} on-click={this.toOneProhibit.bind(this, { row, index, column })}>禁用</span>
                <span class="table-span" v-show={row.isEnable === 0} on-click={this.toOneUnProhibit.bind(this, { row, index, column })}>反禁用</span>
                <span class="table-span" on-click={this.toOneDelete.bind(this, { row, index, column })}>删除</span>
              </div>
            ]
          }
        }
      },
      batchhandleColumns: [
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
          tooltip: true,
          minWidth: 90
        }
      ],
      batchhandleData: []// 批量建账成功提示的表格数据
    }
  },
  mixins: [saasMixin],
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    // 公司形态
    doSelectCompanyFormId () {
      this.isGropFlag = this.companyFormId === 0
      let newValue = this.isGropFlag ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    /**
     * 公司名称或编码
     */
    doSearchCompanyCodeOrName () {
      let seleFlag = this.companyCodeOrName === '集' || this.companyCodeOrName === '团' || this.companyCodeOrName === '集团' || this.companyCodeOrName === '' || this.companyCodeOrName === '0' || this.companyCodeOrName === '00' || this.companyCodeOrName === '000' || this.companyCodeOrName === '0000'
      this.isGropFlag = this.companyFormId === 0 && seleFlag
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    /**
     * 重置查询条件
     */
    doResetCompany () {
      this.companyFormId = 0
      this.isGropFlag = true
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    /**
     * 公司组件监听事件
     */
    doGetCompanyId (itemList) {
      this.isCompanyClear = false
      this.queryCriteria.companyId = itemList.length === 0 ? [0] : itemList.map(item => item.id)
      this.doCurrentReset()
      this.doNameSearch()
    },
    // 监听授权弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 点击刷新按钮
    doRefresh () {
      this.doNameSearch()
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
      this.isConfig = true
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doNameSearch()
      }
      this.drawer = false
    },
    // 获取表格
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        // menuCode: this.$route.name, // 菜单编码
        menuCode: 'check_index', // 菜单编码
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
            if (item.isShow !== 0) {
              this.getTableList.push(item)
            }
          })
          this.tableColumns = sortArr(this.tableColumn, this.getTableList)
          this.tableColumns.push(this.opreation)
          this.tableColumns.unshift(this.checkCode)
          this.tableColumns.unshift(this.header)
        }
      })
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
      this.doNameSearch()
    },
    // 跳转查看页
    doUpdateCheck ({ row }) {
      this.doLocationDetail('update_check', { id: row.id, version: row.version })
    },
    // 跳转新增页
    doCreateCheck () {
      this.doLocationDetail('create_check')
    },
    // 状态change事件
    doTypeChange () {
      this.doCurrentReset()
      this.doNameSearch()
    },
    // 重置按钮
    doHandleReset () {
      this.isCompanyClear = true
      this.queryCriteria = { isEnable: 2, codeOrName: '' }
      this.checkCodeOrName = ''
      this.doCurrentReset()
      this.doNameSearch()
    },
    doInputEnter () {
      this.queryCriteria.codeOrName = this.checkCodeOrName
      this.doCurrentReset()
      this.doNameSearch()
    },
    doInputChange () {
      if (!this.checkCodeOrName && this.queryCriteria.codeOrName) {
        this.doInputEnter()
      }
    },
    // 查询列表
    doNameSearch () {
      let req = {
        isEnable: this.queryCriteria.isEnable === 2 ? null : this.queryCriteria.isEnable,
        companyId: this.queryCriteria.companyId,
        codeOrName: this.queryCriteria.codeOrName,
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.selection = []
      this.loading = true
      this.$request.post('/financeback/accountingItem/findAccountingItemList', req).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          if (!res.data.data.records.length && this.current > 1) {
            this.doChangeCurrent(--this.current)
          }
          this.size = res.data.data.size
          this.current = res.data.data.current
          this.total = res.data.data.total
          res.data.data.records = res.data.data.records.map(item => Object.assign(item, item.manageInfo))
          res.data.data.records.forEach(item => {
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
          this.tableData = res.data.data.records
          this.tableHeight = this.tableData.length === 0 ? 36 : getHeight(65)
          // 状态机获取列表id
          this.getListIds({ ids: res.data.data.records.map(n => { return n.id }), name: 'check' })
        }
      })
    },
    doCurrentReset () {
      this.current = 1
    },
    // 弹出值列表弹窗
    doValListData (val) {
      this.iskeyListFlag = !this.iskeyListFlag
      this.valueList = val.row
    },
    /**
     * 操作提示框
     */
    doShowTips (obj) {
      const that = this
      this.$Control({
        type: 'confirm',
        title: obj.title,
        message: obj.message,
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that[obj.yes]()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 批量禁用按钮
     * 1 判断有没有选择数据
     */
    toListProhibit () {
      if (this.selection.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      let msgObj = {
        title: '确认禁用',
        message: '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据',
        yes: 'doListProhibit'
      }
      this.doShowTips(msgObj)
    },
    /**
     * 批量禁用接口
     */
    doListProhibit () {
      let params = {
        ids: this.selection.map(item => item.id),
        versions: this.selection.map(item => item.version),
        isEnable: 0
      }
      this.$request.post('/financeback/accountingItem/disableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          this.doShowActiveDetails(data.data.successList, data.data.failList, '禁用')
          this.doNameSearch()
        }
      })
    },
    /**
     * 行禁用操作
     */
    toOneProhibit ({ row }) {
      let msgObj = {
        title: '确认禁用',
        message: '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据',
        yes: 'doProhibit'
      }
      this.rowData = row
      this.doShowTips(msgObj)
    },
    /**
     * 行禁用接口
     */
    doProhibit () {
      let params = { ids: [this.rowData.id], isEnable: 0, versions: [this.rowData.version] }
      this.$request.post('/financeback/accountingItem/disableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          this.rowData = ''
          if (data.data.successList.length) {
            this.$Message.success('禁用成功')
            this.doNameSearch()
          }
          if (data.data.failList.length) {
            this.$Message.error('禁用失败:' + data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 批量反禁用按钮
     * 1 判断有没有选择数据
     */
    toListUnProhibit () {
      if (this.selection.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      let msgObj = {
        title: '确认反禁用',
        message: '请确认是否要反禁用数据？',
        yes: 'doListUnProhibit'
      }
      this.doShowTips(msgObj)
    },
    /**
     * 反禁用动作
     */
    doListUnProhibit () {
      let params = { ids: this.selection.map(item => item.id), isEnable: 1, versions: this.selection.map(item => item.version) }
      this.$request.post('/financeback/accountingItem/enableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          this.doShowActiveDetails(data.data.successList, data.data.failList, '反禁用')
          this.doNameSearch()
        }
      })
    },
    /**
     * 行反禁用按钮
     */
    toOneUnProhibit ({ row }) {
      let msgObj = {
        title: '确认反禁用',
        message: '请确认是否要反禁用数据？',
        yes: 'doUnProhibit'
      }
      this.rowData = row
      this.doShowTips(msgObj)
    },
    /**
     * 行反禁用接口
     */
    doUnProhibit () {
      let params = { ids: [this.rowData.id], isEnable: 1, versions: [this.rowData.version] }
      this.$request.post('/financeback/accountingItem/enableAccountingItemBatch', params).then(({ data }) => {
        if (data.code === 200) {
          this.rowData = ''
          if (data.data.successList.length) {
            this.$Message.success('反禁用成功')
            this.doNameSearch()
          }
          if (data.data.failList.length) {
            this.$Message.error('反禁用失败:' + data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 批量删除按钮
     * 1 判断有没有选择数据
     * 2 判断当前数据的值列表是否有数据
     * 3 提示 删除确认
     */
    async toListDelete () {
      if (this.selection.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      let params = { ids: this.selection.map(item => item.id) }
      let isRelaValue = await this.$request.post('/financeback/accountingItem/findItemRelaValueById', params).then(({ data }) => {
        if (data.code === 200) {
          return data.data.length === 0
        }
      })
      let msgObj = { title: '确认删除', yes: 'doListDelete' }
      // 判断当前数据的值列表是否有数据
      msgObj.message = isRelaValue ? '注意：删除后将不可恢复！请确认是否要删除数据？' : '注意：删除将会连带值列表中的值一起删除! '
      this.doShowTips(msgObj)
    },
    /**
     * 批量删除动作
     */
    doListDelete () {
      this.tableLoading = true
      let params = { ids: this.selection.map(item => item.id), versions: this.selection.map(item => item.version) }
      this.$request.post('/financeback/accountingItem/deleteAccountingItemByIds', params).then(({ data }) => {
        this.tableLoading = false
        if (data.code === 200) {
          this.doShowActiveDetails(data.data.successList, data.data.failList, '删除')
          this.doNameSearch()
        }
      })
    },
    /**
     * 行操作-删除按钮
     */
    async toOneDelete ({ row }) {
      let params = { ids: [row.id] }
      this.rowData = row
      let isRelaValue = await this.$request.post('/financeback/accountingItem/findItemRelaValueById', params).then(({ data }) => {
        if (data.code === 200) {
          return data.data.length === 0
        }
      })
      let msgObj = { title: '确认删除', yes: 'doOneDelete' }
      // 判断当前数据的值列表是否有数据
      msgObj.message = isRelaValue ? '注意：删除后将不可恢复！请确认是否要删除数据？' : '注意：删除将会连带值列表中的值一起删除! '
      this.doShowTips(msgObj)
    },
    /**
     * 行操作-删除
     */
    doOneDelete () {
      this.tableLoading = true
      let params = { ids: [this.rowData.id], versions: [this.rowData.version] }
      this.$request.post('/financeback/accountingItem/deleteAccountingItemByIds', params).then(({ data }) => {
        this.tableLoading = false
        if (data.code === 200) {
          this.rowData = ''
          if (data.data.failList.length) {
            this.$Message.error('删除失败:' + data.data.failList[0].referenceDescription)
          }
          if (data.data.successList.length) {
            this.$Message.success('删除成功')
            this.doNameSearch()
          }
        }
      })
    },
    /**
     * 批量操作详情展示
     */
    doShowActiveDetails (successList, failList, message) {
      this.batchhandleData = []
      if (failList.length) {
        failList.forEach(item => {
          this.tableData.forEach((ele, index) => {
            if (item.businessId === ele.id) {
              ele.status = '失败'
              ele.details = `${message}:"${ele.code}"自定义核算项目-${ele.name}`
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
              ele.details = `${message}:"${ele.code}"自定义核算项目-${ele.name}`
              ele.referenceDescription = `${message}成功`
              this.batchhandleData.push(ele)
            }
          })
        })
      }
      this.selection = []
      this.batchHandleModal = true
      this.checked = `${message}成功${successList.length}个,${message}失败${failList.length}个`
    },
    // 获取批量删除id
    doSelectTableData ({ selection }) {
      this.selection = selection
    },
    // 分页事件
    doChangeSize (val) {
      this.size = val
      this.doChangeCurrent(1)
    },
    doChangeCurrent (val) {
      this.current = val
      this.doNameSearch()
    },
    handleConfirmOption (text) {
      console.log(text)
    },
    // 点击导出
    doClickDown () {
      let req = {
        isEnable: this.queryCriteria.isEnable === 2 ? null : this.queryCriteria.isEnable,
        companyId: this.queryCriteria.companyId,
        codeOrName: this.queryCriteria.codeOrName,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItem/exportAccountingItemExcel', req, 'blob').then(({ headers, data }) => {
        let suffix = headers['content-disposition'].split('.')[1]
        console.log(suffix)
        const aLink = document.getElementById('check_id')
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = `自定义核算项目列表.${suffix}` // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    doOptionSwitch () {
      this.optionFlag = !this.optionFlag // 选项开关
    },
    // 分页信息跳转到第几页
    doGoElevatorPage (pageId) {
      this.goElevatorPage(pageId)
    }
  },
  created () {
    this.doNameSearch()
    this.doGettableHeader()
  }
}
</script>

<style lang="less">
  @import '../../../../assets/css/base.less';
  @import '../../../../assets/css/redefine.less';
  .check_index{
    .demo-spin-icon-load{
     animation: ani-demo-spin 1s linear infinite;
    }
    .ivu-spin-fix{
      z-index: 1000;
    }
    .tableHeight {
      height: 36px;
    }
    .page-content{
      .page-content-table {
        padding-bottom: 0px !important;
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
    .page-footer {
      .page-footer-span {
        margin: 0 5px;
      }
    }
  }
</style>
