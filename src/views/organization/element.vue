<template>
  <section class="element-container">
    <Spin fix v-if="loading2" style="left: 8px;z-index: 10">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">业务单元列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toCreateUnit">新增</Button>
        <Button @click="selectMany">删除</Button>
        <Button @click="showOptDrawer">选项</Button>
        <Button @click="doImport"><common-icon type="_export" :size="14"/></Button>
        <Button @click="exportExcel"><common-icon type="_import" :size="14"/></Button>
        <Button @click="doSetTable"><common-icon type="_table"/></Button>
        <Button @click="doInitNow"><common-icon type="_refresh" :size="14"/></Button>
      </div>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row class="screen query-change">
            <Col span="2">
              <Select v-model="formValidate.form" @on-change='typeChange()' placeholder="全部形态">
                <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col span="4">
              <multi-select
                :data="companyParams"
                @on-select="doGetCompanyId"
                @on-clear="isCheck"
                placeholder="公司编码或名称"
                title="选择公司"
                type="company"
                width="100%"
                isEnterpriseAdmin = 1
                :isClear="isClear"
                @searchWord="searchWordCom"
                :searchText="searchTextCom">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="3">
                    <Select v-model="companyFormId" @on-change="doSelect">
                      <Option v-for="item in formListModal" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                  </Col>
                  <Col span="6">
                    <Input clearable v-model="companyCodeOrName" placeholder="公司编码或名称" @on-enter="doSearch" @on-clear="doSearch">
                      <Button slot="append" icon="ios-search" @click="doSearch" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doReset1">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="4">
               <Input v-model="formValidate.codeOrName" :maxlength="50" placeholder="业务单元编码/名称" @on-enter="onSearch" @on-clear="doEleChang" clearable>
                <Button slot="append" icon="ios-search" @click="onSearch" size="small"></Button>
              </Input>
            </Col>
            <Col span="1">
              <Button class="doReset" @click="handleReset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
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
          @select-all="onSelectCheckboxChange"
          @select-change="onSelectCheckboxChange"
        >
          <template v-for="item in tableColumns">
            <vxe-table-column type="selection" width="40" v-if="item.key === 'selection'" :key="item.key" :resizable="false"></vxe-table-column>
            <vxe-table-column field="code" title="编码" :min-width="item.minWidth" v-else-if="item.key === 'code'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doLocationDetail('update_element', { id: row.id })">{{row.code}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isAccountEntity" title="核算主体" :min-width="item.minWidth" v-else-if="item.key === 'isAccountEntity'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isAccountEntity ===1">是</span>
                  <span v-show="row.isAccountEntity ===0">否</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'action'" :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span table-right" @click="doDeleteBusinessUnit({ row })">删除</span>
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
    <section class="page-footer" v-show="!!maxItems">
      <div class="page-footer-lf">
        已选择 <strong>{{ selectMore.length }}</strong> 项，共 {{ maxItems }} 条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageIdElement" class-name="pages" :total="maxItems" :page-size="page.size" :page-size-opts="[20, 50, 100, 200, 500, 1000]" show-elevator show-sizer @on-change="doUpdateCurrentPage" @on-page-size-change="doUpdatePageSize"></Page>
        <Button size="small" @click="goElevatorPage('pageIdElement')">GO</Button>
      </div>
    </section>
    <!-- 选项 -->
    <OptionsDrawer
      v-model="visible"
      :config="config"
      :option-config="options_config"
      @close="visible = false"
      @confirm="handleConfirmOption">
    </OptionsDrawer>
    <query-company :showFlag="showCompanies" titleName="选择公司" @getCowName="setComName" @getShowFlag="setShowFlag"></query-company>
    <upload-modal class="doUpload" @modalClose="doCloseUpload" :isupload="isupload" template-type="business_unit"></upload-modal>
    <!-- 批量删除提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 表格配置 -->
    <table-config  @close="doTableClose" :drawer="drawer"></table-config>
    <a id="elementExport" style="display:none"></a>
  </section>
</template>

<script type="text/jsx">
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import { sortArr, getHeight } from '@/libs/tools.js'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import QueryCompany from '_c/company'
import OptionsDrawer from '_c/optionsDrawer' // 选项
import batchHandleModal from '_c/batchHandleModal' // 批量删除
import multiSelect from '_c/multi-select'

export default {
  name: 'element_index',
  components: {
    CommonIcon,
    nodata,
    uploadModal,
    tableConfig,
    QueryCompany,
    batchHandleModal,
    OptionsDrawer,
    multiSelect
  },
  data () {
    return {
      visible: false, // 抽屉显示
      batchHandleModal: false, // 批量建账成功提示
      isXTable: false,
      isClear: false,
      companyFormId: 0,
      companyCodeOrName: '',
      loading: false,
      loading2: false,
      tableHeight: 0, // 表格高度
      formInit: 0,
      maxItems: 0,
      height: getHeight(80),
      searchTextCom: {},
      page: {
        size: 20,
        current: 1
      },
      checked: '', // 批量建账成功提示的check
      batchhandleColumns: [], // 批量提示的表头
      batchhandleData: [], // 批量提示的表格数据
      batchDeleteColumns: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          className: 'table-index'
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '形态',
          key: 'unitFormId',
          tooltip: true,
          render: (h, { row }) => {
            let unitForm = this.formList.filter(val => val.value === row.unitFormId)[0].label
            return (
              <span>{ unitForm }</span>
            )
          }
        },
        {
          title: '公司',
          key: 'companyName',
          tooltip: true
        },
        {
          title: '核算主体',
          key: 'isAccountEntity',
          tooltip: true,
          render: (h, { row, index, column }) => {
            return (
              <span>{ row.isAccountEntity ? '是' : '否' }</span>
            )
          }
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
      ],
      config: {
        title: '选项',
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right',
        width: 300
      },
      options_config: null,
      isclear: false, // 清空
      selMore: false, // 多选删除功能
      rowInTabel: {},
      allSelectIds: [], // 批量的id
      isupload: false, // 导入弹窗
      isEnable: null, // 是否生效
      isRef: null, // 是否使用
      showCompanies: false,
      showTableSetter: false,
      drawer: false,
      modalId: 'pageId',
      selectMore: [],
      tableData: [],
      companyId: null,
      formValidate: {
        form: 0,
        company: [],
        codeOrName: ''
      },
      formList: [],
      tableColumns: [],
      header: {
        key: 'selection'
      },
      code: {
        title: '编码',
        key: 'code',
        minWidth: 120
      },
      tableColumn: [
        {
          title: '名称',
          key: 'name',
          minWidth: 80
        },
        {
          title: '形态',
          key: 'unitFormName',
          minWidth: 100
        },
        {
          title: '公司',
          key: 'companyName',
          minWidth: 80
        },
        {
          title: '核算主体',
          key: 'isAccountEntity',
          minWidth: 100
        },
        {
          title: '创建人',
          key: 'creatorName',
          minWidth: 80
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 160
        },
        {
          title: ' 修改人',
          key: 'updatorName',
          minWidth: 80
        },
        {
          title: ' 修改时间',
          key: 'updateTime',
          minWidth: 160
        }
      ],
      opreation: {
        title: '操作',
        key: 'action',
        minWidth: 240
      },
      formListModal: [
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
      companyParams: {
        companyFormId: '',
        codeOrName: ''
      }
    }
  },
  mixins: [saasMixin],
  watch: {
    'formValidate.company' () {
      this.page.current = 1
      this.doInit()
    }
  },
  created () {
    this.doGetUnitFormId()
    this.doInit()
  },
  mounted () {
    this.doGettableHeader()
  },
  activated () {
    if (this.$store.state.user.isRefreshTable) {
      this.doInitNow()
      this.$store.commit('setIsRefreshTable', false)
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    searchWordCom (val) {
      this.searchTextCom.codeOrName = val
    },
    doReset1 () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.doSelect()
      this.doSearch()
    },
    doSelect () {
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    doSearch () {
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    isCheck (val) {
      this.isClear = val
    },
    doGetCompanyId (data) {
      this.formValidate.company = data.map(item => item.id)
      this.doInit()
    },
    async showOptDrawer () {
      let _res = await this.$request.post('/financeback/sysMenuOption/findMenuOption', { menuCode: this.$route.name }).then(res => {
        const { status, data } = res.data
        if (status === 'success' && data.globalMenuOptionList.length && data.localMenuOptionList.length) {
          this.options_config = [
            {
              type: 'radio',
              title: '编码规则',
              keyValue: data.localMenuOptionList[0].optionValue,
              data: [{
                label: data.globalMenuOptionList[0].optionName,
                value: data.globalMenuOptionList[0].optionValue,
                disabled: !data.globalMenuOptionList[0].isCanUpdate
              },
              {
                label: data.globalMenuOptionList[1].optionName,
                value: data.globalMenuOptionList[1].optionValue,
                disabled: !data.globalMenuOptionList[1].isCanUpdate
              }]
            }
          ]
          return this.options_config
        }
      })
      if (_res) {
        this.visible = true
      }
    },
    // 批量删除 --组件
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 表格配置
    doGettableHeader () {
      let req = {
        menuCode: this.$route.name,
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
          that.tableColumns = sortArr(that.tableColumn, that.getTableList)
          that.tableColumns.push(this.opreation)
          that.tableColumns.unshift(this.code)
          that.tableColumns.unshift(this.header)
          this.isXTable = true
        }
      })
    },
    // 获取业务单元
    doGetUnitFormId () {
      this.loading2 = true
      this.$request.post('/financeback/businessUnit/findFormList').then(result => {
        this.loading2 = false
        let { code, data } = result.data
        if (code === 200) {
          let _data = [{
            value: 0,
            label: '全部形态'
          }]
          data.forEach(item => {
            _data.push({
              value: item.id,
              label: item.name
            })
          })
          this.formList = _data
        }
      })
    },
    // 初始化
    doInit () {
      let req = {
        unitFormId: this.formValidate.form === 0 ? null : this.formValidate.form,
        companyIdList: this.formValidate.company,
        codeOrName: this.formValidate.codeOrName,
        page: {
          size: this.page.size,
          current: this.page.current
        }
      }
      this.loading = true
      this.$request.post('/financeback/businessUnit/findBusinessUnitPage', req).then(result => {
        this.loading = false
        let { status, data } = result.data
        if (status === 'success') {
          if (data.records.length === 0 && data.current >= 2) {
            this.page.current--
            this.doInit()
          } else {
            let that = this
            this.getListIds({ ids: data.records.map(n => { return n.id }), name: 'element' })
            this.tableData = data.records
            this.tableData.forEach(item => {
              that.selectMore.forEach(id => {
                if (item.id === id.id) {
                  that.$set(item, '_checked', true)
                }
              })
            })
            if (this.tableData.length === 0) {
              this.tableHeight = 36
            } else {
              this.tableHeight = this.height
            }
            this.maxItems = data.total
          }
        } else {
          this.tableData = []
          this.maxItems = 0
        }
      })
    },
    // 刷新
    doInitNow () {
      this.selectMore = []
      this.doInit()
    },
    // 改变形态
    typeChange () {
      this.page.current = 1
      this.doInit()
    },
    // 公司编码或名称
    getComIdList (data) {
      this.formValidate.company = data
    },
    // 公司弹窗
    doSelectCompany () {
      this.showCompanies = true
    },
    // 搜索
    onSearch () {
      this.page.current = 1
      this.doInit()
    },
    // 业务单元编码为空时 触发
    doEleChang () {
      this.formValidate.codeOrName = ''
      this.onSearch()
    },
    exportExcel () {
      let req = {
        unitFormId: this.formValidate.form === 0 ? null : this.formValidate.form,
        codeOrName: this.formValidate.codeOrName,
        companyIdList: this.formValidate.company,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/businessUnit/exportExcel', req, 'blob').then(res => {
        let postfix = res.headers ? res.headers['content-disposition'] ? res.headers['content-disposition'].split('.')[1] : 'xls' : 'xls'
        this.$download(res.data, '业务单元列表', 'elementExport', postfix)
      })
    },
    // 新增
    toCreateUnit () {
      this.doLocationDetail('create_element')
    },
    // 表格配置
    doSetTable () {
      this.drawer = true
      // this.showTableSetter = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.isXTable = false
        this.doGettableHeader()
        this.doInit()
      }
      this.drawer = false
    },
    setComName (data) {
      this.companyId = data.id
      this.formValidate.company = data.name
      this.showCompanies = false
    },
    setShowFlag (data) {
      this.showCompanies = data
    },
    doDeleteBusinessUnit ({ row }) {
      this.handleToggle()
      let req = {
        id: row.id,
        companyId: row.companyId,
        isRef: row.isRef
      }
      this.rowInTabel = req
    },
    // 多选
    onSelectCheckboxChange (data) {
      this.selectMore = data.selection
    },
    // 取消全选
    onSelectAllCancel () {
      this.selectMore = []
    },
    // 批量删除 -- 弹窗
    selectMany () {
      this.selMore = true
      if (this.selectMore.length) {
        this.handleToggle()
      } else {
        this.$Message.info('必须在列表中至少选择一条数据才能点击删除！')
      }
    },
    // 删除Model
    handleToggle () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl()
          that.doDeleteConfirm()
        },
        cancel () {
          that.selMore = false
          that.$CloseCtl()
        }
      })
    },
    // 删除功能 - 弹窗是
    doDeleteConfirm () {
      if (this.selMore) {
        // 批量删除
        let req = []
        this.selectMore.forEach(item => {
          req.push(item.id)
        })
        this.$request.post('/financeback/businessUnit/deleteBatch', { idList: req }).then(res => {
          let { data } = res.data
          if (res.status === 200) {
            this.batchHandleModal = true
            this.batchhandleColumns = this.batchDeleteColumns
            let dataList = []
            this.selectMore.forEach(m => {
              data.successList.forEach(n => {
                if (m.id === n) {
                  // 删除成功
                  dataList.push({
                    code: m.code,
                    name: m.name,
                    companyName: m.companyName,
                    unitFormId: m.unitFormId,
                    isAccountEntity: m.isAccountEntity,
                    referenceDescription: n.referenceDescription
                  })
                }
              })
              data.failList.forEach(n => {
                if (m.id === n.businessId) {
                  // 删除失败
                  dataList.push({
                    code: m.code,
                    name: m.name,
                    companyName: m.companyName,
                    unitFormId: m.unitFormId,
                    isAccountEntity: m.isAccountEntity,
                    referenceDescription: n.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = dataList
            let success = data.successList ? data.successList.length : 0
            let fail = data.failList ? data.failList.length : 0
            this.checked = '删除成功' + success + '条,' + '删除失败' + fail + '条'
            this.doInit()
            this.selectMore = []
          }
        })
      } else {
        // 单个删除
        this.$request.post('/financeback/businessUnit/deleteBatch', { idList: [this.rowInTabel.id] }).then(res => {
          let { status, message, data } = res.data
          if (status === 'success') {
            if (data.successList.length) {
              this.$Message.success('删除成功！')
              this.doInit()
              this.selectMore.forEach((item, index, arr) => {
                if (item.id === this.rowInTabel.id) {
                  arr.splice(index, 1)
                  this.selectMore = arr
                }
              })
            } else {
              this.$Message.error(data.failList[0].referenceDescription)
            }
          } else {
            this.$Message.error(message)
          }
        })
      }
      this.selMore = false
    },
    // 删除功能 - 弹窗否
    doDeny () {
      this.selMore = false
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
    },
    // 点击导入按钮
    doImport () {
      this.isupload = true
    },
    // 选项 -- 未启用
    handleConfirmOption (params) {
      let _reqParam = [{
        menuCode: this.$route.name,
        dataType: 'code',
        optionValue: params.params1
      }]
      this.$request.post('/financeback/sysMenuOption/updateMenuOption', _reqParam).then(res => {
        if (res.data.status === 'success') {
          this.$Message.success('设置成功！')
          this.visible = false
        }
      })
    },
    // 重置
    handleReset () {
      this.isClear = true
      this.formValidate = {
        form: 0,
        company: [],
        codeOrName: ''
      }
      this.selectMore = []
      this.doInit()
    },
    // 分页功能
    doUpdateCurrentPage (val) {
      this.selectMore = []
      this.page.current = val
      this.doInit()
    },
    // 改变每页条数
    doUpdatePageSize (val) {
      this.selectMore = []
      this.page.size = val
      this.doUpdateCurrentPage(1)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/base.less';
  .element-container {
    .span-space {
      .span-space(8px, 0)
    }
    .tableHeight {
      height: 36px;
    }
    .ivu-input-group{
      top:0
    }
    // 消除搜索按钮偏移
    .page-content
    .query-condition
    .query-condition-lf
    .screen
    button{
      margin-right:-0.5rem;
    }
    .ivu-col {
      padding-top: 16px !important;
    }
    .page-content {
      padding: 3px 16px;
      .page-content-table{
        position: relative;
        padding-bottom: 10px;
      }
    }
    .query-change {
      position: relative;
      left: -8px
    }
    .company-input {
      display: inline-block;
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  }
  .box-container {
    overflow: hidden;
  }
</style>
<style lang="less">
@import "./business/title.less";
@import '../../assets/css/redefine.less';
.element-container {
    .doUpload{
    .ivu-modal-wrap{
      position: absolute;
      left: 8px;
      .ivu-modal{
        position: absolute;
        top:0;
        width:100% !important;
        // left: 8px;
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
}
.element-container .screen .ivu-input-icon-clear {
  right: 32px;
  position: absolute;
}
.query-conditions {
  .ivu-input-icon-clear {
    right: 32px;
    position: absolute;
  }
}
</style>
