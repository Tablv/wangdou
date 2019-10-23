<template>
  <div class="creates">
    <Spin fix v-if="isCreates">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="create-header page-header">
      <div class="page-header-name">新增会计科目</div>
      <div class="create-header-button">
        <button class="header-bottom-preser box-background btn-width" @click="doPreservation">保存</Button>
        <Button class="header-bottom-add" @click.native="doProAdd">保存并新增</Button>
        <Button class="header-bottom-cancle btn-width" @click.native="doCancle">取消</Button>
        <Button class="header-bottom-list btn-width" @click.native="doGOList">列表</Button>
      </div>
    </div>
    <div class="create-title">
      <!-- 基础信息 -->
      <div :class="titleSwitch === 0 ? 'create-title-item-select textBorder select-basic' : 'create-title-item'" @click="doSelectTitle(0)">基本信息</div>
      <!-- 辅助核算 -->
      <div :class="titleSwitch === 1 ? 'create-title-item-select textBorder select-basic' : 'create-title-item'" @click="doSelectTitle(1)">辅助核算</div>
    </div>
    <!-- 基础信息 -->
    <basic v-show="titleSwitch === 0" :basics = "basic" ref="basic" @getChangeInfo="getChange" @getBasic="doGetBasic"></basic>
    <!-- 辅助模块 -->
    <auxiliary v-show="titleSwitch === 1" :auxiliary="auxiliaryData" :isSpecial="isSpecial" :isInterior="basic.isInterior" ref="auxiliary" @getChangeInfo="getChange"></auxiliary>
  </div>
</template>

<script>
import basic from './component/basic.vue'
import auxiliary from './component/auxiliary.vue'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'

export default {
  name: 'create_accountant',
  components: {
    basic,
    auxiliary
  },
  data () {
    return {
      ismounted: false, // 判断辅助核算有没有渲染
      isCreates: true, // 加载是否显示
      isSpecial: false, // 4103-利润分配、4104-本年利润的本级及下级所有科目不能设置辅助核算
      titleSwitch: 0, // 页签切换标志
      basic: {}, // 基础信息
      auxiliaryData: [],
      isChangeInfo: false // 页面内容是否被修改
    }
  },
  mixins: [saasMixin],
  mounted () {
    // 传入id，新增下级 不传id 新增按钮
    this.$route.query.id ? this.doGetInfo() : this.$route.query.cid ? this.doCopyGetInfo() : this.isCreates = false
  },
  watch: {
    isChangeInfo (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    doGetBasic (item) {
      if (item) {
        this.basic.isInterior = item.isInterior
        let specialList = ['4103', '4104']
        this.isSpecial = specialList.includes(item.code.substr(0, 4))
      } else {
        this.basic.isInterior = 1
        this.isSpecial = false
      }
    },
    /**
     * 两个子组件的监听事件
     */
    getChange (val) {
      this.isChangeInfo = val
    },
    // 获取数据信息
    doGetInfo (id, callback) {
      this.isCreates = true // loading
      this.$request.post('/financeback/accountSubject/findInfoById', { id: id || this.$route.query.id }).then(res => {
        this.isCreates = false
        if (callback) {
          callback(res.data.data)
        } else {
          if (res.data.code === 200) {
            this.basic = res.data.data
            let specialList = ['4103', '4104']
            this.isSpecial = specialList.includes(res.data.data.code.substr(0, 4))
            console.log(this.isSpecial)
          } else {
            this.basic = {}
          }
        }
      })
    },
    /**
     * copy 获取复制信息
     */
    doCopyGetInfo () {
      this.doGetInfo(this.$route.query.cid, data => {
        data.subCode = null
        data.subName = null
        data.code = data.upCode // 上级编辑
        data.fullName = data.fullName.split(`_${data.name}`).filter(item => item).join(name)
        data.name = data.upName
        data.id = data.upId
        data.version = data.upVersion
        data.level = parseInt(data.level) - 1
        // data.inflowId = data.cashInflowId
        // data.inflowCode = data.cashInflowCode
        // data.inflowName = data.cashInflowName
        // data.outflowId = data.cashOutflowId
        // data.outflowCode = data.cashOutflowCode
        // data.outflowName = data.cashOutflowName
        this.auxiliaryData = data.subjectAuxiliaryList
        this.basic = data
        let specialList = ['4103', '4104']
        this.isSpecial = specialList.includes(data.code.substr(0, 4))
      })
    },
    /**
     * 提示框
     */
    doShowModal (callback) {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl()
          that.doIntert(callback())
        },
        no () {
          that.$CloseCtl()
          callback()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.success('已取消')
        }
      })
    },
    // 是，否，取消弹窗
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        title: '提示信息',
        message: `当前页面数据已发生变化，是否保存再继续？`,
        button: ['是', '否', '取消'],
        yes () {
          that.$CloseCtl()
          that.doIntert(that.doContinueActions)
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.success('已取消')
        }
      })
    },
    /**
     * 插入动作
     */
    doIntert (callback = () => this.$Message.success('保存成功!')) {
      if (!this.$refs.basic.doCheckForm()) { return }
      // 辅助核算数据
      let auxli = this.ismounted ? this.$refs.auxiliary : {
        auxiliaryCodes: '', // 辅助核算编码拼接
        auxiliaryNames: '', // 辅助核算名称拼接
        auxiliarySources: '', // 辅助核算值来源拼接（暂时不传）
        auxiliarySourceTables: '', // 辅助核算值来源表拼接
        auxiliaryDependents: '' // 辅助核算值依赖拼接（暂时不传
      }
      // 新增参数
      let params = JSON.parse(JSON.stringify(this.$refs.basic.basic))
      let req = {
        upCode: params.code, // 上级编码
        upId: params.id,
        upVersion: params.version,
        code: params.code + params.subCode, // 科目编码
        name: params.subName, // 科目名称
        fullName: params.fullName + '_' + params.subName,
        level: parseInt(params.level) + 1, // 科目次级
        subjectId: params.subjectId,
        balanceDirection: params.balanceDirection, // 余额方向
        accountElementItem: params.accountElementItem, // 会计要素id
        accountElementItemName: params.accountElementItemName, // 会计要素表id
        isProfitAndLoss: params.isProfitAndLoss, // 是否损益科目
        isOffBalance: params.isOffBalance,
        subjectCategory: params.subjectCategory,
        subjectCategoryName: params.subjectCategoryName,
        accountCategory: params.accountCategory,
        isInit: 0,
        isInterior: 0,
        cashInflowId: params.cashInflowId, // 现金流入
        cashInflowCode: params.cashInflowCode, // 现金流入
        cashInflowName: params.cashInflowName, // 现金流入名称
        cashOutflowId: params.cashOutflowId, // 现金流出
        cashOutflowCode: params.cashOutflowCode, // 现金流出
        cashOutflowName: params.cashOutflowName, // 现金流出名称
        currencyIds: params.currencyIds, // 币种表id
        currencyNames: params.currencyNames, // 币种名称
        auxiliaryCodes: auxli.auxiliaryCodes, // 辅助核算id
        auxiliaryNames: auxli.auxiliaryNames, // 辅助核算名称
        // auxiliarySources: auxli.auxiliarySources, // 辅助核算值来源拼接
        // auxiliaryDependents: auxli.auxiliaryDependents, // 辅助核算值依赖拼接
        auxiliarySourceTables: auxli.auxiliarySourceTables // 辅助核算值来源表拼接
      }
      console.log(req.fullName)
      this.$request.post('/financeback/accountSubject/add', req).then(res => {
        if (res.data.code === 200) {
          this.$refs.basic.isChanged = false
          if (this.ismounted) { this.$refs.auxiliary.isChanged = false }
          setTimeout(() => { callback(res) }, 300)
        }
      })
    },
    // 点击保存
    doPreservation () {
      this.doIntert((res) => {
        this.$Message.success('保存成功!')
        this.addIdToList({ id: res.data.data, name: 'accountant' })
        // 跳转查看页
        this.$router.push({
          path: 'accountant_update',
          query: {
            id: res.data.data,
            isEnable: 1,
            accountTypeId: this.$route.query.accountTypeId,
            accStandardId: this.$route.query.accStandardId
          }
        })
      })
    },
    // 点击保存并新增
    doProAdd () {
      this.doIntert(() => {
        this.$Message.success('保存并新增成功!')
        // let params = JSON.parse(JSON.stringify(this.$refs.basic.basic))
        this.doGetInfo(this.$refs.basic.basic.id)
        if (this.ismounted) { this.$refs.auxiliary.isResh = !this.$refs.auxiliary.isResh }
      })
    },
    // 点击列表
    doGOList () {
      this.isChangeInfo ? this.doShowModal(() => { this.doLocationDetail('accountant_index') }) : this.doLocationDetail('accountant_index')
    },
    /**
     * 取消按钮
     */
    doCancle () {
      if (this.isChangeInfo) {
        let that = this
        this.$Control({
          type: 'confirm',
          title: '提示信息',
          message: '取消操作会重置当前表单，是否继续？',
          button: ['确认', '取消'],
          yes () {
            that.$CloseCtl()
            if (that.$route.query.id) {
              that.doGetInfo()
            } else {
              if (that.$route.query.cid) {
                that.doCopyGetInfo()
              } else {
                that.basic = {}
              }
            }
            that.$refs.basic.isChanged = false
            if (that.ismounted) {
              that.$refs.auxiliary.isChanged = false
              that.$refs.auxiliary.isResh = !that.$refs.auxiliary.isResh
            }
            // let basic = that.$refs.basic.basic
            // basic.subCode = null
            // basic.subName = null
            // // basic.balance = null
            // // basic.dealings = false
            // // basic.inflowMoney = null
            // // basic.flowMoney = null
            // that.$refs.basic.isChanged = false
            // if (that.ismounted) {
            //   that.$refs.auxiliary.isChanged = false
            //   that.$refs.auxiliary.isResh = !that.$refs.auxiliary.isResh
            // }
          },
          cancel () {
            that.$CloseCtl()
            that.$Message.info('已取消')
          }
        })
      }
    },
    // 切换标题
    doSelectTitle (msg) {
      this.titleSwitch = msg
      this.ismounted = true
    }
  }
}
</script>

<style lang="less">
@import "../../../../assets/css/base.less";
@import '../../../../assets/css/redefine.less';
.creates {
  width: 100%;
  height: 100%;
  position: relative;
  .ivu-modal-mask {
    position: absolute;
    left: 0px !important;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .create-header {
    width: 100%;
    .create-header-button {
      float: right;
      margin-right: 14px;
      height: 50px;
      .btn-width {
        width: 56px !important;
        padding-left: 0;
        padding-right: 0;
      }
      .header-bottom-preser {
        width: 64px;
        height: 32px;
        border-radius: 0;
        color: #ffffff;
        font-size: 12px;
        margin-top: 9px;
        margin-right: 5px;
        &:hover {
          cursor: pointer;
        }
      }
      .header-bottom-add {
        width: 96px;
        height: 32px;
        border-radius: 0;
        margin-right: 5px;
        margin-left: 5px;
      }
      .header-bottom-cancle {
        width: 64px;
        height: 32px;
        border-radius: 0;
        margin-right: 5px;
        margin-left: 5px;
      }
      .header-bottom-list {
        width: 64px;
        height: 32px;
        border-radius: 0;
        margin-left: 5px;
      }
    }
  }
  .create-title {
    width: 100%;
    height: 45px;
    padding-left: 16px;
    border-bottom: 1px solid #E5E5E5;
    .auxiliary-add {
      float: right;
      width: 102px;
      height: 35px;
      outline: none;
      border: none;
      color: #ffffff;
      font-size: 12px;
      cursor: pointer;
      margin-right: 16px;
      margin-top: 5px;
    }
    .create-title-item {
      width: 116px;
      height: 45px;
      line-height: 45px;
      color: #333333;
      font-size: 14px;
      text-align: center;
      float: left;
      cursor: pointer;
    }
    .create-title-item-select {
      width: 116px;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      text-align: center;
      float: left;
      cursor: pointer;
    }
    .select-basic {
      font-weight: 600;
    }
  }
}
</style>
