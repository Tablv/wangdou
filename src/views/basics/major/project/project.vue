<template>
  <div class = "project">
    <!-- 头部导航 -->
      <Spin fix v-if="spinLoading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
   <section class="page-header">
      <div class="page-header-name">项目列表</div>
      <div class="page-header-actions">
          <Button type="primary" @click="goCreate">新增</Button>
        <Button class="span-space" @click="doDelCheckList">删除</Button>
          <Button @click="doAddCheck">分配</Button>
          <Button @click="doBacthDisable">禁用</Button>
          <Button @click="doBacthUnDisable">反禁用</Button>
          <!-- <Button @click="visible = !visible" type="primary">选项</Button> -->
          <Button @click.native="doClickExport">
          <!-- 导入 -->
          <common-icon type="_export"  :size="14"></common-icon>
        </Button>
        <Button @click ="doClickDown">
          <!-- 导出 -->
          <common-icon type="_import"  :size="14"></common-icon>
        </Button>
        <Button class="span-space"  @click="doClickConfig">
          <!-- 表格配置 -->
          <common-icon type="_table"></common-icon>
        </Button>
        <Button icon="md-refresh" @click="doRefresh"></Button>
      </div>
    </section>
    <!-- 头部导航结束 -->
     <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class="screen">
            <Col span="4" class="first-nospace">
              <multi-select
                @on-select="handleGetCompanyIds"
                @on-visibe-change="doReset"
                placeholder="公司编号或名称"
                title="选择公司"
                type="company"
                :grop= "flag"
                :defaultValue="true"
                :isEnterpriseAdmin= "`1`"
                :width="`100%`"
                :data="companyParams"  :isClear="isCompanyClear">
                <Row :gutter="16" slot="search">
                  <Col span="3" class="page-left-search">
                    <Select v-model="companyFormId" class="clearList" @on-change="doSelect">
                      <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                  </Col>
                  <Col span="5" class="page-left-search">
                    <Input  class="user-mobile" v-model="companyCodeOrName" placeholder="公司编码或名称" clearable enter-button  @on-clear="doReset"  @on-search="doSearch"></Input>
                  </Col>
                  <Col span="1">
                    <Button  icon="ios-search" @click="doSearch" class="searched"></Button>
                  </Col>
                  <Col span="2" class="page-left-search">
                    <Button @click="doReset" class="reseting">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="2">
              <Select v-model="formValidate.isEnable" @on-change='typeChange()' placeholder="全部数据类型">
                 <Option v-for="(item,isEnable) in typeListed" :value="item.id" :key="isEnable">{{item.babel}}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Input v-model="formValidate.codeOrName" :maxlength="50" placeholder="请输入项目编码/项目名称" clearable enter-button @on-clear="queryItemList" @on-search="queryItemList" @on-enter = "queryItemList"></Input>
            </Col>
            <Col span="1">
              <Button icon="ios-search" @click="queryItemList" class="searchButton"></Button>
            </Col>
            <Col span="1">
              <Button @click="doHandleReset" class="reset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>

    <!-- 表格 -->
     <div class="page-content-table">
        <Spin fix v-if="tableLoading && !spinLoading">
        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
        <div>正在载入数据</div>
      </Spin>
        <!-- <Table ref="currentRowTable"
        :height="tableHeight"
        :columns="columns4"
        :data="tablelist"
        @on-selection-change="doSelectTableData"></Table> -->
        <vxe-grid
          :resizable="false"
          ref="currentRowTable"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          :columns="columns4"
          :data="tablelist"
          :height="tablelist.length ? tableHeight : 0"
          @select-all="doSelectTableData"
          @select-change="doSelectTableData">
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-grid>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="tablelist.length === 0"></nodata>
      </div>
    </section>
       <section class="page-footer" v-if="tablelist.length!==0">
      <div class="page-footer-lf">
        已选择<strong>{{dataCount}}</strong>项，共{{total}}条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="projectPageId"
          class-name="pages"
          :total="total"
          :current="current"
          :page-size="size"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="handleChangePage"/>
        <Button  size="small" @click="goElevatorPage('projectPageId')">Go</Button>
      </div>
    </section>
    <!-- 抽屉 -->
     <!-- <OptionsDrawer
      v-model="visible"
      :config="config"
      :option-config="options_config"
      @close="visible = false"
      @confirm="handleConfirmOption"></OptionsDrawer> -->
      <!-- 禁用提示 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disableModalShow"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认禁用</span>
      </p>
      <p>
        <span>禁用后将不能在新增数据中使用！请确认是否要禁用数据</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalDisableOk">确定</Button>
        <Button type="default" @click="doModalDisableCancel">取消</Button>
      </div>
    </Modal>
    <!-- 行禁用 -->
      <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disableline"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认禁用</span>
      </p>
      <p>
        <span>请确认是否要禁用当前数据,禁用后该条资料不可使用</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="disablelineOk">确定</Button>
        <Button type="default" @click="disablelineCancel">取消</Button>
      </div>
    </Modal>
     <!-- 反禁用提示 -->
       <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="unDisableModalShow"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认反禁用</span>
      </p>
      <p>
        <span>请确认是否要反禁用当前数据,反禁用后该条资料可使用
   </span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="sureModalDisableOk">确定</Button>
        <Button type="default" @click="dealModalDisableCancel">取消</Button>
      </div>
    </Modal>
       <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="returnDisableModalShow"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认反禁用</span>
      </p>
      <p>
        <span>请确认是否要反禁用当前数据,反禁用后该条资料可使用</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="returnDisableModalShowOk">确定</Button>
        <Button type="default" @click="returnDisableModalShowCancel">取消</Button>
      </div>
    </Modal>
    <!-- <projectlist closable @modalClose="assignClose" @selectCompany="doGetCompanyList" :assignModal="assignModal" :titleName="titleName"></projectlist> -->
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" ref="upload" template-type="project"></upload-modal>
     <!-- 删除弹窗 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="accountModal"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认删除</span>
      </p>
      <p>
        <span>请确认是否要删除当前数据,删除后该条资料不可恢复</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doConfirm">确定</Button>
        <Button type="default" @click="doCancel">取消</Button>
      </div>
    </Modal>
        <!-- 分配弹窗 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="distribution"
      class-name="reminder-modal">
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
      <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="deleteaccountModal"
      class-name="reminder-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>确认删除</span>
      </p>
      <p>
        <span>请确认是否要删除当前数据，删除后该条资料不可恢复</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="deleteaccountModalok">确定</Button>
        <Button type="default" @click="deleteaccountModalCancel">取消</Button>
      </div>
    </Modal>
    <!-- 资料升级 -->
     <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="dataUpgrade"
      class-name="reminder-modal">
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
     <!-- 新增分配 -->
    <multi-modal
      @on-select="doGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="onVisibeChange"
      :selectedValues="selectedValues"
      :value="handleModal"
      :type="type"
      :title="title"
      :isEnterpriseAdmin= "`1`"
      :data="paramse"
      ref="modalChild">
      <section slot="search">
        <Row :gutter="10">
           <Col span="3" class="page-left-search">
            <Select v-model="projectcompanyFormId" class="clearList" @on-change="newdoSelect">
              <Option v-for="item in type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
            <Col span="5" class="page-left-search">
                  <Input class="user-mobile" v-model="paramse.codeOrName" placeholder="分配编码名称" clearable enter-button @on-clear="doSearching"  @on-search="doSearching"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="doSearching" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="newdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
        <!-- <Input style="width: 250px" search v-model="paramse.codeOrName" placeholder="分配编码/名称" @on-search="searchOrMatch" @on-change="changeOrMatch"></Input> -->
      </section>
    </multi-modal>
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
                  <Input  class="user-mobile" v-model="paramsed.codeOrName" placeholder="分配编码名称" clearable enter-button @on-clear="backdoReset"  @on-search="backdoSearch"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="backdoSearch" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="backdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
        <!-- <Input style="width: 250px" search v-model="paramse.codeOrName" placeholder="分配编码/名称" @on-search="searchOrMatch" @on-change="changeOrMatch"></Input> -->
      </section>
    </multi-modal>
    <table-config @close="doTableClose" :drawer="drawer" ></table-config>
      <!-- 批量操作详细弹窗 -->
      <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchList"></batch-handle-modal>
      <a id="a_id"></a>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import UploadModal from '_c/uploadModal/uploadModal.vue'
import multiSelect from '_c/multi-select'
// import OptionsDrawer from '_c/optionsDrawer'
import { mapMutations } from 'vuex'
import multiModal from '_c/multi-modal'
import { saasMixin } from '@/libs/mixins.js'
import { sortArr, getHeight } from '@/libs/tools.js'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
// import deleteModal from '_c/deleteModal/deleteModal.vue'
// import projectlist from '_c/projectlist/projectlist.vue'
// import { session } from '@/libs/location.js'
import nodata from '_c/nodata'
// import DropDownMultiSelect from '_c/drop-down-multi-select'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
export default {
  name: 'project_index',
  components: {
    CommonIcon,
    // OptionsDrawer,
    tableConfig,
    // deleteModal,
    // projectlist,
    nodata,
    multiModal,
    multiSelect,
    batchHandleModal,
    // DropDownMultiSelect,
    UploadModal
  },
  data () {
    return {
      batchhandleColumns: [ // 批量建账成功提示的表头
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
        // {
        //   type: 'index',
        //   title: '序号',
        //   width: 60,
        //   align: 'center',
        //   className: 'table-index'
        // },
        // {
        //   title: '业务ID',
        //   key: 'businessId'
        // },
        // {
        //   title: '失败原因描述',
        //   key: 'referenceDescription'
        // }
      ],
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
      type: 'allocation', // 多选类型
      typed: 'cancleallocation',
      currentRow: {},
      isEnterpriseAdmin: 1,
      handleModal: false, // 添加弹窗
      canclehandleModal: false,
      flag: true,
      title: '分配公司',
      titling: '取消分配公司',
      spinLoading: false, // 页面加载
      // isEnterpriseAdmin: 1,
      tableLoading: true, // 表格加载
      selectedValues: [], // 默认数据
      versionId: [],
      versions: [],
      allprohibit: [],
      deleated: [],
      Prohibitlist: [],
      Prohibitlistback: [],
      paramse: {
        codeOrName: '',
        companyFormId: null,
        menuCode: 'project_index',
        isEnterpriseAdmin: 1
      }, // 接口参数
      paramsed: {
        idList: [],
        companyFormId: null,
        codeOrName: '',
        menuCode: 'project_index'
        // isEnterpriseAdmin: 1
      },
      batchHandleModal: false, // 批量操作弹窗
      isCompanyClear: false,
      projectcompanyFormId: 0,
      backcompanyFormId: 0,
      companyFormId: 0,
      companyCodeOrName: '',
      sucLen: 0, // 批量操作成功条数
      errLen: 0, // 批量操作失败条数
      // handsomewidth: '280px',
      batchList: [], // 批量操作数组
      // checked: null, // 批量建账成功提示的check
      modalDetail: false,
      alertConfig: false,
      loading: false,
      // templateType: '',
      delId: [],
      backdisable: [],
      companyParams: {
        companyFormId: '',
        codeOrName: ''
      },
      tableHeight: 0,
      isupload: false, // 导入弹窗
      Prohibit: [],
      distribute: [],
      selection: [],
      backprohibit: [],
      Prohibiting: '',
      version_id: '',
      distribution: false, // 分配提示框
      dataUpgrade: false, // 资料升级
      accountModal: false, // 删除提示框
      deleteaccountModal: false, // 删除提示框
      isHover: false,
      titleName: '选择创建公司', // 子组件选择公司的modal的名字
      // assignModal: false, // 是否显示分配弹窗
      selectData: [], // 多选的数据
      current: 1, // 页码
      size: 20, // 每页显示的数据个数
      disableModalShow: false, // 禁用提示
      disableline: false,
      unDisableModalShow: false, // 反禁用提示
      returnDisableModalShow: false,
      isAllDisable: false, // 是否为批量禁用
      visible: false, // 抽屉显示
      showDelete: false, // 删除弹窗是否显示
      // height: getHeight(83),
      config: {
        title: '选项',
        width: 300,
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      },
      // params: {
      //   isEnterpriseAdmin: 1
      // },
      options_config: [
        {
          title: '控制策略',
          type: 'checkbox',
          keyName: 'control',
          keyValue: [],
          data: [
            {
              label: '集团创建，集团共享',
              value: 0,
              hint: '这是集团创建'
            },
            {
              label: '公司创建，引用共享',
              value: 1,
              hint: '这是集团创建'
            }
          ]
        }
      ],
      // value1: false,
      showTableSetter: false,
      modal5: false,
      typeList: [
        {
          id: 0,
          babel: '全部形态'

        },
        {
          id: 1,
          babel: '总部'

        }
      ],
      typeListed: [
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
        fixed: 'left',
        width: 40,
        align: 'center'
      },
      code: {
        title: '编码',
        key: 'code',
        field: 'code',
        minWidth: 120,
        slots: {
          default: ({ row, index, column }, h) => {
            return [
              <span class="table-span" on-click={this.doLocationDetail.bind(this, 'update_project', { id: row.id })}>{row.code}</span>
            ]
          },
          header: ({ row, index, column }, h) => {
            return [
              <div>
                <span style="margin-right: 13px;">编码</span>
                <Poptip trigger="hover" content="XM+公司编码+4位流水号" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            ]
          }
        }
      },
      columns: [
        {
          title: '名称',
          key: 'name',
          field: 'name',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '资料类型',
          key: 'dataType',
          field: 'dataType',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '创建公司',
          key: 'companyName',
          field: 'companyName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '负责部门',
          key: 'departmentName',
          field: 'departmentName',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '负责人',
          key: 'personInChargeName',
          field: 'personInChargeName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '手机号',
          key: 'mobile',
          field: 'mobile',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '开始日期',
          key: 'startDate',
          field: 'startDate',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '验收日期',
          key: 'inspectionDate',
          field: 'inspectionDate',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '创建人',
          key: 'creatorName',
          field: 'creatorName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          field: 'createTime',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '禁用人',
          key: 'disabledUserName',
          field: 'disabledUserName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '禁用时间',
          key: 'disabledTime',
          field: 'disabledTime',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '反禁用人',
          key: 'enabledUserName',
          field: 'enabledUserName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '反禁用时间',
          key: 'enabledTime',
          field: 'enabledTime',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '修改人',
          key: 'updatorName',
          field: 'updatorName',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '修改时间',
          key: 'updateTime',
          field: 'updateTime',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '备注',
          key: 'remark',
          field: 'remark',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '数据状态',
          key: 'isEnable',
          field: 'isEnable',
          minWidth: 120,
          tooltip: true,
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
                <span class="table-span table-span-active" on-click={ this.doDeletelist.bind(this, { row }) }>删除</span>
                <span class="table-span table-span-active" v-show={ row.isEnable !== 0 } on-click={ this.doProhibit.bind(this, { row }) }>禁用</span>
                <span class="table-span table-span-active" v-show={ row.isEnable === 0 } on-click={ this.unProhibit.bind(this, { row }) }>反禁用</span>
                <span class="table-span table-span-active" v-show={ row.isEnable !== 0 && row.dataType === '分配型' } on-click={ this.distributionadd.bind(this, { row }) }>分配</span>
                <span class="table-span table-span-active" v-show={ row.isEnable !== 0 && row.dataType === '分配型' } on-click={ this.undistribution.bind(this, { row }) }>取消分配</span>
                <span class="table-span table-span-active" v-show={ row.isEnable !== 0 && row.dataType === '私有型' } on-click={ this.upgrade.bind(this, { row }) }>升级</span>
              </div>
            ]
          }
        }
      },
      tablelist: [
      ],
      rootEnterpriseId: '', // JSON.parse(session.getItem('userInfo')).rootEnterpriseId
      formInit: 0,
      checked: null, // 批量建账成功提示的check
      dataCount: 0, // 选中的数据个数
      total: null, // 数据总数
      selectedListed: [],
      modal10: false, // 公司输入框的弹出层
      reminderModal: false, // 点击删除的弹窗
      selMore: false, // 多选删除功能
      rowInTabel: {},
      showCompanies: false,
      showImportModal: false,
      drawer: false,
      // modalId: 'pageId',
      selectMore: [],
      ok: true,
      currentSelectList: [],
      useCompanyArr: [],
      tableData: [],
      formValidate: {
        isEnable: '',
        isEnterpriseAdmin: 1,
        companyIds: [],
        // companyId: '',
        codeOrName: '',
        useCompanyIds: []
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
      tableColumn: [
        {
          type: 'selection',
          width: 44,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code',
          className: 'primary',
          tooltip: true,
          render: (h, { row, index, column }) => {
            return (
              <span class="table-span" on-click={this.doLocationDetail.bind(this, row)}>{row.code}</span>
            )
          }

        },
        {
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '形态',
          key: 'status',
          tooltip: true
        },
        {
          title: '归属公司',
          key: 'companyId',
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          // fixed: 'right',
          width: 150,
          align: 'center',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" on-click={this.doDeleteBusinessUnit.bind(this, { row, index, column })}>选择</span>
              </div>
            )
          }
        }
      ]
    }
  },
  mixins: [saasMixin],
  watch: {
    selectData (data, oldData) {
      this.datacount = this.selectData.length
    }
  },
  mounted () {
    this.spinLoading = true
    this.doGettableHeader()
    this.queryItemList()
    setTimeout(() => { this.spinLoading = false }, 1000)
  },
  // activated () {
  //   if (this.$store.state.user.isRefreshTable) {
  //     this.queryItemList()
  //     this.$store.commit('setIsRefreshTable', false)
  //   }
  // },
  methods: {
    // 资料升级
    upgrade (val) {
      this.dataUpgrade = true
      this.currentRow = val
    },
    dataUpgradeok () {
      this.dataUpgrade = false
      this.internalupgrade()
    },
    internalupgrade () {
      let req = {
        id: this.currentRow.row.id,
        dataType: 2,
        version: this.currentRow.row.version,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/upgradeDataType', req).then(res => {
        if (res.data.code === 200) {
          let _index = this.tablelist.findIndex(n => n.id === this.currentRow.row.id)
          if (_index > -1) {
            this.tablelist[_index].dataType = '分配型'
            this.$Message.warning('升级成功')
          }
          this.queryItemList()
        } else {
          this.$Message.warning('数据已变更,请重新刷新操作')
        }
      })
    },
    dataUpgradeCancel () {
      this.dataUpgrade = false
    },
    resetrefresh () {
    },
    searchOrMatch () {},
    changeOrMatch () {},
    // 清空
    isCheck (val) {
      this.$emit('on-clear', val)
    },
    // modal弹框显隐回调方法
    onVisibeChange (val) {
      this.handleModal = false
    },
    cancleonVisibeChange (val) {
      this.canclehandleModal = false
    },
    // 监听选择分配公司组件接口
    doGetDataList (selectedList) {
      this.useCompanyArr = []
      for (let val of this.selectData) {
        this.Prohibitlistback.push(val.id)
        this.versions.push(val.version)
        this.useCompanyArr.push(val.id)
        this.ok = true
      }
      if (this.ok === true) {
        this.useCompanyArr = []
        selectedList.forEach(item => {
          this.useCompanyArr.push(item.id)
        })
      }
      this.handleModal = false
      let req = {
        ids: this.Prohibitlistback,
        versionIds: this.versions,
        useCompanyIdArr: this.useCompanyArr,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/updateBatchProjectUseCompany', req).then(res => {
        if (res.data.code === 200) {
          this.Prohibitlistback = []
          this.versions = []
          this.queryItemList()
          this.doallocationClosed(res.data.data)
          // this.queryItemList()
          this.selectData = []
        }
      })
    },
    // 监听选择取消分配公司组件接口
    CancleGetDataList (selectedList) {
      var selectedListed = []
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      this.canclehandleModal = false
      let req = {
        id: this.Prohibiting,
        version: this.version_id,
        useCompanyIdArr: selectedListed,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/updateDistributionBatchProjectUseCompanyInfo', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.failList && res.data.data.failList.length === 0) {
            this.$Message.warning('取消分配成功')
            this.Prohibiting = []
            this.version_id = []
          }
          if (res.data.data.successList && res.data.data.successList.length === 0) {
            this.$Message.warning('公司已经发生业务数据，无法取消分配')
            this.Prohibiting = []
            this.version_id = []
          }
          if (res.data.data.failList.length > 0 && res.data.data.successList.length > 0) {
            this.doallocationClose(res.data.data)
            this.Prohibiting = []
            this.version_id = []
          }
          this.queryItemList()
        } else {
          this.$Message.warning(res.data.message)
          this.Prohibiting = []
          this.version_id = []
        }
      })
    },
    // 行分配
    distributionadd (val) {
      this.Prohibitlistback = []
      this.Prohibitlistback.push(val.row.id)
      this.versions = []
      this.versions.push(val.row.version)
      this.handleModal = true
    },
    // 行取消分配
    undistribution (val) {
      if (val.row.useCompanyIdString) {
        this.paramsed.idList = val.row.useCompanyIdString.split(',')
        var idList = this.paramsed.idList.map((item, index) => {
          return item - 0
        })
        this.paramsed.idList = idList
      } else {
        this.paramsed.idList = []
      }
      this.Prohibiting = []
      this.Prohibiting = val.row.id
      this.version_id = []
      this.version_id = val.row.version
      this.canclehandleModal = true
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
    doAddCheck () {
      for (let val of this.selectData) {
        // console.log(val.dataType, '36')
        this.Prohibitlist.push(val.id)
      }
      if (this.selectData && this.selectData.length > 0) {
        // 资料类型 1.共享型,2.分配型,3.私有型
        // 分配类型
        let distribute = this.selectData.filter(item => item.dataType === '分配型').length
        if (distribute === this.selectData.length) {
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
    doSearching () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramse.companyFormId,
        codeOrName: this.paramse.codeOrName
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
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    backdoSearch () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramsed.companyFormId,
        coderOrName: this.paramsed.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    getClear () {
      this.isClear = false
    },
    // 获取表格
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: 'project_index', // 菜单编码
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
          that.columns4 = sortArr(that.columns, that.getTableList)
          that.columns4.push(this.opreation)
          that.columns4.unshift(this.code)
          that.columns4.unshift(this.header)
        }
      })
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 监听取消分分配弹窗关闭
    doallocationClose (data) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.batchList = data.failList
        this.checked = '取消分配成功' + this.sucLen + '个项目,失败' + this.errLen + '个项目'
        this.batchHandleModal = true
        this.queryItemList()
        this.selectData = []
      }
      this.showDelete = false
    },
    // 监听取消分分配弹窗关闭
    doallocationClosed (data) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.batchList = data.failList
        this.checked = '分配成功' + this.sucLen + '个项目,失败' + this.errLen + '个项目'
        this.batchHandleModal = true
        this.queryItemList()
        this.selectData = []
      }
      this.showDelete = false
    },
    // 监听删除弹窗关闭
    doDeleteClose (data, message) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.checked = `${message}成功${data.successList.length}个,${message}失败${data.failList.length}个`
        this.batchHandleModal = true
        this.queryItemList()
        if (data.failList.length) {
          data.failList.forEach(item => {
            this.tablelist.forEach((ele, index) => {
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
            this.tablelist.forEach((ele, index) => {
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
        this.selectData = []
        this.showDelete = false
      }
    },
    // 关闭提示框
    doCloseAlert () {
      this.alertConfig = false
    },
    handleGetCompanyIds (ids) {
      this.isCompanyClear = false
      this.formValidate.companyIds = ids
      var companyIds = []
      this.formValidate.companyIds.forEach(item => {
        this.formValidate.companyIds = JSON.parse(item.id)
        companyIds.push(this.formValidate.companyIds)
        this.formValidate.companyIds = companyIds
      })
      this.queryItemList()
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
      this.isConfig = true
    },
    doTableClose (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.queryItemList()
      }
      this.drawer = false
      this.isConfig = false
    },
    ...mapMutations([
      'getListIds'
    ]),
    doClickDown () {
      this.$request.post('/financeback/project/exportProjectData', this.formValidate, 'blob').then(res => {
        const aLink = document.getElementById('a_id')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = '项目列表.xlsx' // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
      this.$refs.upload.isEnterpriseAdmin = this.isEnterpriseAdmin
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
      this.queryItemList()
    },
    // 点击新增下级
    goCreate () {
      this.doLocationDetail('create_project')
    },
    // 禁用
    doProhibit (val) {
      this.Prohibit.push(val.row.id)
      this.backprohibit.push(val.row.version)
      this.disableline = true
    },
    // 批量禁用
    doBacthDisable () {
      for (let val of this.selectData) {
        this.Prohibit.push(val.id)
        this.allprohibit.push(val.version)
      }
      if (this.selectData && this.selectData.length > 0) {
        this.disableModalShow = true
      } else {
        this.$Message.warning('请选择至少一行数据后再操作')
      }
    },
    // 批量禁用接口
    doModalDisableOk () {
      let req = {
        ids: this.Prohibit,
        isEnterpriseAdmin: 1,
        versionIds: this.allprohibit
      }
      this.$request.post('/financeback/project/updateBatchProjectDisable', req).then(res => {
        if (res.data.code === 200) {
          this.doModalDisableCancel()
          this.queryItemList()
          this.doDeleteClose(res.data.data, '禁用')
        }
      })
    },
    disablelineOk () {
      let req = {
        ids: this.Prohibit,
        isEnterpriseAdmin: 1,
        versionIds: this.backprohibit
      }
      this.$request.post('/financeback/project/updateBatchProjectDisable', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data && res.data.data.failList && res.data.data.failList[0] && res.data.data.failList[0].referenceDescription) {
            this.$Message.success(res.data.data.failList[0].referenceDescription)
          } else {
            this.$Message.success('禁用成功')
          }
          this.disablelineCancel()
          this.queryItemList()
        }
      })
    },
    // 取消禁用
    doModalDisableCancel () {
      this.Prohibit = []
      this.allprohibit = []
      this.disableModalShow = false
    },
    // 取消禁用
    disablelineCancel () {
      this.Prohibit = []
      this.backprohibit = []
      this.disableline = false
    },
    // 反禁用
    unProhibit (val) {
      this.delId.push(val.row.id)
      this.backprohibit.push(val.row.version)
      this.returnDisableModalShow = true
    },
    // 反禁用
    doBacthUnDisable () {
      for (let val of this.selectData) {
        this.delId.push(val.id)
        this.backdisable.push(val.version)
      }
      if (this.selectData && this.selectData.length > 0) {
        this.unDisableModalShow = true
      } else {
        this.$Message.warning('请选择至少一行数据后再操作')
      }
    },
    // 反禁用接口
    sureModalDisableOk () {
      let req = {
        ids: this.delId,
        isEnterpriseAdmin: 1,
        versionIds: this.backdisable
      }
      this.$request.post('/financeback/project/updateBatchProjectEnable', req).then(res => {
        if (res.data.code === 200) {
          this.dealModalDisableCancel()
          this.queryItemList()
          this.doDeleteClose(res.data.data, '反禁用')
        }
      })
    },
    returnDisableModalShowOk () {
      let req = {
        ids: this.delId,
        isEnterpriseAdmin: 1,
        versionIds: this.backprohibit
      }
      // console.log(this.delId)
      this.$request.post('/financeback/project/updateBatchProjectEnable', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data && res.data.data.failList && res.data.data.failList[0] && res.data.data.failList[0].referenceDescription) {
            this.$Message.success(res.data.data.failList[0].referenceDescription)
          } else {
            this.$Message.success('反禁用成功')
          }
          this.returnDisableModalShowCancel()
          this.queryItemList()
        }
      })
    },
    // 取消反禁用
    dealModalDisableCancel () {
      this.delId = []
      this.backdisable = []
      this.unDisableModalShow = false
    },
    returnDisableModalShowCancel () {
      this.delId = []
      this.backprohibit = []
      this.returnDisableModalShow = false
    },
    // 删除
    doDeletelist (val) {
      this.deleated = []
      this.delId.push(val.row.id)
      this.deleated.push(val.row.version)
      this.deleteaccountModal = true
    },
    // 删除
    doDelCheckList () {
      for (let val of this.selectData) {
        this.delId.push(val.id)
        this.versionId.push(val.version)
      }
      if (this.selectData && this.selectData.length > 0) {
        this.accountModal = true
      } else {
        this.$Message.warning('请选择至少一行数据后再操作')
      }
    },
    doConfirm () {
      let req = {
        ids: this.delId,
        versionIds: this.versionId,
        isEnterpriseAdmin: 1
      }
      console.log(req)
      this.$request.post('/financeback/project/deleteBatchProject', req).then(res => {
        if (res.data.code === 200) {
          this.doCancel()
          this.queryItemList()
          this.versionId = []
          this.doDeleteClose(res.data.data, '删除')
        } else {
          this.$Message.warning('删除失败')
        }
      })
    },
    deleteaccountModalok () {
      let req = {
        ids: this.delId,
        versionIds: this.deleated,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/deleteBatchProject', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data && res.data.data.failList && res.data.data.failList[0] && res.data.data.failList[0].referenceDescription) {
            this.$Message.success(res.data.data.failList[0].referenceDescription)
          } else {
            this.$Message.success('删除成功')
          }
          this.deleteaccountModalCancel()
          this.queryItemList()
        }
      })
    },
    // 取消删除
    doCancel () {
      this.delId = []
      this.accountModal = false
    },
    deleteaccountModalCancel () {
      this.delId = []
      this.deleteaccountModal = false
    },
    doHandleReset () {
      this.formValidate.companyIds = []
      this.formValidate.codeOrName = null
      this.formValidate.isEnable = 2
      this.codeOrName = null
      this.size = 20
      this.current = null
      this.selectData = []
      this.isCompanyClear = true
      this.queryItemList()
      // 重置按钮事件
    },
    typeChange () {
      this.queryItemList()
    },
    doRefresh () {
      this.selectData = []
      this.queryItemList()
    },
    // 查询列表初始化
    queryItemList () {
      let reqdata = {
        isEnable: this.formValidate.isEnable === 2 ? '' : this.formValidate.isEnable,
        companyIds: this.formValidate.companyIds === null ? '' : this.formValidate.companyIds,
        codeOrName: this.formValidate.codeOrName,
        useCompanyIds: this.formValidate.useCompanyIds,
        isEnterpriseAdmin: 1,
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.tableLoading = true
      this.$request.post('/financeback/project/findProjectByCondition', reqdata).then(res => {
        this.tableLoading = false
        if (res.data.code === 200) {
          if (res.data.data.records.length === 0 && res.data.data.current >= 2) {
            this.current--
            this.queryItemList()
          } else {
            this.tablelist = res.data.data.records
            // 列表数据
            res.data.data.records = res.data.data.records.map(item => Object.assign(item, item.manageInfo))
            this.tablelist = res.data.data.records
            this.tablelist.forEach((item) => {
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
            this.tablelist.forEach((item) => {
              // 资料类型 1.共享型,2.分配型,3.私有型
              if (item.dataType === 3) {
                item.dataType = '私有型'
              }
              if (item.dataType === 2) {
                item.dataType = '分配型'
              }
              if (item.dataType === 1) {
                item.dataType = '共享型'
              }
            })
            // 分页
            this.total = res.data.data.total
            this.size = res.data.data.size
            this.current = res.data.data.current
            this.getListIds({ ids: this.tablelist.map(n => { return n.id }), name: 'project' })
            let that = this
            this.tablelist.forEach(item => {
              that.selectData.forEach(i => {
                if (item.id === i.id) {
                  that.$set(item, '_checked', true)
                }
              })
            })
            if (this.tablelist.length) {
              this.tableHeight = getHeight(85)
            } else {
              this.tableHeight = 36
            }
          }
        } else {
          this.tableHeight = 36
        }
      })
      this.dataCount = 0
    },
    helpHover () {
      console.log(123)
      this.isHover = true
    },
    loseHover () {
      this.isHover = false
    },
    // 监听分配用户弹窗传来的用户，生成用户列表
    doGetCompanyList (msg) {
      msg.forEach(e => {
        e.indeterminate = false
        e.checkAll = false
        e.checkAllGroup = []
        e.scope = '123'
        this.tableData.forEach(t => {
          if (e.id === t.id) {
            e.indeterminate = t.indeterminate
            e.checkAll = t.checkAll
            e.checkAllGroup = t.checkAllGroup
          }
        })
        this.tableData.push(e)
      })
      // 获取勾选的公司ID和岗位ID
      this.sysRoleAssignMap = {}
      let key = ''
      let value = []
      this.tableData.forEach(c => {
        key = ''
        value = []
        if (c.checkAllGroup) {
          c.checkAllGroup.forEach(r => {
            key = c.id
            value.push(r)
          })
          this.sysRoleAssignMap[key] = value
        }
      })
    },
    doValListData () {
      // 选择事件
    },
    // 反禁用modal里的确定
    doModalUnDisableOk () {
      // 批量反禁用的接口
      if (this.isAllUnDisable) {
        let reqdata = {}
        reqdata.bankIds = this.allSelectIds
        this.$request.post('sysRole/enableEnterpriseBatch', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            this.$Message.success('反禁用成功! ')
            this.querySchemeList()
          }
        })
      } else {
        let reqdata = {}
        reqdata.roleIds = this.singleUnDisableId
        this.$request.post('sysRole/enableEnterpriseBatch', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            this.$Message.success('反禁用成功! ')
            this.querySchemeList()
          }
        })
      }
    },
    handleChangePage (pageNo) {
      this.current = pageNo
      this.queryItemList()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.handleChangePage(1)
    },
    doSelectTableData ({ selection }) {
      this.selectData = selection
      this.dataCount = selection.length
    },
    handleConfirmOption (params) {
      console.log(params)
    },
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    doSetTable () {
      this.drawer = true
      this.showTableSetter = true
    },
    doCloseTable () {
      this.drawer = false
      this.showTableSetter = false
    }
  }
}
</script>
<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
@import '../../../../assets/css/forminit.less';
.project {
  #a_id {
    display: none;
  }
  // loading动画
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .table-span-active {
    margin-right: 8px;
  }
  // 搜索条件
  .page-content {
    .query-condition .query-condition-lf .screen {
      //消除间距
      .first-nospace {
        padding-left: 0;
      }
      //消除按钮偏移
      button {
        margin-right:-0.5rem;
      }
      .searchButton {
        margin-left: -10px;
        padding: 3px 8px 3px;
      }
      .reset {
        margin-left:-20px;
      }
      .searched {
        margin-left: -16px;
        padding: 3px 8px 3px;
      }
    }
    .page-content-table {
      margin-top: 10px;
      padding-bottom: 0px;
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
  // 分配modal框
  .searchadd {
    margin-left: -10px;
    padding: 3px 8px 3px;
  }
  .reseting {
    margin-left:-9px;
  }
  // 操作提示modal
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
    }
  }
}
</style>
