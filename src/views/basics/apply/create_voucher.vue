<template>
  <section class="append-voucher-container">
    <Spin fix v-if="loading" style="left:8px;z-index:201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">新增常用摘要</div>
      <div class="page-header-actions">
        <Button type="primary" @click="doSave">保存</Button>
        <Button @click="doSave('add')">保存并新增</Button>
        <Button @click="doCancel">取消</Button>
        <!-- <Button @click="goSearch">查找</Button> -->
        <Button @click="goVoucherList">列表</Button>
      </div>
    </section>
    <section class="page-content">
      <Form :model="VoucherField" :label-width="110"  class="formAdd"  >
        <Row>
          <Col style="width:410px;float:left">
          <FormItem label="创建公司" prop="company">
            <RadioSelect :config="table_config" v-model="VoucherField.createCompany" :bloc='true' :reset="table_config.refresh" @getData="handleGetData" @change="ChangeForm" @on-close="doCloseCompany">
              <div slot="header">
              <div class="search-contain">
                <Row :gutter="10">
                  <Col span="4">
                    <Select v-model="companyFormId" @on-change="doCompanyFormIdChange" placeholder="全部形态">
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
                    <Button class="reset-button" @click="resetrefresh">重置</Button>
                  </Col>
                </Row>
              </div>
            </div>
           </RadioSelect>
              <span class="istest" style="right:-41px;top:0">*</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col style="width:820px">
          <FormItem label="摘要内容" prop="company">
            <Input v-model="toReq.abstractContent" type="textarea" :autosize="{minRows: 4}" placeholder="" :maxlength="60" @on-change="doChangeData"/>
            <span class="istest">*</span>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col style="width:410px">
          <FormItem label="助记码" prop="company">
            <Input v-model="toReq.abstractCode" type="text" placeholder="" :maxlength='10' @on-change="doChangeData"/>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col style="width:410px">
          <FormItem label="资料类型" prop="company">
            <Select v-model="model1">
              <Option value="0" :disabled="toReq.createEnterpriseId?true:false">共享</Option>
              <Option value="1" :disabled="toReq.createEnterpriseId?false:true">私有</Option>
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
import { saasMixin } from '@/libs/mixins'
import { session } from '@/libs/location.js'
import { mapMutations } from 'vuex'
import RadioSelect from '_c/radio-select'
// import { transObjToArr } from '@/libs/tools'
export default {
  name: 'create_voucher',
  mixins: [saasMixin],
  components: {
    RadioSelect
  },
  computed: {
    createEnterpriseId () {
      return this.toReq.createEnterpriseId
    }
  },
  watch: {
    changeContext (val) {
      console.log(val)
      this.doIdentifying(this.$route, val)
    },
    // 监听创建公司-用于改变控制策略
    createEnterpriseId (newValue, oldValue) {
      console.log(newValue)
      if (newValue !== JSON.parse(session.getItem('userInfo')).rootEnterpriseId) {
        this.model1 = '1'
      } else {
        this.model1 = '0'
      }
    }
  },
  data () {
    return {
      loading: false, // 加载loading
      VoucherField: {
        createCompany: '集团',
        useCompany: ''
      },
      toReq: {
        createEnterpriseId: 0,
        useEnterpriseId: 0,
        abstractContent: '',
        abstractCode: ''
      },
      changeContext: false, // 判断页面数据是否改变
      table_config: {
        type: 'company',
        title: '选择公司',
        width: 100 + '%',
        refresh: false,
        request_params: {
          companyFormId: null,
          menuCode: 'voucher_index',
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      companyFormId: 0,
      cityList: [
        {
          value: '0',
          label: '共享'
        },
        {
          value: '1',
          label: '私有'
        }
      ],
      model1: '0',
      select_list: [],
      type_list: [] // 单选形态
    }
  },
  mounted () {
    //
    this.doGetUnitFormId()
    this.doInit()
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    // 获取公司编码或名称中弹窗的形态
    doGetUnitFormId () {
      this.$request.post('/financeback/businessUnit/findFormList').then(result => {
        let { code, data } = result.data
        if (code === 200) {
          let _data = [{
            value: 0,
            label: '全部形态'
          }]
          data.forEach(item => {
            _data.push({
              value: item.id,
              label: item.name
            })
          })
          this.type_list = _data
        }
      })
    },
    doInit () {
      // console.log(this.$route)
      if (this.$route.query.data) {
        this.VoucherField = this.$route.query.data.toGiveName
        this.toReq = this.$route.query.data.toGiveReq
        console.log(this.toReq)
        if (this.toReq.createEnterpriseId) {
          this.model1 = '1'
        } else {
          this.model1 = '0'
        }
        console.log(this.model1)
      } else {
        console.log('其他')
      }
    },
    // 触发弹窗调用接口
    doSearchCompany () {
      this.$set(this.table_config, 'refresh', !this.table_config.refresh)
    },
    // 切换公司形态
    doCompanyFormIdChange (val) {
      console.log(val)
      let params = val === 0 ? null : val // 为0时表示全部形态
      this.table_config.request_params.companyFormId = params
      this.doSearchCompany()
    },
    // 保存
    doSave (getdata) {
      console.log(getdata, 'getdata')
      this.toReq.abstractContent.trim()
      this.toReq.abstractCode.trim()
      if (this.toReq.createEnterpriseId >= 0 && this.toReq.abstractContent !== '') {
        console.log('1.必填项校验成功')
        // let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
        // if (this.toReq.abstractCode.match(reg) || this.toReq.abstractCode === '') {
        console.log('2、检查字段内容是否符合字段规则')
        this.$request.post('/financeback/commonAbstract/addCommonAbstract', { ...this.toReq, isEnterpriseAdmin: 1 }).then(res => {
          console.log('3、检查摘要内容在公司内是否重复')
          let { code, data } = res.data
          if (code === 200) {
            this.$Message.success('保存成功！')
            this.changeContext = false
            this.addIdToList({ id: data, name: 'voucher' })
            if (getdata === 'add') {
              // this.handelCreateCompany()
              this.toReq.abstractContent = ''
              this.toReq.abstractCode = ''
              this.VoucherField.createCompany = '集团'
              this.toReq.createEnterpriseId = 0
              this.toReq.useEnterpriseId = 0
              this.changeContext = false
            } else if (getdata === 'closeTab') {
              this.doContinueActions()
            } else {
              this.$router.push({ name: 'update_voucher', query: { id: data } })
            }
          }
        })
        // } else {
        //   this.$Message.error('[助记码]:10字符以内文本（中文，英文，数字）')
        // }
      } else {
        this.$Message.error('必填项不能为空')
      }
    },
    // 取消
    doShowEditModal (data) {
      if (this.changeContext) {
        let that = this
        this.$Control({
          type: 'control',
          title: '消息提示',
          transfer: true,
          message: '当前数据已修改，需要保存吗？',
          button: ['是', '否', '取消'],
          yes () {
            if (data === 'cancelBtn') {
              that.doSave('add')
            } else {
              that.doSave('closeTab')
            }
            that.$CloseCtl()
          },
          no () {
            that.toReq.abstractContent = ''
            that.toReq.abstractCode = ''
            that.VoucherField.createCompany = '集团'
            that.toReq.createEnterpriseId = 0
            that.toReq.useEnterpriseId = 0
            that.changeContext = false
            if (data === 'cancelBtn') {
              console.log('取消')
            } else {
              that.doContinueActions()
            }
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
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
            that.toReq.abstractContent = ''
            that.toReq.abstractCode = ''
            that.VoucherField.createCompany = '集团'
            that.toReq.createEnterpriseId = 0
            that.toReq.useEnterpriseId = 0
            that.changeContext = false
            that.$CloseCtl()
          },
          cancel () {
            that.$CloseCtl()
          }
        })
      }
    },
    // 跳转到列表页
    goVoucherList () {
      this.doLocationDetail('voucher_index')
    },
    ChangeForm () {},
    // 创建公司弹窗-重置
    resetrefresh () {
      this.companyFormId = 0
      this.table_config.request_params.companyFormId = null
      this.table_config.request_params.codeOrName = ''
      this.table_config.refresh = !this.table_config.refresh
    },
    // 创建公司弹窗-选择（返回数据）
    handleGetData (data, item) {
      // console.log(data, item)
      console.log('aa')
      if (!item) { return }
      if (data.name === '集团') {
        data.id = 0
      }
      this.resetrefresh()
      this.changeContext = true
      this.VoucherField.createCompany = data.name
      this.VoucherField.useCompany = data.name
      this.toReq.createEnterpriseId = data.id
      this.toReq.useEnterpriseId = data.id
    },
    // 创建公司弹窗 - 关闭
    doCloseCompany () {
      this.resetrefresh()
    },
    // 监测数据变化
    doChangeData () {
      this.changeContext = true
    }
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
@import '../../../assets/css/base.less';
@import '../../../assets/css/redefine.less';
 .append-voucher-container {
   textarea {
    resize: none!important;
  }
  .input_icon {
    .ivu-input-icon {
      right: 2.75rem;
    }
  }
  .ivu-table-tip {
    height: 0;
  }
  .page-footer .page-footer-rt {
    flex: 7
  }
 }
</style>
