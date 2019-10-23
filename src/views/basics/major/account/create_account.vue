<template>
  <section class="account-container">
    <Spin fix v-if="isLoading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">新增银行账号</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doCreate">保存</Button>
        <Button type="default" @click="doCreateAppend">保存并新增</Button>
        <Button @click="doClear">取消</Button>
        <Button @click="goElementList">列表</Button>
      </div>
    </section>
    <section class="page-content account-page-content">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="form_init">
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="创建公司" prop="companyName">
              <radio-select :config="company_config" v-model="formValidate.companyName"
              @change="doCompanyChange"
              @getData="getCompanyData"
              @on-close="doResetCompanyConfig"
              :reset="company_config.refresh">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="4">
                      <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                        <Option v-for="item in companytype_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input class="search-button" v-model="company_config.request_params.codeOrName" placeholder="公司编码/公司名称" clearable @on-enter="doSearchCompany">
                        <Button slot="append" icon="ios-search" @click="doSearchCompany"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: -1px" @click="doResetCompanyConfig">重置</Button>
                    </Col>
                  </Row>
                </div>
              </radio-select>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="核算主体" prop="auxiliaryName">
              <div v-show="!formValidate.companyName" @click="doFoucs" style="height: 32px; position: absolute; z-index: 1000; width: calc(100%);"></div>
              <radio-select :config="auxiliary_config" v-model="formValidate.auxiliaryName" @on-close="doResetAuxiliaryConfig" @getData="getAuxiliaryData" :reset="auxiliary_config.refresh">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="8">
                      <Input v-model="auxiliary_config.request_params.codeOrName" class="search-button" placeholder="编码/名称" clearable @on-enter="doSearchAuxiliary">
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
              <Input v-model="formValidate.account" @on-change="doChangeForm" @on-blur="repeatCheck" clearable :maxlength=30></Input>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="开户银行" prop="depositBankName">
              <radio-select :config="bank_config" v-model="formValidate.depositBankName" @on-close="doResetBankConfig" @getData="getBankData" :reset="bank_config.refresh">
                <div slot="header" class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="8">
                      <Input v-model="bank_config.request_params.codeOrName" class="search-button" placeholder="编码/名称" clearable @on-enter="doSearchBank">
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
              <Select v-model="formValidate.accType" :label-in-value="true" @on-change="doAcctypeChange" placeholder="请选择账户类型">
                <Option v-for="(item, index) in typeList" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1" class="input_after">
            <FormItem label="账户名称" prop="name">
              <Input v-model="formValidate.name" @on-change="doChangeForm" @on-blur="repeatCheck" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" class="input_after">
            <FormItem label="账户用途" prop="accUsage">
              <Select v-model="formValidate.accUsage" :label-in-value="true" @on-change="doAccUsageChange" placeholder="请选择账户用途">
                <Option v-for="(item, index) in useList" :value="item.id" :key="index">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6" offset="1">
            <FormItem label="币种" prop="currency">
              <Select v-model="currency" @on-change="doChangeForm" placeholder="请选择币种">
                <Option v-for="(item, index) in bankAccountCurrencies" :value="item.currencyId" :key="index">{{ item.currencyName }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
    <!-- <Alert :type="types" show-icon v-if="alertShow" closable @on-close="alertClose" class="bank_alert" :class="{success_color: isColor,error_color: !isColor}">
      <common-icon type="_warn" slot="icon" class="icon_warn"></common-icon>
      {{successContent}}
    </Alert> -->
  </section>
</template>

<script>
import { saasMixin } from '@/libs/mixins'
import { Validation } from '@/libs/util'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'
export default {
  name: 'create_account',
  components: {
    RadioSelect
  },
  data () {
    return {
      isLoading: true,
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
      changed: false, // 判断内容有没有修改
      routeName: 'account_index', // 路由name
      formValidate: {
        code: '', // 编码
        companyId: '', // 归属公司Id
        companyName: '', // 归属公司
        useCompanyId: '', // 使用公司Id
        depositBankId: '', // 开户银行Id
        depositBankName: '', // 开户银行名称
        auxiliaryId: '', // 核算主体Id
        auxiliaryName: '', // 核算主体
        account: '', // 银行账号
        name: null, // 账户名称
        accType: null, // 账户类型Id
        accTypeName: '', // 账户类型名称
        accUsage: null, // 账户用途Id
        accUsageName: '', // 账户用途名称
        bankAccountCurrencies: [], // 币种列表
        isEnable: null // 是否失效
      },
      params: { // 查询参数
        isEnterpriseAdmin: 1, // 是否管理员
        companyIdList: [], // 查询的公司Ids
        accType: null, // 账户类型
        accUsage: null, // 账户用途
        isEnable: null, // 数据状态
        accountOrBankName: null // 银行账号/开户银行
      },
      typeList: [ // 全部账户类型
      ],
      useList: [// 全部账户用途
      ],
      bankAccountCurrencies: [
        {
          currencyId: 1,
          currencyName: '人民币'
        }
      ],
      rulePass: true,
      // form表达验证
      ruleValidate: {
        // 创建公司
        companyName: [ { validator: Validation.notEmptyRule, trigger: 'change' } ],
        auxiliaryName: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        account: [ { required: true, validator: Validation.bankAccountCheck, trigger: 'blur' } ],
        depositBankName: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        accType: [ { required: true, validator: Validation.notEmptyRule, trigger: 'change' } ],
        name: [ { required: true, validator: Validation.accountNameRule, trigger: 'blur' } ]
      }
    }
  },
  mixins: [saasMixin],
  computed: {
    currency () {
      return this.bankAccountCurrencies[0].currencyId
    }
  },
  watch: {
    changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  created () {
    // 初始化账户用途
    this.initAccType()
    // 初始化账户类型
    this.initAccUsage()
  },
  mounted () {
    if (this.$route.query.id) {
      this.doCopyInit()
    }
    setTimeout(() => { this.isLoading = false }, 200)
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),

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
      this.$set(this.company_config, 'refresh', !this.company_config.refresh)
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
        this.auxiliary_config.request_params.companyHasSubAccount = item.hasSubAccount
        this.auxiliary_config.request_params.companyId = item.id
        this.formValidate.companyId = data.id
      } else {
        this.formValidate.companyName = ''
        this.auxiliary_config.request_params.companyHasSubAccount = null
        this.auxiliary_config.request_params.companyId = null
        this.formValidate.companyId = null
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
          this.formValidate.accType = this.typeList[0].id
          this.formValidate.accTypeName = this.typeList[0].name
        }
      })
    },
    /**
     * 账户类型切换
     */
    doAcctypeChange (val) {
      if (!val) { return }
      this.changed = true
      this.formValidate.accType = val.value
      this.formValidate.accTypeName = val.label
    },
    /**
     * 账户用途请求
     */
    initAccUsage () {
      this.$request.post('/financeback/bankAccount/findAccUsage', {}).then(({ data }) => {
        if (data && data.code === 200) {
          this.useList = data.data
          this.formValidate.accUsage = this.useList[0].id
          this.formValidate.accUsageName = this.useList[0].name
        }
      })
    },
    /**
     * 账户用途切换
     */
    doAccUsageChange (val) {
      if (!val) { return }
      this.changed = true
      this.formValidate.accUsage = val.value
      this.formValidate.accUsageName = val.label
    },
    /** 币种请求 */
    /** 币种切换 */
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
     * 跳转列表页
     */
    goElementList () {
      this.doLocationDetail('account_index')
    },
    /**
     * 页签关闭时触发
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
          that.doInsert(that.doContinueActions)
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
     * 初始化数据
     */
    doGetInit () {
      this.$refs.formValidate.resetFields()
      this.formValidate.companyId = null
      this.formValidate.companyName = null
      this.formValidate.auxiliaryId = null // 核算主体ID
      this.formValidate.auxiliaryName = null // 核算主体
      this.formValidate.account = null // 银行账号
      this.formValidate.depositBankId = null // 开户银行ID
      this.formValidate.depositBankName = null // 开户银行
      this.formValidate.accType = this.typeList[0].id // 账户类型ID
      this.formValidate.accTypeName = this.typeList[0].name // 账户类型
      this.formValidate.name = null // 账户名称
      this.formValidate.accUsage = this.useList[0].id // 账户用途ID
      this.formValidate.accUsageName = this.useList[0].name // 账户用途
      this.formValidate.bankAccountCurrencies = this.bankAccountCurrencies
      this.changed = false
    },
    /**
     * 复制过来的初始化数据
     */
    doCopyInit () {
      this.isLoading = true
      this.$request.post('/financeback/bankAccount/findBankAccount', { id: this.$route.query.id, isEnterpriseAdmin: 1 }).then(res => {
        this.isLoading = false
        let { code, data } = res.data
        if (code === 200 && data) {
          this.$refs.formValidate.resetFields()
          this.formValidate = data
          this.formValidate.account = null
          this.formValidate.name = null
          this.auxiliary_config.request_params.companyId = this.formValidate.companyId
          this.doGethasSubAccount()
          this.auxiliary_config.request_params.companyHasSubAccount = 1
          this.changed = true
        }
      })
    },
    /**
     * 查询是否开启分账核算
     */
    doGethasSubAccount () {
      let params = {
        codeOrName: this.formValidate.companyName,
        isEnterpriseAdmin: 1,
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
     * 监听数据变化
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
     * 保存按钮
     * 插入成功后跳转查看页
     */
    doCreate (callback) {
      this.doInsert((data) => {
        setTimeout(() => {
          this.$router.push({ name: 'update_account', query: { id: data } })
        }, 500)
      })
    },
    /**
     * 保存并新增
     * 保存成功后重置表单
     */
    doCreateAppend (name) {
      this.doInsert(this.doGetInit)
    },
    /**
     * 插入动作
     */
    doInsert (callback) {
      if (this.doCheckForm()) {
        this.isLoading = true
        this.formValidate.bankAccountCurrencies = this.bankAccountCurrencies
        this.formValidate.isEnterpriseAdmin = 1
        this.$request.post('/financeback/bankAccount/addBankAccount', this.formValidate).then(res => {
          let { code, data } = res.data
          this.isLoading = false
          if (code === 200 && data !== 0) {
            this.changed = false
            this.$Message.success('保存成功')
            // 向状态机中加一条数据
            this.addIdToList({ id: data, name: 'account' })
            if (callback) { // 插入成功后 执行回调
              callback(data)
            }
          }
        })
      }
    },
    /**
     * 重复姓校验
     */
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
        this.$request.post('/financeback//bankAccount/findHasAccountOrName', checks).then(res => {
          let { code, data } = res.data
          if (code === 200) {
            if (data === false) {
              this.$Message.warning('当前数据已存在，请重新输入')
            }
          }
        })
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
  // 弹窗信息提示
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
    // .unerror_input {
    //   .ivu-input {
    //     border-color: #e5e5e5;
    //   }
    //   .ivu-input-group-append {
    //     border-color: #e5e5e5;
    //   }
    // }
    // 数据重复提示
    .repeat{
      position: absolute;
      display: inline-block;
      width: 48px;
      margin-left: 34px;
      line-height: 33px;
      font-family: SimSun;
      color: #ed4014;
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
