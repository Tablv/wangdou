<template>
  <div class="update-employee">
    <common-icon v-show="create_form.isEnable === 0" class="yishixiao" type="_yishixiao1"/>
    <div class="header-nav">
      <div class="left">
        <h2 class="title">查看员工</h2>
      </div>
      <div class="right">
        <i-button type="primary" @click="handleSaveInfo(2)">保存</i-button>
        <!-- <i-button  @click="doSaveAdd">保存并新增</i-button> -->
        <i-button @click="handleUpdateInfo">取消</i-button>
        <i-button @click="handleAddForm">新增</i-button>
        <i-button @click="handleConfirmDel">删除</i-button>
        <Button @click="copyproject">复制</Button>
        <i-button @click="doLocationDetail('employee_index')">列表</i-button>
        <i-button v-if="create_form.isEnable ===1" @click="handleDisable">禁用</i-button>
        <i-button v-if="create_form.isEnable !==1" @click="handleDisables">反禁用</i-button>
        <!-- <i-button icon="md-skip-backward" @click="handlePageLocation('first')"></i-button> -->
        <!-- 首条 -->
        <Button  @click="handlePageLocation('first')" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye" />
          </span>
        </Button>
        <i-button icon="ios-arrow-back" @click="handlePageLocation('prev')"></i-button>
        <i-button icon="ios-arrow-forward" @click="handlePageLocation('next')"></i-button>
        <!-- 末条 -->
        <Button class="isfenye" @click="handlePageLocation('last')">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye" />
          </span>
        </Button>
        <!-- <i-button icon="md-skip-forward" @click="handlePageLocation('last')"></i-button> -->
      </div>
    </div>
    <div class="main-container form_init">
      <Form ref="formValidates" :rules="ruleValidate" :model="create_form" :label-width="120">
        <Row>
           <Col :span="6"  v-if="(create_form.isDraw === 1 && create_form.isEnable===1) || create_form.isEnable===0">
            <FormItem label="创建公司">
              <Input type="text" readonly disabled v-model="create_form.company" icon="md-more"></Input>
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.isDraw === 0 && create_form.isEnable ===1">
            <FormItem label="创建公司" class="input_after">
              <RadioSelect :config="table_config"  :reset='table_config.refresh' v-model="create_form.company" @getData="handleGetData" @change="doChangeForm">
                <div slot="header">
                  <div class="search-contain">
                    <Row :gutter="10">
                      <Col span="4">
                        <Select v-model="companyFormId"  @on-change="doCompanyFormIdChange">
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
                            <Input v-model="table_config.request_params.codeOrName"  placeholder="公司编码/公司名称" clearable enter-button  @on-clear="table_config.refresh = !table_config.refresh"  @on-search="table_config.refresh = !table_config.refresh"></Input>
                      </Col>
                      <Col span="1">
                          <Button  icon="ios-search" @click="table_config.refresh = !table_config.refresh"></Button>
                        </Col>
                      <Col span="4">
                        <Button @click="againreset" class="resset">重置</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </RadioSelect>
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.isEnable !== 1">
            <FormItem label="部门">
              <Input type="text" disabled icon="md-more" v-model="create_form.dept" ></Input>
            </FormItem>
          </Col>
            <Col :span="6" v-if="create_form.isEnable === 1">
            <FormItem label="部门" class="input_after">
              <RadioSelect :config="tableconfig" :reset='tableconfig.refresh'  @on-close="doResetAuxiliaryConfig" v-model="create_form.dept" @getData="handleSelectCompany2" @on-change="doChangeForm">
                <div slot="header">
                  <div class="search-contain">
                    <Row :gutter="10">
                      <Col span="4">
                        <Select  disabled clearable placeholder="已生效">
                          <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select v-model="tableconfig.request_params.deptType" @on-change="getchange" clearable placeholder="全部属性">
                          <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                        </Select>
                      </Col>
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
            <!-- <Input type="text" :disabled="create_form.isEnable!==1"  v-model="create_form.departmentName"  @on-click="company_select_visible2 = true" @on-change="doChangeForm"></Input> -->
            </FormItem>
          </Col>
        </Row>
        <Row>
           <Col :span="6">
            <FormItem label="员工编码" prop="code">
              <Input type="text"  v-model="create_form.code" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6" v-if="create_form.isDraw === 0 && create_form.isEnable ===1">
            <FormItem label="员工姓名" prop="name" class="rule-star">
              <Input type="text" @on-change="doChangeForm" v-model="create_form.name"></Input>
            </FormItem>
          </Col>
            <Col :span="6" v-if="(create_form.isDraw === 1 && create_form.isEnable===1) || create_form.isEnable===0">
            <FormItem label="员工姓名" prop="name">
              <Input type="text" disabled @on-change="doChangeForm" v-model="create_form.name"></Input>
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col :span="6" v-if="create_form.isEnable ===0">
            <FormItem label="手机号">
              <Row :gutter="0">
                <Col :span="24">
                  <Input v-model="create_form.contactNumber" prop="contactNumber" @on-change="doChangeForm" :disabled="create_form.isEnable!==1"></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>
           <Col :span="6" v-if="create_form.isEnable !==0">
            <FormItem label="手机号">
              <Row :gutter="0">
                <Col :span="24">
                  <Input v-model="create_form.contactNumber" prop="contactNumber" @on-change="doChangeForm" :disabled="create_form.isEnable!==1" class="rule-star"></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem label="银行卡号">
              <Input type="text" :disabled="create_form.isEnable!==1" @on-change="doChangeForm" v-model="create_form.bankAccount"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="身份证号">
              <Input type="text" :disabled="create_form.isEnable!==1" @on-change="doChangeForm" v-model="create_form.idCardNum"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="电子邮箱">
              <Input type="text" :disabled="create_form.isEnable!==1" @on-change="doChangeForm" v-model="create_form.email"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
            <Col span="12">
             <FormItem label="描述">
              <Input  type="textarea" :maxlength="200" @on-change="doChangeForm" :disabled="create_form.isEnable!==1" v-model="create_form.remark" :autosize="{minRows: 5,maxRows: 5}" placeholder=""></Input>
            </FormItem>
            </Col>
        </Row>
      </Form>
    </div>
    <div>
      <!-- <CompanySelect title="选择归属公司" v-model="company_select_visible1" @select="handleSelectCompany"></CompanySelect> -->
      <CompanyChose title="选择部门" :model_ids2="model_ids2" v-model="company_select_visible2" @select="handleSelectCompany2"></CompanyChose>
  </div>
  <!-- 提示弹窗 -->
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="delete_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doDelete">确认</Button>
        <Button  @click="delete_visible = false">取消</Button>
        <!-- <Button  @click="delete_visible = false">取消</Button> -->
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
        <span>请确认是否要禁用当前数据，禁用后将无法使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisable">确认</Button>
        <Button  @click="handleCancelDisable">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disable_visible2"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>反禁用后，当前数据将能被使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="handleDisables">确认</Button>
        <Button  @click="handleCancelDisable">取消</Button>
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
        <Button type="primary" @click="handleSaveInfo">是</Button>
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
        <Button type="primary" @click="confirmcopy">是</Button>
        <Button @click="backdoDenycopy">否</Button>
        <Button @click="copycancle">取消</Button>
      </div>
    </Modal>
  </div>

</template>
<script>
// import CompanySelect from '_c/companySelectModal'
import CompanyChose from './companychose'
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
// import { Validation } from '@/libs/rule'
import RadioSelect from '_c/radio-select'
export default {
  name: 'update_employee',
  mixins: [saasMixin],
  data () {
    return {
      changed: false, // 判断页面内容有没有修改
      reminderModal: false,
      disable_visible: false,
      disable_visible2: false,
      companyFormId: 0,
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'employee_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      tableconfig: {
        type: 'department', // 单选类型,在columns.js 文件里定义好
        title: '选择部门',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: 'employee_index',
          isEnterpriseAdmin: 1,
          deptCodeOrDeptName: '',
          deptType: '',
          queryConditions: 1,
          isEnd: 1,
          isEnable: 1,
          companyIdList: []
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
      formList: [],
      // isEnable: 1,
      // 删除
      delete_visible: false,
      cancleboxModel: false,
      model_ids2: null,
      copyreplication: false,
      current_row: '',
      save_type: 0,
      save_typer: 0,
      // phone_type: '086',
      create_form: {
        id: '',
        code: '',
        version: '',
        isEnterpriseAdmin: 1,
        name: '',
        dept: '',
        idCardNum: '',
        email: '',
        remark: '',
        company: '',
        contactNumber: '',
        userCompany: '',
        codeType: '',
        deptId: '',
        companyId: '',
        useCompanyId: '',
        isEnable: '',
        bankAccount: ''
      },
      // form表达验证
      ruleValidate: {
        company: [
          { required: true, trigger: 'change' }
        ],
        code: [
          { required: true, trigger: 'change' }
        ],
        name: [
          { required: true, trigger: 'change' }
        ],
        dept: [
          { required: true, trigger: 'change' }
        ],
        contactNumber: [
          { required: true, trigger: 'change' }
        ],
        bankAccount: [
          { required: true, trigger: 'change' }
        ],
        idCardNum: [
          { required: true, trigger: 'change' }
        ]
        // email: [
        //   { validator: Validation.codeRule, trigger: 'change' }
        // ],
        // remark: [
        //   { validator: Validation.addressRule, trigger: 'change' }
        // ]
      },
      // create_form: {
      //   client_company: '上海餐易通公司',
      //   staff_name: '王小明',
      //   staff_num: 'EP001',
      //   client_name: '财务部',
      //   bank_card: '05151358410115',
      //   id_card: '',
      //   emails: '',
      //   phone_type: '086',
      //   client_phone: '15026584545',
      //   mask: ''
      // },
      company_select_visible1: false,
      company_select_visible2: false
    }
  },
  components: {
    CompanyChose,
    CommonIcon,
    RadioSelect
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    let _id = this.$route.query && this.$route.query.id
    this.getCurrentInfo(_id)
    this.getdeptchange()
  },
  methods: {
    // 取消弹窗
    confirmcanclebox () {
      this.getCurrentInfo(this.$route.query.id)
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    againreset () {
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.refresh = !this.table_config.refresh
      this.table_config.request_params.codeOrName = ''
    },
    doSearchCompany () {
      this.$set(this.table_config, 'refresh', !this.table_config.refresh)
    },
    // 全部形态的搜索
    doCompanyFormIdChange (val) {
      let params = val === 0 ? null : val
      this.table_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          console.log(res, '66')
          this.formList = res.data.data
        }
      })
    },
    getchange () {
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 保存并新增
    doSaveAdd (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.reminderModal = false
      this.save_type = type
      if (this.create_form.company === '') {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      // if (this.create_form.code !== '' && !/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
      //   this.$Message.warning('请填写正确员工编码')
      //   this.reminderModal = false
      //   return false
      // }
      if (this.create_form.name !== '' && !/^[\u4e00-\u9fffa-zA-Z]{1,20}$/.test(this.create_form.name)) {
        this.$Message.warning('请填写正确员工姓名')
        this.reminderModal = false
        return false
      }
      if (!this.create_form.deptId || !this.create_form.dept) {
        this.$Message.warning('请选择部门')
        this.reminderModal = false
        return false
      }
      if (!/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('请填写正确手机号')
        this.reminderModal = false
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('请输入正确的身份证号！')
        this.reminderModal = false
        return false
      }
      if (this.create_form.bankAccount !== '' && !/^(\d{16}|\d{19})$/.test(this.create_form.bankAccount)) {
        this.$Message.warning('请输入正确的卡号！')
        this.reminderModal = false
        return false
      }
      console.log(this.create_form)
      this.$request.post('/financeback/staff/updateStaffInfo', this.create_form).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('更新成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'create_employee'
            })
            this.doGetInit()
          }, 1000)
        } else {
          this.$Message.warning('更新失败！')
          this.save_typer = 0
          this.save_type = 0
          this.disable_visible = false
        }
      })
    },
    // 复制保存
    copyPreservation (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.reminderModal = false
      this.save_type = type
      if (this.create_form.company === '') {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      if (this.create_form.code !== '' && !/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
        this.$Message.warning('请填写正确员工编码')
        this.reminderModal = false
        return false
      }
      if (this.create_form.name !== '' && !/^[\u4e00-\u9fffa-zA-Z]{1,20}$/.test(this.create_form.name)) {
        this.$Message.warning('请填写正确员工姓名')
        this.reminderModal = false
        return false
      }
      if (!this.create_form.deptId) {
        this.$Message.warning('请选择部门')
        this.reminderModal = false
        return false
      }
      if (!/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('请填写正确手机号码')
        this.reminderModal = false
        return false
      }
      if (this.create_form.idCardNum) {
        if (!/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
          this.$Message.warning('请输入正确的身份证号！')
          this.reminderModal = false
          return false
        }
      }
      if (this.create_form.bankAccount) {
        if (!/^(\d{16}|\d{19})$/.test(this.create_form.bankAccount)) {
          this.$Message.warning('请输入正确的卡号！')
          this.reminderModal = false
          return false
        }
      }
      let reqed = {
        isEnterpriseAdmin: 1,
        companyId: this.create_form.companyId,
        id: this.create_form.id,
        name: this.create_form.name,
        deptId: this.create_form.deptId,
        dept: this.create_form.dept,
        contactNumber: this.create_form.contactNumber,
        email: this.create_form.email,
        bankAccount: this.create_form.bankAccount,
        remark: this.create_form.remark,
        idCardNum: this.create_form.idCardNum,
        codeType: this.create_form.codeType,
        attrBusinessUnitId: this.create_form.attrBusinessUnitId,
        businessUnitId: this.create_form.businessUnitId,
        useCompanyId: this.create_form.useCompanyId,
        useCompanyName: this.create_form.useCompanyName,
        updateTime: this.create_form.updateTime,
        version: this.create_form.version
      }
      console.log(this.create_form)
      this.$request.post('/financeback/staff/updateStaffInfo', reqed).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'create_employee',
              query: {
                params: this.$route.query.params,
                id: this.$route.query.id
              }
            })
            // this.doGetInit()
          }, 1000)
        } else {
          this.$Message.warning('更新失败！')
          this.save_typer = 0
          this.save_type = 0
          this.disable_visible = false
        }
      })
    },
    // 是
    confirmcopy (name, type) {
      this.copyreplication = false
      this.copyPreservation()
    },
    // 否
    backdoDenycopy () {
      this.copyreplication = false
      this.$router.push({
        name: 'create_department',
        query: {
          params: this.$route.query.params,
          id: this.$route.query.id
        }
      })
      // this.getCurrentInfo()
      this.changed = false
    },
    // 取消
    copycancle () {
      this.copyreplication = false
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    handleInitInfo () {
      let _path = this.$route.path
      this.$router.push({
        path: _path,
        query: { id: this.current_row.id }
      })
      this.isEnable = this.current_row.isEnable
      // this.model_ids2 = this.current_row.companyId
      for (let key in this.create_form) {
        this.create_form[key] = this.current_row[key]
        console.log(this.create_form)
      }
    },
    // 初始化
    getCurrentInfo (id) {
      this.$request.post('financeback/staff/findStaffById', {
        id
      }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data) {
            this.current_row = res.data.data
            this.create_form = res.data.data
            this.tableconfig.request_params.companyIdList = []
            this.tableconfig.request_params.companyIdList.push(this.create_form.companyId)
            // console.log(this.current_row)
            // console.log(res)
            this.handleInitInfo()
          } else {
            this.current_row = ''
          }
        } else {
          this.current_row = ''
        }
      })
    },
    // 跟新提示判断
    handleSaveInfo (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.reminderModal = false
      this.save_type = type
      if (this.create_form.company === '') {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      if (!this.create_form.deptId || !this.create_form.dept) {
        this.$Message.warning('请选择部门')
        this.reminderModal = false
        return false
      }
      // if (this.create_form.code !== '' && !/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
      //   this.$Message.warning('请填写正确员工编码')
      //   this.reminderModal = false
      //   return false
      // }
      if (this.create_form.name !== '' && !/^[\u4e00-\u9fffa-zA-Z]{1,20}$/.test(this.create_form.name)) {
        this.$Message.warning('请填写正确员工姓名')
        this.reminderModal = false
        return false
      }
      if (!/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('请填写正确手机号')
        this.reminderModal = false
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('请输入正确的身份证号！')
        this.reminderModal = false
        return false
      }
      if (this.create_form.bankAccount !== '' && !/^(\d{16}|\d{19})$/.test(this.create_form.bankAccount)) {
        this.$Message.warning('请输入正确的卡号！')
        this.reminderModal = false
        return false
      }
      console.log(this.create_form)
      let req = {
        isEnterpriseAdmin: 1,
        companyId: this.create_form.companyId,
        id: this.create_form.id,
        name: this.create_form.name,
        deptId: this.create_form.deptId,
        contactNumber: this.create_form.contactNumber,
        email: this.create_form.email,
        bankAccount: this.create_form.bankAccount,
        remark: this.create_form.remark,
        idCardNum: this.create_form.idCardNum,
        codeType: this.create_form.codeType,
        attrBusinessUnitId: this.create_form.attrBusinessUnitId,
        businessUnitId: this.create_form.businessUnitId,
        useCompanyId: this.create_form.useCompanyId,
        useCompanyName: this.create_form.useCompanyName,
        updateTime: this.create_form.updateTime,
        version: this.create_form.version
      }
      this.$request.post('/financeback/staff/updateStaffInfo', req).then(res => {
        if (res.data.code === 200) {
          if (this.save_type || this.save_typer === 2) {
            this.$Message.success('更新成功！')
            this.save_typer = 0
            this.save_type = 0
            this.changed = false
            this.reminderModal = false
          } else if (this.save_typer === 1) {
            this.$Message.success('更新成功！')
            this.reminderModal = false
            this.$router.push({ path: 'employee_create' })
          } else {
            this.$Message.success('更新成功！')
            this.changed = false
            this.reminderModal = false
            this.doContinueActions()
          }
        } else {
          this.$Message.warning('更新失败！')
          this.save_typer = 0
          this.save_type = 0
          this.disable_visible = false
        }
      })
    },
    // 删除
    handleConfirmDel () {
      let that = this
      if (that.changed) {
        that.$Control({
          title: '消息提示',
          type: 'control',
          message: '当前数据已修改，需要保存吗？',
          yes () {
            that.handleSaveInfo()
            that.$CloseCtl()
            that.delete_visible = true
          },
          no () {
            that.$CloseCtl()
            that.handleInitInfo()
            that.changed = false
            that.delete_visible = true
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        that.delete_visible = true
      }
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        yes () {
          that.handleSaveInfo()
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
    handleConfirmCancel () {
      // this.doContinueActions()
      this.changed = true
      if (this.save_typer === 1) {
        this.reminderModal = false
        this.$router.push({ path: 'employee_create' })
      } else if (this.save_type || this.save_typer === 2) {
        this.reminderModal = false
        this.handleInitInfo()
        this.save_type = 0
        this.save_typer = 0
      } else {
        this.doContinueActions()
      }
    },
    Showcomp () {
      this.company_select_visible1 = true
    },
    Showdept () {
      this.company_select_visible2 = true
    },
    handDisable () {
      // let _result = this.handleCheckEdit()
      // if (this.changed) {
      //   this.save_type = 2
      //   this.reminderModal = true
      //   // this.handleSaveInfo(2)
      //   this.disable_visible = true
      // } else {
      this.disable_visible = true
      // }
    },
    // jinyong
    handleDisable () {
      let ids = []
      ids.push(this.current_row.id)
      let versioned = []
      versioned.push(this.current_row.version)
      let req = {
        ids,
        versions: versioned,
        isEnterpriseAdmin: 1
      }
      console.log(req)
      this.doContinueActions()
      this.$request.post('/financeback/staff/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.getCurrentInfo(this.$route.query.id)
          if (res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            this.edit_visible = false
            return false
          } else {
            this.$Message.success('禁用成功！')
            this.create_form.isEnable = this.create_form.isEnable === 1 ? 0 : 1
          }
          // this.$Message.success('禁用成功！')
          this.disable_visible = false
        } else {
          this.$Message.warning('禁用失败！')
        }
      })
    },
    handleDisables () {
      let ids = []
      ids.push(this.current_row.id)
      let versions = []
      versions.push(this.current_row.version)
      this.doContinueActions()
      this.$request.post('/financeback/staff/enableBatch', {
        ids,
        versions,
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            this.edit_visible = false
            return false
          } else {
            this.$Message.success('反禁用成功！')
          }
          // this.$Message.success('反禁用成功！')
          this.disable_visible2 = false
          this.create_form.isEnable = this.create_form.isEnable === 1 ? 0 : 1
        } else {
          this.$Message.warning('反禁用失败！')
        }
      })
    },
    handleCancelDisable () {
      this.current_selection_row = []
      this.disable_ids = []
      this.disable_type = ''
      this.disable_visible = false
      this.disable_visible2 = false
    },
    // 翻页
    handlePageLocation (type) {
      switch (type) {
        case 'first':
          let _first = this.doFindPage(1, this.current_row.id)
          if (_first === '当前为首条') {
            return false
          }
          this.getCurrentInfo(_first)
          break
        case 'prev':
          let _prev = this.doFindPage(2, this.current_row.id)
          if (_prev === '当前为首条') {
            return false
          }
          this.getCurrentInfo(_prev)
          break
        case 'next':
          let _next = this.doFindPage(3, this.current_row.id)
          if (_next === '当前为末条') {
            return false
          }
          this.getCurrentInfo(_next)
          break
        case 'last':
          let _last = this.doFindPage(4, this.current_row.id)
          if (_last === '当前为末条') {
            return false
          }
          this.getCurrentInfo(_last)
          break
      }
    },
    // 删除
    doDelete () {
      let ids = []
      ids.push(this.current_row.id)
      let versions = []
      versions.push(this.current_row.version)
      this.doContinueActions()
      this.$request.post('/financeback/staff/deleteBatch', { ids, versions, isEnterpriseAdmin: 1 }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            this.edit_visible = false
            return false
          } else {
            this.$Message.success('删除成功！')
          }
          // this.$Message.success('删除成功！')
          this.delete_visible = false
          this.handleDelSkip()
        } else {
          this.$Message.warning('删除失败！')
        }
      })
    },
    // 删除后跳转
    handleDelSkip () {
      let _prev = this.doFindPage(2, this.current_row.id)
      if (_prev === '当前为首条') {
        let _next = this.doFindPage(3, this.current_row.id)
        if (_next === '当前为末条') {
          return false
        } else if (_next === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          let _name = this.$route.name === 'employee_index'
          setTimeout(() => {
            this.$router.push({ name: _name })
            // this.closeTag({ name: _name })
          }, 3000)
        }
        this.getCurrentInfo(_next)
      } else {
        this.getCurrentInfo(_prev)
      }
    },
    // 跳转新增页
    handleAddForm () {
      if (this.changed) {
        this.save_typer = 1
        // this.reminderModal = true
        this.copyreplication = true
      } else {
        this.$router.push({ path: 'employee_create' })
      }
    },
    // 判断表单是否有改动
    handleUpdateInfo () {
      // let _result = this.handleCheckEdit()
      if (this.changed) {
        this.cancleboxModel = true
      }
    },
    backreset () {
      this.tableconfig.request_params.isEnable = ''
      this.tableconfig.request_params.deptType = ''
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    doResetAuxiliaryConfig () {
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    handleSelectCompany2 (data, row) {
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.changed = true
      if (data) {
        this.changed = true
        this.create_form.deptId = data.id
        this.create_form.dept = data.name
      }
      if (row) {
        console.log(row)
        this.create_form.attrBusinessUnitId = row.attrBusinessUnitId
        this.create_form.useCompanyId = row.useCompanyId
        this.create_form.businessUnitId = row.businessUnitId
      }
    },
    // 确定选择归属公司
    handleGetData (data) {
      if (this.create_form.dept) {
        this.create_form.dept = null
      }
      // console.log(data, '66')
      this.create_form.company = data.name
      this.create_form.companyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      console.log(data, '进来了')
      this.tableconfig.request_params.companyIdList = []
      this.tableconfig.request_params.companyIdList.push(data.id)
    },
    // 复制按钮
    copyproject () {
      if (this.changed) {
        this.copyreplication = true
      } else {
        this.$router.push({
          name: 'create_employee',
          query: {
            params: this.$route.query.params,
            id: this.$route.query.id
          }
        })
      }
    },
    handleCheckEdit () {
      let _obj = {}
      for (let key in this.create_form) {
        _obj[key] = this.current_row[key]
      }
      return JSON.stringify(_obj) === JSON.stringify(this.create_form)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
  .update-employee {
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
    .input_icon {
      position: absolute;
      right: 5px;
      top: 6px;
      color: #808695;
    }
    .main-container {
      width: 1700px;
      position: relative;
      padding: 10px 10px;
      .rule-star::after {
         content: '*';
        display: inline-block;
        position: absolute;
        top: 10px;
        right: -15px;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed4014;
        visibility: visible;
      }
    }
  }
</style>
<style lang="less">
.update-employee{
  .resset {
  margin-left: 12px;
  }
  .ivu-btn-icon-only {
      padding: 2.6px 13px;
      margin-left: -10px;
    }
  .ivu-icon-md-more:before {
    content: "\F3E7";
    color: #999;
    font-size: 20px;
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

.form_init .ivu-form-item .ivu-form-item-content .ivu-input, .form_init .ivu-form-item .ivu-form-item-content .ivu-select {
     max-width: 745px;
}

.ivu-form-item-error-tip {
      display: none;
    }
}

</style>
