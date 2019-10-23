// 查看基本信息
<template>
  <div class="basic">
    <Form ref="formValidate" :model="basic" :rules="ruleValidate" :label-width="120" class="form_init basic-form">
      <Row>
        <Col span="12" >
          <FormItem label="创建公司">
            <!-- <Input v-model="basic.companyName" disabled ></Input> -->
            <Input value="集团" disabled ></Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="会计准则">
            <Input v-model="basic.subjectName" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="上级编码">
            <Row>
              <Col span="11" class="input_after">
              <FormItem prop="upCode" class="ivu-from-accountant-upcode">
                <!-- @getData="doGetAccount" -->
                <radio-select :config="accountant_config" v-model="accountantValue"
                :confirm="true"
                :close="isAccountantClose"
                @change="doAccountantClear"
                @confirmData="doGetAccount"
                @on-close="doResetUpSubject"
                placeholder=""
                :reset="accountant_config.refresh"
                :disabled="unFinal || unInterior || unRelation || RelationUnInit || isDisabel || isDelete"
                >
                  <div slot="header" class="modal-header">
                    <Row :gutter="8" class="no-error-modal">
                      <Col span="4">
                        <Select value="1" class="modal-header-input" disabled>
                          <Option value="1" label="已生效"></Option>
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select v-model="accountElementItemValue" class="modal-header-input" @on-change="doChangeElementItem(accountElementItemValue, doReSearch)">
                          <Option value="all" label="全部会计要素"></Option>
                          <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select v-model="subjectCategoryValue"  class="modal-header-input" @on-change="doChangeCategoryList(subjectCategoryValue, 'accountElementItemValue', doReSearch)">
                          <Option value="all" label="全部科目类别"></Option>
                          <Option :value="item.id" :label="item.name" v-for="item in subjectCategoryList" :key="item.id"></Option>
                        </Select>
                      </Col>
                      <Col span="8">
                        <Input v-model="accountant_config.request_params.codeOrName"
                        class="search-button"
                        @on-clear="doReSearch"
                        @on-enter="doReSearch"
                        placeholder="会计科目编码/名称" clearable>
                          <Button slot="append" icon="ios-search" @click="accountant_config.refresh = !accountant_config.refresh"></Button>
                        </Input>
                      </Col>
                      <Col span="2">
                        <Button style="margin-left: 3px;" class="reset-button" @click="doResetUpSubject">重置</Button>
                      </Col>
                    </Row>
                  </div>
                </radio-select>
              </FormItem>
              </Col>
              <Col span="12" class="input_after basic-formitem-input">
                <FormItem prop="upName">
                  <Input v-model="basic.upName" disabled></Input>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="会计要素">
            <Input v-model="basic.accountElementItemName" @on-change="dochange" disabled></Input>
          </FormItem>
        </Col>
      </Row>
       <Row>
        <Col span="12">
          <FormItem label="科目编码" >
            <Row>
              <Col span="11" class="input_after">
                <Input v-model="basic.upCode" disabled ></Input>
              </Col>
              <Col span="12" class="input_after basic-formitem-input">
                <FormItem prop="subCode">
                  <Input v-model="basic.subCode" @on-change="dochange" :disabled="unFinal || unInterior || unRelation || RelationUnInit || isDisabel || isDelete"></Input>
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="科目类别">
            <Input v-model="basic.subjectCategoryName" disabled></Input>
          </FormItem>
        </Col>
      </Row>
       <Row>
        <Col span="12" class="input_after">
          <FormItem label="科目名称" prop="name">
            <Input v-model="basic.name" @on-change="dochange" :disabled="unFinal || unInterior || unRelation || RelationUnInit || isDisabel || isDelete" :maxlength=50></Input>
          </FormItem>
        </Col>
        <Col span="12" >
          <FormItem label="分类">
            <RadioGroup v-model="basic.accountCategory" @on-change="dochange" disabled>
              <Radio label="A01" disabled>现金科目</Radio>
              <Radio label="A02" class="basic-balance" disabled>银行科目</Radio>
              <Radio label="A03" class="basic-balance" disabled>现金等价物</Radio>
              <Radio label="B01" class="basic-balance basic_float" disabled>一般科目</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="余额方向" prop="balanceDirection">
            <Select v-model="basic.balanceDirection" @on-change="dochange" disabled>
              <Option value='0' label="借方">借方</Option>
              <Option value='1' label="贷方">贷方</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12" >
          <FormItem label="核算币种">
            <!-- <Input v-model="basic.currencyNames" disabled ></Input> -->
            <Input value="人民币" disabled ></Input>
          </FormItem>
        </Col>
      </Row>
      <div class="basic-title"><span class="box-background"></span>现金流量项目预设</div>
      <Row>
        <Col span="12">
          <FormItem label="现金流入">
            <select-cashflow-modal state="1" direction = "1" :defaultValue="basic.cashInflowName" :disabled="unFinal || unInterior || isDisabel || isDelete"
            @getGroup="doGetGroupData" @getCashFlow="doGetCashFlowIn">
            </select-cashflow-modal>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="现金流出">
            <select-cashflow-modal state="1" direction = "0" :defaultValue="basic.cashOutflowName" :disabled="unFinal || unInterior || isDisabel || isDelete"
            v-if="iscashOutflag" :requestGroup="false" :groupData="groupData" @getCashFlow="doGetCashFlowOut">
            </select-cashflow-modal>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { saasMixin } from '@/libs/mixins.js'
import { Validation } from '@/libs/util.js'
import RadioSelect from '_c/radio-select'
import SelectCashflowModal from './selectCashflow.vue'
export default {
  components: {
    RadioSelect,
    SelectCashflowModal
  },
  data () {
    return {
      // 界面展示数据
      basic: {},
      groupData: [],
      isAccountantClose: false,
      iscashOutflag: false,
      isChanged: false, // 数据变化标志
      isRulePass: true, // 表单验证标志
      changed: false, // 是否改变表单值
      isEnable: this.$route.query.isEnable,
      accountantValue: '', // 上级编码绑定值
      balanceDirection: '', // 余额方向
      // 会计科目引入资料单选
      accountant_config: {
        type: 'subject',
        title: '选择会计科目',
        width: '100%',
        refresh: false,
        request_params: {
          baseSubjectId: this.subjectId,
          ifFindCouldInsertFlag: true,
          isEnable: 1, // 已启用
          codeOrName: ''
        }
      },
      ruleValidate: {
        subCode: [
          { required: true, validator: Validation.accountCodeRule, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: Validation.accountNameRule, trigger: 'blur' }
        ],
        upCode: [
          { required: true, validator: Validation.upCode, trigger: 'change' }
        ],
        upName: [
          { required: true, validator: Validation.notEmptyRule, trigger: 'blur' }
        ],
        balanceDirection: [
          { required: true, validator: Validation.notEmptyRule, trigger: 'change' }
        ]
      },
      fullName: ''
    }
  },
  props: {
    basicInfo: {
      default: null,
      type: Object
    }
  },
  mixins: [saasMixin],
  computed: {
    /**
     * 是否末级
     * isFinal 0 非末级 不能编辑
     * msg：非末级不能编辑
     */
    unFinal () {
      // 非末级科目的所有字段都不可编辑，包含现金流量项目预设和辅助核算
      return this.basicInfo.isFinal === 0
      // return false
    },
    /**
     * 内部往来
     * isInterior 1 内部往来数据 不能编辑
     * msg：内部往来项目不能编辑
     */
    unInterior () {
      // 内部往来科目的所有字段都不可编辑，包含现金流量项目预设和辅助核算
      return this.basicInfo.isInterior === 1
      // return false
    },
    /**
     * 存在引用关系
     * isRelation 引用 false 未引用，true 引用
     * msg：存在引用关系不能编辑
     */
    unRelation () {
      // 现金流量项目预设的现金流入和现金流出可以编辑，其余所有字段不可编辑
      return this.basicInfo.isCited === 1
      // return false
    },
    /**
     * 未引用系统预置
     * msg：系统预置不能编辑
     */
    RelationUnInit () {
      // 现金流量项目预设的现金流入和现金流出、辅助核算可以编辑，其余字段都不可编辑
      return this.basicInfo.isCited !== 1 && this.basicInfo.isInit === 1
      // return false
    },
    /**
     * 未引用非系统预置，同新增页面
     */
    /**
     * 禁用状态
     */
    isDisabel () {
      return this.basicInfo.isEnable === 0
    },
    /**
     * 被删除
     */
    isDelete () {
      return this.basicInfo.isDel === 1
    }
  },
  watch: {
    basicInfo () {
      this.$set(this, 'basic', this.basicInfo)
      this.$set(this, 'accountantValue', this.basicInfo.upCode)
      // this.$set(this, 'balanceDirection', `${this.basicInfo.balanceDirection}`)
      this.basic.balanceDirection = `${this.basicInfo.balanceDirection}`
      let subCode = this.basicInfo.level === 1 ? this.basicInfo.code : this.basicInfo.code.split(this.basicInfo.upCode)[1]
      this.$set(this.basic, 'subCode', subCode)
    },
    isChanged (val) {
      this.$emit('getChangeInfo', this.isChanged)
    }
  },
  mounted () {
    this.doGetSubjectScreenList()
  },
  methods: {
    /**
     * 选择上级项目
     */
    async doGetAccount (item) {
      if (item.level >= item.maxLevel.split('-').length) {
        this.$Message.warning('当前数据已达到最大级次，不能新增下级！')
      } else if (item.isInterior === 1) {
        this.$Message.warning('内部往来科目不能新增下级！')
      } else if (item.childNum >= 99) {
        this.$Message.warning('当前下级数据以达到最大99个，无法新增下级!')
      }
      let isCited = await this.$request.post('/financeback/accountSubject/findInfoById', { id: item.id }).then(res => {
        return res.data.data.isCited
      })
      if (isCited === 1) {
        return this.$Message.warning('当前数据已使用，无法新增下级！')
      }
      let req = { upCode: item.code, subjectId: item.subjectId }
      // 检验预置数据能否预置下级
      this.$request.post('/financeback/accountSubject/checkNextInitInfo', req).then(res => {
        if (res.data.code === 200) {
          this.accountantValue = item.code
          if (item.companyId === 0) { item.companyName = '集团' }
          this.basic.fullName = item.fullName.split(item.name).filter(i => i).join(item.name)
          this.$set(this.basic, 'subjectId', item.subjectId)
          this.$set(this.basic, 'subjectName', item.subjectName)
          this.$set(this.basic, 'accountElementItem', item.accountElementItem)
          this.$set(this.basic, 'accountElementItemName', item.accountElementItemName)
          this.$set(this.basic, 'isProfitAndLoss', item.isProfitAndLoss)
          this.$set(this.basic, 'isOffBalance', item.isOffBalance)
          this.$set(this.basic, 'subjectCategory', item.subjectCategory)
          this.$set(this.basic, 'subjectCategoryName', item.subjectCategoryName)
          this.$set(this.basic, 'accountCategory', item.accountCategory)
          this.$set(this.basic, 'isInterior', item.isInterior)
          this.$set(this.basic, 'upCode', item.code)
          this.$set(this.basic, 'upName', item.name)
          this.$set(this.basic, 'level', parseInt(item.level) + 1)
          this.$set(this.basic, 'balanceDirection', `${item.balanceDirection}`)
          this.$emit('getBasic', item)
          this.isAccountantClose = !this.isAccountantClose
        } else {
          this.$Message.error(res.data.message)
        }
      })
    },
    doAccountantClear (val) {
      if (val) {
        if (!val.target.value) {
          this.$set(this, 'accountantValue', '')
          this.$set(this.basic, 'upCode', '')
          this.$route.query.isInterior = ''
          this.$emit('getBasic')
        }
      } else {
        this.$set(this, 'accountantValue', '')
        this.$set(this.basic, 'upCode', '')
        this.$route.query.isInterior = ''
        this.$emit('getBasic')
      }
    },
    doReSearch () {
      this.accountant_config.request_params.accountElementItem = this.accountElementItemValue === 'all' ? null : this.accountElementItemValue
      this.accountant_config.request_params.subjectCategory = this.subjectCategoryValue === 'all' ? null : this.subjectCategoryValue
      this.accountant_config.refresh = !this.accountant_config.refresh
    },
    /**
     * 重置上级科目弹窗
     */
    doResetUpSubject () {
      this.accountant_config.request_params = {
        baseSubjectId: this.subjectId,
        isFinal: 1, // 只显示末级科目
        ifFindCouldInsertFlag: true,
        isEnable: 1, // 已启用
        codeOrName: ''
      }
      this.accountElementItemValue = 'all'
      this.subjectCategoryValue = 'all'
      this.doReSearch()
    },
    /**
     * 请求查询条件
     */
    // doGetGroup () {
    //   this.$request.post('/financeback/accountSubject/findSelectionList').then(({ status, data }) => {
    //     if (status === 200 && data.code === 200) {
    //       this.accountElementItemList = data.data.accountElementItemList // 会计要素
    //       this.subjectCategoryList = data.data.subjectCategoryList // 科目类别
    //       this.subjectAuxiliaryList = data.data.subjectAuxiliaryList // 辅助核算
    //     }
    //   })
    // },
    /**
     * 监控数据变化
     */
    dochange (val) {
      this.isChanged = true
    },
    /**
     * 表单校验规则
     */
    doCheckForm () {
      let rule = []
      if (this.basicInfo.level > 1) {
        rule = [
          { prop: 'upCode', name: '上级编码' },
          { prop: 'upName', name: '上级科目名称' },
          { prop: 'subCode', name: '科目编码' },
          { prop: 'name', name: '科目名称' },
          { prop: 'balanceDirection', name: '科目余额' }
        ]
      } else {
        this.ruleValidate.subCode[0].validator = Validation.levelCode
        console.log('zhnimade')
        rule = [
          { prop: 'subCode', name: '科目编码' },
          { prop: 'name', name: '科目名称' },
          { prop: 'balanceDirection', name: '科目余额' }
        ]
      }
      this.isRulePass = true
      this.doCheckRule(rule, 'isRulePass')
      return this.isRulePass
    },
    /**
     * 检验递归函数
     */
    doCheckRule (propList, flagName) {
      let obj = propList[0] // 拿到要验证的项
      this.$refs['formValidate'].validateField(obj.prop, valid => {
        if (valid) { // 如果有返回值，中止递归
          this[flagName] = false
          return this.$Message.error(`${obj.name}:${valid}`)
        } else if (propList.length > 1) { // 如果没有返回值，并且prop还有值，执行递归
          propList.shift()
          this.doCheckRule(propList, flagName)
        }
      })
    },
    /**
     * 监听现金流入
     */
    doGetCashFlowIn (itemIn) {
      if (itemIn) {
        this.basic.cashFlowId = itemIn.cashFlowId
        this.basic.cashInflowId = itemIn.id
        this.basic.cashInflowCode = itemIn.code
        this.basic.cashInflowName = itemIn.name
      } else {
        this.basic.cashFlowId = null
        this.basic.cashInflowId = null
        this.basic.cashInflowCode = null
        this.basic.cashInflowName = null
      }
      this.isChanged = true
    },
    /**
     * 监听现金流出
     */
    doGetCashFlowOut (itemOut) {
      this.isChanged = true
      if (itemOut) {
        this.basic.cashFlowId = itemOut.cashFlowId
        this.basic.cashOutflowId = itemOut.id
        this.basic.cashOutflowCode = itemOut.code
        this.basic.cashOutflowName = itemOut.name
      } else {
        this.basic.cashFlowId = null
        this.basic.cashOutflowId = null
        this.basic.cashOutflowCode = null
        this.basic.cashOutflowName = null
      }
    },
    /**
     * 监听组件返回的分组信息，并控制组件渲染顺序
     */
    doGetGroupData (data) {
      this.groupData = data
      this.iscashOutflag = true
    }
  }
}
</script>
<style lang="less">
@import '../../../../../assets/css/base.less';
@import '../../../../../assets/css/forminit.less';
.basic-form {
  width: 940px;
  margin-top: 22px;
  .basic-input {
    color: #333333;
  }
  .basic-formitem-input {
    margin-left: 12px;
  }
  .ivu-from-accountant-upcode {
    .ivu-form-item-content {
      &:after {
        content: '' !important;
      }
    }
  }
  .ivu-form-item-error-tip{
    display: none;
  }
  .basic-balance {
    margin-left: 30px !important;
  }
  .basic_float {
    position: absolute;
    margin-top: 2px;
  }
}
// 二级标题样式
.basic-title{
  color: #333;
  font-size: 14px;
  position: relative;
  margin: 10px 0 20px 40px;
  span {
    content: '';
    width: 2px;
    height: 18px;
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.ivu-select {
  max-width: 100% !important;
}
.ivu-input {
  max-width: 100% !important;
}
.modal-header-input {
  .ivu-form-item-error {
    .ivu-select-selection {
      border: 1px solid #e5e5e5 !important;
    }
  }
}
</style>
