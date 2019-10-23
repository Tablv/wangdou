<template>
  <div class="change-big">
    <Modal v-model="moreValue" class="change-modal8" :transfer="false" draggable scrollable width="600px" title="变更" @on-cancel="docancle">
      <div class="content">
        <div class="change-modal-content-tables">
          <Form ref="formValidate" :model="formValidates" :label-width="120" class="form_inits">
            <Row style="margin-left: -61px">
               <Col span="5" >
                 <FormItem label="编码">
                     <span class="FontSize">{{this.formValidates.code}}</span>
                 </FormItem>
               </Col>
               <Col span="12" class="input_after">
                 <FormItem label="名称">
                     <span class="FontSize">{{this.formValidates.name}}</span>
                 </FormItem>
               </Col>
            </Row>
            <Row>
               <Col span="19" >
               <FormItem label="变更前使用公司" prop="lastattributioncompany">
                   <Input v-model="formValidates.useCompanyName" placeholder="南京网兜信息有限公司" icon="md-more" disabled></Input>
               </FormItem>
               </Col>
            </Row>
            <Row>
               <Col span="19" class="input_after">
               <FormItem label="变更前业务单元" prop="lastBusinessUnit">
                   <Input v-model="formValidates.businessUnitName" placeholder="南京网兜信息有限公司" icon="md-more" disabled></Input>
               </FormItem>
               </Col>
            </Row>
            <Row>
                <Col span="19" >
                <FormItem label="变更后使用公司" class="rule-star">
                  <RadioSelect :config="table_config" v-model="formValidates.usechangecompany" :reset="table_config.refresh" @getData="handleGetData">
                    <div slot="header">
                      <div class="search-contain">
                        <Row :gutter="10">
                          <Col span="4">
                            <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                              <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                            </Select>
                          </Col>
                          <Col span="8">
                            <Input autocomplete="on" clearable @on-clear="againreset" type="text" v-model="table_config.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
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
                    <!-- <Input v-model="formValidate.usechangecompany" placeholder="南京网兜信息有限公司" icon="md-more" @on-click="company_select_visible10 = true"></Input> -->
                </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span="19" class="input_after">
                <FormItem label="变更后业务单元" class="rule-star">
                  <RadioSelect :config="tableconfigabus" v-model="formValidates.newBusinessUnit" :reset="tableconfigabus.refresh" @getData="handleSelectCompany2">
                    <div slot="header">
                      <div class="search-contain">
                        <Row :gutter="10">
                          <Col span="4">
                            <Select v-model="unitFormId" @on-change="doCompanyChange">
                              <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                            </Select>
                          </Col>
                          <Col span="8">
                            <Input autocomplete="on" clearable @on-clear="resetagain" type="text" v-model="tableconfigabus.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
                                   @on-search="tableconfigabus.refresh = !tableconfigabus.refresh">
                              <Button slot="append" icon="ios-search" @click="tableconfigabus.refresh = !tableconfigabus.refresh"></Button>
                            </Input>
                          </Col>
                          <Col span="4">
                            <Button style="position: relative;top: 2px" @click="resetagain">重置</Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </RadioSelect>
                    <!-- <Input v-model="formValidate.newBusinessUnit" placeholder="南京网兜信息有限公司" icon="md-more" @on-click="company_select_visible11 = true"></Input> -->
                </FormItem>
                </Col>
            </Row>
            <!-- <Row>
              <Col span="12">
                <FormItem label="变更启用时间" class="rule-star">
                  <DatePicker  type="date" v-model="formValidate.startTime" confirm placeholder="Select date" placement="bottom-start" class="startdate"></DatePicker>
                </FormItem>
              </Col>
            </Row> -->
          </Form>
         </div>
      </div>
      <div slot="footer" class="change-modal-footer">
        <button class="box-background change-modal-comfirm" @click="dogetChange">确认</button>
        <button class="change-modal-cancle" @click="docancle">取消</button>
      </div>
    </Modal>
    <div>
      <!-- <UsercompanyModels title="选择使用公司" v-model="company_select_visible10" @select="handleSelectCompany10"></UsercompanyModels> -->
      <!-- <BusinessUNitModels title="选择业务单元" :model_ids2="model_ids2" v-model="company_select_visible11" @select="handleSelectCompany11"></BusinessUNitModels> -->
    </div>
  </div>
</template>

<script>
// import CommonIcon from '_c/common-icon'

// import UsercompanyModels from './ChoseModel/UsercompanyModels'
// import BusinessUNitModels from './ChoseModel/BusinessUNitModels'
import RadioSelect from '_c/radio-select'
// import dayjs from 'dayjs'
export default {
  data () {
    return {
      companyFormId: 0,
      unitFormId: 0,
      formValidates: {
        useCompanyName: '', // 使用公司
        businessUnitName: '', // 使用单元
        isEnterpriseAdmin: 1,
        attrBusinessUnitName: '',
        id: '', // 部门ID
        useCompanyId: '', // 变更使用公司id
        code: '', // 编码
        businessUnitId: '', // 业务单元ID
        deptUseCompanyId: '', // 记录id
        // startTime: '', // 开始时间
        usechangecompany: '', // 变更后公司名
        newBusinessUnit: '' // 变更后业务单元
      },
      table_config: {
        type: 'changecompany', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '288px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: this.$route.name,
          isEnterpriseAdmin: 1,
          // companyIdList: [],
          id: '',
          codeOrName: ''
        }
      },
      tableconfigabus: {
        type: 'attrBusiness', // 单选类型,在columns.js 文件里定义好
        title: '选择创建公司业务单元',
        width: '288px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          unitFormId: null,
          menuCode: this.$route.name,
          isEnterpriseAdmin: 1,
          companyIdList: [],
          codeOrName: ''
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
      ]
    }
  },
  watch: {
    model_ids: {
      handler (newName, oldName) {
        this.getCurrentInfo(newName)
      }
      // deep: true,
      // immediate: true
    }
  },
  components: {
    // UsercompanyModels,
    // BusinessUNitModels,
    RadioSelect
  },
  props: {
    showMore: {
      default: null,
      type: Boolean
    },
    model_ids: {
      default: null,
      type: Number
    }
  },
  computed: {
    moreValue: {
      get () {
        return this.showMore
      },
      set () {}
    }
  },
  methods: {
    doCompanyChange (val) {
      let params = val === 0 ? null : val
      this.tableconfigabus.request_params.unitFormId = params
      this.$set(this.tableconfigabus, 'refresh', !this.tableconfigabus.refresh)
    },
    resetagain () {
      this.unitFormId = 0
      this.tableconfigabus.request_params.unitFormId = null
      this.tableconfigabus.refresh = !this.tableconfigabus.refresh
      this.tableconfigabus.request_params.codeOrName = ''
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
    // handleInitInfo () {
    //   let _path = this.$route.path
    //   this.$router.push({
    //     path: _path,
    //     query: { id: this.current_row.id }
    //   })
    //   // console.log(this.current_row.id)
    //   this.isEnable = this.current_row.isEnable
    //   for (let key in this.formValidates) {
    //     this.formValidates[key] = this.current_row[key]
    //   }
    // },
    // id查询
    getCurrentInfo (id) {
      this.$request.post('/financeback/dept/findDeptById', {
        id,
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.code === 200) {
          console.log(res)
          if (res.data.data) {
            this.formValidates = res.data.data
            this.table_config.request_params.id = this.formValidates.useCompanyId
            console.log(this.formValidates, 'www1')
            // this.formValidates.code = this.current_row.code
            // this.formValidat.deptUseCompanyId = res.data.data.deptUseCompanyId
            // console.log(this.current_row.code, '23')
            // this.handleInitInfo()
          } else {
            this.current_row = ''
          }
        } else {
          this.current_row = ''
        }
      })
    },
    // 确定按钮
    dogetChange (type) {
      if (!this.formValidates.usechangecompany) {
        this.$Message.warning('请选择变更后的使用公司！')
        return false
      }
      if (!this.formValidates.newBusinessUnit) {
        this.$Message.warning('请选择变更后的业务单元！')
        return false
      }
      // if (this.formValidate.startTime === '') {
      //   this.$Message.warning('请选择启用日期！')
      //   return false
      // }
      // this.formValidate.startTime = dayjs(this.formValidate.startTime).format('YYYY-MM-DD')
      console.log(this.formValidates, '33')
      this.$request.post('/financeback/dept/updateDept', this.formValidates).then(res => {
        console.log(this.formValidates, '29')
        console.log(res)
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.getCurrentInfo(this.formValidates.id)
          this.$emit('moreClose', false)
        } else {
          this.$Message.warning('保存失败！')
        }
      })
    },
    // 点击取消按钮
    docancle () {
      console.log(this.model_ids)
      this.$emit('moreClose', false)
    },
    // 确定选择归属公司
    handleGetData (data) {
      this.formValidates.usechangecompany = data.name
      this.formValidates.useCompanyId = data.id
      this.formValidates.isEnterpriseAdmin = 1
      this.tableconfigabus.request_params.companyIdList = []
      this.tableconfigabus.request_params.companyIdList.push(data.id)
      // this.formValidate.useCompanyName = data.name
      // this.formValidate.useCompanyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      // this.tableconfigdept.request_params.companyId = data.id
      // this.tablecon_figabus.request_params.companyIdList = []
      // this.tablecon_figabus.request_params.companyIdList.push(data.id)
    },
    // 选择业务单元
    handleSelectCompany2 (data) {
      this.formValidates.businessUnitId = data.id
      this.formValidates.newBusinessUnit = data.name
    //   this.formValidate.businessUnitId = data.id
    //   this.formValidate.businessUnitName = data.name
    }
  }
}
</script>

<style lang="less">
.change-big {
   .ivu-btn-icon-only {
    padding: 2.7px 8px;
    margin-left: -6px;
  }
  .ivu-input-icon {
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      color: #808695;
      position: absolute;
      // right: -20;
      z-index: 3;
      right: -6px;
  }
  .form_inits{
    margin: 10px;
    .ivu-col-span-12{
      height: 40px;
    }
  }
  .change-modal8{
    .ivu-form-item{
      margin-bottom: 6px;
    }
    .FontSize {
      font-size:12px;
      color: #999999;
    }
    .ivu-picker-panel-body {
      width: 190px;
      float: left;
    }
    .ivu-icon-md-more:before {
      content: "\F3E7";
      color: #999;
      font-size: 20px;
    }
    .ivu-date-picker-cells {
    width: 290px;
      margin: 10px;
      white-space: normal;
    }
    .change-modal-content-tables {
      width: calc(100% - 32px);
      height: 250px;
      margin-left: -25px;
      margin-top: -15px;
      .startdate {
        width: 290px
      }
    }
    .change-modal-header {
        height: 50px;
        line-height: 50px;
        text-indent: 16px;
        font-size: 16px;
        color: #696969;
      }
    .ivu-modal-footer {
      height: 60px;
      .change-modal-comfirm {
        width: 56px;
        height: 32px;
        color: #eef8f7;
        font-size: 12px;
        cursor: pointer;
      }
      .change-modal-cancle {
        width: 56px;
        height: 32px;
        color: #666666;
        font-size: 12px;
        border: 1px solid #e7e7e7;
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
  .startdate {
    width: 150px;
  }
  .content {
    .rule-star::after {
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
}

</style>
