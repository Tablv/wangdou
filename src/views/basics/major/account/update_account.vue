<template>
  <section class="account-container">
    <common-icon v-show="isDisabled" class="yishixiao" type="_yishixiao1"/>
    <common-icon v-if="!!isDel" class="yishixiao" type="_yishanchu"/>
    <Spin fix v-if="isloading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">查看银行账号</div>
      <div class="page-header-actions">
        <Button type="primary" :disabled="isDisabled || !!isDel" @click.native="toUpdate">保存</Button>
        <Button @click="doClear">取消</Button>
        <Button @click="toCreate">新增</Button>
        <Button @click="doCopy">复制</Button>
        <Button @click="doDelete" :disabled="isDisabled || !!isDel">删除</Button>
        <Button @click="goElementList">列表</Button>
        <Button @click="doDisable" :disabled="!!isDel" v-if="!isDisabled">禁用</Button>
        <Button @click="doUnDisable" :disabled="!!isDel" v-if="isDisabled">反禁用</Button>
        <Button @click="dofindFirst" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye"/>
          </span>
        </Button>
        <Button icon="ios-arrow-back" @click="dofindPrevious"></Button>
        <Button icon="ios-arrow-forward" @click="dofindNext"></Button>
        <Button @click="dofindEnd" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye"/>
          </span>
        </Button>
      </div>
    </section>
    <section class="page-content account-page-content">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="form_init">
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="创建公司" prop="companyName">
              <radio-select :config="company_config" v-model="formValidate.companyName" @on-close="doResetCompanyConfig" @change="doCompanyChange" @getData="getCompanyData" :reset="company_config.refresh" :disabled="isDisabled || isRelation || !!isDel">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="4">
                      <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                        <Option v-for="item in companytype_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input v-model="company_config.request_params.codeOrName" class="unerror_input" placeholder="公司编码/名称" clearable @on-enter="doSearchCompany">
                        <Button slot="append" icon="ios-search" @click="doSearchCompany"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="doResetCompanyConfig">重置</Button>
                    </Col>
                  </Row>
                </div>
              </radio-select>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="核算主体" prop="auxiliaryName">
              <div v-show="!formValidate.companyName" @click="doFoucs" style="height: 32px; position: absolute; z-index: 1000; width: calc(100%);"></div>
              <radio-select :config="auxiliary_config" v-model="formValidate.auxiliaryName" @on-close="doResetAuxiliaryConfig" @getData="getAuxiliaryData" :reset="auxiliary_config.refresh" :disabled="isDisabled || isRelation || !!isDel">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="8">
                      <Input v-model="auxiliary_config.request_params.codeOrName" class="unerror_input" placeholder="核算账簿编码/名称" clearable @on-enter="doSearchAuxiliary">
                        <Button slot="append" icon="ios-search" @click="doSearchAuxiliary"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="doResetAuxiliaryConfig">重置</Button>
                    </Col>
                  </Row>
                </div>
              </radio-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="银行账号" prop="account">
              <Input v-model="formValidate.account" :disabled="isDisabled || isRelation || !!isDel" clearable @on-change="doChangeForm"></Input>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="开户银行" prop="depositBankName">
              <radio-select :config="bank_config" v-model="formValidate.depositBankName" @on-close="doResetBankConfig" @getData="getBankData" :reset="bank_config.refresh" :disabled="isDisabled || isRelation || !!isDel">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="8">
                      <Input v-model="bank_config.request_params.codeOrName" class="unerror_input" placeholder="开户银行编码/名称" clearable @on-enter="doSearchBank">
                        <Button slot="append" icon="ios-search" @click="doSearchBank"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="doResetBankConfig">重置</Button>
                    </Col>
                  </Row>
                </div>
              </radio-select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="账户类型" prop="accType">
              <Select v-model="formValidate.accType" :label-in-value="true" placeholder="请选择账户类型" @on-change="doAcctypeChange" :disabled="isDisabled || isRelation || !!isDel">
                <Option v-for="(item, index) of typeList" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="账户名称" prop="name">
              <Input v-model="formValidate.name" :disabled="isDisabled || !!isDel" @on-change="doChangeForm"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="账户用途" prop="accUsage">
              <Select v-model="formValidate.accUsage" :label-in-value="true" placeholder="请选择账户用途" @on-change="doAccUsageChange" :disabled="isDisabled || !!isDel">
                <Option v-for="(item, index) in useList" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <FormItem label="币种" prop="currency">
              <Select v-model="currency" placeholder="请选择币种" @on-change="doChangeForm" :disabled="isDisabled || isRelation || !!isDel">
                <Option v-for="(item, index) in bankAccountCurrencies" :value="item.currencyId" :key="index">{{ item.currencyName }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
  </section>
</template>
<script>
import { Validation } from '@/libs/util'
import { saasMixin } from '@/libs/mixins'
import CommonIcon from '_c/common-icon'
import RadioSelect from '_c/radio-select'
export default {
  name: 'update_account',
  components: {
    CommonIcon,
    RadioSelect
  },
  computed: {
    currency () {
      return this.bankAccountCurrencies[0].currencyId
    },
    isDisabled () {
      return this.formValidate.isEnable === 0
    },
    isRelation () {
      return this.formValidate.reference === true
    }
  },
  data () {
    return {
      company_config: { // 归属公司配置
        type: 'company',
        title: '选择公司',
        refresh: false,
        request_params: {
          companyFormId: null,
          codeOrName: '',
          isEnterpriseAdmin: 1,
          // menuCode: this.$route.name
          menuCode: 'account_index'
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
      auxiliary_config: { // 核算主体配置
        type: 'auxiliary',
        title: '选择核算主体',
        refresh: false,
        request_params: {
          companyId: '',
          companyHasSubAccount: '', // 是否分账核算
          codeOrName: ''
        }
      },
      bank_config: { // 开户银行配置
        type: 'bank',
        title: '选择开户银行',
        refresh: false,
        request_params: {
          codeOrName: ''
        }
      },
      isloading: false, // 加载动画
      hasSubAccount: null, // 是否分账核算
      formDisabled: true, // 表单不可编辑
      isDel: 0, // 是否已删除 0未删除 1删除
      changed: false, // 表单是否变动
      formValidate: {
        id: null, // 待更新ID
        companyId: null, // 归属公司Id
        companyName: '', // 归属公司
        useCompanyId: null, // 使用公司Id
        depositBankId: null, // 开户银行Id
        depositBankName: null, // 开户银行名称
        auxiliaryId: null, // 核算主体Id
        auxiliaryName: null, // 核算主体
        account: null, // 银行账号
        name: null, // 账户名称
        accType: 37, // 账户类型Id
        accTypeName: '一般户', // 账户类型名称
        accUsage: 40, // 账户用途Id
        accUsageName: '收支', // 账户用途名称
        bankAccountCurrencies: [], // 币种列表
        isEnable: null, // 是否失效
        lastUpdateTime: null // 修改时间
      },
      bankAccountCurrencies: [
        {
          currencyId: 1,
          currencyName: '人民币'
        }
      ],
      typeList: [ // 全部账户类型
      ],
      useList: [// 全部账户用途
      ],
      rulePass: true,
      // form表达验证
      ruleValidate: {
        companyName: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        auxiliaryName: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        account: [ { required: true, validator: Validation.bankAccountCheck, trigger: 'change' } ],
        depositBankName: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        accType: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        name: [ { required: true, validator: Validation.accountNameRule, trigger: 'change' } ]
      },
      doFirst: false,
      doPrevious: false,
      doNext: false,
      doEnd: false
    }
  },
  mixins: [saasMixin],
  created () {
    this.doGetInit()
    // 初始化账户类型
    this.initAccUsage()
    // 初始化账户用途
    this.initAccType()
  },
  watch: {
    changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    /**
     * 开户银行下发查询
     * 开户银行查询字段取反
     */
    doSearchBank () {
      this.bank_config.refresh = !this.bank_config.refresh
    },
    /**
     * 监听组件返回值
     */
    getBankData (data, item) {
      this.changed = true
      if (!item) { return }
      this.formValidate.depositBankId = data.id
      this.formValidate.depositBankName = data.name
    },
    /**
     * 开户银行组件重置
    */
    doResetBankConfig () {
      this.bank_config.request_params.codeOrName = ''
      this.doSearchBank()
    },
    /**
     * 核算主体下发查询
     */
    doSearchAuxiliary () {
      this.auxiliary_config.refresh = !this.auxiliary_config.refresh
    },
    /**
     * 监听组件返回值
     */
    getAuxiliaryData (data, item) {
      this.changed = true
      if (!item) { return }
      this.formValidate.auxiliaryId = data.id
      this.formValidate.auxiliaryName = data.name
    },
    /**
     * 核算主体重置
     */
    doResetAuxiliaryConfig () {
      this.auxiliary_config.request_params.codeOrName = ''
      this.doSearchAuxiliary()
    },
    /**
     * 选择归数据公司-重新下发查询
     */
    doSearchCompany () {
      this.company_config.refresh = !this.company_config.refresh
    },
    /**
     * 选择归属公司-公司形态
     * 公司形态选项变化时触发
     * 主要为了剔除 全部形态 0
     */
    doCompanyFormIdChange (val) {
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
      this.doSearchCompany()
    },
    /**
     * 监听公司组件返回接口
     * data：标准数据
     * item：详细数据
     */
    getCompanyData (data, item) {
      this.changed = true
      if (item) {
        this.formValidate.companyName = data.name
        this.formValidate.companyId = data.id
        this.auxiliary_config.request_params.companyHasSubAccount = item.hasSubAccount
        this.auxiliary_config.request_params.companyId = item.id
      } else {
        this.formValidate.companyName = ''
        this.formValidate.companyId = ''
        this.auxiliary_config.request_params.companyHasSubAccount = ''
        this.auxiliary_config.request_params.companyId = ''
      }
      this.formValidate.auxiliaryId = ''
      this.formValidate.auxiliaryName = ''
    },
    doFoucs (val) {
      if (this.formValidate.companyName === '') {
        this.$Message.warning('请先选择公司！')
      }
    },
    /**
     * 监听公司输入信息
     */
    doCompanyChange (event) {
      if (event) {
        this.formValidate.companyName = event.target.value
      } else {
        this.formValidate.companyName = ''
      }
    },
    /**
     * 账户类型请求
     */
    initAccType () {
      this.$request.post('/financeback/bankAccount/findAccType', {}).then(({ data }) => {
        if (data && data.code === 200) {
          this.typeList = data.data
        }
      })
    },
    /**
     * 账户类型切换
     */
    doAcctypeChange (val) {
      this.changed = true
      this.formValidate.accType = val.value
      this.formValidate.accTypeName = val.label
    },
    /**
     * 账户用途请求
     */
    initAccUsage () {
      this.$request.post('/financeback/bankAccount/findAccUsage', { isEnterpriseAdmin: 1 }).then(({ data }) => {
        if (data && data.code === 200) {
          this.useList = data.data
        }
      })
    },
    /**
     * 账户用途切换
     */
    doAccUsageChange (val) {
      this.changed = true
      this.formValidate.accUsage = val.value
      this.formValidate.accUsageName = val.label
    },
    /**
     * 查询是否开启分账核算
     */
    doGethasSubAccount () {
      let params = {
        codeOrName: this.formValidate.companyName,
        isEnterpriseAdmin: 1,
        // menuCode: this.$route.name,
        menuCode: 'account_index',
        page: {
          current: 1,
          size: 1
        }
      }
      this.$request.post('/financeback/company/findCompanyPage', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.auxiliary_config.request_params.companyHasSubAccount = data.data.records[0].hasSubAccount
          if (!this.formValidate.companyName) {
            this.formValidate.companyName = data.data.records[0].name
          }
        }
      })
    },
    /**
     * 初始化数据
     */
    doGetInit () {
      if (this.$route.query.id) {
        this.formValidate.auxiliaryId = null
        this.isloading = true
        this.$request.post('/financeback/bankAccount/findBankAccount', { id: this.$route.query.id, isEnterpriseAdmin: 1 }).then(res => {
          this.isloading = false
          let { code, data } = res.data
          if (code === 200 && data) {
            this.changed = false
            this.isDel = data.isDel
            this.formValidate = data
            this.formValidate.accType = this.accTypeCheck(data.accTypeName)
            this.formValidate.accUsage = this.accUsageCheck(data.accUsageName)
            this.auxiliary_config.request_params.companyId = this.formValidate.companyId
            this.doGethasSubAccount()
          }
        })
      }
      this.changed = false
    },
    /**
     * 取消按钮
     */
    doClear () {
      if (this.changed) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '提示信息',
          message: '取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl() // 关闭弹窗
            that.changed = false
            that.doGetInit()
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      }
    },
    /**
     * 保存提示框
     */
    doShowTips (callback) {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () { // 是
          that.$CloseCtl()
          that.doUpdate(callback)
        },
        no () { // 否
          that.$CloseCtl()
          callback()
        },
        cancel () { // 取消
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 页签关闭时的弹窗
     */
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前页面数据已发生变化，是否保存再继续？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl()
          that.doUpdate(that.doContinueActions)
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 监听表单数据变化
     */
    doChangeForm () {
      this.changed = true
    },
    /**
     * 表单校验规则
     */
    doCheckForm () {
      let rule = [
        { prop: 'companyName', name: '归属公司' },
        { prop: 'auxiliaryName', name: '核算主体' },
        { prop: 'account', name: '银行账号' },
        { prop: 'depositBankName', name: '开户银行' },
        { prop: 'accType', name: '账户类型' },
        { prop: 'name', name: '账户名称' }
      ]
      this.rulePass = true
      this.doCheckRule(rule, 'rulePass')
      return this.rulePass
    },
    /**
     * 检验递归函数
     */
    doCheckRule (propList, flagName) {
      let obj = propList[0] // 拿到要验证的项
      this.$refs['formValidate'].validateField(obj.prop, valid => {
        if (valid) { // 如果有返回值，中止递归
          this[flagName] = false
          return this.$Message.error(`${obj.name}:${valid}`)
        } else if (propList.length > 1) { // 如果没有返回值，并且prop还有值，执行递归
          propList.shift()
          this.doCheckRule(propList, flagName)
        }
      })
    },
    /**
     * 更新请求
     */
    doUpdate (callback) {
      if (this.doCheckForm()) {
        this.formValidate.bankAccountCurrencies = this.bankAccountCurrencies
        this.formValidate.isEnterpriseAdmin = 1
        this.$request.post('/financeback/bankAccount/updateBankAccount', this.formValidate).then(res => {
          let { status } = res.data
          if (status === 'success') {
            this.changed = false
            this.$Message.success('保存成功')
            if (callback) { callback() }
          }
        })
      }
    },
    /**
     * 保存按钮
     */
    toUpdate () {
      this.doUpdate(this.doGetInit)
    },

    /**
     * 删除按钮
     */
    doDelete () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '确认删除',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl()
          that.deleteRequest()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
      // this.deleteRequest()
    },
    /**
     * 删除请求
     */
    deleteRequest (name) {
      let params = {
        id: this.formValidate.id,
        version: this.formValidate.version,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/bankAccount/deleteBankAccount', params).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          if (data.successList.length) {
            this.$Message.success('删除成功')
            this.findPrevious('delete')
          } else {
            this.$Message.error('删除失败' + data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 禁用按钮
     */
    doDisable () {
      this.disableRequest()
    },
    /**
     * 禁用请求
     */
    disableRequest (name) {
      let params = {
        id: this.formValidate.id,
        version: this.formValidate.version,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/bankAccount/disableBankAccount', params).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          if (data.successList.length) {
            this.$Message.success('禁用成功')
            this.doGetInit()
          } else {
            this.$Message.error('禁用失败' + data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 反禁用按钮
     */
    doUnDisable () {
      this.doModalUnDisableOk()
    },
    /**
     * 反禁用操作请求
     */
    doModalUnDisableOk () {
      let params = {
        id: this.formValidate.id,
        version: this.formValidate.version,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/bankAccount/enableBankAccount', params).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          if (data.successList.length) {
            this.$Message.success('反禁用成功')
            this.doGetInit()
          } else {
            this.$Message.error('反禁用失败' + data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 新增按钮
     */
    toCreate () {
      this.doLocationDetail('create_account')
    },
    // 跳转到银行账号的列表页
    goElementList () {
      this.doLocationDetail('account_index')
    },
    /**
     * 复制按钮
     * 检查当前页面有没有修改或者输入新值
     */
    doCopy () {
      this.changed ? this.doShowTips(() => { this.$router.push({ name: 'create_account', query: { id: this.$route.query.id } }) }) : this.doLocationDetail('create_account', { id: this.$route.query.id })
    },
    dofindFirst () {
      if (this.changed) {
        this.doShowTips(this.findFirst)
      } else {
        this.findFirst()
      }
    },
    // 首条
    findFirst () {
      let id = this.$route.query.id
      let _num = this.doFindPage(1, id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.$router.push({ query: { id: _num } })
        this.doGetInit()
      }
    },
    dofindPrevious () {
      if (this.changed) {
        this.doShowTips(this.findPrevious)
      } else {
        this.findPrevious()
      }
    },
    // 上一条
    findPrevious () {
      let id = this.$route.query.id
      let _num = this.doFindPage(2, id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.$router.push({ query: { id: _num } })
        this.doGetInit()
      }
    },
    dofindNext () {
      if (this.changed) {
        this.doShowTips(this.findNext)
      } else {
        this.findNext()
      }
    },
    // 下一条
    findNext (type) {
      let id = this.$route.query.id
      let _num = this.doFindPage(3, id, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        setTimeout(() => {
          this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
        }, 1000)
        setTimeout(() => {
          this.closeTag({ route: this.$route })
        }, 3000)
      } else {
        this.$router.push({ query: { id: _num } })
        this.doGetInit()
      }
    },
    dofindEnd () {
      if (this.changed) {
        this.doShowTips(this.findEnd)
      } else {
        this.findEnd()
      }
    },
    // 尾条
    findEnd () {
      let id = this.$route.query.id
      let _num = this.doFindPage(4, id.id)
      if (_num === '当前为末条') {
        return false
      } else {
        this.$router.push({ query: { id: _num } })
        this.doGetInit()
      }
    },
    // 校验账户类型
    accTypeCheck (value) {
      let accType = null
      switch (value) {
        case '一般户':
          accType = 37
          break
        case '基本户':
          accType = 38
          break
        case '专户账户':
          accType = 39
          break
      }
      return accType
    },
    // 校验账户用途
    accUsageCheck (value) {
      let accUsage = null
      switch (value) {
        case '收支':
          accUsage = 40
          break
        case '收入':
          accUsage = 41
          break
        case '支出':
          accUsage = 42
          break
      }
      return accUsage
    },
    // 重复性校验
    repeatCheck () {
      let checks = {
        id: this.formValidate.depositBankId,
        account: this.formValidate.account,
        name: this.formValidate.name,
        isEnterpriseAdmin: 1
      }
      if (this.formValidate.account === null || this.formValidate.name === null) {
        return true
      } else {
        if (this.changed === true) {
          this.$request.post('/financeback//bankAccount/findHasAccountOrName', checks).then(res => {
            let { code } = res.data
            if (code === 11002) {
              this.$Message.warning('当前数据已存在，请重新输入')
            }
          })
        }
      }
    }
  }
}
</script>
<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
.account-container {
  button {
    border-radius: 0 !important;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  .form_init {
    margin-left: 56px;
    margin-top: 12px;
    .ivu-row .ivu-col {
      margin-bottom: 0px;
      .ivu-form-item-content {
        width: 300px;
        height: 32px;
      }
    }
    .input_icon {
      position: absolute;
      right: 4px;
      top: 6px;
      color: #808695;
    }
    .unerror_input {
      .ivu-input {
        border-color: #e5e5e5;
      }
      .ivu-input-group-append {
        border-color: #e5e5e5;
      }
    }
  }
  .account-page-content{
    width: 1495px;
    .ivu-form{
      .ivu-form-item-error-tip{
        display: none;
      }
      .radio-select {
        overflow: visible;
        .search-contain {
          margin-bottom: 10px;
          .search-input {
            width: 250px;
          }
          .ivu-icon-ios-close-circle {
            right: 40px !important;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
