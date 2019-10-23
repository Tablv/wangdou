<template>
  <div class="post-user-container">
    <Spin fix v-if="loading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="page-header">
      <div class="page-header-name">用户列表</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doCreateUser">新增</Button>
        <Button class="span-space" @click="doBackthCreateUser">批量新增</Button>
        <Button class="span-space" @click="doBacthDelete">删除</Button>
        <Button class="span-space" @click="doBacthDisable">禁用</Button>
        <Button class="span-space" @click="doBacthEnable">反禁用</Button>
        <!-- 导出 -->
        <Button @click.native="doClickDown"><common-icon type="_import" :size="14"></common-icon></Button>
        <!-- 表格配置 -->
        <Button class="span-space" @click.native="doClickConfig"><common-icon type="_table"></common-icon></Button>
        <!-- 刷新 -->
        <Button icon="md-refresh" @click="doRefresh"></Button>
      </div>
    </div>
    <div class="page-content">
      <div class="query-condition">
        <Select class="select-width query-select" v-model="dataStatus" placeholder="全部数据状态" @on-change="changeDataStatus">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input class="query-input" v-model="userName" placeholder="用户手机号码/姓名" @on-enter="enterUserName" @on-clear="enterUserName" @on-change="doInputChange" clearable/>
        <Button class="btn-query-input" slot="append" icon="ios-search" @click="enterUserName"></Button>
        <Button class="span-space query-button" @click="doReset">重置</Button>
      </div>
      <div  :class="tableLoading ? 'period-table page-content-table' : 'period-table-no page-content-table'">
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
            <vxe-table-column field="mobile" title="用户手机号" :min-width="item.minWidth" v-else-if="item.key === 'mobile'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="doMobile({ row })">{{row.mobile}}</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column field="isEnable" title="数据状态" :min-width="item.minWidth" v-else-if="item.key === 'isEnable'" :key="item.key">
              <template v-slot="{ row }">
                <div>
                  <span v-show="row.isEnable === 0" class="accountant-point"></span>
                  <span v-show="row.isEnable === 0" class="no-accountant">已失效</span>
                  <span v-show="row.isEnable === 1" class="accountant-point2"></span>
                  <span v-show="row.isEnable === 1" class="already-accountant">已生效</span>
                </div>
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else-if="item.key === 'opreationCol'" :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span table-right" v-show="row.isEnable === 0" @click="doEnable({ row })">反禁用</span>
                  <span class="table-span table-right" v-show="row.isEnable === 1" @click="doDelete({ row })">删除</span>
                  <span class="table-span table-right" v-show="row.isEnable === 1" @click="doDisable({ row })">禁用</span>
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
    <div class="page-footer" v-if="tableData.length > 0">
      <div class="page-footer-lf">
        已选择<strong>{{dataCount}}</strong>项，共 {{total}} 条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="pageId"
          class-name="pages"
          :total="total"
          :current="current"
          :page-size="size"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          show-elevator
          show-sizer
          @on-page-size-change="changePageSize"
          @on-change="handleChangePage" />
        <Button size="small" @click="doGoPage('pageId')">Go</Button>
      </div>
    </div>
    <!-- 表格配置 -->
    <table-config @close="doTableClose" :drawer="drawer"></table-config>
    <!-- 批量删除成功提示 -->
    <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 引入用户 -->
    <Modal
      class="lead-user-modal"
      draggable
      scrollable
      v-model="showLeadUser"
      title="选择用户"
      :transfer="false"
      width="1000"
      @on-ok="doBatchCreateUser"
      @on-cancel="doCancel"
      @mousemove.native="onMouseUpModal"
      @mouseup.native="onMouseUpModal"
      >
      <div class="centent">
        <div class="query-condition">
          <Select class="select-width query-select" disabled placeholder="已生效">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input class="query-inputmad" v-model="orMatchModal" clearable placeholder="用户手机号码/姓名" search @on-search="enterOrMatchModal" @on-clear="enterOrMatchModal"/>
          <Button class="span-space query-button" @click="doResetModal">重置</Button>
        </div>
        <Row class="centent-row">
          <Col span="13">
            <div class="letf-title">
              待选用户
            </div>
            <Table ref="modalTable" :columns="modalColumns" :loading="modalLoading" max-height="360" :class="modalData.length ? null : 'tableHeight initTable'" :data="modalData" @on-selection-change="doSelectModalData"></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="modalData.length===0"></nodata>
          </Col>
          <Col span="11">
            <Row>
              <Col span="12" class="letf-title">
                已选用户(<span class="table-span modal-span">{{selectUser.length}}</span>)
              </Col>
              <Col span="12" class="right-title">
                <span class="table-span" @click="doCloseModalData">清空</span>
              </Col>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectUser" :key="index" class="selected-div">
                {{item.mobile + '-' + item.name}}
                <Icon type="md-close" @click="doIconDeleteUser(item)" class="modal-icon"/>
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page" v-if="modalData.length > 0">
          <div class="div-page-lf">
            共 {{totalModal}} 条数据
          </div>
          <div class="div-page-btn">
            <Page
              id="modalPageId"
              class-name="pages"
              :total="totalModal"
              :current="currentModal"
              :page-size="sizeModal"
              :page-size-opts="[20, 50, 100, 200, 500, 1000]"
              show-elevator
              show-sizer
              @on-page-size-change="changeModalPageSize"
              @on-change="handleModalChangePage"
            />
            <Button size="small" @click="goModalElevatorPage('modalPageId')">Go</Button>
          </div>
        </div>
      </div>
    </Modal>
    <a id="exportFlag" style="display: none"></a>
  </div>
</template>

<script type="text/jsx">
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
import { session } from '@/libs/location.js'
import nodata from '_c/nodata'
import { sortArr, getHeight } from '@/libs/tools.js'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import batchHandleModal from '_c/batchHandleModal'
export default {
  name: 'user_index',
  components: {
    CommonIcon,
    nodata,
    tableConfig,
    batchHandleModal
  },
  data () {
    return {
      isXTable: false,
      tableHeight: 36,
      loading: false, // 加载
      tableLoading: false, // table的loading
      modalLoading: false,
      drawer: false, // drawer组件的值
      singleDeleteId: [], // 单个删除的数据id
      singleDisableId: [], // 单个禁用的数据id
      singleUnDisableId: [], // 单个反禁用的数据id
      showLeadUser: false, // 引入用户
      batchHandleModal: false, // 批量删除成功提示
      checked: '', // 批量删除成功提示的check
      userName: '', // 用户手机号码/姓名
      dataStatus: 2,
      cityList: [
        {
          value: 2,
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
      header: {
        key: 'selection'
      },
      firstCol: {
        title: '用户手机号',
        key: 'mobile',
        minWidth: 130
      },
      tableColumn: [
        {
          title: '用户姓名',
          key: 'name',
          minWidth: 100
        },
        {
          title: '公司编码',
          minWidth: 100,
          key: 'companyCodes'
        },
        {
          title: '公司',
          minWidth: 100,
          key: 'companyNames'
        },
        {
          title: '核算主体范围',
          minWidth: 100,
          key: 'accountBookEntityNames'
        },
        {
          title: '数据状态',
          key: 'isEnable',
          minWidth: 90
        }
      ],
      opreation: {
        title: '操作',
        key: 'opreationCol'
      },
      tableData: [],
      modalColumns: [
        {
          type: 'selection',
          width: 44,
          align: 'center'
        },
        {
          title: '用户手机号码',
          key: 'mobile'
        },
        {
          title: '用户姓名',
          key: 'name'
        },
        {
          title: '数据状态',
          key: 'isEnable',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  backgroundColor: params.row.isEnable === 0 ? '#f73e3e' : '#595959',
                  borderRadius: '50%',
                  marginRight: '4px'
                }
              }),
              h('span', {
                style: {
                  color: params.row.isEnable === 0 ? '#f73e3e' : '#595959',
                  verticalAlign: 'middle'
                }
              }, params.row.isEnable === 0 ? '已失效' : '已生效')
            ])
          }
        }
      ],
      modalData: [],
      selectData: [], // 多选的数据
      total: null, // 主页分页总数据个数
      size: 20, // 主页分页每页显示的数据个数
      current: 1, // 主页分页当前页
      dataCount: 0, // 选中的数据个数
      userIds: [], // 多选数据的id
      totalModal: null, // 弹框分页总数据个数
      sizeModal: 20, // 弹框分页每页显示的数据个数
      currentModal: 1, // 弹框分页当前页
      orMatchModal: '', // 弹框中查询条件
      selectUser: [], // 弹框选中的数据
      sessionSelectUser: [],
      batchhandleColumns: [ // 批量启用/反启用成功提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center',
          tooltip: true,
          className: 'table-index'
        },
        {
          title: '详情',
          tooltip: true,
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
          tooltip: true,
          render: (h, params) => {
            return h('span', {
              style: {
                color: params.row.status === 0 ? '#fa790e' : '#00a597'
              }
            }, params.row.directions)
          }
        }
      ],
      batchhandleData: [], // 批量建账成功提示的表格数据
      height: getHeight(126)
    }
  },
  mixins: [saasMixin],
  created () {
    this.doInit()
  },
  mounted () {
    this.loading = true
    this.doGettableHeader()
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
    // 获取表头
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
          that.tableColumns.unshift(this.header, this.firstCol)
          that.tableColumns.push(this.opreation)
          this.isXTable = true
        }
      })
    },
    // 即时查询----下拉框选择值改变
    changeDataStatus (value) {
      this.dataStatus = value
      // 走查询接口
      this.doInit()
    },
    // 即时查询----输入内容，按下回车键触发
    enterUserName (value) {
      // 走查询接口
      this.doInit()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (!this.userName) {
        this.userName = ''
        this.doInit()
      }
    },
    // 点击刷新
    doRefresh () {
      // 走查询接口
      this.doInit()
    },
    // 点击导出
    doClickDown () {
      let reqdata = {
        isEnable: this.dataStatus === 2 ? '' : this.dataStatus,
        commParams: {
          orMatch: this.userName
        }
      }
      this.$request.post('/financeback/sysUser/exportExcel', reqdata, 'blob').then(res => {
        let postfix = res.headers ? res.headers['content-disposition'] ? res.headers['content-disposition'].split('.')[1] : 'xls' : 'xls'
        this.$download(res.data, '用户列表', 'exportFlag', postfix)
      })
    },
    // 点击表格配置
    doClickConfig () {
      this.drawer = true
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
    // 初始化页面
    doInit () {
      let reqdata = {
        isEnable: this.dataStatus === 2 ? '' : this.dataStatus,
        page: {
          size: this.size,
          current: this.current
        },
        commParams: {
          orMatch: this.userName
        }
      }
      this.tableLoading = true
      this.$request.post('/financeback/sysUser/findPage', reqdata).then(response => {
        let { status, data } = response.data
        this.loading = false
        this.tableLoading = false
        if (status === 'success') {
          if (data.records.length === 0 && data.current >= 2) {
            this.current--
            this.doInit()
          } else {
            this.total = data.total
            this.size = data.size
            this.current = data.current
            // 列表数据
            this.getListIds({ ids: data.records.map(n => { return n.userId }), name: 'user' })
            this.tableData = data.records
            this.tableData.forEach(t => {
              this.selectData.forEach(id => {
                if (t.userId === id.userId) {
                  this.$set(t, '_checked', true)
                }
              })
            })
            if (this.tableData.length === 0) {
              this.tableHeight = 36
            } else {
              this.tableHeight = this.height
            }
          }
        }
      })
    },
    // 点击手机号码
    doMobile (data) {
      // 跳转查看页面
      this.doLocationDetail('update_user', { userId: data.row.userId, isEnable: this.dataStatus, orMatch: this.userName })
    },
    // 列表多选
    doSelectTableData (data) {
      this.userIds = []
      this.selectData = data.selection
      this.dataCount = data.selection.length
      // 获取多选数据的用户id
      data.selection.forEach(d => {
        this.userIds.push(d.userId)
      })
    },
    // 点击新增
    doCreateUser () {
      this.doLocationDetail('create_user', { type: 'insert' })
    },
    // 点击批量删除
    doBacthDelete () {
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
    //  禁用modal里的确定
    doModalDeleteOk () {
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/deleteBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.batchHandleModal = true
          let accounted = []
          for (let i in this.selectData) {
            // 已失效
            if (this.selectData[i].isEnable === 0) {
              this.selectData[i].referenceDescription = '数据已失效！'
            }
          }
          this.selectData.forEach(n => {
            data.successList.forEach(i => {
              if (n.userId === i) {
                // 删除成功
                accounted.push({
                  status: 1,
                  details: '删除:' + n.mobile + n.name,
                  directions: '删除成功'
                })
              }
            })
            data.failList.forEach(i => {
              if (n.userId === i.businessId) {
                // 删除失败
                accounted.push({
                  status: 0,
                  details: '删除:' + n.mobile + n.name,
                  directions: n.referenceDescription
                })
              }
            })
          })
          this.batchhandleData = accounted
          if (!data.failList.length) data.failList.length = 0
          this.checked = '删除成功' + data.successList.length + '个,' + '失败' + data.failList.length + '个'
          this.tableData.forEach(t => {
            this.$set(t, '_checked', false)
          })
          this.selectData = []
          this.dataCount = 0
          this.doInit()
        }
      })
    },
    // 监听授权弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 点击删除
    doDelete (data) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: ' 注意：请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.doDeleteTableData()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.singleDeleteId = [data.row.userId]
    },
    // 点击删除提示确定---确定删除
    doDeleteTableData () {
      let reqdata = {
        userIds: this.singleDeleteId
      }
      this.$request.post('/financeback/sysUser/deleteBatch', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('删除成功!')
          this.doInit()
        }
      })
    },
    // 点击批量禁用
    doBacthDisable () {
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
    // 禁用modal里的确定
    doModalDisableOk () {
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/disableBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.batchHandleModal = true
          let accounted = []
          for (let i in this.selectData) {
            // 已失效
            if (this.selectData[i].isEnable === 0) {
              this.selectData[i].referenceDescription = '数据已失效！'
            }
          }
          this.selectData.forEach(n => {
            data.successList.forEach(i => {
              if (n.userId === i) {
                // 禁用成功
                accounted.push({
                  status: 1,
                  details: '禁用:' + n.mobile + n.name,
                  directions: '禁用成功'
                })
              }
            })
            data.failList.forEach(i => {
              if (n.userId === i.businessId) {
                // 禁用失败
                accounted.push({
                  status: 0,
                  details: '禁用:' + n.mobile + n.name,
                  directions: n.referenceDescription
                })
              }
            })
          })
          if (!data.failList.length) data.failList.length = 0
          this.batchhandleData = accounted
          this.checked = '禁用成功' + data.successList.length + '个,' + '失败' + data.failList.length + '个'
          this.tableData.forEach(t => {
            this.$set(t, '_checked', false)
          })
          this.selectData = []
          this.dataCount = 0
          this.doInit()
        }
      })
    },
    // 点击禁用
    doDisable (data) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: ' 请确认是否要禁用当前数据？注意：禁用后将无法使用！',
        button: ['确认', '取消'],
        yes () {
          that.doDisableTableData()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.singleDisableId = [data.row.userId]
    },
    // 点击禁用提示确定---确定禁用
    doDisableTableData () {
      let reqdata = {
        userIds: this.singleDisableId
      }
      this.$request.post('/financeback/sysUser/disableBatch', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('禁用成功!')
          this.doInit()
        }
      })
    },
    // 点击批量反禁用
    doBacthEnable () {
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
    // 反禁用modal里的确定
    doModalUnDisableOk () {
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/enableBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.batchHandleModal = true
          let accounted = []
          for (let i in this.selectData) {
            // 已失效
            if (this.selectData[i].isEnable === 1) {
              this.selectData[i].referenceDescription = '数据已生效！'
            }
          }
          this.selectData.forEach(n => {
            data.successList.forEach(i => {
              if (n.userId === i) {
                // 反禁用成功
                accounted.push({
                  status: 1,
                  details: '反禁用:' + n.mobile + n.name,
                  directions: '反禁用成功'
                })
              }
            })
            data.failList.forEach(i => {
              if (n.userId === i.businessId) {
                // 反禁用失败
                accounted.push({
                  status: 0,
                  details: '反禁用:' + n.mobile + n.name,
                  directions: n.referenceDescription
                })
              }
            })
          })
          this.batchhandleData = accounted
          if (!data.failList.length) data.failList.length = 0
          this.checked = '反禁用成功' + data.successList.length + '个,' + '失败' + data.failList.length + '个'
          this.tableData.forEach(t => {
            this.$set(t, '_checked', false)
          })
          this.selectData = []
          this.dataCount = 0
          this.doInit()
        }
      })
    },
    // 点击反禁用
    doEnable (data) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: ' 注意：请确认是否要反禁用当前数据？',
        button: ['确认', '取消'],
        yes () {
          that.doEnableTableData()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
      this.singleUnDisableId = [data.row.userId]
    },
    // 点击反禁用提示确定---确定反禁用
    doEnableTableData () {
      let reqdata = {
        userIds: this.singleUnDisableId
      }
      this.$request.post('/financeback/sysUser/enableBatch', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('反禁用成功!')
          this.doInit()
        }
      })
    },
    // 点击引入用户
    doBackthCreateUser () {
      // 显示引入用户弹框
      this.showLeadUser = true
      // 走查询未引入接口
      this.doModalInit()
    },
    // 引入用户-----点重置
    doResetModal () {
      this.orMatchModal = ''
      // 走查询未引入接口
      this.doModalInit()
    },
    // 引入用户--- 初始化
    doModalInit () {
      let reqdata = {
        page: {
          size: this.sizeModal,
          current: this.currentModal
        },
        commParams: {
          orMatch: this.orMatchModal
        }
      }
      this.modalLoading = true
      this.$request.post('/financeback/sysUser/findNotImportPage', reqdata).then(response => {
        let { status, data } = response.data
        this.modalLoading = false
        if (status === 'success') {
          this.totalModal = data.total
          this.sizeModal = data.size
          this.currentModal = data.current
          this.modalData = data.records
          this.sessionSelectUser = JSON.parse(session.getItem('selectUser'))
          this.modalData.forEach(m => {
            this.selectUser.forEach(s => {
              if (m.userId === s.userId) {
                this.$set(m, '_checked', true)
              }
            })
          })
        }
      })
    },
    // 对话框----列表多选
    doSelectModalData (data) {
      this.selectUser = []
      if (this.sessionSelectUser) {
        this.sessionSelectUser.forEach(a => {
          this.selectUser.push(a)
        })
      }
      data.forEach(d => {
        let item = {
          userId: d.userId,
          name: d.name,
          mobile: d.mobile
        }
        this.selectUser.push(item)
      })
    },
    // 点击删除图标删除用户
    doIconDeleteUser (item) {
      this.modalData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      // 删除用户
      let index = this.selectUser.findIndex(s => s === item)
      if (index !== -1) {
        this.selectUser.splice(index, 1)
      }
      // 删除用户后，对应的列表中的数据取消勾选
      this.modalData.forEach(m => {
        this.selectUser.forEach(s => {
          if (m.userId === s.userId) {
            this.$set(m, '_checked', true)
          }
        })
      })
    },
    // 点击清空删除用户
    doCloseModalData () {
      this.selectUser = []
      this.modalData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      session.setItem('selectUser', JSON.stringify(this.selectUser))
      this.doModalInit()
    },
    // 点击确定，引入用户
    doBatchCreateUser () {
      let reqdata = {
        sysUserDtoList: this.selectUser
      }
      this.$request.post('/financeback/sysUser/addUserBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.$Message.success('引入用户成功!')
          this.showLeadUser = false
          this.doInit()
          this.selectUser = []
          session.setItem('selectUser', JSON.stringify(this.selectUser))
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 监听批量新增对话框的关闭
    doCancel () {
      this.showLeadUser = false
      this.selectUser = []
      session.setItem('selectUser', JSON.stringify(this.selectUser))
    },
    // 对话框-即时查询----输入内容，按下回车键触发
    enterOrMatchModal () {
      this.doModalInit()
    },
    // 对话框----分页
    goModalElevatorPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 对话框----改变当前页
    handleModalChangePage (pageNo) {
      session.setItem('selectUser', JSON.stringify(this.selectUser))
      this.currentModal = pageNo
      this.doModalInit()
    },
    // 对话框----改变每页数量
    changeModalPageSize (e) {
      this.sizeModal = e
      this.doModalInit()
    },
    // 重置
    doReset () {
      this.userName = ''
      this.dataStatus = 2
      this.doInit()
    },
    // 分页
    doGoPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 改变当前页
    handleChangePage (pageNo) {
      this.current = pageNo
      this.doInit()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.doInit()
    }
  }
}
</script>
<style lang="less">
@import "../business/title.less";
.ivu-input-search {
  background: #fafafa;
  color: #ccc;
  border: 1px solid #e5e5e5;
}
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
.ivu-input-search-icon {
  background-color: #fafafa;
  border: 1px solid #e5e5e5;
}
.lead-user-modal {
  .ivu-modal-header p, .ivu-modal-header-inner {
    font-size: 16px;
    color: #333333;
    font-weight: normal;
  }
  a {
    color: #595959;
  }
}
</style>
<style lang="less" scoped>
@import '../../../assets/css/base.less';
@import '../../../assets/css/redefine.less';
.post-user-container {
  .query-condition {
    .screen {
      //消除按钮偏移
      button {
        margin-right:-0.5rem;
      }
      .ivu-input-icon-clear {
        right: 40px;
        position: absolute;
      }
      .ivu-input-group {
        top: 0 ;
      }
      .ivu-btn-icon-only {
        padding: 3px 8px 3px;
        font-size: 16px;
      }
    }
  }
  .text-btn {
    background-color: #fafafa;
    border-color: #e5e5e5;
  }
  .query-select {
    width: 120px;
    color: #333333;
    margin-right: 8px;
  }
  .query-inputmad {
    width: 250px;
    margin-right: 8px;
  }
  .query-input {
    width: 250px;
  }
  .btn-query-input {
    margin-right: 8px;
  }
  .lead-user-modal {
    .centent {
      height: 470px;
      .ivu-col-span-13 {
        padding-right: 16px;
        .letf-title {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }
      }
      .modal-span {
        margin: 0px 3px;
        cursor: pointer;
      }
      .modal-icon {
        padding-bottom: 2px;
        cursor: pointer;
      }
      .centent-row {
        margin-top: 16px;
      }
      .ivu-col-span-11 {
        .ivu-row {
          height: 29px;
          line-height: 20px;
          .letf-title {
            font-weight: 700;
            font-size: 14px;
          }
          .right-title {
            text-align: end;
          }
        }
        .col-div {
          height: 360px;
          border: 1px solid rgb(229, 229, 229);
          padding: 8px;
        }
      }
    }
    .div-page {
      width: 508px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      right: 16px;
      left: 16px;
      bottom: 70px;
      .div-page-lf {
        flex: 1;
        align-self: flex-end;
        margin-bottom: 4px;
      }
      .div-page-btn {
        flex: 3;
        text-align: right;
        .pages {
          display: inline-block;
          vertical-align: middle;
        }
        button {
          margin-left: 5px;
        }
      }
    }
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
