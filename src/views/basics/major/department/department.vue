<template>
  <section class="company-containerved">
    <section class="page-header">
      <div class="page-header-name">部门列表</div>
      <div class="page-header-actions">
        <Button @click="toCreateUnit" type="primary">新增</Button>
        <Button @click="handleStartDel">删除</Button>
        <Button @click="handleStartDis(1)">禁用</Button>
        <Button @click="handleStartDis2(0)">反禁用</Button>
        <Button class="span-space btn-length" @click="doClickConfig"><common-icon type="_table" :size="14"></common-icon></Button>
        <Button class="btn-length" @click.native="doClickExport" ><common-icon type="_export" :size="14"></common-icon></Button>
        <Button class="btn-length" @click.native="doClickDown"><common-icon type="_import" :size="14"></common-icon></Button>
        <Button class="btn-length" @click="dof5"><common-icon type="_refresh" :size="14"/></Button>
      </div>
    </section>
    <section class="page-content">
      <Spin fix v-if="isloading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>正在载入数据</div>
      </Spin>
      <!-- 查询条件 -->
      <multi-select
        @on-select="handleGetCompanyIds"
        @on-visibe-change="doReset"
        placeholder="公司编号或名称"
        title="选择公司"
        type="company"
        :defaultValue="true"
        :width="handsomewidth"
        :isEnterpriseAdmin= "`1`"
        :data="companyParams"
        :isClear="isCompanyClear">
        <Row :gutter="16" slot="search">
          <Col span="3" class="page-left-search">
            <Select v-model="companyFormId" class="clearList" @on-change="doSelect">
              <Option v-for="item in formLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="5" class="page-left-search">
            <Input  class="user-mobile" v-model="companyCodeOrName" placeholder="公司编码或名称" clearable enter-button  @on-clear="doSearch"  @on-search="doSearch"></Input>
          </Col>
          <Col span="1">
            <Button  icon="ios-search" @click="doSearch" class="searched"></Button>
          </Col>
          <Col span="2" class="page-left-search">
            <Button @click="doReset" class="reseting">重置</Button>
          </Col>
        </Row>
      </multi-select>
      <Select class="span-space company-input-find" v-model="params.deptType" @on-change="doGoLinst" clearable placeholder="全部属性">
        <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
      </Select>
      <Select class="span-space company-input-find" v-model="params.isEnable" @on-change="doGoLinst" clearable placeholder="全部数据类型">
        <Option v-for="(item,isEnable) in typeList" :value="item.id" :key="isEnable">{{item.babel}}</Option>
      </Select>
      <Input class="span-space company-input company-input-code" type="text" v-model="params.deptCodeOrDeptName" clearable @on-clear="doGoLinst" @on-enter="doGoLinst" placeholder="部门编码/名称"></Input>
      <Button slot="append" @click="doGoLinst" icon="ios-search" style="padding: 2.7px 8px;margin-left: 0px"></Button>
      <Button class="span-space company-input" @click="handleResetParams">重置</Button>
      <div class="page-content-table">
        <Spin fix v-if="spinLoading && !isloading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <!-- <Table
        :columns="columns4"
        :data="tableColum"
        :height="tableHeight"
        @on-select="handleSelectRow"
        @on-select-cancel="handleSelectRow"
        @on-select-all="handleSelectRow"
        @on-select-all-cancel="handleSelectRow"
        :no-data-text="null"
        :class="tableColum.length ? 'tableHeight' : ''"
        ></Table> -->
        <!-- <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableColum.length"></nodata> -->
        <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          ref='currentRowTable'
          :columns="columns4"
          :data="tableColum"
          :height="tableColum.length ? tableHeight : 0"
          @select-all="handleSelectRow"
          @select-change="handleSelectRow">
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-grid>
      </div>
      </div>
    </section>
    <section class="page-footer">
      <div class="page-footer-lf">
        已选择<strong>{{ current_selection_row.length }}</strong>项，共{{total}}条数据
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
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="reminderModal1"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDeleteData1">确定</Button>
        <Button  @click="handleCancelDelete1">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible4"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>请确认是否要禁用当前数据，禁用后将无法使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisable4">确定</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible5"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>反禁用后，当前数据将能被使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisable5">确定</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
    <table-config @close="doTableClose" :drawer="drawer" ></table-config>
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" ref="upload" :templateType="templateType"></upload-modal>
    <change-depart @moreClose="doprojectClose" :model_ids="model_ids" :showMore="showMore"></change-depart>
    <!-- <CompanySelect title="选择归属公司" v-model="company_select_visible" @select="handleSelectCompany"></CompanySelect> -->
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
        <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
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
        <span>注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据</span>
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
    <div>
      <Modal v-model="moreValues" class="change-modal" draggable scrollable width="650px" title="变更历史" @on-cancel="docancle">
       <div class="content">
          <div class="change-modal-content-table">
            <div>
               <Form >
                 <Row>
                     <Col span="5" >
                       <FormItem label="编码">
                           <span class="FontSize">{{this.tableDataed.code}}</span>
                       </FormItem>
                     </Col>
                     <Col span="12" class="input_after">
                       <FormItem label="名称">
                           <span class="FontSize">{{this.tableDataed.name}}</span>
                       </FormItem>
                     </Col>
                  </Row>
               </Form>
            </div>
            <Table
              :columns="tableColums"
              :data="tableData"
            ></Table>
          </div>
         </div>
         <div slot="footer" class="change-modal-footer">
        <!-- <button class="box-background change-modal-comfirm">确认</button> -->
        <button class="change-modal-cancle" @click="docancle">关闭</button>
       </div>
      </Modal>
    <!-- 批量操作弹窗 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchList"></batch-handle-modal>
    <a id="a_id"></a>
    </div>
  </section>
</template>

<script>
import CommonIcon from '_c/common-icon'
import ChangeDepart from './change_department'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins.js'
import { sortArr, getHeight } from '@/libs/tools.js'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import multiSelect from '_c/multi-select'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'department_index',
  components: { CommonIcon, uploadModal, ChangeDepart, multiSelect, nodata, tableConfig, batchHandleModal },
  mixins: [saasMixin],
  data () {
    return {
      isloading: false,
      // 批量建账成功提示的表头
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
          minWidth: 150
        },
        {
          title: '状态',
          key: 'status',
          minWidth: 100
        },
        {
          title: '说明',
          key: 'referenceDescription',
          minWidth: 150
        }
      ],
      tableHeight: 0,
      isCompanyClear: false,
      paramsList: {},
      currentRow: {},
      isEnterpriseAdmin: 1,
      // 公司筛选对象
      companyParams: {
        companyFormId: '',
        codeOrName: ''
      },
      tableDataed: {
        code: '',
        name: ''
      },
      handsomewidth: '280px',
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
      drawer: false, // drawer组件的值
      types: null, // 提示类型
      sucLen: 0, // 批量操作成功条数
      errLen: 0, // 批量操作失败条数
      batchList: [], // 批量操作数组
      disable_versions: [],
      showTableSetter: false,
      batchHandleModal: false, // 批量操作弹窗
      companyFormId: 0,
      companyCodeOrName: '',
      tablelist: [],
      visible: false, // 抽屉显示
      showMore: false, // 更多模板是都显示
      moreValues: false,
      isupload: false, // 导入弹窗
      templateType: 'dept', // 导入模板类型
      company_select_visible: false,
      // isHover: false,
      total: 0,
      spinLoading: false, // 载入等待
      pageSize: 20,
      datacount: 0,
      reminderModals: false, // 删除确认
      reminderModal1: false, // 删除确认
      current_selection_row: [], // 列表多选选中
      del_ids: [], // 删除ids
      del_versions: [],
      disable_visible: false,
      disable_visible2: false,
      disable_visible4: false,
      disable_visible5: false,
      checked: null, // 批量建账成功提示的check
      disable_ids: [], // 获取数组
      model_ids: 0,
      change_ids: 0,
      table_list: [],
      disable_type: '',
      modelid: '',
      menuCode: this.$route.name, // 菜单编码
      params: {// 请求参数
        // dataType: 0, // 部门
        companyIdList: [], // 使用公司公司id
        deptCodeOrDeptName: '', // 编码或名称
        isEnable: '', // 启动标识
        codeName: '', // 编码
        deptType: '', // 辅助资料表id
        isEnterpriseAdmin: 1, // 管理员
        page: {
          size: 20,
          current: 1
        }
      },
      tableColum: [], // 列表页面
      selectMore: [],
      config: {
        title: '选项',
        width: 400,
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
              label: '公司创建，公司私有',
              value: 1,
              hint: '这是集团创建'
            }
          ]
        }

      ],
      formList: [
      ],
      typeList: [
        {
          id: 0,
          babel: '已失效'

        },
        {
          id: 1,
          babel: '已生效'

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
        title: '编码',
        key: 'code',
        field: 'code',
        className: 'primary',
        tooltip: true,
        minWidth: 120,
        // <Poptip content="content" placement="right" trigger="hover">
        //   部门编码<Icon class="notices" type="md-help-circle" size="16" style="margin-top:-1px;"/>
        //   <div slot="content" >部门编码编写规则</div>
        // </Poptip>
        slots: {
          header: ({ row, index, column }, h) => {
            return [
              <div>
                <span style="margin-right: 13px;">部门编码</span>
                <Poptip trigger="hover" content="上级部门编码+2位流水号(一级部门:BM+公司编码+2位流水号)" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            ]
          },
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" on-click={this.doLocationDetail.bind(this, 'update_department', { id: row.id })}>{row.code}</span>
              </div>
            ]
          }
        }
      },
      columns: [
        {
          title: '名称',
          minWidth: 120,
          key: 'name',
          field: 'name'
        },
        {
          title: '属性',
          minWidth: 120,
          key: 'deptTypeName',
          field: 'deptTypeName'
        },
        {
          title: '创建公司',
          minWidth: 120,
          key: 'companyName',
          field: 'companyName'
        },
        {
          title: '上级部门',
          minWidth: 120,
          key: 'prarentName',
          field: 'prarentName'
        },
        {
          title: '创建公司业务单元',
          minWidth: 120,
          key: 'attrBusinessUnitName',
          field: 'attrBusinessUnitName'
        },
        {
          title: '使用公司',
          minWidth: 120,
          key: 'useCompanyName',
          field: 'useCompanyName'
        },
        {
          title: '使用公司业务单元',
          minWidth: 120,
          key: 'businessUnitName',
          field: 'businessUnitName'
        },
        {
          title: '描述',
          minWidth: 120,
          key: 'remark',
          field: 'remark'
        },
        {
          title: '创建人',
          minWidth: 120,
          key: 'creatorName',
          field: 'creatorName'
        },
        {
          title: '创建时间',
          minWidth: 120,
          key: 'createTime',
          field: 'createTime'
        },
        {
          title: '修改人',
          minWidth: 120,
          key: 'updatorName',
          field: 'updatorName'
        },
        {
          title: '修改时间',
          minWidth: 120,
          key: 'updateTime',
          field: 'updateTime'
        },
        {
          title: '变更人',
          minWidth: 120,
          key: 'changePersonName',
          field: 'changePersonName'
        },
        {
          title: '变更时间',
          minWidth: 120,
          key: 'changeTime',
          field: 'changeTime'
        },
        {
          title: '禁用人',
          minWidth: 120,
          key: 'disabledUserName',
          field: 'disabledUserName'
        },
        {
          title: '禁用时间',
          minWidth: 120,
          key: 'disabledTime',
          field: 'disabledTime'
        },
        {
          title: '反禁用人',
          minWidth: 120,
          key: 'enabledUserName',
          field: 'enabledUserName'
        },
        {
          title: '反禁用时间',
          minWidth: 120,
          key: 'enabledTime',
          field: 'enabledTime'
        },
        {
          title: '数据状态',
          minWidth: 120,
          key: 'isEnableStr',
          field: 'isEnableStr',
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
        width: 260,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <div>
                <span class="table-span" v-show={row.isEnable === 1 && (row.deptLevel === 1 || row.deptLevel === 2 || row.deptLevel === 3)} on-click={this.Addsubordinate.bind(this, { row, index, column })}>新增下级</span>
                <span class="table-span" on-click={ this.handleDelRow.bind(this, { row }) }>删除</span>
                <span class="table-span" v-show={row.isEnable === 1} on-click={ this.handleDisableRow.bind(this, { row }) }>禁用</span>
                <span class="table-span" v-show={row.isEnable === 0} on-click={ this.handleDisableRow2.bind(this, { row }) }>反禁用</span>
                <span class="table-span" v-show={row.isEnable !== 0} on-click={this.showchange.bind(this, { row, index, column })}>变更</span>
                <span class="table-span" v-show={row.isEnable !== 0}on-click={this.oldchanges.bind(this, { row, index, column })}>变更历史</span>
              </div>
            ]
          }
        }
      },
      tableData: [
        { useCompanyName: '南京网兜科技有限公司', businessUnitName: '南京网兜科技有限公司', startTime: '2019-06-01', endTime: '2019-06-02' }
      ],
      tableColums: [
        {
          title: '使用公司',
          key: 'useCompanyName',
          tooltip: true
        },
        {
          title: '使用公司业务单元',
          key: 'businessUnitName',
          tooltip: true
        },
        {
          title: '变更人',
          key: 'creatorName',
          tooltip: true
        },
        {
          title: '变更时间',
          key: 'createTime',
          tooltip: true
        }
      ]
    }
  },
  mounted () {
    this.isloading = true
    // 获取表头
    this.doGettableHeader()
    // 获取查询条件
    this.getdeptchange()
    // 获取表格数据
    this.doGoLinst()
    setTimeout(() => { this.isloading = false }, 1000)
  },
  // activated () {
  //   if (this.$store.state.user.isRefreshTable) {
  //     this.doGoLinst()
  //     this.$store.commit('setIsRefreshTable', false)
  //   }
  // },
  methods: {
    // 新增下级
    Addsubordinate (val) {
      this.currentRow = val
      this.getCurrentid(this.currentRow.row.id)
    },
    // 点击新增isUsed 引用状态查询
    getCurrentid (id) {
      this.$request.post('/financeback/dept/checkIsUsed', { id }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.formValidated = res.data.data
            if (this.formValidated === 1) {
              this.$router.push({ path: 'department_create', query: { ids: this.currentRow.row.id, name: this.currentRow.row.name } })
              return false
            } else {
              this.$Message.warning('当前数据已使用，无法新增下级')
            }
          } else {
            this.formValidated = ''
          }
        } else {
          this.formValidated = ''
          this.$Message.warning(res.data.message)
        }
      })
    },
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
    // 多选组件公司on-select监听事件
    handleGetCompanyIds (ids) {
      this.isCompanyClear = false
      this.params.companyIdList = ids.map(item => item.id)
      // let companyIds = []
      // this.params.companyIdList.forEach(item => {
      //   this.params.companyIdList = JSON.parse(item.id)
      //   companyIds.push(this.params.companyIdList)
      //   this.params.companyIdList = companyIds
      // })
      this.doGoLinst()
    },
    doGoLinst () {
      this.spinLoading = true
      this.$request.post('financeback/dept/findDeptPage', this.params).then(res => {
        if (res.data.code === 200) {
          if (this.params.page.current > 1 && !res.data.data.records.length) {
            --this.params.page.current
            return doGoLinst()
          }
          this.tableColum = res.data.data.records
          // 列表数据
          res.data.data.records = res.data.data.records.map(item => Object.assign(item, item.manageInfo))
          this.tableColum = res.data.data.records
          this.tableColum.forEach((item) => {
            if (item.createTime) {
              item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.createTime = ''
            }
            if (item.updateTime) {
              item.updateTime = this.$dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.updateTime = ''
            }
            if (item.changeTime) {
              item.changeTime = this.$dayjs(item.changeTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.changeTime = null
            }
            if (item.disabledTime) {
              item.disabledTime = this.$dayjs(item.disabledTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.disabledTime = null
            }
            if (item.enabledTime) {
              item.enabledTime = this.$dayjs(item.enabledTime).format('YYYY-MM-DD HH:mm:ss')
            } else {
              item.disabledTime = null
            }
          })
          this.getListIds({ ids: this.tableColum.map(n => { return n.id }), name: 'department' })
          this.total = res.data.data.total
          this.tableHeight = this.tableColum.length ? getHeight(85) : 36
        } else {
          this.table_list = []
          this.total = 0
        }
        this.spinLoading = false
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
        this.doGoLinst()
        if (data.failList.length) {
          data.failList.forEach(item => {
            this.tableColum.forEach((ele, index) => {
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
            this.tableColum.forEach((ele, index) => {
              if (item === ele.id) {
                ele.status = '成功'
                ele.details = `${message}:"${ele.code}"-${ele.name}`
                ele.referenceDescription = `${message}成功`
                this.batchList.push(ele)
              }
            })
          })
        }
        this.disable_ids = []
      }
    },
    // 全部属性
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          this.formList = res.data.data
        }
      })
    },
    // 刷新
    dof5 () {
      this.doGoLinst()
    },
    // jinyong
    handleDisableRow (row) {
      this.disable_type = row.isEnable
      this.disable_ids = []
      this.disable_ids.push(row.row.id)
      this.disable_versions = []
      this.disable_versions.push(row.row.version)
      this.disable_visible4 = true
    },
    // fanjinyong
    handleDisableRow2 (row) {
      this.disable_type = row.isEnable
      this.disable_ids = []
      this.disable_ids.push(row.row.id)
      this.disable_versions = []
      this.disable_versions.push(row.row.version)
      this.disable_visible5 = true
    },
    handleDisable5 () {
      let req = {
        idList: this.disable_ids,
        versionList: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/enableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('操作成功！')
          // this.doDeleteClose(res.data.data)
          this.doGoLinst()
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleDisables () {
      let req = {
        idList: this.disable_ids,
        versionList: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/enableBatch', req).then(res => {
        if (res.data.code === 200) {
          // this.$Message.success('操作成功！')
          this.doDeleteClose(res.data.data, '反禁用')
          this.doGoLinst()
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleDisable4 () {
      let req = {
        idList: this.disable_ids,
        versionList: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('操作成功！')
          this.doGoLinst()
          // this.doDeleteClose(res.data.data)
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleDisable () {
      let req = {
        idList: this.disable_ids,
        versionList: this.disable_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          // this.$Message.success('操作成功！')
          this.doGoLinst()
          this.doDeleteClose(res.data.data, '禁用')
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleCancelDisable () {
      this.current_selection_row = []
      this.disable_ids = []
      this.disable_versions = []
      this.disable_type = ''
      this.disable_visible = false
      this.disable_visible2 = false
      this.disable_visible4 = false
      this.disable_visible5 = false
      this.$refs['currentRowTable'].clearAll()
    },
    // 变更历史记录
    getChangeOld (id) {
      this.$request.post('/financeback/dept/findCompanyList', {
        id
      }).then(res => {
        if (res.data.code === 200) {
          this.tableDataed = res.data.data
          this.tableData = res.data.data.deptUseCompanyList
          this.tableData.forEach((item) => {
            item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
    },
    handleDelRow (row) {
      this.del_ids = []
      this.del_ids.push(row.row.id)
      this.del_versions = []
      this.del_versions.push(row.row.version)
      this.reminderModal1 = true
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
        this.$Message.error('请选择至少一行数据后再操作！')
      }
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
        this.$Message.error('请选择至少一行数据后再操作！')
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
      let req = {
        idList: this.del_ids,
        versionList: this.del_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/deleteDeptBatch', req).then(res => {
        if (res.status === 200) {
          this.del_versions = []
          // this.$Message.success('删除成功！')
          if (this.current_selection_row.length >= this.table_list.length) {
            if (this.params.page.current > 1) {
              this.params.page.current--
            }
          }
          this.handleCancelDelete()
          this.doDeleteClose(res.data.data, '删除')
          this.doGoLinst()
        } else {
          this.$Message.warning('删除失败！')
          this.del_versions = []
        }
      })
    },
    // 单个
    handleDeleteData1 () {
      let req = {
        idList: this.del_ids,
        versionList: this.del_versions,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/dept/deleteDeptBatch', req).then(res => {
        if (res.status === 200) {
          // this.$Message.success('删除成功！')
          if (this.current_selection_row.length >= this.table_list.length) {
            if (this.params.page.current > 1) {
              this.params.page.current--
            }
          }
          this.handleCancelDelete1()
          this.doDeleteClose(res.data.data, '删除')
          this.doGoLinst()
        } else {
          this.$Message.warning('删除失败！')
        }
      })
    },
    handleCancelDelete () {
      this.del_ids = []
      this.reminderModals = false
    },
    handleCancelDelete1 () {
      this.del_ids = []
      this.del_versions = []
      this.reminderModal1 = false
    },
    // 分页功能
    doUpdateCurrentPage (val) {
      this.params.page.current = val
      this.doGoLinst()
    },
    doUpdatePageSize (val) {
      this.params.page.size = val
      this.doUpdateCurrentPage(1)
    },
    // 监听更多模板关闭
    doprojectClose (msg) {
      this.showMore = false
    },
    // 重置
    handleResetParams () {
      this.isCompanyClear = true
      this.params.companyIdList = []
      this.params.deptType = null
      this.params.deptCodeOrDeptName = null
      this.params.isEnable = null
      this.typeList.babel = null
      this.params.size = 20
      this.params.current = 1
      this.doGoLinst()
    },
    // 点击更多模板
    showchange (row) {
      this.model_ids = row.row.id
      // isEnd   0否  1是末级
      if (row.row.isEnd === 1) {
        this.showMore = true
      } else {
        this.$Message.warning('只能变更末级部门的使用公司及其业务单元，请选择末级部门进行操作')
      }
    },
    docancle () {
      this.moreValues = false
    },
    oldchanges (row) {
      // this.change_ids = row.row.id
      this.getChangeOld(row.row.id)
      this.moreValues = true
    },
    handleConfirmOption (params) {
      console.log(params)
    },
    handleSelectCompany (row) {
      if (row) {
        this.data2 = row.name
      }
      this.company_select_visible = false
    },
    // 新增
    toCreateUnit () {
      this.doLocationDetail('create_department')
    },
    // 点击导出
    doClickDown () {
      this.$request.post('/financeback/dept/exportExcel', this.params, 'blob').then(res => {
        const aLink = document.getElementById('a_id')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = '部门列表.xls' // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // helpHover () {
    //   this.isHover = true
    // },
    // loseHover () {
    //   this.isHover = false
    // },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
      this.$refs.upload.isEnterpriseAdmin = this.isEnterpriseAdmin
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
      // this.doGetInit()
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
      this.isConfig = true
    },
    // 获取表格
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.menuCode, // 菜单编码 // 菜单编码 //
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
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doGoLinst()
      }
      this.drawer = false
    }
  }
}
</script>

<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
.company-containerved {
  #a_id {
    display: none;
  }
  .span-space {
    .span-space(8px, 0)
  }
  // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  .table-span {
    margin-right: 15px;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-btn-icon-only {
    padding: 2.7px 8px;
    margin-left: -16px;
  }
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
  // 操作modal提示框
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
}
// 变更历史modal
.change-modal{
  .change-modal-content-table {
    width: calc(100% - 32px);
    height: 350px;
    .FontSize {
      font-size:12px;
      color: #999999;
    }
  }
  .change-modal-header {
      height: 50px;
      line-height: 50px;
      text-indent: 16px;
      font-size: 16px;
      color: #696969;
    }
  .ivu-modal-footer {
    height: 60px;
    .change-modal-comfirm {
      cursor: pointer;
    }
    .change-modal-cancle {
      width: 56px;
      height: 32px;
      color: #666666;
      font-size: 12px;
      border: 1px solid #e7e7e7;
      margin-right: 16px;
      cursor: pointer;
    }
  }
}
</style>
