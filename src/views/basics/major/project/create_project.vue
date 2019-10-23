<template>
  <div class="create-project">
    <div class="header-nav">
      <div class="left">
        <h2 class="title">新增项目</h2>
      </div>
      <div class="right">
        <i-button type="primary"  @click="handleSaveInfo(1)">保存</i-button>
        <i-button  @click="doSaveAdd">保存并新增</i-button>
        <i-button  @click="doCancel">取消</i-button>
        <i-button  @click="goElementList">列表</i-button>
      </div>
    </div>
    <div class="container form_init">
      <Form  ref="formValidate" :model="create_form" :label-width="120" :rules="ruleValidate">
        <Row>
          <Col :span="6">
            <FormItem label="创建公司" class="input_after" prop="companyName">
            <RadioSelect :config="table_config" :bloc="flag" :reset='table_config.refresh' v-model="create_form.companyName" @getData="handleGetData" @change="ChangeForm">
      <div slot="header">
        <div class="search-contain">
          <Row :gutter="10" class="no-error-modal">
            <Col span="4">
              <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
              </Select>
            </Col>
            <!-- <Col span="8">
              <Input autocomplete="on" clearable  v-model="table_config.request_params.codeOrName" placeholder="客户编码/客户名称" search enter-button
                     @on-search="table_config.refresh = !table_config.refresh">
                <Button slot="append" icon="ios-search" @click="table_config.refresh = !table_config.refresh" ></Button>
              </Input>
            </Col> -->
                 <Col span="8">
                  <Input v-model="table_config.request_params.codeOrName"  placeholder="编码/名称" clearable enter-button  @on-clear="clearback"  @on-search="table_config.refresh = !table_config.refresh"></Input>
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
              <!-- <Input type="text" readonly v-model="create_form.company"  @on-change="doChangeForm"></Input>
               <Icon class="input_icon" type="md-more" size="20" @click="ownershipcompany"></Icon> -->
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.companyName !== '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="doChangeForm" v-model="create_form.dataType" placeholder="" disabled>
                <Option v-for="(item, index) in useListed" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
           <Col :span="6" v-if="create_form.companyName === '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :label-in-value="true" @on-change="doChangeForm" v-model="create_form.dataType" placeholder="">
                <Option v-for="(item, index) in useList" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="编码" prop="code">
              <Input type="text"  v-model="create_form.code" placeholder="系统编码" disabled :maxlength="10" @on-change="doChangeForm"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="项目名称"  class="input_after" prop="name">
              <Input type="text" v-model="create_form.name" @on-change="doChangeForm" :maxlength="50"></Input>
            </FormItem>
          </Col>
          </Row>
          <Row>
             <Col :span="6">
            <FormItem label="负责部门">
             <RadioSelect :config="tableconfig" :reset='tableconfig.refresh' @on-close="doResetAuxiliaryConfig" :model_ids2="model_ids2" v-model="create_form.departmentName" @getData="handleSelectCompany2">
      <div slot="header">
        <div class="search-contain">
          <Row :gutter="10">
           <Col span="4">
                <Select v-model="params.isEnable"  disabled clearable placeholder="已生效">
                  <!-- <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option> -->
                </Select>
              </Col>
              <Col span="4">
                <Select v-model="tableconfig.request_params.deptType" @on-change="getchange" clearable placeholder="全部属性">
                  <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                </Select>
              </Col>
            <!-- <Col span="8">
              <Input autocomplete="on" clearable type="text" v-model="tableconfig.request_params.codeOrName" placeholder="部门编码/部门名称" search enter-button
                     @on-search="tableconfig.refresh = !tableconfig.refresh">
                <Button slot="append" icon="ios-search" @click="tableconfig.refresh = !tableconfig.refresh"></Button>
              </Input>
            </Col> -->
                <Col span="8">
                  <Input v-model="tableconfig.request_params.deptCodeOrDeptName"  placeholder="部门编码/部门名称" clearable enter-button  @on-clear="tableconfig.refresh = !tableconfig.refresh"  @on-search="tableconfig.refresh = !tableconfig.refresh"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="tableconfig.refresh = !tableconfig.refresh"></Button>
              </Col>
            <Col span="4">
              <Button @click="backreset" class="resset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
    </RadioSelect>
              <!-- <Input type="text" readonly v-model="create_form.department" icon="md-more"  @on-click="company_select_visible2 = true" @on-change="doChangeForm"></Input> -->
            </FormItem>
          </Col>
          <Col :span="6">
             <FormItem label="负责人">
             <RadioSelect :config="tablepersonInChargeName"  @on-close="doResetAuxiliary" :reset='tablepersonInChargeName.refresh'  v-model="create_form.personInChargeName" @getData="handleSelect">
      <div slot="header">
        <div class="search-contain">
          <Row :gutter="10">
         <Col span="4">
                <Select v-model="params.isEnable"  disabled clearable placeholder="已生效">
                  <!-- <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option> -->
                </Select>
              </Col>
              <Col span="4">
                <Select v-model="tablepersonInChargeName.request_params.deptType" @on-change="getformListed" clearable placeholder="全部部门">
                  <Option v-for="(item,name) in formListed" :value="item.id" :key="name">{{item.name}}</Option>
                </Select>
              </Col>
                <Col span="8">
                  <Input v-model="tablepersonInChargeName.request_params.codeOrName" placeholder="编码/名称" clearable enter-button  @on-clear="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"  @on-search="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"></Button>
              </Col>
          </Row>
            <Row style="margin-top:10px;">
                 <Col span="8">
                  <Input v-model="tablepersonInChargeName.request_params.contactNumber" placeholder="员工手机号码" clearable enter-button  @on-clear="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"  @on-search="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"></Input>
            </Col>
            <Col span="1" style="margin-left:10px;">
                <Button  icon="ios-search" @click="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"></Button>
              </Col>
            <Col span="4">
              <Button @click="tableName" class="ressett">重置</Button>
            </Col>
              </Row>
        </div>
      </div>
    </RadioSelect>
              <!-- <Input type="text"  readonly v-model="create_form.personInChargeName" icon="md-more"  @on-click="doSelectperson" @on-change="doChangeForm"></Input> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
        <Col :span="6">
            <FormItem label="手机号">
              <Input type="text" v-model="create_form.mobile"  :maxlength="11" @on-change="doChangeForm"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="开始日期">
             <DatePicker type="date" editable placeholder="请选择开始日期"  placement="bottom-start" class="startdate" v-model="create_form.startDate" @on-change="doChangeForm"></DatePicker>
             <!-- <DatePicker type="date" :options="options1"  placeholder="请选择开始日期"  placement="bottom-start" class="startdate" v-model="create_form.startDate" @on-change="doChangeForm"></DatePicker> -->
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="验收日期">
             <DatePicker type="date" placeholder="请选择验收日期" class="enddate"  placement="bottom-start" v-model="create_form.inspectionDate" @on-change="doChangeForm"></DatePicker>
            </FormItem>
          </Col>
        </Row>
            <Row>
                <Col span="12">
                 <FormItem label="备注" prop="remark">
            <Input  type="textarea" v-model="create_form.remark" :autosize="{minRows: 5,maxRows: 5}" placeholder="" @on-change="doChangeForm" :maxlength="200"></Input>
                </FormItem>
                </Col>
            </Row>
      </Form>
    </div>
      <!-- 归属公司Modal -->
    <account-modal
    :dataModal="dataModal"
    @getAccountName="setAccountName"
    @getShowAccount="setShowAccount"
    >
    </account-modal>
      <!-- <CompanyChose title="选择负责部门"  :model_ids2="model_ids2" v-model="company_select_visible2" @select="handleSelectCompany2"></CompanyChose> -->
    <!-- <projectResponsibility :showFlag="showCompanies" titleName="负责部门" @getCowName="setComName" @getShowFlag="setShowFlag"  @address="projectResponsibility"></projectResponsibility> -->
    <!-- <personCharge :showFlag="showCharge" titleName="选择归属公司" @getCowName="setCharge" @getShowFlag="setChargeFlag"  @address="handleSelectCompany"></personCharge> -->
    <ownershipcompany :showFlag="Charge" titleName="负责人"  :model_ids2="model_ids2" @getCowName="setCharge" @getShowFlag="ChargeFlag"  @address="handleSelect"></ownershipcompany>
        <!-- <Modal
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
          <Button type="primary" @click="confirm('formValidate','save')">是</Button>
          <Button  @click="doDeny">否</Button>
          <Button type="default" @click="cancel">取消</Button>
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
// import projectResponsibility from '_c/projectResponsibility'
// import personCharge from '_c/personCharge'
import ownershipcompany from '_c/ownershipcompany'
// import { Validation } from '@/libs/rule'
import CommonIcon from '_c/common-icon'
import dayjs from 'dayjs'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'
import AccountModal from '_c/accountBank'
// import CompanyChose from '../employee/companychose'
import { saasMixin } from '@/libs/mixins'
// import CompanyRadioSelect from '_c/company-radio-select'
export default {
  name: 'create_project',
  data () {
    return {
      company_select_visible2: false,
      model_ids2: null,
      cancleboxModel: false, // 取消
      companyFormId: 0,
      dataModal: {
        isShow: false
      },
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
      formList: [],
      flag: true,
      formListed: [],
      params: {
        deptCodeOrDeptName: '',
        companyIdList: [],
        page: {
          size: 10,
          current: 1
        }
      },
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
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '292px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: 'project_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      tablepersonInChargeName: {
        type: 'personInChargeName', // 单选类型,在columns.js 文件里定义好
        title: '选择负责人',
        width: '292px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'project_index',
          isEnterpriseAdmin: 1,
          codeOrName: '',
          contactNumber: '',
          isEnable: 1,
          deptType: '',
          deptId: ''
          // companyIdList: []
        }
      },
      tableconfig: {
        type: 'department', // 单选类型,在columns.js 文件里定义好
        title: '选择部门',
        width: '292px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'project_index',
          isEnterpriseAdmin: 1,
          deptType: '',
          isEnd: 1,
          queryConditions: 1,
          deptCodeOrDeptName: '',
          isEnable: 1,
          companyIdList: []
        }
      },
      cancel_visible: false, // 取消
      editable: false,
      changed: false, // 判断页面内容有没有修改
      save_type: '', // 保存(1) or 保存新增(2)
      // showCharge: false,
      Charge: false,
      reminderModal: false, // 提示弹窗
      // showCompanies: false,
      create_form: {
        isEnterpriseAdmin: 1,
        codeType: 0,
        companyName: '集团',
        dataType: 1,
        // useCompanyId: 1,
        name: null,
        code: null,
        departmentName: null,
        mobile: null,
        remark: null,
        companyId: 0,
        personInChargeName: null,
        personInCharge: null,
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        inspectionDate: null,
        isEnable: null,
        isDel: null
      },
      // form表达验证
      ruleValidate: {
        companyName: [
          { required: true, trigger: 'change' }
        ],
        name: [
          { required: true, trigger: 'change' }
        ]
        // department: [
        //   { required: true, trigger: 'blur' }
        // ],
        // phoneNumber: [
        //   { required: true, trigger: 'blur' }
        // ],
        // code: [
        //   { validator: Validation.codeRule, trigger: 'blur' }
        // ]
        // remark: [
        //   { validator: Validation.addressRule, trigger: 'blur' }
        // ]
      }
    }
  },
  components: {
    // projectResponsibility,
    // personCharge,
    AccountModal,
    ownershipcompany,
    CommonIcon,
    RadioSelect
    // CompanyRadioSelect,
    // CompanyChose
  },
  mixins: [saasMixin],
  created () {
    this.doGetInited()
    this.getdeptchange()
    // this.reminderModal = false
  },
  methods: {
    doResetAuxiliaryConfig () {
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    doResetAuxiliary () {
      this.tablepersonInChargeName.request_params.codeOrName = ''
      this.tablepersonInChargeName.request_params.contactNumber = ''
      this.tablepersonInChargeName.refresh = !this.tablepersonInChargeName.refresh
    },
    ...mapMutations([
      'addIdToList'
    ]),
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
    ChangeForm (event) {
      this.changed = true
      if (event) {
        this.create_form.companyName = event.target.value
      } else {
        this.create_form.companyName = ''
      }
    },
    // 取消弹窗
    confirmcanclebox () {
      this.doGetInit()
      // this.handleInitDefaultCompany()
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          console.log(res, '66')
          this.formList = res.data.data
          this.formListed = res.data.data
        }
      })
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
    againreset () {
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.refresh = !this.table_config.refresh
      this.table_config.request_params.codeOrName = ''
    },
    resetrefresh () {
      this.flag = true
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.refresh = !this.table_config.refresh
      this.table_config.request_params.codeOrName = ''
    },
    backreset () {
      this.tableconfig.request_params.isEnable = ''
      this.tableconfig.request_params.deptType = ''
      this.tableconfig.request_params.codeOrName = ''
      this.tableconfig.request_params.deptCodeOrDeptName = null
      this.tableconfig.request_params.companyIdList = []
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 负责人员工接口
    tableName () {
      this.tablepersonInChargeName.request_params.contactNumber = ''
      this.tablepersonInChargeName.request_params.codeOrName = ''
      this.tablepersonInChargeName.request_params.deptType = ''
      this.tablepersonInChargeName.refresh = !this.tablepersonInChargeName.refresh
    },
    getchange (item) {
      console.log(item, '33')
      let companyIdList = []
      companyIdList.push(item)
      this.tableconfig.request_params.companyIdList = companyIdList
      console.log(this.tableconfig.request_params.companyIdList, '22')
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 员工全部形态
    getformListed () {
      this.tablepersonInChargeName.refresh = !this.tablepersonInChargeName.refresh
    },
    // ChangeForm () {
    //   this.changed = true
    // },
    handleGetData (data) {
      this.changed = true
      console.log(data, '66')
      this.create_form.companyName = data.name
      if (this.create_form.companyName !== '集团') {
        this.create_form.dataType = 3
        this.tableconfig.request_params.queryConditions = 2
      } else {
        this.create_form.dataType = 1
        this.tableconfig.request_params.companyIdList = []
        this.tableconfig.request_params.queryConditions = 1
      }
      this.create_form.companyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      // this.create_form.useCompanyName = data.name
      // this.create_form.useCompanyId = data.id
      this.tableconfig.request_params.companyIdList = []
      this.tableconfig.request_params.companyIdList.push(data.id)
      // this.tablepersonInChargeName.request_params.companyIdList = []
      this.tablepersonInChargeName.request_params.deptId = data.id
      // this.tableconfig.request_params.companyIdList = this.tableconfig.request_params.companyIdList.splice(0, 1, data.id)
      // this.tablepersonInChargeName.request_params.companyIdList = this.tablepersonInChargeName.request_params.companyIdList.splice(0, 1, data.id)
    },
    confirm (name, type) {
      this.reminderModal = false
      this.doSaveAdd(name, type)
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        yes () {
          that.handleSaveInfo(2, that.doContinueActions())
          that.$CloseCtl()
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 取消按钮
    doCancel () {
      if (this.changed) {
        this.cancleboxModel = true
      }
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    // 初始化
    doGetInit () {
      this.create_form.isEnterpriseAdmin = 1
      this.create_form.companyName = '集团'
      this.create_form.companyId = 0
      this.create_form.dataType = 1
      this.create_form.code = null
      this.create_form.name = null
      this.create_form.departmentName = null
      this.create_form.personInChargeName = null
      this.create_form.personInCharge = null
      this.create_form.mobile = null
      this.create_form.inspectionDate = dayjs(new Date()).format('YYYY-MM-DD')
      this.create_form.startDate = dayjs(new Date()).format('YYYY-MM-DD')
      this.$refs.formValidate.resetFields()
    },
    // 初始化-查看页面过来的
    doGetInited (id) {
      console.log(this.$route.query.id, '10')
      // this.params = JSON.parse(this.$route.query.params)
      if (this.$route.query.id) {
        let req = {
          id: this.$route.query.id
        }
        this.loading = true
        this.$request.post('/financeback/project/findProjectById', req).then(res => {
          this.loading = false
          console.log(res, '233')
          if (res.data.code === 200) {
            // 过滤对象中值为null的属性
            let item = ''
            for (item in res.data.data) {
              if (res.data.data[item] === null) {
                res.data.data[item] = null
              }
            }
            this.create_form = res.data.data
            // 资料类型 1.共享型,2.分配型,3.私有型
            if (this.create_form.dataType === 3) {
              this.create_form.dataType = 3
            }
            if (this.create_form.dataType === 2) {
              this.create_form.dataType = 2
            }
            if (this.create_form.dataType === 1) {
              this.create_form.dataType = 1
            }
            this.create_form.code = ''
            this.create_form.name = ''
            // this.create_form.companyName = '集团'
            this.$refs.formValidate.resetFields()
          }
        })
      }
      this.changed = false
    },
    doDeny () {
      this.doContinueActions()
      this.reminderModal = false
      this.doGetInit()
      this.changed = false
    },
    cancel () {
      this.reminderModal = false
      this.doGetInit()
      this.changed = false
    },
    handleSelectCompany2 (data) {
      if (data) {
        this.changed = true
        this.create_form.departmentId = data.id
        this.create_form.departmentName = data.name
        this.tablepersonInChargeName.request_params.deptId = data.id
        // this.tablepersonInChargeName.request_params.companyIdList = []
        // this.tablepersonInChargeName.request_params.companyIdList.push(data.id)
      }
      // this.company_select_visible2 = false
    },
    handleConfirmCancel () {
      // this.handleResetForm()
      this.cancel_visible = false
    },
    // 保存
    handleSaveInfo (type) {
      this.$refs['formValidate'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (!this.create_form.companyName) {
        this.$Message.warning('请选择创建公司！')
        return false
      }
      if (!this.create_form.name) {
        this.$Message.warning('请输入项目名称')
        return false
      }
      // if ((this.create_form.name !== '' || this.create_form.name === '') && !/^[\u4e00-\u9fffa-zA-Z0-9]{1,50}$/.test(this.create_form.name)) {
      //   this.$Message.warning('请输入正确的项目名称')
      //   return false
      // }
      if (this.create_form.code) {
        if (!/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
          this.$Message.warning('请填写正确项目编码')
          return false
        }
      }
      if (this.create_form.mobile) {
        if (!/^1[3456789]\d{9}$/.test(this.create_form.mobile)) {
          this.$Message.warning('请输入正确的手机号码')
          return false
        }
      }
      // if (!/^1[3456789]\d{9}$/.test(this.create_form.phoneNumber)) {
      //   this.$Message.warning('请输入正确的手机号码！')
      //   return false
      // }
      // if (!this.create_form.departmentId) {
      //   this.$Message.warning('请填写负责部门！')
      //   return false
      // }
      if (!this.create_form.startDate) {
        this.create_form.startDate = null
      } else {
        this.create_form.startDate = dayjs(this.create_form.startDate).format('YYYY-MM-DD')
      }
      if (!this.create_form.inspectionDate) {
        this.create_form.inspectionDate = null
      } else {
        this.create_form.inspectionDate = dayjs(this.create_form.inspectionDate).format('YYYY-MM-DD')
      }
      let req = {
        codeType: this.create_form.codeType,
        id: this.create_form.id,
        isEnterpriseAdmin: 1,
        version: this.create_form.version,
        code: this.create_form.code,
        companyId: this.create_form.companyId,
        useCompanyIdArr: this.create_form.useCompanyIdArr,
        departmentId: this.create_form.departmentId,
        personInCharge: this.create_form.personInCharge,
        mobile: this.create_form.mobile,
        startDate: this.create_form.startDate,
        inspectionDate: this.create_form.inspectionDate,
        remark: this.create_form.remark,
        personInChargeName: this.create_form.personInChargeName,
        departmentName: this.create_form.departmentName,
        companyName: this.create_form.companyName,
        dataType: this.create_form.dataType,
        name: this.create_form.name,
        isEnable: this.create_form.isEnable
      }
      // this.create_form.inspectionDate = dayjs(this.create_form.inspectionDate).format('YYYY-MM-DD')
      this.$request.post('financeback/project/addProject', req).then(res => {
        console.log(this.create_form, '21')
        console.log(res)
        if (res.data.code === 200) {
          if (this.save_type === 2) {
            this.addIdToList({ id: res.data.data.id, name: 'project' })
            this.$router.push({ name: 'project_index' })
            this.$Message.success('保存成功！')
            // this.doContinueActions()
            return false
          }
          this.$Message.success('保存成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'update_project',
              query: {
                params: this.$route.query.params,
                id: res.data.data.id
              }
            })
            this.doGetInit()
          }, 1000)
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    // 保存并新增
    doSaveAdd (type) {
      this.$refs['formValidate'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (this.create_form.companyName === '') {
        this.$Message.warning('请选择创建公司！')
        return false
      }
      if (this.create_form.name === '') {
        this.$Message.warning('请选择项目名称！')
        return false
      }
      if (this.create_form.code) {
        if (!/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
          this.$Message.warning('请填写正确项目编码')
          return false
        }
      }
      if (this.create_form.mobile) {
        if (!/^1[3456789]\d{9}$/.test(this.create_form.mobile)) {
          this.$Message.warning('请输入正确的手机号码！')
          return false
        }
      }
      if (!this.create_form.startDate) {
        this.create_form.startDate = null
      } else {
        this.create_form.startDate = dayjs(this.create_form.startDate).format('YYYY-MM-DD')
      }
      if (!this.create_form.inspectionDate) {
        this.create_form.inspectionDate = null
      } else {
        this.create_form.inspectionDate = dayjs(this.create_form.inspectionDate).format('YYYY-MM-DD')
      }
      // if (!this.create_form.departmentId) {
      //   this.$Message.warning('请填写负责部门！')
      //   return false
      // }
      this.$request.post('financeback/project/addProject', this.create_form).then(res => {
        // console.log(this.create_form)
        console.log(res, '333')
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.$refs.formValidate.resetFields()
          this.changed = false
          setTimeout(() => {
            // this.$router.push({ path: 'create_project' })
            this.$router.push({
              name: 'create_project'
              // query: {
              //   params: this.$route.query.params,
              //   id: res.data.data.id
              // }
            })
            this.doGetInit()
          }, 1000)
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    handleSelectCompany (row) {
      if (row) {
        this.create_form.companyName = row.row.name
        // console.log(row.row.name)
      }
      // this.ownershipcompany = false
    },
    handleSelect (data) {
      if (data) {
        this.changed = true
        this.create_form.personInCharge = data.id
        this.create_form.personInChargeName = data.name
      }
      // this.ownershipcompany = false
    },
    projectResponsibility (row) {
      if (row) {
        this.create_form.departmentName = row.row.name
        // console.log(row.row.name)
      }
      // this.ownershipcompany = false
    },
    // 跳转列表页
    goElementList () {
      this.reminderModal = false
      this.doLocationDetail('project_index')
      // this.$router.push({
      //   path: 'project_index'
      // })
      // this.reminderModal = false
    },
    // 负责人
    doSelectperson (row) {
      this.create_form.personInChargeName = row.personInChargeName
      // console.log(row.personInCharge)
      this.Charge = true
      this.showCompanies = false
    },
    // 归属公司
    ownershipcompany (row) {
      this.dataModal.isShow = true
      this.changed = true
      // this.create_form.companyId = row.id
      // this.showCharge = true
    },
    setAccountName (data) {
      // console.log(data)
      // this.changed = true
      // this.create_form.company = data.companyName
      // this.create_form.companyId = data.companyId
      // this.model_ids2 = data.companyId
      // console.log(data.companyId)
      // this.dataModal.isShow = false
      this.changed = true
      this.create_form.companyName = data.row.name
      this.create_form.companyId = data.row.id
      this.model_ids2 = data.row.id
      // console.log(data.row.id)
      this.dataModal.isShow = false
    },
    setShowAccount (data) {
      this.dataModal.isShow = data
    },
    setCharge (data) {
      this.formValidate.companyName = data.name
      // console.log(data.id)
      this.showCharge = false
    },
    setChargeFlag (data) {
      this.showCharge = data
    },
    ChargeFlag (data) {
      this.Charge = data
    },
    doSelectCompany (row) {
      this.create_form.departmentId = row.departmentId
    },
    setComName (data) {
      this.formValidate.companyName = data.name
      this.showCompanies = false
    },
    setShowFlag (data) {
      this.showCompanies = data
    }
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
  }
}
</script>
<style lang="less">
.create-project {
  .ivu-col-span-6 {
    display: block;
    width: 24.5%;
}
  .ivu-icon-md-more:before {
    content: "\F3E7";
    font-size: 20px;
}
  .ivu-picker-panel-body {
    width: 310px;
    float: left;
}
  .ivu-date-picker-cells {
   width: 300px;
    margin: 10px;
    white-space: normal;
}
   .ivu-picker-panel-body {
    width: 310px;
    float: left;
}
  .ivu-date-picker-cells {
   width: 300px;
    margin: 10px;
    white-space: normal;
}
  .form_init .ivu-form-item .ivu-form-item-content .ivu-input, .form_init .ivu-form-item .ivu-form-item-content .ivu-select {
     max-width: 704px;
}
 .ivu-form-item-error-tip {
      display: none;
    }
.ivu-form-item-required .ivu-form-item-label:before {
    content: '*';
    display: none;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    // color: #ed4014;
}
   // 信息提示
  .title-modal{
    position: absolute;
    .ivu-modal{
      position: absolute;
      width: 480px !important;
      height: 200px;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      .ivu-modal-header{
        border: none;
        padding: 30px 0 0 30px;
        svg.iconfont.guide{
          font-size: 16px !important;
          color: #FA790E;
          position: absolute;
        }
        span{
          font-size: 16px;
          color: #333333;
          margin-left: 22px;
        }
      }
      .ivu-modal-body{
        font-size: 14px;
        color: #333333;
        opacity: 0.85;
        padding: 20px 0 40px 50px
      }
      .ivu-modal-footer{
        border: none;
        padding:0 30px 30px 18px;
        // Button{
        //   border-radius: 4px;
        // }
      }
    }
  }
}

</style>
<style lang="less" scoped>
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
.ivu-btn-icon-only {
    padding: 3px 10px;
    margin-left: -10px;
}
.resset {
  margin-left: 6px;
}
.ressett {
  margin-left: 6px;
}
  .create-project {
    width: 100%;
    height: 100%;
    .input_icon {
      position: absolute;
      right: 5px;
      top: 6px;
      color: #808695;
    }
    .header-nav {
      height: 50px;
      border-bottom: 1px solid #DDDDDD;
      display: flex;
      line-height: 50px;
      padding: 0 20px;
      justify-content: space-between;
      .left {
        h2 {
          font-size: 16px;
          font-weight: bold;
          color: #747474;
        }
      }
      .right {
        button:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
    .container {
      width: 1700px;
      position: relative;
      padding: 10px 10px;
      .rule-star::after {
        display: block;
        width: 15px;
        height: 15px;
        content: '*';
        color: red;
        font-size: 18px;
        text-align: center;
        position: absolute;
        right: -20px;
        top: 10px;
        visibility: visible;
      }
    }
  }
</style>
