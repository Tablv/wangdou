<template>
  <div class="update_company">
    <common-icon v-if="formValidate.isDel" class="yishixiao" type="_yishanchu" />
    <section class="company-container">
      <section class="page-header">
        <div class="page-header-name">查看公司</div>
        <div class="page-header-actions">
          <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
          <Button type="primary" v-else @click="doSave" :disabled="deleteFlag">保存</Button>
          <Button @click="doCancel" :disabled="deleteFlag">取消</Button>
          <Button @click="doAdd" :disabled="deleteFlag">新增</Button>
          <Button @click="doDelete" v-if="!refFlag" :disabled="deleteFlag">删除</Button>
          <Button @click="doGoCompany" :disabled="deleteFlag">列表</Button>
          <Button  @click="findFirst" class="isfenye">
            <span class="dofenye">
              <common-icon  class="fenye" type="_shouye" />
            </span>
          </Button>
          <Button icon="ios-arrow-back" @click="findPrevious"></Button>
          <Button icon="ios-arrow-forward" @click="findNext"></Button>
          <Button class="isfenye" @click="findEnd">
            <span class="dofenye">
              <common-icon  class="fenye" type="_moye" />
            </span>
          </Button>
        </div>
      </section>
      <Alert :type="types" show-icon v-if="alertShow" closable @on-close="alertClose" class="company_alert success_color">
        <common-icon type="_warn" slot="icon" class="icon_warn"></common-icon>
        {{successContent}}
      </Alert>
      <section class="page-content">
        <Spin fix v-if="loading" style="left: 8px;z-index: 201">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <Spin fix v-if="saveLoading" style="left: 8px;z-index: 201">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>数据保存中</div>
        </Spin>
        <Row>
          <Col span="12">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" class="form_init">
              <div class="vertical-title">基本信息</div>
              <Row>
                <Col span="12" class="input_after">
                  <FormItem label="编码" prop="code">
                    <Input v-model="formValidate.code" :maxlength="10" :disabled="refFlag || deleteFlag" @on-change="doChangeForm"></Input>
                    <Poptip placement="top" trigger="hover" class="my_poptip1">
                      <Icon class="icon_help" type="md-help-circle" size="16"/>
                      <div class="" slot="content" >请输入4个字符的数字或英文字母，并且不能重复</div>
                    </Poptip>
                    <span class="repeat" v-show="this.isCode">数据重复</span>
                  </FormItem>
                </Col>
                <Col span="12" class="input_after">
                  <FormItem label="名称" prop="name">
                    <Input v-model="formValidate.name" :maxlength="60" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                    <!-- <drop-down-input v-model="item.open_bank_name"
                      :drop-down-list="item.open_bank_list ? item.open_bank_list : []"
                      key-name="bank_branch"
                      @clear="onClearBankUserName($event, item)"
                      @focus.native="remoteBankMethod"
                      @on-query-change="onBankQueryChange($event, item)">
                    </drop-down-input> -->
                    <!-- <span class="retrieval_inf">检索工商信息</span> -->
                    <span class="repeat" v-show="this.isName">数据重复</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12" class="input_after">
                  <FormItem label="形态" prop="companyForm">
                    <Select v-model="formValidate.companyFormId" :disabled="deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in formsList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="简称" prop="simpleName">
                    <Input v-model="formValidate.simpleName" :maxlength="20" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                    <span class="repeat" v-show="this.isSimpleName">数据重复</span>
                  </FormItem>
                </Col>
              </Row>
              <div class="vertical-title">工商信息</div>
              <Row>
                <Col span="12">
                  <FormItem label="成立日期" prop="establishDate">
                    <DatePicker v-model ="formValidate.establishDate" type="date" :options="options1" :disabled="deleteFlag" @on-change="doChangeForm"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="公司类型" prop="companyType">
                    <Select v-model="formValidate.companyTypeId" :disabled="deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in companyTypeList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="法定代表人" prop="legalPerson">
                    <Input v-model="formValidate.legalPerson" :maxlength="30" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="固定电话" prop="fixedPhone">
                    <Input v-model="formValidate.fixedPhone" :maxlength="12" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="手机号码" prop="phoneNumberRule">
                    <Input v-model="formValidate.phoneNumberRule" :maxlength="11" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="统一社会信用代码" prop="creditCode">
                    <Input v-model="formValidate.creditCode" :maxlength="18" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="纳税人识别号" prop="taxPayerNumber">
                    <Input v-model="formValidate.taxPayerNumber" :maxlength="20" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="工商注册号" prop="registeNumber">
                    <Input v-model="formValidate.registeNumber" :maxlength="18" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="开户银行" prop="bankName">
                    <Input v-model="formValidate.bankName" :maxlength="50" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="银行账户" prop="bankNumber">
                    <Input v-model="formValidate.bankNumber" :maxlength="19" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="注册地址" prop="registeAddress">
                    <Input v-model="formValidate.registeAddress" class="input_width" type="textarea" :autosize="{minRows: 1,maxRows: 4}" :maxlength="200" :disabled="deleteFlag" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <div class="vertical-title">财务信息</div>
              <Row>
                <Col span="12">
                  <FormItem label="会计准则" prop="accountingStandard">
                    <Select v-model="formValidate.accountingStandardId" :disabled="refFlag || deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in accountingStandardList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="税制" prop="taxSystem">
                    <Select v-model="formValidate.taxSystemId" :disabled="refFlag || deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in taxSystemList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="记账本位币" prop="accountingCurrency">
                    <Select v-model="formValidate.accountingCurrencyId" :disabled="refFlag || deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in accountingCurrencyList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="纳税人资格" prop="taxQualification">
                    <Select v-model="formValidate.taxQualificationId" :disabled="refFlag || deleteFlag" @on-change="doChangeForm">
                      <Option v-for="(item,index) in taxQualificationList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="启用分账核算" prop="hasSubAccount">
                    <Checkbox v-model="formValidate.hasSubAccount" :true-value=1 :false-value=0 @on-change="doChangeForm" :disabled = "!!this.formValidate.isAccounting || deleteFlag || refFlag"></Checkbox>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Row class="warm-prompt">
              <Col span="24" class="page-alert">
              <div class="prompt-word">
                <span class="prompt-title">温馨提示：</span>
                <div class="prompt-content">
                  <p>1、分账核算是指将公司下的业务单元作为独立核算主体在公司账簿内分账核算。</p>
                  <p>2、如果启用分账核算，系统将把公司下的业务单元自动设为公司账簿的核算主体。</p>
                  <p>3、如果没有启用分账核算，系统将自动把公司设为公司账簿的核算主体。</p>
                </div>
              </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    </section>
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
          <span>提示信息</span>
      </p>
      <p>
        <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="deleteConfirm">确定</Button>
        <Button type="default" @click="deleteCancel">取消</Button>
      </div>
    </Modal>
    <!-- 新增提示弹窗 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="addModal"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
          <common-icon type="_guide" class="guide"></common-icon>
          <span>提示信息</span>
      </p>
      <p>
        <span>当前数据已修改，需要保存吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="addConfirm">是</Button>
        <Button @click="addDeny">否</Button>
        <Button type="default" @click="addCancel">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Validation } from '@/libs/util'
import { saasMixin } from '@/libs/mixins'
import companyMixin from './companyMixin'
import CommonIcon from '_c/common-icon'
export default {
  name: 'update_company',
  components: {
    CommonIcon
  },
  data () {
    return {
      loading: false, // 加载
      saveLoading: false,
      isMessage: false,
      isContent: '',
      successContent: '',
      types: '',
      alertShow: false,
      isCode: false, // 编码重复
      isName: false, // 名称重复
      isSimpleName: false, // 简称重复
      times: null,
      changed: false, // 判断内容有没有修改
      reminderModal: false, // 取消提示弹窗
      deleteModal: false, // 删除提示弹窗
      addModal: false, // 新增提示弹窗
      // isClose: false, // 判断是否关闭标签页
      doDeleteFlag: false, // 删除按钮标识
      formValidate: {
        id: '', // 公司ID
        code: '', // 编码
        name: '', // 名称
        companyFormId: 2, // 形态
        companyFormName: '公司',
        simpleName: '', // 简称
        establishDate: '', // 成立日期 HH:mm:ss dayjs(new Date()).format('YYYY-MM-DD')
        companyTypeId: 9, // 公司类型
        companyTypeName: '有限责任公司',
        legalPerson: '', // 法定代表人
        fixedPhone: '', // 固定电话
        phoneNumberRule: '', // 手机号码
        creditCode: '', // 统一社会信用代码
        taxPayerNumber: '', // 纳税人识别号
        registeNumber: '', // 工商注册号
        bankName: '', // 开户银行
        bankNumber: '', // 银行账户
        registeAddress: '', // 注册地址
        accountingStandardId: 1, // 会计准则
        accountingStandardName: '中国大陆企业会计准则',
        taxSystemId: 1, // 税制
        taxSystemName: '中国大陆税制',
        accountingCurrencyId: 1, // 记账本位币
        accountingCurrencyName: '人民币',
        taxQualificationId: 32, // 纳税人资格
        taxQualificationName: '一般纳税人',
        hasSubAccount: 0, // 是否分账核算
        doFirst: false,
        doPrevious: false,
        doEnd: false,
        doNext: false
      },
      params: { // 查询参数
        isAccounting: 2, // 建账状态
        companyFormId: 0, // 全部形态
        companyTypeId: 0, // 全部公司类型
        codeOrName: null // 公司编码/名称
      },
      options1: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      formsList: [], // 全部形态列表
      companyTypeList: [], // 全部公司类型列表
      accountingStandardList: [], // 全部会计准则列表
      taxSystemList: [], // 全部税制列表
      accountingCurrencyList: [], // 全部账本位币列表
      taxQualificationList: [], // 纳税人资格列表
      // form表达验证
      ruleValidate: {
        code: [
          { required: true, validator: Validation.codeRule }
        ],
        name: [
          { required: true, validator: Validation.nameRule }
        ],
        companyForm: [
          { required: true, validator: Validation.formsRule }
        ],
        simpleName: [
          { validator: Validation.AbbreviationRule }
        ],
        legalPerson: [
          { validator: Validation.legalPersonRule }
        ],
        // fixedTelephone: [
        //   { validator: Validation.fixedTelephoneRule, trigger: 'blur' }
        // ],
        phoneNumberRule: [
          { validator: Validation.phoneNumberRule }
        ],
        creditCode: [
          { validator: Validation.creditCodeRule }
        ],
        taxPayerNumber: [
          { validator: Validation.TaxpayerRule }
        ],
        registeNumber: [
          { validator: Validation.registerNumberRule }
        ],
        bankName: [
          { validator: Validation.BankRule }
        ],
        bankNumber: [
          { validator: Validation.bankAccountRule }
        ],
        registeAddress: [
          { validator: Validation.addressRule }
        ]
      }
    }
  },
  mixins: [saasMixin, companyMixin],
  created () {
    this.getRouteId()
  },
  computed: {
    // 监听是否删除
    deleteFlag () {
      return this.formValidate.isDel === 1
    },
    // 监听是否被引用
    refFlag () {
      return this.formValidate.isRef === 1
    }
  },
  watch: {
    changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    // 获取路由传过来的值
    getRouteId () {
      if (this.$route.query.id !== null) {
        this.doGetInit()
      }
    },
    // 初始化
    doGetInit () {
      this.id = this.$route.query.id
      let req = {
        id: this.id
      }
      this.loading = true
      this.$request.post('/financeback/company/findCompanyById', req).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          // 过滤对象中值为null的属性
          let item = ''
          for (item in res.data.data) {
            if (res.data.data[item] === null) {
              res.data.data[item] = ''
            }
          }
          this.formValidate = res.data.data
        }
      })
      this.changed = false
      this.isCode = false
      this.isName = false
      this.isSimpleName = false
    },
    // 号码验证
    // checkNumber () {
    //   this.$nextTick(() => {
    //     this.formValidate.fixedPhone = parseInt(this.formValidate.fixedPhone.match(/^[1-9]\d*$/)) || parseInt(this.formValidate.fixedPhone.toString().substring(0, this.formValidate.fixedPhone.length - 1)) || ''
    //   })
    // },
    // checkPhone () {
    //   this.$nextTick(() => {
    //     this.formValidate.phoneNumberRule = parseInt(this.formValidate.phoneNumberRule.match(/^[1-9]\d*$/)) || parseInt(this.formValidate.phoneNumberRule.toString().substring(0, this.formValidate.phoneNumberRule.length - 1)) || ''
    //   })
    // },
    // 帮助信息提示
    alertClose () {
      this.alertShow = false
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
      // this.isClose = true
    },
    /**
     * 表单校验函数
     * 所有项都通过后执行回调
     */
    doValidateForm () {
      let _validateRes = true
      this.$refs['formValidate'].validateField('code', valid => {
        if (valid) {
          _validateRes = false
          return this.$Message.error(`编码错误:${valid}`)
        }
        this.$refs['formValidate'].validateField('name', valid => {
          if (valid) {
            _validateRes = false
            return this.$Message.error(`名称错误:${valid}`)
          }
          this.$refs['formValidate'].validateField('companyForm', valid => {
            if (valid) {
              _validateRes = false
              return this.$Message.error(`形态错误:${valid}`)
            }
            this.$refs['formValidate'].validateField('simpleName', valid => {
              if (valid) {
                _validateRes = false
                return this.$Message.error(`简称错误:${valid}`)
              }
              this.$refs['formValidate'].validateField('phoneNumberRule', valid => {
                if (valid) {
                  _validateRes = false
                  return this.$Message.error(`手机号码错误:${valid}`)
                }
                this.$refs['formValidate'].validateField('creditCode', valid => {
                  if (valid) {
                    _validateRes = false
                    return this.$Message.error(`统一社会信用代码错误:${valid}`)
                  }
                  this.$refs['formValidate'].validateField('taxPayerNumber', valid => {
                    if (valid) {
                      _validateRes = false
                      return this.$Message.error(`纳税人识别号错误:${valid}`)
                    }
                    this.$refs['formValidate'].validateField('registeNumber', valid => {
                      if (valid) {
                        _validateRes = false
                        return this.$Message.error(`工商注册号错误:${valid}`)
                      }
                      this.$refs['formValidate'].validateField('bankNumber', valid => {
                        if (valid) {
                          _validateRes = false
                          return this.$Message.error(`银行账户错误:${valid}`)
                        }
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
      return _validateRes
    },
    // 保存验证规则
    doSave () {
      if (this.doValidateForm()) {
        this.isCode = false
        this.isName = false
        this.isSimpleName = false
        if (this.formValidate.establishDate !== '') {
          this.formValidate.establishDate = this.$dayjs(this.formValidate.establishDate).format('YYYY-MM-DD')
        }
        this.formValidate.companyFormName = this.formsList.filter(val => val.id === this.formValidate.companyFormId)[0].label
        this.formValidate.companyTypeName = this.companyTypeList.filter(val => val.id === this.formValidate.companyTypeId)[0].label
        this.formValidate.taxQualificationName = this.taxQualificationList.filter(val => val.id === this.formValidate.taxQualificationId)[0].label
        delete this.formValidate.isRef
        let _req = {
          accountingCurrencyId: this.formValidate.accountingCurrencyId,
          accountingCurrencyName: this.formValidate.accountingCurrencyName,
          accountingStandardId: this.formValidate.accountingStandardId,
          accountingStandardName: this.formValidate.accountingStandardName,
          bankName: this.formValidate.bankName,
          bankNumber: this.formValidate.bankNumber,
          code: this.formValidate.code,
          companyFormId: this.formValidate.companyFormId,
          companyFormName: this.formValidate.companyFormName,
          companyTypeId: this.formValidate.companyTypeId,
          companyTypeName: this.formValidate.companyTypeName,
          createTime: this.formValidate.createTime,
          creatorName: this.formValidate.creatorName,
          creditCode: this.formValidate.creditCode,
          establishDate: this.formValidate.establishDate,
          fixedPhone: this.formValidate.fixedPhone,
          hasSubAccount: this.formValidate.hasSubAccount,
          id: this.formValidate.id,
          isAccounting: this.formValidate.isAccounting,
          isDel: this.formValidate.isDel,
          legalPerson: this.formValidate.legalPerson,
          mobile: this.formValidate.phoneNumberRule,
          name: this.formValidate.name,
          registeAddress: this.formValidate.registeAddress,
          registeNumber: this.formValidate.registeNumber,
          rootEnterpriseId: this.formValidate.rootEnterpriseId,
          simpleName: this.formValidate.simpleName,
          taxPayerNumber: this.formValidate.taxPayerNumber,
          taxQualificationId: this.formValidate.taxQualificationId,
          taxQualificationName: this.formValidate.taxQualificationName,
          taxSystemId: this.formValidate.taxSystemId,
          taxSystemName: this.formValidate.taxSystemName,
          version: 0
        }
        this.saveLoading = true
        this.$request.post('/financeback/company/updateCompany', _req).then(res => {
          this.saveLoading = false
          if (res.data.code === 200) {
            this.alertShow = true
            this.types = 'success'
            this.successContent = '保存成功'
            this.changed = false
            if (this.doFirst) {
              this.doFirst = false
              this.findFirst()
            } else if (this.doPrevious) {
              this.doPrevious = false
              this.findPrevious()
            } else if (this.doNext) {
              this.doNext = false
              this.findNext()
            } else if (this.doEnd) {
              this.doEnd = false
              this.findEnd()
            }
            setTimeout(() => {
              this.alertClose()
            }, 3000)
            if (this.doDeleteFlag) {
              this.deleteModal = true
            }
            this.doDeleteFlag = false
            this.doContinueActions()
          } else if (res.data.code === 10008) {
            this.isName = false
            this.isCode = true
            this.isSimpleName = false
          } else if (res.data.code === 10009) {
            this.isCode = false
            this.isName = true
            this.isSimpleName = false
          } else if (res.data.code === 10016) {
            this.isCode = false
            this.isName = false
            this.isSimpleName = true
          }
        })
      }
    },
    // 取消按钮
    doCancel () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '取消操作会重置当前表单，是否继续?',
        button: ['确定', '取消'],
        yes () {
          that.getRouteId()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 新增按钮
    doAdd () {
      if (this.changed || this.formValidate.name === '' || this.formValidate.code === '') {
        this.addModal = true
      } else {
        this.$router.push({ name: 'create_company' })
        // this.doLocationDetail('create_company')
      }
    },
    // 删除按钮
    doDelete () {
      if (this.formValidate.isRef === 1) {
        this.$Message.warning('当前数据已使用，无法删除')
      } else if (this.changed) {
        this.doDeleteFlag = true
        this.reminderModal = true
      } else {
        this.deleteModal = true
      }
      // this.isClose = false
    },
    // 回列表页
    doGoCompany () {
      this.doLocationDetail('company_index')
    },
    // 第一条
    findFirst () {
      // this.isClose = false
      if (this.changed) {
        this.reminderModal = true
        this.doFirst = true
      } else {
        let _num = this.doFindPage(1, this.$route.query.id)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/company/findCompanyById', { id: _num }).then(res => {
            this.loading = false
            let { code, data } = res.data
            if (code === 200) {
              this.formValidate = data
              this.$router.push({ name: 'update_company', query: { id: data.id } })
            }
          })
        }
      }
    },
    // 上一条
    findPrevious () {
      // this.isClose = false
      if (this.changed) {
        this.reminderModal = true
        this.doPrevious = true
      } else {
        let _num = this.doFindPage(2, this.$route.query.id)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/company/findCompanyById', { id: _num }).then(res => {
            this.loading = false
            let { code, data } = res.data
            if (code === 200) {
              this.formValidate = data
              this.$router.push({ name: 'update_company', query: { id: data.id } })
            }
          })
        }
      }
    },
    // 最后一条
    findEnd () {
      // this.isClose = false
      if (this.changed) {
        this.reminderModal = true
        this.doEnd = true
      } else {
        let _num = this.doFindPage(4, this.$route.query.id)
        if (_num === '当前为末条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/company/findCompanyById', { id: _num }).then(res => {
            this.loading = false
            let { code, data } = res.data
            if (code === 200) {
              this.formValidate = data
              this.$router.push({ name: 'update_company', query: { id: data.id } })
            }
          })
        }
      }
    },
    // 下一条
    findNext (type) {
      // this.isClose = false
      if (this.changed) {
        this.reminderModal = true
        this.doNext = true
      } else {
        let _num = this.doFindPage(3, this.$route.query.id, type)
        if (_num === '当前为末条') {
          return false
        } else if (_num === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          setTimeout(() => {
            // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
            this.closeTag({ route: this.$route })
          }, 3000)
        } else {
          this.loading = true
          this.$request.post('/financeback/company/findCompanyById', { id: _num }).then(res => {
            this.loading = false
            let { code, data } = res.data
            if (code === 200) {
              this.$router.push({ name: 'update_company', query: { id: data.id } })
              this.formValidate = data
            }
          })
        }
      }
    },
    // 取消提示弹窗----是
    confirm () {
      this.doSave()
      this.reminderModal = false
    },
    // 取消提示弹窗----否
    doDeny () {
      // if (this.isClose === false) {
      this.doGetInit()
      if (this.doFirst) {
        this.doFirst = false
        this.findFirst()
      } else if (this.doPrevious) {
        this.doPrevious = false
        this.findPrevious()
      } else if (this.doNext) {
        this.doNext = false
        this.findNext()
      } else if (this.doEnd) {
        this.doEnd = false
        this.findEnd()
      } else if (this.doDeleteFlag) {
        this.deleteModal = true
      }
      this.reminderModal = false
      this.doDeleteFlag = false
      // } else {
      //   this.doContinueActions()
      // }
    },
    // 取消提示弹窗----取消
    cancel () {
      this.reminderModal = false
    },
    // 删除提示弹窗----确定
    deleteConfirm () {
      let req = {
        idList: [this.formValidate.id]
      }
      this.$request.post('/financeback/company/deleteBatch', req).then(res => {
        let { code, data } = res.data
        if (code === 200) {
          if (data.successList.length > 0) {
            this.$Message.success('删除成功')
            this.changed = false
            this.findNext('delete')
          } else if (data.failList.length > 0) {
            this.$Message.error(data.failList[0].referenceDescription)
          }
        }
      })
      this.deleteModal = false
    },
    // 删除提示弹窗----取消
    deleteCancel () {
      this.deleteModal = false
    },
    // 新增提示弹窗----是
    addConfirm () {
      this.addModal = false
      this.doSave()
      this.$router.push({ name: 'create_company' })
    },
    // 新增提示弹窗----否
    addDeny () {
      this.addModal = false
      this.changed = false
      this.$router.push({ name: 'create_company' })
    },
    // 新增提示弹窗----取消
    addCancel () {
      this.addModal = false
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
          that.doSave()
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
  @import '../business/title.less';
  .update_company{
    .repeat{
      position: absolute;
      display: inline-block;
      width: 48px;
      margin-left: 34px;
      line-height: 33px;
      font-family: SimSun;
      color: #ed4014;
    }
    .company_alert{
      position: absolute;
      z-index: 100;
      width: 100%;
      font-size: 14px;
      .icon_warn{
        font-size: 16px !important;
      }
    }
    .success_color{
      color: #00A497;
      background-color: #E5F9F7;
    }
    .error_color{
      color: #F92424;
      background-color: #FFECEB;
    }
    .page-content{
      .ivu-form{
        .ivu-form-item-error-tip{
          display: none;
        }
        .my_poptip1{
          position: absolute;
          right: -15px;
          z-index: 200;
          width: 0;
          .ivu-poptip-popper{
            left: -137px !important;
          }
        }
        .icon_help{
          font-size: 16px;
          color: #d7d7d7;
        }
        .icon_help:hover{
          color: @warning;
        }
      }
      .retrieval_inf{
        position: absolute;
        right: -90px;
        cursor: pointer;
      }
    }
    //温馨提示
    .warm-prompt{
      margin-left: 120px;
      .page-alert{
        background-color:#F2F2F2;
        border:1px solid #E5E5E5;
        padding: 12px 55px 13px 13px;
        .prompt-word{
          font-size:12px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(196,129,0,1);
          line-height:17px;
          .prompt-title{
            float: left;
          }
          .prompt-content{
            margin-left: 60px;
          }
        }
      }
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  }
</style>
