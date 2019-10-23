<template>
  <div class="update-project">
    <common-icon v-show="create_form.isEnable === 0" class="yishixiao" type="_yishixiao1"/>
    <div class="header-nav">
      <div class="left">
        <h2 class="title">查看项目</h2>
      </div>
      <div class="right">
       <Button type="primary" @click="handleSaveInfo(1)">保存</Button>
        <Button @click="doCancel">取消</Button>
        <Button @click="doAdd">新增</Button>
        <Button @click="copyproject">复制</Button>
        <Button @click="doDelete" >删除</Button>
        <Button @click="backIndex">列表</Button>
        <Button @click="doModalDisableOk" v-if="create_form.isEnable ===1">禁用</Button>
        <Button @click="doModalUnDisableOk" v-if="create_form.isEnable !==1">反禁用</Button>
        <Button @click="doAddCheck" v-if="this.create_form.dataType === 2 && create_form.isEnable !== 0">分配</Button>
        <Button @click="cancledoAddCheck" v-if="this.create_form.dataType !== 2 || create_form.isEnable === 0">分配</Button>
        <Button @click="Unallocation" v-if="this.create_form.dataType === 2 && create_form.isEnable !== 0">取消分配</Button>
        <Button @click="cancleUnallocation" v-if="this.create_form.dataType !== 2 || create_form.isEnable === 0">取消分配</Button>
        <Button @click="findFirst" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye" />
          </span>
        </Button>
        <Button icon="ios-arrow-back" style="margin-left: 0px " @click="findPrevious"></Button>
        <Button icon="ios-arrow-forward" style="margin-left: 0px " @click="findNext"></Button>
        <Button class="isfenye" @click="findEnd">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye" />
          </span>
        </Button>
      </div>
    </div>
    <div class="container form_init">
      <Spin fix v-if="loading" style="left: 8px;z-index: 30"></Spin>
      <Form :model="create_form" ref="formValidate" :label-width="120" :rules="ruleValidate">
        <Row>
          <Col :span="6">
            <!-- 禁用状态禁用 引用状态禁用 -->
            <FormItem label="创建公司">
              <RadioSelect
              v-model="create_form.companyName"
              :config="table_config"
              :reset='table_config.refresh'
              :bloc="isGropFlag"
              :disabled="isEnableDisabled || isRelationDisabled"
              @on-close="doResetRefreshCompany"
              @getData="handleGetData"
              @change="ChangeForm">
                <div slot="header">
                  <div class="search-contain">
                    <Row :gutter="10" class="no-error-modal">
                      <Col span="4">
                        <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                          <Option v-for="item in typelisting" :value="item.value" :label="item.label" :key="item.value"></Option>
                        </Select>
                      </Col>
                      <Col span="8">
                        <Input class="search-button" v-model="createCodeOrName" placeholder="项目编码/项目名称" clearable @on-enter="doSearchCompany" @on-change="doCompanyChange">
                          <Button slot="append" icon="ios-search" @click="doSearchCompany"></Button>
                        </Input>
                      </Col>
                      <Col span="4">
                        <Button  @click="doResetRefreshCompany" class="resset">重置</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </RadioSelect>
            </FormItem>
          </Col>
          <!-- 创建公司不是集团，资料类型禁用，不让编辑 -->
          <Col :span="6"  v-if="create_form.companyName !== '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select :value="`${create_form.dataType}`" :label-in-value="true" @on-change="doChangeForm" placeholder="" disabled>
                <Option value="1">共享型</Option>
                <Option value="2">分配型</Option>
                <Option value="3">私有型</Option>
              </Select>
            </FormItem>
          </Col>
          <!-- 创建公司为集团，资料类型启用，可以编辑 -->
           <Col :span="6" v-if="create_form.companyName === '集团'">
             <FormItem label="资料类型"  class="input_after">
              <Select v-model="create_form.dataType" :label-in-value="true" @on-change="doChangeForm"  placeholder="" :disabled="isEnableDisabled || isRelationDisabled">
                <Option v-for="(item, index) in useList" :value="item.value" :key="index">{{ item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <!-- 项目编码一直处于禁用状态 -->
          <Col :span="6">
            <FormItem label="项目编码">
              <Input type="text" v-model="create_form.code" @on-change="doChangeForm" :maxlength="10" disabled></Input>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="项目名称"  class="input_after" prop="name">
              <Input type="text" :disabled="isEnableDisabled" v-model="create_form.name" @on-change="doChangeForm" :maxlength="50"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="负责部门">
              <RadioSelect
              :config="tableconfig"
              :reset='tableconfig.refresh'
              :disabled="isEnableDisabled"
              v-model="create_form.departmentName"
              @on-close="doResetAuxiliaryConfig"
              @getData="handleSelectCompany2">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select v-model="params.isEnable" disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="tableconfig.request_params.deptType" @on-change="getchange" clearable placeholder="全部部门">
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
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="负责人">
            <RadioSelect
            :config="tablepersonInChargeName"
            :reset='tablepersonInChargeName.refresh'
            :disabled="isEnableDisabled"
            v-model="create_form.personInChargeName"
            @on-close="doResetAuxiliary"
            @getData="handleSelect">
              <div slot="header">
                <div class="search-contain">
                  <Row :gutter="10">
                    <Col span="4">
                      <Select v-model="params.isEnable"  disabled clearable placeholder="已生效">
                      </Select>
                    </Col>
                    <Col span="4">
                      <Select v-model="tablepersonInChargeName.request_params.deptType" @on-change="gettablepersonInChargeName" clearable placeholder="全部部门">
                        <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                      </Select>
                    </Col>
                    <Col span="8">
                      <Input v-model="tablepersonInChargeName.request_params.codeOrName" placeholder="员工编码/员工名称" clearable enter-button  @on-clear="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"  @on-search="tablepersonInChargeName.refresh = !tablepersonInChargeName.refresh"></Input>
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
            </FormItem>
          </Col>
        </Row>
        <Row>
         <Col :span="6">
            <FormItem label="手机号"  prop="phoneNumber">
              <Input type="text" :disabled="isEnableDisabled" v-model="create_form.mobile"  @on-change="doChangeForm" :maxlength="11"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="6">
            <FormItem label="开始日期">
              <DatePicker type="date" placeholder="请选择开始日期" :disabled="isEnableDisabled" placement="bottom-start" class="startdate" v-model="create_form.startDate" @on-change="doChangeForm"></DatePicker>
            </FormItem>
          </Col>
          <Col :span="6">
            <FormItem label="验收日期">
              <DatePicker type="date"  placeholder="请选择验收日期" class="enddate" :disabled="isEnableDisabled" placement="bottom-start" v-model="create_form.inspectionDate" @on-change="doChangeForm"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="备注">
              <Input  type="textarea" v-model="create_form.remark" :disabled="isEnableDisabled" :autosize="{minRows: 5,maxRows: 5}" placeholder="" @on-change="doChangeForm" :maxlength="200"></Input>
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
    <ownershipcompany :showFlag="Charge" titleName="负责人"  @getShowFlag="ChargeFlag"  @address="handleSelect"></ownershipcompany>
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
          <span>注意：删除后将不可恢复！请确认是否要删除数据？</span>
        </p>
        <div slot="footer">
          <Button type="primary" @click="confirm('create_form','save')">确认</Button>
        <Button  @click="cancele">取消</Button>
        </div>
      </Modal>
      <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="disableModalShow"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>请确认是否要禁用当前数据，禁用后将无法使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalDisableOk">确认</Button>
        <Button  @click="doModalDisableCancel">取消</Button>
      </div>
    </Modal>
      <!-- 反禁用提示弹窗 -->
       <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="unDisableModalShow"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>反禁用后，当前数据将能被使用！</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="doModalUnDisableOk">确认</Button>
        <Button  @click="doModalUnDisableCancel">取消</Button>
      </div>
    </Modal>
    <Modal
      :closable="false"
      :transfer="false"
      :mask-closable="false"
      v-model="edit_visible"
      class-name="title-modal">
      <p slot="header" style="text-align:left;">
        <common-icon type="_guide" class="guide"></common-icon>
        <span>提示信息</span>
      </p>
      <p>
        <span>当前数据已修改，需要保存吗？</span>
      </p>
      <div slot="footer">
        <Button type="primary" @click="confirm()">是</Button>
        <Button @click="handleConfirmCancel">否</Button>
        <Button @click="edit_visible = false">取消</Button>
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
     <batch-handle-modal @modalClose="doCloseBatchAccount" :batchHandleModal="batchHandleModal" :checked="checked" :batchhandleColumns="batchhandleColumns" :batchhandleData="batchList"></batch-handle-modal>
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
            <Col span="5" class="page-left-search">
                  <Input  class="user-mobile" v-model="paramse.codeOrName" placeholder="分配编码名称" clearable enter-button @on-clear="newdoReset"  @on-search="searchOrMatch"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="doSelecting" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="newdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
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
            <Col span="5" class="page-left-search">
                  <Input  class="user-mobile" v-model="paramsed.codeOrName" placeholder="分配编码名称" clearable enter-button @on-clear="backdoReset"  @on-search="searchOrMatch"></Input>
            </Col>
            <Col span="1">
                <Button  icon="ios-search" @click="backdoSearch" class="searchadd"></Button>
              </Col>
          <Col span="2" class="page-left-search">
            <Button @click="backdoReset" class="reseting">重置</Button>
          </Col>
          </Row>
      </section>
    </multi-modal>
  </div>
</template>
<script>
import ownershipcompany from '_c/ownershipcompany'
import CommonIcon from '_c/common-icon'
import dayjs from 'dayjs'
import { saasMixin } from '@/libs/mixins'
import multiModal from '_c/multi-modal'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'
import AccountModal from '_c/accountBank'
import batchHandleModal from '_c/batchHandleModal/batchHandleModal.vue'
export default {
  name: 'update_project',
  data () {
    return {
      batchhandleColumns: [ // 成功提示的表头
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center',
          className: 'table-index'
        },
        {
          title: '业务ID',
          key: 'businessId'
        },
        {
          title: '失败原因描述',
          key: 'referenceDescription'
        }
      ],
      company_select_visible2: false,
      disableModalShow: false, // 禁用提示弹窗
      dataModal: {
        isShow: false
      },
      loading: false,
      chakan: [],
      batchList: [], // 批量操作数组
      checked: null, // 批量建账成功提示的check
      cancleboxModel: false, // 取消
      handleModal: false, // 添加弹窗
      selectedValues: [], // 默认数据
      paramse: {
        codeOrName: '',
        menuCode: 'project_index',
        isEnterpriseAdmin: 1
      }, // 接口参数
      type: 'allocation', // 多选类型
      onego: false,
      flag: false,
      typed: 'cancleallocation',
      title: '分配公司',
      companyFormId: 0,
      companyCodeOrName: '',
      titling: '取消分配公司',
      canclehandleModal: false,
      edit_visible: false,
      createyes: false,
      deleteModal: false,
      backgo: false,
      paramsed: {
        idList: [],
        companyFormId: '',
        codeOrName: '',
        menuCode: 'project_index'
      },
      backupdateproject: false,
      copyreplication: false,
      projectcompanyFormId: 0,
      backcompanyFormId: 0,
      createno: false,
      cancel_visible: false, // 取消
      deleteList: false, // 控制删除
      changed: false, // 判断页面内容有没有修改
      save_type: '', // 保存(1) or 保存新增(2)
      Charge: false,
      batchHandleModal: false, // 批量操作弹窗
      unDisableModalShow: false, // 反禁用提示弹窗
      isTitleInModal: '', // 提示模态框的文字
      reminderModal: false, // 提示弹窗
      create_form: {
        id: null,
        version: null,
        isEnterpriseAdmin: 1,
        codeType: 0,
        companyName: null,
        useCompanyName: null,
        name: null,
        dataType: null,
        tableName: null,
        code: null,
        departmentName: null,
        mobile: null,
        remark: null,
        personInChargeName: null,
        startDate: dayjs(new Date()).format('YYYY-MM-DD'),
        inspectionDate: dayjs(new Date()).format('YYYY-MM-DD'),
        isEnable: null
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
          value: 1,
          label: '共享型'
        },
        {
          value: 2,
          label: '分配型'
        },
        {
          value: 3,
          label: '私有型'
        }
      ],
      typelisting: [
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
      formList: [],
      params: {
        deptCodeOrDeptName: '',
        companyIdList: [],
        page: {
          size: 10,
          current: 1
        }
      },
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '292px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
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
          menuCode: 'project_index',
          isEnterpriseAdmin: 1,
          codeOrName: '',
          deptType: '',
          contactNumber: '',
          isEnable: 1,
          deptId: ''
        }
      },
      tableconfig: {
        type: 'department', // 单选类型,在columns.js 文件里定义好
        title: '选择部门',
        width: '292px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          menuCode: 'project_index',
          isEnterpriseAdmin: 1,
          deptCodeOrDeptName: '',
          queryConditions: '',
          isEnable: 1,
          isEnd: 1,
          companyIdList: []
        }
      },
      // form表达验证
      ruleValidate: {
        companyName: [
          { required: true, trigger: 'change' }
        ],
        name: [
          { required: true, trigger: 'change' }
        ],
        department: [
          { required: true, trigger: 'blur' }
        ]
      },
      isGropFlag: true,
      createCodeOrName: ''
    }
  },
  components: {
    AccountModal,
    ownershipcompany,
    CommonIcon,
    RadioSelect,
    multiModal,
    batchHandleModal
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
    doSelecting () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramse.companyFormId,
        coderOrName: this.paramse.codeOrName
      }
      this.$refs.modalChild.doModalInit(obj)
    },
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
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    backdoSearch () { // 分配input搜索内容框
      let obj = {
        companyFormId: this.paramsed.companyFormId,
        coderOrName: this.paramsed.codeOrName
      }
      this.$refs.modalChildes.doModalInit(obj)
    },
    // 监听批量操作弹窗关闭
    doCloseBatchAccount (msg) {
      this.batchHandleModal = msg
    },
    // 监听取消分分配弹窗关闭
    doallocationClose (data) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.batchList = data.failList
        this.checked = '取消分配成功' + this.sucLen + '个项目,失败' + this.errLen + '个项目'
        this.batchHandleModal = true
        this.selectData = []
      }
      this.showDelete = false
    },
    // 监听分分配弹窗关闭
    doallocationClosed (data) {
      if (data) {
        this.batchList = []
        this.sucLen = data.successList.length
        this.errLen = data.failList.length
        this.batchList = data.failList
        this.checked = '分配成功' + this.sucLen + '个项目,失败' + this.errLen + '个项目'
        this.batchHandleModal = true
        this.selectData = []
      }
      this.showDelete = false
    },
    // 取消弹窗
    confirmcanclebox () {
      this.doGetInit()
      this.cancleboxModel = false
    },
    backcanclebox () {
      this.cancleboxModel = false
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          this.formList = res.data.data
        }
      })
    },
    // 创建公司
    doSearchCompany () {
      let seleStrArr = ['集', '团', '集团', '', '0', '00', '000', '0000']
      let seleFlag = seleStrArr.includes(this.createCodeOrName)
      this.table_config.request_params.codeOrName = this.createCodeOrName
      this.isGropFlag = this.companyFormId === 0 && seleFlag
      this.$set(this.table_config, 'refresh', !this.table_config.refresh)
    },
    // 全部形态的搜索
    doCompanyFormIdChange (val) {
      this.isGropFlag = this.companyFormId === 0
      let params = val === 0 ? null : val
      this.table_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    // 取消分配
    Unallocation () {
      this.canclehandleModal = true
    },
    doAddCheck () {
      this.handleModal = true
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
    searchOrMatch () {},
    changeOrMatch () {},
    // 清空
    isCheck (val) {
      this.$emit('on-clear', val)
    },
    // modal弹框显隐回调方法
    onVisibeChange (val) {
      // this.modalShow = false
      this.handleModal = false
    },
    cancleonVisibeChange (val) {
      // this.modalShow = false
      this.canclehandleModal = false
    },
    // 监听选择分配公司组件接口
    doGetDataList (selectedList) {
      var selectedListed = []
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      this.handleModal = false
      let req = {
        ids: [this.$route.query.id],
        versionIds: [this.create_form.version],
        useCompanyIdArr: selectedListed,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/updateBatchProjectUseCompany', req).then(res => {
        if (res.data.code === 200) {
          this.doGetInit()
          this.doallocationClose(res.data.data)
        }
      })
    },
    // 监听选择取消分配公司组件接口
    CancleGetDataList (selectedList) {
      var selectedListed = []
      selectedList.forEach(item => {
        selectedListed.push(item.id)
      })
      this.canclehandleModal = false
      let req = {
        id: this.$route.query.id,
        useCompanyIdArr: selectedListed,
        version: this.create_form.version,
        isEnterpriseAdmin: 1
      }
      this.$request.post('/financeback/project/updateDistributionBatchProjectUseCompanyInfo', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.faillist && res.data.data.faillist.length === 0) {
            this.$Message.warning('取消分配成功')
          }
          if (res.data.data.successList && res.data.data.successList.length === 0) {
            this.$Message.warning('公司已经发生业务数据，无法取消分配')
          }
          if (res.data.data.faillist.length > 0 && res.data.data.successlist.length > 0) {
            this.doallocationClosed(res.data.data)
          }
        } else {
          this.$Message.warning(res.data.message)
        }
      })
    },
    cancledoAddCheck () {
      this.$Message.success('当前资料不是分配型资料，无法操作')
    },
    cancleUnallocation () {
      this.$Message.success('当前资料不是分配型资料，无法操作')
    },
    handleSelectCompany2 (data) {
      if (data) {
        this.changed = true
        this.create_form.departmentId = data.id
        this.create_form.department = data.name
        this.tablepersonInChargeName.request_params.deptId = data.id
      }
    },
    doResetRefreshCompany () {
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = ''
      this.table_config.request_params.codeOrName = ''
      this.createCodeOrName = ''
      this.isGropFlag = true
      this.table_config.refresh = !this.table_config.refresh
    },
    doCompanyChange () {
      if (!this.createCodeOrName && this.table_config.request_params.codeOrName) {
        this.doSearchCompany()
      }
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
      let companyIdList = []
      companyIdList.push(item)
      this.tableconfig.request_params.companyIdList = companyIdList
      this.tableconfig.refresh = !this.tableconfig.refresh
    },
    // 负责人全部部门
    gettablepersonInChargeName () {
      this.tablepersonInChargeName.refresh = !this.tablepersonInChargeName.refresh
    },
    ChangeForm () {
      this.changed = true
    },
    handleGetData (data) {
      this.changed = true
      this.create_form.companyName = data.name
      if (this.create_form.companyName !== '集团') {
        this.create_form.dataType = 3
      } else {
        this.create_form.dataType = 1
      }
      this.create_form.companyId = data.id
      if (!data.name || !data.id) {
        return false
      }
      this.tableconfig.request_params.companyIdList = []
      this.tableconfig.request_params.companyIdList.push(data.id)
      this.tablepersonInChargeName.request_params.deptId = data.id
    },
    backIndex () {
      this.doLocationDetail('project_index')
    },
    // 打开删除操作
    handleConfirmDel () {
      let that = this
      if (that.changed) {
        that.$Control({
          title: '消息提示',
          type: 'control',
          message: '当前数据已修改，需要保存吗？',
          yes () {
            that.handleSaveInfo(2)
            that.$CloseCtl()
            that.reminderModal = true
          },
          no () {
            that.$CloseCtl()
            that.changed = false
            that.reminderModal = true
            that.deleteList = true
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.reminderModal = true
        this.deleteList = true
      }
    },
    ChargeFlag (data) {
      this.Charge = data
    },
    doSelectperson (row) {
      this.changed = true
      this.create_form.personInChargeName = row.personInChargeName
      this.Charge = true
      this.showCompanies = false
    },
    setAccountName (data) {
      this.create_form.companyName = data.row.name
      this.create_form.companyId = data.row.id
      this.dataModal.isShow = false
    },
    // 归属公司
    ownershipcompany (row) {
      this.dataModal.isShow = true
    },
    setShowAccount (data) {
      this.dataModal.isShow = data
    },
    // 反禁用操作取消
    doModalUnDisableCancel () {
      this.unDisableModalShow = false
      this.$Message.info('已取消')
    },
    // 反禁用按钮
    doUnDisable () {
      this.unDisableModalShow = true
    },
    // 反禁用操作确定
    doModalUnDisableOk () {
      this.$request.post('/financeback/project/updateBatchProjectEnable', {
        ids: [this.create_form.id],
        versionIds: [this.create_form.version],
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.status === 'success') {
          this.$Message.success('反禁用成功! ')
          this.unDisableModalShow = false
          this.doGetInit()
          this.create_form.isEnable = 1
        }
      })
    },
    // 禁用操作请求
    disableRequest (name) {
      this.$request.post('/financeback/project/updateBatchProjectDisable', {
        ids: [this.create_form.id],
        versionIds: [this.create_form.version],
        isEnterpriseAdmin: 1
      }).then(res => {
        if (res.data.status === 'success') {
          this.$Message.success('禁用成功! ')
          this.doGetInit()
          this.create_form.isEnable = 0
        }
      })
    },
    // 禁用操作确定
    doModalDisableOk () {
      this.disableRequest(name)
      this.disableModalShow = false
    },
    // 禁用操作取消
    doModalDisableCancel () {
      this.disableModalShow = false
      this.$Message.info('已取消')
    },
    // 禁用按钮
    doDisable () {
      this.disableModalShow = true
    },
    // 删除按钮
    doDelete () {
      this.reminderModal = true
      this.deleteList = true
    },
    // 删除后跳转
    handleDelSkip () {
      let _prev = this.doFindPage(2, this.$route.query.id)
      if (_prev === '当前为首条') {
        let _next = this.doFindPage(3, this.$route.query.id)
        if (_next === '当前为末条') {
          return false
        } else if (_next === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          let _name = this.$route.name === 'project_index'
          setTimeout(() => {
            this.$router.push({ name: _name })
          }, 3000)
        }
        this.doGetInit(_next)
      } else {
        this.doGetInit(_prev)
      }
    },
    // 第一条
    findFirst () {
      let _num = this.doFindPage(1, this.$route.query.id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.$router.push({ name: 'update_project', query: { id: _num } })
        this.doGetInit(_num)
      }
    },
    // 上一条
    findPrevious () {
      let _num = this.doFindPage(2, this.$route.query.id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.$router.push({ name: 'update_project', query: { id: _num } })
        this.doGetInit(_num)
      }
    },
    // 最后一条
    findEnd () {
      let _num = this.doFindPage(4, this.$route.query.id)
      if (_num === '当前为末条') {
        return false
      } else {
        this.$router.push({ name: 'update_project', query: { id: _num } })
        this.doGetInit(_num)
      }
    },
    // 下一条
    findNext (type) {
      let _num = this.doFindPage(3, this.$route.query.id, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        this.$router.push({ name: 'update_project' })
      } else {
        this.$router.push({ name: 'update_project', query: { id: _num } })
        this.doGetInit(_num)
      }
    },
    confirm (name, type) {
      if (this.deleteList) {
        let req = {
          ids: [this.create_form.id],
          versionIds: [this.create_form.version],
          isEnterpriseAdmin: 1
        }
        this.$request.post('/financeback/project/deleteBatchProject', req).then(res => {
          if (res.data.code === 200) {
            if (res.data.data.failList.length !== 0) {
              this.$Message.warning(res.data.data.failList[0].referenceDescription)
              this.edit_visible = false
              return false
            }
            this.$Message.success('删除成功')
            this.findNext('delete')
          } else {
            this.$Message.warning('删除失败！')
          }
        })
      } else {
        this.handleSaveInfo(type)
      }
      this.reminderModal = false
      this.deleteList = true
    },
    confirmcopy (name, type) {
      this.copyreplication = false
      this.copyPreservation()
    },
    // 删除处理函数
    doDeleteImplete (type) {
      let _num = this.doFindPage(3, this.$route.query.id, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        setTimeout(() => {
          this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
        }, 1000)
        setTimeout(() => {
          this.$router.push({ name: 'project_index' })
        }, 3000)
      } else {
        this.doGetInit(_num)
      }
    },
    // 取消按钮
    doCancel () {
      if (this.changed || this.create_form.name === '' || this.create_form.code === '') {
        this.cancleboxModel = true
      }
    },
    // 新增按钮
    doAdd () {
      if (this.changed || this.create_form.name === '' || this.create_form.code === '') {
        this.copyreplication = true
        this.flag = false
      } else {
        this.$router.push({ name: 'create_project' })
      }
    },
    // 复制按钮
    copyproject () {
      if (this.changed || this.create_form.name === '' || this.create_form.code === '') {
        this.copyreplication = true
      } else {
        this.$router.push({
          name: 'create_project',
          query: {
            params: this.$route.query.params,
            id: this.$route.query.id
          }
        })
      }
    },
    // 监听页面内容变化
    doChangeForm () {
      this.changed = true
    },
    // 初始化
    doGetInit (id) {
      if (this.$route.query.id) {
        let req = {
          id: this.$route.query.id,
          isEnterpriseAdmin: 1
        }
        this.loading = true
        this.$request.post('/financeback/project/findProjectById', req).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            // 过滤对象中值为null的属性
            let item = ''
            for (item in res.data.data) {
              if (res.data.data[item] === null) {
                res.data.data[item] = null
              }
            }
            this.create_form = res.data.data
            if (this.create_form.companyId === 0) {
              this.tableconfig.request_params.queryConditions = 1
              this.tableconfig.request_params.companyIdList = []
              this.tablepersonInChargeName.request_params.deptId = ''
            } else {
              this.tableconfig.request_params.queryConditions = 2
              this.tableconfig.request_params.companyIdList = []
              this.tableconfig.request_params.companyIdList.push(this.create_form.companyId)
              this.tablepersonInChargeName.request_params.deptId = this.create_form.companyId
            }
            if (this.create_form && this.create_form.useCompanyIdString) {
              this.paramsed.idList = this.create_form.useCompanyIdString.split(',')
              var idList = this.paramsed.idList.map((item, index) => {
                return item - 0
              })
              this.paramsed.idList = idList
            } else {
              this.paramsed.idList = []
            }
          }
        })
      }
      this.changed = false
    },
    doDeny () {
      this.reminderModal = false
      this.doContinueActions()
      this.doGetInit()
      this.changed = false
      this.$router.push({ name: 'create_project' })
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        yes () {
          that.handleSaveInfo(2)
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
    reminder () {
      this.reminderModal = false
      this.doContinueActions()
      this.doGetInit()
      this.changed = false
    },
    backdoDeny () {
      this.edit_visible = false
      this.doGetInit()
      this.changed = false
    },
    copycancle () {
      this.copyreplication = false
    },
    backdoDenycopy () {
      this.copyreplication = false
      this.$router.push({
        name: 'create_project',
        query: {
          params: this.$route.query.params,
          id: this.$route.query.id
        }
      })
      this.doGetInit()
      this.changed = false
    },
    handleConfirmCancel () {
      this.edit_visible = false
      this.doGetInit()
      this.changed = false
      this.$router.push({ name: 'create_project' })
    },
    cancele () {
      this.reminderModal = false
    },
    canceled () {
      this.deleteModal = false
    },
    handleSaveInfo (type) {
      this.$refs['formValidate'].validate((valid) => {
        if (!valid) return false
      })
      this.edit_visible = false
      this.reminderModal = false
      this.changed = false
      this.save_type = type
      if (this.create_form.name === '') {
        this.$Message.warning('请选择项目名称！')
        return false
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
      this.$request.post('financeback/project/updateProjectById', req).then(res => {
        if (res.data.code === 200) {
          if (this.save_type === 2) {
            this.addIdToList({ id: res.data.data.id, name: 'project' })
            this.$router.push({ name: 'project_index' })
            this.$Message.success('保存成功！')
            // this.doContinueActions()
            return false
          }
          this.$Message.success('保存成功！')
          this.doGetInit()
          this.edit_visible = false
        } else {
          this.$Message.warning(res.data.message)
          this.edit_visible = false
        }
      })
    },
    // 复制保存
    copyPreservation (type) {
      this.$refs['formValidate'].validate((valid) => {
        if (!valid) return false
      })
      this.edit_visible = false
      this.reminderModal = false
      this.changed = false
      this.save_type = type
      if (this.create_form.name === '') {
        this.$Message.warning('请选择项目名称！')
        return false
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
      this.$request.post('financeback/project/updateProjectById', req).then(res => {
        console.log(this.create_form, '33')
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          setTimeout(() => {
            this.$router.push({
              name: 'create_project',
              query: {
                params: this.$route.query.params,
                id: this.$route.query.id
              }
            })
          }, 1000)
          this.edit_visible = false
        } else {
          this.$Message.warning(res.data.message)
          this.edit_visible = false
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
      if (this.create_form.name === '') {
        this.$Message.warning('请选择项目名称！')
        return false
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
      this.$request.post('financeback/project/addProject', this.create_form).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.$refs.formValidate.resetFields()
          this.changed = false
          setTimeout(() => {
            this.$router.push({
              name: 'create_project'
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
        this.create_form.company = row.row.name
      }
    },
    handleSelect (data) {
      if (data) {
        this.create_form.personInCharge = data.id
        this.create_form.personInChargeName = data.name
      }
    },
    projectResponsibility (row) {
      if (row) {
        this.create_form.department = row.row.name
      }
    },
    // 跳转列表页
    goElementList () {
      this.$router.push({
        path: 'project_index'
      })
    }
  },
  mixins: [saasMixin],
  created () {
    this.getdeptchange()
    this.doGetInit()
    // this.reminderModal = false
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  computed: {
    // 禁用状态---所有字段不可编辑
    isEnableDisabled () {
      return this.create_form.isEnable === 0
    },
    // 引用状态---创建公司、资料类型和项目编码不可以编辑，其余所有字段都可编辑
    isRelationDisabled () {
      // 使用公司
      let useCompanyNames = this.create_form.useCompanyNames
      // 使用公司为全部：共享型 为false：分配型（但是还未分配公司,没有使用公司）
      useCompanyNames = useCompanyNames === '全部' || !useCompanyNames ? this.create_form.companyName : useCompanyNames
      return this.create_form.isCited === 1 || this.create_form.companyName !== useCompanyNames
    }
  }
}
</script>
<style lang="less">
.update-project {
    .ivu-col-span-6 {
    display: block;
    width: 24.5%;
}
    .input_icon {
      position: absolute;
      right: 5px;
      top: 6px;
      color: #808695;
    }
   .ivu-icon-md-more:before {
    content: "\F3E7";
    color: #999;
    font-size: 20px;
}
  .ivu-input-prefix i, .ivu-input-suffix i {
    font-size: 16px;
    line-height: 32px;
    color: #999;
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
.ressett {
  margin-left: 6px;
}
.ivu-btn-icon-only {
    padding: 3px 10px;
    margin-left: -10px;
}
.resset {
  margin-left: 6px;
}
  .update-project {
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
