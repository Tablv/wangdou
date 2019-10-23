<template>
  <div class="company-user">
    <Spin fix v-if="loading" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <Spin fix v-if="saveLoading" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>数据保存中</div>
    </Spin>
    <common-icon v-if="isEnable === 0" class="yishixiao" type="_yishixiao1"/>
    <section class="company-container">
      <section class="page-header">
        <div class="page-header-name">查看用户</div>
        <div class="page-header-actions" v-if="isEnable === 0">
          <Button @click="doCreatePage">新增</Button>
          <Button @click="doPageUser">列表</Button>
          <Button @click="doEnable">反禁用</Button>
          <!-- 首条 -->
          <Button  @click="doFirstData" class="isfenye">
            <span class="dofenye">
              <common-icon  class="fenye" type="_shouye" />
            </span>
          </Button>
          <Button class="ivu-btn-icon-only" icon="ios-arrow-back" @click="doPreData"></Button>
          <Button class="ivu-btn-icon-only" icon="ios-arrow-forward" @click="doNextData"></Button>
          <!-- 末条 -->
          <Button class="isfenye" @click="doLastData">
            <span class="dofenye">
              <common-icon  class="fenye" type="_moye" />
            </span>
          </Button>
        </div>
        <div class="page-header-actions" v-else>
          <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
          <Button type="primary" v-else @click="doSaveUser">保存</Button>
          <Button @click="doCloseInit">取消</Button>
          <Button @click="doCreatePage">新增</Button>
          <Button  @click="doDelete">删除</Button>
          <Button @click="doPageUser">列表</Button>
          <Button  @click="doDisable">禁用</Button>
          <!-- 首条 -->
          <Button  @click="doFirstData" class="isfenye">
            <span class="dofenye">
              <common-icon  class="fenye" type="_shouye" />
            </span>
          </Button>
          <Button icon="ios-arrow-back" @click="doPreData"></Button>
          <Button icon="ios-arrow-forward" @click="doNextData"></Button>
          <!-- 末条 -->
          <Button class="isfenye" @click="doLastData">
            <span class="dofenye">
              <common-icon  class="fenye" type="_moye" />
            </span>
          </Button>
        </div>
      </section>
      <div class="input-box">
        <div class="input-box-centent">
          <Row :gutter="16" class-name="centent-row">
            <Col span="6">
              <Row>
                <Col span="2" style="width: 80px;padding-top: 8px;">
                  用户手机号码
                </Col>
                <Col span="12">
                  <Input class="five-star" disabled v-model="user_mobile" placeholder="请输入用户手机号码">
                    <Icon type="md-more" slot="suffix" />
                  </Input>
                </Col>
              </Row>
            </Col>
            <Col span="6">
              <Row>
                <Col span="2" style="width: 56px;padding-top: 8px;">
                  用户姓名
                </Col>
                <Col span="12">
                  <Input placeholder="根据员工用户信息自动带出" disabled v-model="user_name"/>
                </Col>
              </Row>
            </Col>
            <Col span="6">
              <span class="is-admin">是否是业务管理员&nbsp;&nbsp;</span>
              <Checkbox :disabled="disabledCBox" class="admin-man" v-model="saveIsAdmin" @on-change="doChangeSingle"></Checkbox>
            </Col>
          </Row>
          <Row :gutter="16" v-if="isEnable === 1">
            <Col span="6">
              <Row>
                <Col span="2" style="width: 80px;padding-top: 8px;padding-left: 35px;">
                  修改人
                </Col>
                <Col span="12">
                  <Input disabled v-model="updatorNmae"/>
                </Col>
              </Row>
            </Col>
            <Col span="6">
              <Row>
                <Col span="2" style="width: 56px;padding-top: 8px;">
                  修改时间
                </Col>
                <Col span="12">
                  <Input disabled v-model="updateTime"/>
                </Col>
              </Row>
            </Col>
            <Col span="12">
              <div class="assign-button">
                <Button type="primary" :disabled="disabledBtn" @click="openAssign">分配公司</Button>
              </div>
            </Col>
          </Row>
          <Row :gutter="16" v-if="isEnable === 0">
            <Col span="6">
              <Row>
                <Col span="2" style="width: 56px;padding-top: 8px;">
                  禁用人
                </Col>
                <Col span="12">
                  <Input disabled v-model="disabledUserName"/>
                </Col>
              </Row>
            </Col>
            <Col span="6">
              <Row>
                <Col span="2" style="width: 56px;padding-top: 8px;">
                  禁用时间
                </Col>
                <Col span="12">
                  <Input disabled v-model="disabledTime"/>
                </Col>
              </Row>
            </Col>
            <Col span="12">
              <div class="assign-button">
                <Button type="primary" :disabled="disabledBtn" @click="openAssign">分配公司</Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <div class="tab-box">
        <Table border
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
              :disabled="disabledCheckBox"
              @click.prevent.native="handleCheckAll(row)"
            >全选</Checkbox>
            <CheckboxGroup v-model="row.checkAllGroup" @on-change="checkAllGroupChange(row.checkAllGroup, row)">
              <Checkbox class="checkbox-width" :disabled="disabledCheckBox" v-for="(t, i) in roleList" :key="i" :label="t.roleId">{{t.name}}</Checkbox>
            </CheckboxGroup>
          </template>
          <!-- 核算主体 -->
          <template slot-scope="{ row, index }" slot="scope" >
            <div class="table-scope">
              <span>{{row.scope}}</span>
              <span class="table-span table-scope-icon" @click="doScopeIcon(row, index)">
                <Icon type="md-more" size="16" slot="suffix" />
              </span>
            </div>
          </template>
          <!-- 操作 -->
          <template slot-scope="{ row, index }" slot="action">
            <div v-show="isEnable === 0">
              <span class="table-span enable-span">删除</span>
              <span class="table-span copy enable-span">复制到其他公司</span>
              <Poptip content="content" disabled placement="top" trigger="hover" class="my_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="coding" slot="content" >请复制一些东西</div>
              </Poptip>
            </div>
            <div v-show="isEnable === 1">
              <span class="table-span" @click="remove(index, row)">删除</span>
              <span class="table-span copy" @click="showModal(index, row)">复制到其他公司</span>
              <Poptip content="content" placement="top" trigger="hover" class="my_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="coding" slot="content" >请复制一些东西</div>
              </Poptip>
            </div>
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
    <!-- 数据改变提示 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="reminderModal"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>当前数据已修改，需要保存吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doDataChangeOk">是</Button>
        <Button @click="doDataChangeNo">否</Button>
        <Button @click="doDataChangeCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import companyUserModal from '@/components/companyUserModal/companyUserModal.vue'
import copyModal from '@/components/copyModal/copyModal.vue'
import nodata from '_c/nodata'
import { session } from '@/libs/location.js'
import { saasMixin } from '@/libs/mixins'
import auxiliaryModal from './components/auxiliaryModal/auxiliaryModal'
export default {
  name: 'update_user',
  components: {
    CommonIcon,
    companyUserModal,
    copyModal,
    nodata,
    auxiliaryModal
  },
  data () {
    return {
      loading: false,
      saveLoading: false,
      showScopeModal: false, // 是否显示选择核算主体范围
      allCompanyAccountEntity: {}, // 查询核算主体条件
      selectedValues: [], // 默认选中的核算主体数据
      titleName: '选择公司', // 子组件选择公司的modal的名字
      isEnable: null, // 是否是禁用
      isAdmin: null,
      reminderModal: false, // 数据改变提示弹框
      isActive: false, // 是否显示帮助信息提示
      assignModal: false, // 是否显示分配弹窗
      againModal: false, // 是否显示新增和复制弹窗
      disabledBtn: false, // 是否可以分配公司
      disabledInput: false, // 是否可以编辑
      disabledCBox: false, // 是否可以勾选
      disabledCheckBox: false, // 列表中是否可以勾选
      userIds: [], // 用户id
      // 当前聚焦的输入框的行数
      currentRow: {},
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
          slot: 'scope',
          tooltip: true,
          width: 260,
          align: 'left'
        },
        {
          title: '岗位权限',
          slot: 'station',
          align: 'left',
          minWidth: 100
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          align: 'left'
        }
      ],
      tableData: [],
      number: 0, // 多行文本长度
      authField: {
        desc: ''
      }, // 描述，编码，名称字段
      userId: null,
      // 详情数据
      user_mobile: '', // 手机号码
      user_name: '', // 用户姓名
      roleList: [], // 全部岗位数据
      parIsEnable: null,
      parOrMatch: null,
      sysRoleAssignMap: {}, // 勾选的岗位ID
      selectData: [], // 多选的数据
      selectIndex: null,
      updatorNmae: null, // 修改人
      updateTime: null, // 修改时间
      disabledUserName: null, // 禁用人
      disabledTime: null, // 禁用时间
      saveIsAdmin: false, // 勾选是否是业务管理员
      index: null,
      accountBookEntityMap: {}, // 核算主体范围
      companyId: [], // 已有公司ID
      companyIds: [],
      accountBookCodeOrName: '', // 账簿的编码或者名称
      oldSaveIsAdmin: null,
      oldTableData: null,
      doBtnType: '', // 判断点击的是新增还是取消
      preOrNext: '', // 判断点击的是上一条还是下一条
      isSaveSuccess: 0,
      doNextType: null,
      updateNum: 0,
      auxiliaryParams: {
        codeOrName: ''
      }
    }
  },
  watch: {
    $route () {
      this.userId = this.$route.query.userId
    },
    userId () {
      if (this.userId) {
        this.doCancel()
        this.parIsEnable = this.$route.query.isEnable
        this.parOrMatch = this.$route.query.orMatch
        // 查询用户详情
        this.doInit()
        // 是否可以分配公司
        if (this.user_name === '') {
          this.disabledBtn = true
        } else {
          this.disabledBtn = false
        }
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
      if (this.tableData.length > 0) {
        this.tableData.forEach(n => {
          if (n.accountBookEntityId.length === 0) {
            this.updateNum = 1
          }
          if (n.scope && n.scope === '') {
            this.updateNum = 1
          }
        })
      }
    }
  },
  mixins: [saasMixin],
  created () {
    this.isAdmin = JSON.parse(session.getItem('userInfo')).isAdmin
    // 查询所有岗位
    this.doRole()
    this.doCancel()
    if (this.$route.query.userId !== undefined) {
      this.userId = this.$route.query.userId
      this.parIsEnable = this.$route.query.isEnable
      this.parOrMatch = this.$route.query.orMatch
      // 查询用户详情
      this.doInit()
    }
    // 是否可以分配公司
    if (this.user_name === '') {
      this.disabledBtn = true
    } else {
      this.disabledBtn = false
    }
    // 是否置灰业务管理员
    if (this.isEnable === 0) {
      this.disabledCBox = true
    } else {
      this.disabledCBox = false
    }
  },
  methods: {
    // 查询所有岗位
    doRole () {
      this.$request.post('/financeback/sysRole/findList').then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          let i = data.findIndex(d => d.name === '业务管理员')
          if (i !== -1) {
            data.splice(i, 1)
          }
          this.roleList = data
        }
      })
    },
    // 清空
    doCancel () {
      this.user_mobile = ''
      this.user_name = ''
      this.tableData = []
      this.disabledBtn = true
      this.saveIsAdmin = false
    },
    // 查询用户详情
    doInit () {
      let reqdata = {
        userId: this.userId
      }
      this.loading = true
      this.isSaveSuccess = 0
      this.saveIsAdmin = false
      this.$request.post('/financeback/sysUser/findDetail', reqdata).then(response => {
        let { status, data } = response.data
        this.loading = false
        if (status === 'success') {
          this.updateNum = 0
          this.disabledInput = true
          // 详情数据
          // 用户手机号码和姓名
          this.user_mobile = data.mobile
          this.user_name = data.name
          this.isEnable = data.isEnable
          this.updatorNmae = data.updatorName
          this.isAdmin = data.isAdmin
          this.updateTime = this.$dayjs(data.updateTime).format('YYYY-MM-DD')
          this.disabledUserName = data.manageInfo ? data.manageInfo.disabledUserName : ''
          this.disabledTime = data.manageInfo ? this.$dayjs(data.manageInfo.disabledTime).format('YYYY-MM-DD') : ''
          // 是否可以分配公司
          if (this.user_name === '') {
            this.disabledBtn = true
          } else {
            this.disabledBtn = false
          }
          // 是否是可编辑
          if (this.isEnable === 1) {
            // 可编辑
            this.disabledBtn = false
            this.disabledCheckBox = false
          } else {
            // 不可编辑
            this.disabledBtn = true
            this.disabledCheckBox = true
          }
          // 是否勾选业务管理员
          if (data.isAdmin === 1) {
            this.saveIsAdmin = true
          }
          // 是否置灰业务管理员
          if (this.isEnable === 0) {
            this.disabledCBox = true
          } else {
            this.disabledCBox = false
          }
          // 列表
          if (Object.keys(data.companyVoMap) !== []) {
            this.tableData = []
            for (const key in data.companyVoMap) {
              if (data.companyVoMap.hasOwnProperty(key)) {
                const element = data.companyVoMap[key]
                element.indeterminate = false
                element.checkAll = false
                element.checkAllGroup = []
                // 添加核算key和id
                element.accountBookEntityId = []
                element.scope = ''
                element.updateRNum = 0
                element.updateABNum = 0
                this.tableData.push(element)
              }
            }
          }
          // 核算主体范围
          if (Object.keys(data.userAccountBookEntityVoMap) !== []) {
            for (const k in data.userAccountBookEntityVoMap) {
              this.tableData.forEach(t => {
                let _scope = ''
                let _accountBookEntityId = []
                if (t.id === parseInt(k)) {
                  if (data.userAccountBookEntityVoMap.hasOwnProperty(k)) {
                    const ele = data.userAccountBookEntityVoMap[k]
                    ele.forEach(e => {
                      // 每一个主体
                      _accountBookEntityId.push(e.accountBookEntityId)
                      _scope += e.name + '、'
                    })
                    t.accountBookEntityId = _accountBookEntityId
                    t.scope = _scope.slice(0, _scope.length - 1)
                  }
                }
              })
            }
          }
          // 岗位
          if (Object.keys(data.sysRoleMap) !== []) {
            for (const k in data.sysRoleMap) {
              this.tableData.forEach(t => {
                if (t.id === parseInt(k)) {
                  if (data.sysRoleMap.hasOwnProperty(k)) {
                    const ele = data.sysRoleMap[k]
                    ele.forEach(e => {
                      t.checkAllGroup.push(e.roleId)
                    })
                  }
                }
              })
            }
          }
          // 去重
          let _caiyaoMap = new Map()
          this.tableData = this.tableData.filter(n => !_caiyaoMap.has(n.id) && _caiyaoMap.set(n.id, 1))
          // 全选的样式
          this.tableData.forEach(t => {
            if (t.checkAllGroup.length === this.roleList.length) {
              t.checkAll = true
              t.indeterminate = false
            } else if (t.checkAllGroup.length > 0) {
              t.checkAll = false
              t.indeterminate = true
            } else {
              t.checkAll = false
              t.indeterminate = false
            }
          })
          // 保存初始的值
          this.oldSaveIsAdmin = data.isAdmin
          this.oldTableData = JSON.parse(JSON.stringify(data.companyVoMap))
          // 获取已有公司id
          this.companyId = []
          this.tableData.forEach(el => {
            this.companyId.push(el.id)
          })
          this.isSaveSuccess++
        }
      })
    },
    // 点击核算主体范围选择按钮
    doScopeIcon (row, index) {
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
    // 点击新增
    doCreatePage () {
      // 判断是否是已失效
      if (this.isEnable === 0) {
        // 跳转
        this.reminderModal = false
        this.$router.push({ name: 'create_user', query: { type: 'insert' } })
      } else {
        this.doBtnType = 'insert'
        let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
        // 判断是否修改过数据
        // 判断业务管理员
        if (this.oldSaveIsAdmin === _saveIsAdmin) {
          // 判断其他
          if (this.tableData.length > 0) {
            if (Object.keys(this.oldTableData).length === this.tableData.length) {
              // 判断公司id是否一样
              for (const key in this.oldTableData) {
                this.tableData.forEach(ele => {
                  if (parseInt(key) === ele.id) {
                    const element = this.oldTableData[key]
                    // 判断岗位
                    if (ele.checkAllGroup.length === element.checkAllGroup.length) {
                      ele.checkAllGroup.forEach(mck => {
                        let _eleitem = element.checkAllGroup.find(eleck => mck === eleck)
                        if (_eleitem) {
                          // 判断核算主体
                          if (ele.accountBookEntityId.length === element.accountBookEntityId.length) {
                            if (ele.accountBookEntityId.length === 0) {
                              // 跳转
                              this.reminderModal = false
                              this.$router.push({ name: 'create_user', query: { type: 'insert' } })
                            } else {
                              ele.accountBookEntityId.forEach(mab => {
                                let _ele = element.accountBookEntityId.find(eleab => mab === eleab)
                                if (_ele) {
                                  // 跳转
                                  this.reminderModal = false
                                  this.$router.push({ name: 'create_user', query: { type: 'insert' } })
                                } else {
                                  // 打开提示
                                  this.reminderModal = true
                                }
                              })
                            }
                          } else {
                            // 打开提示
                            this.reminderModal = true
                          }
                        } else {
                          // 打开提示
                          this.reminderModal = true
                        }
                      })
                    } else {
                      // 打开提示
                      this.reminderModal = true
                    }
                  } else {
                    // 打开提示
                    this.reminderModal = true
                  }
                })
              }
            } else {
              // 打开提示
              this.reminderModal = true
            }
          } else {
            // 跳转
            this.reminderModal = false
            this.$router.push({ name: 'create_user', query: { type: 'insert' } })
          }
        } else {
          // 打开提示
          this.reminderModal = true
        }
      }
    },
    // 数据改变提示---点击是
    doDataChangeOk () {
      // doBtnType为insert走新增，为close走保存
      if (this.doBtnType === 'insert') {
        this.reminderModal = false
        this.doSaveAndCreateUser()
        this.doBtnType = ''
      } else if (this.doBtnType === 'close') {
        this.reminderModal = false
        this.doSaveUser()
        this.doBtnType = ''
      } else if (this.doBtnType === 'delete') {
        this.reminderModal = false
        this.doBtnType = ''
        this.doSaveUser()
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: ' 注意：请确认是否要删除数据？',
          button: ['是', '否'],
          yes () {
            that.doDeleteTableData()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
      if (this.isSaveSuccess > 0) {
        // preOrNext为next走下一条，为pre走上一条
        if (this.preOrNext === 'next') {
          // 走下一条
          let _num = this.doFindPage(3, this.$route.query.userId, this.doNextType)
          if (_num === '当前为末条') {
            return false
          } else if (_num === '跳转') {
            this.$router.push({ name: 'create_user' })
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
          this.preOrNext = ''
          this.reminderModal = false
        } else if (this.preOrNext === 'pre') {
          // 走上一条
          let _num = this.doFindPage(2, this.$route.query.userId)
          if (_num === '当前为首条') {
            return false
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
          this.preOrNext = ''
          this.reminderModal = false
        }
      }
    },
    // 数据改变提示---点击否
    doDataChangeNo () {
      this.doContinueActions()
      // doBtnType为insert走新增页面，为close走初始化页面数据
      if (this.doBtnType === 'insert') {
        this.reminderModal = false
        this.$router.push({ name: 'create_user', query: { type: 'insert' } })
        this.doBtnType = ''
      } else if (this.doBtnType === 'close') {
        this.reminderModal = false
        // 查询所有岗位
        this.doRole()
        // 查询用户详情
        this.doInit()
        this.doBtnType = ''
      } else if (this.doBtnType === 'delete') {
        this.reminderModal = false
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: ' 注意：请确认是否要删除数据？',
          button: ['是', '否'],
          yes () {
            that.doDeleteTableData()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
      if (this.isSaveSuccess > 0) {
        // preOrNext为next走下一条，为pre走上一条
        if (this.preOrNext === 'next') {
          // 走下一条
          let _num = this.doFindPage(3, this.$route.query.userId, this.doNextType)
          if (_num === '当前为末条') {
            return false
          } else if (_num === '跳转') {
            this.$router.push({ name: 'create_user' })
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
          this.preOrNext = ''
          this.reminderModal = false
        } else if (this.preOrNext === 'pre') {
          // 走上一条
          let _num = this.doFindPage(2, this.$route.query.userId)
          if (_num === '当前为首条') {
            return false
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
          this.preOrNext = ''
          this.reminderModal = false
        }
      }
    },
    // 数据改变提示---点击取消
    doDataChangeCancel () {
      // 关闭弹框
      this.reminderModal = false
      this.doBtnType = ''
      this.preOrNext = ''
    },
    // 改变时调接口
    doChangeSingle (data) {
      if (data) {
        this.saveIsAdmin = data
      }
      this.updateNum++
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
    // 点击保存
    doSaveUser () {
      this.saveLoading = true
      let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
      if (this.oldSaveIsAdmin !== _saveIsAdmin) {
        // 保存分配业务管理员
        this.saveAdmin().then(res => {
          if (res && res.status === 'success') {
            if (this.updateNum > 0 && this.tableData.length > 0) {
              // 分配用户岗位
              this.doSaveAssign().then(res => {
                this.saveLoading = false
                if (res && res.status === 'success') {
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.doInit()
                  this.updateNum = 0
                }
              })
            } else {
              this.saveLoading = false
              this.$Message.success('保存成功!')
              this.doContinueActions()
              this.doInit()
              this.updateNum = 0
            }
          }
        })
      } else {
        if (this.updateNum > 0) {
          // 分配用户岗位
          this.doSaveAssign().then(res => {
            this.saveLoading = false
            if (res && res.status === 'success') {
              this.$Message.success('保存成功!')
              this.doContinueActions()
              this.doInit()
              this.updateNum = 0
            }
          })
        }
      }
      if (this.updateNum === 0) {
        setTimeout(() => {
          this.saveLoading = false
          this.$Message.success('保存成功!')
        }, 1000)
      }
    },
    // 点击保存并新增
    doSaveAndCreateUser () {
      let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
      if (this.oldSaveIsAdmin !== _saveIsAdmin) {
        // 保存分配业务管理员
        this.saveAdmin().then(res => {
          if (res && res.status === 'success') {
            if (this.updateNum > 0) {
              // 分配用户岗位
              this.doSaveAssign().then(res => {
                if (res && res.status === 'success') {
                  this.$Message.success('保存成功!')
                  this.doContinueActions()
                  this.$router.push({ name: 'create_user', query: { type: 'insert' } })
                }
              })
            } else {
              this.$Message.success('保存成功!')
              this.doContinueActions()
              this.$router.push({ name: 'create_user', query: { type: 'insert' } })
            }
          }
        })
      } else {
        // 分配用户岗位
        this.doSaveAssign().then(res => {
          if (res && res.status === 'success') {
            this.$Message.success('保存成功!')
            this.doContinueActions()
            this.$router.push({ name: 'create_user', query: { type: 'insert' } })
          }
        })
      }
    },
    // 保存分配用户岗位
    doSaveAssign () {
      return new Promise((resolve, reject) => {
        // 获取勾选的公司ID和岗位ID
        this.sysRoleAssignMap = {}
        let key = ''
        let value = []
        // 获取勾选的公司ID和核算主体ID
        this.accountBookEntityMap = {}
        let v = []
        let _status = null
        if (this.updateNum > 0) {
          this.tableData.forEach(c => {
            key = c.id
            value = []
            v = []
            // 核算主体
            if (c.accountBookEntityId.length > 0) {
              c.accountBookEntityId.forEach(r => {
                v.push(r)
              })
              this.accountBookEntityMap[key] = v
              // 岗位权限
              if (c.checkAllGroup.length > 0) {
                if (c.updateRNum > 0) {
                  c.checkAllGroup.forEach(r => {
                    value.push(r)
                  })
                  this.sysRoleAssignMap[key] = value
                }
              } else {
                this.saveLoading = false
                this.$Message.warning('在公司下至少设置一个用户的权限!')
                this.sysRoleAssignMap[key] = value
                resolve(false)
                _status = false
                return false
              }
            } else {
              this.saveLoading = false
              this.$Message.warning('在公司下至少设置一个用户的核算主体!')
              this.accountBookEntityMap[key] = v
              resolve(false)
              _status = false
              return false
            }
          })
        }
        if (_status !== false) {
          setTimeout(() => {
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
          }, 100)
        }
      })
    },
    // 点击取消
    doCloseInit () {
      this.doBtnType = 'close'
      if (this.updateNum > 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          message: `取消操作会重置当前表单，是否继续？`,
          button: ['确认', '取消'],
          yes () {
            that.doRole()
            that.doInit()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        // 查询所有岗位
        this.doRole()
        // 查询用户详情
        this.doInit()
      }
    },
    // 点击列表
    doPageUser () {
      this.userId = null
      this.$router.push({ name: 'user_index' })
    },
    // 点击禁用
    doDisable () {
      if (this.updateNum > 0) {
        this.doRole()
        this.doInit()
      }
      this.doDisableTableData()
    },
    // 点击禁用提示确定---确定禁用
    doDisableTableData () {
      this.userIds = [this.userId]
      // 批量禁用的接口
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/disableBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (data.successList.length > 0) {
            this.$Message.success('禁用成功!')
            this.doInit()
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        } else {
          this.$Message.error(data.message)
        }
      })
    },
    // 点击反禁用
    doEnable () {
      if (this.updateNum > 0) {
        this.doRole()
        this.doInit()
      }
      this.doEnableTableData()
    },
    // 点击反禁用提示确定---确定反禁用
    doEnableTableData () {
      this.userIds = [this.userId]
      // 批量反禁用的接口
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/enableBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (data.successList.length > 0) {
            this.$Message.success('反禁用成功!')
            this.doInit()
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        }
      })
    },
    // 点击删除
    doDelete () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: ' 注意：请确认是否要删除数据？',
        button: ['是', '否'],
        yes () {
          that.doDeleteTableData()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 点击删除提示确定---确定删除
    doDeleteTableData () {
      this.userIds = [this.userId]
      let reqdata = {
        userIds: this.userIds
      }
      this.$request.post('/financeback/sysUser/deleteBatch', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          if (data.successList.length > 0) {
            this.$Message.success('删除成功!')
            // 查询下一条数据
            this.doNextData('delete')
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        }
      })
    },
    // 为上下首末而用的初始化
    doUpDownInit (dataId) {
      let reqdata = {
        userId: dataId
      }
      this.saveIsAdmin = false
      this.$request.post('/financeback/sysUser/findDetail', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          this.updateNum = 0
          this.disabledInput = true
          // 详情数据
          // 用户手机号码和姓名
          this.user_mobile = data.mobile
          this.user_name = data.name
          this.isEnable = data.isEnable
          this.updatorNmae = data.updatorName
          this.isAdmin = data.isAdmin
          this.updateTime = this.$dayjs(data.updateTime).format('YYYY-MM-DD')
          // 保存初始的值
          this.oldSaveIsAdmin = data.isAdmin
          this.oldTableData = data.companyVoMap
          // 是否可以分配公司
          if (this.user_name === '') {
            this.disabledBtn = true
          } else {
            this.disabledBtn = false
          }
          // 是否是可编辑
          if (this.isEnable === 1) {
            // 可编辑
            this.disabledBtn = false
            this.disabledCheckBox = false
          } else {
            // 不可编辑
            this.disabledBtn = true
            this.disabledCheckBox = true
          }
          // 是否勾选业务管理员
          if (data.isAdmin === 1) {
            this.saveIsAdmin = true
          }
          // 列表
          if (Object.keys(data.companyVoMap) !== []) {
            this.tableData = []
            for (const key in data.companyVoMap) {
              if (data.companyVoMap.hasOwnProperty(key)) {
                const element = data.companyVoMap[key]
                element.indeterminate = false
                element.checkAll = false
                element.checkAllGroup = []
                // 添加核算key和id
                element.accountBookEntityId = []
                element.scope = ''
                element.updateRNum = 0
                element.updateABNum = 0
                this.tableData.push(element)
              }
            }
          }
          // 核算主体范围
          if (Object.keys(data.userAccountBookEntityVoMap) !== []) {
            for (const k in data.userAccountBookEntityVoMap) {
              this.tableData.forEach(t => {
                let _scope = ''
                let _accountBookEntityId = []
                if (t.id === parseInt(k)) {
                  if (data.userAccountBookEntityVoMap.hasOwnProperty(k)) {
                    const ele = data.userAccountBookEntityVoMap[k]
                    ele.forEach(e => {
                      // 每一个主体
                      _accountBookEntityId.push(e.accountBookEntityId)
                      _scope += e.name + '、'
                    })
                    t.accountBookEntityId = _accountBookEntityId
                    t.scope = _scope.slice(0, _scope.length - 1)
                  }
                }
              })
            }
          }
          // 岗位
          if (Object.keys(data.sysRoleMap) !== []) {
            for (const k in data.sysRoleMap) {
              this.tableData.forEach(t => {
                if (t.id === parseInt(k)) {
                  if (data.sysRoleMap.hasOwnProperty(k)) {
                    const ele = data.sysRoleMap[k]
                    ele.forEach(e => {
                      t.checkAllGroup.push(e.roleId)
                    })
                  }
                }
              })
            }
          }
          // 去重
          let _caiyaoMap = new Map()
          this.tableData = this.tableData.filter(n => !_caiyaoMap.has(n.id) && _caiyaoMap.set(n.id, 1))
          // 全选的样式
          this.tableData.forEach(t => {
            if (t.checkAllGroup.length === this.roleList.length) {
              t.checkAll = true
              t.indeterminate = false
            } else if (t.checkAllGroup.length > 0) {
              t.checkAll = false
              t.indeterminate = true
            } else {
              t.checkAll = false
              t.indeterminate = false
            }
          })
          // 获取已有公司id
          this.companyId = []
          this.tableData.forEach(el => {
            this.companyId.push(el.id)
          })
        }
      })
    },
    // 上一条-查找上一条数据
    doPreData () {
      this.preOrNext = 'pre'
      let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
      // 判断是否修改过数据
      // 判断业务管理员
      if (this.oldSaveIsAdmin === _saveIsAdmin) {
        // 判断其他
        if (this.tableData.length > 0) {
          if (this.updateNum > 0) {
            // 打开提示
            this.reminderModal = true
          } else {
            // 走上一条
            let _num = this.doFindPage(2, this.$route.query.userId)
            if (_num === '当前为首条') {
              return false
            } else {
              this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
              this.doUpDownInit(_num)
            }
          }
        } else {
          // 走上一条
          let _num = this.doFindPage(2, this.$route.query.userId)
          if (_num === '当前为首条') {
            return false
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
        }
      } else {
        // 打开提示
        this.reminderModal = true
      }
    },
    // 首条-不传参
    doFirstData () {
      let _num = this.doFindPage(1, this.$route.query.userId)
      if (_num === '当前为首条') {
        return false
      } else {
        this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
        this.doUpDownInit(_num)
      }
    },
    // 下一条-查询下一条数据
    doNextData (type) {
      this.preOrNext = 'next'
      this.doNextType = type
      let _saveIsAdmin = this.saveIsAdmin ? 1 : 0
      // 判断是否修改过数据
      // 判断业务管理员
      if (this.oldSaveIsAdmin === _saveIsAdmin) {
        // 判断其他
        if (this.tableData.length > 0) {
          // 判断列表数据是否改变
          if (this.updateNum > 0) {
            // 打开提示
            this.reminderModal = true
          } else {
            // 走下一条
            let _num = this.doFindPage(3, this.$route.query.userId, type)
            if (_num === '当前为末条') {
              return false
            } else if (_num === '跳转') {
              this.$router.push({ name: 'create_user' })
            } else {
              this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
              this.doUpDownInit(_num)
            }
          }
        } else {
          // 走下一条
          let _num = this.doFindPage(3, this.$route.query.userId, type)
          if (_num === '当前为末条') {
            return false
          } else if (_num === '跳转') {
            this.$router.push({ name: 'create_user' })
          } else {
            this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
            this.doUpDownInit(_num)
          }
        }
      } else {
        // 打开提示
        this.reminderModal = true
      }
    },
    // 末条-不传参
    doLastData () {
      let _num = this.doFindPage(4, this.$route.query.userId)
      if (_num === '当前为末条') {
        return false
      } else {
        this.$router.push({ name: 'update_user', query: { userId: _num, isEnable: this.parIsEnable, orMatch: this.parOrMatch } })
        this.doUpDownInit(_num)
      }
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
    // 监听分配用户弹窗传来的用户，生成用户列表
    doGetCompanyList (msg) {
      msg.forEach(e => {
        e.indeterminate = false
        e.checkAll = false
        e.checkAllGroup = []
        // 添加核算key和id
        if (e.hasSubAccount === 0) {
          e.updateRNum = 1
          e.accountBookEntityId = e.accountBookEntityVo ? [e.accountBookEntityVo.id] : []
          e.scope = e.accountBookEntityVo ? e.accountBookEntityVo.entityName : ''
        } else {
          e.accountBookEntityId = []
          e.scope = ''
          e.updateRNum = 0
        }
        e.updateABNum = 0
        this.tableData.push(e)
      })
      this.updateNum++
      // 获取已有公司id
      this.tableData.forEach(el => {
        this.companyId.push(el.id)
      })
    },
    // 关闭分配用户弹窗
    assignClose (msg) {
      this.assignModal = false
    },
    // 打开--新增和列表中的复制--弹窗
    showModal (index, row) {
      if (!row.checkAllGroup) {
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
      if (row.checkAll) {
        row.checkAllGroup = []
        this.roleList.forEach(r => {
          row.checkAllGroup.push(r.roleId)
        })
      } else {
        row.checkAllGroup = []
      }
      this.updateNum++
      row.updateRNum++
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
      row.updateRNum++
      let _index = this.tableData.findIndex(t => t.id === row.id)
      if (_index > -1) {
        this.tableData[_index] = row
      }
    },
    // 监控多行文本框的字数
    getWordNumber () {
      this.number = this.authField.desc.length
    },
    // 点击列表中删除
    remove (index, row) {
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
          that.$CloseCtl()
        }
      })
    },
    // 行删除用户的岗位
    deleteUserAssign () {
      let reqdata = {
        companyIds: this.companyIds,
        userId: this.userId
      }
      this.$request.post('/financeback/sysUser/assignDelete', reqdata).then(response => {
        let { status } = response.data
        if (status === 'success') {
          this.$Message.success('删除成功!')
          this.doInit()
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
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
@import "../business/title.less";
.company-user {
  .enable-span {
    color: #ccc;
  }
  .checkbox-width {
    width: 180px;
  }
  .tab-box{
    padding: 0px 16px;
  }
  .update-name {
    padding-left: 36px;
  }
  .input-box {
    padding: 0px 16px;
    .input-box-centent {
      padding-top: 16px;
      padding-bottom: 16px;
      .centent-row {
        padding-bottom: 8px;
      }
    }
  }
  //表格高度
  .ivu-table td {
    border-right: none;
  }
  .table-scope {
    display: flex;
    justify-content: space-between;
    .table-scope-icon {
      text-align: right;
    }
  }
  .ivu-table-border th {
    border-right: none;
  }
  .ivu-tooltip-rel {
    padding-top:4px;
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
  .ivu-input-wrapper {
    // width: 200px !important;
  }
  .update-name {
    padding-left: 36px;
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
  .tableHeight {
    height: 36px;
  }
  .ivu-checkbox-wrapper {
    cursor: pointer;
    font-size: 12px;
    display: inline-block;
  }
  .assign-button {
    float:right;
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
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
}
</style>
