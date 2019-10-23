<template>
  <section class="cashflow-update-page">
    <Spin fix v-if="isloading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <common-icon v-if="disbaleDel" class="yishixiao" type="_yishanchu"></common-icon>
    <section class="page-header">
      <div class="page-header-name">查看现金流量项目</div>
      <div class="page-header-actions">
        <Button type="primary" @click="toPreserve" :disabled="disbaleDel">保存</Button>
        <Button @click="toCancel" :disabled="disbaleDel">取消</Button>
        <Button @click="toCreate" :disabled="disbaleDel">新增</Button>
        <Button @click="toCopy" :disabled="disbaleDel">复制</Button>
        <Button @click="toDelete" :disabled="disbaleDel">删除</Button>
        <Button @click="toIndex">列表</Button>
        <Button @click="toProhibit" v-if="!disableEnable" :disabled="disbaleDel">禁用</Button>
        <Button @click="toUnProhibit" v-if="disableEnable" :disabled="disbaleDel">反禁用</Button>
        <Button @click="tofindFirst" class="isfenye">
          <span class="dofenye">
            <common-icon class="fenye" type="_shouye"></common-icon>
          </span>
        </Button>
        <Button @click="tofindPrevious" icon="ios-arrow-back"></Button>
        <Button @click="tofindNext" icon="ios-arrow-forward"></Button>
        <Button @click="tofindEnd" class="isfenye">
          <span class="dofenye">
            <common-icon class="fenye" type="_moye"></common-icon>
          </span>
        </Button>
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
                  <FormItem>
                    <select-cashflow-modal
                    v-if="isRadioSelect"
                    :defaultValue="formCash.upCode"
                    :cashFlowId="cashFlowId"
                    :hasUsed="hasUsedList"
                    @getCashFlow="doGetCashFlowItem"
                    :disabled="disableFinal || disasbleInter || disableEnable || disbaleDel || disableRelation || disableInit || isRelation"
                    >
                    </select-cashflow-modal>
                  </FormItem>
                </Col>
                <Col span="12" class="page-content-form-right">
                <FormItem prop="upName">
                  <Input type="text" v-model="formCash.upName" disabled></Input>
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
                <Col span="12" class="page-content-form-left" >
                  <FormItem>
                    <Input type="text" v-model="formCash.upCode" disabled></Input>
                  </FormItem>
                </Col>
                <Col span="12"  class="page-content-form-right">
                  <FormItem prop="sonCode">
                    <Input type="text" v-model="formCash.sonCode" :disabled="disableFinal || disasbleInter || disableEnable || disbaleDel || disableRelation || disableInit || isRelation"></Input>
                  </FormItem>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="名称" :label-width="112" prop="name">
               <Input type="text" v-model="formCash.name" :maxlength=50 :disabled="disableFinal || disasbleInter || disableEnable || disbaleDel || disableRelation || disableInit || isRelation"></Input>
               <span class="page-content-name-error" v-show="iveTips">名称重复</span>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="描述">
              <Input type="textarea"
              v-model="formCash.remark"
              :autosize="{minRows: 4,maxRows: 6}"
              :maxlength="200"
              :disabled="disableFinal || disasbleInter || disableEnable || disbaleDel"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="enable-invalid" v-if="disableEnable">
        <common-icon type="_yishixiao1" class="invalid-font"></common-icon>
      </div>
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
  name: 'update_cashflow',
  components: {
    CommonIcon,
    SelectCashflowModal
  },
  mixins: [saasMixin],
  data () {
    return {
      isChanged: false,
      version: '',
      fullName: '',
      hasUsedList: [],
      isRadioSelect: false,
      iveTips: false,
      deleteList: false,
      reminderModal: false, // 提示弹窗
      isRelation: false, // 引用关系标志
      isloading: true, // 全局loading标志
      rowId: this.$route.query.showId, // id
      cashFlowId: this.$route.query.cashFlowId,
      formCash: {
        companyName: '集团'
      }, // 请求数据
      formData: `{
        companyName: '集团'
      }`, // 备份数据
      rulePass: true,
      ruleCash: { // 校验规则
        sonCode: [
          { required: true, validator: Validation.cashflowCodeRule, trigger: 'blur' }
        ],
        upName: [
          { required: true, validator: Validation.cashflowNameRule, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: Validation.cashflowNameRule, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    doGetCashFlowItem (item) {
      if (item) {
        // 这里需要注意，层级问题------待确认
        this.$set(this.formCash, 'upCode', item.code)
        this.$set(this.formCash, 'upName', item.name)
        this.$set(this.formCash, 'upId', item.id)
        this.$set(this.formCash, 'upVersion', item.version)
        this.fullName = item.fullName.split(item.name).filter(i => i).join(item.name)
      } else {
        this.$set(this.formCash, 'upCode', '')
        this.$set(this.formCash, 'upName', '')
        this.$set(this.formCash, 'upId', '')
        this.$set(this.formCash, 'upVersion', '')
      }
    },
    /**
     * 监听页面编辑
     */
    doOnChange () {
      this.isChanged = true
    },
    /**
     * 初始化数据
     * 打开loading
     * 发送数据请求
     * 请求成功：
     * 是：执行清空方法
     * 否：添加 编码sonCode 上级编码upCode 现金流方向cashFlowDir 赋值渲染
     * 备份数据
     * 根据标志flag判断是否需要 执行发送判断引用的请求
     */
    doInit (flag, req, oldData) {
      this.isloading = true
      let params = req || this.selectParams
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemById', params).then(({ status, data }) => {
        this.iveTips = false
        if (status === 200 && data.code === 200) {
          this.formCash = Object.assign(data.data, {
            sonCode: data.data.code.substr(-2, 2),
            upCode: data.data.code.substring(0, data.data.code.length - 2),
            cashFlowDirectionName: data.data.cashFlowDirection ? '现金流入' : '现金流出'
          })
          let str = data.data.name
          this.fullName = data.data.fullName.split(str).filter(item => item).join(str)
          if (this.formCash.remark === null) { this.formCash.remark = '' }
          if (oldData) {
            this.formCash.sonCode = oldData.sonCode
            this.formCash.name = oldData.name
            this.formCash.remark = oldData.remark
          }
          if (this.formCash.companyId === 0) { this.formCash.companyName = '集团' }
          this.formData = JSON.stringify(this.formCash)
          // this.isRadioSelect = true // 控制单选组件的渲染
          if (flag) { this.toCheckRelation() } // 请求判断是否存在引用关系
          this.doFindItemHasUsed()
          setTimeout(() => { this.isloading = false }, 200) // 关闭loading状态
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
        }
        this.isRadioSelect = true // 控制单选组件的渲染
      })
    },
    /**
     * 检查数据是否被其他模块引用
     * isRelation：引用标志
     */
    toCheckRelation () {
      let params = {
        id: this.formCash.id,
        code: this.formCash.code,
        cashFlowId: this.cashFlowId,
        rootEnterpriseId: this.$store.state.user.rootEnterpriseId
      }
      this.$request.post('/financeback/cashFlowItem/checkIsUsedSingle', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) { this.isRelation = data.data.reference }
      })
    },
    /**
     * 检验函数
     * 编码通过后----名称----执行回调
     */
    toCheckRule () {
      let rulePass = true
      this.$refs['formCash'].validateField('sonCode', valid => {
        if (valid) {
          rulePass = false
          return this.$Message.error(`编码错误:${valid}`)
        }
        this.$refs['formCash'].validateField('name', valid => {
          if (valid) {
            rulePass = false
            return this.$Message.error(`名称错误:${valid}`)
          }
        })
      })
      return rulePass
    },
    /**
     * 保存按钮
     * 判断数据是否被他人删除
     * 判断数据是否发生变化 dataChange
     * 发生变化：判断是否是末级数据 是：执行保存 否：提示存在下级数据
     * 没有发生变化： 直接提示保存
     */
    toPreserve () {
      this.dataChange ? this.formCash.isFinal === 1 ? this.doPreserve() : this.$Message.error('保存失败，该数据存在下级数据')
        : this.$Message.info('保存成功')
    },
    /**
     * 复制按钮
     * 复制为当前的统计科目---新增
     */
    toCopy () {
      this.doLocationDetail('create_cashflow', { addId: this.rowId, cashFlowId: this.cashFlowId, isCopy: 1 })
    },
    /**
     * 取消按钮
     * 判断数据是否被他人删除
     * 判断数据是发生变化
     * 是：执行统一提示
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
     * 新增按钮
     */
    toCreate () {
      if (this.dataChange) {
        this.doUpdateModel(() => { this.doChecktoCreate() })
      } else {
        this.doChecktoCreate()
      }
    },
    doChecktoCreate () {
      if (this.formCash.isEnable === 1) {
        if (this.formCash.isInteriorContact === 1) {
          return this.$Message.warning('内部往来项目不能增加下级项目')
        }
        if (this.formCash.level >= this.formCash.maxLevel.split('-').length) {
          return this.$Message.warning('最大级次不能增加下级项目')
        }
        if (this.isRelation) {
          return this.$Message.warning('当前数据已使用，无法新增下级！')
        }
        this.doLocationDetail('create_cashflow', { addId: this.rowId, cashFlowId: this.cashFlowId })
      } else {
        this.$Message.warning('已禁用的项目不能增加下级项目')
      }
    },
    /**
     * 删除按钮
     * 系统预置 不能删除
     * 非末级 不能删除
     */
    toDelete () {
      if (this.formCash.isInit === 1) { return this.$Message.error('系统预置项目不可删除') }
      if (this.formCash.isFinal === 0) { return this.$Message.error('删除失败，请先删除下级项目') }
      let that = this
      this.$Control({
        type: 'confirm',
        title: '确认删除',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl()
          that.doDelete()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
      // this.doDelete()
    },
    /**
     * 禁用按钮
     * 内部往来 不能禁用
     * 不是末级 提示下级一起禁用
     */
    toProhibit () {
      if (this.formCash.isInteriorContact === 1) {
        return this.$Message.error('内部往来项目不能禁用')
      }
      if (this.formCash.isFinal === 0) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '确认禁用',
          message: '反禁用将会将下级项目一起禁用',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl()
            that.doProhibit()
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      } else {
        this.doProhibit()
      }
    },
    /**
     * 反禁用按钮
     * 内部往来不能反禁用
     * 提示上级一起反禁用
     */
    // 反禁用按钮
    toUnProhibit () {
      if (this.formCash.isInteriorContact === 1) { return this.$Message.error('内部往来项目不能反禁用') }
      let params = Object.assign({}, this.selectParams, { isisEnable: 1, code: this.formCash.code })
      this.$request.post('/financeback/cashFlowItem/findCashFlowItemForEnable', [params]).then(({ data }) => {
        if (data.code === 200) {
          if (data.data.length !== params.length) {
            let that = this
            this.$Control({
              type: 'confirm',
              title: '确认反禁用',
              message: '反禁用将会将上级项目一起反禁用',
              button: ['确认', '取消'],
              yes () {
                that.$CloseCtl()
                that.doUnProhibit()
              },
              cancel () {
                that.$CloseCtl()
                that.$Message.info('已取消')
              }
            })
          } else {
            this.doUnProhibit()
          }
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
     * 统一提示方法 (不改了)
     * key：提示类型标志
     * flag：modal框开关
     * title：提示标题
     * msg：提示内容
     * active：确认/是 执行方法
     * deny：取消/否 执行方法
     * cancel：（是 否 取消）取消按钮
     * sonActive：提示套提示执行的提示类型
     */
    doShowTips (key, callback) {
      let operations = {
        Delete: { title: '确认删除', message: '注意：删除后将不可恢复！请确认是否要删除数据？', yes: 'doDelete' },
        Prohibit: { title: '确认禁用', message: '注意：禁用后将不能在新增数据中使用！请确认是否要禁用数据', yes: 'doProhibit' },
        UnProhibit: { title: '确认反禁用', message: '请确认是否要反禁用数据？', yes: 'doUnProhibit' }
      }
      this.doShowActiveModal(operations[key])
    },
    /**
     * 关闭标签提示框
     */
    doShowEditModal () {
      let that = this
      this.$Control({
        title: '提示信息',
        message: '当前页面数据已发生变化，是否保存再继续？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doUpdate(that.doContinueActions)
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
     * 保存弹窗
     */
    doUpdateModel (callback) {
      let that = this
      this.$Control({
        type: 'control',
        title: '确认保存',
        message: '当前数据已修改，需要保存吗？',
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that.doUpdate(callback)
        },
        no () {
          that.$CloseCtl()
          callback()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    doShowActiveModal (msgObj) {
      let that = this
      this.$Control({
        type: 'confirm',
        title: msgObj.title,
        message: msgObj.message,
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl() // 关闭弹窗
          that[msgObj.yes]()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
    },
    /**
     * 保存动作
     * 执行更新
     * 成功后执行初始化
     */
    doPreserve () {
      this.doUpdate(data => {
        // 判断data.data.id 与路由id相同吗
        data.data.id === this.rowId ? this.doInit(false, { id: data.data.id, cashFlowId: this.cashFlowId }) : this.rowId = data.data.id
      })
    },
    /**
     * 清空动作
     * 启用备份数据
     */
    doClear () {
      this.formCash = JSON.parse(this.formData)
    },
    /**
     * 更新请求
     * 执行验证
     * 通过：发送请求
     * 请求成功：提示保存成功，执行回调
     */
    doUpdate (callback) {
      if (this.toCheckRule()) {
        let oldData = JSON.parse(this.formData)
        let oldName = oldData.name // 更新前的名称
        this.formCash.fullName = this.fullName + this.formCash.name // 更新后的全称
        this.formCash.code = this.formCash.upCode + this.formCash.sonCode // 更新后的编码
        this.formCash.oldCode = oldData.code // 更新前的编码
        this.formCash.oldName = oldName // 更新前的名称
        this.formCash.oldUpCode = oldData.upCode // 更新前的上级code
        this.$request.post('/financeback/cashFlowItem/updateCashFlowItemById', this.formCash).then(({ status, data }) => {
          this.iveTips = data.code === 10009 // 名称重复
          if (data.code === 200) {
            if (!data.data.length) { // 保存成功
              this.$Message.info('保存成功')
              callback(data)
            } else {
              this.$Message.error('保存失败，' + data.data[0].referenceDescription)
            }
          }
          // else {
          //   this.doInit(true)
          //   if (data.code === 11172 || data.message === '版本号不一致!') {
          //     this.$Message.warning('当前数据已被他人修改')
          //     this.formData = JSON.stringify(this.formCash)
          //     this.doInit(true, undefined, this.formCash)
          //   }
          // }
        })
      }
    },
    /**
     * 删除请求
     */
    doDelete () {
      let params = {
        ids: [this.formCash.id],
        codes: [this.formCash.code],
        versions: [this.formCash.version],
        cashFlowId: this.formCash.cashFlowId
      }
      this.$request.post('/financeback/cashFlowItem/delBatch', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          if (data.data.successList.length || data.data.successDetailsList.length) {
            this.$Message.success('删除成功！')
            this.findNext('delete')
          }
          if (data.data.failList.length) {
            this.$Message.error('删除失败，' + data.data.failList[0].referenceDescription)
          }
        }
        // else {
        //   if (data.code === 11172 || data.message === '版本号不一致!') {
        //     this.$Message.warning('当前数据已被他人修改')
        //     this.formData = JSON.stringify(this.formCash)
        //     this.doInit(true, undefined, this.formCash)
        //   }
        // }
      })
    },
    /**
     * 禁用请求
     */
    doProhibit () {
      let params = {
        ids: [this.formCash.id],
        codes: [this.formCash.code],
        versions: [this.formCash.version],
        cashFlowId: this.formCash.cashFlowId,
        isEnable: 1
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchDisable', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          if (data.data.successDetailsList.length) {
            this.doInit()
            return this.$Message.success('禁用成功')
          }
          // 操作失败
          if (data.data.failList.length) {
            return this.$Message.error(`禁用失败，${data.data.failList[0].referenceDescription}`)
          }
        }
        // else {
        //   if (data.code === 11172 || data.message === '版本号不一致!') {
        //     this.$Message.warning('当前数据已被他人修改')
        //     this.formData = JSON.stringify(this.formCash)
        //     this.doInit(true, undefined, this.formCash)
        //   }
        // }
      })
    },
    /**
     * 反禁用请求
     */
    doUnProhibit () {
      let params = {
        ids: [this.formCash.id],
        codes: [this.formCash.code],
        versions: [this.formCash.version],
        cashFlowId: this.formCash.cashFlowId,
        isEnable: 0
      }
      this.$request.post('/financeback/cashFlowItem/updateOrBatchEnable', params).then(({ status, data }) => {
        if (status === 200 && data.code === 200) {
          if (data.data.successDetailsList.length) {
            this.doInit()
            return this.$Message.success('反禁用成功')
          }
          if (data.data.failList.length) {
            return this.$Message.error(`反禁用失败，${data.data.failList[0].referenceDescription}`)
          }
        }
        // else {
        //   if (data.code === 11172 || data.message === '版本号不一致!') {
        //     this.$Message.warning('当前数据已被他人修改')
        //     this.formData = JSON.stringify(this.formCash)
        //     this.doInit(true, undefined, this.formCash)
        //   }
        // }
      })
    },
    /**
     * 首条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用首条方法
     */
    tofindFirst () {
      this.dataChange ? this.doUpdateModel(this.findFirst) : this.findFirst()
    },
    /**
     * 首条方法
     */
    findFirst () {
      let _num = this.doFindPage(1, this.rowId)
      if (_num === '当前为首条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_cashflow', query: { showId: _num, cashFlowId: this.cashFlowId } })
      }
    },
    /**
     * 上一条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用上一条方法
     */
    tofindPrevious () {
      this.dataChange ? this.doUpdateModel(this.findPrevious) : this.findPrevious()
    },
    /**
     * 上一条方法
     */
    findPrevious () {
      let _num = this.doFindPage(2, this.rowId)
      if (_num === '当前为首条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_cashflow', query: { showId: _num, cashFlowId: this.cashFlowId } })
      }
    },
    /**
     * 下一条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用下一条方法
     */
    tofindNext () {
      this.dataChange ? this.doUpdateModel(this.findNext) : this.findNext()
    },
    /**
     * 下一条方法
     */
    findNext (type) {
      let _num = this.doFindPage(3, this.rowId, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
        setTimeout(() => {
          // this.$router.push({ name: 'cashflow_index' })
          this.closeTag(this.$route)
        }, 3000)
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_cashflow', query: { showId: _num, cashFlowId: this.cashFlowId } })
      }
    },
    /**
     * 尾条按钮
     * 判断数据是否发生变化
     * 发生变化：执行统一提示
     * 没有变化：调用尾条方法
     */
    tofindEnd () {
      this.dataChange ? this.doUpdateModel(this.findEnd) : this.findEnd()
    },
    /**
     * 尾条方法
     */
    findEnd () {
      let _num = this.doFindPage(4, this.rowId)
      if (_num === '当前为末条') {
        return false
      } else {
        this.rowId = _num
        this.$router.push({ name: 'update_cashflow', query: { showId: _num, cashFlowId: this.cashFlowId } })
      }
    }
  },
  computed: {
    /**
     * 非末级不能编辑,所有字段不能编辑
     */
    disableFinal () {
      return this.formCash.isFinal === 0
    },
    /**
     * 内部往来不能编辑，所有字段不能编辑
     */
    disasbleInter () {
      return this.formCash.isInteriorContact === 1
    },
    /**
     * 失效数据不能编辑，所有字段不能编辑，显示失效页面
     */
    disableEnable () {
      return this.formCash.isEnable === 0
    },
    /**
     * 删除掉的数据不能编辑，显示删除页面
     */
    disbaleDel () {
      return this.formCash.isDel === 1
    },
    /**
     * 引用的数据不能编辑, 描述字段可以编辑
     */
    disableRelation () {
      return this.isRelation
    },
    /**
     * 系统预置的数据不能编辑，描述字段可以编辑
     */
    disableInit () {
      return this.formCash.isInit === 1
    },
    /**
     * 数据变化标志
     * 渲染数据与备份数据对比
     * true：变化 false：未变化
     */
    dataChange () {
      return this.formData !== JSON.stringify(this.formCash)
    },
    /** 下发查询的参数 */
    selectParams () {
      return { id: this.rowId, cashFlowId: this.cashFlowId }
    }
  },
  watch: {
    selectParams () {
      this.doInit(true)
    },
    /**
     * 数据变化的监听函数
     * 当值未true时，执行方法
     */
    dataChange (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    this.doInit(true)
  }
}
</script>
<style lang="less">
.cashflow-update-page {
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  // 全局loading
  .ivu-spin-fix{
    z-index: 1000 !important;
  }
  .page-content {
    width: 857px;
    .ivu-form-item-error-tip {
      display: none;
    }
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
            right: -60px;
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
    .enable-invalid {
      width: 80px;
      height: 80px;
      position: absolute;
      text-align: center;
      line-height: 80px;
      top: 30px;
      left: 100px;
      z-index: 100;
      svg.iconfont.invalid-font {
        font-size: 70px !important ;
      }
    }
  }
}
</style>
