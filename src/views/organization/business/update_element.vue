<template>
  <section class="append-container">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <Spin fix v-if="saveLoading" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>数据保存中</div>
    </Spin>
    <!-- 这里是判断已删除 -->
    <common-icon v-if="isDel" class="yishixiao" type="_yishanchu" />
    <section class="page-header">
      <div class="page-header-name">查看业务单元</div>
      <div class="page-header-actions">
        <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
        <Button :disabled="isDel?true:false" type="primary" v-else @click="doSave">保存</Button>
        <Button :disabled="isDel?true:false" @click="cancelBtn">取消</Button>
        <Button :disabled="isDel?true:false" @click="toAddBtn">新增</Button>
        <Button :disabled="isDel?true:false" @click="doCopyBtn">复制</Button>
        <Button :disabled="isDel?true:false" @click="deleteElement" v-if='!isRef?true:false'>删除</Button>
        <Button @click="goElementList">列表</Button>
        <!-- 首条 -->
        <Button  @click="findFirst" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye" />
          </span>
        </Button>
        <!-- 上一条 -->
        <Button icon="ios-arrow-back" @click="findPrevious"></Button>
        <!-- 下一条 -->
        <Button icon="ios-arrow-forward" @click="findNext"></Button>
        <!-- 末条 -->
        <Button class="isfenye" @click="findEnd">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye" />
          </span>
        </Button>
      </div>
    </section>
    <Alert :type="types" show-icon v-if="alertShow" closable @on-close="alertClose" class="company_alert" :class="{success_color: isColor,error_color: !isColor}">
      <common-icon type="_warn" slot="icon" class="icon_warn"></common-icon>
      {{successContent}}
    </Alert>
    <section class="page-content">
      <Form :model="authField" :label-width="110"  class="formAdd"  >
        <Row>
          <Col span="6" >
            <!-- <FormItem label="公司" prop="company">
              <Input :disabled='isRef?true:false' v-show="!isRef?true:false" v-model="companyInput" icon="md-more" clearable readonly @on-click="doSelectCompany" @on-change="doChangeData"/>
              <Input :disabled='isRef?true:false' v-show="isRef?true:false" v-model="companyInput" icon="md-more" clearable readonly />
              <span class="istest">*</span>
            </FormItem> -->
            <FormItem label="公司" prop="company">
              <Select
                clearable
                v-model="companyInput"
                filterable
                remote
                :transfer="true"
                :disabled='isRef||isDel?true:false'
                :remote-method="remoteMethod"
                :loading="select_loading"
                placeholder=""
                @on-change="companyChange"
                >
                <Option v-for="(item, key) in select_list" :key="key" :value="item.name">{{ item.name }}</Option>
              </Select>
              <Icon class="search-icon search-style" v-show="!isRef||isDel?true:false" type="md-more" size="18" @click="doSelectCompany"></Icon>
              <Icon class="search-icon search-style" v-show="isRef||isDel?true:false" type="md-more" size="18"></Icon>
              <span class="istest">*</span>
            </FormItem>
          </Col>
          <Col span="6" >
            <FormItem label="编码" class="codeForm" v-if="codeType === '0'">
              <Input disabled placeholder="自动编码" v-model="codeInput"></Input>
              <Poptip content="content" placement="top" trigger="hover" class="me_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="" slot="content" >说明:编码规则为公司编码+3位流水码</div>
              </Poptip>
            </FormItem>
            <FormItem label="编码" class="codeForm" v-if="codeType === '1'">
              <Input disabled placeholder="自定义编码" v-model="codeInput"></Input>
              <span class="istest">*</span>
              <Poptip content="content" placement="top" trigger="hover" class="me_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" style="right: -30px;" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="" slot="content" >说明:编码规则为10位以内数字或英文字母，不含特殊符号，不能重复</div>
              </Poptip>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="名称" prop="company_name" label-for="unitName">
              <Input :disabled='isRef||isDel?true:false' v-model="companyName" :maxlength=50 @on-change="doChangeData" element-id="unitName"></Input>
              <span class="istest">{{ istest }}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="形态" prop="morphology">
              <Select v-model='formInit' :disabled="isRef||isDel?true:false" @on-change="doChangeData">
                <Option v-for="item in companyFormList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span class="istest">*</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="核算主体">
            <Checkbox v-model="single" @on-change="doChangeAcountingBody" disabled></Checkbox>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
    <Modal
        v-model="modal10"
        width="720"
        :mask-closable="false"
        :transfer="false"
        draggable
        scrollable
        class="querCompany"
        >
        <p slot="header" style="color:#333;text-align:left">
            <span>{{ titleName }}</span>
        </p>
        <section class="page-content">
          <div class="query-condition">
            <div class="query-condition-lf">
              <Row class="screen query-change">
                <Col span="6">
                  <Select v-model="formInitCom" @on-change='typeChange()'>
                    <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Col>
                <Col span="12">
                  <!-- <Input v-model="companySearch" @on-search='doSearchCompay()' :placeholder="this.promptMessage" search enter-button @on-change="doEleChang"> -->
                  <Input class="span-space company-input" :maxlength="50" search v-model="companySearch" :placeholder="this.promptMessage" @on-search="doSearchCompay()" @on-change="doEleChang">
                  </Input>
                  <!-- <Button slot="append" icon="ios-search" @click="doSearchCompay"/> -->
                </Col>
                <Col span="1">
                  <Button class="doReset" @click="companySearch='';formInitCom=0;doSelectCompany()">重置</Button>
                </Col>
              </Row>
            </div>
            <div style="width:20%"></div>
          </div>
          <!-- <div class="page-content-table">
            <Table :columns="tableColumns" :data="tableData" max-height="340"></Table>
          </div> -->
          <div class="page-content-table">
            <Table
            :columns="tableColumns"
            :data="tableData"
            :no-data-text="null"
            max-height="340"
            :class="tableData.length ? null : 'tableHeight'"
            ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </div>
        </section>
        <section slot="footer" v-show="tableDataTotal>0?true:false" class="page-footer">
          <div class="page-footer-lf">
            共 <strong>{{ tableDataTotal }}</strong>条数据
          </div>
          <div class="page-footer-rt">
            <Page id="pageIdd" class-name="pages" :total="tableDataTotal" :page-size="page.size" :page-size-opts="[20, 50, 100, 200, 500, 1000]" show-elevator show-sizer @on-change="doUpdateCurrentPage" @on-page-size-change="doUpdatePageSize"></Page>
            <Button size="small" @click="goElevatorPage('pageIdd')">GO</Button>
          </div>
        </section>
    </Modal>
  </section>
</template>

<script type="text/jsx">
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'
export default {
  name: 'update_element',
  data () {
    return {
      codeType: '', // 编码类型
      companyInput: '', // 公司
      codeInput: null, // 编码
      companyName: '', // 名称
      formInit: 3, // 形态
      single: false, // 核算主体
      loading: false, // 加载loading
      saveLoading: false,
      doHistory: {}, // 对初始值做记录
      isRef: null, // 判断是否引用
      isEnable: null, // 判断是否生效
      number: 0, // 多行文本长度
      model: 1, // 按钮切换
      maxItems: 0, // 弹窗中数据条数
      dataList: null, // 从路由得到的数据列表
      page: {
        size: 20, // 每页个数
        current: 1 // 当前页码
      },
      unitId: null, // 业务单元id
      isActive: false, //
      isCodeNode: false, // 编码右边问号按钮的点击说明
      cancelModel: false, // 取消按钮，改变内容后提示
      doDelectModal: false, // 删除弹窗
      titleName: '',
      promptMessage: '',
      alertShow: false, // alert 弹窗提示
      successContent: '', // alert 显示的内容
      types: '', // alert 的类型（成功，失败）
      isColor: null, // alert 的颜色
      istest: '*', // 名称后的 提示
      companySearch: '', // 搜索框内容-弹出层
      modal10: false, // 公司输入框的弹出层
      companyCode: null,
      formInitCom: 0,
      changeContext: false,
      authField: {
        desc: ''
      },
      tableColumns: [
        {
          title: '编码',
          key: 'code',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '形态',
          key: 'address',
          tooltip: true
        },
        {
          title: '操作',
          key: 'handle',
          className: 'primary',
          tooltip: true,
          minWidth: 30,
          align: 'center',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" onclick= {
                  function () {
                    this.companyInput = row.name
                    this.modal10 = false
                    this.changeContext = true
                    setTimeout(() => {
                      this.remoteMethod()
                    }, 10)
                    this.doSelect = true
                    this.getCompanyId = row.companyId
                    this.companyCode = row.code
                    this.companyHasSubAccount = row.hasSubAccount
                    if (this.companyHasSubAccount) {
                      this.single = true
                    } else {
                      this.single = false
                    }
                  }.bind(this, { row, index, column })
                }>选择</span>
              </div>
            )
          }
        }
      ],
      formList: [],
      companyFormList: [],
      getCompanyId: 0, // 获取公司id
      tableDataTotal: 0, // 公司弹窗列表总数
      tableData: [],
      watchChange: {
        companyChange: false
      },
      companyHasSubAccount: 1,
      doCreateBtn: false, // 判断是否为新增按钮
      doCopy: false, // 判断是否为复制按钮
      deleteList: false, // 判断是否为删除按钮
      doFirst: false, // 判断是否为首条
      doPrevious: false, // 判断是否为上一条
      doNext: false, // 判断是否为下一条
      doEnd: false, // 判断是否为末条
      select_loading: false, // 远程搜索
      select_list: [],
      isAccountEntity: null,
      doSelect: false,
      isDel: false // 是否删除
    }
  },
  created () {
    this.doGetUnitFormId()
    this.getRouteData()
  },
  mixins: [saasMixin],
  components: {
    CommonIcon,
    nodata
  },
  watch: {
    // 监听公司
    companyInput (now, ago) {
      // console.log(this.changeContext)
      if (now === this.doHistory.companyInput) {
        this.watchChange.companyChange = false
      } else {
        if (this.doSelect) {
          this.watchChange.companyChange = true
        } else {
          this.watchChange.companyChange = false
        }
      }
    },
    changeContext (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    // 获取路由数据
    getRouteData () {
      if (this.$route.query.id !== null) {
        this.doInit()
      }
    },
    // 获取业务单元
    doGetUnitFormId () {
      this.loading = true
      this.$request.post('/financeback/businessUnit/findFormList').then(result => {
        this.loading = false
        let { code, data } = result.data
        if (code === 200) {
          let _data = [{
            value: 0,
            label: '全部形态'
          }]
          let _list = []
          data.forEach(item => {
            _data.push({
              value: item.id,
              label: item.name
            })
            _list.push({
              value: item.id,
              label: item.name
            })
          })
          this.formList = _data
          this.companyFormList = _list
        }
      })
    },
    // 初始化
    async doInit () {
      this.loading = true
      this.unitId = this.$route.query.id
      let _res = await this.$request.post('/financeback/sysMenuOption/findMenuOption', { menuCode: 'element_index' }).then(res => {
        const { status, data } = res.data
        if (status === 'success' && data.localMenuOptionList.length) {
          this.codeType = data.localMenuOptionList[0].optionValue
          return this.codeType
        }
      })
      if (_res) {
        this.$request.post('/financeback/businessUnit/findBusinessUnitById', { id: this.unitId }).then(res => {
          this.loading = false
          let { status, data } = res.data
          if (status === 'success') {
            this.companyInput = data.companyName
            this.codeInput = data.code
            this.companyName = data.name
            this.unitId = data.id
            this.getCompanyId = data.companyId
            this.formInit = data.unitFormId
            this.isRef = data.isRef
            this.isEnable = data.isEnable
            this.companyHasSubAccount = data.companyHasSubAccount
            this.isAccountEntity = data.isAccountEntity
            this.isDel = data.isDel
            if (data.companyHasSubAccount) {
              this.single = true
            } else {
              this.single = false
            }
            this.doHistory = {
              companyInput: this.companyInput,
              companyName: this.companyName,
              formInit: this.formInit,
              getCompanyId: this.getCompanyId,
              single: this.single
            }
            setTimeout(() => {
              this.remoteMethod()
            }, 10)
          }
        })
      }
    },
    doChangeData () {
      this.changeContext = true
    },
    doChangeAcountingBody () {
      console.log(this.single)
    },
    // alert 提示
    alertClose () {
      this.alertShow = false
    },
    companyChange (val) {
      if (this.companyInput === undefined) {
        this.doChangeData()
      } else {
        this.doChangeData()
      }
      if (!this.companyInput) {
        this.select_list = []
      }
    },
    // 归属公司远程搜索
    remoteMethod (search) {
      if (search !== '') {
        this.select_loading = true
        this.$request.post('/financeback/company/findCompanyPage', {
          codeOrName: search,
          page: {
            size: 999
          }
        }).then(res => {
          this.select_loading = false
          if (res.data.code === 200) {
            this.$nextTick(() => {
              this.select_list = res.data.data.records
              if (this.select_list.length) {
                if (this.select_list.length === 1) {
                  this.doSelect = true
                  this.companyInput = this.select_list[0].name
                  this.getCompanyId = this.select_list[0].id
                  this.hasSubAccount = this.select_list[0].hasSubAccount
                  if (this.hasSubAccount) {
                    this.single = true
                  } else {
                    this.single = false
                  }
                }
              }
            })
          } else {
            this.select_list = []
          }
        })
      }
    },
    // 公司输入框右边图标的点击事件
    doSelectCompany () {
      this.modal10 = true
      this.titleName = '选择公司'
      this.promptMessage = '公司编码或名称'
      let unitFormId = this.formList.filter(item => item.value === this.formInitCom)
      if (unitFormId[0].value) {
        let size = this.page.size
        let current = this.page.current
        let reqDate = {
          companyFormId: unitFormId[0].value,
          codeOrName: this.companySearch,
          page: {
            size: size,
            current: current
          }
        }
        this.$request.post('/financeback/company/findCompanyPage', reqDate).then(result => {
          let { status, data } = result.data
          if (status === 'success') {
            let _fromData = []
            data.records.forEach(item => {
              _fromData.push({
                code: item.code,
                name: item.name,
                address: this.formList.filter(val => val.value === item.companyFormId)[0].label,
                companyId: item.id,
                hasSubAccount: item.hasSubAccount
              })
            })
            this.tableData = _fromData
            this.tableDataTotal = data.total
          } else {
            this.tableData = []
            this.tableDataTotal = 0
          }
        })
      } else {
        let size = this.page.size
        let current = this.page.current
        let reqDate = {
          codeOrName: this.companySearch,
          page: {
            size: size,
            current: current
          }
        }
        this.$request.post('/financeback/company/findCompanyPage', reqDate).then(result => {
          let { status, data } = result.data
          if (status === 'success') {
            let _fromData = []
            data.records.forEach(item => {
              _fromData.push({
                code: item.code,
                name: item.name,
                address: this.formList.filter(val => val.value === item.companyFormId)[0].label,
                companyId: item.id,
                hasSubAccount: item.hasSubAccount
              })
            })
            this.tableData = _fromData
            this.tableDataTotal = data.total
          }
        })
      }
    },
    // 切换形态 -- 公司弹窗
    typeChange () {
      this.page.current = 1
      this.doSelectCompany()
    },
    // 搜索 -- 公司弹窗
    doSearchCompay () {
      this.doSelectCompany()
    },
    doEleChang () {
      if (this.companySearch === '') {
        this.doSelectCompany()
      }
    },
    // 保存
    doSave (getdata) {
      this.saveLoading = true
      let req = {}
      if (this.watchChange.companyChange) {
        this.watchChange.companyChange = false
        req = {
          companyId: this.getCompanyId,
          name: this.companyName,
          unitFormId: this.formInit,
          id: this.unitId,
          isEnterpriseAdmin: 1,
          isAccountEntity: this.isAccountEntity,
          version: 0
        }
      } else {
        req = {
          name: this.companyName,
          unitFormId: this.formInit,
          id: this.unitId,
          isEnterpriseAdmin: 1,
          isAccountEntity: this.isAccountEntity,
          version: 0
        }
      }
      if (this.companyInput && this.companyName && this.formInit) {
        return this.$request.post('/financeback/businessUnit/updateBusinessUnit', req).then(res => {
          this.saveLoading = false
          this.alertShow = true
          let { status, data } = res.data
          if (status === 'success') {
            this.changeContext = false
            this.types = 'success'
            this.successContent = '保存成功'
            this.isColor = true
            this.istest = '*'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
            this.doHistory = {
              companyInput: this.companyInput,
              companyName: this.companyName,
              formInit: this.formInit,
              getCompanyId: this.getCompanyId
            }
            this.codeInput = data.code
            this.isRef = data.isRef
            if (getdata === 5) {
              this.$router.push({ name: 'create_element' })
              return
            } else {
              this.$router.push({ name: 'update_element', query: { id: data.id } })
            }
            this.doChangeString(data)
            switch (getdata) {
              case 1:
                this.findFirst()
                break
              case 2:
                this.findPrevious()
                break
              case 3:
                this.findNext()
                break
              case 4:
                this.findEnd()
                break
              default:
                break
            }
            return true
          } else {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '操作异常，保存失败'
            this.istest = '*'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
            return false
          }
        })
      } else {
        this.saveLoading = false
        this.alertShow = true
        this.types = 'error'
        this.isColor = false
        this.successContent = '保存失败，请输入必填字段!'
        setTimeout(() => {
          this.alertShow = false
        }, 3000)
        return false
      }
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '消息提示',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.doSave()
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
    },
    // 取消
    cancelBtn () {
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '取消操作会重置当前表单，是否继续?',
        button: ['确定', '取消'],
        yes () {
          that.getRouteData()
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 新增
    toAddBtn () {
      if (this.changeContext) {
        this.doCreateBtn = true
        let that = this
        this.$Control({
          type: 'control',
          title: '消息提示',
          message: '当前数据已修改，需要保存吗？',
          button: ['是', '否', '取消'],
          yes () {
            that.doSave(5)
            that.$CloseCtl()
          },
          no () {
            that.$router.push({ name: 'create_element', params: { doclear: true } })
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        this.$router.push({ name: 'create_element', params: { doclear: true } })
      }
    },
    // 复制
    doCopyBtn () {
      this.doCopy = true
      if (this.changeContext) {
        let that = this
        this.$Control({
          type: 'control',
          title: '消息提示',
          message: '当前数据已修改，需要保存吗？',
          button: ['是', '否', '取消'],
          yes () {
            that.doSave()
            let _data = {
              companyInput: that.companyInput,
              formInit: that.formInit,
              companyId: that.getCompanyId,
              single: that.single
            }
            that.$router.push({ name: 'create_element', params: _data })
            that.$CloseCtl()
          },
          no () {
            let _data = {
              companyInput: that.doHistory.companyInput,
              formInit: that.doHistory.formInit,
              companyId: that.doHistory.getCompanyId,
              single: that.doHistory.single
            }
            that.$router.push({ name: 'create_element', params: _data })
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else {
        let _data = {
          companyInput: this.companyInput,
          formInit: this.formInit,
          companyId: this.getCompanyId,
          single: this.single
        }
        this.$router.push({ name: 'create_element', params: _data })
      }
    },
    // 删除弹框
    showDelModal () {
      let that = this
      that.$Control({
        type: 'confirm',
        title: '消息提示',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$request.post('/financeback/businessUnit/deleteBatch', { idList: [that.unitId] }).then(res => {
            let { status, message } = res.data
            if (status === 'success') {
              that.changeContext = false
              that.deleteList = false
              that.$Message.success('删除成功！')
              that.findNext('delete')
            } else {
              that.$Message.error(message)
            }
          })
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 删除
    deleteElement () {
      this.deleteList = true
      this.showDelModal()
    },
    // 列表
    goElementList () {
      this.doLocationDetail('element_index')
    },
    // 翻页跳出模态框
    doPageModal (data) {
      let that = this
      this.$Control({
        type: 'control',
        title: '消息提示',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.doSave(data)
          setTimeout(() => {
            that.changeContext = false
          }, 20)
          that.$CloseCtl()
        },
        no () {
          that.companyInput = that.doHistory.companyInput
          that.companyName = that.doHistory.companyName
          that.select_list = [{
            name: that.doHistory.companyInput,
            label: 1
          }]
          that.formInit = that.doHistory.formInit
          that.single = that.doHistory.single
          console.log(that.companyInput)
          setTimeout(() => {
            that.changeContext = false
          }, 20)
          setTimeout(() => {
            switch (data) {
              case 1:
                that.findFirst()
                break
              case 2:
                that.findPrevious()
                break
              case 3:
                that.findNext()
                break
              case 4:
                that.findEnd()
                break
              default:
                break
            }
          }, 30)
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 首条
    findFirst () {
      if (this.changeContext) {
        this.doFirst = true
        this.doPageModal(1)
      } else {
        let _num = this.doFindPage(1, this.$route.query.id)
        console.log(_num)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/businessUnit/findBusinessUnitById', { id: _num }).then(res => {
            this.loading = false
            let { status, data } = res.data
            if (status === 'success') {
              this.doChangeString(data)
            }
          })
        }
      }
    },
    // 上一条
    findPrevious () {
      if (this.changeContext) {
        this.doPrevious = true
        this.doPageModal(2)
      } else {
        let _num = this.doFindPage(2, this.$route.query.id)
        if (_num === '当前为首条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/businessUnit/findBusinessUnitById', { id: _num }).then(res => {
            this.loading = false
            let { status, data } = res.data
            if (status === 'success') {
              this.doChangeString(data)
            }
          })
        }
      }
    },
    // 下一条
    findNext (type) {
      if (this.changeContext) {
        this.doNext = true
        this.doPageModal(3)
      } else {
        let _num = this.doFindPage(3, this.$route.query.id, type)
        if (_num === '当前为末条') {
          return false
        } else if (_num === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          setTimeout(() => {
            this.closeTag({ route: this.$route })
          }, 3000)
        } else {
          this.loading = true
          this.$request.post('/financeback/businessUnit/findBusinessUnitById', { id: _num }).then(res => {
            this.loading = false
            let { status, data } = res.data
            if (status === 'success') {
              this.doChangeString(data)
            }
          })
        }
      }
    },
    // 尾条
    findEnd () {
      if (this.changeContext) {
        this.doEnd = true
        this.doPageModal(4)
      } else {
        let _num = this.doFindPage(4, this.$route.query.id)
        if (_num === '当前为末条') {
          return false
        } else {
          this.loading = true
          this.$request.post('/financeback/businessUnit/findBusinessUnitById', { id: _num }).then(res => {
            this.loading = false
            let { status, data } = res.data
            if (status === 'success') {
              this.doChangeString(data)
            }
          })
        }
      }
    },
    // 数据转换
    doChangeString (data) {
      if (data) {
        let _data = {
          id: data.id
        }
        this.$router.push({ name: 'update_element', query: { id: data.id } })
        this.loading = true
        this.$request.post('/financeback/businessUnit/findBusinessUnitById', _data).then(res => {
          this.loading = false
          let { status, data } = res.data
          if (status === 'success') {
            if (this.doFirst || this.doPrevious || this.doNext || this.doEnd) {
              this.doFirst = false
              this.doPrevious = false
              this.doNext = false
              this.doEnd = false
            } else {
              // this.$Message.success('保存成功')
              this.doContinueActions()
            }
            setTimeout(() => {
              this.remoteMethod()
            }, 10)
            this.companyInput = data.companyName
            this.codeInput = data.code
            this.companyName = data.name
            this.unitId = data.id
            this.getCompanyId = data.companyId
            this.formInit = data.unitFormId
            this.isRef = data.isRef
            this.isEnable = data.isEnable
            this.isDel = data.isDel
            this.watchChange.companyChange = false
            this.doHistory = {
              companyInput: this.companyInput,
              companyName: this.companyName,
              formInit: this.formInit,
              getCompanyId: this.getCompanyId
            }
            setTimeout(() => {
              this.changeContext = false
            }, 20)
          } else {
            console.log('请求错误')
          }
        })
      }
    },
    // 分页功能
    doUpdateCurrentPage (val) {
      this.page.current = val
      this.doSelectCompany()
    },
    doUpdatePageSize (val) {
      this.page.size = val
      this.doUpdateCurrentPage(1)
    },
    // 帮助信息提示
    helpHover () {
      this.isActive = true
    },
    loseHover () {
      this.isActive = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
.formAdd {
  margin-left: 50px;
  margin-top: 20px;
  .ivu-form-item{
    margin-bottom: 7.7px;
  }
  // 必填项
  .istest {
    position: absolute;
    display: inline-block;
    width: 30px;
    margin-left: 9px;
    line-height: 35px;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
}
.page-footer-lf {
  text-align: left
}
.icon_help{
  position: absolute;
  top: 8px;
  right: -24px;
  font-size: 16px;
  cursor:pointer;
}
.icon_help_nofocus{
  color: #d7d7d7;
}
.icon_help_focus{
  color: @warning ;
}
.retrieval_inf{
  position: absolute;
  right: -90px;
  cursor: pointer;
  color: #00A497;
}
.query-change {
  position: relative;
  left: -8px
}
.ivu-input-group {
  top:0px
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
</style>
<style lang="less">
@import "./title.less";
</style>
