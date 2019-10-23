<template>
  <section class="cashflow-create-page">
    <Spin fix v-if="isloading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <common-icon v-if='deleteFlag' class="yishixiao" type="_yishanchu"></common-icon>
    <section class="page-header">
      <div class="page-header-name">新增下级现金流量项目</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doAddOne" :disabled="deleteFlag">保存</Button>
        <Button @click="doAdds" :disabled="deleteFlag">保存并新增</Button>
        <Button @click="toCancel" :disabled="deleteFlag">取消</Button>
        <Button @click="toIndex" :disabled="deleteFlag">列表</Button>
      </div>
    </section>
    <section class="page-content">
      <Form ref="formCash" :model="formCash" :rules="ruleCash" :label-width="96">
        <Row>
          <Col span="12">
            <FormItem label="创建公司" prop="company" class="page-content-form-otherinput">
              <Input type="text" v-model="formCash.companyName" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="会计准则" :label-width="112">
              <Input type="text" v-model="formCash.accStandardName" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="上级项目" class="page-content-form-otherinput">
              <Row>
                <Col span="12" class="page-content-form-left">
                  <FormItem prop="code">
                    <select-cashflow-modal
                    v-if="isRadioSelect"
                    :defaultValue="formCash.code"
                    :cashFlowId="cashFlowId"
                    :hasUsed="hasUsedList"
                    @getCashFlow="doGetCashFlowItem"
                    >
                    </select-cashflow-modal>
                  </FormItem>
                </Col>
                <Col span="12" class="page-content-form-right">
                 <FormItem prop="name">
                  <Input type="text" v-model="formCash.name" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="方向" :label-width="112">
              <Input type="text" v-model="formCash.cashFlowDirectionName" disabled></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="编码" class="page-content-form-otherinput">
              <Row>
                <Col span="12" class="page-content-form-left">
                  <FormItem>
                    <Input type="text" v-model="formCash.code" disabled></Input>
                  </FormItem>
                </Col>
                <Col span="12" class="page-content-form-right">
                  <FormItem prop="sonCode">
                    <Input type="text" v-model="formCash.sonCode"></Input>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="名称" :label-width="112" prop="sonName">
               <Input type="text" v-model="formCash.sonName" :maxlength=50 :disabled="deleteFlag"></Input>
               <span class="page-content-name-error" v-show="iveTips">名称重复</span>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="描述">
              <Input type="textarea" v-model="formCash.sonRemark" :autosize="{minRows: 4,maxRows: 6}" :maxlength="200" :disabled="deleteFlag"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
  </section>
</template>
<script>
import { saasMixin } from '@/libs/mixins'
import { Validation } from '@/libs/util'
import { mapMutations } from 'vuex'
import CommonIcon from '_c/common-icon'
import SelectCashflowModal from '_v/basics/major/cashflow/component/cashflowSelect/select_cashflow_modal.vue'

export default {
  name: 'create_cashflow',
  components: {
    CommonIcon,
    SelectCashflowModal
  },
  mixins: [saasMixin],
  data () {
    return {
      isloading: true,
      isRadioSelect: false,
      hasUsedList: [], // 被引用集合
      deleteList: false,
      isDel: false,
      rulePass: true,
      formData: '{}', // 界面数据
      formCash: {},
      ruleCash: { // 校验规则
        // 上级编码
        code: [
          { required: true, validator: Validation.upCode, trigger: 'change' }
        ],
        // 上级名称
        name: [
          { required: true, validator: Validation.notEmptyRule, trigger: 'blur' }
        ],
        // 下级编码
        sonCode: [
          { required: true, validator: Validation.cashflowCodeRule, trigger: 'blur' }
        ],
        // 下级名称
        sonName: [
          { required: true, validator: Validation.cashflowNameRule, trigger: 'blur' }
        ]
      },
      iveTips: false
    }
  },
  computed: {
    /**
     * 删除标志
     * isDel 0 未删除 1 已删除
     */
    deleteFlag () {
      return this.isDel || this.formCash.isDel === 1
    },
    /**
     * 数据变化标志
     * true 数据变了 false 数据没变
     */
    dataChange () {
      return this.formData !== JSON.stringify(this.formCash)
    },
    /**
     * 插入请求参数
     */
    params () {
      return {
        code: this.formCash.code + this.formCash.sonCode,
        name: this.formCash.sonName,
        upId: this.formCash.id,
        upCode: this.formCash.code,
        upVersion: this.formCash.version,
        id: this.formCash.id,
        cashFlowDirection: this.formCash.cashFlowDirection,
        cashFlowDirectionName: this.formCash.cashFlowDirectionName,
        cashFlowGroup: this.formCash.cashFlowGroup,
        cashFlowGroupName: this.formCash.cashFlowGroupName,
        remark: this.formCash.sonRemark,
        cashFlowId: this.cashFlowId,
        level: this.formCash.level + 1,
        fullName: this.formCash.fullName + '_' + this.formCash.sonName,
        maxLevel: this.formCash.maxLevel,
        createCompanyId: 0,
        useCompanyId: 0,
        companyId: 0
      }
    },
    rowId: {
      get () {
        return this.$route.query.addId || this.formCash.id
      },
      set (val) {
        this.$route.query.addId = val
      }
    },
    cashFlowId () {
      return this.$route.query.cashFlowId || this.formCash.cashFlowId
    }
  },
  watch: {
    dataChange (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    // 区分哪里进来的新增
    let renderType = this.$route.query.addType
    if (renderType === 1) {
      this.doInitButton()
      return console.log('这是新增按钮')
    }
    if (renderType === 2) {
      this.doInit()
      return console.log('这是新增下级')
    }
    this.doInit()
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    /**
     * 查询最大流水号
     */
    doSelectSerial (code) {
      let params = {
        id: this.rowId,
        code: code,
        cashFlowId: this.$route.query.cashFlowId
      }
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemCodeForAdd', params).then(({ status, data }) => {
        if (data.code === 200) {
          console.log(data.data.code)
          this.formCash.sonCode = data.data.code.split(this.formCash.code)[1]
          this.formData = JSON.stringify(this.formCash)
        }
      })
    },
    /**
     * 查询被引用的现金流量项目Id
     */
    doFindItemHasUsed () {
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemHasUsed', { cashFlowId: this.cashFlowId }).then(({ status, data }) => {
        if (data.code === 200) {
          this.hasUsedList = data.data.batchIds
          this.isRadioSelect = true // 控制单选组件的渲染
        }
      })
    },
    /**
     * 初始化数据
     * 发送请求
     * 请求成功: 判断数据是否删除
     * 如果删除：执行清空方法
     * 备份数据
     */
    doInit (oldData) {
      this.isloading = true
      this.doSelete((data) => {
        this.iveTips = false
        this.isDel = data.isDel === 1 // 0 未删除 1已删除
        if (this.isDel) { this.doClear() }
        // 通过路由参数isCopy判断，选择不同数据渲染
        let copydata = this.$route.query.isCopy === 1 ? {
          code: data.code.substring(0, data.code.length - 2),
          level: data.level - 1,
          name: data.upName,
          sonRemark: oldData ? oldData.sonRemark : data.remark
        } : { sonRemark: oldData ? oldData.sonRemark : '' }
        // 初始化现金流量方向
        data.cashFlowDirectionName = data.cashFlowDirection ? '现金流入' : '现金流出'
        // 初始化创建公司
        data.companyName = data.companyId === 0 ? '集团' : data.companyName
        data.sonName = oldData ? oldData.sonName : '' // 初始化下级名称
        data.sonCode = oldData ? oldData.sonCode : '' // 初始化下级编码
        this.formCash = Object.assign(data, copydata)
        this.doSelectSerial(data.code)
        this.formData = JSON.stringify(this.formCash)
      })
      this.doFindItemHasUsed()
      setTimeout(() => { this.isloading = false }, 100) // 关闭loading状态
    },
    /**
     * 查询请求
     */
    doSelete (callback) {
      let selectPrams = { id: this.rowId, cashFlowId: this.cashFlowId }
      // 发送请求，获取上级项目
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemById', selectPrams).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          callback(data.data)
        }
      })
    },
    /**
     * 新增按钮进来
     */
    doInitButton () {
      this.isloading = true
      let company = this.$route.query.query.company
      let accountingStandard = this.$route.query.query.accountingStandard
      // 拿到创建公司
      this.formCash.companyId = company.companyId
      // 创建公司名称
      this.formCash.companyName = company.companyName
      // 拿到会计准则
      accountingStandard.options.forEach(item => {
        if (item.value === accountingStandard.value) {
          this.formCash.accStandardName = item.label
        }
      })
      // 拿到会计准则id
      this.formCash.accStandardId = accountingStandard.value
      // 完成初始化
      this.formData = JSON.stringify(this.formCash)
      // 上级项目选择框开始渲染
      this.doFindItemHasUsed()
      // 关闭loading状态
      setTimeout(() => { this.isloading = false }, 100)
    },
    doGetCashFlowItem (item) {
      if (item) {
        // 解决bug 12489 改变数据后iview组件检测不到数据变化
        let sonCodeBCK = this.formCash.sonCode
        let sonNameBCK = this.formCash.sonName
        let sonRemarkBCK = this.formCash.sonRemark
        item.companyName = item.companyId === 0 ? '集团' : item.companyName
        item.cashFlowDirectionName = item.cashFlowDirection ? '现金流入' : '现金流出'
        this.$set(this, 'formCash', item)
        this.$set(this.formCash, 'sonCode', sonCodeBCK)
        this.$set(this.formCash, 'sonName', sonNameBCK)
        this.$set(this.formCash, 'sonRemark', sonRemarkBCK)
        this.doSelectSerial(this.formCash.code)
      }
    },
    /**
    * 检查数据是否被他人删除
    * 是：执行清空方法 提示已被删除
    * 否：执行回调
    */
    doCheckDel (callback) {
      let params = { id: this.rowId, cashFlowId: this.cashFlowId }
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemById', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          this.isDel = data.data.isDel === 1
          if (this.isDel) {
            this.doClear()
            this.$Message.error('数据已被删除')
          } else {
            callback(data.data)
          }
        }
      })
    },
    /**
     * 表单校验规则
     */
    doCheckForm () {
      let rule = [
        { prop: 'code', name: '上级编码' },
        // { prop: 'name', name: '上级项目名称' },
        { prop: 'sonCode', name: '编码' },
        { prop: 'sonName', name: '名称' }
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
      this.$refs['formCash'].validateField(obj.prop, valid => {
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
     * 新增按钮
     */
    toAddOne () {
      this.formCash.isEnable === 0 ? this.$Message.error('添加失败，请反禁用后再操作!') : this.doAddOne()
    },
    /**
     * 取消按钮
     * 判断数据是否发生变化
     * 发生变化：打开弹窗
     */
    toCancel () {
      if (this.dataChange) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '提示信息',
          message: '取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl()
            that.doClear()
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      }
    },
    /**
     * 关闭页签的提示框
     */
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: '当前页面数据已发生变化，是否保存再继续？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doInsert(that.doContinueActions)
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 列表按钮
     * 跳转列表页
     */
    toIndex () {
      this.doLocationDetail('cashflow_index')
    },
    /**
     * 保存动作
     * 发送插入请求
     * 请求成功执行跳转动作
     */
    doAddOne () {
      this.doInsert((data) => {
        this.doLocationDetail('update_cashflow', { showId: data.data.id, cashFlowId: this.$route.query.cashFlowId })
      })
    },
    /**
     * 保存并新增动作
     * 发送插入请求
     * 请求成功后，刷新页面
     */
    doAdds () {
      this.doInsert((data) => this.doInit())
    },
    /**
     * 插入请求
     * 必填项验证
     * 通过：发送请求
     * 请求成功执行回调
     */
    doInsert (callback) {
      // 验证表单
      if (this.doCheckForm()) {
        this.$request.post('/financeback/cashFlowItem/addCashFlowItem', this.params).then(({ status, data }) => {
          this.iveTips = data.code === 10009 // 名称重复
          if (data.code === 200) {
            this.isloading = false
            this.$Message.success('添加成功!')
            // 解除数据变化
            this.formData = JSON.stringify(this.formCash)
            // 判断返回新增数据的id 与当前路由的id是否相等
            // 如果当前路由id相同，表示id互换了, 曾经上级数据的id没有了
            // let addId = data.data.id === this.rowId ? data.data.upId : data.data.id
            // 添加查询页id
            // this.addIdToList({ id: addId, name: 'cashflow' })
            this.addIdToList({ id: data.data.id, name: 'cashflow' })
            setTimeout(() => { callback(data) }, 200)
          } else {
            this.isloading = false
            // 版本号不一致
            if (data.code === 11172 || data.message === '版本号不一致!') {
              this.$Message.warning('当前数据已被他人修改,如要继续操作，请再次点击按钮')
              this.formData = JSON.stringify(this.formCash)
              this.doInit(this.formCash)
            }
          }
        })
      } else {
        this.isloading = false
      }
    },
    /**
     * 清空数据
     * 讲备份数据回滚重新渲染
     */
    doClear () {
      this.formCash = JSON.parse(this.formData)
    }
  }
}
</script>
<style lang="less">
.cashflow-create-page {
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-form-item-error-tip {
    display: none;
  }
  .page-content {
    width: 857px;
    .ivu-row {
      .ivu-col {
        .ivu-form-item {
          margin-bottom: 8px;
          .ivu-form-item-label {
            padding: 10px 8px 10px 0;
          }
        }
        .ivu-form-item-required {
          &:before {
              content: '*';
              position: absolute;
              right: -11px;
              top: 11px;
              display: inline-block;
              line-height: 1;
              font-family: SimSun;
              font-size: 12px;
              color: #ed4014;
            }
          .ivu-form-item-label {
            &:before {
              content: '';
            }
          }
          .page-content-name-error {
            position: absolute;
            color: #ed4014;
            right: -44px;
          }
        }
        .page-content-form-otherinput {
          margin-right: 16px;
          .page-content-form-left {
            padding-right: 4px;
            .ivu-form-item {
              margin-bottom: 0 ;
            }
          }
          .page-content-form-right {
            padding-left: 4px;
            .ivu-form-item {
              margin-bottom: 0 ;
            }
          }
          .ivu-form-item-label {
            &:before {
              position: absolute;
              right: -1px;
            }
          }
        }
      }
    }
  }
}
</style>
