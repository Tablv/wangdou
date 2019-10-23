<template>
  <div class="create-customer">
    <div class="header-nav">
      <div class="left">
        <div class="page-header-name">新增客户</div>
      </div>
      <div class="right">
        <i-button type="primary" @click="handleSaveInfo(1)">保存</i-button>
        <i-button @click="handleSaveInfo(2)">保存并新增</i-button>
        <i-button @click="handleCancelSave">取消</i-button>
        <i-button @click="doLocationDetail('client_index')">列表</i-button>
      </div>
    </div>
    <div class="main-container">
      <Form ref="formValidate" :rules="ruleValidate" :model="create_form" :label-width="120">
        <Row>
          <Col :span="6">
            <FormItem label="创建公司" class="input_after" prop="companyName">
           <RadioSelect :config="table_config"  @change="doCompanyChange" :bloc="flag"  :reset='table_config.refresh' @on-change="handleFormChange" v-model="create_form.companyName" @getData="handleSelectCompany">
      <div slot="header">
        <div class="search-contain">
          <Row :gutter="10" class="no-error-modal">
            <Col span="4">
              <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
              </Select>
            </Col>
            <!-- <Col span="8">
              <Input autocomplete="on" clearable type="text" v-model="table_config.request_params.codeOrName" placeholder="客户编码/客户名称" search enter-button
                     @on-search="table_config.refresh = !table_config.refresh">
                <Button slot="append" icon="ios-search" @click="table_config.refresh = !table_config.refresh"></Button>
              </Input>
            </Col> -->
                <Col span="8">
                  <Input v-model="table_config.request_params.codeOrName"  placeholder="公司编码/公司名称" clearable enter-button  @on-clear="clearback"  @on-search="table_config.refresh = !table_config.refresh"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="searchconfig"></Button>
              </Col>
            <Col span="4">
              <Button  @click="resetrefresh" class="resset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
    </RadioSelect>
<!--              <Input v-model="create_form.companyName" readonly placeholder="请选择"></Input>-->
<!--              <Icon class="search-icon" type="md-more" size="20" @click="handleOpenSel"></Icon>-->
              <!-- <CompanyRadioSelect v-model="create_form.companyName" @getCompany="handleGetCompany"></CompanyRadioSelect> -->
            </FormItem>
          </Col>
           <Col :span="6" v-if="create_form.companyName !== '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="handleFormChange" v-model="create_form.dataTypes" placeholder="">
                <Option v-for="(item, index) in useListed" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
           <Col :span="6" v-if="create_form.companyName === '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="handleFormChange" placeholder="" v-model="create_form.dataTypes">
                <Option v-for="(item, index) in useList" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="客户编码">
              <Input class="item-input" type="text" v-model="create_form.codeName" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="客户名称" prop="name" class="input_after">
              <Input class="item-input" :maxlength="50" type="text" v-model="create_form.name" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
            <Col :span="6">
            <FormItem label="客户类型" prop="customerType" class="input_after">
              <Select class="item-input" v-model="create_form.customerType" @on-change="handleChangeCustomerType">
                <Option value="0">企业</Option>
                <Option value="1">个人</Option>
              </Select>
            </FormItem>
          </Col>
          <!-- <Col :span="6">
            <FormItem label="内部客户">
              <Checkbox label="twitter" v-model="create_form.isInternalCustomer" disabled></Checkbox>
            </FormItem>
          </Col> -->
          <!-- <Col :span="6">
            <FormItem label="统一社会信用代码">
              <Input class="item-input" :disabled="can_use" type="text" v-model="create_form.unifiedSocialCreditCode" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col> -->
        </Row>
        <Row>
          <Col :span="12">
            <FormItem label="经营地址">
              <Input :maxlength="200" type="text" v-model="create_form.businessAddress" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="联系人">
              <Input class="item-input" :maxlength="20" type="text" v-model="create_form.linkman" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="手机号码">
              <div class="phone-container">
                <!-- <Input class="prefix" v-model="create_form.phone_type" disabled></Input> -->
                <Input class="item-input" v-model="create_form.contactNumber" :maxlength="11" @on-change="handleFormChange"></Input>
              </div>
            </FormItem>
          </Col>
        </Row>
         <Row>
          <Col :span="6"  v-if="this.can_use">
            <FormItem label="身份证号">
              <Input class="item-input" :disabled="!can_use" :maxlength="18" type="text" v-model="create_form.idCardNum" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col>
           <Col :span="6"   v-if="!this.can_use">
            <FormItem label="统一社会信用代码">
              <Input class="item-input" :disabled="can_use" :maxlength="18" type="text" v-model="create_form.unifiedSocialCreditCode" @on-change="handleFormChange"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <!-- <CompanySelect v-model="select_company_visible" @select="handleSelectCompany"></CompanySelect> -->
    <!-- <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="cancel_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>当前数据已修改，需要保存吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleSaveInfo(1)">是</Button>
        <Button  @click="handleConfirmCancel">否</Button>
        <Button  @click="cancel_visible = false">取消</Button>
      </div>
    </Modal> -->
       <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="cancleboxModel"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>取消操作会重置当前表单，是否继续?</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="confirmcanclebox">确定</Button>
        <Button @click="backcanclebox">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
// import CompanySelect from '_c/companySelectModal'
import RadioSelect from '_c/radio-select'
// import CompanyRadioSelect from '_c/company-radio-select'
import { saasMixin } from '@/libs/mixins'
import add from './add_mixin'
export default {
  name: 'create_client',
  components: { CommonIcon, RadioSelect },
  mixins: [saasMixin, add],
  data () {
    return {
      test1: '',
      companyFormId: 0,
      flag: true,
      cancleboxModel: false, // 取消
      list: [
        { label: '公司1', code: '123', id: 1 },
        { label: '公司2', code: '124', id: 2 },
        { label: '公司3', code: '126', id: 3 }
      ],
      useList: [
        {
          value: 1,
          label: '共享型'
        },
        {
          value: 2,
          label: '分配型'
        }
      ],
      useListed: [
        {
          value: 3,
          label: '私有型'
        }
      ],
      name: '公司',
      create_form: {
        dataTypes: 1,
        dataType: 0,
        companyId: 0,
        companyName: '集团',
        codeType: 0, // 0 系统 1 自定义
        codeName: '系统编码',
        customerType: '0', // 0 企业 1 个人
        name: '',
        isInternalCustomer: 0, // 0 否 1 是
        unifiedSocialCreditCode: '', // 统一社会信用代码
        // phone_type: '086',
        idCardNum: '', // 身份证号
        businessAddress: '', // 经营地址
        linkman: '', // 联系人
        contactNumber: '',
        isEnterpriseAdmin: 1
      }
    }
  },
  mounted () {
    // let _id = this.$route.query && this.$route.query.id
    this.getCurrentInfo()
  },
  methods: {
    clearback () {
      this.table_config.refresh = !this.table_config.refresh
      this.flag = true
    },
    searchconfig () {
      if (this.table_config.request_params.codeOrName === '0000') {
        this.flag = true
        console.log('89')
      } else {
        this.flag = false
      }
      this.table_config.refresh = !this.table_config.refresh
    },
    doCompanyChange (event) {
      if (event) {
        this.create_form.companyName = event.target.value
      } else {
        this.create_form.companyName = ''
      }
    },
    // 取消弹窗
    confirmcanclebox () {
      this.changed = false
      this.handleResetForm()
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    doSearchCompany () {
      this.$set(this.table_config, 'refresh', !this.table_config.refresh)
    },
    // 全部形态的搜索
    doCompanyFormIdChange (val) {
      if (this.companyFormId) {
        this.flag = false
        console.log('89')
      } else {
        this.flag = true
      }
      let params = val === 0 ? null : val
      this.table_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    doBlur () {
      this.create_form.companyName = this.create_form.companyName === '集团' ? '集团 ' : '集团'
    },
    // 检索工商信息
    businessInformation () {
      console.log('检索工商信息')
    },
    // 请求当前数据信息查看
    getCurrentInfo (id) {
      if (this.$route.query.id) {
        console.log(this.$route.query.id, '33312')
        this.isLoading = true
        this.$request.post('financeback/customerSupplier/findCustomerSupplierById', {
          id: this.$route.query.id,
          isEnterpriseAdmin: 1,
          dataType: 0
        }).then(res => {
          this.isLoading = false
          if (res.data.code === 200) {
            if (res.data.data) {
              this.create_form = res.data.data
              if (this.create_form.customerType === '0') {
                this.create_form.customerType = '0'
                this.can_use = false
              } else {
                this.create_form.customerType = '1'
                this.can_use = true
              }
              this.create_form.code = ''
              this.create_form.name = ''
              // 资料类型 1.共享型,2.分配型,3.私有型
              if (this.create_form.dataTypes === '3') {
                console.log(this.create_form.dataTypes, '999')
                this.create_form.dataTypes = 3
              }
              if (this.create_form.dataTypes === '2') {
                this.create_form.dataTypes = 2
              }
              if (this.create_form.dataTypes === '1') {
                this.create_form.dataTypes = 1
              }
              console.log(this.create_form, '000088')
              if (parseInt(this.create_form.companyId) === parseInt(this.create_form.useCompanyId)) {
                this.is_edit_all = false
              } else {
                this.is_edit_all = true
              }
              this.is_edit_all = parseInt(this.create_form.companyId) === 0
              // this.handleInitInfo()
            } else {
              this.create_form = ''
            }
          } else {
            this.create_form = ''
          }
        })
      }
    },
    resetrefresh () {
      this.flag = true
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.refresh = !this.table_config.refresh
      this.table_config.request_params.codeOrName = ''
    },
    // 重置表单
    handleResetForm () {
      this.create_form = {
        dataTypes: 1,
        dataType: 0,
        companyId: 0,
        companyName: '集团',
        codeType: 0, // 0 系统 1 自定义
        codeName: '系统编码',
        customerType: '0', // 0 企业 1 个人
        name: '',
        isInternalCustomer: 0, // 0 否 1 是
        unifiedSocialCreditCode: '', // 统一社会信用代码
        // phone_type: '086',
        idCardNum: '', // 身份证号
        businessAddress: '', // 经营地址
        linkman: '', // 联系人
        contactNumber: '',
        isEnterpriseAdmin: 1
      }
      this.$refs.formValidate.resetFields()
    }
  }
}
</script>

<style lang="less">
  @import "client_supplier";
</style>
