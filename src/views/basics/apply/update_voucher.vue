<template>
  <section class="append-voucher-container">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <!-- 这里是判断已删除 -->
    <common-icon v-if="VoucherField.isDel?true:false" class="yishixiao" type="_yishanchu" />
    <section class="page-header">
      <div class="page-header-name">查看常用摘要</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doSave" :disabled="VoucherField.isDel?true:false">保存</Button>
        <!-- <Button @click="doShowEditModal('cancelBtn')" :disabled="VoucherField.isDel?true:false">取消</Button> -->
        <Button @click="doCancel" :disabled="VoucherField.isDel?true:false">取消</Button>

        <Button @click="doShowEditModal('add')" :disabled="VoucherField.isDel?true:false">新增</Button>
        <Button @click="doShowEditModal('copy')" :disabled="VoucherField.isDel?true:false">复制</Button>
        <!-- <Button @click="doShowEditModal('delete')" :disabled="VoucherField.isDel?true:false">删除</Button> -->
        <Button @click="doDeleteBtn" :disabled="VoucherField.isDel?true:false">删除</Button>
        <Button @click="goVoucherList">列表</Button>
        <!-- 首条 -->
        <Button  @click="doShowEditModal('findFirst')" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" type="_shouye" />
          </span>
        </Button>
        <!-- 上一条 -->
        <Button icon="ios-arrow-back" @click="doShowEditModal('findPrevious')"></Button>
        <!-- 下一条 -->
        <Button icon="ios-arrow-forward" @click="doShowEditModal('findNext')"></Button>
        <!-- 末条 -->
        <Button class="isfenye" @click="doShowEditModal('findEnd')">
          <span class="dofenye">
            <common-icon  class="fenye" type="_moye" />
          </span>
        </Button>
      </div>
    </section>
    <section class="page-content">
      <Form :model="VoucherField" :label-width="110"  class="formAdd"  >
        <Row>
          <Col style="width:410px;float:left">
          <FormItem label="创建公司" prop="company">
            <RadioSelect :config="table_config" v-model="VoucherField.createEnterpriseName" @getData="handleGetData" disabled>
              <div slot="header">
              <div class="search-contain">
                <Row :gutter="10">
                  <Col span="4">
                    <Select v-model="table_config.request_params.companyFormId" @on-change="doChangeForm">
                      <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
                    </Select>
                  </Col>
                  <Col span="8">
                    <Row class-name="search-input-content">
                      <Col span="20" class="contralColor">
                        <Input v-model="table_config.request_params.codeOrName" placeholder="公司编码/名称"
                        enter-button clearable
                        @on-search="table_config.refresh = !table_config.refresh"
                        @on-enter="table_config.refresh = !table_config.refresh"
                        @on-clear="table_config.refresh = !table_config.refresh">
                      </Input>
                      </Col>
                      <Col span="2">
                        <Button icon="ios-search" class="search-icon-button" @click="table_config.refresh = !table_config.refresh"></Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="4">
                    <Button  @click="resetrefresh">重置</Button>
                  </Col>
                </Row>
              </div>
            </div>
           </RadioSelect>
              <!-- <Select
                clearable
                v-model="VoucherField.createEnterpriseName"
                filterable
                remote
                :transfer="true"
                :remote-method="remoteMethod"
                :loading="select_loading"
                placeholder=""
                >
                <Option v-for="(item, key) in select_list" :key="key" :value="item.name">{{ item.name }}</Option>
              </Select> -->
              <Icon class="search-icon search-style" type="md-more" size="18" ></Icon>
              <span class="istest" style="right:-41px;top:0">*</span>
            </FormItem>
          </Col>
          <!-- <Col style="width:410px;float:left">
          <FormItem label="使用公司" prop="company">
            <Input v-model="VoucherField.useEnterpriseName" type="text" placeholder="" disabled/>
          </FormItem>
          </Col> -->
        </Row>
        <Row>
          <Col style="width:820px">
          <FormItem label="摘要内容" prop="company">
            <Input v-model="VoucherField.abstractContent" type="textarea" :disabled="VoucherField.isDel?true:false" :autosize="{minRows: 4}" @on-change="changeData" :maxlength="60"/>
            <span class="istest">*</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col style="width:410px;float:left">
          <FormItem label="助记码" prop="company">
            <Input v-model="VoucherField.abstractCode" type="text" :disabled="VoucherField.isDel?true:false" @on-change="changeData" :maxlength="10"/>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col style="width:410px">
          <FormItem label="资料类型" prop="company">
            <Select v-model="model1">
              <Option value="0" :disabled="VoucherField.useEnterpriseId?true:false">共享</Option>
              <Option value="1" :disabled="VoucherField.useEnterpriseId?false:true">私有</Option>
              <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </section>
  </section>
</template>

<script>
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins'
import RadioSelect from '_c/radio-select'
import { mapMutations } from 'vuex'
export default {
  name: 'update_voucher',
  mixins: [saasMixin],
  components: {
    CommonIcon,
    RadioSelect
  },
  mounted () {
    this.doInit()
  },
  data () {
    return {
      loading: false, // 加载loading
      VoucherField: {
        id: null,
        createEnterpriseId: null,
        useEnterpriseId: null,
        createEnterpriseName: '',
        useEnterpriseName: '',
        abstractContent: '',
        abstractCode: '',
        lastUpdateTime: ''
      },
      HistoryField: {}, // 保存历史纪录
      table_config: {
        type: 'company',
        title: '选择公司',
        width: 100 + '%',
        refresh: false,
        request_params: {
          companyFormId: null,
          menuCode: 'voucher_index',
          isEnterpriseAdmin: 0,
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
      ],
      changeContext: false,
      select_loading: false,
      model1: '0',
      select_list: []
    }
  },
  watch: {
    changeContext (val) {
      console.log(val)
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    doInit (judgeData) {
      let req = null
      if (judgeData) {
        req = judgeData
      } else {
        req = this.$route.query.id
      }
      this.loading = true
      this.$request.post('/financeback/commonAbstract/findCommonAbstract', { id: req, isEnterpriseAdmin: 1 }).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.VoucherField = res.data.data
          this.HistoryField = JSON.parse(JSON.stringify(res.data.data))
          if (res.data.data.useEnterpriseId === 0) {
            this.VoucherField.createEnterpriseName = '集团'
            this.HistoryField.createEnterpriseName = '集团'
            this.model1 = '0'
          } else {
            this.model1 = '1'
          }
          if (judgeData) {
            this.$router.push({ name: 'update_voucher', query: { id: judgeData } })
          }
          this.changeContext = false
        }
      })
    },
    // 保存
    doSave (getData) {
      let req = {
        id: this.VoucherField.id,
        createEnterpriseId: this.VoucherField.createEnterpriseId,
        useEnterpriseId: this.VoucherField.useEnterpriseId,
        abstractContent: this.VoucherField.abstractContent,
        abstractCode: this.VoucherField.abstractCode,
        lastUpdateTime: this.VoucherField.lastUpdateTime
      }
      req.abstractContent.trim()
      req.abstractCode.trim()
      if (this.VoucherField.abstractContent !== '') {
        // let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        // if (this.VoucherField.abstractCode.match(reg) || this.VoucherField.abstractCode === '') {
        this.$request.post('/financeback/commonAbstract/updateCommonAbstract', { ...req, isEnterpriseAdmin: 1 }).then(res => {
          let { code, message } = res.data
          if (code === 200) {
            this.changeContext = false
            this.$Message.success('保存成功！')
            switch (getData) {
              case 'closeTab': // tab页签关闭
                this.doContinueActions()
                break
              case 'add': // 保存成功 - 新增
                this.$router.push({ name: 'create_voucher' })
                break
              case 'copy': // 保存成功 - 复制
                let req = {} // 定义发送给新增界面的字段
                let toGiveName = {
                  createCompany: this.VoucherField.createEnterpriseName,
                  useCompany: this.VoucherField.useEnterpriseName
                }
                let toGiveReq = {
                  createEnterpriseId: this.VoucherField.createEnterpriseId,
                  useEnterpriseId: this.VoucherField.useEnterpriseId,
                  abstractContent: this.VoucherField.abstractContent,
                  abstractCode: ''
                }
                req.toGiveName = toGiveName
                req.toGiveReq = toGiveReq
                this.$router.push({ name: 'create_voucher', query: { data: req } })
                break
              case 'delete': // 保存成功 - 删除
                this.doDeleteBtn()
                break
              case 'findFirst': // 保存成功 - 首条
                let firstNum = this.doFindPage(1, this.$route.query.id)
                if (firstNum === '当前为首条') {
                  return false
                } else {
                  console.log('到首条', firstNum)
                  this.doInit(firstNum)
                }
                break
              case 'findPrevious': // 保存成功 - 上一条
                let previousNum = this.doFindPage(2, this.$route.query.id)
                console.log(previousNum)
                if (previousNum === '当前为首条') {
                  return false
                } else {
                  this.doInit(previousNum)
                }
                break
              case 'findNext': // 保存成功 -下一条
                let nextNum = this.doFindPage(3, this.$route.query.id)
                if (nextNum === '当前为末条') {
                  return false
                } else if (nextNum === '跳转') {
                  setTimeout(() => {
                    this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                  }, 1000)
                  setTimeout(() => {
                    // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                    this.closeTag({ route: this.$route })
                  }, 3000)
                } else {
                  this.doInit(nextNum)
                }
                break
              case 'findEnd': // 保存成功 -尾条
                let endNum = this.doFindPage(4, this.$route.query.id)
                if (endNum === '当前为末条') {
                  return false
                } else {
                  this.doInit(endNum)
                }
                break
              default:
                this.doInit()
                break
            }
          } else {
            this.$Message.error(message)
          }
        })
        // } else {
        //   this.$Message.error('[助记码]:10字符以内文本（中文，英文，数字）')
        // }
      } else {
        this.$Message.error('必填项不能为空：[摘要内容]')
      }
    },
    // 列表
    goVoucherList () {
      this.doLocationDetail('voucher_index')
    },
    // 创建公司弹窗-重置
    resetrefresh () {
      this.table_config.request_params.companyFormId = null
      this.table_config.request_params.codeOrName = ''
      this.table_config.refresh = !this.table_config.refresh
    },
    // 创建公司弹窗-选择（返回数据）
    handleGetData (data, item) {
      console.log(data, item)
    },
    // 创建公司弹窗-形态
    doChangeForm () {
      console.log(this.table_config.request_params)
    },
    findFirst () {},
    findPrevious () {},
    findNext () {},
    findEnd () {},
    // 界面数据改变
    changeData () {
      this.changeContext = true
    },
    // 是否，取消的弹窗
    doShowEditModal (data) {
      if (this.changeContext) { // 数据改变
        let that = this
        this.$Control({
          type: 'control',
          title: '消息提示',
          transfer: true,
          message: '当前数据已修改，需要保存吗？',
          button: ['是', '否', '取消'],
          yes () {
            switch (data) {
              case 'cancelBtn': // 取消逻辑
                that.doSave()
                break
              case 'add': // 新增逻辑
                that.doSave('add')
                break
              case 'copy': // 复制逻辑
                that.doSave('copy')
                break
              case 'delete': // 删除逻辑
                that.doSave('delete')
                break
              case 'findFirst': // 首条
                that.doSave('findFirst')
                break
              case 'findPrevious': // 上一条
                that.doSave('findPrevious')
                break
              case 'findNext': // 下一条
                that.doSave('findNext')
                break
              case 'findEnd': // 尾条
                that.doSave('findEnd')
                break
              default: // 改变Tab逻辑
                that.doSave('closeTab')
                break
            }
            that.$CloseCtl()
          },
          no () {
            that.changeContext = false
            switch (data) {
              case 'cancelBtn': // 取消按钮
                that.doInit()
                break
              case 'add': // 新增
                that.$router.push({ name: 'create_voucher' })
                break
              case 'copy': // 复制
                console.log(that.HistoryField)
                let req = {} // 定义发送给新增界面的字段
                let toGiveName = {
                  createCompany: that.HistoryField.createEnterpriseName,
                  useCompany: that.HistoryField.useEnterpriseName
                }
                let toGiveReq = {
                  createEnterpriseId: that.HistoryField.createEnterpriseId,
                  useEnterpriseId: that.HistoryField.useEnterpriseId,
                  abstractContent: that.HistoryField.abstractContent,
                  abstractCode: ''
                }
                req.toGiveName = toGiveName
                req.toGiveReq = toGiveReq
                that.$router.push({ name: 'create_voucher', query: { data: req } })
                break
              case 'delete': // 删除
                that.doInit()
                setTimeout(() => {
                  that.doDeleteBtn()
                }, 500)
                break
              case 'findFirst': // 首条
                let firstNum = that.doFindPage(1, that.$route.query.id)
                if (firstNum === '当前为首条') {
                  return false
                } else {
                  that.doInit(firstNum)
                }
                break
              case 'findPrevious': // 上一条
                let previousNum = that.doFindPage(2, that.$route.query.id)
                console.log(previousNum)
                if (previousNum === '当前为首条') {
                  return false
                } else {
                  that.doInit(previousNum)
                }
                break
              case 'findNext': // 下一条
                let nextNum = that.doFindPage(3, that.$route.query.id)
                if (nextNum === '当前为末条') {
                  return false
                } else if (nextNum === '跳转') {
                  setTimeout(() => {
                    that.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                  }, 1000)
                  setTimeout(() => {
                    // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                    that.closeTag({ route: that.$route })
                  }, 3000)
                } else {
                  that.doInit(nextNum)
                }
                break
              case 'findEnd': // 尾条
                let endNum = that.doFindPage(4, that.$route.query.id)
                if (endNum === '当前为末条') {
                  return false
                } else {
                  that.doInit(endNum)
                }
                break
              default:
                that.doContinueActions()
                break
            }
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      } else { // 数据没有改变
        switch (data) {
          case 'add': // 新增逻辑
            this.$router.push({ name: 'create_voucher' })
            break
          case 'copy': // 复制逻辑
            let req = {} // 定义发送给新增界面的字段
            let toGiveName = {
              createCompany: this.VoucherField.createEnterpriseName,
              useCompany: this.VoucherField.useEnterpriseName
            }
            let toGiveReq = {
              createEnterpriseId: this.VoucherField.createEnterpriseId,
              useEnterpriseId: this.VoucherField.useEnterpriseId,
              abstractContent: this.VoucherField.abstractContent,
              abstractCode: ''
            }
            req.toGiveName = toGiveName
            req.toGiveReq = toGiveReq
            this.$router.push({ name: 'create_voucher', query: { data: req } })
            break
          case 'delete': // 删除
            this.doDeleteBtn()
            break
          case 'findFirst': // 首条
            let firstNum = this.doFindPage(1, this.$route.query.id)
            if (firstNum === '当前为首条') {
              return false
            } else {
              this.doInit(firstNum)
            }
            break
          case 'findPrevious': // 上一条
            let previousNum = this.doFindPage(2, this.$route.query.id)
            console.log(previousNum)
            if (previousNum === '当前为首条') {
              return false
            } else {
              this.doInit(previousNum)
            }
            break
          case 'findNext': // 下一条
            let nextNum = this.doFindPage(3, this.$route.query.id)
            if (nextNum === '当前为末条') {
              return false
            } else if (nextNum === '跳转') {
              setTimeout(() => {
                this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
              }, 1000)
              setTimeout(() => {
                // 关闭查看页面，跳转到新增页面 closeTag 方法在user.js中
                this.closeTag({ route: this.$route })
              }, 3000)
            } else {
              this.doInit(nextNum)
            }
            break
          case 'findEnd': // 尾条
            let endNum = this.doFindPage(4, this.$route.query.id)
            if (endNum === '当前为末条') {
              return false
            } else {
              this.doInit(endNum)
            }
            break
          default:
            break
        }
      }
    },
    doCancel () {
      if (this.changeContext) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '消息提示',
          transfer: true,
          message: '注意：取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.doInit()
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 删除弹窗
    doDeleteBtn () {
      console.log('删除')
      let req = this.$route.query.id
      let that = this
      this.$Control({
        type: 'confirm',
        title: '消息提示',
        transfer: true,
        message: '注意：确认删除该数据？',
        button: ['确认', '取消'],
        yes () {
          that.$request.post('/financeback/commonAbstract/deleteCommonAbstract', { id: req, isEnterpriseAdmin: 1 }).then(res => {
            let { code, data, message } = res.data
            if (code === 200) {
              that.changeContext = false
              console.log(data)
              that.$Message.success('删除成功！')
              let nextNum = that.doFindPage(3, that.$route.query.id, 'delete')
              console.log(nextNum)
              if (nextNum === '当前为末条') {
                return false
              } else if (nextNum === '跳转') {
                setTimeout(() => {
                  that.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
                }, 1000)
                setTimeout(() => {
                  // 关闭查看页面，跳转到列表页面 -  closeTag 方法在user.js中
                  that.closeTag({ route: that.$route })
                }, 3000)
              } else {
                that.doInit(nextNum)
              }
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
    remoteMethod () {}
  }
}
</script>

<style lang="less" scoped>
 .append-voucher-container {
   .search-style {
    position: absolute;
    top: 8px;
    right:2px;
  }
  .ivu-form-item{
    margin-bottom: 8px;
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
  .ivu-col-span-6 {
    display: block;
    width: 24.05%;
  }
  .ivu-col-span-12 {
    display: block;
    width: 48.1%;
  }
 }
</style>

<style lang="less">
@import "../../../assets/css/base.less";
@import '../../../assets/css/redefine.less';
 .append-voucher-container {
   textarea {
    resize: none!important;
  }
  .page-footer .page-footer-rt {
    flex: 7
  }
 }
</style>
