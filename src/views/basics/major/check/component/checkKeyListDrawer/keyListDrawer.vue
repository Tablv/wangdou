<template>
  <section class="modal-checkKeyList">
    <Modal v-model="isModalFlag" :z-index="9" class-name="page-modal-checkKeyList  large-modal" :transfer="false" :mask-closable="false" :closable="false" width=100>
      <section class="page-header" slot='header'>
        <div class="page-header-name">自定义核算项目-{{valueList.name}}-值列表</div>
        <div class="page-header-actions">
          <Button type="primary" @click="doCreateCheck">新增</Button>
          <Button @click="doShowTips('doDelete')">删除</Button>
          <Button @click="doShowTips('doProhibit')">禁用</Button>
          <Button @click="doShowTips('doUnProhibit')">反禁用</Button>
          <Button @click="doClickExport">
            <common-icon type="_export" :size="14"/>
          </Button>
          <Button @click="doClickDown">
            <common-icon type="_import" :size="14"/>
          </Button>
          <Button @click="doRefresh">
            <common-icon type="_refresh" :size="14"/>
          </Button>
        </div>
      </section>
      <section class="page-content">
        <div class="query-condition">
          <div class="query-condition-lf">
            <Row class="screen">
              <Col span="4" style="padding-left: 0">
                <multi-select
                :data="companyParams"
                :isClear="isCompanyClear"
                :grop="isGropFlag"
                @on-select="doGetCompanyId"
                @on-visibe-change="doReset"
                isEnterpriseAdmin= "1"
                placeholder="公司编码或名称"
                title="选择公司"
                type="company"
                width="100%">
                  <Row :gutter="10" slot="search">
                    <Col span="3">
                      <Select v-model="companyFormId" @on-change="doSelect">
                        <Option v-for="item in companyFormList" :value="item.value" :key="item.value">{{item.label}}</Option>
                      </Select>
                    </Col>
                    <Col span="5">
                      <Input class="search-button" v-model="companyCodeOrName" placeholder="编码/名称" clearable @on-enter="doSearch" @on-clear="doSearch">
                        <Button slot="append" icon="ios-search" @click="doSearch"></Button>
                      </Input>
                    </Col>
                    <Col span="2">
                      <Button @click="doReset">重置</Button>
                    </Col>
                  </Row>
                </multi-select>
              </Col>
              <Col span="2">
                <Select v-model="queryCriteria.isEnable" @on-change='doTypeChange' placeholder="全部数据状态">
                  <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
              <!-- 编码或名称 -->
              <Col span="4">
                <Input class="search-button" v-model="checkCodeOrName" placeholder="编码/名称"
                @on-enter="doInputEnter"
                @on-change="doInputChange"
                clearable>
                  <Button slot="append" icon="ios-search" @click="doInputEnter"></Button>
                </Input>
              </Col>
              <!-- 重置按钮 -->
              <Col span="1">
                <Button @click="doHandleReset">重置</Button>
              </Col>
            </Row>
          </div>
        </div>
        <div class="page-content-table">
          <vxe-grid
            :resizable="false"
            show-overflow="tooltip"
            show-header-overflow="tooltip"
            :columns="tableColumns"
            :data="tableData"
            :height="tableData.length ? 450 : 0"
            @select-all="doSelectTableData"
            @select-change="doSelectTableData"
            >
            <template v-slot:empty>
              <nodata :icon-size="60" notice-text="暂无数据"></nodata>
            </template>
          </vxe-grid>
          <!-- <Table
          :columns="tableColumns"
          :max-height="450"
          no-data-text=""
          :class="tableData.length ? null : 'tableHeight'"
          :data="tableData"
          @on-selection-change="doSelectTableData"></Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata> -->
        </div>
      </section>
      <section class="page-footer">
        <div class="page-footer-lf">
          已选择<span class="page-footer-span"><strong>{{selection.length}}</strong></span>项，共<span class="page-footer-span">{{total}}</span>条数据
        </div>
        <div class="page-footer-rt">
          <Page id="createCheckId" class-name="pages" :total="total" :current="current" :page-size="size" :page-size-opts="[20, 50, 100, 200, 500, 1000]"
                show-elevator show-sizer @on-page-size-change="doChangeSize" @on-change="doChangeCurrent"/>
          <Button size="small" @click="doGoElevatorPage('createCheckId')">Go</Button>
        </div>
      </section>
      <section slot='footer'>
        <Button type="primary" @click="doSubjectOk">确定</Button>
        <Button type="default" @click="doSubjectCancel">取消</Button>
      </section>
    </Modal>
    <!-- 新增or查看 -->
    <check-show-key :isModal="isShowFlag" :showConfig="keyListConfig" @getResult="getCheckShowResult"></check-show-key>
    <!-- 导入 -->
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" template-type="accounting_item_value"></upload-modal>
    <!-- 批量建账成功提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <a id="create_check_id" style="display: none"></a>
  </section>
</template>
<script>
import CommonIcon from '_c/common-icon'
import multiSelect from '_c/multi-select'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins.js'
import UploadModal from '_c/uploadModal/uploadModal.vue'
// import { getHeight } from '@/libs/tools.js'
import batchHandleModal from '_c/batchHandleModal'
import checkShowKey from '_v/basics/major/check/component/checkKeyListDrawer/checkShowKey'
export default {
  name: 'keyListDrawer',
  components: {
    nodata,
    CommonIcon,
    multiSelect,
    UploadModal,
    batchHandleModal,
    checkShowKey
  },
  props: {
    isModal: {
      type: Boolean,
      default: false
    },
    valueList: {
      type: Object,
      default: () => ({})
    }
  },
  mixins: [saasMixin],
  data () {
    return {
      isCompanyClear: false,
      isGropFlag: true,
      isShowFlag: false,
      keyListConfig: {},
      isModalFlag: false,
      companyParams: { // 公司筛选对象
        companyFormId: '',
        codeOrName: ''
      },
      companyCodeOrName: '', // 编码或名称
      companyFormId: 0, // 公司形态
      companyFormList: [
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
      tableHeight: 36,
      checked: '', // 批量建账成功提示的check
      batchHandleModal: false, // 批量建账成功提示
      drawer: false, // drawer组件的值
      // 行操作数据
      rowData: '',
      selection: [], // 已选的数据
      // 组件配置信息和数据
      check_config: {
        Identification: 0, // 标识，区分是新增还是查看
        title: '新增自定义核算项目大区值',
        width: 300,
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right',
        isIconHelp: true
      },
      formValidate: {
        companyId: null,
        code: '',
        name: '',
        isdisabled: 0,
        valueCodeType: this.valueList.valueCodeType
      },
      checkCodeOrName: '',
      queryCriteria: {
        isEnable: 2,
        codeOrName: null,
        companyIds: []
      },
      loading: false,
      isupload: false, // 导入弹窗
      isHover: false,
      size: 20, // 每页显示的数据个数
      current: 1, // 页码
      total: null, // 数据总数
      formList: [
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
      tableColumns: [
        {
          type: 'selection',
          field: 'selection',
          width: 44,
          multiple: true,
          align: 'center'
        },
        {
          title: '值编码',
          key: 'code',
          field: 'code',
          tooltip: true,
          minWidth: 120,
          slots: {
            header: ({ row, index, column }, h) => {
              return [
                <div>
                  <span style="margin-right: 13px;">编码</span>
                  <Poptip trigger="hover" content="编码规则:项目编码+公司编码+3位流水号" class="header-icon" placement="right" transfer>
                    <Icon type="md-help-circle" size="18"/>
                  </Poptip >
                </div>
              ]
            }
          }
        },
        {
          title: '值名称',
          key: 'name',
          field: 'name',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '描述',
          key: 'remark',
          field: 'remark',
          minWidth: 120,
          tooltip: true
        },
        {
          title: '创建公司',
          key: 'companyName',
          field: 'companyName',
          tooltip: true,
          minWidth: 120
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
        },
        {
          title: '操作',
          fixed: 'right',
          minWidth: 240,
          slots: {
            default: ({ row, index, column }, h) => {
              return [
                <div>
                  <span class="table-span table-right" on-click={this.doShowTips.bind(this, 'doOneDelete', { row })}>删除</span>
                  <span class="table-span" v-show={row.isEnable === 1} on-click={this.doShowTips.bind(this, 'doOneProhibit', { row })}>禁用</span>
                  <span class="table-span" v-show={row.isEnable === 0} on-click={this.doShowTips.bind(this, 'doOneUnProhibit', { row })}>反禁用</span>
                </div>
              ]
            }
          }
        }
      ],
      tableData: [],
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
          tooltip: true,
          minWidth: 90
        }
      ],
      defaultCompanyList: [], // 默认公司列表
      batchhandleData: []// 批量建账成功提示的表格数据
    }
  },
  methods: {
    getCheckShowResult (result) {
      this.isShowFlag = result
    },
    doSubjectOk () {
      this.isShowFlag = false
      this.isModalFlag = false
    },
    doSubjectCancel () {
      this.isShowFlag = false
      this.isModalFlag = false
    },
    /**
     * 公司形态
     */
    doSelect () {
      this.isGropFlag = this.companyFormId === 0
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    /**
     * 编码或名称
     */
    doSearch () {
      let seleStrArr = ['集', '团', '集团', '', '0', '00', '000', '0000']
      let seleFlag = seleStrArr.includes(this.companyCodeOrName)
      this.isGropFlag = this.companyFormId === 0 && seleFlag
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    /**
     * 重置公司组件
     */
    doReset () {
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
      this.queryCriteria.companyIds = itemList.map(item => item.id)
      this.isCompanyClear = false
      this.doCurrentReset()
      this.doGetTableList()
    },
    // 监听授权弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 统一提示模板
    doShowTips (key, row) {
      const tips = {
        doDelete: { title: '确认删除', message: '删除后该条资料不可恢复', type: 'confirm', yes: key },
        doOneDelete: { title: '确认删除', message: '删除后该条资料不可恢复', type: 'confirm', yes: key },
        doProhibit: { title: '确认禁用', message: '禁用后该资料将不可使用', type: 'confirm', yes: key },
        doOneProhibit: { title: '确认禁用', message: '禁用后该资料将不可使用', type: 'confirm', yes: key },
        doUnProhibit: { title: '确认反禁用', message: '反禁后该资料可使用', type: 'confirm', yes: key },
        doOneUnProhibit: { title: '确认反禁用', message: '反禁后该资料可使用', type: 'confirm', yes: key }
      }
      if (this.selection.length || row) {
        this.rowData = row
        this.doShowActionModal(tips[key])
      } else {
        this.$Message.warning('请至少选择一条数据')
      }
    },
    // 打开模态框
    doShowActionModal (msgObj) {
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
    // 批量详情公用方法
    doBatchDetails (failList, successList, message) {
      this.batchhandleData = []
      if (failList.length) {
        failList.forEach(item => {
          this.tableData.forEach((ele, index) => {
            if (item.businessId === ele.id) {
              ele.status = '失败'
              ele.details = `${message}:"${ele.code}"${this.valueList.name}-值列表-${ele.name}`
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
              ele.details = `${message}:"${ele.code}"${this.valueList.name}-值列表-${ele.name}`
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
    /**
     * 行操作-删除
     */
    doOneDelete () {
      let req = {
        ids: [this.rowData.row.id],
        itemId: this.valueList.id,
        versions: [this.rowData.row.version],
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/deleteAccountingItemValueByIds', req).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.failList.length) {
            this.$Message.error('删除失败:' + data.data.failList[0].referenceDescription)
          }
          if (data.data.successList.length) {
            this.$Message.success('删除成功')
          }
          this.doGetTableList()
        }
      })
    },
    // 删除
    doDelete () {
      let req = {
        ids: this.selection.map(item => item.id),
        itemId: this.valueList.id,
        versions: this.selection.map(item => item.version),
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/deleteAccountingItemValueByIds', req).then(res => {
        if (res.data.code === 200) {
          this.doBatchDetails(res.data.data.failList, res.data.data.successList, '删除')
          this.doGetTableList()
        }
      })
    },
    /**
     * 行操作-禁用
     */
    doOneProhibit () {
      let req = {
        ids: [this.rowData.row.id],
        versions: [this.rowData.row.version],
        isEnable: 0,
        IsEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/disableAccountingItemValueBatch', req).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.failList.length) {
            this.$Message.error('禁用失败:' + data.data.failList[0].referenceDescription)
          }
          if (data.data.successList.length) {
            this.$Message.success('禁用成功')
          }
          this.doGetTableList()
        }
      })
    },
    // 禁用
    doProhibit () {
      let params = {
        ids: this.selection.map(item => item.id),
        versions: this.selection.map(item => item.version),
        isEnable: 0,
        IsEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/disableAccountingItemValueBatch', params).then(res => {
        if (res.data.code === 200) {
          this.doBatchDetails(res.data.data.failList, res.data.data.successList, '禁用')
          this.doGetTableList()
        }
      })
    },
    /**
     * 行操作-反禁用
     */
    doOneUnProhibit () {
      let params = {
        ids: [this.rowData.row.id],
        versions: [this.rowData.row.version],
        isEnable: 1,
        IsEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/enableAccountingItemValueBatch', params).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.failList.length) {
            this.$Message.error('反禁用失败:' + data.data.failList[0].referenceDescription)
          }
          if (data.data.successList.length) {
            this.$Message.success('反禁用成功')
          }
          this.doGetTableList()
        }
      })
    },
    // 反禁用
    doUnProhibit () {
      let params = {
        ids: this.selection.map(item => item.id),
        versions: this.selection.map(item => item.version),
        isEnable: 1,
        IsEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/enableAccountingItemValueBatch', params).then(res => {
        if (res.data.code === 200) {
          this.doBatchDetails(res.data.data.failList, res.data.data.successList, '反禁用')
          this.doGetTableList()
        }
      })
    },
    // 新增和查看事件
    doCreateCheck (val) {
      this.isShowFlag = true
      this.keyListConfig = {
        title: '新增值-大区',
        row: {},
        valueList: this.valueList
      }
    },
    // 获取默认公司
    // doGetDefaultCompanList () {
    //   let params = {
    //     isEnterpriseAdmin: 1,
    //     menuCode: 'check_index',
    //     page: { size: 1000, current: 1 },
    //     rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId
    //   }
    //   this.$request.post('/financeback/company/findCompanyPage', params).then(({ data }) => {
    //     if (data.code === 200) {
    //       this.queryCriteria.companyIds = []
    //       // this.queryCriteria.companyIds = [...data.data.records.map(item => item.id), 0]
    //       this.defaultCompanyList = this.queryCriteria.companyIds
    //       this.doGetTableList()
    //     }
    //   })
    // },
    // 获取数据列表
    doGetTableList () {
      let req = {
        itemId: this.valueList.id,
        isEnable: this.queryCriteria.isEnable === 2 ? null : this.queryCriteria.isEnable,
        codeOrName: this.queryCriteria.codeOrName,
        companyIds: this.queryCriteria.companyIds,
        isEnterpriseAdmin: 1,
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.selection = []
      this.loading = true
      this.$request.post('/financeback/accountingItemValue/findAccountingItemValueList', req).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          if (!res.data.data.records.length && this.current > 1) {
            this.doChangeCurrent(--this.current)
          }
          this.size = res.data.data.size
          this.current = res.data.data.current
          this.total = res.data.data.total
          this.tableData = res.data.data.records
          this.tableData.forEach(item => {
            if (item.companyId === 0) {
              item.companyName = '集团'
              item.useCompanyName = '全部'
            }
          })
          if (this.tableData.length === 0) {
            this.tableHeight = 36
          } else {
            let Height = parseInt(document.querySelector('.page-modal-checkKeyList').offsetHeight)
            this.tableHeight = Height - 200
          }
        }
      })
    },
    // 点击刷新按钮
    doRefresh () {
      this.doGetTableList()
    },
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
      this.doGetTableList()
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
    },
    doTypeChange () {
      this.doCurrentReset()
      this.doGetTableList()
    },
    doHandleReset () {
      // 重置公司组件 -- 解决bug
      this.isCompanyClear = true
      this.queryCriteria.isEnable = 2
      this.queryCriteria.codeOrName = null
      this.queryCriteria.companyIds = []
      this.checkCodeOrName = null
      this.doCurrentReset()
      this.doGetTableList()
    },
    doCurrentReset () {
      this.current = 1
    },
    doInputEnter () {
      this.queryCriteria.codeOrName = this.checkCodeOrName
      this.doCurrentReset()
      this.doGetTableList()
    },
    doInputChange () {
      if (!this.checkCodeOrName && this.queryCriteria.codeOrName) {
        this.doInputEnter()
      }
    },
    // 点击导出
    doClickDown () {
      let req = {
        isEnable: this.queryCriteria.isEnable === 2 ? null : this.queryCriteria.isEnable,
        codeOrName: this.queryCriteria.codeOrName,
        companyIds: this.queryCriteria.companyIds,
        itemId: this.valueList.id,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/accountingItemValue/exportAccountingItemValueExcel', req, 'blob').then(({ headers, data }) => {
        let suffix = headers['content-disposition'].split('.')[1]
        const aLink = document.getElementById('create_check_id')
        let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
        aLink.href = URL.createObjectURL(blob)
        aLink.download = `自定义核算项目${valueList.name}值列表.${suffix}` // 设置下载文件名称
        aLink.click()
        document.body.appendChild(aLink)
      })
    },
    // 获取要删除的数组
    doSelectTableData ({ selection }) {
      this.selection = selection
    },
    // 数据分页
    doChangeSize (val) {
      this.size = val
      this.doChangeCurrent(1)
    },
    doChangeCurrent (val) {
      this.current = val
      this.doGetTableList()
    },
    doOptionSwitch () {
      this.optionFlag = !this.optionFlag // 选项开关
    },
    // 分页信息跳转到第几页
    doGoElevatorPage (pageId) {
      this.goElevatorPage(pageId)
    }
  },
  watch: {
    isModal () {
      this.isModalFlag = true
      this.doGetTableList()
    }
  }
}
</script>
<style lang="less">
.check_index {
  .modal-checkKeyList {
    .batchHandleModal {
     .batchAlert {
       z-index: 10000;
     }
    }
    .tableHeight {
      height: 36px;
    }
    // 模态框样式
    .page-modal-checkKeyList {
      z-index: 99;
      position:absolute;
      .ivu-modal-mask {
       position: absolute;
       left: 8px;
      }
      .ivu-modal{
        top:0;
        padding-left: 8px;
        .ivu-modal-content{
          border-radius: 0;
          .ivu-modal-header {
            padding: 0;
            .page-header {
              border-bottom: 0;
              .page-header-name {
                font-weight: bold;
              }
            }
          }
          .ivu-modal-body {
            padding: 0;
            .page-content {
              padding-top: 0px;
              padding-bottom: 35px;
              .query-title{
                padding-right: 10px;
                padding-top: 16px;
              }
              .query-condition .query-condition-lf {
                .screen {
                  //消除间距
                  .first-nospace {
                    padding-left: 0;
                  }
                }
                .ivu-modal-header {
                  padding: 16px;
                }
                .ivu-modal-body {
                  padding: 16px;
                  padding-top: 0px;
                }
              }
              .page-content-table {
                .ivu-table-cell {
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
                  .ivu-poptip-popper {
                    left: 105px !important;
                  }
                }
              }
            }
            .page-footer{
              bottom: 63px;
              .page-footer-span {
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
