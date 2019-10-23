// 基本信息
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
              <FormItem prop="code" class="ivu-from-accountant-upcode">
                <radio-select :config="accountant_config" v-model="accountantValue"
                :confirm="true"
                :close="isAccountantClose"
                @change="doAccountClear"
                @confirmData="doGetAccount"
                placeholder=""
                @on-close="doResetUpSubject"
                :reset="accountant_config.refresh">
                  <div slot="header">
                    <Row :gutter="8" class="no-error-modal">
                      <Col span="4">
                        <Select value="1" disabled>
                          <Option value="1" label="已生效">已生效</Option>
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select v-model="accountElementItemValue" ref="cate" @on-change="doChangeElementItem(accountElementItemValue, doReSearch)">
                          <Option value="all" label="全部会计要素"></Option>
                          <Option :value="item.id" :label="item.name" v-for="item in accountElementItemList" :key="item.id"></Option>
                        </Select>
                      </Col>
                      <Col span="4">
                        <Select v-model="subjectCategoryValue" @on-change="doChangeCategoryList(subjectCategoryValue, 'accountElementItemValue', doReSearch)">
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
                          <Button slot="append" icon="ios-search" @click="doReSearch"></Button>
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
                <FormItem prop="name">
                  <Input v-model="basic.name" disabled></Input>
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
                <Input v-model="basic.code" disabled ></Input>
              </Col>
              <Col span="12" class="input_after basic-formitem-input">
                <FormItem prop="subCode">
                  <Input v-model="basic.subCode" @on-change="dochange"></Input>
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
          <FormItem label="科目名称" prop="subName">
            <Input v-model="basic.subName" @on-change="dochange" :maxlength=50></Input>
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
            <!-- <Select v-model="basic.balance" @on-change="dochange"> -->
            <Select v-model="basic.balanceDirection" @on-change="dochange">
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
            <!-- <select-cashflow-modal state="1" direction = '1' :defaultValue="basic.inflowName" -->
            <select-cashflow-modal state="1" direction = '1' :defaultValue="basic.cashInflowName"
            @getGroup="doGetGroupData" @getCashFlow="doGetCashFlowIn">
            </select-cashflow-modal>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="现金流出">
            <select-cashflow-modal state="1" direction = '0' :defaultValue="basic.cashOutflowName"
            v-if="iscashOutflag" :requestGroup="false" :groupData="groupData" @getCashFlow="doGetCashFlowOut">
            </select-cashflow-modal>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { Validation } from '@/libs/util.js'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'
import SelectCashflowModal from './selectCashflow.vue'
export default {
  components: {
    RadioSelect,
    SelectCashflowModal
  },
  mixins: [saasMixin],
  data () {
    return {
      // 界面展示数据
      basic: {},
      groupData: [],
      iscashOutflag: false,
      isAccountantClose: false,
      isChanged: false, // 是否修改表单
      isRulePass: true, // 表单验证标志
      accountantValue: '', // 上级项目绑定值
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
        subName: [
          { required: true, validator: Validation.accountNameRule, trigger: 'blur' }
        ],
        code: [
          { required: true, validator: Validation.upCode, trigger: 'change' }
        ],
        name: [
          { required: true, validator: Validation.notEmptyRule, trigger: 'blur' }
        ],
        balanceDirection: [
          { required: true, validator: Validation.notEmptyRule, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    basics: {
      default: null,
      type: Object
    }
  },
  watch: {
    isChanged (val) {
      this.$emit('getChangeInfo', this.isChanged)
    },
    basics () {
      this.basic = this.basics
      this.basic.companyName = '集团'
      this.accountantValue = this.basics.code
      this.basic.balanceDirection = `${this.basics.balanceDirection}`
      // this.$set(this.basic, 'balance', `${this.basics.balanceDirection}`)
    }
  },
  mounted () {
    // this.doGetGroup()
    this.doGetSubjectScreenList()
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    /**
     * 选择上级项目
     */
    doGetAccount (item) {
      if (item.level >= item.maxLevel.split('-').length) {
        this.$Message.warning('当前数据已达到最大级次，不能新增下级！')
      } else if (item.isInterior === 1) {
        this.$Message.warning('内部往来科目不能新增下级！')
      } else if (item.childNum >= 99) {
        this.$Message.warning('当前下级数据以达到最大99个，无法新增下级!')
      }
      // item.isCited 不管用
      this.$request.post('/financeback/accountSubject/findInfoById', { id: item.id }).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.isCited === 1) { // 判断引用关系
            this.$Message.warning('当前数据已使用，无法新增下级！')
          } else { // 判断预置科目是否可以新增下级
            let req = { upCode: item.code, subjectId: item.subjectId }
            this.$request.post('/financeback/accountSubject/checkNextInitInfo', req).then(res => {
              if (res.data.code === 200) {
                this.accountantValue = item.code
                if (item.companyId === 0) { item.companyName = '集团' }
                item.balanceDirection = `${item.balanceDirection}`
                this.$set(this, 'basic', item)
                this.isAccountantClose = !this.isAccountantClose
                this.$emit('getBasic', this.basic)
              } else {
                this.$Message.error(res.data.message)
              }
            })
          }
        }
      })
    },
    /**
     * 上级项目删除或清空时触发
     */
    doAccountClear (val) {
      if (val) {
        if (!val.target.value) {
          this.accountantValue = ''
          this.$route.query.isInterior = ''
          this.$set(this, 'basic', {})
          this.$emit('getBasic')
        }
      } else {
        this.accountantValue = ''
        this.$route.query.isInterior = ''
        this.$set(this, 'basic', {})
        this.$emit('getBasic')
      }
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
    doReSearch () {
      this.accountant_config.request_params.accountElementItem = this.accountElementItemValue === 'all' ? null : this.accountElementItemValue
      this.accountant_config.request_params.subjectCategory = this.subjectCategoryValue === 'all' ? null : this.subjectCategoryValue
      this.accountant_config.refresh = !this.accountant_config.refresh
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
    dochange () {
      this.isChanged = true
    },
    /**
     * 表单校验规则
     */
    doCheckForm () {
      let rule = [
        { prop: 'code', name: '上级编码' },
        { prop: 'name', name: '上级科目名称' },
        { prop: 'subCode', name: '科目编码' },
        { prop: 'subName', name: '科目名称' },
        { prop: 'balanceDirection', name: '余额方向' }
      ]
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
      this.isChanged = true
      if (itemIn) {
        this.$set(this.basic, 'cashFlowId', itemIn.cashFlowId)
        this.$set(this.basic, 'cashInflowId', itemIn.id)
        this.$set(this.basic, 'cashInflowCode', itemIn.code)
        this.$set(this.basic, 'cashInflowName', itemIn.name)
      } else {
        this.$set(this.basic, 'cashFlowId', null)
        this.$set(this.basic, 'cashInflowId', null)
        this.$set(this.basic, 'cashInflowCode', null)
        this.$set(this.basic, 'cashInflowName', null)
      }
    },
    /**
     * 监听现金流出
     */
    doGetCashFlowOut (itemOut) {
      this.isChanged = true
      if (itemOut) {
        this.$set(this.basic, 'cashFlowId', itemOut.cashFlowId)
        this.$set(this.basic, 'cashOutflowId', itemOut.id)
        this.$set(this.basic, 'cashOutflowCode', itemOut.code)
        this.$set(this.basic, 'cashOutflowName', itemOut.name)
      } else {
        this.$set(this.basic, 'cashFlowId', null)
        this.$set(this.basic, 'cashOutflowId', null)
        this.$set(this.basic, 'cashOutflowCode', null)
        this.$set(this.basic, 'cashOutflowName', null)
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
.basic {
  .basic-form {
    width: 940px;
    margin-top: 22px;
    .basic-input {
      color: #e5e5e5;
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
}

</style>
