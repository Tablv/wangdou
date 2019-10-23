<template>
  <section class="employee-containers">
    <section class="page-header">
      <div class="page-header-name">员工列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreateUnit">新增</Button>
        <Button  @click="handleStartDel">删除</Button>
        <Button  @click="handleStartDis(1)">禁用</Button>
        <Button  @click="handleStartDis2(0)">反禁用</Button>
        <Button class="span-space btn-length" @click="doClickConfig"><common-icon type="_table" :size="14"></common-icon></Button>
        <Button class="btn-length"  @click.native="doClickExport" ><common-icon type="_export" :size="14"></common-icon></Button>
        <Button class="btn-length" @click.native="doClickDown"><common-icon type="_import" :size="14"></common-icon></Button>
        <Button class="btn-length" @click="dof5"><common-icon type="_refresh" :size="14"/></Button>
        </div>
    </section>
    <section class="page-content">
      <!-- 部门提示 -->
      <Spin fix v-if="isloading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>正在载入数据</div>
      </Spin>
      <multi-select
        @on-select="handleGetCompanyIds"
        @on-visibe-change="doReset"
        placeholder="公司编号或名称"
        title="选择公司"
        type="company"
        :defaultValue="true"
        :width="handsomewidth"
        :isEnterpriseAdmin= "`1`"
        :data="companyParams"  :isClear="isCompanyClear">
        <Row :gutter="16" slot="search">
          <Col span="3" class="page-left-search">
            <Select v-model="companyFormId" class="clearList" @on-change="doSelect">
              <Option v-for="item in formLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="5" class="page-left-search">
            <Input class="user-mobile" v-model="companyCodeOrName" placeholder="公司编码或名称" clearable enter-button  @on-clear="doSearch"  @on-search="doSearch"></Input>
          </Col>
          <Col span="1">
            <Button icon="ios-search" @click="doSearch" class="searched"></Button>
          </Col>
          <Col span="2" class="page-left-search">
            <Button @click="doReset" class="reseting">重置</Button>
          </Col>
        </Row>
      </multi-select>
      <Select class="span-space company-input-find" clearable  v-model="params.deptId" @on-change="doList" placeholder="全部部门">
        <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
      </Select>
      <Select class="span-space company-input-find" v-model="params.isEnable" @on-change="doList" clearable placeholder="全部数据类型">
        <Option v-for="(item,isEnable) in typeList" :value="item.id" :key="isEnable">{{item.babel}}</Option>
      </Select>
      <Input class="span-space company-input company-input-code" type="text" v-model="params.codeOrName" clearable  @on-clear="doList" @on-enter="doList" placeholder="员工编码/名称"></Input>
      <Button slot="append" @click="doList" icon="ios-search" style="padding: 2.7px 8px;margin-left: 0px"></Button>
      <Button class="span-space company-input" @click="handleResetParams">重置</Button>
      <div class="page-content-table">
        <Spin fix v-if="spinLoading && !isloading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <!-- <Table ref="currentRowTable"
         :columns="columns4"
         :data="tableData"
          @on-select="handleSelectRow"
          @on-select-cancel="handleSelectRow"
          @on-select-all="handleSelectRow"
          @on-select-all-cancel="handleSelectRow"
          :no-data-text="null"
          :height="tableHeight"
          :class="tableData.length ? 'tableHeight' : ''"
          ></Table> -->
        <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          ref="currentRowTable"
          :columns="columns4"
          :data="tableData"
          :height="tableData.length ? tableHeight : 0"
          @select-all="handleSelectRow"
          @select-change="handleSelectRow">
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-grid>
        <!-- <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableData.length"></nodata> -->
      </div>
    </section>
    <section class="page-footer">
      <div class="page-footer-lf">
        已选择<strong>{{ current_selection_row.length }}</strong>项，共{{ total }}条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageId"
        class-name="pages"
        :total="total"
        :page-size="params.page.size"
        :page-size-opts="[20, 50, 100, 200, 500, 1000]"
        show-elevator
        show-sizer
        @on-change="doUpdateCurrentPage"
        @on-page-size-change="doUpdatePageSize"/>
        <Button size="small" @click="goElevatorPage('pageId')">Go</Button>
      </div>
    </section>
    <!-- 上部弹窗 -->
    <table-config @close="doTableClose" :drawer="drawer" ></table-config>
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" :templateType="templateType"></upload-modal>
    <CompanySelect title="选择归属公司" v-model="company_select_visible" @select="handleSelectCompany"></CompanySelect>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="reminderModals"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>删除后将不可恢复！请确认是否要删除数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDeleteData">确定</Button>
        <Button  @click="handleCancelDelete">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>禁用后将不能在新增数据中使用！请确认是否要禁用数据</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisable">确定</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible2"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>请确认是否要反禁用数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisables">确定</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
        <a id="a_id"></a>
     <!-- 批量操作弹窗 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchList"></batch-handle-modal>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import { sortArr, getHeight } from '@/libs/tools.js'
import CompanySelect from '_c/companySelectModal'
import multiSelect from '_c/multi-select'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins.js'
export default {
  name: 'employee_index',
  components: {
    CommonIcon, CompanySelect, nodata, multiSelect, uploadModal, tableConfig, batchHandleModal
  },
  mixins: [saasMixin],
  data () {
    return {
      isloading: false,
      // 批量提示框
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
          minWidth: 60
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 40
        },
        {
          title: '说明',
          key: 'referenceDescription',
          minWidth: 150
        }
      ],
      handsomewidth: '280px',
      companyParams: {
        companyFormId: '',
        codeOrName: ''
      },
      isCompanyClear: false,
      tableConfigVisible: false,
      companyFormId: 0,
      companyCodeOrName: '',
      isEnterpriseAdmin: 1,
      tablelist: [],
      checked: null, // 批量建账成功提示的check
      drawer: false,
      types: null, // 提示类型
      sucLen: 0, // 批量操作成功条数
      errLen: 0, // 批量操作失败条数
      batchList: [], // 批量操作数组
      table_list: [],
      batchHandleModal: false, // 批量操作弹窗
      visible: false,
      tableHeight: 0,
      isEnable: '',
      isupload: false, // 导入弹窗
      templateType: 'staff', // 导入模板类型
      roleId: null,
      company_select_visible: false, // 抽屉显示
      selectMore: [], // 选中个数
      total: 0, // 多少数据
      ids: [],
      spinLoading: false, // 载入等待
      pageSize: 20,
      tableData: [], // 列表页面
      datacount: 0,
      reminderModals: false, // 删除确认
      current_selection_row: [], // 列表多选选中
      del_ids: [], // 删除ids
      del_versions: [],
      disable_visible: false,
      disable_visible2: false,
      disable_ids: [],
      disable_versions: [],
      disable_type: '',
      params: {// 请求参数
        companyIdList: [], // 公司id
        deptId: '', // 部门ID
        name: '', // 姓名
        isEnable: '', // sujuzhuangtai
        codeOrName: '', // 编码
        code: '',
        isEnterpriseAdmin: 1, // 管理员
        page: {
          size: 20,
          current: 1
        }
      },
      config: {
        title: '选项',
        width: 399,
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      },
      options_config: [
        {
          title: '控制策略',
          type: 'checkbox',
          keyName: 'control',
          keyValue: [],
          data: [
            {
              label: '集团创建，集团共享',
              value: 0
            },
            {
              label: '公司创建，引用共享',
              value: 1
            }
          ]
        },
        {
          title: '编码规则',
          type: 'radio',
          keyName: 'code1',
          keyValue: '',
          data: [
            {
              label: '系统编码',
              value: 0
            },
            {
              label: '自定义编码1',
              value: 1
            },
            {
              label: '自定义编码2',
              value: 2
            },
            {
              label: '自定义编',
              value: 3
            },
            {
              label: '自定义编3',
              value: 4
            }
          ]
        }
      ],
      formList: [],
      formLists: [
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
      typeList: [
        {
          id: 1,
          babel: '已生效'

        },
        {
          id: 0,
          babel: '已失效'

        }
      ],
      columns4: [],
      header: {
        type: 'selection',
        field: 'selection',
        width: 40,
        align: 'center',
        fixed: 'left'
      },
      code: {
        title: '员工编码',
        key: 'code',
        field: 'code',
        minWidth: 120,
        // <div>
        //   <Poptip content="content" placement="right" trigger="hover">
        //     员工编码<Icon class="notices" type="md-help-circle" size="16" style="margin-top:-1px;"/><div slot="content" >员工编码编写规则</div>
        //   </Poptip>
        // </div>
        slots: {
          header: ({ row, index, column }, h) => {
            return [
              <div>
                <span style="margin-right: 13px;">员工编码</span>
                <Poptip trigger="hover" content="部门编码+3位流水号" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            ]
          },
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click={this.doLocationDetail.bind(this, 'update_employee', { id: row.id })}>{row.code}</span>
              </div>
            ]
          }
        }
      },
      columns: [
        {
          title: '员工姓名',
          minWidth: 120,
          key: 'name',
          field: 'name'
        },
        {
          title: '手机号',
          minWidth: 120,
          key: 'contactNumber',
          field: 'contactNumber'
        },
        {
          title: '电子邮箱',
          minWidth: 120,
          key: 'email',
          field: 'email'
        },
        {
          title: '用户名',
          minWidth: 120,
          key: 'userName',
          field: 'userName'
        },
        {
          title: '部门',
          minWidth: 120,
          key: 'dept',
          field: 'dept'
        },
        {
          title: '更新者',
          minWidth: 120,
          key: 'updatorName',
          field: 'updatorName'
        },
        {
          title: '更新时间',
          minWidth: 120,
          key: 'updateTime',
          field: 'updateTime'
        },
        {
          title: '更新者ID',
          minWidth: 120,
          key: 'updatorId',
          field: 'updatorId'
        },
        {
          title: '创建时间',
          minWidth: 120,
          key: 'createTime',
          field: 'createTime'
        },
        {
          title: '创建人',
          minWidth: 120,
          key: 'creatorName',
          field: 'creatorName'
        },
        {
          title: '创建人ID',
          minWidth: 120,
          key: 'creatorId',
          field: 'creatorId'
        },
        {
          title: '银行号',
          minWidth: 120,
          key: 'bankAccount',
          field: 'bankAccount'
        },
        {
          title: '描述',
          minWidth: 120,
          key: 'remark',
          field: 'remark'
        },
        {
          title: '身份证号',
          minWidth: 120,
          key: 'idCardNum',
          field: 'idCardNum'
        },
        {
          title: '创建公司',
          minWidth: 120,
          key: 'company',
          field: 'company'
        },
        {
          title: '数据状态',
          key: 'isEnable',
          field: 'isEnable',
          minWidth: 120,
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
      opreation: {
        title: '操作',
        key: 'isAccounting',
        field: 'isAccounting',
        fixed: 'right',
        width: 240,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click={ this.handleDelRow.bind(this, { row, index, column }) }>删除</span>
                <span class="table-span" v-show={row.isEnable === 1} on-click={ this.handleDisableRow.bind(this, { row }) }>禁用</span>
                <span class="table-span" v-show={row.isEnable === 0} on-click={ this.handleDisableRow2.bind(this, { row }) }>反禁用</span>
              </div>
            ]
          }
        }
      },
      menuCode: this.$route.name // 菜单编码
    }
  },
  mounted () {
    this.isloading = true
    this.doGettableHeader()
    this.getdeptchange()
    // this.handleFindHeaderList()
    this.doList()
    setTimeout(() => { this.isloading = false }, 1000)
  },
  // activated () {
  //   if (this.$store.state.user.isRefreshTable) {
  //     this.doList()
  //     this.$store.commit('setIsRefreshTable', false)
  //   }
  // },
  watch: {
    selectData (data, oldData) {
      this.datacount = this.selectData.length
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
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    handleGetCompanyIds (ids) {
      this.isCompanyClear = false
      this.params.companyIdList = ids.map(item => item.id)
      // let companyList = []
      // this.params.companyIdList.forEach(item => {
      //   console.log(JSON.parse(item.id))
      //   this.params.companyIdList = JSON.parse(item.id)
      //   companyList.push(this.params.companyIdList)
      //   this.params.companyIdList = companyList
      // })
      this.doList()
    },
    // 获取表格
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.menuCode, // 菜单编码// 菜单编码
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
          for (let i = 0; i < newHeader.length; i++) {
            newHeader[i].key = newHeader[i].columnName
            if (newHeader[i].isShow !== 0) {
              that.getTableList.push(newHeader[i])
            }
          }
          that.columns4 = sortArr(that.columns, that.getTableList)
          that.columns4.push(this.opreation)
          that.columns4.unshift(this.code)
          that.columns4.unshift(this.header)
        }
      })
    },
    // 刷新
    dof5 () {
      this.doList()
    },
    // 初始化
    doList () {
      this.spinLoading = true
      this.$request.post('/financeback/staff/findStaffPage', this.params).then(res => {
        this.spinLoading = false
        if (res.data.code === 200) {
          if (this.params.page.current > 1 && !res.data.data.records.length) {
            --this.params.page.current
            return this.doList()
          }
          this.tableData = res.data.data.records
          this.tableData.forEach((item) => {
            if (item.updateTime) {
              item.updateTime = this.$dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.updateTime = null
            }
            if (item.createTime) {
              item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.createTime = null
            }
          })
          this.getListIds({ ids: this.tableData.map(n => { return n.id }), name: 'employee' })
          this.total = res.data.data.total
          this.tableHeight = this.tableData.length ? getHeight(85) : 36
        } else {
          this.tableData = []
          this.table_list = []
          this.total = 0
          this.tableHeight = 36
        }
      })
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 监听删除弹窗关闭
    doDeleteClose (data, message) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.checked = `${message}成功${data.successList.length}个,${message}失败${data.failList.length}个`
        this.batchHandleModal = true
        this.doList()
        if (data.failList.length) {
          data.failList.forEach(item => {
            this.tableData.forEach((ele, index) => {
              if (item.businessId === ele.id) {
                ele.status = '失败'
                ele.details = `${message}:"${ele.code}"${ele.name}`
                ele.referenceDescription = item.referenceDescription
                this.batchList.push(ele)
              }
            })
          })
        }
        if (data.successList.length) {
          data.successList.forEach(item => {
            this.tableData.forEach((ele, index) => {
              if (item === ele.id) {
                ele.status = '成功'
                ele.details = `${message}:"${ele.code}"${ele.name}`
                ele.referenceDescription = `${message}成功`
                this.batchList.push(ele)
              }
            })
          })
        }
        this.disable_ids = []
      }
    },
    // 重置
    handleResetParams () {
      this.isCompanyClear = true
      this.params.deptId = null
      this.params.companyIdList = []
      this.params.deptType = null
      this.params.codeOrName = null
      this.params.isEnable = null
      this.typeList.babel = null
      this.params.size = 20
      this.params.current = 1
      this.doList()
    },
    // 新增
    toCreateUnit () {
      this.doLocationDetail('create_employee')
    },
    // 禁用
    handleDisableRow (row) {
      this.disable_type = row.isEnable
      this.disable_ids = []
      this.disable_ids.push(row.row.id)
      this.disable_versions = []
      this.disable_versions.push(row.row.version)
      this.disable_visible = true
    },
    // fanjinyong
    handleDisableRow2 (row) {
      this.disable_type = row.isEnable
      this.disable_ids = []
      this.disable_ids.push(row.row.id)
      this.disable_versions = []
      this.disable_versions.push(row.row.version)
      this.disable_visible2 = true
    },
    handleDisables () {
      let req = {
        ids: this.disable_ids,
        versions: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/staff/enableBatch', req).then(res => {
        if (res.data.code === 200) {
          // this.$Message.success('操作成功！')
          this.doDeleteClose(res.data.data, '反禁用')
          this.doList()
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleDisable () {
      let req = {
        ids: this.disable_ids,
        versions: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/staff/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.doDeleteClose(res.data.data, '禁用')
          this.doList()
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleCancelDisable () {
      this.current_selection_row = []
      this.disable_versions = []
      this.disable_ids = []
      this.disable_type = ''
      this.disable_visible = false
      this.disable_visible2 = false
      // this.$refs['currentRowTable'].selectAll(false)
      this.$refs['currentRowTable'].clearAll(false)
    },
    handleDelRow (row) {
      this.del_ids = []
      this.del_ids.push(row.row.id)
      this.del_versions = []
      this.del_versions.push(row.row.version)
      this.reminderModals = true
    },
    // 多选表格项
    handleSelectRow ({ selection }) {
      this.current_selection_row = selection
    },
    // 点击批量禁用
    handleStartDis (type) {
      this.disable_type = type
      this.current_selection_row.map(item => {
        this.disable_ids.push(item.id)
        this.disable_versions.push(item.version)
      })
      if (this.current_selection_row && this.current_selection_row.length > 0) {
        this.disable_visible = true
      } else {
        this.$Message.error('请选择至少一行数据后再操作')
      }
    },
    // 全部部门
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptList').then(res => {
        if (res.data.code === 200) {
          this.formList = res.data.data
        }
      })
    },
    // 点击批量fan禁用
    handleStartDis2 (type) {
      this.disable_type = type
      this.current_selection_row.map(item => {
        this.disable_ids.push(item.id)
        this.disable_versions.push(item.version)
      })
      if (this.current_selection_row && this.current_selection_row.length > 0) {
        this.disable_visible2 = true
      } else {
        this.$Message.error('请选择至少一行数据后再操作')
      }
    },
    // 点击批量删除
    handleStartDel () {
      this.current_selection_row.map(item => {
        this.del_ids.push(item.id)
        this.del_versions.push(item.version)
      })
      if (this.current_selection_row && this.current_selection_row.length > 0) {
        this.reminderModals = true
      } else {
        this.$Message.error('请选择至少一行数据后再操作！')
      }
    },
    handleDeleteData () {
      this.$request.post('/financeback/staff/deleteBatch', {
        ids: this.del_ids,
        versions: this.del_versions,
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.code === 200) {
          if (this.current_selection_row.length >= this.table_list.length) {
            if (this.params.page.current > 1) {
              this.params.page.current--
            }
          }
          this.doList()
          this.doDeleteClose(res.data.data, '删除')
          this.handleCancelDelete()
        } else {
          this.$Message.warning('删除失败！')
        }
      })
    },
    handleCancelDelete () {
      this.del_ids = []
      this.del_versions = []
      this.reminderModals = false
    },
    // 点击导出
    doClickDown () {
      this.$request.post('/financeback/staff/exportExcel', this.params, 'blob').then(res => {
        const aLink = document.getElementById('a_id')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = '员工列表.xls' // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
    },
    // 分页功能
    doUpdateCurrentPage (val) {
      this.params.page.current = val
      this.doList()
    },
    doUpdatePageSize (val) {
      this.params.page.size = val
      this.doUpdateCurrentPage(1)
    },
    handleConfirmOption (params) {
      console.log(params)
    },
    createdepart ({ row }) {
      this.$router.push({ path: 'employee_update', query: { id: row.id } })
    },
    handleSelectCompany (row) {
      if (row) {
        this.data2 = row.name
      }
      this.company_select_visible = false
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
      this.isConfig = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doList()
      }
      this.drawer = false
    }
  }
}
</script>

<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
.employee-containers {
  .page-content{
    // 查询条件
    .company-input-find {
      width: 120px;
    }
    .company-input {
      display: inline-block;
    }
    .company-input-code {
      width: 215px;
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
    }
  }
  // .company-input-find {
  //   width: 120px;
  // }
  // .company-input {
  //   display: inline-block;
  // }
  // .company-input-code {
  //   width: 215px;
  // }
  // .notices {
  //   cursor: pointer;
  //   color: #D9D9D9;
  //   margin-left: 5px;
  //   &:hover {
  //     color: #FB883F;
  //   }
  // }
  // 信息提示
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
  .span-space {
    .span-space(8px, 0)
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  #a_id {
    display: none;
  }
  .table-span {
    margin-right: 15px;
  }
  .ivu-table-tip table td {
    text-align: center;
    display: none;
  }
   // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  .ivu-btn-icon-only {
    padding: 2.7px 8px;
    margin-left: -16px;
 }
}

</style>
