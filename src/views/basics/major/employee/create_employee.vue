  <template>
  <div class="create-employee">
    <div class="header-nav">
      <div class="left">
        <h2 class="title">新增员工</h2>
      </div>
      <div class="right">
        <i-button type="primary" @click="handleSaveInfo(1)">保存</i-button>
        <i-button @click="handleSaveInfo(2)">保存并新增</i-button>
        <i-button @click="handleCancelSave">取消</i-button>
        <i-button @click="doLocationDetail('employee_index')">列表</i-button>
      </div>
    </div>
    <div class="main-container form_init">
      <Form ref="formValidate" :rules="ruleValidate" :model="create_form" :label-width="120">
        <Row>
          <Col :span="6">
            <FormItem label="创建公司" class="rule-star" prop="company">
              <!-- <Input type="text" readonly v-model="create_form.company" icon="md-more"  @on-change="doChangeForm" @on-click="company_select_visible1 = true"></Input>
               -->
               <RadioSelect :config="table_config" v-model="create_form.company" :reset="table_config.refresh" @getData="handleGetData" @change="doChangeForm">
                <div slot="header">
                  <div class="search-contain">
                    <Row :gutter="10" class="no-error-modal">
                      <Col span="4">
                        <Select v-model="companyFormId"  @on-change="doCompanyFormIdChange">
                          <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                        </Select>
                      </Col>
                      <Col span="8" class="only">
                        <Input autocomplete="on" clearable type="text" v-model="table_config.request_params.codeOrName" placeholder="公司编码/名称" search enter-button
                               @on-search="table_config.refresh = !table_config.refresh">
                          <Button slot="append" icon="ios-search" @click="table_config.refresh = !table_config.refresh"></Button>
                        </Input>
                      </Col>
                      <Col span="4">
                        <Button class="resset" @click="againreset" >重置</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </RadioSelect>
            </FormItem>
          </Col>
           <Col :span="6">
            <FormItem label="部门" class="rule-star" prop="dept">
              <!-- <Input type="text" readonly  @on-change="doChangeForm" v-model="create_form.dept" icon="md-more" @on-click="company_select_visible2 = true"></Input> -->
              <RadioSelect :config="tableconfig"  :reset='tableconfig.refresh' v-model="create_form.dept" @getData="handleSelectCompany2" @on-close="doResetAuxiliaryConfig">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select disabled clearable placeholder="已生效">
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
                      <Button  class="resset" @click="backreset">重置</Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </RadioSelect>
            </FormItem>
          </Col>
        </Row>
        <Row>
           <Col :span="6">
            <FormItem label="员工编码">
              <Input type="text"  @on-change="doChangeForm" placeholder="系统编码" disabled v-model="create_form.code" ></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="员工姓名" prop="name" class="rule-star">
              <Input type="text"  @on-change="doChangeForm" v-model="create_form.name"></Input>
            </FormItem>
          </Col>

          </Row>
          <Row>
          <Col :span="6">
            <FormItem label="手机号" prop="contactNumber">
              <Row :gutter="0">
                <!-- <Col :span="4">
                  <Input v-model="phone_type" disabled></Input>
                </Col> -->
                <Col :span="24">
                  <Input v-model="create_form.contactNumber" :maxlength="11" @on-change="doChangeForm" class="rule-star"></Input>
                </Col>
              </Row>
            </FormItem>
          </Col>

          <Col :span="6">
            <FormItem label="银行卡号">
              <Input type="text" @on-change="doChangeForm" v-model="create_form.bankAccount"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="身份证号">
              <Input type="text" @on-change="doChangeForm" v-model="create_form.idCardNum"></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="电子邮箱">
              <Input type="text" @on-change="doChangeForm" v-model="create_form.email"></Input>
            </FormItem>
          </Col>
        </Row>
            <Row>
                <Col span="12">
                 <FormItem label="描述">
            <Input  type="textarea" :maxlength="200" @on-change="doChangeForm" v-model="create_form.remark" :autosize="{minRows: 5,maxRows: 5}" placeholder=""></Input>
                </FormItem>
                </Col>
            </Row>
      </Form>
    </div>
    <!-- <div>
      <CompanySelect title="选择归属公司" v-model="company_select_visible1" @select="handleSelectCompany"></CompanySelect>
      <CompanyChose title="选择部门" :model_ids2="model_ids2" v-model="company_select_visible2" @select="handleSelectCompany2"></CompanyChose>
    </div> -->
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
        <Button type="primary" @click="handleSaveInfo(1)">是</Button>
        <Button  @click="handleConfirmCancel">否</Button>
        <Button  @click="reminderModal = false">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
// import CompanySelect from '_c/companySelectModal'
import RadioSelect from '_c/radio-select'
import CommonIcon from '_c/common-icon'
// import CompanyChose from './companychose'
import { saasMixin } from '@/libs/mixins.js'
// import { Validation } from '@/libs/rule'
import { mapMutations } from 'vuex'
export default {
  name: 'create_employee',
  mixins: [saasMixin],
  data () {
    return {
      // phone_type: '086',
      companyFormId: 0,
      cancleboxModel: false,
      changed: false, // 判断页面内容有没有修改
      reminderModal: false,
      model_ids2: null,
      formList: [],
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
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
          { required: true, trigger: 'blur' }
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
        // code: [
        //   { validator: Validation.codeRule, trigger: 'blur' }
        // ]
        // remark: [
        //   { validator: Validation.addressRule, trigger: 'blur' }
        // ]
      },
      compare_form: '',
      create_form: {
        code: '',
        name: '',
        dept: '',
        codeType: 0,
        contactNumber: '',
        bankAccount: '',
        idCardNum: '',
        email: '',
        // codeType: '1',
        deptId: '',
        companyId: '0',
        company: '',
        remark: '',
        useCompanyId: ''
      },
      company_select_visible1: false,
      company_select_visible2: false
    }
  },
  components: {
    // CompanySelect,
    // CompanyChose,
    CommonIcon,
    RadioSelect
  },
  watch: {
    changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    this.compare_form = JSON.stringify(this.create_form)
    this.getdeptchange()
  },
  created () {
    this.doGetInited()
  },
  methods: {
    doResetAuxiliaryConfig () {
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 取消弹窗
    confirmcanclebox () {
      this.handleConfirmCancel()
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    getchange () {
      this.tableconfig.refresh = !this.tableconfig.refresh
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
    ...mapMutations([
      'addIdToList'
    ]),
    // 初始化
    doGetInited (id) {
      // this.params = JSON.parse(this.$route.query.params)
      if (this.$route.query.id) {
        console.log(this.$route.query.id, '88')
        let req = {
          id: this.$route.query.id
        }
        this.loading = true
        this.$request.post('financeback/staff/findStaffById', req).then(res => {
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
            this.create_form.code = ''
            this.create_form.name = ''
            this.create_form.company = ''
          }
        })
      }
      this.changed = false
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          console.log(res, '66')
          this.formList = res.data.data
        }
      })
    },
    backreset () {
      this.tableconfig.request_params.isEnable = ''
      this.tableconfig.request_params.deptType = ''
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    // 保存
    handleSaveInfo (type) {
      console.log(this.create_form)
      this.$refs['formValidate'].validate((valid) => {
        console.log(valid)
        if (!valid) return false
      })
      // this.reminderModal = false
      this.save_type = type
      this.reminderModal = false
      if (!this.create_form.company) {
        this.$Message.warning('请选择创建公司')
        return false
      }
      if (!this.create_form.deptId || !this.create_form.dept) {
        this.$Message.warning('请选择部门')
        return false
      }
      // if (this.create_form.code !== !'' && !/^[A-Za-z0-9]{1,20}$/.test(this.create_form.code)) {
      //   this.$Message.warning('请填写正确员工编码')
      //   return false
      // }
      if (this.create_form.name !== !'' && !/^[\u4e00-\u9fffa-zA-Z]{1,20}$/.test(this.create_form.name)) {
        this.$Message.warning('请填写正确员工姓名')
        return false
      }
      if (!/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('请填写正确的手机号')
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('请输入正确的身份证号！')
        return false
      }
      if (this.create_form.bankAccount !== '' && !/^(\d{16}|\d{19})$/.test(this.create_form.bankAccount)) {
        this.$Message.warning('请输入正确的银行卡号！')
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
      this.$request.post('/financeback/staff/addStaff', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('更新成功！')
          if (this.save_type === 1) {
            console.log('1', res)
            this.addIdToList({ id: res.data.data, name: 'employee' })
            this.$router.push({ name: 'update_employee', query: { id: res.data.data } })
          } else if (this.save_type === 2) {
            console.log('566')
            this.$refs.formValidate.resetFields()
            this.reminderModal = false
            this.changed = false
            this.handleResetForm()
          } else if (this.save_type === 3) {
            this.$router.push({ name: 'employee_index' })
          } else {
            this.doContinueActions()
          }
        } else {
          this.$Message.warning('更新失败！')
          this.reminderModal = false
        }
      })
    },
    // 重置
    handleResetForm () {
      this.model_ids2 = null
      this.create_form = {
        code: '',
        name: '',
        dept: '',
        contactNumber: '',
        bankAccount: '',
        idCardNum: '',
        email: '',
        codeType: '0',
        deptId: '',
        companyId: '0',
        company: '',
        remark: ''
      }
    },
    handleConfirmCancel () {
      this.handleResetForm()
      this.doContinueActions()
      this.reminderModal = false
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        yes () {
          that.handleSaveInfo(3, that.doContinueActions())
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
    // 取消保存
    // handleCancelSave () {
    //   if (JSON.stringify(this.create_form) !== this.compare_form) {
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
    handleSelectCompany2 (data, row) {
      this.tableconfig.request_params.deptCodeOrDeptName = ''
      this.tableconfig.refresh = !this.tableconfig.refresh
      this.changed = true
      if (data) {
        this.changed = true
        // console.log(data)
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
      this.changed = true
      if (this.create_form.dept) {
        this.create_form.dept = null
      }
      this.create_form.company = data.name
      this.create_form.companyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      console.log(data, '进来了')
      this.tableconfig.request_params.companyIdList = []
      this.tableconfig.request_params.companyIdList.push(data.id)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
  .create-employee {
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
        // margin-right: 4px;
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
.create-employee {
  .resset {
  margin-left: 12px;
  }
  .ivu-btn-icon-only {
      padding: 2.6px 13px;
      margin-left: -10px;
    }
  .only {
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
