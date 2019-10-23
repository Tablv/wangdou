<template>
  <section class="department-update">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
     <common-icon v-if="this.formValidate.isDel === 1" class="yishixiao" type="_yishanchu"></common-icon>
  <common-icon v-show="formValidate.isEnable === 0" class="yishixiao" type="_yishixiao1"/>
    <section class="page-header">
      <div class="page-header-name">查看部门</div>
      <div class="page-header-actions">
        <Button type="primary" @click="handleSaveInfo(2)" >保存</Button>
        <!-- <i-button  @click="doSaveAdd">保存并新增</i-button> -->
        <i-button @click="handleUpdateInfo">取消</i-button>
        <Button @click="handleAddForm(1)">新增</Button>
        <i-button @click="handleConfirmDel">删除</i-button>
        <Button @click="copyproject">复制</Button>
        <i-button @click="doLocationDetail('department_index')">列表</i-button>
        <i-button v-if="formValidate.isEnable ===1" @click="handleDisable">禁用</i-button>
        <i-button v-if="formValidate.isEnable !==1" @click="handleDisables">反禁用</i-button>
        <Button  v-if="formValidate.isEnable ===1" @click="showchange">变更</Button>
        <Button v-if="formValidate.isEnable ===1" @click="oldchanges">变更历史</Button>
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
        </div>
    </section>
    <div class="container form_init">
        <Form  :model="formValidate" :label-width="120"  ref="formValidates" :rules="ruleValidate">
         <Row>
            <Col span="6"  v-if="((formValidate.isUsed === 1 && formValidate.isEnable === 1) || (formValidate.isEnable===1 && formValidate.isEnd === 0)) || formValidate.isEnable === 0">
        <FormItem label="创建公司" prop="companyName">
            <Input v-model="formValidate.companyName"  disabled   @on-change="doChangeForm"></Input>
        </FormItem>
        </Col>
        <Col span="6" v-if="formValidate.isUsed === 0 && formValidate.isEnable===1 && formValidate.isEnd === 1">
        <FormItem label="创建公司" prop="companyName" class="rule-stars">
            <RadioSelect :config="table_config" v-model="formValidate.companyName"  :reset="table_config.refresh" @getData="handleGetData" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10" class="no-error-modal">
                    <Col span="4">
                      <Select v-model="companyFormId"  @on-change="doCompanyFormIdChange">
                        <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input autocomplete="on" clearable type="text" v-model="table_config.request_params.codeOrName" placeholder="公司编码/公司名称" search enter-button
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
            <!-- <Input v-model="formValidate.companyName" :disabled="formValidate.isEnable!==1"  icon="md-more"  @on-click="company_select_visible1 = true" @on-change="doChangeForm"></Input> -->
        </FormItem>
        </Col>
         <Col span="6" class= "doublekill"  v-if="((formValidate.isUsed === 1 && formValidate.isEnable === 1) || (formValidate.isEnable===1 && formValidate.isEnd === 0)) || formValidate.isEnable === 0" >
        <FormItem label="创建公司业务单元" prop="attrBusinessUnitName">
            <Input v-model="formValidate.attrBusinessUnitName"  disabled   @on-change="doChangeForm"></Input>
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill" v-if="formValidate.isUsed === 0 && formValidate.isEnable===1 && formValidate.isEnd === 1">
        <FormItem label="创建公司业务单元" prop="attrBusinessUnitName" class="rule-stars">
           <RadioSelect :config="tableconfigabus"  v-model="formValidate.attrBusinessUnitName" :reset="tableconfigabus.refresh" @getData="handleSelectCompany2" @change="doChangeForm">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="unitFormId" @on-change="doChangeobject">
                        <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
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
            <!-- <Input v-model="formValidate.attrBusinessUnitName"  :disabled="formValidate.isEnable!==1"  icon="md-more" @on-click="company_select_visible2 = true" @on-change="doChangeForm"></Input> -->
        </FormItem>
        </Col>
        </Row>
         <Row>
            <!-- <Col span="6">
        <FormItem label="使用公司" prop="useCompanyName">
            <Input v-model="formValidate.useCompanyName"  disabled icon="md-more"  @on-change="doChangeForm"></Input>
        </FormItem>
        </Col> -->
        <Col span="6">
        <FormItem label="使用公司" prop="useCompanyName" class="rule-stars">
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
        </FormItem>
        </Col>
        <!-- <Col span="6" class= "doublekill">
        <FormItem label="使用公司业务单元" prop="businessUnitName">
            <Input v-model="formValidate.businessUnitName" disabled  icon="md-more" :maxlength="50" @on-change="doChangeForm"></Input>
        </FormItem>
        </Col> -->
        <Col span="6" class= "doublekill">
        <FormItem label="使用公司业务单元" prop="businessUnitName" class="rule-stars">
          <RadioSelect :config="tableconfigbus"  disabled v-model="formValidate.businessUnitName" :reset="tableconfigbus.refresh" @getData="handleSelectCompany5" @change="doChangeForm">
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
        <Col span="6">
        <FormItem label="编码" prop="code">
            <Input v-model="formValidate.code" placeholder="系统编码" disabled ></Input>
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill" v-if="formValidate.isEnable ===0">
        <FormItem label="名称" prop="name">
            <Input v-model="formValidate.name" disabled :maxlength="50" @on-change="doChangeForm"></Input>
        </FormItem>
        </Col>
       <Col span="6" class= "doublekill" v-if="formValidate.isEnable ===1">
        <FormItem label="名称" prop="name" class="rule-stars">
            <Input v-model="formValidate.name"  :maxlength="50" @on-change="doChangeForm"></Input>
        </FormItem>
        </Col>
       </Row>
        <Row>
        <Col span="6" class="welling">
          <FormItem label="属性">
          <Select class="span-space company-input-find" :disabled="formValidate.isEnable ===0" v-model="formValidate.deptType" :label-in-value="true" @on-change="doAcctypeChange" placeholder="全部属性">
           <Option v-for="(item,name) in deptylist" :value="item.id" :key="name">{{item.name}}</Option>
          </Select>
            <!-- <Input v-model="formValidate.deptTypeName"  :disabled="formValidate.isEnable!==1"  icon="md-more" @on-click="company_select_visible3= true" @on-change="doChangeForm"></Input> -->
        </FormItem>
        </Col>
           <Col span="6" class= "doublekill" v-if="((formValidate.isUsed === 1 && formValidate.isEnable === 1) || (formValidate.isEnable===1 && formValidate.isEnd === 0)) || formValidate.isEnable === 0" >
        <FormItem label="上级部门" prop="companyName">
            <Input v-model="formValidate.prarentName"  disabled   @on-change="doChangeForm"></Input>
        </FormItem>
        </Col>
        <Col span="6" class= "doublekill" v-if="formValidate.isUsed === 0 && formValidate.isEnable===1 && formValidate.isEnd === 1">
        <FormItem label="上级部门">
            <!-- <Input v-model="formValidate.parentdept" @on-change="doChangeForm" :maxlength="50"></Input> -->
            <RadioSelect :config="tableconfigdept" :reset='tableconfigdept.refresh' :disabled="formValidate.isEnable === 0"  v-model="formValidate.prarentName" @getData="handleSelectCompany8">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4">
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
        </FormItem>
        </Col>
        </Row>
          <FormItem label="描述" prop="remark">
             <Row>
                <Col span="13">
            <Input v-model="formValidate.remark" :maxlength="200" :disabled="formValidate.isEnable === 0" type="textarea" :autosize="{minRows: 5,maxRows: 5}" placeholder="" @on-change="doChangeForm"></Input>
                </Col>
            </Row>
        </FormItem>
         </Form>
    </div>
    <Modal v-model="moreValues" class="change-modal" draggable scrollable width="750px" title="变更历史" @on-cancel="docancle">
         <div class="content">
                <div class="change-modal-content-table">
                      <div>
               <Form >
                 <Row>
                     <Col span="4" >
                       <FormItem label="编码">
                           <span class="FontSize">{{this.tableDataed.code}}</span>
                       </FormItem>
                     </Col>
                     <Col span="4" class="input_after">
                       <FormItem label="名称">
                           <span class="FontSize">{{this.tableDataed.name}}</span>
                       </FormItem>
                     </Col>
                  </Row>
               </Form>
            </div>
                  <Table
                    :columns="tableColumns"
                    :data="tableData"
                  ></Table>
                 </div>
      </div>
      <div slot="footer" class="change-modal-footer">
        <!-- <button class="box-background change-modal-comfirm">确认</button> -->
        <button class="change-modal-cancle" @click="docancle">关闭</button>
      </div>
    </Modal>
    <div>
      <!-- <CompanySelect title="选择归属公司" v-model="company_select_visible1" @select="handleSelectCompany"></CompanySelect> -->
      <UsercompanyModels title="选择使用公司" v-model="company_select_visible4" @select="handleSelectCompany4"></UsercompanyModels>
      <BusinessUnitModel title="选择业务单元" v-model="company_select_visible2" :model_ids="model_ids" @select="handleSelectCompany2"></BusinessUnitModel>
      <BusinessUNitModels title="选择业务单元" v-model="company_select_visible5" :model_ids2="model_ids2" @select="handleSelectCompany5"></BusinessUNitModels>
      <UsercompanyModel title="选择属性" v-model="company_select_visible3" @select="handleSelectCompany3"></UsercompanyModel>
      <change-depart @moreClose="doprojectClose" :model_ids="model_ids" :showMore="showMore"></change-depart>
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
        <Button type="primary" @click="doDelete">确定</Button>
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
        <Button type="primary" @click="handleDisable">确定</Button>
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
        <Button type="primary" @click="handleDisables">确定</Button>
        <Button  @click="handleCancelDisable">取消</Button>
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
  </section>
</template>

<script>
// import CompanySelect from '_c/companySelectModal'
import BusinessUnitModel from './ChoseModel/BusinessUnitModel'
import BusinessUNitModels from './ChoseModel/BusinessUNitModels'
import ChangeDepart from './change_department'
import UsercompanyModel from './ChoseModel/UsercompanyModel'
import UsercompanyModels from './ChoseModel/UsercompanyModels'
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import RadioSelect from '_c/radio-select'
export default {
  name: 'update_department',
  mixins: [saasMixin],
  data () {
    return {
      changed: false, // 判断页面内容有没有修改
      reminderModal: false,
      deleateIcon: false,
      companyFormId: 0,
      disable_visible: false,
      disable_visible2: false,
      copyreplication: false,
      loading: false, // 加载loading
      model_ids: 1,
      model_ids2: 1,
      cancleboxModel: false,
      save_type: 0,
      save_typer: 0,
      deptylist: [],
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
      tableDataed: {
        code: '',
        name: ''
      },
      tableconfigdept: {
        type: 'parentdept', // 单选类型,在columns.js 文件里定义好
        title: '选择上级部门',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: 'department_index',
          isEnterpriseAdmin: 1,
          codeOrName: '',
          companyId: '',
          deptType: '',
          id: '',
          isEnable: 1,
          companyIdList: []
        }
      },
      tableconfigabus: {
        type: 'attrBusiness', // 单选类型,在columns.js 文件里定义好
        title: '选择业务单元',
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
      // isEnable: '',
      // 删除
      delete_visible: false,
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
      current_row: '',
      phone_type: '086',
      unitFormId: 0,
      formValidate: {
        id: '',
        isUsed: '',
        isEnableStr: '',
        code: '',
        name: '',
        deptTypeName: '',
        deptType: '',
        useCompanyName: '',
        isEnterpriseAdmin: 1,
        companyName: '',
        remark: '',
        contactNumber: '',
        userCompany: '',
        bankAccount: '',
        companyId: '',
        useCompanyId: '',
        BusinessUnit: '',
        attrBusinessUnitId: '', // 归属公司业务单元id、
        attrBusinessUnitName: '', // 归属公司名称
        prarentId: '', // 上级部门id
        deptLevel: '', // 部门等级
        businessUnitId: '', // 使用公司业务单元id
        businessUnitName: '',
        deptUseCompanyId: '',
        codeType: '0',
        isEnable: '',
        version: ''
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
      showMore: false,
      company_select_visible1: false,
      company_select_visible2: false,
      company_select_visible3: false,
      company_select_visible4: false,
      company_select_visible5: false,
      tableData: [
        { useCompanyName: '南京网兜科技有限公司', businessUnitName: '南京网兜科技有限公司', startTime: '2019-06-01', endTime: '2019-06-02' }
      ],
      tableColumns: [
        {
          title: '使用公司',
          key: 'useCompanyName',
          tooltip: true
        },
        {
          title: '业务单元',
          key: 'businessUnitName',
          tooltip: true
        },
        {
          title: '变更人',
          key: 'creatorName',
          tooltip: true
        },
        {
          title: '变更时间',
          key: 'createTime',
          tooltip: true
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
        name: [
          { required: true, trigger: 'change' }
        ],
        deptTypeName: [
          { required: true, trigger: 'change' }
        ]
        // phoneNumber: [
        //   { validator: Validation.phoneNumberRule, trigger: 'blur' }
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
    // CompanySelect,
    CommonIcon,
    BusinessUnitModel,
    UsercompanyModel,
    BusinessUNitModels,
    ChangeDepart,
    RadioSelect,
    UsercompanyModels
  },
  mounted () {
    let _id = this.$route.query && this.$route.query.id
    this.getCurrentInfo(_id)
    this.getChangeOld(_id)
    this.getdeptchange()
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
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
    // 保存并新增
    doSaveAdd (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (!this.formValidate.companyName) {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      if (!this.formValidate.attrBusinessUnitName) {
        this.$Message.warning('请选择创建公司业务单元')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.useCompanyId) {
      //   this.$Message.warning('请选择使用公司')
      //   this.reminderModal = false
      //   return false
      // }
      // if (!this.formValidate.businessUnitName) {
      //   this.$Message.warning('请选择使用公司业务单元')
      //   this.reminderModal = false
      //   return false
      // }
      if (this.formValidate.name === '') {
        this.$Message.warning('请填写名称')
        this.reminderModal = false
        return false
      }
      if (this.formValidate.name !== '' && !/^[\u4e00-\u9fffa-zA-Z0-9]{1,50}$/.test(this.formValidate.name)) {
        this.$Message.warning('名称不能使用空格，特殊字符或超过50字符')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.deptType) {
      //   this.$Message.warning('请选择属性')
      //   this.reminderModal = false
      //   return false
      // }
      console.log(this.formValidate)
      this.$request.post('/financeback/dept/saveDeptChange', this.formValidate).then(res => {
        // /financeback/dept/addDept
        // /financeback/dept/saveDeptChange
        if (res.data.code === 200) {
          this.$Message.success('更新成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'create_department'
            })
            // this.doGetInit()
          }, 1000)
          this.formValidate.deptType = '管理部门'
        } else {
          this.$Message.warning('更新失败！')
          this.reminderModal = false
          this.save_typer = 0
          this.save_type = 0
        }
        this.reminderModal = false
      })
    },
    copyPreservation (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (!this.formValidate.companyName) {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      if (!this.formValidate.attrBusinessUnitName) {
        this.$Message.warning('请选择创建公司业务单元')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.useCompanyId) {
      //   this.$Message.warning('请选择使用公司')
      //   this.reminderModal = false
      //   return false
      // }
      // if (!this.formValidate.businessUnitName) {
      //   this.$Message.warning('请选择使用公司业务单元')
      //   this.reminderModal = false
      //   return false
      // }
      if (this.formValidate.name === '') {
        this.$Message.warning('请填写名称')
        this.reminderModal = false
        return false
      }
      if (this.formValidate.name !== '' && !/^[\u4e00-\u9fffa-zA-Z0-9]{1,50}$/.test(this.formValidate.name)) {
        this.$Message.warning('名称不能超过5名称不能使用空格，特殊字符或超过50字符0字符')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.deptType) {
      //   this.$Message.warning('请选择属性')
      //   this.reminderModal = false
      //   return false
      // }
      console.log(this.formValidate)
      this.$request.post('/financeback/dept/saveDeptChange', this.formValidate).then(res => {
        // /financeback/dept/addDept
        // /financeback/dept/saveDeptChange
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'create_department',
              query: {
                params: this.$route.query.params,
                id: this.$route.query.id
              }
            })
            // this.doGetInit()
          }, 1000)
          this.save_typer = 0
          this.save_type = 0
          this.changed = false
          this.reminderModal = false
        } else {
          this.$Message.warning('保存失败！')
          this.reminderModal = false
          this.save_typer = 0
          this.save_type = 0
        }
        this.reminderModal = false
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
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          console.log('123', res)
          this.deptylist = res.data.data
          this.formValidate.deptTypeName = this.deptylist[0].name
          this.formValidate.deptType = this.deptylist[0].id
          console.log(this.formValidate.deptTypeName, '00011')
          console.log(this.formValidate.deptType, '00011')
          // this.formList.babel = res.data.data.name
        }
      })
    },
    // 初始化info
    handleInitInfo () {
      let _path = this.$route.path
      this.$router.push({
        path: _path,
        query: { id: this.current_row.id }
      })
      // console.log(this.current_row.id)
      this.isEnable = this.current_row.isEnable
      this.tableconfigdept.request_params.companyId = this.current_row.companyId
      // this.model_ids = this.current_row.companyId
      // this.model_ids2 = this.current_row.useCompanyId
      for (let key in this.formValidate) {
        this.formValidate[key] = this.current_row[key]
      }
    },
    // id查询
    getCurrentInfo (id) {
      this.loading = true
      this.$request.post('/financeback/dept/findDeptById', {
        id,
        isEnterpriseAdmin: 1
      }).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          console.log(res, '09809')
          if (res.data.data) {
            this.current_row = res.data.data
            this.formValidate = res.data.data
            this.tableconfigdept.request_params.id = this.formValidate.id
            this.tableconfigdept.request_params.companyId = this.formValidate.companyId
            this.tableconfigabus.request_params.companyIdList = []
            this.tableconfigabus.request_params.companyIdList.push(this.formValidate.id)
            console.log(this.tableconfigabus.request_params.companyIdList, '08934')
            // this.handleInitInfo()
          } else {
            this.current_row = ''
          }
        } else {
          this.current_row = ''
        }
      })
    },
    // 变更
    showchange () {
      this.model_ids = this.$route.query.id
      console.log(this.model_ids, 'we')
      this.getCurrentInfo(this.$route.query.id)
      this.showMore = true
    },
    // 监听变更关闭
    doprojectClose (msg) {
      this.showMore = false
    },
    getChangeOld (id) {
      this.$request.post('/financeback/dept/findCompanyList', {
        id
      }).then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          this.tableDataed = res.data.data
          this.tableData = res.data.data.deptUseCompanyList
          console.log(this.tableData, '历史')
          this.tableData.forEach((item) => {
            item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
        }
      })
    },
    // 确定选择归属公司
    handleGetData (data) {
      this.changed = true
      this.formValidate.prarentName = null
      this.formValidate.prarentId = null
      this.formValidate.attrBusinessUnitName = null
      this.formValidate.companyName = data.name
      this.formValidate.companyId = data.id
      this.tableconfigdept.request_params.companyId = data.id
      this.tableconfigabus.request_params.companyIdList = []
      this.tableconfigabus.request_params.companyIdList.push(data.id)
      if (!data.name || !data.id) {
        return false
      }
    },
    // 选择业务单元
    handleSelectCompany2 (data) {
      this.changed = true
      this.formValidate.attrBusinessUnitId = data.id
      this.formValidate.attrBusinessUnitName = data.name
    },
    // 选择属性
    handleSelectCompany3 (row) {
      if (row) {
        this.formValidate.deptType = row.id
        // this.formValidate.useCompanyId= row.useCompanyId
        this.formValidate.deptTypeName = row.name
      }
      this.company_select_visible3 = false
      this.changed = true
    },
    // 选择使用公司
    handleSelectCompany4 (data, item) {
      this.formValidate.useCompanyName = data.name
      this.formValidate.useCompanyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      this.tableconfigbus.request_params.companyIdList = []
      this.tableconfigbus.request_params.companyIdList.push(data.id)
    },
    handleSelectCompany5 (data) {
      this.formValidate.businessUnitId = data.id
      this.formValidate.businessUnitName = data.name
    },
    // 上级部门
    handleSelectCompany8 (row) {
      this.changed = true
      this.formValidate.prarentName = row.name
      this.formValidate.prarentId = row.id
      this.formValidate.prarentLevel = row.prarentLevel
      this.formValidate.prarentCode = row.prarentCode
    },
    handDisable () {
      let _result = this.handleCheckEdit()
      if (!_result) {
        this.save_type = 2
        this.reminderModal = true
        // this.handleSaveInfo(2)
        this.disable_visible = true
      } else {
        this.disable_visible = true
      }
    },
    // 删除
    handleConfirmDel () {
      let that = this
      // if (that.changed) {
      //   that.$Control({
      //     title: '消息提示',
      //     type: 'control',
      //     message: '当前数据已修改，需要保存吗？',
      //     yes () {
      //       that.handleSaveInfo()
      //       that.$CloseCtl()
      //       that.delete_visible = true
      //     },
      //     no () {
      //       that.$CloseCtl()
      //       that.changed = false
      //       that.delete_visible = true
      //     },
      //     cancel () {
      //       that.$CloseCtl()
      //     }
      //   })
      // } else {
      that.delete_visible = true
      // }
    },
    // jinyong
    handleDisable () {
      let idList = []
      idList.push(this.current_row.id)
      let versionList = []
      versionList.push(this.current_row.version)
      let req = {
        idList,
        versionList,
        isEnterpriseAdmin: 1
      }
      console.log(req)
      this.doContinueActions()
      this.$request.post('/financeback/dept/disableBatch', req).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('禁用成功！')
          this.disable_visible = false
          this.formValidate.isEnable = this.formValidate.isEnable === 1 ? 0 : 1
        } else {
          this.$Message.warning('禁用失败！')
        }
      })
    },
    handleSaveInfo (type) {
      this.$refs['formValidates'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (!this.formValidate.companyName) {
        this.$Message.warning('请选择创建公司')
        this.reminderModal = false
        return false
      }
      if (!this.formValidate.attrBusinessUnitName) {
        this.$Message.warning('请选择创建公司业务单元')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.useCompanyId) {
      //   this.$Message.warning('请选择使用公司')
      //   this.reminderModal = false
      //   return false
      // }
      // if (!this.formValidate.businessUnitName) {
      //   this.$Message.warning('请选择使用公司业务单元')
      //   this.reminderModal = false
      //   return false
      // }
      if (this.formValidate.name === '') {
        this.$Message.warning('请填写名称')
        this.reminderModal = false
        return false
      }
      if (this.formValidate.name !== '' && !/^[\u4e00-\u9fffa-zA-Z0-9]{1,50}$/.test(this.formValidate.name)) {
        this.$Message.warning('名称不能使用空格，特殊字符或超过50字符')
        this.reminderModal = false
        return false
      }
      // if (!this.formValidate.deptType) {
      //   this.$Message.warning('请选择属性')
      //   this.reminderModal = false
      //   return false
      // }
      console.log(this.formValidate, '009')
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
        codeType: this.formValidate.codeType
      }
      this.$request.post('/financeback/dept/saveDeptChange', req).then(res => {
        // /financeback/dept/addDept
        // /financeback/dept/saveDeptChange
        if (res.data.code === 200) {
          console.log(res.data.data, 'jidongahsneg11')
          this.formValidate.version = res.data.data
          if (this.save_type || this.save_typer === 2) {
            this.$Message.success('保存成功！')
            this.save_typer = 0
            this.save_type = 0
            this.changed = false
            this.reminderModal = false
          } else {
            this.$Message.success('保存成功！')
            this.reminderModal = false
            this.doContinueActions()
          }
        } else {
          this.$Message.warning(res.data.message)
          this.reminderModal = false
          this.save_typer = 0
          this.save_type = 0
        }
        this.reminderModal = false
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
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    handleConfirmCancel () {
      this.changed = true
      if (this.save_type === 1) {
        this.reminderModal = false
        this.$router.push({ path: 'department_create' })
      } else if (this.save_type || this.save_typer === 2) {
        this.reminderModal = false
        this.handleInitInfo()
        this.save_type = 0
        this.save_typer = 0
      } else {
        this.doContinueActions()
      }
    },
    // 翻页
    handlePageLocation (type) {
      switch (type) {
        case 'first':
          console.log(this.current_row)
          let _first = this.doFindPage(1, this.current_row.id)
          console.log(_first)
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
          let _name = this.$route.name === 'department_index'
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
    handleDisables () {
      let idList = []
      idList.push(this.current_row.id)
      let versionList = []
      versionList.push(this.current_row.version)
      this.doContinueActions()
      this.$request.post('/financeback/dept/enableBatch', {
        idList,
        versionList,
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('反禁用成功！')
          this.disable_visible2 = false
          this.formValidate.isEnable = this.formValidate.isEnable === 1 ? 0 : 1
        } else {
          this.$Message.warning('反禁用失败！')
        }
      })
    },
    handleCancelDisable () {
      this.current_selection_row = []
      this.disable_ids = []
      this.versionList = []
      this.versionList = []
      this.disable_type = ''
      this.disable_visible = false
      this.disable_visible2 = false
    },
    // 复制按钮
    copyproject () {
      if (this.changed) {
        this.copyreplication = true
      } else {
        this.$router.push({
          name: 'create_department',
          query: {
            params: this.$route.query.params,
            id: this.$route.query.id
          }
        })
      }
    },
    // 删除
    doDelete () {
      let idList = []
      idList.push(this.current_row.id)
      let versionList = []
      versionList.push(this.current_row.version)
      this.doContinueActions()
      this.$request.post('/financeback/dept/deleteDeptBatch', { idList, versionList, isEnterpriseAdmin: 1 }).then(res => {
        if (res.data.code === 200) {
          // console.log('86', res.data.data.failList[0])
          // let hes = res.data.data.failList[0].referenceDescription
          if (res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            if (res.data.data && res.data.data.failList[0] && res.data.data.failList[0].info && res.data.data.failList[0].info.isDel === 1) {
              this.deleateIcon = true
            }
            this.delete_visible = false
          } else {
            this.$Message.success('删除成功！')
            this.delete_visible = false
            this.handleDelSkip()
          }
        } else {
          this.$Message.warning('删除失败！')
        }
      })
    },
    docancle () {
      this.moreValues = false
    },
    oldchanges () {
      this.moreValues = true
    },
    // 跳转新增
    handleAddForm (type) {
      if (this.changed) {
        this.reminderModal = true
        this.save_type = type
      } else {
        this.$router.push({ path: 'department_create' })
      }
      // let _result = this.handleCheckEdit()
      // if (_result) {
      //   this.$router.push({ path: 'department_create' })
      // } else {
      //   this.reminderModal = true
      //   this.save_type = type
      // }
    },
    // 判断表单是否有改动
    handleUpdateInfo () {
      if (this.changed) {
        this.cancleboxModel = true
      }
      // let _result = this.handleCheckEdit()
      // if (!_result) {
      //   this.save_typer = 2
      //   this.reminderModal = true
      // }
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

<style lang="less" scoped>
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/redefine.less';
@import '../../../../assets/css/forminit.less';
.department-update{
   .doublekill {
    margin-left:30px;
  }
.container {
    .FontSize {
    font-size:12px;
    color: #999999;
  }
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
.rule-stars::after {
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
.form_init{
  margin: 10px;
}

</style>
<style lang="less">
.department-update{
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
  .ivu-form-item-error-tip {
      display: none;
    }
    .form_init .ivu-form-item .ivu-form-item-content .ivu-input, .form_init .ivu-form-item .ivu-form-item-content .ivu-select {
    max-width: 751px;
   }
   .company-input-find {
     width: 301px;
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
}
</style>
