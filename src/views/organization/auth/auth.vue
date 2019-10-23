<template>
  <div class="auth-container">
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="page-header">
      <div class="page-header-name">岗位权限列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doCreate()">新增</Button>
        <Button @click="doBacthDelete" >删除</Button>
        <Button @click="showOptDrawer">选项</Button>
        <Button @click="doBacthDisable" >禁用</Button>
        <Button @click="doBacthUnDisable" >反禁用</Button>
        <Button @click.native = "doClickConfig">
          <common-icon type="_table"></common-icon>
        </Button>
        <Button icon="md-refresh" @click="doRefresh"></Button>
      </div>
    </div>
    <div class="page-content">
      <div class="query-condition">
        <div class="screen">
          <Select class="select-width query-select" v-model="isEnable" placeholder="全部数据状态" @on-change="changeDataStatus">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input class="query-input" v-model="commParams.orMatch" placeholder="岗位权限编码/名称" :maxlength="40" @on-enter="enterAuthName" @on-clear="enterAuthName" @on-change="doInputChange" clearable/>
          <Button class="btn-query-input" slot="append" icon="ios-search" @click="enterAuthName"></Button>
          <Button @click="doReset">重置</Button>
        </div>
      </div>
      <div :class="tableLoading ? 'period-table page-content-table' : 'period-table-no page-content-table'">
        <Spin fix v-if="tableLoading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <vxe-table
          ref="xTable"
          :data="tableData"
          :height="tableHeight"
          v-if="isXTable"
          @select-all="doSelectTableData"
          @select-change="doSelectTableData"
        >
          <template v-for="item in tableColumns">
            <vxe-table-column type="selection" width="40" v-if="item.key === 'selection'" :key="item.key" :resizable="false"></vxe-table-column>
            <vxe-table-column field="code" title="编码" :min-width="item.minWidth" v-else-if="item.key === 'code'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doLocationDetail('update_auth', { roleId: row.roleId })">{{row.code}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isEnable" title="岗位状态" :min-width="item.minWidth" v-else-if="item.key === 'isEnable'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isEnable === 0" class="accountant-point"></span>
                  <span v-show="row.isEnable === 0" class="no-accountant">已失效</span>
                  <span v-show="row.isEnable === 1" class="accountant-point2"></span>
                  <span v-show="row.isEnable === 1" class="already-accountant">已生效</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'opreationColumn'" :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span table-right" v-show="row.isEnable === 0" @click="doUnDisable({ row })">反禁用</span>
                  <span class="table-span table-right" v-show="row.isEnable === 1" @click="doDelete({ row })">删除</span>
                  <span class="table-span table-right" v-show="row.isEnable === 1" @click="doDisable({ row })">禁用</span>
                  <span class="table-span table-right" v-show="row.isEnable === 1" @click="doDocuments({ row })">查看用户</span>
                </div>
              </template></vxe-table-column>
            <vxe-table-column :field="item.key" :title="item.title" :min-width="item.minWidth" v-else :key="item.key"></vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-table>
      </div>
    </div>
    <div class="page-footer" v-if="tableData.length!==0">
      <div class="page-footer-lf">
        已选择<strong>{{selectData.length}}</strong>项，共 {{total}} 条数据
      </div>
      <div class="page-footer-rt">
        <Page id="pageId"
        class-name="pages"
        :total="total"
        :current="current"
        :page-size="size"
        :page-size-opts="[20, 50, 100, 200, 500, 1000]"
        @on-page-size-change="changePageSize"
        @on-change="handleChangePage"
         show-elevator
         show-sizer />
        <Button size="small" @click="doGoPage('pageId')">Go</Button>
      </div>
    </div>
    <table-config @close="doTableClose" :drawer="configDrawerShow" ></table-config>
    <Drawer class="query-user" :title="'查看用户-'+title" :transfer="false" :closable="true" v-model="showDocuments" width="330">
      <div class="consumption-single-con">
        <Table :columns="checkColumns" :data="checkData"></Table>
      </div>
    </Drawer>
     <!-- 批量提示 -->
    <batch-handle-modal
    @modalClose="doCloseBatchAccount"
    :batchHandleModal="batchHandleModal"
    :titleName="titleName"
    :checked="checked"
    :batchhandleColumns="batchhandleColumns"
    :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 选项 -->
    <OptionsDrawer
      v-model="visible"
      :config="config"
      :option-config="options_config"
      @close="visible = false"
      @confirm="handleConfirmOption">
    </OptionsDrawer>
  </div>
</template>

<script type="text/jsx">
import { mapMutations } from 'vuex'
import { saasMixin } from '@/libs/mixins.js'
import nodata from '_c/nodata'
import { sortArr, getHeight } from '@/libs/tools.js'
import CommonIcon from '_c/common-icon'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import batchHandleModal from '_c/batchHandleModal'
import OptionsDrawer from '_c/optionsDrawer' // 选项
export default {
  name: 'auth_index',
  components: {
    nodata,
    CommonIcon,
    tableConfig,
    batchHandleModal,
    OptionsDrawer
  },
  data () {
    return {
      isXTable: false,
      tableHeight: 36,
      loading: false, // loading框的出现
      tableLoading: false, // table的loading
      isAllConfig: false, // 判断是否是全部查询
      isEnable: -1,
      commParams: {
        orMatch: ''
      },
      total: null, // 总数据
      current: 1, // 当前页
      size: 20, // 每页展示的个数
      pages: null, // 总页数
      userId: null,
      roleId: null,
      title: '',
      allSelectIds: [], // 批量的id
      singleDisableId: [], // 单个禁用的数据id
      isAllDisable: false, // 是否为批量禁用
      singleDeleteId: [], // 单个删除的数据id
      isAllDelete: false, // 是否为批量删除
      singleUnDisableId: [], // 单个反禁用的数据id
      isAllUnDisable: false, // 是否为批量反禁用
      showDocuments: false,
      authName: '',
      dataStatus: '',
      cityList: [
        {
          value: -1,
          label: '全部'
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
      tableColumns: [],
      codeColumns: {
        title: '岗位编码',
        key: 'code',
        tooltip: true,
        className: 'primary',
        render: (h, { row }) => {
          return (
            <div>
              <span class="table-mobile" style="cursor: pointer;" on-click={ this.doLocationDetail.bind(this, 'update_auth', { roleId: row.roleId }) }>{row.code}</span>
            </div>
          )
        }
      },
      header: {
        key: 'selection'
      },
      tableColumn: [
        {
          title: '岗位名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '岗位描述',
          key: 'remark',
          minWidth: 100
        },
        {
          title: '岗位状态',
          key: 'isEnable',
          minWidth: 150
        }
      ],
      opreation: {
        title: '操作',
        key: 'opreationColumn'
      },
      getTableList: [], // 接口获取的表头数组
      tableData: [], // 列表数据
      checkColumns: [
        {
          title: '用户手机号码',
          key: 'mobile'
        },
        {
          title: '用户名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '操作',
          width: 70,
          render: (h, { row }) => {
            return (
              <div>
                <span class="table-span table-span2" on-click={ this.doDeleteCheck.bind(this, { row }) }>删除</span>
              </div>
            )
          }
        }
      ],
      checkData: [],
      selectData: [], // 多选的数据
      configDrawerShow: false,
      batchHandleModal: false, // 批量启用/反启用成功提示
      titleName: '', // 批量启用/反启用成功提示的标题
      checked: '', // 批量启用/反启用成功提示的check
      batchhandleColumns: [ // 批量启用/反启用成功提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center',
          className: 'table-index'
        },
        {
          title: '详情',
          key: 'details'
        },
        {
          title: '状态',
          key: 'status',
          width: 100,
          render: (h, params) => {
            return h('span', params.row.status === 0 ? '失败' : '成功')
          }
        },
        {
          title: '说明',
          key: 'directions',
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.status === 0 ? '#fa790e' : '#00a597'
              }
            }, params.row.directions)
          }
        }
      ],
      batchhandleData: [], // 批量启用/反启用成功提示的表格数据
      height: getHeight(83),
      visible: false, // 抽屉显示
      config: {
        title: '选项',
        closeBtn: true,
        shadowClose: false,
        footer: true,
        placement: 'right',
        width: 300
      },
      options_config: null
    }
  },
  mixins: [saasMixin],
  mounted () {
    this.loading = true
    this.doGettableHeader()
    this.querySchemeList()
  },
  activated () {
    if (this.$store.state.user.isRefreshTable) {
      this.doRefresh()
      this.$store.commit('setIsRefreshTable', false)
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    async showOptDrawer () {
      let _res = await this.$request.post('/financeback/sysMenuOption/findMenuOption', { menuCode: this.$route.name }).then(res => {
        const { status, data } = res.data
        if (status === 'success' && data.globalMenuOptionList.length && data.localMenuOptionList.length) {
          this.options_config = [
            {
              type: 'radio',
              title: '',
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
    // 获取表格
    doGettableHeader () {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.$route.name, // 菜单编码
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
          that.tableColumns.unshift(this.codeColumns)
          that.tableColumns.unshift(this.header)
          this.isXTable = true
        }
      })
    },
    // 即时查询----下拉框选择值改变
    changeDataStatus (value) {
      this.querySchemeList()
    },
    // 即时查询----输入内容，按下回车键触发
    enterAuthName () {
      this.querySchemeList()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (!this.commParams.orMatch) {
        this.commParams.orMatch = ''
        this.querySchemeList()
      }
    },
    // 查询列表
    querySchemeList () {
      let that = this
      let reqdata = {
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.selectData = []
      this.allSelectIds = []
      reqdata.isEnable = this.isEnable === -1 ? '' : this.isEnable
      reqdata.commParams = this.commParams
      that.tableLoading = true
      this.$request.post('/financeback/sysRole/findPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          that.loading = false
          that.tableLoading = false
          if (data.records.length === 0 && data.current >= 2) {
            this.current--
            this.querySchemeList()
          } else {
            let newSelectArr = []
            this.total = data.total
            this.size = data.size
            this.current = data.current
            this.tableData = data.records
            this.getListIds({ ids: data.records.map(n => { return n.roleId }), name: 'auth' })
            this.tableData.forEach(function (item) {
              that.allSelectIds.forEach(function (id) {
                if (item.roleId === id) {
                  that.$set(item, '_checked', true)
                  newSelectArr.push(item)
                }
              })
            })
            if (that.tableData.length === 0) {
              that.tableHeight = 36
            } else {
              that.tableHeight = this.height
            }
          }
        }
      })
    },
    handleChangePage (pageNo) {
      this.current = pageNo
      this.querySchemeList()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.querySchemeList()
    },
    // GO按钮跳转
    doGoPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 列表多选
    doSelectTableData (data) {
      this.selectData = data.selection
      this.allSelectIds = data.selection.map(n => n.roleId)
    },
    // 新增-去新增页
    doCreate () {
      this.doLocationDetail('create_auth')
    },
    // 抽屉中---点击删除
    doDeleteCheck (data) {
      // this.removeModal = true
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '用户的所有公司下的此岗位权限将被全部删除？删除后将不可恢复！请确认？',
        button: ['确认', '取消'],
        yes () {
          that.doUserModalDeleteOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.userId = data.row.userId
    },
    // 用户删除modal里的确定
    doUserModalDeleteOk () {
      let reqdata = {
        userId: this.userId,
        roleId: this.roleId,
        accountBookEntityId: 0
      }
      this.$request.post('/financeback/sysUser/assignDelete', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('删除成功! ')
          this.showDocuments = false
          this.querySchemeList()
        }
      })
    },
    // 点击单个反禁用
    doUnDisable (data) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: ' 注意：请确认是否要反禁用数据？',
        button: ['确认', '取消'],
        yes () {
          that.doModalUnDisableOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.isAllUnDisable = false
      this.singleUnDisableId = [data.row.roleId]
    },
    // 反禁用modal里的确定
    doModalUnDisableOk () {
      // 批量反禁用的接口
      if (this.isAllUnDisable) {
        let reqdata = {}
        reqdata.roleIds = this.allSelectIds
        this.$request.post('/financeback/sysRole/enableEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let dataList = []
            this.batchHandleModal = true
            this.selectData.forEach(n => {
              data.successList.forEach(i => {
                if (n.roleId === i) {
                  // 反禁用成功
                  dataList.push({
                    status: 1,
                    details: '反禁用:' + n.code + n.name,
                    directions: '反禁用成功'
                  })
                }
              })
              data.failList.forEach(i => {
                if (n.roleId === i.businessId) {
                  // 反禁用失败
                  dataList.push({
                    status: 0,
                    details: '反禁用:' + n.code + n.name,
                    directions: i.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = dataList
            if (!data.failList.length) data.failList.length = 0
            this.checked = '反禁用成功' + data.successList.length + '条，失败' + data.failList.length + '条'
            this.querySchemeList()
          }
        })
      } else {
        let reqdata = {}
        reqdata.roleIds = this.singleUnDisableId
        this.$request.post('/financeback/sysRole/enableEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            if (data.successList.length > 0) {
              this.$Message.success('反禁用成功! ')
            } else {
              this.$Message.error('反禁用失败!失败原因:' + data.failList[0].referenceDescription)
            }
            this.querySchemeList()
          }
        })
      }
    },
    // 点击批量反禁用
    doBacthUnDisable () {
      this.isAllUnDisable = true
      if (this.selectData && this.selectData.length > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: ' 注意：请确认是否要反禁用数据？',
          button: ['确认', '取消'],
          yes () {
            that.doModalUnDisableOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击反禁用！')
      }
    },
    // 点击单个禁用
    doDisable (data) {
      this.isAllDisable = false
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '请确认是否要禁用当前数据，注意，禁用后将无法使用！',
        button: ['确认', '取消'],
        yes () {
          that.doModalDisableOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.singleDisableId = [data.row.roleId]
    },
    // 禁用modal里的确定
    doModalDisableOk () {
      // 批量禁用的接口
      if (this.isAllDisable) {
        let reqdata = {}
        reqdata.roleIds = this.allSelectIds
        this.$request.post('/financeback/sysRole/disableEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let dataList = []
            this.batchHandleModal = true
            this.selectData.forEach(n => {
              data.successList.forEach(i => {
                if (n.roleId === i) {
                  // 禁用成功
                  dataList.push({
                    status: 1,
                    details: '禁用:' + n.code + n.name,
                    directions: '禁用成功'
                  })
                }
              })
              data.failList.forEach(i => {
                if (n.roleId === i.businessId) {
                  // 禁用失败
                  dataList.push({
                    status: 0,
                    details: '禁用:' + n.code + n.name,
                    directions: i.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = dataList
            if (!data.failList.length) data.failList.length = 0
            this.checked = '禁用成功' + data.successList.length + '条，失败' + data.failList.length + '条'
            this.querySchemeList()
          }
        })
      } else {
        let reqdata = {}
        reqdata.roleIds = this.singleDisableId
        this.$request.post('/financeback/sysRole/disableEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            if (data.successList.length > 0) {
              this.$Message.success('禁用成功! ')
            } else {
              this.$Message.error('禁用失败!失败原因:' + data.failList[0].referenceDescription)
            }
            this.querySchemeList()
          }
        })
      }
    },
    // 点击批量禁用
    doBacthDisable () {
      this.isAllDisable = true
      if (this.selectData && this.selectData.length > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: '请确认是否要禁用当前数据，注意，禁用后将无法使用！',
          button: ['确认', '取消'],
          yes () {
            that.doModalDisableOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击禁用！')
      }
    },
    // 点击单个删除
    doDelete (data) {
      this.isAllDelete = false
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '注意：请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.doModalDeleteOk()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.singleDeleteId = [data.row.roleId]
    },
    // 删除modal里的确定
    doModalDeleteOk () {
      if (this.isAllDelete) {
        let reqdata = {}
        reqdata.roleIds = this.allSelectIds
        this.$request.post('/financeback/sysRole/deleteEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            let dataList = []
            this.batchHandleModal = true
            this.selectData.forEach(n => {
              data.successList.forEach(i => {
                if (n.roleId === i) {
                  // 删除成功
                  dataList.push({
                    status: 1,
                    details: '删除:' + n.code + n.name,
                    directions: '删除成功'
                  })
                }
              })
              data.failList.forEach(i => {
                if (n.roleId === i.businessId) {
                  // 删除失败
                  dataList.push({
                    status: 0,
                    details: '删除:' + n.code + n.name,
                    directions: i.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = dataList
            if (!data.failList.length) data.failList.length = 0
            this.checked = '删除成功' + data.successList.length + '条，失败' + data.failList.length + '条'
            this.querySchemeList()
          }
        })
      } else {
        let reqdata = {}
        reqdata.roleIds = this.singleDeleteId
        this.$request.post('/financeback/sysRole/deleteEnterpriseBatch', reqdata).then(response => {
          let { status, data } = response.data
          if (status === 'success') {
            if (data.successList.length > 0) {
              this.$Message.success('删除成功! ')
            } else {
              this.$Message.error('删除失败!失败原因:' + data.failList[0].referenceDescription)
            }
            this.querySchemeList()
          }
        })
      }
    },
    // 点击批量删除
    doBacthDelete () {
      this.isAllDelete = true
      if (this.selectData && this.selectData.length > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: '注意：请确认是否要删除数据？',
          button: ['确认', '取消'],
          yes () {
            that.doModalDeleteOk()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$Message.error('必须在列表中至少选择一条数据才能点击删除！')
      }
    },
    // 查看用户-查看信息
    doDocuments (data) {
      this.showDocuments = true
      this.title = data.row.name
      this.roleId = data.row.roleId
      let reqdata = {
        roleId: data.row.roleId,
        page: {
          size: Number.MAX_SAFE_INTEGER,
          current: 1
        }
      }
      this.$request.post('/financeback/sysUser/findRoleUserPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.checkData = data.records
        }
      })
    },
    // 重置
    doReset () {
      this.isEnable = -1
      this.commParams.orMatch = ''
      this.allSelectIds = []
      this.selectData = []
      this.querySchemeList()
    },
    // 表格配置
    doClickConfig () {
      this.configDrawerShow = true
    },
    // 监听表格配置关闭
    doTableClose (msg) {
      if (msg === 'change') {
        this.isXTable = false
        this.doGettableHeader()
        this.querySchemeList()
      }
      this.configDrawerShow = false
    },
    // 刷新
    doRefresh () {
      this.querySchemeList()
    },
    // 监听授权弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    }
  }
}
</script>
<style lang="less">
@import "../business/title.less";
.auth-container{
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
  .ivu-input-search {
  background: #fafafa;
  color: #ccc;
  border: 1px solid #e5e5e5;
  }
  .query-user {
    .ivu-drawer {
      top: 80px;
    }
    .ivu-drawer-mask {
      bottom: 8px;
      left: 175px;
      top: 80px;
    }
  }
  .ivu-drawer-content {
    position: absolute;
    bottom: 8px;
  }
  .ivu-input-search-icon {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
  }
  .table-span {
    margin-right:24px;
  }
  .table-span-last{
    margin-right:0;
  }
  .table-span2 {
    margin-right: 0px;
  }
}
</style>

<style lang="less" scoped>
@import '../../../assets/css/base.less';
.auth-container {
  .text-btn {
    background-color: #fafafa;
    border-color: #e5e5e5;
  }
  .screen .query-input {
    width: 250px;
  }
  .screen .query-select {
    width: 120px;
    color: #333333;
    margin-right: 8px;
  }
  .screen .btn-query-input {
    margin-right: 8px;
    padding: 3px 14px;
  }
  .table-mobile {
    color: #00a597;
  }
  .tableHeight {
    height: 36px;
  }
  .no-accountant {
    color: #F73E3E;
    vertical-align: middle;
  }
  .already-accountant {
    color: #595959;
    vertical-align: middle;
  }
  .accountant-point {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #F73E3E;
    border-radius: 50%;
    margin-right: 4px
  }
  .accountant-point2 {
    display: inline-block;
    width: 5px;
    height: 5px;
    background-color: #595959;
    border-radius: 50%;
    margin-right: 4px
  }
}
</style>
