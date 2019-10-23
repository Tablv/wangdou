  <template>
  <div class="create_company">
    <section class="company-container">
      <section class="page-header">
        <div class="page-header-name">新增公司</div>
        <div class="page-header-actions">
          <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
          <Button type="primary" v-else @click="doSave('formValidate','save')">保存</Button>
          <Button v-if="saveLoading2"><img src="../../../assets/images/loading.gif"></Button>
          <Button v-else @click="doSave('formValidate','saveAdd')">保存并新增</Button>
          <Button @click="doCancel">取消</Button>
          <Button @click="doGoCompany">列表</Button>
        </div>
      </section>
      <Alert :type="types" show-icon v-if="alertShow" closable @on-close="alertClose" class="company_alert" :class="{success_color: isColor,error_color: !isColor}">
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
        <Spin fix v-if="saveLoading2" style="left: 8px;z-index: 201">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>数据保存中</div>
        </Spin>
        <Row>
          <Col span="12">
            <Form ref="formValidate" :model="formValidate" :label-width="120" class="form_init">
              <div class="vertical-title">基本信息</div>
              <Row>
                <Col span="12" class="input_after">
                  <FormItem label="编码" prop="code">
                    <Input v-model="formValidate.code" :maxlength="4" @on-change="doChangeForm"></Input>
                    <Poptip placement="top" trigger="hover" class="my_poptip1">
                      <Icon class="icon_help" type="md-help-circle" size="16"/>
                      <div slot="content" >请输入4个字符的数字或英文字母，并且不能重复</div>
                    </Poptip>
                    <span class="repeat" v-show="this.isCode">数据重复</span>
                  </FormItem>
                </Col>
                <Col span="12" class="input_after">
                  <FormItem label="名称" prop="name">
                    <Input v-model="formValidate.name" :maxlength="60" @on-change="doChangeForm"></Input>
                    <span class="repeat" v-show="this.isName">数据重复</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12" class="input_after">
                  <FormItem label="形态" prop="companyForm">
                    <Select v-model="formValidate.companyFormId" @on-change="doChangeForm">
                      <Option v-for="(item,index) in formsList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="简称" prop="simpleName">
                    <Input v-model="formValidate.simpleName" :maxlength="20" @on-change="doChangeForm"></Input>
                    <span class="repeat" v-show="this.isSimpleName">数据重复</span>
                  </FormItem>
                </Col>
              </Row>
              <div class="vertical-title">工商信息</div>
              <Row>
                <Col span="12">
                  <FormItem label="成立日期" prop="establishDate">
                    <DatePicker v-model ="formValidate.establishDate" type="date" :options="options1" @on-change="doChangeForm"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="公司类型" prop="companyType">
                    <Select v-model="formValidate.companyTypeId" @on-change="doChangeForm">
                      <Option v-for="(item,index) in companyTypeList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="法定代表人" prop="legalPerson">
                    <Input v-model="formValidate.legalPerson" :maxlength="30" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="固定电话" prop="fixedPhone">
                    <Input v-model="formValidate.fixedPhone" :maxlength="12" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="手机号码" prop="mobilePhone">
                    <Input v-model="formValidate.mobilePhone" :maxlength="11" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="统一社会信用代码" prop="creditCode">
                    <Input v-model="formValidate.creditCode" :maxlength="18" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="纳税人识别号" prop="taxPayerNumber">
                    <Input v-model="formValidate.taxPayerNumber" :maxlength="20" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="工商注册号" prop="registeNumber">
                    <Input v-model="formValidate.registeNumber" :maxlength="18" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="开户银行" prop="bankName">
                    <Input v-model="formValidate.bankName" :maxlength="50" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="银行账户" prop="bankNumber">
                    <Input v-model="formValidate.bankNumber" :maxlength="19" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="24">
                  <FormItem label="注册地址" prop="registeAddress">
                    <Input v-model="formValidate.registeAddress" class="input_width" type="textarea" :autosize="{minRows: 1,maxRows: 4}" :maxlength="200" @on-change="doChangeForm"></Input>
                  </FormItem>
                </Col>
              </Row>
              <div class="vertical-title">财务信息</div>
              <Row>
                <Col span="12">
                  <FormItem label="会计准则" prop="accountingStandard">
                    <Select v-model="formValidate.accountingStandardId" disabled @on-change="doChangeForm">
                      <Option v-for="(item,index) in accountingStandardList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="税制" prop="taxSystem">
                    <Select v-model="formValidate.taxSystemId" disabled @on-change="doChangeForm">
                      <Option v-for="(item,index) in taxSystemList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="记账本位币" prop="accountingCurrency">
                    <Select v-model="formValidate.accountingCurrencyId" disabled @on-change="doChangeForm">
                      <Option v-for="(item,index) in accountingCurrencyList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="12">
                  <FormItem label="纳税人资格" prop="taxQualification">
                    <Select v-model="formValidate.taxQualificationId" @on-change="doChangeForm">
                      <Option v-for="(item,index) in taxQualificationList" :value="item.id" :key="index">{{ item.label }}</Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                  <FormItem label="启用分账核算" prop="hasSubAccount">
                    <Checkbox v-model="formValidate.hasSubAccount" :true-value=1 :false-value=0 @on-change="doChangeForm"></Checkbox>
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
      <!-- 提示弹窗 -->
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
    </section>
  </div>
</template>
<script>
// import dropDownInput from '_c/drop-down-input'
import { Validation } from '@/libs/util'
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import companyMixin from './companyMixin'
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
export default {
  name: 'create_company',
  components: {
    CommonIcon
    // dropDownInput
  },
  data () {
    return {
      validateRes: true,
      loading: false,
      saveLoading: false,
      saveLoading2: false,
      isMessage: false,
      isColor: null,
      isContent: '',
      successContent: '',
      types: '',
      alertShow: false,
      isCode: false, // 编码重复
      isName: false, // 名称重复
      isSimpleName: false, // 简称重复
      times: null,
      changed: false, // 判断内容有没有修改
      reminderModal: false, // 提示弹窗
      // isClose: false, // 判断是否关闭标签页
      formValidate: {
        code: '', // 编码
        name: '', // 名称
        companyFormId: 2, // 形态
        companyFormName: '公司',
        simpleName: null, // 简称
        establishDate: dayjs(new Date()).format('YYYY-MM-DD'), // 成立日期 HH:mm:ss
        companyTypeId: 9, // 公司类型
        companyTypeName: '有限责任公司',
        legalPerson: '', // 法定代表人
        fixedPhone: '', // 固定电话
        mobilePhone: '', // 手机号码
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
        taxQualificationId: 33, // 纳税人资格
        taxQualificationName: '小规模纳税人',
        hasSubAccount: 1 // 是否分账核算
      },
      options1: {
        disabledDate (date) {
          // return date.valueOf() < new Date().getTime()
          return date && date.valueOf() > Date.now()
        }
      },
      formsList: [], // 全部形态列表
      companyTypeList: [], // 全部公司类型列表
      accountingStandardList: [], // 全部会计准则列表
      taxSystemList: [], // 全部税制列表
      accountingCurrencyList: [], // 全部账本位币列表
      taxQualificationList: [], // 纳税人资格列表
      fieldCodes: ['code', 'name', 'companyForm', 'simpleName', 'mobilePhone', 'creditCode', 'taxPayerNumber', 'registeNumber', 'bankNumber'],
      fieldNames: ['编码错误', '名称错误', '形态错误', '简称错误', '手机号码错误', '统一社会信用代码错误', '纳税人识别号错误', '工商注册号错误', '银行账户错误']
    }
  },
  mixins: [saasMixin, companyMixin],
  watch: {
    changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  computed: {
    companyName: {
      get () {
        return this.formValidate.name.replace(/\s+/g, '')
      },
      set (val) {
        this.formValidate.name = val.replace(/\s+/g, '')
      }
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    // 初始化
    doGetInit () {
      this.$refs.formValidate.resetFields() // 重置表单
    },
    // 号码验证
    // checkNumber () {
    //   this.$nextTick(() => {
    //     this.formValidate.fixedPhone = parseInt(this.formValidate.fixedPhone.match(/^[1-9]\d*$/)) || parseInt(this.formValidate.fixedPhone.toString().substring(0, this.formValidate.fixedPhone.length - 1)) || ''
    //   })
    // },
    // checkPhone () {
    //   this.$nextTick(() => {
    //     this.formValidate.mobilePhone = parseInt(this.formValidate.mobilePhone.match(/^[1-9]\d*$/)) || parseInt(this.formValidate.mobilePhone.toString().substring(0, this.formValidate.mobilePhone.length - 1)) || ''
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
    doValidateForm (n) {
      if (n === 9) {
        this.validateRes = true
        delete this.$refs['formValidate'].rules
        return
      }
      this.$refs['formValidate'].validateField(this.fieldCodes[n], valid => {
        if (valid) {
          this.validateRes = false
          delete this.$refs['formValidate'].rules
          return this.$Message.error(`${this.fieldNames[n]}:${valid}`)
        }
        this.doValidateForm(n + 1)
      })
    },
    // 保存验证规则
    doSave (name, type) {
      this.$refs['formValidate'].rules = {
        code: [
          { validator: Validation.codeRule }
        ],
        name: [
          { validator: Validation.nameRule }
        ],
        companyForm: [
          { validator: Validation.formsRule }
        ],
        simpleName: [
          { validator: Validation.AbbreviationRule }
        ],
        legalPerson: [
          { validator: Validation.legalPersonRule }
        ],
        mobilePhone: [
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
      this.doValidateForm(0)
      if (this.validateRes) {
        this.isCode = false
        this.isName = false
        this.isSimpleName = false
        if (this.formValidate.establishDate !== '') {
          this.formValidate.establishDate = dayjs(this.formValidate.establishDate).format('YYYY-MM-DD')
        }
        this.formValidate.companyFormName = this.formsList.filter(val => val.id === this.formValidate.companyFormId)[0].label
        this.formValidate.companyTypeName = this.companyTypeList.filter(val => val.id === this.formValidate.companyTypeId)[0].label
        this.formValidate.taxQualificationName = this.taxQualificationList.filter(val => val.id === this.formValidate.taxQualificationId)[0].label
        this.formValidate.name = this.companyName
        this.saveLoading = true
        this.saveLoading2 = true
        this.$request.post('/financeback/company/addCompany', this.formValidate).then(res => {
          this.saveLoading = false
          this.saveLoading2 = false
          if (res.data.code === 200) {
            this.alertShow = true
            this.types = 'success'
            this.successContent = '保存成功'
            this.isColor = true
            // 保存
            if (type === 'save') {
              setTimeout(() => {
                this.alertClose()
                this.addIdToList({ id: res.data.data.id, name: 'company' })
                this.doGetInit()
                this.$router.push({
                  name: 'update_company',
                  query: {
                    id: res.data.data.id
                  }
                })
              }, 1000)
              // 保存并新增
            } else if (type === 'saveAdd') {
              setTimeout(() => {
                this.alertClose()
                this.$router.push({
                  name: 'create_company'
                })
                this.doGetInit()
                this.changed = false
              }, 1000)
              // 保存关闭页签
            } else if (type === 'saveClose') {
              setTimeout(() => {
                this.alertClose()
                this.doContinueActions()
              }, 1000)
            }
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
      if (this.changed) {
        this.reminderModal = true
      } else {
        this.doGetInit()
      }
    },
    // 回列表页
    doGoCompany () {
      this.doLocationDetail('company_index')
    },
    // 保存修改提示弹窗----是
    confirm () {
      this.doSave('formValidate', 'saveAdd')
      this.reminderModal = false
    },
    // 保存修改提示弹窗----否
    doDeny () {
      this.doGetInit()
      this.changed = false
      this.isCode = false
      this.isName = false
      this.isSimpleName = false
      this.reminderModal = false
    },
    // 保存修改提示弹窗----取消
    cancel () {
      this.reminderModal = false
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
          that.doSave('formValidate', 'saveClose')
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
  .create_company{
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
