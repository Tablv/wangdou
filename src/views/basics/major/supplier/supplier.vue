<template>
  <div class="client-index">
    <Spin fix v-if="spinLoading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="header-nav">
      <div class="left">
        <div class="page-header-name">供应商列表</div>
      </div>
      <div class="right">
        <Button type="primary" @click="handleAddClient">新增</Button>
        <Button @click="doSubJectInit">引入内部供应商</Button>
        <Button @click="handleStartDel">删除</Button>
        <Button @click="doAddChecked">分配</Button>
        <Button @click="handleStartDis(1)">禁用</Button>
        <Button @click="handleStartDis(0)">反禁用</Button>
        <Button class="span-space" @click.native = "tableConfigVisible = true"><common-icon type="_table"></common-icon></Button>
        <Button @click="doOpenImport"><common-icon type="_export" :size="14"></common-icon></Button>
        <Button @click="doOpenExport"><common-icon type="_import" :size="14"></common-icon></Button>
        <Button @click="handleInitData"><common-icon type="_refresh" :size="14"/></Button>
        <a id="down_a" style="visibility: hidden"></a>
      </div>
    </div>
    <div class="main-container">
      <div class="search-container">
        <multi-select
        @on-select="handleGetCompanyIds"
        @on-visibe-change="doReset"
        placeholder="公司编号或名称"
        title="选择公司"
        type="company"
        :grop= "flag"
        :defaultValue="true"
        :width="handsomewidth"
        :isEnterpriseAdmin= "`1`"
        :data="companyParams"  :isClear="isCompanyClear">
        <Row :gutter="16" slot="search">
          <Col span="3" class="page-left-search">
            <Select v-model="companyFormId" class="clearList" @on-change="doSelect">
              <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
          <Col span="5" class="page-left-search">
            <Input  class="user-mobile" v-model="companyCodeOrName" placeholder="公司编码或名称" clearable enter-button  @on-clear="clearback"  @on-search="doSearch"></Input>
          </Col>
          <Col span="1">
              <Button  icon="ios-search" @click="doSearch" class="searched" style="padding: 3px 10px; margin-left: -16px;"></Button>
          </Col>
          <Col span="2" class="page-left-search">
            <Button @click="doReset" class="reseting">重置</Button>
          </Col>
        </Row>
      </multi-select>
        <Select class="search-select" style="margin-left: 10px" v-model="params.supplierType" @on-change="handleInitData">
          <Option :value="9">全部供应商类型</Option>
          <Option :value="0">企业</Option>
          <Option :value="1">个人</Option>
        </Select>
         <Select class="search-select" v-model="params.isInternalSupplier" @on-change="handleInitData">
          <Option :value="9">全部客户</Option>
          <Option :value="0">外部客户</Option>
          <Option :value="1">内部客户</Option>
        </Select>
        <Select class="search-select" v-model="params.isEnable" @on-change="handleInitData">
          <Option :value="9">全部数据类型</Option>
          <Option :value="1">启用</Option>
          <Option :value="0">禁用</Option>
        </Select>
        <Col span="4" class="bigupdated">
          <Input v-model="params.codeName" :maxlength="50" placeholder="供应商编码/供应商名称" clearable enter-button @on-clear="handleInitData" @on-search="handleInitData" @on-enter = "handleInitData"></Input>
        </Col>
        <Col span="1">
          <Button icon="ios-search" @click="handleInitData" class="searchButton"></Button>
        </Col>
        <Button @click="handleResetParams" class="reset">重置</Button>
      </div>
      <div style="position: relative;">
        <Spin fix v-if="tableLoading && !spinLoading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <!-- <Table
          no-data-text=""
          no-filtered-data-text=""
          class="initTable"
          :height="tableHeight"
          ref="client_selection"
          @on-selection-change="handleSelectRow"
          :columns="columns" :data="table_list"></Table> -->
        <!-- <nodata :icon-size="60" notice-text="暂无数据" v-if="!table_list.length"></nodata> -->
        <vxe-grid
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          ref="client_selection"
          :columns="columns"
          :data="table_list"
          :height="table_list.length ? tableHeight : 0"
          @select-all="handleSelectRow"
          @select-change="handleSelectRow">
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-grid>
      </div>
      <section class="page-footer">
        <div class="page-footer-lf">
          已选择<strong>{{ current_selection_row.length }}</strong>项，共{{ total }}条数据
        </div>
        <div class="page-footer-rt">
          <Page id="supplierId"
            class-name="pages"
            :total="total"
            :current="params.page.current"
            :page-size="params.page.size"
            :page-size-opts="[20, 50, 100, 500, 1000]"
            show-elevator
            show-sizer
            @on-change="handleChangePage"
            @on-page-size-change="handleChangePageSize"></Page>
          <Button  size="small" @click="goElevatorPage('supplierId')">GO</Button>
        </div>
      </section>
    </div>
    <OptionsDrawer
      v-model="visible"
      :config="config"
      :option-config="options_config"
      @close="visible = false"
      @confirm="handleConfirmOption"></OptionsDrawer>
    <CompanySelect title="选择归属公司" v-model="company_select_visible" @select="handleSelectCompany"></CompanySelect>
    <uploadModal @modalClose="isUpload = false" :isupload="isUpload" template-type="supplier"></uploadModal>
    <!-- 提示弹窗 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="del_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>确认删除该数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDeleteData">确认</Button>
        <Button  @click="handleCancelDelete">取消</Button>
      </div>
    </Modal>
    <!-- 引入客户弹窗 -->
    <Modal v-model="modalSubject" class-name="page-modal large-modal" :transfer="false" :mask-closable="false" :closable="false" width=100>
      <section class="page-header" slot='header'>
        <div class="page-header-name">引入内部供应商</div>
      </section>
      <section class="page-content">
        <!-- :max-height="subjectList.data.length ? 350 : 0" -->
        <div class="page-content-table">
          <Table highlight-row :no-data-text="null"  @on-selection-change="handleSelectRow" border ref="selection"  :columns="columns19" :data="tablelisted"
          :class="tablelisted.length ? null : 'table-height'"
          > <template slot-scope="{row, index}" slot="tableSelect">
            <div @click="handleEdit(row, index)">
              <Select v-model="row.dataTypes"  transfer style="width:200px"  @on-change="handleSave(row, index)">
                <Option v-for="item in checkList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span></span>
            </div>
          </template></Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if='!tablelisted.length'></nodata>
        </div>
      </section>
      <section slot='footer'>
        <Button type="primary" @click="doSubjectOk">确定</Button>
        <Button type="default" @click="doSubjectCancel">取消</Button>
      </section>
    </Modal>
    <!-- 禁用-->
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
        <span>{{ disable_type === 1 ? '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据' : '请确认是否要反禁用数据？'}}</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisable">确认</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
     <!-- 分配弹窗 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="distribution"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认分配</span>
      </p>
      <p>
        <span>注意：只能分配资料类型为分配型的资料，非分配型的资料将自动忽略！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="distributiondoConfirm">确定</Button>
        <Button type="default" @click="distributiondoCancel">取消</Button>
      </div>
    </Modal>
    <!--表格配置-->
    <tableConfig @close="doCloseTableConfig" :drawer="tableConfigVisible"></tableConfig>
     <!-- 新增分配 -->
    <multi-modal
      @on-select="doGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="onVisibeChange"
      :selectedValues="selectedValues"
      :value="handleModal"
      :type="type"
      :title="title"
      :data="paramse"
      :isEnterpriseAdmin= "`1`"
      ref="modalChild">
      <section slot="search">
        <Row :gutter="10">
           <Col span="3" class="page-left-search">
            <Select v-model="projectcompanyFormId" class="clearList" @on-change="newdoSelect">
              <Option v-for="item in type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
            <Col span="5" class="page-left-search">
                  <Input  class="user-mobile" v-model="paramse.codeOrName" placeholder="分配编码名称" clearable enter-button   @on-clear="newdoReset"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="doSelecting" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="newdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
      </section>
    </multi-modal>
     <!-- 资料升级 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="dataUpgrade"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认资料</span>
      </p>
      <p>
        <span>&nbsp;确定将此资料改为分配型资料吗？</span>
      </p>
      <p style="color:#F73E3E;">
        <span>&nbsp;注意此操作不可逆！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="dataUpgradeok">确定</Button>
        <Button type="default" @click="dataUpgradeCancel">取消</Button>
      </div>
    </Modal>
    <!-- 取消分配 -->
    <multi-modal
      @on-select="CancleGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="cancleonVisibeChange"
      :selectedValues="selectedValues"
      :value="canclehandleModal"
      :type="typed"
      :isEnterpriseAdmin= "`1`"
      :title="titling"
      :data="paramsed"
      ref="modalChildes">
      <section slot="search">
        <Row :gutter="10">
           <Col span="3" class="page-left-search">
            <Select v-model="backcompanyFormId" class="clearList" @on-change="backdoSelect">
              <Option v-for="item in type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
            <Col span="5" class="page-left-search">
              <Input  class="user-mobile" v-model="paramsed.codeOrName" placeholder="分配编码名称" clearable enter-button   @on-clear="backdoReset"></Input>
            </Col>
            <Col span="1">
              <Button  icon="ios-search" @click="backdoSearch" class="searchadd"></Button>
            </Col>
          <Col span="2" class="page-left-search">
            <Button @click="backdoReset" class="reseting">重置</Button>
          </Col>
        </Row>
      </section>
    </multi-modal>
    <!-- 批量建账成功提示 -->
    <batch-handle-modal
      @modalClose="doCloseBatchAccount"
      :batchHandleModal="batchHandleModal"
      :checked="checked"
      :batchhandleColumns="batchhandleColumns"
      :batchhandleData="batchhandleData"></batch-handle-modal>
  </div>
</template>

<script>
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
import multiModal from '_c/multi-modal'
import OptionsDrawer from '_c/optionsDrawer'
import CompanySelect from '_c/companySelectModal'
import nodata from '_c/nodata'
import multiSelect from '_c/multi-select'
import Mixin from '../client/mixin.js'
// import DropDownMultiSelect from '_c/drop-down-multi-select'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import batchHandleModal from '_c/batchHandleModal'
import { getHeight } from '@/libs/tools'

export default {
  name: 'supplier_index',
  components: { CommonIcon, OptionsDrawer, CompanySelect, multiSelect, multiModal, nodata, uploadModal, tableConfig, batchHandleModal },
  mixins: [ Mixin, saasMixin ],
  data () {
    return {
      tableHeight: 36,
      typed: 'cancleallocation',
      flag: true,
      // 接口参数
      paramse: {
        codeOrName: null,
        menuCode: 'supplier_index',
        isEnterpriseAdmin: 1
      },
      // 默认数据
      selectedValues: [],
      formValidate: {
        form: 0,
        company: [],
        codeOrName: ''
      },
      paramsed: {
        idList: [],
        companyFormId: '',
        codeOrName: '',
        menuCode: 'supplier_index'
      },
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      distribution_ids: [],
      projectcompanyFormId: 0,
      backcompanyFormId: 0,
      selectDatalist: [], // 引入内部客户多选的数据
      distribute: [],
      client_ids: [], // 引入内部客户
      client_code: [],
      client_companyId: [],
      client_datatypes: [],
      client_unitFormName: [],
      type: 'allocation', // 多选类型
      title: '分配公司',
      Prohibit: [], // 行分配
      dataUpgrade: false, // 资料升级
      Prohibiting: [],
      versionList: [],
      titling: '取消分配公司',
      canclehandleModal: false,
      handleModal: false, // 添加弹窗
      distribution: false, // 分配提示框
      isCompanyClear: false,
      modalSubject: false, // 模板弹出标志
      companyFormId: 0,
      currentRow: {},
      companyCodeOrName: '',
      isLoading: false,
      handsomewidth: '200px',
      company_select_visible: false,
      companyName: '',
      spinLoading: false, // 页面加载
      tableLoading: true, // 表格加载
      type_list: [
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
      params: {// 请求参数
        dataType: 1, // 0客户 1供应商
        companyList: [], // 归属公司id
        supplierType: 9, // 客户供应商类型
        isEnable: 9, // 启动标识
        codeName: '', // 编码
        isEnterpriseAdmin: 1,
        isInternalSupplier: 9,
        page: {
          size: 20,
          current: 1
        }
      },
      visible: false, // 抽屉显示
      config: {
        title: '选项',
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      },
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
      checkList: [
        {
          value: 1,
          label: '共享型'
        },
        {
          value: 2,
          label: '分配型'
        }
      ],
      columns19: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '业务单元编码',
          key: 'code'
        },
        {
          title: '业务单元名称',
          key: 'name'
        },
        {
          title: '公司',
          key: 'companyName'
        },
        {
          title: '资料类型',
          key: 'dataTypes',
          tooltip: true,
          slot: 'tableSelect'
        }
      ],
      tablelisted: [
      ],
      options_config: [
        {
          title: '控制策略',
          type: 'checkbox',
          keyName: 'control',
          keyValue: [0],
          data: [
            {
              label: '集团创建，集团共享',
              value: 0,
              hint: '集团创建，集团共享',
              disabled: true
            },
            {
              label: '公司创建，引用共享',
              value: 1
            }
          ]
        }
      ],
      column: [
        { type: 'selection',
          width: 40,
          align: 'center',
          key: 'selection',
          field: 'selection',
          fixed: 'left'
        },
        {
          title: '供应商编码',
          minWidth: 120,
          slots: {
            header: ({ row, index, column }, h) => {
              return [
                <div>
                  <span style="margin-right: 13px;">供应商编码</span>
                  <Poptip trigger="hover" content="GYS+4位流水号" class="header-icon" placement="right" transfer>
                    <Icon type="md-help-circle" size="18"/>
                  </Poptip >
                </div>
              ]
            },
            default: ({ row, index, column }, h) => {
              return [
                <div>
                  <span class="table-span" on-click={this.doLocationDetail.bind(this, 'update_supplier', { id: row.id })}>{row.code}</span>
                </div>
              ]
            }
          }
        },
        {
          title: '供应商名称',
          key: 'name',
          field: 'name',
          minWidth: 120
        },
        {
          title: '创建公司',
          key: 'companyName',
          field: 'companyName',
          minWidth: 120
        },
        { title: '供应商类型',
          minWidth: 120,
          key: 'supplierType',
          field: 'supplierType',
          slots: {
            default: (params, h) => {
              return [
                h('span', params.row.supplierType === '0' ? '企业' : '个人')
              ]
            }
          }
        },
        {
          title: '内部供应商',
          key: 'isInternalSupplier',
          field: 'isInternalSupplier',
          minWidth: 120,
          slots: {
            default: (params, h) => {
              return [
                h('span', params.row.isInternalSupplier === '0' ? '否' : '是')
              ]
            }
          }
        },
        {
          title: '资料类型',
          key: 'dataTypes',
          field: 'dataTypes',
          minWidth: 120
        },
        {
          title: '创建人',
          minWidth: 120,
          key: 'creatorName',
          field: 'creatorName'
        },
        {
          title: '创建时间',
          minWidth: 150,
          key: 'createTime',
          field: 'createTime'
        },
        {
          title: '身份证',
          minWidth: 150,
          key: 'idCardNum',
          field: 'idCardNum'
        },
        {
          title: '经营地址',
          minWidth: 120,
          key: 'businessAddress',
          field: 'businessAddress'
        },
        {
          title: '联系电话',
          minWidth: 120,
          key: 'contactNumber',
          field: 'contactNumber'
        },
        {
          title: '统一社会信用代码',
          minWidth: 150,
          key: 'unifiedSocialCreditCode',
          field: 'unifiedSocialCreditCode'
        },
        {
          title: '联系人',
          minWidth: 120,
          key: 'linkman',
          field: 'linkman'
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
          title: '关联内部公司',
          minWidth: 120,
          key: 'innerCompanyName',
          field: 'innerCompanyName'
        },
        {
          title: '数据状态',
          minWidth: 120,
          key: 'isEnable',
          field: 'isEnable',
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
          title: '操作',
          minWidth: 240,
          key: 'control',
          field: 'control',
          fixed: 'right',
          align: 'left',
          slots: {
            default: (params, h) => {
              return [
                <div>
                  <span class="table-span table-right" on-click={this.handleDelRow.bind(this, params.row)}>删除</span>
                  <span class="table-span" on-click={this.handleDisableRow.bind(this, params.row)}>{ params.row.isEnable === 1 ? '禁用' : '反禁用'}</span>
                  <span class="table-span" v-show={ params.row.isEnable !== 0 && params.row.dataTypes === '分配型'} on-click={ this.distributionadd.bind(this, params.row)} >&nbsp;&nbsp;分配</span>
                  <span class="table-span" v-show={ params.row.isEnable !== 0 && params.row.dataTypes === '分配型'} on-click={ this.undistribution.bind(this, params.row)}>&nbsp;&nbsp;取消分配</span>
                  <span class="table-span" v-show={ params.row.isEnable !== 0 && params.row.dataTypes === '私有型' } on-click={ this.upgrade.bind(this, params.row)}>&nbsp;&nbsp;升级</span>
                </div>
              ]
            }
          }
        }
      ]
    }
  },
  mounted () {
    this.spinLoading = true
    this.handleInitData()
    this.internalcustomers()
    setTimeout(() => { this.spinLoading = false }, 1000)
  },
  activated () {
    if (this.$store.state.user.isRefreshTable) {
      this.handleInitData()
      this.$store.commit('setIsRefreshTable', false)
    }
  },
  methods: {
    doSelecting () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramse.companyFormId,
        coderOrName: this.paramse.codeOrName
      }
      this.$refs.modalChild.doModalInit(obj)
    },
    newdoReset () {
      this.projectcompanyFormId = 0
      this.paramse.codeOrName = ''
      let obj = {
        companyFormId: null,
        codeOrName: ''
      }
      this.paramse.companyFormId = null
      this.$refs.modalChild.doModalInit(obj)
    },
    // newdoReset () {
    //   this.paramse.companyFormId = 0
    //   let obj = {
    //     companyFormId: this.paramse.companyFormId = '',
    //     coderOrName: this.paramse.codeOrName = ''
    //   }
    //   this.$refs.modalChild.doModalInit(obj)
    // },
    // newdoSelect () {
    //   let obj = {
    //     companyFormId: this.paramse.companyFormId
    //     // coderOrName: this.paramse.codeOrName
    //   }
    //   this.$refs.modalChild.doModalInit(obj)
    // },
    newdoSelect () {
      this.paramse.companyFormId = this.projectcompanyFormId === 0 ? null : this.projectcompanyFormId
      let obj = {
        companyFormId: this.projectcompanyFormId === 0 ? null : this.projectcompanyFormId,
        codeOrName: ''
      }
      this.$refs.modalChild.doModalInit(obj)
    },
    backdoReset () {
      this.backcompanyFormId = 0
      this.paramsed.codeOrName = ''
      this.paramsed.companyFormId = null
      let obj = {
        companyFormId: null,
        codeOrName: ''
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    backdoSelect () {
      this.paramsed.companyFormId = this.backcompanyFormId === 0 ? null : this.backcompanyFormId
      let obj = {
        companyFormId: this.backcompanyFormId === 0 ? null : this.backcompanyFormId
        // coderOrName: this.paramse.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    // backdoReset () {
    //   this.paramsed.companyFormId = 0
    //   let obj = {
    //     companyFormId: this.paramsed.companyFormId = '',
    //     coderOrName: this.paramsed.codeOrName = ''
    //   }
    //   this.$refs.modalChildes.doModalInit(obj)
    // },
    // backdoSelect () {
    //   let obj = {
    //     companyFormId: this.paramsed.companyFormId
    //     // coderOrName: this.paramse.codeOrName
    //   }
    //   this.$refs.modalChildes.doModalInit(obj)
    // },
    backdoSearch () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramsed.companyFormId,
        codeOrName: this.paramsed.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
      // this.$set(this.paramse, 'codeOrName', this.paramse.codeOrName)
    },
    // 资料升级
    upgrade (val) {
      this.dataUpgrade = true
      console.log(val, 'row')
      this.currentRow = val
      console.log(this.currentRow.id, '000')
    },
    dataUpgradeok () {
      this.dataUpgrade = false
      this.internalupgrade()
      // let _index = this.table_list.findIndex(n => n.id === this.currentRow.id)
      // console.log(_index, '990')
      // if (_index > -1) {
      //   this.table_list[_index].dataTypes = '分配型'
      // }
      // console.log(this.table_list, '99')
      // this.changetype = '分配型'
    },
    internalupgrade () {
      let req = {
        id: this.currentRow.id,
        dataType: 1,
        version: this.currentRow.version,
        updateTime: this.currentRow.updateTime
      }
      // http://192.168.1.167:8183
      this.$request.post('/financeback/customerSupplier/upGradeById', req).then(res => {
        console.log(res.data, '74923')
        if (res.data.code === 200) {
          let _index = this.table_list.findIndex(n => n.id === this.currentRow.id)
          console.log(_index, '990')
          if (_index > -1) {
            this.table_list[_index].dataTypes = '分配型'
            this.$Message.warning('升级成功')
            this.handleInitData()
          }
          console.log(this.tablelisted, '升级')
        } else {
          this.$Message.warning('数据已变更,请重新刷新操作')
        }
      })
    },
    dataUpgradeCancel () {
      this.dataUpgrade = false
    },
    cancleonVisibeChange (val) {
      // this.modalShow = false
      this.canclehandleModal = false
    },
    // 监听选择取消分配公司组件接口
    CancleGetDataList (selectedList) {
      var selectedListed = []
      console.log(selectedList, '选择分配')
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      console.log(selectedList, '选择取消分配')
      this.canclehandleModal = false
      let req = {
        idS: this.Prohibiting,
        versions: this.versionList,
        companyList: selectedListed,
        dataType: 1
      }
      this.$request.post('/financeback/customerSupplier/cancelBatchCustomerSupplierUseCompany', req).then(res => {
        if (res.data.code === 200) {
          console.log(res, '23456')
          if (res.data.data.failList && res.data.data.failList.length === 0) {
            this.$Message.warning('取消分配成功')
          }
          if (res.data.data.successList && res.data.data.successList.length === 0) {
            this.$Message.warning('公司已经发生业务数据，无法取消分配')
          }
          if (res.data.data.failList.length > 0 && res.data.data.successList.length > 0) {
            this.doallocationClosed(res.data.data)
          }
          this.handleInitData()
          this.Prohibiting = []
          this.versionList = []
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    doallocationClosed (data) {
      if (data) {
        this.batchHandleModal = true
        this.checked = `取消分配成功${data.successList.length}条,失败${data.failList.length}条`
        let _arr = []
        data.failList.map(tmp => {
          this.table_list.map(item => {
            if (tmp.businessId === item.id) {
              _arr.push({
                sort: item.id,
                customerName: item.name,
                desc: tmp.referenceDescription
              })
            }
          })
        })
        this.batchhandleData = _arr
      }
      this.showDelete = false
    },
    // 行分配
    distributionadd (row) {
      this.Prohibit = []
      console.log(row, '11')
      this.Prohibit.push(row.id)
      this.handleModal = true
    },
    // 行取消分配
    undistribution (row) {
      if (row.useCompanyIdString) {
        this.paramsed.idList = row.useCompanyIdString.split(',')
        var idList = this.paramsed.idList.map((item, index) => {
          return item - 0
        })
        this.paramsed.idList = idList
        console.log(this.paramsed.idList, '111')
      } else {
        this.paramsed.idList = []
      }
      console.log(row.id, '666')
      // if (row.id) {
      //   this.paramsed.idList.push(row.id)
      //   console.log(this.paramsed.idList, '111')
      // } else {
      //   this.paramsed.idList = []
      // }
      // this.Prohibiting = row.id
      this.Prohibiting = []
      this.Prohibiting.push(row.id)
      this.versionList = []
      this.versionList.push(row.version)
      this.canclehandleModal = true
    },
    internalcustomers () {
      let req = {
        // unitFormId: this.formValidate.form,
        codeOrName: this.formValidate.codeOrName,
        isEnterpriseAdmin: 1,
        dataType: 1
      }
      this.$request.post('/financeback/businessUnit/findBusinessUnitList', req).then(res => {
        console.log(res, '74923')
        if (res.data.code === 200) {
          this.tablelisted = res.data.data
          console.log(this.tablelisted, '引入内部客户')
          this.getListIds({ ids: this.tablelisted.map(n => { return n.id }), name: 'supplier' })
          let that = this
          this.tablelisted.forEach(item => {
            // if (item.dataTypes === 1) {
            //   item.dataTypes = '共享型'
            //   console.log(item.dataTypes)
            // }
            that.selectDatalist.forEach(i => {
              if (item.id === i.id) {
                that.$set(item, '_checked', true)
              }
            })
          })
        }
      })
    },
    // 监听删除弹窗关闭
    // doDeleteClose (data) {
    //   if (data) {
    //     this.batchList = []
    //     this.sucLen = data.successList.length
    //     this.errLen = data.failList.length
    //     this.batchList = data.failList
    //     this.checked = '成功' + this.sucLen + '条,失败' + this.errLen + '条'
    //     this.batchHandleModal = true
    //     this.handleInitData()
    //     this.selectData = []
    //   }
    //   this.showDelete = false
    // },
    doDeleteClose (data) {
      if (data) {
        this.batchHandleModal = true
        this.checked = `分配成功${data.successList.length}条,失败${data.failList.length}条`
        let _arr = []
        data.failList.map(tmp => {
          this.table_list.map(item => {
            if (tmp.businessId === item.id) {
              _arr.push({
                sort: item.id,
                customerName: item.name,
                desc: tmp.referenceDescription
              })
            }
          })
        })
        this.batchhandleData = _arr
      }
      this.showDelete = false
    },
    resetrefresh () {
    },
    searchOrMatch () {},
    changeOrMatch () {},
    // modal弹框显隐回调方法
    onVisibeChange (val) {
      // this.modalShow = false
      this.handleModal = false
    },
    // 监听选择分配公司组件接口
    doGetDataList (selectedList) {
      console.log(selectedList, '选择')
      var selectedListed = []
      console.log(selectedList, '选择分配')
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      this.handleModal = false
      let req = {
        idS: this.Prohibit,
        companyList: selectedListed,
        dataType: 1
      }
      this.$request.post('financeback/customerSupplier/updateBatchCustomerSupplierUseCompany', req).then(res => {
        if (res.data.code === 200) {
          console.log(res, '22')
          this.Prohibit = []
          this.doDeleteClose(res.data.data)
        }
      })
    },
    // 清空
    isCheck (val) {
      this.$emit('on-clear', val)
    },
    // 分配确认
    distributiondoConfirm () {
      this.distribution = false
      this.handleModal = true
    },
    // 分配取消
    distributiondoCancel () {
      this.distribution = false
    },
    doAddChecked () {
      this.current_selection_row.map(item => {
        this.distribution_ids.push(item.id)
        console.log(this.distribution_ids, '22')
      })
      if (this.current_selection_row && this.current_selection_row.length > 0) {
        // 资料类型 1.共享型,2.分配型,3.私有型
        // 分配类型
        let distribute = this.current_selection_row.filter(item => item.dataTypes === '分配型').length
        if (distribute === this.current_selection_row.length) {
          // 大弹窗
          this.handleModal = true
        } else {
          // 确定取消弹窗
          this.distribution = true
        }
      } else {
        this.$Message.warning('请选择至少一行数据后再操作')
        return false
      }
    },
    handleEdit (row, index) {
      this.editIndex = index
    },
    handleSave (row, index) {
      this.client_datatypes.push(row.dataTypes)
      // this.editIndex = '-1'
      console.log(row)
    },
    // 更过科目模板取消按钮
    doSubjectCancel () {
      this.modalSubject = false
      // this.$Message.error('已取消')
    },
    // 更多模板初始化数据
    doSubJectInit () {
      this.client_datatypes = []
      this.client_ids = []
      this.client_code = []
      this.client_unitFormName = []
      this.client_companyId = []
      this.internalcustomers()
      this.modalSubject = true
    },
    // 内部客户确认按钮
    doSubjectOk () {
      if (!this.current_selection_row.length) {
        this.$Message.warning('请选择至少一行数据后再操作')
        return false
      }
      console.log(this.current_selection_row, '000')
      this.current_selection_row.map(item => {
        this.client_ids.push(item.id)
        this.client_code.push(item.code)
        this.client_unitFormName.push(item.name)
        this.client_datatypes.push(item.dataTypes)
        this.client_companyId.push(item.companyId)
      })
      console.log(this.client_datatypes, '数据状态类型')
      this.InternalConfirmSave()
      this.modalSubject = false
    },
    // 内部客户确定保存
    InternalConfirmSave () {
      let req = {
        dataType: 1, // 数据类型客户0
        companyId: 0, // 创建公司id集团
        supplierType: 0, // 企业
        isEnterpriseAdmin: 1, // 管理员
        isInternalSupplier: 1, // 是内部客户
        names: this.client_unitFormName, // 客户名称数组
        codes: this.client_code, // 编码数组
        dataTypeList: this.client_datatypes, // 资料类型数组
        innerCompanyIds: this.client_companyId // 公司id数组
      }
      // http://192.168.1.217:8183
      this.$request.post('/financeback/customerSupplier/batchAddCustomerSupplier', req).then(res => {
        if (res.data.code === 200) {
          this.changed = false
          this.$Message.success('新增成功！')
          this.current_selection_row = []
          // this.handleInitData()
          // this.selectDatalist = []
          // this.$refs.formValidate.resetFields()
        } else {
          this.$Message.warning('新增失败！')
        }
      })
    },
    // doSelect () { // 下拉选择框
    //   this.$set(this.paramsList, 'companyFormId', this.companyFormId)
    // },
    // doSearch () { // input搜索内容框
    //   this.$set(this.paramsList, 'codeOrName', this.companyCodeOrName)
    // },
    // doReset () { // 重置按钮
    //   this.companyFormId = 0
    //   this.companyCodeOrName = ''
    //   this.paramsList = {}
    // },
    doSelect () {
      if (this.companyFormId) {
        this.flag = false
        console.log('89')
      } else {
        this.flag = true
      }
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    clearback () {
      this.flag = true
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    doSearch () {
      if (this.companyCodeOrName === '0000') {
        this.flag = true
        console.log('89')
      } else {
        this.flag = false
      }
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    doReset () {
      this.flag = true
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$set(this.companyParams, 'companyFormId', null)
      this.$set(this.companyParams, 'codeOrName', '')
    },
    getClear () {
      this.isClear = false
    },
    // handleGetCompanyIds (ids) {
    //   this.params.companyList = ids
    //   this.handleInitData()
    // },
    handleGetCompanyIds (ids) {
      this.isCompanyClear = false
      this.params.companyList = ids
      var companyIds = []
      // console.log(this.formValidate.companyIds, '220')
      this.params.companyList.forEach(item => {
        // console.log(JSON.parse(item).id, '000')
        this.params.companyList = JSON.parse(item.id)
        companyIds.push(this.params.companyList)
        this.params.companyList = companyIds
        // console.log(JSON.parse(item).id)
      })
      this.handleInitData()
    },
    ...mapMutations([
      'getListIds'
    ]),
    handleInitData () {
      this.tableLoading = true
      this.$request.post('/financeback/customerSupplier/findCustomerSupplierPage', {
        ...this.params,
        isEnable: this.params.isEnable === 9 ? '' : this.params.isEnable,
        supplierType: this.params.supplierType === 9 ? '' : this.params.supplierType,
        isInternalSupplier: this.params.isInternalSupplier === 9 ? '' : this.params.isInternalSupplier
      }).then(res => {
        this.tableLoading = false
        if (res.data.code === 200) {
          if (this.params.page.current > 1 && !res.data.data.records.length) {
            --this.params.page.current
            return this.handleInitData()
          }
          this.table_list = res.data.data.records
          res.data.data.records = res.data.data.records.map(item => Object.assign(item, item.manageInfo))
          this.table_list.forEach((item) => {
            if (item.dataTypes === '3') {
              item.dataTypes = '私有型'
            }
            if (item.dataTypes === '2') {
              item.dataTypes = '分配型'
            }
            if (item.dataTypes === '1') {
              item.dataTypes = '共享型'
            }
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
          this.getListIds({ ids: this.table_list.map(item => item.id), name: 'supplier' })
          this.total = res.data.data.total
          this.tableHeight = this.table_list.length ? getHeight(65) : 36
        } else {
          this.table_list = []
          this.total = 0
        }
      })
    },
    // 重置筛选项
    handleResetParams () {
      this.params.companyList = []
      this.params.supplierType = 9
      this.params.isInternalSupplier = 9
      this.params.codeName = ''
      this.params.isEnable = 9
      this.handleInitData()
      this.isCompanyClear = true
      this.isCompanyClear = true
    },
    // 跳转查看页面
    doGetDetailsData ({ row }) {
      if (row.id) {
        this.doLocationDetail.bind(this, 'update_supplier', { id: row.id })
      } else {
        this.$Message.warning('无当前供应商信息！')
      }
    },
    // 跳转新增页面
    handleAddClient () {
      this.$router.push({ path: 'supplier_create' })
    },
    // 选中归属公司
    handleSelectCompany (row) {
      if (row) {
        this.companyName = row.name
      }
      this.company_select_visible = false
    },
    handleConfirmOption (params) {
      console.log(params)
    }
  }
}
</script>

<style lang="less">
  @import "../client/client_supplier";
</style>
