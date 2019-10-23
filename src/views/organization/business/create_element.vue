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
    <Spin fix v-if="saveLoading2" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>数据保存中</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">新增业务单元</div>
      <div class="page-header-actions">
        <Button type="primary" v-if="saveLoading"><img src="../../../assets/images/loading.gif"></Button>
        <Button type="primary" v-else @click="doSave">保存</Button>
        <Button v-if="saveLoading2"><img src="../../../assets/images/loading.gif"></Button>
        <Button v-else @click="doSaveAdd">保存并新增</Button>
        <Button @click="cancelBtn">取消</Button>
        <Button @click="goElementList">列表</Button>
      </div>
    </section>
    <Alert :type="types" show-icon v-if="alertShow" closable @on-close="alertClose" class="company_alert" :class="{success_color: isColor,error_color: !isColor}">
      <common-icon type="_warn" slot="icon" class="icon_warn"></common-icon>
      {{successContent}}
    </Alert>
    <section class="page-content">
      <Form :model="authField" :label-width="110"  class="formAdd">
        <Row>
          <Col span="6">
            <FormItem label="公司" prop="company">
              <RadioSelect :config="table_config" :close="close_modal" v-model="companyInput" :reset="table_config.refresh"
                           @getData="handleGetData" @change="handleChange">
                <div slot="header">
                  <div>
                    <Row :gutter="10">
                      <Col span="4" class="form-query">
                        <Select v-model="table_config.request_params.companyFormId" @on-change="queryCompany" placeholder="全部形态">
                          <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                        </Select>
                      </Col>
                      <Col span="8" class="query-condition">
                        <Input autocomplete="on" clearable v-model="table_config.request_params.codeOrName" placeholder="公司编码或名称"
                               @on-enter="queryCompany" @on-clear="queryCompany">
                          <Button slot="append" icon="ios-search" @click="queryCompany"></Button>
                        </Input>
                      </Col>
                      <Col span="4">
                        <Button @click="queryCompany('reset')">重置</Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </RadioSelect>
              <span class="require-flag">*</span>
            </FormItem>
          </Col>
          <Col span="6" >
            <FormItem label="编码" class="codeForm" v-if="codeType === '0'">
              <Input disabled placeholder="自动编码"></Input>
              <Poptip content="content" placement="top" trigger="hover" class="me_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="" slot="content" >说明:编码规则为公司编码+3位流水码</div>
              </Poptip>
            </FormItem>
            <FormItem label="编码" class="codeForm" v-if="codeType === '1'">
              <Input placeholder="自定义编码" v-model="elementCode" :maxlength="10"></Input>
              <span class="istest">*</span>
              <Poptip content="content" placement="top" trigger="hover" class="me_poptip" @on-popper-show="helpHover" @on-popper-hide="loseHover">
                <Icon class="icon_help" style="right: -30px;" type="md-help-circle" size="16" :class="{icon_help_nofocus: !isActive,icon_help_focus: isActive}"/>
                <div class="" slot="content" >说明:编码规则为10位以内数字或英文字母，不含特殊符号，不能重复</div>
              </Poptip>
              <span class="repeat" v-show="isCodeRepeat">重复</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="名称" prop="company_name" label-for="companyName">
              <Input v-model="companyName" :maxlength=50 @on-change="doChangeData" element-id="companyName"></Input>
              <span class="istest">{{ istest }}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="形态" prop="morphology">
              <Select v-model='formInit' @on-change="doChangeData">
                <Option v-for="item in companyFormList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span class="istest">*</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
          <FormItem label="核算主体">
            <Checkbox v-model="isAcountingBody" @on-change="doChangeAcountingBody" disabled></Checkbox>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
  </section>
</template>

<script type="text/jsx">
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'

export default {
  name: 'create_element',
  data () {
    return {
      hasSubAccount: 0,
      isAccounting: 0,
      isAcountingBody: true,
      loading: false,
      saveLoading: false,
      saveLoading2: false,
      isCodeRepeat: false,
      isActive: false,
      isCodeNode: false, // 编码右边问号按钮的点击说明
      alertShow: false, // alert 弹窗提示
      close_modal: false, // 公司单选框
      changeContext: false,
      doSelect: false, // 公司选择
      doCalcel: false,
      successContent: '', // alert 显示的内容
      types: '', // alert 的类型（成功，失败）
      codeType: '',
      elementCode: '',
      istest: '*', // 名称后的 提示
      companyInput: '', // 公司输入框的内容
      companyName: '',
      getCompanyId: 0, // 获取公司id
      companyCode: '',
      formInit: 3,
      select_list: [],
      formList: [],
      companyFormList: [],
      tableData: [],
      isColor: null, // alert 的颜色
      authField: {
        desc: ''
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
        width: '100%', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          companyFormId: null,
          menuCode: 'element_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      }
    }
  },
  created () {
    this.doGetUnitFormId()
    this.doInit()
  },
  mixins: [saasMixin],
  components: {
    CommonIcon,
    RadioSelect
  },
  watch: {
    changeContext (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    // 公司单选弹框查询
    queryCompany (param) {
      if (this.table_config.request_params.companyFormId === 0) {
        this.table_config.request_params.companyFormId = null
      }
      if (param === 'reset') {
        this.table_config.request_params.codeOrName = ''
        this.table_config.request_params.companyFormId = null
      }
      this.table_config.refresh = !this.table_config.refresh
    },
    // 获取形态列表
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
    // 初始化 - 从查看页面携带参数
    async doInit () {
      this.loading = true
      let _res = await this.$request.post('/financeback/sysMenuOption/findMenuOption', { menuCode: 'element_index' }).then(res => {
        this.loading = false
        const { status, data } = res.data
        if (status === 'success' && data.localMenuOptionList.length) {
          this.codeType = data.localMenuOptionList[0].optionValue
          return this.codeType
        }
      })
      if (_res) {
        if (this.$route.params.formInit) {
          this.companyInput = this.$route.params.companyInput
          this.formInit = this.$route.params.formInit
          this.getCompanyId = this.$route.params.companyId
          // this.single = this.$route.params.single
        } else {
          if (this.$route.params.doclear) {
            this.formInit = 3
            this.companyInput = ''
            this.companyName = ''
          }
        }
      }
    },
    // 改变公司
    companyChange (val) {
      if (this.companyInput === undefined) {
      } else {
        this.doChangeData()
      }
      if (!this.companyInput) {
        this.select_list = []
      }
    },
    // 核算主体 - 现为禁用状态
    doChangeAcountingBody () {
      // console.log(this.single)
    },
    // 数据改变
    doChangeData () {
      this.changeContext = true
    },
    // alert 保存弹窗提示
    alertClose () {
      this.alertShow = false
    },
    // 必填字段提示
    showRequired () {
      this.alertShow = true
      this.types = 'error'
      this.isColor = false
      this.successContent = '保存失败，请输入必填字段!'
      setTimeout(() => {
        this.alertShow = false
      }, 3000)
    },
    // 保存验证
    doAddValidate () {
      this.saveLoading = true
      let req = {
        companyId: this.getCompanyId,
        companyCode: this.companyCode,
        name: this.companyName,
        unitFormId: this.formInit,
        isAccountEntity: this.isAcountingBody ? 1 : 0,
        unitFormName: this.companyFormList.filter(val => val.value === this.formInit)[0].label,
        isAutoCode: 0,
        isEnterpriseAdmin: 1,
        hasSubAccount: this.hasSubAccount,
        isAccounting: this.isAccounting
      }
      if (this.codeType === '1') {
        req.code = this.elementCode
        req.isAutoCode = 1
      }
      this.$request.post('/financeback/businessUnit/addBusinessUnit', req).then(res => {
        this.saveLoading = false
        let { status, code, data } = res.data
        if (status === 'success') {
          this.$Message.success('保存成功！')
          this.types = 'success'
          this.successContent = '保存成功'
          this.isColor = true
          this.istest = '*'
          this.changeContext = false
          setTimeout(() => {
            this.alertShow = false
          }, 3000)
          this.companyInput = ''
          this.companyName = ''
          this.formInit = 3
          // 向状态机中加一条数据
          this.addIdToList({ id: data.id, name: 'element' })
          this.$router.push({ name: 'update_element', query: { id: data.id } })
          return true
        } else {
          if (code === 10009) {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '【公司】下【名称】已存在，不能重复增加'
            this.istest = '重复'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          } else if (code === 10008) {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '【公司】下【编码】已存在，不能重复增加'
            this.isCodeRepeat = true
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          } else {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '操作异常，保存失败'
            this.istest = '*'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          }
        }
      })
    },
    // 保存
    doSave () {
      this.isCodeRepeat = false
      if (this.companyInput && this.companyName && this.formInit) {
        if (this.codeType === '0') {
          this.doAddValidate()
          return
        }
        if (this.elementCode && this.codeType === '1') {
          if (!/^[0-9a-zA-Z]+$/.test(this.elementCode)) {
            this.$Message.error('编码格式错误')
          } else if (this.elementCode.length > 10) {
            this.$Message.error('内容格式错误,请输入10位数字或英文字母')
          } else {
            this.doAddValidate()
          }
        } else {
          this.showRequired()
        }
      } else {
        this.showRequired()
      }
    },
    // 保存并新增
    doSaveAdd () {
      this.isCodeRepeat = false
      if (this.companyInput && this.companyName && this.formInit) {
        if (this.codeType === '0') {
          this.doSaveAndAdd()
          return
        }
        if (this.elementCode && this.codeType === '1') {
          if (!/^[0-9a-zA-Z]+$/.test(this.elementCode)) {
            this.$Message.error('编码格式错误')
          } else if (this.elementCode.length > 10) {
            this.$Message.error('内容格式错误,请输入10位数字或英文字母')
          } else {
            this.doSaveAndAdd()
          }
        } else {
          this.showRequired()
        }
      } else {
        this.showRequired()
      }
    },
    // 保存并新增验证
    doSaveAndAdd () {
      this.saveLoading2 = true
      let req = {
        companyId: this.getCompanyId,
        companyCode: this.companyCode,
        name: this.companyName,
        unitFormId: this.formInit,
        isAccountEntity: this.isAcountingBody ? 1 : 0,
        unitFormName: this.companyFormList.filter(val => val.value === this.formInit)[0].label,
        isEnterpriseAdmin: 1,
        isAutoCode: 0,
        hasSubAccount: this.hasSubAccount,
        isAccounting: this.isAccounting
      }
      if (this.codeType === '1') {
        req.code = this.elementCode
        req.isAutoCode = 1
      }
      this.$request.post('/financeback/businessUnit/addBusinessUnit', req).then(res => {
        this.saveLoading2 = false
        let { status, code, data } = res.data
        if (status === 'success') {
          // 向状态机中加一条数据
          this.addIdToList({ id: data.id, name: 'element' })
          this.alertShow = true
          this.types = 'success'
          this.successContent = '保存成功'
          this.isColor = true
          this.companyInput = ''
          this.companyName = ''
          this.formInit = 3
          this.istest = '*'
          this.changeContext = false
          setTimeout(() => {
            this.alertShow = false
          }, 3000)
          if (this.doCalcel) {
            this.doCalcel = false
          } else {
            this.$Message.success('保存成功')
            this.doContinueActions()
          }
        } else {
          if (code === 10009) {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '【公司】下【名称】已存在，不能重复增加'
            this.istest = '重复'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          } else if (code === 10008) {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '【公司】下【编码】已存在，不能重复增加'
            this.isCodeRepeat = true
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          } else {
            this.alertShow = true
            this.types = 'error'
            this.isColor = false
            this.successContent = '操作异常，保存失败'
            this.istest = '*'
            setTimeout(() => {
              this.alertShow = false
            }, 3000)
          }
        }
      })
    },
    // 取消
    cancelBtn () {
      this.doCalcel = true
      if (this.changeContext) {
        this.doShowEditModal()
      } else {
        this.companyInput = ''
        this.companyName = ''
        this.formInit = 3
        this.istest = '*'
      }
    },
    // 跳转到业务单元的列表页
    goElementList () {
      this.doLocationDetail('element_index')
    },
    // 弹窗是否取消
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '消息提示',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.doSaveAndAdd()
          that.$CloseCtl()
        },
        no () {
          if (that.doCalcel) {
            that.doCalcel = false
          } else {
            that.doContinueActions()
          }
          that.isCodeRepeat = false
          that.companyInput = ''
          that.companyName = ''
          that.formInit = 3
          that.istest = '*'
          that.changeContext = false
          if (that.codeType === '1') {
            that.elementCode = ''
          }
          that.$CloseCtl()
        },
        cancel () {
          that.$CloseCtl()
        },
        close (type) {
          if (!type) {
            // console.log('组件关闭')
          }
        }
      })
    },
    // 帮助信息提示
    helpHover () {
      this.isActive = true
    },
    loseHover () {
      this.isActive = false
    },
    handleGetData (data, row) {
      this.table_config.request_params.codeOrName = ''
      this.table_config.request_params.companyFormId = null
      this.companyInput = data.name
      this.getCompanyId = data.id
      if (row) {
        this.companyCode = row.code
        this.isAcountingBody = !!row.hasSubAccount
        this.hasSubAccount = row.hasSubAccount
        this.isAccounting = row.isAccounting
      }
    },
    handleChange () {}
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
  .istest{
    position: absolute;
    display: inline-block;
    width: 30px;
    margin-left: 9px;
    line-height: 35px;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }
  .require-flag {
    position: absolute;
    top: 0;
    right: -15px;
    display: inline-block;
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
</style>
<style lang="less">
@import "./title.less";
.append-container {
  .repeat{
    position: absolute;
    display: inline-block;
    width: 48px;
    margin-left: 34px;
    line-height: 33px;
    font-family: SimSun;
    color: #ed4014;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
}
.form-query {
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
    color: rgba(51, 51, 51, 0.85)
  }
}
</style>
