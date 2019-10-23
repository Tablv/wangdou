<template>
  <div class="company-user">
    <Spin fix v-if="loading1" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <Spin fix v-if="saveLoading" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>数据保存中</div>
    </Spin>
    <section class="company-container">
      <section class="page-header">
        <div class="page-header-name">新增用户</div>
        <div class="page-header-actions">
          <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
          <Button type="primary" v-else @click="doSaveUser">保存</Button>
          <Button @click="doSaveAndCreateUser">保存并新增</Button>
          <Button @click="doBtnCancel">取消</Button>
          <Button @click="doPageUser">列表</Button>
        </div>
      </section>
      <div class="input-box">
        <Row :gutter="16" class="input-box-row">
          <Col span="6">
            <Row>
              <Col span="2" style="width: 80px;padding-top: 8px;">
                用户手机号码
              </Col>
              <Col span="12" class="user-mobile-select">
                <Select
                  class="five-star"
                  style="width: 100%;"
                  v-model="user_mobile"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @on-change="changeMobile">
                  <Option v-for="(time, index) in options" :value="time.value" :key="index">{{time.label}}</Option>
                </Select>
                <Icon class="select-icon" style="cursor: pointer;" type="md-more" size="18" @click="doClickIcon" />
              </Col>
            </Row>
          </Col>
          <Col span="6">
            <Row>
              <Col span="2" style="width: 56px;padding-top: 8px;">
                用户姓名
              </Col>
              <Col span="12">
                <Input placeholder="根据员工用户信息自动带出" disabled v-model="user_name" enter-button/>
              </Col>
            </Row>
          </Col>
          <Col span="6">
            <span class="is-admin">是否是业务管理员&nbsp;&nbsp;</span>
            <Checkbox class="admin-man" :disabled="disabledCBox" v-model="single" @on-change="doChangeSingle"></Checkbox>
          </Col>
          <Col span="6">
            <div class="assign-button">
              <Button type="primary" :disabled="disabledBtn" @click="openAssign">分配公司</Button>
            </div>
          </Col>
        </Row>
      </div>
      <div class="tab-box">
        <Table
          border
          :columns="tableColumns"
          :class="tableData.length ? null : 'tableHeight initTable'"
          :data="tableData"
          max-height="600"
          :no-data-text="null">
          <!-- Checkbox 多选框开始 -->
          <template  slot-scope="{ row }" slot="station">
            <Checkbox
              :indeterminate="row.indeterminate"
              :value="row.checkAll"
              @click.prevent.native="handleCheckAll(row)"
            >全选</Checkbox>
            <CheckboxGroup v-model="row.checkAllGroup" @on-change="checkAllGroupChange(row.checkAllGroup, row)">
              <Checkbox class="checkbox-width" v-for="(t, i) in roleList" :key="i" :label="t.roleId">{{t.name}}</Checkbox>
            </CheckboxGroup>
          </template>
          <!-- 核算主体 -->
          <template slot-scope="{ row, index }" slot="scope">
            <div class="table-scope">
              <span>{{row.scope}}</span>
              <span class="table-span table-scope-icon" @click="doScopeIcon(row, index)">
                <Icon type="md-more" size="16" slot="suffix" />
              </span>
            </div>
          </template>
          <template slot-scope="{ row, index }" slot="action">
            <span class="table-span" @click="remove(index, row)">删除</span>
            <span class="table-span copy" @click="showModal(index, row)">复制到其他公司</span>
            <Poptip content="content" placement="top" trigger="hover" class="my_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
              <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
              <div class="coding" slot="content" >请复制一些东西</div>
            </Poptip>
          </template>
        </Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
      </div>
    </section>
    <!-- 核算主体弹框 -->
    <auxiliary-modal :value="showScopeModal" :data="allCompanyAccountEntity" :selectedValues="selectedValues"
      title="选择核算主体" @on-select="doGetDataList" @on-visibe-change="onVisibeChange">
    </auxiliary-modal>
    <!-- 分配公司弹窗 -->
    <company-user-modal @modalClose="assignClose" @selectCompany="doGetCompanyList" :assignModal="assignModal" :companyId="companyId" :titleName="titleName"></company-user-modal>
    <!-- 复制弹窗 -->
    <copy-modal @modalClose="assignStop" @selectCompany="doCopyRoleList" :companyData="selectData" :againModal="againModal"></copy-modal>
    <!-- 选择组织成员 -->
    <Modal
      class="user-modal"
      v-model="userModal"
      :transfer="false"
      draggable
      scrollable
      footer-hide
      title="选择用户"
      :width="700" >
      <div class="centent">
        <div class="query-condition">
          <Select class="select-width query-select" disabled placeholder="已生效">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input class="query-input" v-model="userMobileOrName" placeholder="用户手机号码/姓名" search @on-search="enterMobileName" @on-clear="enterMobileName" clearable/>
          <Button class="span-space query-button" @click="doResetModal">重置</Button>
        </div>
        <Table :columns="modalTableColumns" max-height="360" :class="modalTableData.length ? null : 'tableHeight initTable'" :data="modalTableData"></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="modalTableData.length===0"></nodata>
        <div class="div-page">
          <div class="div-page-lf">共 {{totalModal}} 条数据</div>
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
  </div>
</template>

<script type="text/jsx">
import companyUserModal from '@/components/companyUserModal/companyUserModal.vue'
import copyModal from '@/components/copyModal/copyModal.vue'
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
import auxiliaryModal from './components/auxiliaryModal/auxiliaryModal'
export default {
  name: 'create_user',
  components: {
    companyUserModal,
    copyModal,
    nodata,
    auxiliaryModal
  },
  data () {
    return {
      loading1: false,
      saveLoading: false,
      loading: false,
      options: [],
      list: [],
      showScopeModal: false, // 是否显示选择核算主体范围
      allCompanyAccountEntity: {}, // 查询核算主体条件
      selectedValues: [], // 默认选中的核算主体数据
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
      titleName: '选择公司', // 子组件选择公司的modal的名字
      userModal: false, // 是否显示选择用户弹窗
      isActive: false, // 是否显示帮助信息提示
      assignModal: false, // 是否显示分配弹窗
      againModal: false, // 是否显示新增和复制弹窗
      disabledBtn: false, // 是否可以分配公司
      removeModal: false, // 删除提示
      disabledCBox: false, // 是否可以勾选是否是业务管理员
      isEnable: null,
      userMobileOrName: '', // 弹框的用户手机号码或姓名
      userId: null, // 用户id
      selectData: [], // 多选的数据
      tableColumns: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '公司编码',
          key: 'code',
          width: 100,
          tooltip: true,
          align: 'left'
        },
        {
          title: '公司名称',
          key: 'name',
          tooltip: true,
          width: 100,
          align: 'left'
        },
        {
          title: '核算主体范围',
          key: 'scope',
          tooltip: true,
          slot: 'scope',
          width: 260,
          align: 'left'
        },
        {
          title: '岗位权限',
          slot: 'station',
          align: 'left'
        },
        {
          title: '操作',
          slot: 'action',
          width: 200,
          align: 'left'
        }
      ],
      tableData: [],
      single: false, // 勾选是否是业务管理员
      // 详情数据
      user_mobile: '', // 手机号码
      user_name: '', // 用户姓名
      roleList: [], // 全部岗位数据
      sysRoleAssignMap: {}, // 勾选的岗位ID
      type: null,
      modalTableColumns: [
        {
          title: '用户手机号码',
          key: 'mobile',
          align: 'left'
        },
        {
          title: '用户姓名',
          key: 'name',
          align: 'left'
        },
        {
          title: '数据状态',
          key: 'isEnable',
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
        },
        {
          title: '操作',
          width: 100,
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" on-click={ this.doSelect.bind(this, { row, index, column }) }>选择</span>
              </div>
            )
          }
        }
      ], // 弹框的表格设置
      modalTableData: [], // 弹框的表格数据
      totalModal: null, // 分页总数据个数
      sizeModal: 20, // 分页每页显示的数据个数
      currentModal: 1, // 分页当前页
      saveIsAdmin: null,
      selectIndex: null,
      accountBookEntityMap: {},
      companyId: [], // 已有公司ID
      companyIds: [],
      accountBookCodeOrName: '', // 账簿的编码或者名称
      updateNum: 0,
      oldSaveIsAdmin: null,
      isClear: false,
      // 当前聚焦的输入框的行数
      currentRow: {},
      auxiliaryCodeOrName: '',
      auxiliaryParams: {},
      index: -1 // 当前下标
    }
  },
  mixins: [saasMixin],
  watch: {
    $route () {
      this.type = this.$route.query.type
    },
    type () {
      if (this.type) {
        this.doCancel()
      }
    },
    updateNum (val) {
      if (val > 0) {
        this.doIdentifying(this.$route, true)
      } else {
        this.doIdentifying(this.$route, false)
      }
    },
    tableData (newArr) {
      this.tableData = newArr
    }
  },
  created () {
    this.doCancel()
    // 查询所有岗位
    this.doRole()
    // 查询用户姓名
    this.queryName()
    // 是否可以分配公司
    if (this.user_name === '') {
      this.disabledBtn = true
      // 是否可以勾选是否是业务管理员
      this.disabledCBox = true
    } else {
      this.disabledBtn = false
      // 是否可以勾选是否是业务管理员
      this.disabledCBox = false
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    // 查询所有岗位
    doRole () {
      this.loading1 = true
      this.$request.post('/financeback/sysRole/findList').then(response => {
        let { status, data } = response.data
        this.loading1 = false
        if (status === 'success') {
          let i = data.findIndex(d => d.name === '业务管理员')
          if (i !== -1) {
            data.splice(i, 1)
          }
          this.roleList = data
        }
      })
    },
    // 查询姓名
    queryName () {
      let reqdata = {
        page: {
          size: 20,
          current: 1
        },
        commParams: {
          orMatch: ''
        }
      }
      this.$request.post('/financeback/sysUser/findNotImportPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.list = data.records
        }
      })
    },
    // 根据手机号码查询姓名
    doSelectName () {
      let reqdata = {
        page: {
          size: 1,
          current: 1
        },
        commParams: {
          orMatch: this.user_mobile
        }
      }
      this.$request.post('/financeback/sysUser/findNotImportPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          data.records.forEach(r => {
            // 姓名
            this.user_name = r.name
            this.userId = r.userId
            this.user_mobile = r.mobile
            this.isEnable = r.isEnable
          })
          // 是否可以分配公司
          if (this.user_name === '') {
            this.disabledBtn = true
            // 是否可以勾选是否是业务管理员
            this.disabledCBox = true
          } else {
            this.disabledBtn = false
            if (this.isEnable === 1) {
              // 是否可以勾选是否是业务管理员
              this.disabledCBox = true
            } else {
              // 是否可以勾选是否是业务管理员
              this.disabledCBox = false
            }
          }
        }
      })
    },
    // 筛选搜索数据
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          const list = this.list.map(item => {
            return {
              value: item.mobile,
              label: item.mobile
            }
          })
          this.options = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1)
        }, 200)
      } else {
        this.options = []
      }
    },
    // 选择框选中时触发
    changeMobile (item) {
      if (item) {
        this.updateNum++
        let time = this.list.filter(a => a.mobile === item)
        if (time) {
          time.forEach(r => {
            // 姓名
            this.user_name = r.name
            this.userId = r.userId
            this.user_mobile = r.mobile
            this.isEnable = r.isEnable
            // 保存初始的值
            this.oldSaveIsAdmin = r.isAdmin
          })
          // 是否可以分配公司
          if (this.user_name === '') {
            this.disabledBtn = true
            // 是否可以勾选是否是业务管理员
            this.disabledCBox = true
          } else {
            this.disabledBtn = false
            if (this.isEnable === 1) {
              // 是否可以勾选是否是业务管理员
              this.disabledCBox = true
            } else {
              // 是否可以勾选是否是业务管理员
              this.disabledCBox = false
            }
          }
        }
      }
    },
    // 点击手机号码的选择按钮
    doClickIcon () {
      // 打开选择用户弹框
      this.userModal = true
      // 弹框中初始化页面
      this.doModalInit()
    },
    // 点击核算主体范围选择按钮
    doScopeIcon (row, index) {
      console.log(index, row)
      this.currentRow = row
      this.selectedValues = row.accountBookEntityId
      this.$set(this.allCompanyAccountEntity, 'companyId', row.id)
      this.$set(this.allCompanyAccountEntity, 'companyHasSubAccount', row.hasSubAccount)
      this.showScopeModal = true
    },
    // 点击弹框中的确定，关闭核算主体弹框，得到选中的数据
    doGetDataList (data) {
      // 赋值核算主体范围
      let _scope = ''
      let _accountBookEntityId = []
      data.forEach(s => {
        // 每一个主体
        _accountBookEntityId.push(s.id)
        _scope += s.entityName + '、'
      })
      this.currentRow.accountBookEntityId = _accountBookEntityId
      this.currentRow.scope = _scope.slice(0, _scope.length - 1)
      this.updateNum++
      let _index = this.tableData.findIndex(t => t.id === this.currentRow.id)
      if (_index > -1) {
        this.tableData[_index] = this.currentRow
      }
      this.showScopeModal = false
    },
    // 点击弹框中的取消
    onVisibeChange (val) {
      this.showScopeModal = val
    },
    // 核算主体范围条件事件
    doSearch () {
      // this.$set(this.auxiliaryParams, 'codeOrName', this.auxiliaryCodeOrName)
      this.$set(this.auxiliaryParams, 'type', true)
    },
    // 点击确定，关闭核算弹框得到的核算主体数据
    doGetAuxiliaryId (data, index, row) {
      console.log(index, row)
      this.isClear = false
      // 赋值核算主体范围
      let _scope = ''
      let _accountBookEntityId = []
      data.forEach(s => {
        // 每一个主体
        _accountBookEntityId.push(s.id)
        _scope += s.name + '、'
      })
      row.accountBookEntityId = _accountBookEntityId
      row.scope = _scope.slice(0, _scope.length - 1)
      if (row.scope !== '') row.isScope = false
      this.updateNum++
      let _index = this.tableData.findIndex(t => t.id === row.id)
      if (_index > -1) {
        this.tableData[_index] = row
      }
    },
    // 选择组织成员弹框中初始化页面
    doModalInit () {
      let reqdata = {
        page: {
          size: this.sizeModal,
          current: this.currentModal
        },
        commParams: {
          orMatch: this.userMobileOrName
        }
      }
      this.$request.post('/financeback/sysUser/findNotImportPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          // 分页
          this.totalModal = data.total
          this.sizeModal = data.size
          this.currentModal = data.current
          // 表格数据
          this.modalTableData = data.records
        }
      })
    },
    // 选择组织成员弹框中按回车搜索用户
    enterMobileName () {
      // 弹框中查询
      this.doModalInit()
    },
    // 选择组织成员弹框中-----点重置
    doResetModal () {
      this.userMobileOrName = ''
      // 走查询未引入接口
      this.doModalInit()
    },
    // 选择组织成员弹框中点击选择
    doSelect (data) {
      this.updateNum++
      // 姓名
      this.user_name = data.row.name
      this.userId = data.row.userId
      this.user_mobile = data.row.mobile
      this.isEnable = data.row.isEnable
      // 保存初始的值
      this.oldSaveIsAdmin = data.row.isAdmin
      // 关闭弹框
      this.userModal = false
      // 是否可以分配公司
      if (this.user_name === '') {
        this.disabledBtn = true
        // 是否可以勾选是否是业务管理员
        this.disabledCBox = true
      } else {
        this.disabledBtn = false
        if (this.isEnable && this.isEnable === 1) {
          // 是否可以勾选是否是业务管理员
          this.disabledCBox = true
        } else {
          // 是否可以勾选是否是业务管理员
          this.disabledCBox = false
        }
      }
    },
    // 弹框中分页
    goModalElevatorPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 弹框中改变当前页
    handleModalChangePage (pageNo) {
      this.currentModal = pageNo
      this.doModalInit()
    },
    // 弹框中改变每页数量
    changeModalPageSize (e) {
      this.sizeModal = e
      this.doModalInit()
    },
    // 点击取消
    doBtnCancel () {
      if (this.updateNum > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: `取消操作会重置当前表单，是否继续？`,
          yes () {
            that.doCancel()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.doCancel()
      }
    },
    // 操作成功后取消
    doCancel () {
      this.user_mobile = ''
      this.user_name = ''
      this.tableData = []
      this.disabledBtn = true
      this.single = false
      this.companyId = []
      this.updateNum = 0
      this.oldSaveIsAdmin = null
    },
    // 点击列表
    doPageUser () {
      this.$router.push({ name: 'user_index' })
    },
    // 点击保存
    doSaveUser () {
      this.saveLoading = true
      // 保存用户姓名
      this.doSaveName().then(res => {
        if (res.status === 'success') {
          let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
          if (this.oldSaveIsAdmin !== _saveIsAdmin) {
            // 保存分配业务管理员
            this.saveAdmin().then(res => {
              if (res.status === 'success') {
                if (this.tableData.length > 0) {
                  // 分配用户岗位
                  this.doSaveAssign().then(res => {
                    this.saveLoading = false
                    if (res.status === 'success') {
                      this.$Message.success('保存成功!')
                      this.doContinueActions()
                      this.addIdToList({ id: this.userId, name: 'user' })
                      this.$router.push({ name: 'update_user', query: { userId: this.userId } })
                      this.updateNum = 0
                    }
                  })
                } else {
                  this.saveLoading = false
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.addIdToList({ id: this.userId, name: 'user' })
                  this.$router.push({ name: 'update_user', query: { userId: this.userId } })
                  this.updateNum = 0
                }
              }
            })
          } else {
            if (this.tableData.length > 0) {
              // 分配用户岗位
              this.doSaveAssign().then(res => {
                this.saveLoading = false
                if (res.status === 'success') {
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.addIdToList({ id: this.userId, name: 'user' })
                  this.$router.push({ name: 'update_user', query: { userId: this.userId } })
                  this.updateNum = 0
                }
              })
            } else {
              this.saveLoading = false
              this.$Message.success('保存成功!')
              this.doContinueActions()
              this.addIdToList({ id: this.userId, name: 'user' })
              this.$router.push({ name: 'update_user', query: { userId: this.userId } })
              this.updateNum = 0
            }
          }
        }
      })
    },
    // 点击保存并新增
    doSaveAndCreateUser () {
      this.saveLoading = true
      // 保存用户姓名并跳转新增页面
      this.doSaveName().then(res => {
        if (res.status === 'success') {
          let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
          if (this.oldSaveIsAdmin !== _saveIsAdmin) {
            // 保存分配业务管理员
            this.saveAdmin().then(res => {
              if (res.status === 'success') {
                if (this.tableData.length > 0) {
                  // 分配用户岗位
                  this.doSaveAssign().then(resa => {
                    this.saveLoading = false
                    if (resa.status === 'success') {
                      this.$Message.success('保存成功!')
                      this.doContinueActions()
                      this.doCancel()
                    }
                  })
                } else {
                  this.saveLoading = false
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.doCancel()
                }
              }
            })
          } else {
            if (this.tableData.length > 0) {
              // 分配用户岗位
              this.doSaveAssign().then(res => {
                this.saveLoading = false
                if (res.status === 'success') {
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.doCancel()
                }
              })
            } else {
              this.saveLoading = false
              this.$Message.success('保存成功!')
              this.doContinueActions()
              this.doCancel()
            }
          }
        }
      })
    },
    // 保存用户姓名
    doSaveName () {
      return new Promise((resolve, reject) => {
        if (this.user_name !== '') {
          let reqdata = {
            userId: this.userId,
            name: this.user_name,
            mobile: this.user_mobile
          }
          this.$request.post('/financeback/sysUser/addUser', reqdata).then(response => {
            let { status } = response.data
            if (status === 'success') {
              resolve(response.data)
            }
          })
        } else {
          this.saveLoading = false
          this.$Message.error('用户手机号码和姓名不能为空!')
        }
      })
    },
    // 保存分配用户岗位
    doSaveAssign () {
      return new Promise((resolve) => {
        // 获取勾选的公司ID和岗位ID
        this.sysRoleAssignMap = {}
        let key = ''
        let value = []
        this.tableData.forEach(c => {
          key = c.id
          value = []
          if (c.checkAllGroup.length > 0) {
            c.checkAllGroup.forEach(r => {
              value.push(r)
            })
            this.sysRoleAssignMap[key] = value
          } else {
            this.saveLoading = false
            this.$Message.warning('在公司下至少设置一个用户的权限!')
            resolve(true)
          }
        })
        // 获取勾选的公司ID和核算主体ID
        this.accountBookEntityMap = {}
        let k = ''
        let v = []
        this.tableData.forEach(c => {
          console.log(c.scope, 'dddd')
          k = c.id
          v = []
          if (c.accountBookEntityId.length > 0) {
            c.accountBookEntityId.forEach(r => {
              v.push(r)
            })
            this.accountBookEntityMap[k] = v
          } else {
            this.saveLoading = false
            this.$Message.warning('在公司下至少设置一个用户的核算主体!')
            resolve(true)
          }
        })
        let reqdata = {
          userId: this.userId,
          sysRoleAssignMap: this.sysRoleAssignMap,
          accountBookEntityMap: this.accountBookEntityMap
        }
        this.$request.post('/financeback/sysUser/assign', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            resolve(response.data)
          }
        })
      })
    },
    // 业务管理员改变时调接口
    doChangeSingle (data) {
      this.updateNum++
      if (data) {
        this.saveIsAdmin = data
      }
    },
    // 保存分配业务管理员
    saveAdmin () {
      return new Promise((resolve, reject) => {
        let reqdata = {
          userId: this.userId,
          isAdmin: this.saveIsAdmin ? 1 : 0
        }
        this.$request.post('/financeback/sysUser/assignBusinessAdmin', reqdata).then(response => {
          let { status } = response.data
          if (status === 'success') {
            resolve(response.data)
          }
        })
      })
    },
    // 点击删除
    doDelete () {
      this.removeModal = true
    },
    // 打开--帮助信息提示
    helpHover () {
      this.isActive = true
    },
    // 关闭帮助信息提示
    loseHover () {
      this.isActive = false
    },
    // 打开--分配弹窗
    openAssign () {
      this.assignModal = true
    },
    // 监听分配公司弹窗传来的用户，生成用户列表
    doGetCompanyList (msg) {
      msg.forEach(e => {
        e.indeterminate = false
        e.checkAll = false
        e.checkAllGroup = []
        // 添加核算key和id
        if (e.hasSubAccount === 0) {
          e.accountBookEntityId = e.accountBookEntityVo ? [e.accountBookEntityVo.id] : []
          e.scope = e.accountBookEntityVo ? e.accountBookEntityVo.entityName : ''
        } else {
          e.accountBookEntityId = []
          e.scope = ''
        }
        e.isScope = false
        this.tableData.push(e)
      })
      this.updateNum++
      // 获取已有公司id
      this.tableData.forEach(el => {
        if (el.scope !== '') {
          el.isScope = false
        } else if (el.scope === '') {
          el.isScope = true
        }
        this.companyId.push(el.id)
      })
    },
    // 关闭分配公司弹窗
    assignClose (msg) {
      this.assignModal = false
    },
    // 打开--新增和列表中的复制--弹窗
    showModal (index, row) {
      if (row.checkAllGroup.length < 1) {
        this.$Message.warning('在公司下至少设置一个用户的权限')
      } else {
        this.selectData = this.tableData.filter(item => item !== this.tableData[index])
        // 打开复制对话框
        this.againModal = true
        // 保存点击当前复制按钮数据的ID
        this.selectIndex = index
      }
    },
    // 监听--新增和列表中的复制--弹窗，生成用户列表
    doCopyRoleList (msg) {
      msg.forEach(e => {
        e.indeterminate = false
        e.checkAll = false
        e.checkAllGroup = []
        e.updateRNum = 0
        this.tableData.forEach((t, index) => {
          if (this.selectIndex === index) {
            e.indeterminate = t.indeterminate
            e.checkAll = t.checkAll
            e.checkAllGroup = t.checkAllGroup
            e.updateRNum = t.updateRNum
          }
        })
      })
      this.tableData.forEach(td => {
        msg.forEach(ele => {
          if (td.id === ele.id) {
            td.indeterminate = ele.indeterminate
            td.checkAll = ele.checkAll
            td.updateRNum++
            td.checkAllGroup = ele.checkAllGroup
          }
        })
      })
      this.updateNum++
    },
    // 关闭--新增和列表中的复制--弹窗
    assignStop (msg) {
      this.againModal = false
    },
    // 全选
    handleCheckAll (row) {
      // indeterminate控制全选切换样式
      if (row.indeterminate) {
        row.checkAll = false
      } else {
        row.checkAll = !row.checkAll
      }
      row.indeterminate = false
      this.updateNum++
      if (row.checkAll) {
        row.checkAllGroup = []
        this.roleList.forEach(r => {
          row.checkAllGroup.push(r.roleId)
        })
      } else {
        row.checkAllGroup = []
      }
      let _index = this.tableData.findIndex(t => t.id === row.id)
      if (_index > -1) {
        this.tableData[_index] = row
      }
    },
    // 多选
    checkAllGroupChange (data, row) {
      // 改变全选样式
      if (data.length === this.roleList.length) {
        row.indeterminate = false
        row.checkAll = true
      } else if (data.length > 0) {
        row.indeterminate = true
        row.checkAll = false
      } else {
        row.indeterminate = false
        row.checkAll = false
      }
      this.updateNum++
      let _index = this.tableData.findIndex(t => t.id === row.id)
      if (_index > -1) {
        this.tableData[_index] = row
      }
    },
    // 点击列表中删除
    remove (index, row) {
      console.log('当前下标', index)
      // 获取当前数据的下标
      this.index = index
      this.companyIds = [row.id]
      let that = this
      this.$Control({
        type: 'confirm',
        title: '确定删除',
        message: ' 删除用户的公司授权将自动删除用户的核算主体范围，请谨慎操作!',
        button: ['是', '否'],
        yes () {
          that.deleteUserAssign()
          that.$CloseCtl()
        },
        cancel () {
          that.index = -1
          that.$CloseCtl()
        }
      })
    },
    // 删除用户的岗位
    deleteUserAssign () {
      let reqdata = {
        companyIds: this.companyIds,
        userId: this.userId
      }
      this.$request.post('/financeback/sysUser/assignDelete', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('删除成功!')
          this.tableData.splice(this.index, 1)
          this.index = -1
        }
      })
    },
    // 点击页签关闭
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.doSaveUser()
          that.$CloseCtl()
        },
        no () {
          that.doContinueActions()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    }
  }
}
</script>
<style lang="less">
@import '../../../assets/css/base.less';
@import '../../../assets/css/redefine.less';
@import "../business/title.less";
.company-user {
  .tab-box{
    padding: 0px 16px;
  }
  .user-modal {
    .centent {
      height: 424px;
    }
    .ivu-modal-header p, .ivu-modal-header-inner {
      font-size: 16px;
      color: #333333;
      font-weight: normal;
    }
    .query-condition {
      margin-bottom: 8px;
    }
    .query-select {
      width: 120px !important;
      color: #333333;
      margin-right: 8px;
    }
    .query-input {
      width: 250px !important;
      margin-right: 8px;
    }
    .div-page {
      display: flex;
      justify-content: space-between;
      position: absolute;
      right: 16px;
      left: 16px;
      bottom: 4px;
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
  .table-scope {
    display: flex;
    justify-content: space-between;
    .table-scope-icon {
      text-align: right;
    }
  }
  .checkbox-width {
    width: 180px;
  }
  .input-box {
    padding: 0px 16px;
  }
  .user-mobile {
    width: 250px !important;
    margin-bottom: 8px
  }
  //表格高度
  .ivu-table td {
    border-right: none;
  }
  .ivu-table-border th {
    border-right: none;
  }
  .ivu-input-suffix {
    border: 1px solid #DDDDDD;
  }
  .ivu-table-wrapper {
    position: relative;
    border: 1px solid #fff;
    border-bottom: 0;
    border-right: 0;
    overflow: hidden;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .condition-input {
    width: 500px;
  }
  .area-input {
    position: relative;
  }
  .area-word {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
  .input-box-row {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  .company-button {
    margin-right: 14px;
  }
  .admin-man {
    padding-top: 10px;
  }
  //复制
  .copy {
    margin-right:5px;
  }
  .ivu-table-border th,
  .ivu-table-border td {
    border-right: none;
  }
  .user-mobile-select {
    position: relative;
    .select-icon {
      position: absolute;
      top: 8px;
      right: 0px;
    }
  }
  .select-width {
    width: 200px !important;
  }
  //五角星红色
  .five-star {
    position: relative;
    // width: 200px;
    &::after {
      content: "*";
      display: inline-block;
      position: absolute;
      top: 10px;
      right: -15px;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;
    }
  }
  .more-icon {
    position: absolute;
    top: 8px;
    right: 37px;
  }
  .ivu-checkbox-wrapper {
    cursor: pointer;
    font-size: 12px;
    display: inline-block;
  }
  .assign-button {
    float:right;
  }
  .tableHeight {
    height: 36px;
  }
  .my_poptip {
    position: absolute;
    z-index: 200;
    width: 0;
    margin-top: -2px;
    .top,.bottom {
      text-align: center;
    }
    .center {
      width: 300px;
      margin: 10px auto;
      overflow: hidden;
    }
    .center-left {
      float: left;
    }
    .center-right {
      float: right;
    }
    .icon_help {
      font-size: 16px;
    }
    .icon_help_nofocus {
      color: #d7d7d7;
    }
    .icon_help_focus {
      color: @warning ;
    }
  }
}
</style>
