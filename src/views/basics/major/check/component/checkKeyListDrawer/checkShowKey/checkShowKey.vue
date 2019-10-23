<template>
  <div class="page-modal">
    <Modal v-model="isModalFlag" class="page-modal-showKey" :draggable="true" :transfer="false" :mask-closable="false" :closable="true" width="1000px">
      <section class="page-header" slot='header'>
        <div class="page-header-name">新增值-{{showConfig.valueList ? showConfig.valueList.name : `大区值`}}</div>
      </section>
      <section class="page-content page-content-ShowKey">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
          <Row>
            <Col span="12">
              <FormItem label="创建公司" prop="companyName" class="page-content-form-codeinput">
                <radio-select :config="company_config" :bloc="isGropFlag"
                :close="isCompanyClose"
                v-model="formValidate.companyName"
                @getData="getCompanyData"
                @on-close="doResetCompanyConfig"
                :reset="company_config.refresh">
                  <div slot="header">
                    <Row :gutter="10" class="no-error-modal">
                      <Col span="4">
                        <Select v-model="companyFormId" @on-change="doCompanyFormIdChange">
                          <Option v-for="item in companytype_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                        </Select>
                      </Col>
                      <Col span="8">
                        <Input class="search-button" v-model="keyCodeOrName" placeholder="编码/名称" clearable @on-enter="doSearchCompany" @on-change="doInputChange">
                          <Button slot="append" icon="ios-search" @click="doSearchCompany"></Button>
                        </Input>
                      </Col>
                      <Col span="4">
                        <Button style="position: relative;top: 2px" @click="doResetCompanyConfig">重置</Button>
                      </Col>
                    </Row>
                  </div>
                </radio-select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="值编码" prop="code" :label-width="97">
                <Input type="text" v-model="formValidate.code" disabled placeholder="系统编码"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="值名称" prop="name" class="page-content-form-codeinput">
                <Input type="text" v-model="formValidate.name" :maxlength=20></Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="描述">
                <Input type="textarea" v-model="formValidate.remark" :autosize="{minRows: 2,maxRows: 5}" :maxlength=500></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </section>
      <section slot='footer'>
        <Button type="primary" @click="handleSubmit">保存</Button>
        <Button @click="handlePresave">保存并新增</Button>
        <Button type="default" @click="handleCancel">取消</Button>
      </section>
    </Modal>
  </div>
</template>
<script>
import { Validation } from '@/libs/util'
import RadioSelect from '_c/radio-select'
export default {
  name: 'checkShowKey',
  components: {
    RadioSelect
  },
  props: {
    showConfig: {
      type: Object,
      default: () => ({})
    },
    isModal: { // 控制modal显示
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isGropFlag: true,
      keyCodeOrName: '',
      company_config: { // 归属公司配置
        type: 'company',
        title: '选择公司',
        refresh: false,
        width: '100%',
        request_params: {
          companyFormId: null,
          codeOrName: '',
          isEnterpriseAdmin: 1,
          // menuCode: this.$route.name
          menuCode: 'check_index'
        }
      },
      companyFormId: 0, // 公司形态
      companytype_list: [
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
      isCompanyClose: false,
      // isModalFlag: false,
      formValidate: {},
      rulePass: true,
      ruleValidate: {
        companyName: [{ required: true, validator: Validation.notEmptyRule, trigger: 'change' }],
        code: [{ required: false, validator: Validation.checkNameRule, trigger: 'blur' }],
        name: [{ required: true, validator: Validation.checkNameRule, trigger: 'blur' }]
      }
    }
  },
  methods: {
    /**
     * 选择归数据公司-重新下发查询
     */
    doSearchCompany () {
      let seleStrArr = ['集', '团', '集团', '', '0', '00', '000', '0000']
      let seleFlag = seleStrArr.includes(this.keyCodeOrName)
      this.company_config.request_params.codeOrName = this.keyCodeOrName
      this.isGropFlag = this.companyFormId === 0 && seleFlag
      this.company_config.refresh = !this.company_config.refresh
    },
    /**
     * 选择归属公司-公司形态
     * 公司形态选项变化时触发
     * 主要为了剔除 全部形态 0
     */
    doCompanyFormIdChange (val) {
      this.isGropFlag = this.companyFormId === 0
      let params = val === 0 ? null : val
      this.company_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    /**
     * 查询归属公司重置按钮
     * 重置公司形态
     * 重置编码或名称
     * 执行查询
     */
    doResetCompanyConfig () {
      this.companyFormId = 0
      this.company_config.request_params.companyFormId = null
      this.company_config.request_params.codeOrName = ''
      this.keyCodeOrName = ''
      this.isGropFlag = true
      this.doSearchCompany()
    },
    // 当输入内容的长度为0时，下发查询
    doInputChange (data) {
      if (this.company_config.request_params.codeOrName && !this.keyCodeOrName) {
        this.doSearchCompany()
      }
    },
    /**
     * 监听公司组件返回接口
     * data：标准数据
     * item：详细数据
     */
    getCompanyData (data, item) {
      if (item) {
        this.$set(this.formValidate, 'companyName', data.name)
        this.$set(this.formValidate, 'companyId', data.id)
        this.$set(this.formValidate, 'useCompanyName', data.name)
        this.$set(this.formValidate, 'useCompanyId', data.id)
      } else {
        this.$set(this.formValidate, 'companyName', '')
        this.$set(this.formValidate, 'companyId', '')
        this.$set(this.formValidate, 'useCompanyName', '')
        this.$set(this.formValidate, 'useCompanyId', '')
      }
    },
    /**
     * 表单校验规则
     */
    doCheckForm () {
      let rule = [
        { prop: 'companyName', name: '创建公司' },
        // { prop: 'code', name: '值编码' },
        { prop: 'name', name: '值名称' }
      ]
      this.rulePass = true
      this.doCheckRule(rule, 'rulePass')
      return this.rulePass
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
     * 保存按钮
     * 根据选择的公司确定传递的的参数
     */
    handleSubmit (event, callback) {
      if (this.doCheckForm()) {
        let req = {
          name: this.formValidate.name, // 名称
          itemCode: this.showConfig.valueList.code, // 项目编码
          code: this.formValidate.code, // 编码
          codeType: 0, // 值编码规则 0 系统 1 自定义
          itemId: this.showConfig.valueList.id, // 项目id 自动获取
          companyId: this.formValidate.companyId || 0, // 归属公司
          useCompanyId: this.formValidate.companyId || 0, // 使用公司
          IsEnterpriseAdmin: 1,
          remark: this.formValidate.remark, // 描述
          dataType: this.formValidate.companyId ? 3 : 1 // 资料类型 1 共享型 2 分配型 3 私有型
        }
        this.$request.post('/financeback/accountingItemValue/addAccountingItemValue', req).then(res => {
          if (res.data.code === 200) {
            this.isModalFlag = false
            this.$Message.success('保存成功')
            if (callback) {
              callback()
            }
          }
        })
      }
    },
    /**
     * 保存并新增
     */
    handlePresave () {
      this.handleSubmit(undefined, () => {
        this.isModalFlag = true
        this.formValidate = {}
        this.$refs.formValidate.resetFields()
      })
    },
    /**
     * 取消按钮
     */
    handleCancel () {
      this.isModalFlag = false
    }
  },
  computed: {
    /**
     * 计算展示接口 true or false
     * 完成通过通信
     * 1--- 打开
     * 2--- 回信 -- 关闭
     * 3--- 关闭
     */
    isModalFlag: {
      get () {
        return this.isModal
      },
      set (val) {
        this.$emit('getResult', val)
      }
    }
  },
  watch: {
    isModal (val) { // 监听变化
      this.$refs.formValidate.resetFields()
      if (val) {
        this.formValidate = {
          companyName: '集团',
          companyId: 0,
          useCompanyName: '全部',
          useCompanyId: 0
        }
      } else { // 关闭其他modal
        this.isCompanyClose = !this.isCompanyClose
      }
    }
  }
}
</script>
<style lang="less">
.page-modal-showKey {
  .ivu-form-item-error-tip {
    display: none;
  }
  .ivu-modal {
    .ivu-modal-header {
      .page-header {
        margin: -11px !important;
        border: none;
      }
    }
    .ivu-modal-body {
      .page-content-ShowKey {
        width: 805px !important;
        padding:0 0 74px 0 !important;
        .ivu-row {
          .ivu-col {
            .ivu-form-item {
              margin-bottom: 8px;
              .ivu-form-item-label {
                padding: 10px 8px 10px 0;
              }
            }
            .ivu-form-item-required {
              .ivu-form-item-label {
                &:before {
                  position: absolute;
                  right: 0;
                }
              }
            }
            .page-content-form-codeinput {
              margin-right: 17px;
            }
          }
        }
      }
    }
  }
}
</style>
