<template>
  <section class="creare_department">
    <section class="page-header">
      <div class="page-header-name">新增部门</div>
      <div class="page-header-actions">
        <i-button type="primary" @click="handleSaveInfo(1)">保存</i-button>
        <i-button @click="handleSaveInfo(2)">保存并新增</i-button>
        <i-button @click="handleCancelSave">取消</i-button>
        <Button @click="doLocationDetail('department_index')">列表</Button>
        </div>
    </section>
     <div class="container form_init">
        <Form ref="formValidates" :model="formValidate" :label-width="120" :rules="ruleValidate">
         <Row>
        <Col span="6">
        <FormItem label="创建公司" prop="companyName" class="rule-stars1">
            <!-- <CompanyRadioSelect v-model="formValidate.companyName" @getCompany="handleSelectCompany"></CompanyRadioSelect> -->
            <RadioSelect :config="table_config" v-model="formValidate.companyName" :reset="table_config.refresh" @getData="handleGetData" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="4">
                      <Select v-model="companyFormId"  @on-change="doCompanyFormIdChange">
                        <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input class="search-button" clearable  v-model="table_config.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
                             @on-search="table_config.refresh = !table_config.refresh">
                        <Button slot="append" icon="ios-search" @click="table_config.refresh = !table_config.refresh"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="againreset">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill">
        <FormItem label="创建公司业务单元" class="rule-stars1" prop="attrBusinessUnitName">
            <!-- <Input v-model="formValidate.attrBusinessUnitName" readonly icon="md-more" @on-click="company_select_visible2 = true"  @on-change="doChangeForm"></Input> -->
            <RadioSelect :config="tableconfigabus" v-model="formValidate.attrBusinessUnitName" :reset="tableconfigabus.refresh" @getData="handleSelectCompany2" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="unitFormId" @on-change="doChangeobject">
                        <Option v-for="item in typelisted" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input autocomplete="on" clearable type="text" v-model="tableconfigabus.request_params.codeOrName" placeholder="业务单元编码或名称" search enter-button
                             @on-search="tableconfigabus.refresh = !tableconfigabus.refresh">
                        <Button slot="append" icon="ios-search" @click="tableconfigabus.refresh = !tableconfigabus.refresh"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="againobject">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
        </FormItem>
        </Col>
        </Row>
         <Row>
        <Col span="6" >
        <FormItem label="使用公司" prop="useCompanyName" class="rule-stars1">
          <!-- <FormItem label="使用公司" prop="useCompanyName" class="rule-stars"> -->
            <RadioSelect :config="tableconfig" disabled v-model="formValidate.useCompanyName" :reset="tableconfig.refresh" @getData="handleSelectCompany4" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select v-model="tableconfig.request_params.companyFormId">
                        <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input autocomplete="on" clearable type="text" v-model="tableconfig.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
                             @on-search="tableconfig.refresh = !tableconfig.refresh">
                        <Button slot="append" icon="ios-search" @click="tableconfig.refresh = !tableconfig.refresh"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="tableconfig.refresh = !tableconfig.refresh">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
            <!-- <CompanyRadioSelect v-model="formValidate.companyName" @getCompany="handleSelectCompany4"></CompanyRadioSelect> -->
            <!-- <Input v-model="formValidate.useCompanyName" readonly icon="md-more" @on-change="doChangeForm" @on-click="company_select_visible4 = true"></Input> -->
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill">
        <FormItem label="使用公司业务单元"  class="rule-stars1" prop="businessUnitName">
            <!-- <Input v-model="formValidate.businessUnitName" readonly icon="md-more" @on-change="doChangeForm" @on-click="company_select_visible5 = true"></Input> -->
            <RadioSelect :config="tableconfigbus" disabled v-model="formValidate.businessUnitName" :reset="tableconfigbus.refresh" @getData="handleSelectCompany5" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select v-model="tableconfigbus.request_params.companyFormId">
                        <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input autocomplete="on" clearable type="text" v-model="tableconfigbus.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
                             @on-search="tableconfigbus.refresh = !tableconfigbus.refresh">
                        <Button slot="append" icon="ios-search" @click="tableconfigbus.refresh = !tableconfigbus.refresh"></Button>
                      </Input>
                    </Col>
                    <Col span="4">
                      <Button style="position: relative;top: 2px" @click="tableconfigbus.refresh = !tableconfigbus.refresh">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
        </FormItem>
        </Col>
        </Row>
        <Row>
        <Col span="6" >
        <FormItem label="编码" prop="code">
            <Input v-model="formValidate.code" placeholder="系统编码" disabled></Input>
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill">
        <FormItem label="名称" prop="name" class="rule-stars1">
            <Input v-model="formValidate.name" @on-change="doChangeForm" :maxlength="50"></Input>
        </FormItem>
        </Col>

       </Row>
        <Row>
          <Col span="6" >
        <FormItem label="属性">
           <Select v-model="formValidate.deptType" placeholder="全部属性" :label-in-value="true"  @on-change="doAcctypeChange">
           <Option v-for="(item,index) in deptylist" :value="item.id" :key="index">{{item.name}}</Option>
         </Select>
            <!-- <Input v-model="formValidate.deptTypeName" @on-change="doChangeForm" placeholder="管理部门" icon="md-more" @on-click="company_select_visible3= true"></Input> -->
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill">
        <FormItem label="上级部门">
          <RadioSelect :config="tableconfigdept" :reset='tableconfigdept.refresh' :disabled="!formValidate.companyName" v-model="formValidate.parentName" @getData="handleSelectCompany8" @on-change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4" class="topdeep">
                      <Select v-model="tableconfigdept.request_params.deptType" @on-change="getchange" clearable placeholder="全部属性">
                        <Option v-for="(item,name) in deptylist" :value="item.id" :key="name">{{item.name}}</Option>
                      </Select>
                    </Col>
                    <!-- <Col span="8">
                      <Input autocomplete="on" clearable type="text" v-model="tableconfig.request_params.codeOrName" placeholder="部门编码/部门名称" search enter-button
                             @on-search="tableconfig.refresh = !tableconfig.refresh">
                        <Button slot="append" icon="ios-search" @click="tableconfig.refresh = !tableconfig.refresh"></Button>
                      </Input>
                    </Col> -->
                    <Col span="8">
                      <Input v-model="tableconfigdept.request_params.codeOrName"  placeholder="部门编码/部门名称" clearable enter-button  @on-clear="tableconfigdept.refresh = !tableconfigdept.refresh"  @on-search="tableconfigdept.refresh = !tableconfigdept.refresh"></Input>
                    </Col>
                    <Col span="1">
                      <Button  icon="ios-search" @click="tableconfigdept.refresh = !tableconfigdept.refresh"></Button>
                    </Col>
                    <Col span="4">
                      <Button  class="resset" @click="topdeptrefresh">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
            <!-- <Input v-model="formValidate.name" @on-change="doChangeForm" :maxlength="50"></Input> -->
        </FormItem>
        </Col>
        </Row>
        <Row>
          <Col span="13">
        <FormItem label="描述" prop="remark">
             <Input v-model="formValidate.remark" @on-change="doChangeForm" :maxlength="200" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder=""></Input>
        </FormItem>
          </Col>
         </Row>
         </Form>
    </div>
    <div>
      <!-- <CompanySelect title="选择归属公司" v-model="company_select_visible1" @select="handleSelectCompany"></CompanySelect> -->
      <!-- <UsercompanyModels title="选择使用公司" v-model="company_select_visible4" @select="handleSelectCompany4"></UsercompanyModels> -->
      <!-- <BusinessUnitModel title="选择业务单元" v-model="company_select_visible2" :model_ids="model_ids" @select="handleSelectCompany2"></BusinessUnitModel> -->
      <!-- <BusinessUNitModels title="选择业务单元" v-model="company_select_visible5" :model_ids2="model_ids2" @select="handleSelectCompany5"></BusinessUNitModels>
      <UsercompanyModel title="选择属性" v-model="company_select_visible3" @select="handleSelectCompany3"></UsercompanyModel> -->
    </div>
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
        <Button type="primary" @click="handleSaveInfo">是</Button>
        <Button  @click="handleConfirmCancel">否</Button>
        <Button  @click="reminderModal = false">取消</Button>
      </div>
    </Modal>
  </section>
</template>

<script>
// import CompanySelect from '_c/companySelectModal'
// import BusinessUnitModel from './ChoseModel/BusinessUnitModel'
import RadioSelect from '_c/radio-select'
// import BusinessUNitModels from './ChoseModel/BusinessUNitModels'
// import UsercompanyModel from './ChoseModel/UsercompanyModel'
// import UsercompanyModels from './ChoseModel/UsercompanyModels'
// import CompanyRadioSelect from '_c/company-radio-select'
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { Validation } from '@/libs/rule'
import { mapMutations } from 'vuex'
export default {
  name: 'create_department',
  mixins: [saasMixin],
  data () {
    return {
      reminderModal: false,
      cancleboxModel: false,
      changed: false, // 判断页面内容有没有修改
      disable_visible: false,
      disable_visible2: false,
      isEnable: 1,
      companyFormId: 0,
      // type_list: [],
      // 删除
      delete_visible: false,
      deptylist: [],
      current_row: '',
      model_ids: 0,
      unitFormId: 0,
      model_ids2: 0,
      phone_type: '086',
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      tableconfig: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择使用公司',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      tableconfigabus: {
        type: 'attrBusiness', // 单选类型,在columns.js 文件里定义好
        title: '选择创建公司业务单元',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          unitFormId: null,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          companyIdList: [],
          codeOrName: ''
        }
      },
      tableconfigbus: {
        type: 'attrBusiness', // 单选类型,在columns.js 文件里定义好
        title: '选择使用公司业务单元',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          companyIdList: [],
          codeOrName: ''
        }
      },
      tableconfigdept: {
        type: 'parentdept', // 单选类型,在columns.js 文件里定义好
        title: '选择上级部门',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          codeOrName: '',
          companyId: '',
          deptType: '',
          isEnable: 1,
          companyIdList: []
        }
      },
      formValidate: {
        code: '',
        name: '',
        deptTypeName: '', // 属性名
        deptType: '',
        useCompanyName: '',
        remark: '',
        contactNumber: '',
        userCompany: '',
        bankAccount: '',
        isEnterpriseAdmin: 1,
        parentName: '',
        companyId: '0',
        companyName: '',
        useCompanyId: '',
        BusinessUnit: '',
        attrBusinessUnitId: '', // 归属公司业务单元id、
        attrBusinessUnitName: '', // 归属公司名称
        prarentId: '', // 上级部门id
        deptLevel: '', // 部门等级
        businessUnitId: '', // 使用公司业务单元id
        businessUnitName: '',
        codeType: '0'
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
      // form表达验证
      ruleValidate: {
        companyName: [
          { required: true, trigger: 'change' }
        ],
        attrBusinessUnitName: [
          { required: true, trigger: 'change' }
        ],
        useCompanyName: [
          { required: true, trigger: 'change' }
        ],
        // businessUnitName: [
        //   { required: true, trigger: 'change' }
        // ],
        name: [
          { required: true, trigger: 'change' }
        ],
        deptTypeName: [
          { required: true, trigger: 'change' }
        ],
        // code: [
        //   { validator: Validation.codeRule, trigger: 'blur' }
        // ]
        remark: [
          { validator: Validation.addressRule, trigger: 'blur' }
        ]
      },
      disable_type: '',
      // formValidate: {
      //   attributioncompany: '', // 归属公司
      //   BusinessUnit: '', // 业务单元
      //   Itemcoding: '', // 部门编码
      //   spandcompany: '',
      //   designation: '',
      //   attribute: '', // 属性
      //   remark: ''
      // },
      moreValues: false,
      company_select_visible1: false,
      company_select_visible2: false,
      company_select_visible3: false,
      company_select_visible4: false,
      company_select_visible5: false
    }
  },
  components: {
    // CompanySelect,
    CommonIcon,
    // BusinessUnitModel,
    // UsercompanyModel,
    // BusinessUNitModels,
    // CompanyRadioSelect,
    // UsercompanyModels,
    RadioSelect
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  created () {
    this.doGetInited()
    this.getCurrentcopy()
    this.subordinates()
    // this.reminderModal = false
  },
  mounted () {
    this.getdeptchange()
  },
  methods: {
    // 取消弹窗
    confirmcanclebox () {
      this.handleConfirmCancel()
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    // 下级带过来的
    subordinates () {
      console.log(this.$route.query.name, '带过来name')
      this.formValidate.parentName = this.$route.query.name
      this.formValidate.prarentId = this.$route.query.ids
    },
    // 上级部门重置
    topdeptrefresh () {
      this.tableconfigdept.request_params.deptType = ''
      this.tableconfigdept.request_params.codeOrName = ''
      this.tableconfigdept.refresh = !this.tableconfigdept.refresh
    },
    getchange () {
      this.tableconfigdept.refresh = !this.tableconfigdept.refresh
    },
    doChangeobject (val) {
      let params = val === 0 ? null : val
      this.tableconfigabus.request_params.unitFormId = params
      this.doSearchobject()
    },
    doSearchobject () {
      this.$set(this.tableconfigabus, 'refresh', !this.tableconfigabus.refresh)
    },
    againobject () {
      this.unitFormId = 0
      this.tableconfigabus.request_params.unitFormId = null
      this.tableconfigabus.refresh = !this.tableconfigabus.refresh
      this.tableconfigabus.request_params.codeOrName = ''
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
    againreset () {
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.refresh = !this.table_config.refresh
      this.table_config.request_params.codeOrName = ''
    },
    doAcctypeChange (val) {
      if (!val) { return }
      this.changed = true
      this.formValidate.deptTypeName = val.label
      this.formValidate.deptType = val.value
    },
    // 初始化-查看页面过来的
    getCurrentcopy (id) {
      // console.log(this.$route.query.id, '10')
      // this.params = JSON.parse(this.$route.query.params)
      if (this.$route.query.id) {
        let req = {
          id: this.$route.query.id,
          isEnterpriseAdmin: 1
        }
        this.loading = true
        this.$request.post('/financeback/dept/findDeptById', req).then(res => {
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
            this.current_row = res.data.data
            // this.formValidate.parentdept = this.$route.query.name
            this.current_row.code = ''
            this.current_row.name = ''
          }
        })
      }
      this.changed = false
    },
    ...mapMutations([
      'addIdToList'
    ]),
    // 初始化
    doGetInited (id) {
      // console.log(this.$route.query.id, '88')
      // this.params = JSON.parse(this.$route.query.params)
      if (this.$route.query.id) {
        let req = {
          id: this.$route.query.id,
          isEnterpriseAdmin: 1
        }
        this.loading = true
        this.$request.post('/financeback/dept/findDeptById', req).then(res => {
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
            this.formValidate = res.data.data
            this.formValidate.code = ''
            this.formValidate.name = ''
          }
        })
      }
      this.changed = false
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    // 确定选择归属公司
    handleGetData (data) {
      this.changed = true
      this.formValidate.attrBusinessUnitName = null
      this.formValidate.companyName = data.name
      this.formValidate.companyId = data.id
      this.formValidate.useCompanyName = data.name
      this.formValidate.useCompanyId = data.id
      this.tableconfigdept.request_params.companyId = data.id
      console.log(this.tableconfigdept.request_params.companyId, '0000')
      this.tableconfigabus.request_params.companyIdList = []
      this.tableconfigabus.request_params.companyIdList.push(data.id)
      console.log(this.tableconfigabus.request_params.companyIdList, '098022')
      if (!data.name || !data.id) {
        return false
      }
    },
    // 选择业务单元
    handleSelectCompany2 (data) {
      this.changed = true
      this.formValidate.attrBusinessUnitId = data.id
      this.formValidate.attrBusinessUnitName = data.name
      this.formValidate.businessUnitId = data.id
      this.formValidate.businessUnitName = data.name
      this.tableconfigabus.request_params.companyIdList = []
    },
    // 上级部门
    handleSelectCompany8 (row) {
      this.changed = true
      this.formValidate.prarentName = row.name
      this.formValidate.prarentId = row.id
      this.formValidate.prarentLevel = row.prarentLevel
      this.formValidate.prarentCode = row.prarentCode
      // this.formValidate.parentName = data.prarentLevel
      // this.formValidate.prarentCode = data.prarentCode
    },
    // 选择属性
    // handleSelectCompany3 (row) {
    //   if (row) {
    //     this.formValidate.deptType = row.id
    //     this.formValidate.deptTypeName = row.name
    //   }
    //   this.company_select_visible3 = false
    //   this.changed = true
    // },
    // 选择使用公司
    handleSelectCompany4 (data, item) {
      this.formValidate.useCompanyName = data.name
      this.formValidate.useCompanyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      this.tableconfigbus.request_params.companyIdList = []
      this.tableconfigbus.request_params.companyIdList.push(data.id)
      // console.log(data.id)
      // this.table_configabus.request_params.companyIdList = this.table_configabus.request_params.companyIdList.splice(0, 1, this.formValidate.companyId)
      // console.log(this.table_configabus.request_params.companyIdList)
    },
    handleSelectCompany5 (data) {
      this.formValidate.businessUnitId = data.id
      this.formValidate.businessUnitName = data.name
    },
    // jinyong
    handleDisable () {
      let idList = []
      idList.push(this.current_row.id)
      let req = {
        idList
      }
      console.log(req)
      this.$request.post('/financeback/dept/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('操作成功！')
          this.disable_visible = false
          this.isEnable = this.isEnable === 1 ? 0 : 1
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    handleSaveInfo (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.reminderModal = false
      this.save_type = type
      if (!this.formValidate.companyName) {
        this.$Message.warning('请选择创建公司')
        return false
      }
      if (!this.formValidate.attrBusinessUnitName) {
        this.$Message.warning('请选择创建公司业务单元')
        return false
      }
      // if (!this.formValidate.useCompanyId) {
      //   this.$Message.warning('请选择使用公司')
      //   return false
      // }
      // if (!this.formValidate.businessUnitName) {
      //   this.$Message.warning('请选择使用公司业务单元')
      //   return false
      // }
      if (this.formValidate.name === '') {
        this.$Message.warning('请填写名称')
        return false
      }
      if (this.formValidate.name !== '' && !/^[\u4e00-\u9fffa-zA-Z0-9]{1,50}$/.test(this.formValidate.name)) {
        this.$Message.warning('名称不能使用空格，特殊字符或超过50字符')
        return false
      }
      // if (!this.formValidate.deptType) {
      //   this.$Message.warning('请选择属性')
      //   return false
      // }
      // console.log(this.formValidate)
      let req = {
        isEnterpriseAdmin: 1,
        companyId: this.formValidate.companyId,
        id: this.formValidate.id,
        name: this.formValidate.name,
        deptType: this.formValidate.deptType,
        attrBusinessUnitId: this.formValidate.attrBusinessUnitId,
        deptTypeName: this.formValidate.deptTypeName,
        remark: this.formValidate.remark,
        version: this.formValidate.version,
        prarentId: this.formValidate.prarentId,
        attrBusinessUnitName: this.formValidate.attrBusinessUnitName,
        businessUnitName: this.formValidate.businessUnitName,
        code: this.formValidate.code,
        useCompanyId: this.formValidate.useCompanyId,
        useCompanyName: this.formValidate.useCompanyName,
        codeType: this.formValidate.codeType,
        businessUnitId: this.formValidate.businessUnitId
      }
      this.$request.post('/financeback/dept/addDept', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          // console.log('1', res)
          if (this.save_type === 1) {
            console.log('334')
            this.addIdToList({ id: res.data.data, name: 'department' })
            this.$router.push({ name: 'update_department', query: { id: res.data.data } })
          } else if (this.save_type === 2) {
            console.log('566')
            this.$refs.formValidates.resetFields()
            this.changed = false
            this.handleResetForm()
          } else {
            this.doContinueActions()
          }
          this.reminderModal = false
        } else {
          this.$Message.warning('保存失败！')
          this.reminderModal = false
        }
      })
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
    // 重置
    handleResetForm () {
      // console.log('2333')
      this.formValidate = {
        code: '',
        name: '',
        deptTypeName: this.deptylist[0].name,
        deptType: this.deptylist[0].id,
        useCompanyName: '',
        remark: '',
        contactNumber: '',
        userCompany: '',
        bankAccount: '',
        useCompanyId: '',
        companyId: '0',
        companyName: '',
        BusinessUnit: '',
        isEnterpriseAdmin: 1,
        attrBusinessUnitId: '', // 归属公司业务单元id、
        attrBusinessUnitName: '', // 归属公司名称
        prarentId: '', // 上级部门id
        deptLevel: '', // 部门等级
        businessUnitId: '', // 使用公司业务单元id
        businessUnitName: '',
        codeType: '0'
      }
      this.$refs.formValidates.resetFields()
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          this.deptylist = res.data.data
          this.formValidate.deptTypeName = this.deptylist[0].name
          this.formValidate.deptType = this.deptylist[0].id
          console.log(this.formValidate.deptTypeName, '00011')
          console.log(this.formValidate.deptType, '00011')
        }
      })
    },
    // 取消保存
    // handleCancelSave () {
    //   if (JSON.stringify(this.formValidate) !== this.compare_form) {
    //     this.reminderModal = true
    //   } else {
    //     this.handleConfirmCancel()
    //   }
    // },
    handleCancelSave () {
      if (this.changed) {
        this.cancleboxModel = true
      }
    },
    handleConfirmCancel () {
      this.handleResetForm()
      this.doContinueActions()
      this.changed = true
      this.reminderModal = false
    },
    docancle () {
      this.moreValues = false
    },
    oldchanges () {
      this.moreValues = true
    },
    // 判断表单是否有改动
    handleUpdateInfo () {
      let _result = this.handleCheckEdit()
      if (!_result) {
        this.reminderModal = true
      }
    },
    handleCheckEdit () {
      let _obj = {}
      for (let key in this.formValidate) {
        _obj[key] = this.current_row[key]
      }
      return JSON.stringify(_obj) === JSON.stringify(this.formValidate)
    }
  }
}
</script>
<style lang="less">
.creare_department{
    .ivu-input-icon {
    width: 32px;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    text-align: center;
    color: #808695;
    position: absolute;
    left: 160px;
    z-index: 9;
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
  .ivu-input-wrapper {
    width: 101%;
  }
  .ivu-icon-md-more:before {
    content: "\F3E7";
    color: #999;
    font-size: 20px;
  }
//
  .form_init .ivu-form-item .ivu-form-item-content .ivu-input, .form_init .ivu-form-item .ivu-form-item-content .ivu-select {
     max-width: 754px;
  }
  .ivu-form-item-error-tip {
      display: none;
  }
}

</style>

<style lang="less" scoped>
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
@import '../../../../assets/css/forminit.less';
.creare_department {
  .doublekill {
    margin-left:30px;
  }
  .form_init{
  margin: 20px;
}
.container {
  width: 1700px;
  position: relative;
  padding: 10px 10px;
}
.more-modal {
  position: absolute;
  left: 8px;
  .ivu-modal {
    position: absolute;
    top: 0;
    width: 100% !important;
    .ivu-modal-content {
      border-radius: 0;
    }
  }
  .ivu-modal-header {
    border: none;
    margin: 0;
    padding: 0;
    .more-modal-header {
      height: 50px;
      line-height: 50px;
      text-indent: 16px;
      font-size: 16px;
      color: #696969;
      border: none;
    }
  }
  .ivu-modal-body {
    margin: 0;
    padding: 0;
    .more-modal-content {
      width: 100%;
      height: 450px;
      // border: 1px solid red;
      margin: 0;
      position: relative;
      .more-modal-content-table {
        width: calc(100% - 32px);
        margin: 0 auto;
        height: 400px;
        overflow: auto;
      }
      .startdate {
        width: 306px
      }
      .more-modal-content-table::-webkit-scrollbar {
        width: 5px;
        background: #ffffff;
      }
      .more-modal-content-table::-webkit-scrollbar-thumb {
        width: 5px;
        background: #a6a6a6;
        border-radius: 2.5px;
      }
      // .more-modal-content-page {
      //   position: relative;
      // }
    }
  }
  .ivu-modal-footer {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 60px;
    text-align: right;
    // border: 1px solid red;
    .more-modal-comfirm {
      outline: none;
      border: none;
      width: 56px;
      height: 32px;
      color: #eef8f7;
      font-size: 12px;
      margin-top: 14px;
      cursor: pointer;
    }
    .more-modal-cancle {
      outline: none;
      border: none;
      background: none;
      width: 56px;
      height: 32px;
      color: #666666;
      font-size: 12px;
      border: 1px solid #e7e7e7;
      margin-top: 14px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
  .tableHeight {
    height: 36px;
  }
}
.form_init .input_after .ivu-form-item-content::after {
  display: none;
}
.rule-stars1::after {
    content: '*';
    display: inline-block;
    position: absolute;
    right: -20px;
    top: 10px;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
    visibility: visible;
   }
}
// .form_init .ivu-form-item .ivu-form-item-content .ivu-input, .form_init .ivu-form-item .ivu-form-item-content .ivu-select {
//     /* max-width: 300px; */

//      max-width: 745px;
// }
</style>
