<template>
  <div class="authUserModal">
    <Modal
      class-name="auth-modal large-modal"
      v-model="authModal"
      :closable="false"
      :transfer="false"
      :mask-closable="false"
    >
      <header
        class="modal-header"
        slot="header"
      >
        <div class="modal-header-name page-header-name">{{titleName}}</div>
        <div class="modal-header-actions">
          <Button
            type="primary"
            @click="doOpenAssign"
          >分配用户</Button>
        </div>
      </header>
      <article>
        <Row class-name="modal-company-info" v-if="titleName === '授权用户'">
          <Col span="8">
          <span class="style1">公司编码</span>
          <span class="style2">{{companyCode}}</span>
          </Col>
          <Col span="16">
          <span class="style1">公司名称</span>
          <span class="style2">{{companyName}}</span>
          </Col>
        </Row>
        <section class="company" v-if="titleName === '批量授权用户'">
          <Table :columns="columns" :data="companyData" :disabled-hover="true" height=161></Table>
        </section>
        <section class="auth-user">
          <Table
            :max-height="titleName === '授权用户' ? 461 : 348"
            :columns="authTableColumns"
            :data="authTableData"
            :disabled-hover="true"
            :no-data-text="null"
            :class="authTableData.length ? null : 'tableHeight'"
          >
            <!-- 核算主体范围 -->
            <template slot-scope="{ row,index}" slot="scope">
              <div class="table-scope">
                <span>{{row.scope}}</span>
                <span class="table-span table-scope-icon" @click="doScopeIcon(row, index)">
                  <Icon type="md-more" size="16" slot="suffix" />
                </span>
              </div>
            </template>
            <!-- 岗位权限 -->
            <template slot-scope="{ row,index }" slot="authority">
              <div>
                <Checkbox
                  :indeterminate="row.indeterminate"
                  :value="row.checkAll"
                  @click.prevent.native="handleCheckAll(row, index)"
                  class="check-box"
                >全选</Checkbox>
              </div>
              <CheckboxGroup
                v-model="row.checkAllGroup"
                @on-change="checkAllGroupChange(row.checkAllGroup, row ,index)"
              >
                <Checkbox v-for="(item, index) in roleList" :key="index" :label="item.roleId" class="check-box">{{item.name}}</Checkbox>
              </CheckboxGroup>
            </template>
            <!-- 操作 -->
            <template slot-scope="{ row, index }" slot="action">
              <span
                class="table-span table-right"
                @click="doRemove(row, index)"
              >删除</span>
              <span @click="doOpenCopy(row, index)" class="table-span table-right">复制岗位权限到其他用户</span>
              <Poptip trigger="hover" class="my_poptip" placement="top-end" offset="17px,15px">
                <Icon type="ios-help-circle-outline" size="14" class="icon_help"/>
                <div class="" slot="content" >其他用户是指当前列表中的其他行的用户</div>
              </Poptip>

            </template>
          </Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="authTableData.length===0"></nodata>
        </section>
      </article>
      <footer slot="footer">
        <div class="modal-footer-actions">
          <Button type="primary" @click="doConfirm">保存</Button>
          <Button type="default" @click="doCancel">取消</Button>
        </div>
      </footer>
    </Modal>
    <!-- 选择核算主体范围 -->
    <accountBody :value="showScopeModal" :list="allCompanyAccountEntity" :selectedValues="selectedValues" title="选择核算主体"
                 @on-select="doGetDataList" @on-visibe-change="onVisibeChange"></accountBody>
    <!-- 取消提示弹窗 -->
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
          <Button type="primary" @click="confirm">是</Button>
          <Button  @click="doDeny">否</Button>
          <Button type="default" @click="cancel">取消</Button>
        </div>
      </Modal>
    <!-- 删除提示弹窗 -->
      <Modal
          :closable="false"
          :transfer="false"
          :mask-closable="false"
          v-model="deleteModal"
          class-name="title-modal">
          <p slot="header" style="text-align:left;">
              <common-icon type="_guide" class="guide"></common-icon>
              <span>确认删除</span>
          </p>
          <p>
            <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
          </p>
          <div slot="footer">
            <Button type="primary" @click="doDelete">是</Button>
            <Button type="default" @click="doNoDelete">否</Button>
          </div>
      </Modal>
    <!-- 分配用户 -->
    <handle-assign-user-modal @modalClose="doCloseHandle" @selectUser="doGetUserList" :handleAssignUserModal="handleAssignUserModal" :userIds="userIds"></handle-assign-user-modal>
    <!-- 复制岗位权限到其他用户 -->
    <handle-copy-user-modal @modalClose="doCloseHandle" @copyRole="copyRole" :handleCopyUserModal="handleCopyUserModal" :copyData="copyData"></handle-copy-user-modal>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
import handleAssignUserModal from '../handleAssignUserModal'
import handleCopyUserModal from '../handleCopyUserModal'
import accountBody from '../accountBody'
import nodata from '_c/nodata'
import { contains } from '@/libs/tools.js'
import { saasMixin } from '@/libs/mixins.js'

export default {
  name: 'authUserModal',
  components: {
    CommonIcon,
    handleAssignUserModal,
    handleCopyUserModal,
    nodata,
    accountBody
  },
  props: {
    authModal: {
      defalult: false,
      type: Boolean
    },
    titleName: {
      type: String
    },
    companyId: {
      type: Number
    },
    companyCode: {
      type: String
    },
    companyName: {
      type: String
    },
    hasSubAccount: {
      type: Number
    },
    companyData: {
      type: Array
    }
  },
  data () {
    return {
      hasRoleAuth: false,
      arrList: [],
      title: '',
      deleteModal: false, // 删除提示
      reminderModal: false, // 取消提示
      handleAssignUserModal: false, // 分配用户
      handleCopyUserModal: false, // 复制用户
      userIds: [], // 已授权的用户
      copyData: [], // 复制给弹窗的用数组
      authTableColumns: [
        {
          title: '序号',
          type: 'index',
          maxWidth: 60
        },
        {
          title: '用户手机号码',
          key: 'mobile',
          maxWidth: 120
        },
        {
          title: '用户姓名',
          key: 'name',
          maxWidth: 120
        },
        {
          title: '核算主体范围',
          slot: 'scope',
          width: 260
        },
        {
          title: '岗位权限',
          slot: 'authority'
        },
        {
          title: '操作',
          slot: 'action',
          maxWidth: 300
        }
      ],
      columns: [ // 批量授权的公司表头
        {
          title: '序号',
          type: 'index',
          maxWidth: 60
        },
        {
          title: '编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        }
      ],
      authTableData: [],
      roleList: [], // 全部岗位数据
      companyIds: [], // 公司ID
      selectedRole: [], // 点击复制的那一行的权限
      sysUserData: [],
      delIndex: 0, // 删除的index
      delUserId: 0, // 删除的userId
      changed: false, // 判断内容是否改变
      showScopeModal: false, // 是否显示选择核算主体范围
      tableScopeColumns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '编码',
          key: 'entityCode'
        },
        {
          title: '名称',
          key: 'entityName'
        },
        {
          title: '公司',
          key: 'companyName'
        }
      ],
      allCompanyAccountEntity: [],
      tableScopeLtData: [],
      tableScopeRtData: [],
      leftTable: [],
      rightTable: [],
      leftSearch: '',
      rightSearch: '',
      toRightDisabled: true,
      toLeftDisabled: true,
      selectLtData: [],
      selectRtData: [],
      scope_array: [],
      currentIndex: null,
      selectedValues: [],
      noAccountEntity: null,
      demo1: []
    }
  },
  watch: {
    authModal (val) {
      if (val === true) {
        if (this.titleName === '授权用户') {
          this.doRole()
          this.doGetUserAccountEntity()
          // this.doGetInit()
        } else {
          this.doRole()
        }
        this.doGetAllCompanyAccountEntity()
      }
    }
  },
  methods: {
    doGetDataList (data) {
      let _scope = ''
      let _accountBookEntityId = []
      let _demo1 = []
      data.forEach(s => {
        // 每一个主体
        _accountBookEntityId.push(s.id)
        _scope += s.entityName + '、'
      })
      this.allCompanyAccountEntity.forEach(m => {
        if (m.form === 2) {
          _demo1.push(m)
        }
      })
      this.$set(this.authTableData[this.currentIndex], 'accountBookEntityId', _accountBookEntityId)
      this.$set(this.authTableData[this.currentIndex], 'scope', _scope.slice(0, _scope.length - 1))
      this.showScopeModal = false
      this.demo1 = _demo1.concat(data)
    },
    onVisibeChange (val) {
      this.showScopeModal = val
    },
    // 初始化
    doGetInit () {
      let req = {
        companyId: this.companyId
        // page: {
        //   size: 10,
        //   current: 1
        // }
      }
      return this.$request.post('/financeback/sysUser/findPermPage', req).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          let _authTableData = []
          data.records.forEach(item => {
            // let checkAllGroup. = item.roleIds.split(',').map(i => Number(i))
            let checkAllGroup = []
            item.roleIds.split(',').forEach(id => {
              if (contains(this.roleList, id, function (arrItem, item) {
                return arrItem.roleId === Number(item)
              })) {
                checkAllGroup.push(Number(id))
              }
            })
            let checkAll = false
            checkAllGroup.length === this.roleList.length ? checkAll = true : checkAll = false
            let indeterminate = false
            checkAllGroup.length === 0 || checkAllGroup.length === this.roleList.length ? indeterminate = false : indeterminate = true
            _authTableData.push({
              userId: item.userId,
              mobile: item.mobile,
              name: item.name,
              assignRoleIds: checkAllGroup,
              checkAllGroup,
              checkAll,
              indeterminate
            })
          })
          this.changed = false
          return _authTableData
        }
      })
    },
    // 查询所有岗位
    doRole () {
      this.$request.post('/financeback/sysRole/findList').then(res => {
        let { code, data } = res.data
        if (code === 200) {
          this.roleList = data
        }
      })
    },
    // 查询公司下用户关联的账簿主体
    doGetUserAccountEntity () {
      this.doGetInit().then(d => {
        let req = {
          companyId: this.companyId
        }
        this.$request.post('financeback/sysUser/findAccountBookEntityByCompany', req).then(res => {
          let { code, data } = res.data
          if (code === 200) {
            d.forEach(item => {
              let _scope = ''
              let _accountBookEntityId = []
              for (let i in data) {
                if (item.userId === parseInt(i)) {
                  const ele = data[i]
                  ele.forEach(e => {
                    // 每一个主体
                    _accountBookEntityId.push(e.accountBookEntityId)
                    _scope += e.name + '、'
                  })
                  item.accountBookEntityId = _accountBookEntityId
                  item.scope = _scope.slice(0, _scope.length - 1)
                }
              }
            })
            this.authTableData = d
            this.sysUserData = d
          }
        })
      })
    },
    // 获取公司下所有核算主体数据
    doGetAllCompanyAccountEntity () {
      let reqdata = []
      if (this.titleName === '授权用户') {
        reqdata = [
          {
            companyId: this.companyId,
            companyHasSubAccount: this.hasSubAccount
          }
        ]
      } else {
        this.companyData.forEach(item => {
          let req = {
            companyId: item.id,
            companyHasSubAccount: item.hasSubAccount
          }
          reqdata.push(req)
        })
      }
      this.$request.post('/financeback/company/findAccountBookEntityList', reqdata).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          this.allCompanyAccountEntity = data
          for (let i = 0, len = this.allCompanyAccountEntity.length; i < len; i++) {
            if (this.allCompanyAccountEntity[i].form === 2) {
              this.noAccountEntity = this.allCompanyAccountEntity[i]
            } else {
              this.noAccountEntity = null
            }
          }
          if (this.authTableData.length > 0 && !!this.noAccountEntity) {
            this.authTableData.forEach(item => {
              this.$set(item, 'accountBookEntityId', [this.noAccountEntity.entityId])
              this.$set(item, 'scope', entityName)
            })
          }
        }
      })
    },
    // 点击核算主体范围选择按钮
    doScopeIcon (row, index) {
      this.currentIndex = index
      this.selectedValues = this.authTableData[this.currentIndex].accountBookEntityId
      if (this.titleName === '授权用户') {
        if (this.hasSubAccount === 0) {
          this.$Message.warning('公司没有分账核算')
          this.showScopeModal = false
        } else {
          this.showScopeModal = true
        }
      } else {
        this.showScopeModal = true
      }
    },
    // 左边即时查询----输入内容，按下回车键触发
    ltenterAccountBook (value) {
      let reg = new RegExp(value)
      let arr = []
      this.leftTable.forEach(item => {
        if (reg.test(item.entityCode) || reg.test(item.entityName)) {
          arr.push(item)
        }
      })
      this.tableScopeLtData = arr
    },
    // 右边即时查询----输入内容，按下回车键触发
    rtenterAccountBook (value) {
      let reg = new RegExp(value)
      let arr = []
      this.rightTable.forEach(item => {
        if (reg.test(item.entityId) || reg.test(item.entityName)) {
          arr.push(item)
        }
      })
      this.tableScopeRtData = arr
    },
    // 左边即时查询----内容为空触发
    changeLeft (e) {
      if (e.target.value === '') {
        this.tableScopeLtData = this.leftTable
      }
    },
    // 右边即时查询----内容为空触发
    changeRight (e) {
      if (e.target.value === '') {
        this.tableScopeRtData = this.rightTable
      }
    },
    // 核算---左边列表多选
    doSelLtTableScope (ltdata) {
      this.selectLtData = []
      if (ltdata.length > 0) {
        this.toRightDisabled = false
      } else {
        this.toRightDisabled = true
      }
      ltdata.forEach(l => {
        this.selectLtData.push(l)
      })
    },
    // 核算---右边列表多选
    doSelRtTableScope (rtdata) {
      this.selectRtData = []
      if (rtdata.length > 0) {
        this.toLeftDisabled = false
      } else {
        this.toLeftDisabled = true
      }
      rtdata.forEach(r => {
        this.selectRtData.push(r)
      })
    },
    // 核算---点击按钮向右列表传数据
    doRightData () {
      // 给右列表赋值
      this.selectLtData.forEach(ele => {
        this.tableScopeRtData.push(ele)
        this.scope_array.push(ele)
      })
      // 赋值后，对应的列表中的数据取消勾选
      this.toRightDisabled = true
      this.selectLtData.forEach(s => {
        this.tableScopeLtData.forEach((m, index) => {
          if (m.entityName === s.entityName) {
            this.tableScopeLtData.splice(index, 1)
          }
        })
      })
    },
    // 核算---点击按钮向左列表传数据  tableScopeRtData
    doLeftData () {
      // 给左列表赋值
      this.selectRtData.forEach(ele => {
        this.tableScopeLtData.push(ele)
      })
      // 赋值后，对应的列表中的数据取消勾选
      this.toLeftDisabled = true
      this.selectRtData.forEach(s => {
        this.tableScopeRtData.forEach((m, index) => {
          if (m.entityName === s.entityName) {
            this.tableScopeRtData.splice(index, 1)
          }
        })
      })
    },
    // 核算---点击确定按钮
    doScopeModal () {
      // 赋值核算主体范围
      let _scope = ''
      let _accountBookEntityId = []
      this.tableScopeRtData.forEach(s => {
        // 每一个主体
        _accountBookEntityId.push(s.entityId)
        _scope += s.entityName + '、'
      })
      this.$set(this.authTableData[this.currentIndex], 'accountBookEntityId', _accountBookEntityId)
      this.$set(this.authTableData[this.currentIndex], 'scope', _scope.slice(0, _scope.length - 1))
      this.selectLtData = []
      this.selectRtData = []
      this.toLeftDisabled = true
      this.toRightDisabled = true
      this.leftSearch = ''
      this.rightSearch = ''
      this.showScopeModal = false
    },
    // 核算---点击取消按钮
    doCloseScopeModal () {
      this.selectLtData = []
      this.selectRtData = []
      this.toLeftDisabled = true
      this.toRightDisabled = true
      this.leftSearch = ''
      this.rightSearch = ''
      this.showScopeModal = false
    },
    // 全选
    handleCheckAll (row) {
      if (row.indeterminate) {
        row.checkAll = false
      } else {
        row.checkAll = !row.checkAll
      }
      row.indeterminate = false
      if (row.checkAll) {
        // 全选状态
        this.$set(row, 'checkAllGroup', [])
        this.roleList.forEach(r => {
          row.checkAllGroup.push(r.roleId)
        })
      } else {
        row.checkAllGroup = []
      }
      this.hasRoleAuth = !!row.checkAllGroup
      let flag = false
      // 更新用户权限
      this.sysUserData.forEach(item => {
        if (item.userId === row.userId) {
          item.assignRoleIds = row.checkAllGroup
          item.checkAllGroup = row.checkAllGroup
          item.checkAll = row.checkAll
          item.indeterminate = row.indeterminate
          flag = true
        }
      })
      // 添加新的用户的权限
      if (!flag) {
        this.sysUserData.push({
          userId: row.userId,
          assignRoleIds: row.checkAllGroup,
          mobile: row.mobile,
          name: row.name,
          checkAllGroup: row.checkAllGroup,
          checkAll: row.checkAll,
          indeterminate: row.indeterminate
        })
      }
      this.changed = true
    },
    // 多选
    checkAllGroupChange (data, row) {
      this.hasRoleAuth = !!data.length
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
      let flag = false
      this.sysUserData.forEach(item => {
        if (item.userId === row.userId) {
          item.assignRoleIds = row.checkAllGroup
          item.checkAllGroup = row.checkAllGroup
          item.checkAll = row.checkAll
          item.indeterminate = row.indeterminate
          flag = true
        }
      })
      if (!flag) {
        this.sysUserData.push({
          userId: row.userId,
          assignRoleIds: row.checkAllGroup,
          mobile: row.mobile,
          name: row.name,
          checkAllGroup: row.checkAllGroup,
          checkAll: row.checkAll,
          indeterminate: row.indeterminate
        })
      }
      this.changed = true
    },
    // 保存
    doConfirm () {
      let _isEmpty = this.authTableData.some(item => !item.accountBookEntityId || item.accountBookEntityId.length === 0)
      if (this.authTableData.length === 0 || this.sysUserData.length === 0) {
        this.$Message.info('在公司下至少设置一个用户的权限')
      } else if (!this.hasRoleAuth) {
        this.$Message.info('请选择用户对应的岗位权限')
      } else if (_isEmpty) {
        this.$Message.info('请选择核算主体范围')
      } else {
        if (this.titleName === '授权用户') {
          this.sysUserData.forEach(item => {
            item.accountBookEntityMap = {}
            item.accountBookEntityMap[this.companyId] = item.accountBookEntityId
            delete item.accountBookEntityId
          })
          let req = {
            companyIds: [this.companyId],
            sysUserDtoList: this.sysUserData
          }
          this.$request.post('/financeback/sysUser/assignBatchAdd', req).then(res => {
            if (res.data.code === 200) {
              this.sysUserData = []
              this.companyIds = []
              this.$Message.success('保存成功')
              this.$emit('modalClose', false)
              setTimeout(() => {
                this.authTableData = []
              }, 500)
            } else {
              this.$Message.warning('保存失败')
            }
          })
        } else {
          this.companyData.forEach(item => {
            this.companyIds.push(item.id)
          })
          // console.log(this.companyIds)
          // console.log(this.allCompanyAccountEntity)
          this.sysUserData.forEach(item => {
            item.accountBookEntityMap = {}
            this.companyIds.forEach(i => {
              // item.accountBookEntityMap[i] = item.accountBookEntityId
              item.accountBookEntityMap[i] = [...new Set(this.demo1.filter(c => c.companyId === i).map(c => c.id))]
            })
            delete item.accountBookEntityId
          })
          let req = {
            companyIds: this.companyIds,
            sysUserDtoList: this.sysUserData
          }
          // console.log(req)
          this.$request.post('/financeback/sysUser/assignBatchAdd', req).then(res => {
            if (res.data.code === 200) {
              this.sysUserData = []
              this.companyIds = []
              this.$Message.success('保存成功')
              this.$emit('modalClose', false)
              setTimeout(() => {
                this.authTableData = []
              }, 500)
            } else {
              this.$Message.warning('保存失败')
            }
          })
        }
      }
      this.changed = false
      this.userIds = []
    },
    // 取消
    doCancel () {
      if (this.changed === true) {
        this.reminderModal = true
      } else {
        this.sysUserData = []
        this.companyIds = []
        this.userIds = []
        this.changed = false
        this.$emit('modalClose', false)
        setTimeout(() => {
          this.authTableData = []
        }, 500)
      }
    },
    // 取消弹窗 ---> 是
    confirm () {
      this.doConfirm()
      this.reminderModal = false
      this.changed = false
    },
    // 取消弹窗 ---> 否
    doDeny () {
      this.reminderModal = false
      this.changed = false
      setTimeout(() => {
        this.authTableData = []
      }, 500)
      this.$emit('modalClose', false)
    },
    // 取消弹窗 ---> 取消
    cancel () {
      this.reminderModal = false
    },

    // 删除按钮
    doRemove (row, index) {
      this.delIndex = index
      this.delUserId = row.userId
      this.deleteModal = true
    },
    // 删除弹窗 ---> 是
    doDelete () {
      let _userIds = []
      if (this.titleName === '授权用户') {
        let req = {
          companyIds: [this.companyId],
          userId: this.delUserId
        }
        this.$request.post('/financeback/sysUser/assignDelete', req).then(res => {
          if (res.data.code === 200) {
            this.sysUserData.splice(this.delIndex, 1)
            this.$Message.success('删除成功')
          } else {
            this.$Message.warning('删除失败')
          }
          this.deleteModal = false
        })
      } else {
        this.companyData.forEach(item => {
          this.companyIds.push(item.id)
        })
        let req = {
          companyIds: this.companyIds,
          userId: this.delUserId
        }
        this.$request.post('/financeback/sysUser/assignDelete', req).then(res => {
          if (res.data.code === 200) {
            this.authTableData.splice(this.delIndex, 1)
            this.sysUserData.splice(this.delIndex, 1)
            this.$Message.success('删除成功')
          } else {
            this.$Message.warning('删除失败')
          }
          this.deleteModal = false
        })
      }
      this.userIds = _userIds
      this.changed = true
    },
    // 删除弹窗 ---> 否
    doNoDelete () {
      this.deleteModal = false
    },
    // 打开分配用户弹窗
    doOpenAssign () {
      // console.log(this.allCompanyAccountEntity)
      let _userIds = []
      this.authTableData.forEach(item => {
        _userIds.push(item.userId)
      })
      this.userIds = _userIds
      this.handleAssignUserModal = true
    },
    // 监听分配用户弹窗传来的用户，生成用户列表
    doGetUserList (msg) {
      this.authTableData.forEach(item => {
        msg.forEach(function (value, index) {
          if (item.userId === value.userId) {
            msg.splice(index, 1)
          }
        })
      })
      this.authTableData.push(...msg)
      this.sysUserData = this.authTableData
      if (this.authTableData.length > 0 && !!this.noAccountEntity && this.titleName === '授权用户') {
        this.authTableData.forEach(item => {
          this.$set(item, 'accountBookEntityId', [this.noAccountEntity.entityId])
          this.$set(item, 'scope', this.noAccountEntity.entityName)
        })
      }
    },
    // 打开复制用户权限弹窗
    doOpenCopy (row, index) {
      if (row.checkAllGroup.length === 0 || this.sysUserData.length === 0) {
        this.$Message.warning('当前用户没有岗位权限，请先给当前用户授权才能复制')
      } else {
        this.copyData = this.sysUserData.filter(item => item !== this.sysUserData[index])
        this.handleCopyUserModal = true
        this.selectedRole = row
      }
    },
    // 监听复制弹窗传回的用户
    copyRole (msg) {
      msg.forEach(e => {
        e.indeterminate = this.selectedRole.indeterminate
        e.checkAll = this.selectedRole.checkAll
        e.checkAllGroup = Array.from(new Set(e.checkAllGroup.concat(this.selectedRole.checkAllGroup)))
        this.sysUserData.forEach((item) => {
          if (item.userId === e.userId) {
            item.assignRoleIds = e.checkAllGroup
            item.checkAllGroup = e.checkAllGroup
            item.checkAll = e.checkAll
            item.indeterminate = e.indeterminate
          }
        })
      })
      // 重新渲染视图
      this.authTableData.forEach(td => {
        this.sysUserData.forEach(ele => {
          if (td.userId === ele.userId) {
            this.$set(td, 'checkAllGroup', ele.assignRoleIds)
            td.checkAllGroup.length === this.roleList.length ? td.checkAll = true : td.checkAll = false
            td.checkAllGroup.length === 0 || td.checkAllGroup.length === this.roleList.length ? td.indeterminate = false : td.indeterminate = true
          }
        })
      })
      this.changed = true
    },
    // 监听分配、复制操作弹窗关闭
    doCloseHandle (msg) {
      this.handleAssignUserModal = msg
      this.handleCopyUserModal = msg
    }
  },
  mixins: [saasMixin]
}
</script>
<style lang="less">
@import '../../../../../assets/css/base.less';
@import '../../../../../assets/css/redefine.less';
@import 'authUserModal.less';
</style>
