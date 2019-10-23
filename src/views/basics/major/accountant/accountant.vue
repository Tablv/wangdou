<template>
  <div class="company-container">
    <Spin fix v-if="spindLoading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">会计科目</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreateAccountant">新增</Button>
        <Button @click="doBatchDelete">删除</Button>
        <Button @click="doBatchPro">禁用</Button>
        <Button @click="doBatchNoPro">反禁用</Button>
        <Button @click="doOpenAuxItem">辅助核算</Button>
        <!-- <Button @click="visible = !visible">选项</Button> -->
        <!-- 导入 -->
        <Button @click.native="doClickExport">
          <common-icon :size="14" type="_export"></common-icon>
        </Button>
        <!-- 导出 -->
        <Button @click.native="doClickDown">
          <common-icon :size="14" type="_import"></common-icon>
        </Button>
        <!-- 表格配置 -->
        <Button @click.native = "doClickConfig">
          <common-icon :size="14" type="_table"></common-icon>
        </Button>
        <Button @click.native="doRefresh">
          <common-icon :size="14" type="_refresh"></common-icon>
        </Button>
      </div>
    </section>
    <section class="accountant-header">
      <Row>
        <Col span="6">
          <span class="accountant-header-title">账簿类型</span>
          <span class="accountant-header-content">{{accountBookName}}</span>
          <!-- <span class="accountant-header-content">{{accountList[0].name}}</!-->
          <!-- <Select class="span-space accountant-header-select" disabled v-model="accountBook" placeholder="请选择账簿类型">
            <Option v-for="(item,index) in accountList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select> -->
        </Col>
        <Col span="6">
          <span class="accountant-header-title">会计准则</span>
          <span class="accountant-header-content">{{accountingName}}</span>
          <!-- <span class="accountant-header-content">中国大陆企业会计准则</span> -->
          <!-- <Select class="span-space accountant-header-select" disabled v-model="accounting" placeholder="请选择会计准则" @on-change="doAccountingChange">
            <Option v-for="(item,index) in accountingList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select> -->
        </Col>
        <Col span="6">
          <span class="accountant-header-title">科目表</span>
          <span class="accountant-header-content">{{subjectName}}</span>
          <!-- placeholder="全部科目表" -->
          <!-- <span class="accountant-header-content">{{subjectList[0].name}}</span> -->
          <!-- <Select class="span-space accountant-header-select" disabled v-model="subject">
            <Option v-for="(item,index) in subjectList" :value="item.id" :key="index">{{item.name}}</Option>
          </Select> -->
        </Col>
        <Col span="6">
          <button class="box-background accountant-header-btn" @click="doMoreTemplate">
            科目模板
            <common-icon :size="14" class="ios-help-icon" type="ios-help-circle-outline"></common-icon>
          </button>
        </Col>
      </Row>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class='screen'>
            <Col span="4" class="first-nospace">
              <!-- 公司组件 -->
              <radio-select
              :config="company_config"
              :bloc="isGropFlag"
              v-model="accountantCompany.name"
              @getData="getCompanyData"
              @on-close="doResetCompanyConfig"
              :reset="company_config.refresh"
              placeholder="创建公司编码/名称">
                <div slot="header">
                  <Row :gutter="10">
                    <Col span="4" style="padding-top: 0px">
                      <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                        <Option v-for="item in companytype_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8" style="padding-top: 0px">
                      <Input class="search-button" v-model="createCodeOrName" placeholder="公司编码/名称" clearable @on-enter="doSearchCompany" @on-change="doCompanyChange">
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
            <!-- 请选择会计要素 -->
            <Col span="2" style="padding-top: 0">
              <Select clearable v-model="typeAndLoss" placeholder="全部会计要素" @on-change="changeAndLoss">
                <Option v-for="(item,index) in andLossList" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </Col>
            <!-- 请选择科目类别 -->
            <Col span="2" style="padding-top: 0">
              <Select clearable v-model="typeAttribute" placeholder="全部科目类别" @on-change="changeAttribute">
                <Option v-for="(item,index) in formList" :value="item.id" :key="index">{{item.name}}</Option>
              </Select>
            </Col>
            <!-- 全部状态 -->
            <Col span="2" style="padding-top: 0">
              <Select clearable v-model="isEnable" placeholder="全部数据状态" @on-change="changeState">
                <Option v-for="(item,index) in typeList" :value="index" :key="index">{{item}}</Option>
              </Select>
            </Col>
            <!-- 编码或名称 -->
            <Col span="4" style="padding-top: 0">
              <Input class="search-button" v-model="AccountantCodeOrName.value" placeholder="科目编码/科目名称"
              @on-enter="changeCodeOrName"
              @on-change="doInputChange"
              clearable>
                <Button slot="append" icon="ios-search" @click="changeCodeOrName"></Button>
              </Input>
            </Col>
            <!-- 重置按钮 -->
            <Col span="1" style="padding-top: 0">
              <Button @click="doResert">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div class="page-content-table">
        <vxe-table
          v-if="isXTable"
          ref="xTable"
          :data="tableData"
          :height="tableData.length ? accountantHeight : 0"
          :resizable="false"
          show-overflow="tooltip"
          show-header-overflow="tooltip"
          @select-all="doSelect"
          @select-change="doSelect">
          <template v-for="item in tableColumns">
            <vxe-table-column type="selection" fixed="left" width="40" v-if="item.key === 'selection'" :key="item.key"></vxe-table-column>
            <vxe-table-column field="code" title="科目编码" :min-width="item.minWidth" v-else-if="item.key === 'code'" :key="item.key">
              <template v-slot:header="{ column }">
                <div>
                  <span style="margin-right: 13px;">科目编码</span>
                  <Poptip trigger="hover" content="编码次级：4-2-2-2-2-2" class="header-icon" placement="right" transfer>
                    <Icon type="md-help-circle" size="18"/>
                  </Poptip >
                </div>
              </template>
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doLocationDetail('update_accountant', { id: row.id, subjectId: subject, accountTypeId: accountBook, accStandardId: accounting })">{{row.code}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="balanceDirection" title="余额方向" :min-width="item.minWidth" v-else-if="item.key === 'balanceDirection'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.balanceDirection === 0">借方</span>
                  <span v-show="row.balanceDirection === 1">贷方</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="accountCategory" title="分类名称" :min-width="item.minWidth" v-else-if="item.key === 'accountCategory'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.accountCategory === 'A01'">现金科目</span>
                  <span v-show="row.accountCategory === 'A02'">银行科目</span>
                  <span v-show="row.accountCategory === 'A03'">现金等价物</span>
                  <span v-show="row.accountCategory === 'B01'">一般科目</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isInterior" title="内部往来" :min-width="item.minWidth" v-else-if="item.key === 'isInterior'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isInterior === 0">否</span>
                  <span v-show="row.isInterior === 1">是</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isInit" title="系统预置" :min-width="item.minWidth" v-else-if="item.key === 'isInit'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isInit === 0">否</span>
                  <span v-show="row.isInit === 1">是</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isEnable" title="数据状态" :min-width="item.minWidth" v-else-if="item.key === 'isEnable'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="is-enable-box" v-show="row.isEnable === 0" disabled><span class="is-enable"></span>已失效</span>
                  <span class="is-enable-box" v-show="row.isEnable === 1" useable><span class="is-enable"></span>已生效</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isFinal" title="是否末级" :min-width="item.minWidth" v-else-if="item.key === 'isFinal'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isFinal === 1">是</span>
                  <span v-show="row.isFinal === 0">否</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'isAccounting'" :key="item.key">
              <template v-slot="{ row, index, column }">
                <div>
                  <span class="table-span table-spans" v-show="row.level < row.lenLevel && row.isEnable === 1" @click="doAddSubject({ row, index, column })">新增下级</span>
                  <span class="table-span table-spans" v-show=" row.isInterior === 0 && row.isEnable === 1" @click="doProhibit({ row, index, column })">禁用</span>
                  <span class="table-span table-spans" v-show=" row.isInterior === 0 && row.isEnable === 0 " @click="doSingleNoPro({ row, index, column })">反禁用</span>
                  <span class="table-span table-spans" v-show=" row.isInit === 0 " @click="doSingle({ row, index, column })">删除</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column :field="item.key" :title="item.title" :min-width="item.minWidth" v-else :key="item.key"></vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据" ></nodata>
          </template>
        </vxe-table>

      </div>
    </section>
    <section class="page-footer" v-show="tableData.length!==0">
      <div class="page-footer-lf">
        已选择<strong>{{dataCount}}</strong>项，共{{total}}条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="indexPageId"
          class-name="pages"
          :total="total"
          :current="current"
          :page-size="size"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="handleChangePage"/>
        <Button size="small" @click="goElevatorPage('indexPageId')">Go</Button>
      </div>
    </section>
    <upload-modal @modalClose="doCloseUpload" ref="upload" :isupload="isupload" template-type="account_subject"></upload-modal>
    <table-config @close="doTableClose" :drawer="drawer" ></table-config>
    <!-- 删除弹窗 -->
    <delete-modal :showDelete="showDelete" :deleteInfo="deleteInfo" :modalTilte="modalTilte" @doClose="doDeleteClose"></delete-modal>
    <!-- 辅助核算抽屉 -->
    <Drawer title="辅助核算" v-model="isAuxItemLis" width="320"
      :transfer="false"
      :inner="true"
      :mask-closable="false"
    >
      <section class="accountant-headers">
        <Row>
          <Col span="24">
            <span class="accountant-header-title">账簿类型</span>
            <Select class="span-space accountant-header-select" disabled v-model="accountBook" placeholder="请选择账簿类型">
              <Option v-for="(item,index) in accountList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="24">
            <span class="accountant-header-title">会计准则</span>
            <Select class="span-space accountant-header-select" disabled v-model="accounting" placeholder="请选择会计准则" @on-change="doAccountingChange">
              <Option v-for="(item,index) in accountingList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
          <Col span="24">
            <span class="accountant-header-title title-right">科目表 &nbsp;&nbsp;</span>
            <Select class="span-space accountant-header-select" disabled v-model="subject">
              <Option v-for="(item,index) in subjectList" :value="item.id" :key="index">{{item.name}}</Option>
            </Select>
          </Col>
        </Row>
      </section>
      <div class="table-changes">
        <Table :columns="auxItemColumns" :data="auxItemData" :max-height="accountantHeight - 20">
        </Table>
      </div>
      <div class="demo-drawer-footer">
        <Button type="primary" style="margin-right: 8px" @click="doAuxItemListOK">确定</Button>
        <Button @click="doAuxItemListNo">取消</Button>
      </div>
    </Drawer>
    <!-- 更多会计模板 -->
    <more-project @moreClose="doprojectClose" :isTemplete="isTemplete" :moreList = "moreList" :showMore="showMore"></more-project>
    <!-- 选项 -->
    <OptionsDrawer
      v-model="visible"
      :config="config"
      :option-config="options_config"
      @close="visible = false"
      @confirm="handleConfirmOption"></OptionsDrawer>
      <!-- 批量操作弹窗 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchList"></batch-handle-modal>
    <a id="a_id"></a>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import OptionsDrawer from '_c/optionsDrawer'
import { saasMixin } from '@/libs/mixins.js'
import { sortArr, getHeight } from '@/libs/tools.js'
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import deleteModal from './component/deleteModal.vue'
import moreProject from './more_project.vue'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
import RadioSelect from '_c/radio-select'
export default {
  name: 'accountant_index',
  components: {
    CommonIcon,
    uploadModal,
    tableConfig,
    nodata,
    deleteModal,
    moreProject, // 更多模板
    OptionsDrawer,
    batchHandleModal,
    RadioSelect
  },
  data () {
    return {
      isXTable: false,
      enableAuxItem: [], // 启用集合
      disableAuxItem: [], // 禁用集合
      auxItemColumns: [ // 辅助核算设置字段
        {
          title: '编码',
          minWidth: 40,
          key: 'code'
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 40,
          tooltip: true
        },
        {
          title: '启用',
          key: 'ifUsed',
          minWidth: 40,
          render: (h, { row, index }) => {
            return h('i-switch', { // 数据库1是已处理，0是未处理
              props: {
                type: 'primary',
                disabled: row.code === '00005', // 核算主体强制禁用
                value: row.ifUsed > 0 // 控制开关的打开或关闭状态，官网文档属性是value
              },
              style: {
                marginRight: '5px'
              },
              on: {
                'on-change': (value) => { // 触发事件是on-change,用双引号括起来，
                  this.doEnableChange({ row, index, value }) // params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            })
          }
        }
      ],
      auxItemData: [], // 辅助核算数据
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
      // 辅助核算抽屉弹窗
      isAuxItemLis: false,
      // 列表高度
      accountantHeight: 36,
      // 批量操作结果-显示详情弹窗
      batchHandleModal: false,
      checked: null, // 批量建账成功提示的check
      isColor: false, // 是否是成功
      content: '', // 批量提示内容
      alertShow: false, // 批量提示
      types: null, // 提示类型
      sucLen: 0, // 批量操作成功条数
      errLen: 0, // 批量操作失败条数
      batchList: [], // 批量操作数组
      visible: false, // 控制选项是否出现
      config: { // 抽屉组件配置
        title: '选项',
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right'
      },
      options_config: [ // 选项配置
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
            }
          ]
        }
      ],
      subject: null, // 科目表
      subjectList: [], // 科目表列表
      accounting: null, // 会计准则
      accountingList: [], // 会计准则列表
      accountList: [], // 账簿类型列表
      accountBook: null, // 账簿类型
      spindLoading: true, // 加载
      showMore: false, // 更多模板是都显示
      showDelete: false, // 删除弹窗是否显示
      drawer: false, // drawer组件的值
      isConfig: false, // 表格配置是否显示
      isupload: false, // 导入弹窗
      selectData: [], // 多选的数据
      dataCount: 0, // 选中的数据个数
      size: 20, // 每页显示的数据个数
      current: 1, // 页码
      total: 0, // 数据总数
      andLossList: [], // 全部会计要素
      formList: [], // 全部形态列表
      typeList: ['已失效', '已生效'],
      tableColumns: [],
      header: {
        type: 'selection',
        key: 'selection',
        width: 44,
        multiple: true,
        align: 'center'
      },
      code: {
        title: '科目编码',
        key: 'code',
        minWidth: 150,
        className: 'primary',
        tooltip: true
      },
      tableColumn: [
        {
          title: '科目名称',
          key: 'name',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '会计要素',
          key: 'accountElementItemName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '科目类别',
          key: 'subjectCategoryName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '使用公司名称',
          key: 'useCompanyName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '余额方向',
          key: 'balanceDirection',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '分类名称',
          key: 'accountCategory',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '辅助核算名称',
          key: 'auxiliaryNames',
          align: 'left',
          minWidth: 150,
          tooltip: true
        },
        {
          title: '现金流量项目预设',
          key: 'cashFlowNames',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '创建公司名称',
          key: 'companyName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '内部往来',
          key: 'isInterior',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '系统预置',
          key: 'isInit',
          minWidth: 150
        },
        {
          title: '数据状态',
          key: 'isEnable',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '创建人',
          key: 'creatorName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '修改人',
          key: 'updatorName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '修改时间',
          key: 'updateTime',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '禁用人',
          key: 'disabledUserName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '禁用时间',
          key: 'disabledTime',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '反禁用人',
          key: 'enabledUserName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '反禁用时间',
          key: 'enabledTime',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '是否末级',
          key: 'isFinal',
          tooltip: true,
          minWidth: 150
        }
      ],
      opreation: {
        title: '操作',
        key: 'isAccounting',
        width: 240,
        align: 'left',
        fixed: 'right'
      },
      deleteInfo: {
        ids: [],
        isDel: 1,
        id: null,
        isbatch: null // 1.批量删除，2.单条删除，3，单条禁用，4.批量禁用，5.单条反禁用，6.批量反禁用
      }, // 删除，禁用，反禁用,信息
      tableData: [], // 列表数据数组
      modalTilte: {
        title: null,
        content: null
      },
      // 会计要素id
      typeAndLoss: null,
      // 科目类别id
      typeAttribute: null,
      isEnable: null,
      // codeOrName: null,
      moreList: [], // 模板列表
      isTemplete: false, // 是否引入模板, false 为未被引用
      // menuCode: this.$route.name, // 菜单编码
      menuCode: 'accountant_index', // 菜单编码
      getTableList: [], // 接口获取的表头数组
      arr: [],
      auxliSubjectId: '',
      formListbCK: [],
      AccountantCodeOrName: {
        value: '',
        result: ''
      },
      company_config: { // 归属公司配置
        type: 'company',
        title: '选择公司',
        refresh: false,
        width: '282',
        request_params: {
          companyFormId: null,
          codeOrName: '',
          isEnterpriseAdmin: 1,
          // menuCode: this.$route.name
          menuCode: 'accountant_index'
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
      accountantCompany: {
        name: '',
        id: 0
      },
      isGropFlag: true,
      createCodeOrName: '',
      accountBookName: '核算账簿',
      accountingName: '中国大陆企业会计准则',
      subjectName: '中国大陆企业会计科目表'
    }
  },
  mixins: [saasMixin],
  mounted () {
    this.doGettableHeader() // 列表表格表头
    this.doInit()
  },
  methods: {
    // 点击刷新
    doRefresh () {
      this.dataCount = 0
      this.doGetList()
    },
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
      this.$set(this, 'accountantCompany', data)
    },

    /**
     * 跳转新增页面
     */
    toCreateAccountant () {
      this.doLocationDetail('create_accountant', { subjectId: this.subject, accountTypeId: this.accountBook, accStandardId: this.accounting })
    },
    // 获取表头
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: 'accountant_index', // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/tableConfig/findList', req).then(res => {
        this.getTableList = []
        if (res.data.code === 200) {
          let newHeader = res.data.data.localConfigList.length === 0 ? res.data.data.globalConfigList : res.data.data.localConfigList
          for (let i = 0; i < newHeader.length; i++) {
            newHeader[i].key = newHeader[i].columnName
            if (newHeader[i].isShow !== 0 && newHeader[i].key !== 'code' && newHeader[i].key !== 'mobile') {
              this.getTableList.push(newHeader[i])
            }
          }
          this.tableColumns = sortArr(this.tableColumn, this.getTableList)
          this.tableColumns.push(this.opreation)
          this.tableColumns.unshift(this.code)
          this.tableColumns.unshift(this.header)
          this.isXTable = true
        }
      })
    },
    // 批量操作的alert弹窗关闭监听
    changeClose () {
      this.alertShow = false
    },
    // 监听选项返回数据
    handleConfirmOption (params) {
      this.visible = false
    },
    doGetAccount (url) {
      let Urls = url
      return new Promise((resolve, reject) => {
        this.$request.post(Urls).then(res => {
          if (res.data.code === 200) {
            resolve(res)
          }
        })
      })
    },
    // 初始化状态
    async doInit () {
      // this.spindLoading = true
      // 账簿类型
      let accounturl = '/financeback/accountSubject/findAccountBookTypeSelection'
      this.accountBook = await this.doGetAccount(accounturl).then(res => {
        this.accountList = res.data.data
        if (this.accountList.length !== 0) {
          this.accountBookName = this.accountList[0].name
          return this.accountList[0].id
        }
      })
      // 会计准则
      let criterionUrl = '/financeback/accountSubject/findAccountingStandardSelection'
      this.accounting = await this.doGetAccount(criterionUrl).then(res => {
        this.accountingList = res.data.data
        if (this.accountingList.length !== 0) {
          this.accountingName = this.accountingList[0].name
          return this.accountingList[0].id
        }
      })
      this.doGetBaseSubject()
    },
    // 获取科目基准，并且基于基准做出一系列改变
    async doGetBaseSubject () {
      let bckSubjeId = this.subject
      // 获取科目基准表
      let reqParams = { accountTypeId: this.accountBook, accStandardId: this.accounting, isBase: 1 }
      this.subject = await this.$request.post('/financeback/accountSubject/findSubjectSelection', reqParams).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.length !== 0) {
            this.subjectList = res.data.data
            this.subjectName = this.subjectList[0].name
            return this.subjectList[0].id
          }
          this.$Message.error('当前准则下，没有对应科目表，请切换准则')
          return null
        }
      })
      this.spindLoading = false
      if (this.subject && bckSubjeId !== this.subject) {
        // 获取列表数据
        this.doGetList()
        // 列表页查询条件
        this.dofindSelectionList()
        // 辅助核算设置
        this.dofindAuxiliaryItemList()
      }
    },
    // 会计准则发生变化
    doAccountingChange (val) {
      this.accounting = val
      this.doGetBaseSubject()
    },
    // 列表页查询条件
    dofindSelectionList () {
      this.$request.post('/financeback/accountSubject/findSelectionList', { subjectId: this.subject }).then(({ data }) => {
        if (data.code === 200) {
          this.andLossList = data.data.accountElementItemList // 会计要素
          this.formList = data.data.subjectCategoryList // 科目类别
          this.formListbCK = data.data.subjectCategoryList // 科目类别
        }
      })
    },
    // 辅助核算设置
    dofindAuxiliaryItemList () {
      this.$request.post('/financeback/accountSubject/findAuxiliaryItemList', { subjectId: this.subject }).then(({ data }) => {
        if (data.code === 200) {
          this.auxliSubjectId = data.data.subjectId
          this.auxItemData = [...data.data.auxiliaryItemList, ...data.data.accountingItemList] // 辅助核算
          this.enableAuxItem = this.auxItemData.filter(item => item.ifUsed === 1)
        }
      })
    },
    // 获取更过模板下拉框数据
    doObtainMore () {
      let req = { accountTypeId: this.accountBook, accStandardId: this.accounting, parentId: this.subject, isBase: 0 }
      this.$request.post('/financeback/accountSubject/findSubjectSelection', req).then(res => {
        if (res.data.code === 200) {
          this.moreList = res.data.data
        }
      })
    },
    // 获取列表数据
    doGetList () {
      let req = { // 解决bug 12387 会计要素筛选条件不起作用
        baseSubjectId: this.subject, // 基准表ID
        accountElementItem: this.typeAndLoss, // 会计要素id
        subjectCategory: this.typeAttribute, // 科目类别ID
        isEnable: this.isEnable,
        codeOrName: this.AccountantCodeOrName.result,
        page: {
          current: this.current,
          size: this.size
        }
      }
      this.spindLoading = true
      this.$request.post('/financeback/accountSubject/findPage', req).then(res => {
        if (res.data.code === 200) {
          this.selectData = []
          this.dataCount = 0
          if (this.current > 1 && res.data.data.records.length === 0) {
            this.current = this.current - 1
            this.doGetList()
          }
          this.getListIds({ ids: res.data.data.records.map(n => { return n.id }), name: 'accountant' })
          res.data.data.records = res.data.data.records.map(item => Object.assign(item, item.manageInfo))
          this.total = res.data.data.total
          res.data.data.records.forEach((item) => {
            item.accountCategoryName = item.accountCategory
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
            let arr = item.maxLevel.split('-')
            item.lenLevel = arr.length
          })
          this.tableData = res.data.data.records
          this.accountantHeight = this.tableData.length === 0 ? 36 : getHeight(145)
          this.spindLoading = false
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    doCurrentReset () {
      this.current = 1
    },
    // 没有选择列表的批量删除，禁用，反禁用
    doNoChange () {
      this.$Message.warning('请至少选择一条数据再操作！')
    },
    // 点击重置
    doResert () {
      this.accountantCompany.name = ''
      this.typeAndLoss = null
      this.typeAttribute = null
      this.isEnable = null
      this.AccountantCodeOrName.result = null
      this.AccountantCodeOrName.value = null
      this.dataCount = 0
      this.current = 1
      this.size = 20
      this.doGetList()
    },
    changeAndLoss (val) {
      if (val) {
        this.formList = this.formListbCK.filter(item => item.elementItemId === val)
      } else {
        this.formList = this.formListbCK
      }
      this.doCurrentReset()
      this.doGetList()
    },
    // 选择属性类别后，返回会计要素
    changeAttribute (val) {
      if (val) {
        // this.formList = this.formListbCK.filter(item => item.elementItemId === val)
        this.typeAndLoss = this.formListbCK.filter(item => item.id === val)[0].elementItemId
      }
      this.doCurrentReset()
      this.doGetList()
    },
    // 改变状态
    changeState (item) {
      this.doCurrentReset()
      this.doGetList()
    },
    // 控制编码或名称的输入
    changeCodeOrName (val) {
      this.AccountantCodeOrName.result = this.AccountantCodeOrName.value
      this.doCurrentReset()
      this.doGetList()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (!this.AccountantCodeOrName.value && this.AccountantCodeOrName.result) {
        this.changeCodeOrName()
      }
    },
    // 通过开关状态判断值然后传值进行更新
    doEnableChange ({ row, index, value }) {
      this.auxItemData[index].ifUsed = value ? 1 : 0
    },
    doOpenAuxItem () {
      this.isAuxItemLis = true
      this.dofindAuxiliaryItemList()
    },
    /**
     * 辅助核算设置抽屉-确认按钮
     * 点击确认，发送请求，启用或禁用辅助核算
     * enableList 启用的辅助核算项集合
     * disableList 取消之前已启用的辅助核算项集合
     */
    doAuxItemListOK () {
      this.isAuxItemLis = false
      let enableList = this.auxItemData.filter(item => item.ifUsed)
      let efiterList = enableList.map(item => item.code)
      let disableList = this.enableAuxItem.filter(item => !efiterList.includes(item.code))
      this.$request.post('/financeback/accountSubject/addSubjectAuxiliary', { subjectId: this.auxliSubjectId, enableList, disableList }).then(({ data }) => {
        if (data.code === 200) {
          this.enableAuxItem = enableList
          console.log(data)
        }
        this.dofindAuxiliaryItemList()
      })
    },
    /**
     * 辅助核算设置抽屉-取消按钮
     */
    doAuxItemListNo () {
      this.isAuxItemLis = false
    },
    // helpHover () {
    //   this.isHover = true
    // },
    // loseHover () {
    //   this.isHover = false
    // },
    // 监听更多模板关闭
    doprojectClose (msg) {
      if (msg === 1) {
        this.doGetList()
      }
      this.showMore = false
    },
    // 点击更多模板
    async doMoreTemplate () {
      // this.doOpenMoreTemplate()
      if (!this.subject) {
        return this.$Message.error('请选择科目表')
      }
      // doTemplete()
      this.isTemplete = await this.$request.post('/financeback/accountSubject/findIfIsCited', { subjectId: this.subject }).then(res => {
        if (res.data.code === 200) {
          return !res.data.data
        }
      })
      if (this.isTemplete) {
        return this.$Message.error('当前科目表的会计科目已被使用，无法替换模板')
      }
      // 判断有没有新增下级
      this.$request.post('/financeback/accountSubject/findIfExistNewInfo', { subjectId: this.subject }).then(({ data }) => {
        if (data.code === 200) {
          if (!data.data) {
            let msgObj = { title: '提示', message: '当前科目表已经增加新的科目，替换模板将自动删除这些科目，请谨慎操作', yes: 'doOpenMoreTemplate' }
            this.doShowActiveModal(msgObj)
          } else {
            this.doOpenMoreTemplate()
          }
        }
      })
    },
    doOpenMoreTemplate () {
      this.doObtainMore()
      this.showMore = true
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 列表单选
    doSelect ({ selection }) {
      this.selectData = selection
      this.dataCount = this.selectData.length
      // 获取多选数据的用户id
      this.deleteInfo.ids = this.selectData.map(item => item.id)
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      this.drawer = false
      if (msg === 'change') {
        this.isXTable = false
        this.doGettableHeader()
        this.doGetList()
      }
    },
    /**
     * 行操作-新增按钮
     */
    async doAddSubject ({ row, index, column }) {
      console.log('引用状态' + row.isCited + '下级数目' + row.childNum)
      let isCited = await this.$request.post('/financeback/accountSubject/findInfoById', { id: row.id }).then(res => {
        return res.data.data.isCited
      })
      if (isCited === 1) {
        return this.$Message.warning('当前数据已使用，无法新增下级！')
      }
      if (row.isInterior === 1) {
        return this.$Message.error('内部往来科目不能新增下级！！')
      }
      if (row.level >= row.maxLevel.split('-').length) {
        return this.$Message.error('当前数据已达最大级次，无法新增下级!')
      }
      if (row.childNum >= 99) {
        return this.$Message.error('当前下级数据以达到最大99个，无法新增下级!')
      }
      let req = {
        upCode: row.code,
        subjectId: row.subjectId
      }
      // 判断预置数据能否新增
      this.$request.post('/financeback/accountSubject/checkNextInitInfo', req).then(res => {
        if (res.data.code === 200) {
          this.doLocationDetail('create_accountant', { subjectId: this.subject, id: row.id, level: row.level, maxLevel: row.maxLevel, isEnable: row.isEnable, code: row.code, accountTypeId: this.accountBook, accStandardId: this.accounting })
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    /**
     * 监听操作结果
     */
    doDeleteClose (data, flag, message) {
      this.showDelete = false
      if (data === 'close') {
        // return this.$Message.success('已取消')
        return
      }
      if (!data) { return }
      // flag 1 批量操作 0 单个操作
      if (flag) { // 批量操作结果
        this.selectData = []
        this.dataCount = 0
        this.batchList = []
        this.doGetList()
        this.sucLen = data.successDetailsList ? data.successDetailsList.length : 0
        this.errLen = data.failList ? data.failList.length : 0
        data.failList = data.failList ? data.failList : []
        data.successDetailsList = data.successDetailsList.map(item => {
          return {
            businessId: item.info.id,
            code: item.info.code,
            status: '成功',
            details: `${message}: "${item.info.code}"会计科目-${item.info.name}`,
            referenceDescription: `${message}成功`
          }
        })
        data.failList = data.failList.map(item => {
          return {
            businessId: item.info.id,
            code: item.info.code,
            status: '失败',
            details: `${message}: "${item.info.code}"会计科目-${item.info.name}`,
            referenceDescription: item.referenceDescription
          }
        })
        this.batchList = [...data.successDetailsList, ...data.failList]
        this.checked = '成功' + this.sucLen + '条,失败' + this.errLen + '条'
        this.batchHandleModal = true
      } else { // 单个操作结果
        if (data.successDetailsList.length) {
          this.doGetList()
          return this.$Message.success(message + '成功')
        }
        if (data.failList.length) {
          return this.$Message.error(data.failList[0].referenceDescription)
        } else {
          this.doGetList()
          return this.$Message.success(message + '成功')
        }
      }
    },
    /**
     * 行操作-删除按钮
     */
    doSingle ({ row, index, column }) {
      this.deleteInfo = { ids: [row], isbatch: 2 }
      this.modalTilte = { title: '确认删除', content: '注意：删除后将不可恢复！请确认是否要删除数据？' }
      this.showDelete = true
    },
    /**
     * 批量删除按钮
     */
    doBatchDelete () {
      if (this.selectData.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      this.deleteInfo = {
        ids: this.selectData,
        isbatch: 1
      }
      this.modalTilte = { title: '确认删除', content: '注意：删除后将不可恢复！请确认是否要删除数据？(系统预置、内部往来不能删除)' }
      this.showDelete = true
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
          that[msgObj.yes]()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 行操作-禁用按钮
     */
    doProhibit ({ row, index, column }) {
      let params = {
        codes: [row.code],
        subjectId: row.subjectId,
        isEnable: 0
      }
      this.deleteInfo = {
        codes: [row.code],
        versionList: [row.version],
        subjectId: row.subjectId,
        isbatch: 3 // 批量反禁用
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认禁用', message: '禁用操作将会把本级与下级科目一起禁用', yes: 'doShowProbitModal' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doShowProbitModal()
        }
      })
    },
    /**
     * 批量禁用按钮
     */
    doBatchPro () {
      if (this.selectData.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      //
      let codes = this.selectData.map(item => item.code)
      let params = {
        codes: codes,
        subjectId: this.selectData[0].subjectId,
        isEnable: 0
      }
      this.deleteInfo = {
        data: this.selectData,
        codes: codes,
        subjectId: this.selectData[0].subjectId,
        versionList: this.selectData.map(item => item.version),
        isbatch: 4 // 批量禁用
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认禁用', message: '禁用操作将会把本级与下级科目一起禁用', yes: 'doShowProbitModal' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doShowProbitModal()
        }
      })
    },
    /**
     * 禁用提示框+操作
     */
    doShowProbitModal () {
      if (this.selectData.filter(item => item.isInterior === 1).length) {
        this.modalTilte = { title: '确认禁用?', content: '确认禁用选中的数据吗？(内部往来科目不能禁用)' }
      } else {
        this.modalTilte = { title: '确认禁用?', content: '确认禁用选中的数据吗？' }
      }
      this.showDelete = true
    },
    /**
     * 行操作-反禁用按钮
     */
    doSingleNoPro ({ row, index, column }) {
      let params = {
        codes: [row.code],
        subjectId: row.subjectId,
        isEnable: 1
      }
      this.deleteInfo = {
        codes: [row.code],
        versionList: [row.version],
        subjectId: row.subjectId,
        isbatch: 5 // 反禁用
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认反禁用', message: '反禁用将会将上级科目一起反禁用', yes: 'doShowUnProbitModal' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doShowUnProbitModal()
        }
      })
    },
    doShowUnProbitModal () {
      if (this.selectData.filter(item => item.isInterior === 1).length) {
        this.modalTilte = { title: '确认反禁用?', content: '确认反禁用选中的数据吗？(内部往来科目不能反禁用)' }
      } else {
        this.modalTilte = { title: '确认反禁用?', content: '确认反禁用选中的数据吗？' }
      }
      // this.modalTilte = { title: '确认反禁用?', content: '确认反禁用选中的数据吗？' }
      this.showDelete = true
    },
    /**
     * 反禁用按钮
     */
    doBatchNoPro () {
      if (this.selectData.length === 0) {
        return this.$Message.warning('请选择至少一行数据后再操作')
      }
      let codes = this.selectData.map(item => item.code)
      let params = {
        codes: codes,
        subjectId: this.selectData[0].subjectId,
        isEnable: 0
      }
      this.deleteInfo = {
        data: this.selectData,
        codes: codes,
        subjectId: this.selectData[0].subjectId,
        versionList: this.selectData.map(item => item.version),
        isbatch: 6 // 批量反禁用
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认反禁用', message: '反禁用将会将上级科目一起反禁用', yes: 'doShowUnProbitModal' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doShowUnProbitModal()
        }
      })
    },
    // 点击导出
    doClickDown () {
      let req = {
        subjectId: this.subject,
        accountElementItem: this.typeAndLoss,
        typeAttribute: this.typeAttribute,
        isEnable: this.isEnable,
        codeOrName: this.AccountantCodeOrName.result,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountSubject/exportExcel', req, 'blob').then(({ headers, data }) => {
        let suffix = headers['content-disposition'].split('.')[1]
        console.log(suffix)
        const aLink = document.getElementById('a_id')
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = `会计科目列表.${suffix}` // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
    },
    // 点击导入按钮
    doClickExport () {
      this.$refs.upload.subjectId = this.subject
      this.isupload = true
    },
    doCancel () {
      this.reminderModal = false
    },
    // 改变当前页
    handleChangePage (pageNo) {
      this.current = pageNo
      this.selectData = []
      this.dataCount = 0
      this.doGetList()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.selectData = []
      this.dataCount = 0
      this.doCurrentReset()
      this.doGetList()
    }
  }
}
</script>
<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
@import '../../../../assets/css/redefine.less';
.company-container {
  #a_id {
    display: none;
  }
  .page-content-table {
    padding-bottom: 0px !important;
  }
  // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  // 单据头间距
  .span-space {
    .span-space(8px, 0)
  }
  // 核算主体抽屉
  .accountant-headers {
    .accountant-header-title {
      margin-left: 15px;
      line-height: 40px;
      font-size: 12px;
      color: #707070;
    }
    .title-right {
      margin-left: 26px;
      margin-right: -10px;
    }
    .accountant-header-select {
      width: 200px;
    }
  }
  // 表格上面头部
  .accountant-header {
    height: 60px;
    background: #f2f3f3;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 16px;
    position: relative;
    border: 1px solid #e5e5e5;
    .accountant-header-title {
      margin-left: 15px;
      line-height: 60px;
      font-size: 12px;
      color: #333333;
    }
    // 单据头
    .accountant-header-content {
      margin-left: 15px;
      line-height: 60px;
      font-size: 12px;
      color: #999999;
    }
    // 单据头
    .accountant-header-select {
      width: 200px;
    }
    // 更多模板按钮
    .accountant-header-btn {
      outline: none;
      border: none;
      width: 80px;
      height: 32px;
      float: right;
      margin-top: 14px;
      margin-right: 15px;
      color: #eef8f7;
      font-size: 12px;
      cursor: pointer;
      .ivu-icon {
        margin-top: -2px;
      }
    }
  }
  .query-condition {
    .query-condition-lf {
      .screen {
        //消除间距
        .first-nospace {
          padding-left: 0 !important;
          padding-top: 0 !important;
        }
      }
    }
  }
  .common-drawer {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    margin-left: 8px;
    z-index: -10;
    transition: all ease .3s;
    footer {
      position: absolute;
      bottom: 1px;
      left: 0;
      width: 100%;
      height: 50px;
      border-top: 1px solid #DDDDDD;
      box-sizing: border-box;
      line-height: 50px;
      padding: 0 10px;
    }
  }
  .show-drawer {
    z-index: 1000;
  }
  .table-spans {
    margin-right: 18px;
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
  .table-changes {
    .ivu-table-wrapper {
      margin: 16px;
    }
  }
}

</style>
