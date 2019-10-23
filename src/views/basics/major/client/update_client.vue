<template>
  <div class="create-customer">
    <Spin fix v-if="isLoading"></Spin>
    <common-icon v-if="current_row.isDel" class="yishixiao" type="_yishanchu"></common-icon>
    <common-icon v-show="create_form.isEnable === 0" class="yishixiao" type="_yishixiao1"/>
    <div class="header-nav">
      <div class="left">
        <div class="page-header-name">查看客户</div>
      </div>
      <div class="right">
        <i-button type="primary" @click="handleSaveInfo">保存</i-button>
        <!-- <i-button @click = "handlecopyclient">保存并新增</i-button> -->
        <i-button @click="handleUpdateInfo">取消</i-button>
        <i-button @click="handleAddForm">新增</i-button>
        <i-button @click="copyproject">复制</i-button>
        <i-button @click="handleConfirmDel">删除</i-button>
        <i-button @click="doLocationDetail('client_index')">列表</i-button>
        <i-button v-if="create_form.isEnable ===1" @click="doDisable(1)">禁用</i-button>
        <i-button v-if="create_form.isEnable !==1" @click="doDisable(0)">反禁用</i-button>
        <Button @click="doAddCheck" v-if="this.create_form.dataTypes === 2 && this.create_form.isEnable === 1">分配</Button>
        <Button @click="cancledoAddCheck" v-if="this.current_row.dataTypes !== 2 || this.create_form.isEnable === 0">分配</Button>
        <Button @click="Unallocation" v-if="this.current_row.dataTypes === 2 && this.create_form.isEnable === 1">取消分配</Button>
        <Button @click="cancleUnallocation" v-if="this.current_row.dataTypes !== 2 || this.create_form.isEnable === 0">取消分配</Button>
        <i-button class="isfenye" @click="handlePageLocation('first')">
          <span class="dofenye">
            <common-icon class="fenye" type="_shouye"></common-icon>
          </span>
        </i-button>
        <i-button icon="ios-arrow-back" @click="handlePageLocation('prev')"></i-button>
        <i-button icon="ios-arrow-forward" @click="handlePageLocation('next')"></i-button>
        <i-button class="isfenye" @click="handlePageLocation('last')">
          <span class="dofenye">
            <common-icon class="fenye" type="_moye"></common-icon>
          </span>
        </i-button>
      </div>
    </div>
    <div class="main-container">
      <!-- 已失效0 isEnable已生效1     isCite引用状态0否 1是     isInternalCustomer 是否是内部客户0否1是-->
      <Form :model="create_form" ref="updateForm" :label-width="120" :rules="ruleValidate">
        <Row>
          <Col :span="6" v-if="((create_form.isInternalCustomer === '1' && create_form.isEnable === 1) || (create_form.isEnable===1 && create_form.isCite === 1)) || create_form.isEnable === 0">
            <FormItem label="创建公司">
              <Input class="item-input" type="text" v-model="create_form.companyName"  disabled  @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.isInternalCustomer === '0' && create_form.isEnable===1 && create_form.isCite === 0">
            <FormItem label="创建公司" class="input_after">
            <RadioSelect :config="table_config"  :reset='table_config.refresh'  @change="doCompanyChange" v-model="create_form.companyName" @getData="handleSelectCompany" @on-change="handleChangeInfo">
      <div slot="header">
        <div class="search-contain">
          <Row :gutter="10" class="no-error-modal">
            <Col span="4">
              <Select v-model="table_config.request_params.companyFormId">
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
                  <Input v-model="table_config.request_params.codeOrName"  placeholder="公司编码/公司名称" clearable enter-button  @on-clear="table_config.refresh = !table_config.refresh"  @on-search="table_config.refresh = !table_config.refresh"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="table_config.refresh = !table_config.refresh"></Button>
              </Col>
            <Col span="4">
              <Button  @click="resetrefresh" class="resset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
    </RadioSelect>
<!--              <Input v-model="create_form.companyName" :disabled="current_row.isDel !== 0" readonly placeholder="请选择"></Input>-->
<!--              <Icon v-show="current_row.isDel !== 1" class="search-icon" type="md-more" size="20" @click="handleOpenSel"></Icon>-->
              <!-- <CompanyRadioSelect :disabled="current_row.isDel !== 0" v-model="create_form.companyName" @getCompany="handleGetCompany"></CompanyRadioSelect> -->
            </FormItem>
          </Col>
              <Col :span="6" v-if="create_form.companyName !== '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="handleChangeInfo" placeholder="" disabled v-model="create_form.dataTypes">
                <Option v-for="(item, index) in useListed" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
             <Col :span="6" v-if="create_form.companyName === '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="handleChangeInfo" placeholder="" :disabled="((create_form.isInternalCustomer === '1' && create_form.isEnable === 1) || (create_form.isEnable===1 && create_form.isCite === 1)) || create_form.isEnable === 0" v-model="create_form.dataTypes">
                <Option v-for="(item, index) in useList" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
            <Col :span="6">
            <FormItem label="客户编码">
              <Input class="item-input" type="text" v-model="create_form.code" disabled @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
          <Col :span="6" v-if="((create_form.isInternalCustomer === '1' && create_form.isEnable === 1) || (create_form.isEnable===1 && create_form.isCite === 1)) || create_form.isEnable === 0">
            <FormItem label="客户名称">
              <Input class="item-input" :maxlength="50" type="text" disabled v-model="create_form.name" @on-change="handleChangeInfo"></Input>
              <!-- <span style="position:absolute; right:-90px; color: #00A497;"> 检索工商信息</span> -->
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.isInternalCustomer === '0' && create_form.isEnable===1 && create_form.isCite === 0">
            <FormItem label="客户名称" class="input_after">
              <Input class="item-input" :maxlength="50" type="text" :disabled="current_row.isDel !== 0 || this.can_use" v-model="create_form.name" @on-change="handleChangeInfo"></Input>
              <!-- <span style="position:absolute; right:-90px; color: #00A497;"> 检索工商信息</span> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6" v-if="((create_form.isInternalCustomer === '1' && create_form.isEnable === 1) || (create_form.isEnable===1 && create_form.isCite === 1)) || create_form.isEnable === 0">
            <FormItem label="客户类型">
              <Select class="item-input" v-model="create_form.customerType" @on-change="handleChangeCustomerType" disabled>
                <Option value="0">企业</Option>
                <Option value="1">个人</Option>
              </Select>
            </FormItem>
          </Col>
            <Col :span="6" v-if="create_form.isInternalCustomer === '0' && create_form.isEnable===1 && create_form.isCite === 0">
            <FormItem label="客户类型">
              <Select class="item-input" v-model="create_form.customerType" @on-change="handleChangeCustomerType" :disabled="current_row.isDel !== 0">
                <Option value="0">企业</Option>
                <Option value="1">个人</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
             <Col :span="6" v-if="create_form.isInternalCustomer === '0'">
            <FormItem label="内部客户">
              <CheckboxGroup>
        <Checkbox label="" @on-change="handleSyncInternalCustomer" v-model="is_inside" disabled></Checkbox>
           </CheckboxGroup>
            </FormItem>
          </Col>
           <Col :span="6" v-if="create_form.isInternalCustomer === '1'">
            <FormItem label="内部客户">
              <Checkbox label="twitter" @on-change="handleSyncInternalCustomer" v-model="is_inside" disabled></Checkbox>
            </FormItem>
          </Col>
          <!-- <Col :span="6">
            <FormItem label="内部客户">
              <Checkbox label="twitter" @on-change="handleSyncInternalCustomer" v-model="is_inside" disabled></Checkbox>
            </FormItem>
          </Col> -->
           <Col :span="6" v-if="!this.can_use">
            <FormItem label="关联公司">
              <Input class="item-input" type="text"  disabled @on-change="handleChangeInfo" v-model="create_form.innerCompanyName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
        </Row>
        <Row>
          <Col :span="12">
            <FormItem label="经营地址">
              <Input :maxlength="200" type="text" :disabled="create_form.isEnable === 0" v-model="create_form.businessAddress" @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="联系人">
              <Input class="item-input" :maxlength="20" type="text" :disabled="create_form.isEnable === 0" v-model="create_form.linkman" @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="手机号码">
              <div class="phone-container">
                <!-- <Input class="prefix" v-model="phone_type" disabled></Input> -->
                <Input class="item-input" :disabled="create_form.isEnable === 0" :maxlength="11" v-model="create_form.contactNumber" @on-change="handleChangeInfo"></Input>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6" v-if="!this.can_use">
            <FormItem label="统一社会信用代码">
              <Input class="item-input" type="text" :disabled="create_form.isEnable === 0" :maxlength="18" v-model="create_form.unifiedSocialCreditCode" @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
          <Col :span="6" v-if="this.can_use">
            <FormItem label="身份证号">
              <Input class="item-input" type="text" :disabled="create_form.isEnable === 0" :maxlength="18" v-model="create_form.idCardNum" @on-change="handleChangeInfo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <!-- 批量建账成功提示 -->
    <batch-handle-modal
      @modalClose="doCloseBatchAccount"
      :batchHandleModal="batchHandleModal"
      :checked="checked"
      :batchhandleColumns="batchhandleColumns"
      :batchhandleData="batchhandleData"></batch-handle-modal>
    <!-- 提示弹窗 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="del_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>确认删除该数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doDelete">确认</Button>
        <Button  @click="del_visible = false">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>{{ disable_type === 0 ? '反禁用后，当前数据将能被使用！' : '请确认是否要禁用当前数据，注意 禁用后将无法使用！' }}</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doDisable">确认</Button>
        <Button  @click="disable_visible = false">取消</Button>
      </div>
    </Modal>
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
        <span>当前页面数据已发生变化，是否保存在继续</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleNewYes">是</Button>
        <Button  @click="handleConfirmCancel">否</Button>
        <Button  @click="reminderModal = false">取消</Button>
      </div>
    </Modal>
       <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="copyreplication"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>当前数据已修改，需要保存吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="clientcopy">是</Button>
        <Button  @click="clientcopyno">否</Button>
        <Button  @click="clientcopyCancel">取消</Button>
      </div>
    </Modal>
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
           <!-- 查看分配 -->
    <multi-modal
      @on-select="doGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="onVisibeChange"
      :selectedValues="selectedValues"
      :isEnterpriseAdmin= "`1`"
      :value="handleModal"
      :type="type"
      :title="title"
      :data="paramse"
      ref="modalChild">
      <section slot="search">
        <Row :gutter="10">
           <Col span="3" class="page-left-search">
            <Select v-model="projectcompanyFormId" class="clearList" @on-change="newdoSelect">
              <Option v-for="item in typelisted" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
            <Col span="5" class="moveback">
                  <Input  class="user-mobile" v-model="paramse.codeOrName" placeholder="分配编码名称" clearable enter-button   @on-clear="newdoReset"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="doSelecting" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="newdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
        <!-- <Input style="width: 250px" search v-model="paramse.codeOrName" placeholder="分配编码/名称" @on-search="searchOrMatch" @on-change="changeOrMatch"></Input> -->
      </section>
    </multi-modal>
          <!-- 取消分配 -->
    <multi-modal
      @on-select="CancleGetDataList"
      @isCheck="isCheck"
      @on-visibe-change="cancleonVisibeChange"
      :selectedValues="selectedValues"
      :value="canclehandleModal"
      :isEnterpriseAdmin= "`1`"
      :type="typed"
      :title="titling"
      :data="paramsed"
      ref="modalChildes">
      <section slot="search">
        <Row :gutter="10">
           <Col span="3" class="page-left-search">
            <Select v-model="backcompanyFormId" class="clearList" @on-change="backdoSelect">
              <Option v-for="item in type_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Col>
            <Col span="5" class="moveback">
                  <Input  class="user-mobile" v-model="paramsed.codeOrName" placeholder="分配编码名称" clearable enter-button   @on-clear="backdoReset"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="backdoSearch" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="backdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
        <!-- <Input style="width: 250px" search v-model="paramse.codeOrName" placeholder="分配编码/名称" @on-search="searchOrMatch" @on-change="changeOrMatch"></Input> -->
      </section>
    </multi-modal>
    <CompanySelect v-model="select_company_visible" @select="handleSelectCompany"></CompanySelect>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import update from './update_mixin'
import multiModal from '_c/multi-modal'
// import CompanyRadioSelect from '_c/company-radio-select'
import RadioSelect from '_c/radio-select'
import CompanySelect from '_c/companySelectModal'
import batchHandleModal from '_c/batchHandleModal'
export default {
  name: 'update_client',
  components: { CommonIcon, CompanySelect, RadioSelect, multiModal, batchHandleModal },
  mixins: [saasMixin, update],
  data () {
    return {
      // 禁用
      disable_visible: false,
      batchhandleData: [],
      checked: '', // 成功提示的check
      batchHandleModal: false, // 成功提示
      cancleboxModel: false,
      projectcompanyFormId: 0,
      backcompanyFormId: 0,
      selectedValues: [], // 默认数据
      handleModal: false, // 添加弹窗
      companyFormId: '',
      paramse: {
        codeOrName: '',
        menuCode: this.$route.name,
        isEnterpriseAdmin: 1
      }, // 接口参数
      paramsed: {
        idList: [],
        companyFormId: '',
        codeOrName: '',
        menuCode: this.$route.name
        // isEnterpriseAdmin: 1
      },
      batchhandleColumns: [
        {
          title: '序号',
          key: 'sort'
        },
        {
          title: '客户名称',
          key: 'customerName'
        },
        {
          title: '说明',
          key: 'desc',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#fa790e'
              }
            }, params.row.desc)
          }
        }
      ],
      type: 'allocation', // 多选类型
      title: '分配公司',
      Prohibiting: '',
      titling: '取消分配公司',
      canclehandleModal: false,
      typed: 'cancleallocation',
      copyreplication: false,
      // isEnable: 1,
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
        },
        {
          value: 2,
          label: '分配型'
        }
      ],
      type_list: [
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
      typelisted: [
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
      // phone_type: '086',
      create_form: {
        id: '',
        companyId: '0',
        dataTypes: '',
        dataType: 0,
        companyName: '集团',
        customerType: '',
        code: '',
        name: '',
        isEnable: '',
        isInternalCustomer: '',
        unifiedSocialCreditCode: '',
        businessAddress: '',
        idCardNum: '', // 身份证号
        contactNumber: '',
        linkman: '',
        version: '',
        innerCompanyName: '',
        innerCompanyId: ''
      },
      ruleValidate: { // 正则
        companyName: [
          { required: true, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    doSelecting () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramse.companyFormId,
        coderOrName: this.paramse.codeOrName
      }
      this.$refs.modalChild.doModalInit(obj)
      // this.$set(this.paramse, 'codeOrName', this.paramse.codeOrName)
    },
    // newdoReset () {
    //   this.paramse.companyFormId = 0
    //   let obj = {
    //     companyFormId: this.paramse.companyFormId = '',
    //     coderOrName: this.paramse.codeOrName = ''
    //   }
    //   this.$refs.modalChild.doModalInit(obj)
    // },
    // newdoSelect () {
    //   let obj = {
    //     companyFormId: this.paramse.companyFormId
    //     // coderOrName: this.paramse.codeOrName
    //   }
    //   this.$refs.modalChild.doModalInit(obj)
    // },
    // backdoReset () {
    //   this.paramsed.companyFormId = 0
    //   let obj = {
    //     companyFormId: this.paramsed.companyFormId = '',
    //     coderOrName: this.paramsed.codeOrName = ''
    //   }
    //   this.$refs.modalChildes.doModalInit(obj)
    // },
    // backdoSelect () {
    //   let obj = {
    //     companyFormId: this.paramsed.companyFormId
    //     // coderOrName: this.paramse.codeOrName
    //   }
    //   this.$refs.modalChildes.doModalInit(obj)
    // },
    newdoReset () {
      this.projectcompanyFormId = 0
      this.paramse.codeOrName = ''
      let obj = {
        companyFormId: null,
        codeOrName: ''
      }
      this.paramse.companyFormId = null
      this.$refs.modalChild.doModalInit(obj)
    },
    newdoSelect () {
      this.paramse.companyFormId = this.projectcompanyFormId === 0 ? null : this.projectcompanyFormId
      let obj = {
        companyFormId: this.projectcompanyFormId === 0 ? null : this.projectcompanyFormId,
        codeOrName: ''
      }
      this.$refs.modalChild.doModalInit(obj)
    },
    backdoReset () {
      this.backcompanyFormId = 0
      this.paramsed.codeOrName = ''
      this.paramsed.companyFormId = null
      let obj = {
        companyFormId: null,
        codeOrName: ''
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    backdoSelect () {
      this.paramsed.companyFormId = this.backcompanyFormId === 0 ? null : this.backcompanyFormId
      let obj = {
        companyFormId: this.backcompanyFormId === 0 ? null : this.backcompanyFormId
        // coderOrName: this.paramse.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    backdoSearch () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramsed.companyFormId,
        coderOrName: this.paramsed.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
      // this.$set(this.paramse, 'codeOrName', this.paramse.codeOrName)
    },
    doCompanyChange (event) {
      if (event) {
        this.create_form.companyName = event.target.value
      } else {
        this.create_form.companyName = ''
      }
    },
    // 监听删除弹窗关闭
    doDeleteClose (data) {
      if (data) {
        this.batchHandleModal = true
        this.checked = `成功${data.successList.length}条,失败${data.failList.length}条`
        let _arr = []
        data.failList.map(tmp => {
          this.table_list.map(item => {
            if (tmp.businessId === item.id) {
              _arr.push({
                sort: item.id,
                customerName: item.name,
                desc: tmp.referenceDescription
              })
            }
          })
        })
        this.batchhandleData = _arr
      }
      this.showDelete = false
    },
    doCloseBatchAccount (msg) {
      // 监听授权弹窗关闭
      this.batchHandleModal = msg
    },
    // 取消弹窗
    confirmcanclebox () {
      this.form_changed = false
      this.getCurrentInfo(this.$route.query.id)
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    resetrefresh () {
      this.table_config.request_params.companyFormId = ''
      this.table_config.request_params.codeOrName = ''
      this.table_config.refresh = !this.table_config.refresh
    },
    searchOrMatch () {},
    changeOrMatch () {},
    // 清空
    isCheck (val) {
      this.$emit('on-clear', val)
    },
    cancleonVisibeChange (val) {
      // this.modalShow = false
      this.canclehandleModal = false
    },
    // modal弹框显隐回调方法
    onVisibeChange (val) {
      // this.modalShow = false
      this.handleModal = false
    },
    // 监听选择分配公司组件接口
    doGetDataList (selectedList) {
      console.log(selectedList, '选择')
      var selectedListed = []
      console.log(selectedList, '选择分配')
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      this.handleModal = false
      let req = {
        idS: [this.$route.query.id],
        companyList: selectedListed,
        dataType: 0
      }
      this.$request.post('financeback/customerSupplier/updateBatchCustomerSupplierUseCompany', req).then(res => {
        if (res.data.code === 200) {
          console.log(res, '2233')
          this.doDeleteClose(res.data.data)
        }
      })
    },
    // 监听选择取消分配公司组件接口
    CancleGetDataList (selectedList) {
      var selectedListed = []
      console.log(selectedList, '选择分配')
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      console.log(selectedList, '选择取消分配')
      this.canclehandleModal = false
      let req = {
        idS: [this.$route.query.id],
        companyList: selectedListed,
        dataType: 0,
        versions: [this.create_form.version]
      }
      this.$request.post('/financeback/customerSupplier/cancelBatchCustomerSupplierUseCompany', req).then(res => {
        if (res.data.code === 200) {
          console.log(res, '23456')
          if (res.data.data.faillist && res.data.data.faillist.length === 0) {
            this.$Message.warning('取消分配成功')
          }
          if (res.data.data.successList && res.data.data.successList.length === 0) {
            this.$Message.warning('公司已经发生业务数据，无法取消分配')
          }
          if (res.data.data.faillist.length > 0 && res.data.data.successlist.length > 0) {
            this.doallocationClose(res.data.data)
          }
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    doallocationClose (data) {
      if (data) {
        this.batchHandleModal = true
        this.checked = `取消分配成功${data.successList.length}条,失败${data.failList.length}条`
        let _arr = []
        data.failList.map(tmp => {
          this.table_list.map(item => {
            if (tmp.businessId === item.id) {
              _arr.push({
                sort: item.id,
                customerName: item.name,
                desc: tmp.referenceDescription
              })
            }
          })
        })
        this.batchhandleData = _arr
      }
      this.showDelete = false
    },
    cancledoAddCheck () {
      this.$Message.success('当前资料不是分配型资料，无法操作')
    },
    cancleUnallocation () {
      this.$Message.success('当前资料不是分配型资料，无法操作')
    },
    doSelect () { // 下拉选择框
      this.$set(this.paramsList, 'companyFormId', this.companyFormId)
    },
    doSearch () { // input搜索内容框
      this.$set(this.paramsList, 'codeOrName', this.companyCodeOrName)
    },
    doReset () { // 重置按钮
      this.companyFormId = null
      this.companyCodeOrName = ''
      this.paramsList = {}
    },
    getClear () {
      this.isClear = false
    },
    // 取消分配
    Unallocation () {
      this.canclehandleModal = true
    },
    doAddCheck () {
      this.handleModal = true
    },
    handlecopyclient (type) {
      if (this.create_form.companyId === '' || this.create_form.companyId === null) {
        this.$Message.warning('请选择创建公司！')
        this.edit_visible = false
        return false
      }
      if (this.create_form.customerType === '') {
        this.$Message.warning('请选择客户类型！')
        this.edit_visible = false
        return false
      }
      if (!this.create_form.name) {
        this.$Message.warning('请填写客户名称！')
        this.edit_visible = false
        return false
      }
      if (!/^(\d|[a-zA-Z]|[\u4e00-\u9fa5]){1,50}$/.test(this.create_form.name)) {
        this.$Message.warning('客户名称格式不正确！')
        return false
      }
      if (this.create_form.unifiedSocialCreditCode !== '' && !/^(\d|[a-zABCDEFGHJKLMNPQRTUWXY]){18}$/.test(this.create_form.unifiedSocialCreditCode)) {
        this.$Message.warning('统一社会信用代码格式为:18位数字或英文字母，不含大写字母IOZSV')
        return false
      }
      if (this.create_form.contactNumber !== '' && !/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('手机号码格式不正确！')
        return false
      }
      if (this.create_form.idCardNum !== '' && this.create_form.idCardNum.length < 18) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,20}$/.test(this.create_form.linkman)) {
      //   this.$Message.warning('联系人格式不正确！')
      //   return false
      // }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,200}$/.test(this.create_form.businessAddress)) {
      //   this.$Message.warning('经营地址格式不正确！')
      //   return false
      // }
      this.$request.post('financeback/customerSupplier/updateCustomerSupplierById', {
        ...this.create_form,
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.form_changed = false
        } else {
          this.$Message.warning('保存失败！')
        }
      })
    },
    // 新增
    handleAddForm () {
      if (!this.form_changed) {
        this.$router.push({ path: 'client_create' })
      } else {
        let that = this
        this.$Control({
          type: 'control',
          message: '当前数据已修改，需要保存吗？',
          yes () {
            that.handleSaveInfo('no-found')
            that.$router.push({ path: 'client_create' })
            that.$CloseCtl()
          },
          no () {
            that.$CloseCtl()
            that.$router.push({ path: 'client_create' })
          },
          cancel () {
            that.$CloseCtl()
          },
          close (type) {
            if (!type) {
              console.log('组件关闭了')
            }
          }
        })
      }
    },
    copyproject () {
      console.log(this.$route.query.id, '222')
      if (!this.form_changed) {
        this.$router.push({
          name: 'create_client',
          query: {
            params: this.$route.query.params,
            id: this.$route.query.id
          }
        })
        // this.$router.push({ path: 'client_create' })
        this.create_form.code = ''
        this.create_form.name = ''
      } else {
        this.copyreplication = true
      }
    },
    // 复制保存
    handlecopyclientupdate (type) {
      if (this.create_form.companyId === '' || this.create_form.companyId === null) {
        this.$Message.warning('请选择归属公司！')
        this.edit_visible = false
        return false
      }
      if (this.create_form.customerType === '') {
        this.$Message.warning('请选择客户类型！')
        this.edit_visible = false
        return false
      }
      if (!this.create_form.name) {
        this.$Message.warning('请填写客户名称！')
        this.edit_visible = false
        return false
      }
      if (!/^(\d|[a-zA-Z]|[\u4e00-\u9fa5]){1,50}$/.test(this.create_form.name)) {
        this.$Message.warning('客户名称格式不正确！')
        return false
      }
      if (this.create_form.unifiedSocialCreditCode !== '' && !/^(\d|[a-zABCDEFGHJKLMNPQRTUWXY]){18}$/.test(this.create_form.unifiedSocialCreditCode)) {
        this.$Message.warning('统一社会信用代码格式为:18位数字或英文字母，不含大写字母IOZSV')
        return false
      }
      if (this.create_form.contactNumber !== '' && !/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('手机号码格式不正确！')
        return false
      }
      if (this.create_form.idCardNum !== '' && this.create_form.idCardNum.length < 18) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,20}$/.test(this.create_form.linkman)) {
      //   this.$Message.warning('联系人格式不正确！')
      //   return false
      // }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,200}$/.test(this.create_form.businessAddress)) {
      //   this.$Message.warning('经营地址格式不正确！')
      //   return false
      // }
      this.$request.post('financeback/customerSupplier/updateCustomerSupplierById', {
        ...this.create_form,
        isEnterpriseAdmin: 1
      }).then(res => {
        console.log(this.$route.query.id, '111112')
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.form_changed = false
          setTimeout(() => {
            this.$router.push({
              name: 'create_client',
              query: {
                params: this.$route.query.params,
                id: this.$route.query.id
              }
            })
            // this.doGetInit()
          }, 1000)
        } else {
          this.$Message.warning('保存失败！')
        }
      })
    },
    // 复制是
    clientcopy () {
      this.handlecopyclientupdate()
      this.copyreplication = false
      this.doContinueActions()
    },
    // 复制否
    clientcopyno () {
      for (let key in this.create_form) {
        this.create_form[key] = this.current_row[key]
      }
      this.handleSyncInternalCustomer(this.current_row.isInternalCustomer)
      this.form_changed = false
      this.$router.push({ name: 'create_client' })
      this.copyreplication = false
      this.doContinueActions()
    },
    // 复制取消
    clientcopyCancel () {
      this.copyreplication = false
    }
  }
}
</script>

<style lang="less">
  @import "client_supplier";
</style>
