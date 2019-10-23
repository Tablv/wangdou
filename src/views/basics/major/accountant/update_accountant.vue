<template>
  <div class="update-create">
    <Spin fix v-if="isupdate">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <div class="create-invalid" v-if="seeInfo.isEnable === 0">
      <common-icon type="_yishixiao1" :size="14" class="invalid-font"></common-icon>
    </div>
    <div class="create-invalid" v-if="isDelete">
      <common-icon type="_yishanchu" :size="14" class="invalid-font"></common-icon>
    </div>
    <div class="create-header page-header">
      <div class="page-header-name">查看会计科目</div>
      <div class="page-header-actions create-header-button">
        <Button type="primary"  class="header-button btn-width" :disabled="isDelete" @click="doPreservation">保存</Button>
        <Button class="header-button btn-width" :disabled="isDelete" @click="doCancle">取消</Button>
        <Button class="header-button btn-width" :disabled="isDelete" @click="doGoAdd">新增</Button>
        <Button @click="doCopy" :disabled="isDelete">复制</Button>
        <Button class="header-button btn-width" :disabled="isDelete" @click="doDelete('delete')">删除</Button>
        <Button class="header-button btn-width" :disabled="isDelete" @click.native="doGOList">列表</Button>
        <Button class="header-button btn-width" v-if="seeInfo.isEnable === 1" :disabled="isDelete" @click="doProhibit">禁用</Button>
        <Button class="header-button" v-if="seeInfo.isEnable === 0" :disabled="isDelete" @click="doNoProhibit">反禁用</Button>
        <!-- 首条 -->
        <Button  @click="toFindFirst" class="isfenye">
          <span class="dofenye">
            <common-icon  class="fenye" :size="14" type="_shouye"/>
          </span>
        </Button>
        <Button icon="ios-arrow-back" class="header-button" @click.native="toFindPrevious"></Button>
        <Button icon="ios-arrow-forward" class="header-button" @click.native="toFindNext"></Button>
        <!-- 末条 -->
        <Button class="isfenye" @click="toFindEnd">
          <span class="dofenye">
            <common-icon  class="fenye" :size="14" type="_moye" />
          </span>
        </Button>
      </div>
    </div>
    <div class="create-title">
      <div :class="titleSwitch === 0 ? 'create-title-item-select textBorder' : 'create-title-item'" @click="doSelectTitle(0)">基本信息</div>
      <div :class="titleSwitch === 1 ? 'create-title-item-select textBorder' : 'create-title-item'" @click="doSelectTitle(1)">辅助核算</div>
    </div>
    <!-- 查看基础信息 -->
    <find-basic v-show="titleSwitch === 0" ref="findBasics" :basicInfo="seeInfo" @getBasic="doBasicChange" @getChangeInfo="getChange"></find-basic>
    <!-- 查看辅助核算 -->
    <find-auxiliary v-show="titleSwitch === 1" :isDisableFlag="unAuxliChange" :isInterior="isInterior" :isSpecial="isSpecial" ref="findAuxiliary" :auxInfo="seeList" @getChangeInfo="getChange"></find-auxiliary>
    <!-- 添加核算项目 -->
    <!-- 删除弹窗 -->
    <!-- <delete-modal :showDelete="showDelete" :deleteInfo="deleteInfo" :modalTilte="modalTilte" @doClose="doDeleteClose"></delete-modal> -->
  </div>
</template>

<script>
import CommonIcon from '_c/common-icon'
import findBasic from './component/findBasic.vue'
import findAuxiliary from './component/findAuxiliary.vue'
// import deleteModal from './component/deleteModal.vue'
import { saasMixin } from '@/libs/mixins'
import { mapMutations } from 'vuex'
export default {
  name: 'update_accountant',
  components: {
    findBasic,
    findAuxiliary,
    CommonIcon
    // deleteModal
  },
  mixins: [saasMixin],
  data () {
    return {
      isChangeInfo: false, // 数据是否发生变化
      isupdate: true, // 是否加载
      findBasic: {},
      deleteModal: false, // 控制删除弹窗
      titleSwitch: 0, // 标题的切换
      info: null,
      // deleteInfo: {
      //   ids: [],
      //   isbatch: null // 1.批量删除，2.单条删除，3，单条禁用，4.批量禁用，5.单条反禁用，6.批量反禁用
      // }, // 删除，禁用，反禁用,信息
      // // showDelete: false, // 删除弹窗是否显示
      // modalTilte: {
      //   title: null,
      //   content: null
      // },
      basic: {},
      seeInfo: {}, // 基础信息
      seeInfoBck: '', // 基础信息备份
      seeList: [], // 辅助核算信息
      seeListBck: '',
      isInterior: 1, // 是不是内部往来项目
      isSpecial: false, // 4103-利润分配、4104-本年利润的本级及下级所有科目不能设置辅助核算
      ismounted: false // 判断核算主体是不是不渲染了
    }
  },
  computed: {
    /**
     * 辅助核算能不能编辑
     * 非末级不能编辑  预置数据不能编辑 存在引用关系，禁用状态 不能编辑
     */
    unAuxliChange () {
      return this.seeInfo.isFinal === 0 || this.seeInfo.isInterior === 1 || this.seeInfo.isCited === 1 || this.seeInfo.isEnable === 0
    },
    /**
     * 要不要禁用
     */
    isDisable () {
      return this.seeInfo.isEnable === 0 || this.seeInfo.isDel === 1
    },
    /**
     * 删除信息
     */
    isDelete () {
      return this.seeInfo.isDel === 1
    }
  },
  watch: {
    isChangeInfo (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    this.doGetInfo()
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    doBasicChange (item) {
      if (item) {
        this.isInterior = item.isInterior
        let specialList = ['4103', '4104']
        this.isSpecial = specialList.includes(item.code.substr(0, 4))
      } else {
        this.isInterior = 1
        this.isSpecial = false
      }
    },
    /**
     * 两个子组件的监听事件
     */
    getChange (val) {
      this.isChangeInfo = val
    },
    // 获取数据
    doGetInfo () {
      this.isupdate = true // 打开loading状态
      this.$request.post('/financeback/accountSubject/findInfoById', { id: this.$route.query.id }).then(res => {
        this.isupdate = false
        this.isChangeInfo = false
        this.$refs.findBasics.isChanged = false
        if (res.data.code === 200) {
          this.seeInfo = res.data.data
          this.isInterior = res.data.data.isInterior
          let specialList = ['4103', '4104']
          this.isSpecial = specialList.includes(res.data.data.code.substr(0, 4))
          this.seeInfoBck = JSON.stringify(this.seeInfo)
          this.seeList = this.seeInfo.subjectAuxiliaryList
          this.seeListBck = JSON.stringify(this.seeList)
        }
      })
    },
    /**
     * 保存按钮
     */
    doPreservation () {
      this.doUpdate(() => {
        this.$Message.success('保存成功!')
        this.doGetInfo()
      })
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
            that.$refs.findBasics.isChanged = false
            that.seeInfo = JSON.parse(that.seeInfoBck)
            if (that.ismounted) {
              that.$refs.findAuxiliary.isChanged = false
              that.seeList = JSON.parse(that.seeListBck)
            }
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
    doGoAdd () {
      if (this.seeInfo.isEnable === 0) {
        return this.$Message.warning('禁用项目无法新增下级！')
      }
      if (this.seeInfo.isCited === 1) {
        return this.$Message.warning('当前数据已使用，无法新增下级！')
      }
      if (this.seeInfo.isInterior === 1) {
        return this.$Message.warning('内部往来科目不能新增下级！')
      }
      if (this.seeInfo.childNum >= 99) {
        return this.$Message.warning('当前下级数据以达到最大99个，无法新增下级!')
      }
      if (this.seeInfo.level >= this.seeInfo.maxLevel.split('-').length) {
        return this.$Message.warning('当前数据已达最大级次，无法新增下级!')
      }
      let req = { upCode: this.seeInfo.code, subjectId: this.seeInfo.subjectId }
      this.$request.post('/financeback/accountSubject/checkNextInitInfo', req).then(res => {
        if (res.data.code === 200) {
          setTimeout(() => {
            this.doLocationDetail('create_accountant', { id: this.seeInfo.id, subjectId: this.subject, accountTypeId: this.accountBook, accStandardId: this.accounting })
          }, 100)
        } else {
          this.$Message.warning('当前预置数据不能新增下级！')
        }
      })
    },
    /**
     * 删除按钮
     */
    doDelete () {
      if (this.seeInfo.isInit === 1) {
        return this.$Message.error('系统预置科目不可删除')
      }
      // this.seeInfo.isFinal === 0
      if (this.seeInfo.childNum !== 0) {
        return this.$Message.error('删除失败，请先删除下级科目')
      }
      let that = this
      this.$Control({
        type: 'confirm',
        title: '确认删除',
        message: '注意：删除后将不可恢复！请确认是否要删除数据？',
        button: ['确认', '取消'],
        yes () {
          that.$CloseCtl()
          that.doDeleteActive()
        },
        cancel () {
          that.$CloseCtl()
          that.$Message.info('已取消')
        }
      })
      // this.doDeleteActive()
      // this.isChangeInfo ? this.doShowModal(() => { this.doDeleteActive() }) : this.doDeleteActive()
    },
    /**
     * 删除操作
     */
    doDeleteActive () {
      if (this.seeInfo.isFinal === 0) {
        return this.$Message.error('删除失败，请先删除下级科目')
      }
      if (this.seeInfo.isCited === 1) {
        return this.$Message.error('当前数据已使用，无法删除')
      }
      let req = {
        ids: [this.seeInfo.id],
        versionList: [this.seeInfo.version]
      }
      this.$request.post('/financeback/accountSubject/updateBatchDelete', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.successDetailsList.length) {
            this.doDeleteImplete('delete')
            return this.$Message.success('删除成功')
          } else {
            this.$Message.error('删除失败:' + res.data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    // 删除处理函数
    doDeleteImplete (type) {
      let _num = this.doFindPage(3, this.$route.query.id, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
        setTimeout(() => {
          this.closeTag(this.$route)
        }, 3000)
      } else {
        this.doChangePage(_num)
      }
    },
    // 打开模态框
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
     * 禁用按钮
     */
    doProhibit () {
      if (this.seeInfo.isInterior === 1) {
        return this.$Message.error('内部往来科目不能禁用')
      }
      let params = {
        codes: [this.seeInfo.code],
        subjectId: this.seeInfo.subjectId,
        isEnable: 0
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认禁用', message: '禁用操作将会把本级与下级科目一起禁用', yes: 'doProhibitActive' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doProhibitActive()
        }
      })
    },
    /**
     * 禁用操作
     */
    doProhibitActive () {
      let req = {
        codes: [this.seeInfo.code],
        versionList: [this.seeInfo.version],
        subjectId: this.seeInfo.subjectId
      }
      this.$request.post('/financeback/accountSubject/updateBatchDisable', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.successDetailsList.length) {
            this.doGetInfo()
            return this.$Message.success('禁用成功')
          } else {
            this.$Message.error('禁用失败:' + res.data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 反禁用按钮
     */
    doNoProhibit () {
      if (this.seeInfo.isInterior === 1) {
        return this.$Message.error('内部往来科目不能反禁用')
      }
      let params = {
        codes: [this.seeInfo.code],
        subjectId: this.seeInfo.subjectId,
        isEnable: 1
      }
      this.$request.post('/financeback/accountSubject/checkUpdateBatch', params).then(({ status, data }) => {
        if (data.data) {
          let tipObj = { title: '确认反禁用', message: '反禁用将会将上级科目一起反禁用', yes: 'doNoProhibitActive' }
          this.doShowActiveModal(tipObj)
        } else {
          this.doNoProhibitActive()
        }
      })
    },
    /**
     * 反禁用操作
     */
    doNoProhibitActive () {
      let req = {
        codes: [this.seeInfo.code],
        versionList: [this.seeInfo.version],
        subjectId: this.seeInfo.subjectId
      }
      this.$request.post('/financeback/accountSubject/updateBatchEnable', req).then(res => {
        if (res.data.code === 200) {
          if (res.data.data.successDetailsList.length) {
            this.doGetInfo()
            return this.$Message.success('反禁用成功')
          } else {
            this.$Message.error('反禁用失败:' + res.data.data.failList[0].referenceDescription)
          }
        }
      })
    },
    /**
     * 更新请求
     */
    doUpdate (callback = () => this.$Message.success('保存成功!')) {
      if (!this.$refs.findBasics.doCheckForm()) { return }
      let auxli = {}
      if (this.ismounted) {
        auxli = this.$refs.findAuxiliary
      } else {
        // 辅助核算数据
        let enableList = this.seeInfo.subjectAuxiliaryList.filter(item => item.ifUsed)
        // 辅助核算编码拼接
        let auxiliaryCodes = enableList.map(item => item.code).join(',')
        // 辅助核算名称拼接
        let auxiliaryNames = enableList.map(item => item.name).join(',')
        // 辅助核算值来源表拼接
        let auxiliarySourceTables = enableList.map(item => item.sourceTable).join(',')
        // 辅助核算值来源拼接（暂时不传）
        let auxiliarySources = enableList.map(item => item.sourceName).join(',')
        // 辅助核算值来源拼接（暂时不传）
        let auxiliaryDependents = enableList.map(item => item.dependentsName).join(',')
        auxli = {
          auxiliaryCodes, // 辅助核算编码拼接
          auxiliaryNames, // 辅助核算名称拼接
          auxiliarySources, // 辅助核算值来源拼接（暂时不传）
          auxiliarySourceTables, // 辅助核算值来源表拼接
          auxiliaryDependents // 辅助核算值依赖拼接（暂时不传
        }
      }
      let oldData = JSON.parse(this.seeInfoBck)
      let fullName = oldData.fullName.split(oldData.name).filter(item => item).join(oldData.name)
      // 更新参数
      let params = JSON.parse(JSON.stringify(this.$refs.findBasics.basic))
      let req = {
        isEnterpriseAdmin: 1,
        version: params.version,
        id: this.$route.query.id,
        originalUpCode: oldData.upCode, // 原上级编码 必传
        upCode: params.upCode, // 上级编码
        upId: params.upId,
        upVersion: params.upVersion,
        code: params.upCode + params.subCode, // 科目编码
        name: params.name, // 科目名称
        fullName: fullName + params.name,
        level: params.level, // 科目次级
        subjectId: params.subjectId,
        // balanceDirection: this.$refs.findBasics.balanceDirection, // 余额方向
        balanceDirection: params.balanceDirection, // 余额方向
        accountElementItem: params.accountElementItem, // 会计要素id
        accountElementItemName: params.accountElementItemName, // 会计要素表id
        isProfitAndLoss: params.isProfitAndLoss, // 是否损益科目
        isOffBalance: params.isOffBalance,
        subjectCategory: params.subjectCategory,
        subjectCategoryName: params.subjectCategoryName,
        accountCategory: params.accountCategory,
        isInit: params.isInit,
        isInterior: params.isInterior,
        cashFlowId: params.cashFlowId,
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
      this.$request.post('/financeback/accountSubject/update', req).then(res => {
        if (res.data.code === 200) {
          this.$refs.findBasics.isChanged = false
          if (this.ismounted) { this.$refs.findAuxiliary.isChanged = false }
          setTimeout(() => { callback(res) }, 300)
        }
      })
    },
    // 点击上一条下一条
    doChangePage (id) {
      this.$request.post('/financeback/accountSubject/findInfoById', { id: id }).then(res => {
        if (res.data.code === 200) {
          this.$router.push({ path: 'accountant_update', query: { id: res.data.data.id, isEnable: res.data.data.isEnable } })
          this.doGetInfo()
        } else {
          this.seeList = {}
          this.seeInfo = {}
        }
      })
    },
    toFindFirst () {
      this.isChangeInfo ? this.doShowModal(() => this.findFirst()) : this.findFirst()
    },
    // 第一条
    findFirst () {
      let _num = this.doFindPage(1, this.$route.query.id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.doChangePage(_num)
      }
    },
    toFindPrevious () {
      this.isChangeInfo ? this.doShowModal(() => this.findPrevious()) : this.findPrevious()
    },
    // 上一条
    findPrevious () {
      let _num = this.doFindPage(2, this.$route.query.id)
      if (_num === '当前为首条') {
        return false
      } else {
        this.doChangePage(_num)
      }
    },
    toFindEnd () {
      this.isChangeInfo ? this.doShowModal(() => this.findEnd()) : this.findEnd()
    },
    // 最后一条
    findEnd () {
      let _num = this.doFindPage(4, this.$route.query.id)
      if (_num === '当前为末条') {
        return false
      } else {
        this.doChangePage(_num)
      }
    },
    toFindNext () {
      this.isChangeInfo ? this.doShowModal(() => this.findNext()) : this.findNext()
    },
    // 下一条
    findNext (type) {
      let _num = this.doFindPage(3, this.$route.query.id, type)
      if (_num === '当前为末条') {
        return false
      } else if (_num === '跳转') {
        this.$router.push({ name: 'accountant_update' })
      } else {
        this.doChangePage(_num)
      }
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
          that.doUpdate(callback())
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
          that.doUpdate(that.doContinueActions)
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
    // 点击保存并新增
    doProAdd () {
      switch (this.titleSwitch) {
        case 0:
          this.$refs.findBasics.doPreser(2)
          break
        case 1:
          this.$refs.findAuxiliary.doPreser(2)
          break
      }
    },
    // 切换标题
    doSelectTitle (msg) {
      this.titleSwitch = msg
      this.ismounted = true
    },
    /**
     * 复制按钮
     */
    doCopy () {
      if (this.isChangeInfo) {
        this.doShowModal(() => {
          this.$router.push({
            name: 'create_accountant',
            query: { cid: this.seeInfo.id,
              subjectId: this.$route.query.subjectId,
              accountTypeId: this.$route.query.accountTypeId,
              accStandardId: this.$route.query.accStandardId
            }
          })
        })
      } else {
        this.doLocationDetail('create_accountant', {
          cid: this.seeInfo.id,
          subjectId: this.$route.query.subjectId,
          accountTypeId: this.$route.query.accountTypeId,
          accStandardId: this.$route.query.accStandardId
        })
      }
    },
    // 点击列表
    doGOList () {
      this.doLocationDetail('accountant_index')
    }
  }
}
</script>

<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
.update-create {
  position: relative;
  height: 100%;
  .ivu-modal-mask {
    position: absolute;
    left: 0 !important;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .create-invalid {
    width: 80px;
    height: 80px;
    position: absolute;
    text-align: center;
    line-height: 80px;
    top: 100px;
    left: 100px;
    z-index: 100;
    svg.iconfont.invalid-font {
      font-size: 70px !important ;
    }
  }
  .create-header {
    width: 100%;
    .create-header-button {
      float: right;
      margin-right: 14px;
      margin-top: 9px;
      .btn-width {
        width: 56px !important;
        padding-left: 0;
        padding-right: 0;
      }
      .header-button {
        margin-left: 4px;
        margin-right: 4px;
      }
      .header-bottom-preser {
        width: 64px;
        height: 32px;
        border-radius: 0;
        color: #ffffff;
        font-size: 12px;
        margin-top: 9px;
        margin-right: 5px;
      }
      .header-bottom-add {
        width: 96px;
        height: 32px;
        margin-top: 9px;
        border-radius: 0;
        margin-right: 5px;
        margin-left: 5px;
      }
      .header-bottom-cancle {
        width: 64px;
        height: 32px;
        margin-top: 9px;
        border-radius: 0;
        margin-right: 5px;
        margin-left: 5px;
      }
      .header-bottom-list {
        width: 64px;
        height: 32px;
        margin-top: 9px;
        border-radius: 0;
        margin-left: 5px;
      }
    }
  }
  .create-title {
    width: 100%;
    height: 45px;
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
  }
  .reminder-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal{
      width: 480px !important;
      height: 200px;
      top: 0;
      .ivu-modal-header{
        border: none;
        padding: 30px 0 0 30px;
        svg.iconfont.guide{
          font-size: 16px !important;
          color: @warning;
          position: absolute;
          top: 34px;
        }
        span{
          font-size: 16px;
          color: #333333;
          margin-left: 22px;
        }
      }
      .ivu-modal-body{
        font-size: 14px;
        color: #333333;
        opacity: 0.85;
        padding: 20px 0 40px 50px
      }
      .ivu-modal-footer{
        border: none;
        padding:0 30px 30px 18px;
        Button{
          border-radius: 4px;
        }
      }
    }
  }
  .title-modals {
    position: absolute;
    .ivu-modal{
        position: absolute;
        width: 480px !important;
        height: 200px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        .ivu-modal-header{
          border: none;
          padding: 30px 0 0 30px;
          svg.iconfont.guide{
            font-size: 20px !important;
            color: @warning;
            position: absolute;
            top: 30px;
            left: 25px;
          }
          span{
            font-size: 16px;
            color: #333333;
            margin-left: 20px;
          }
        }
        .ivu-modal-body{
          font-size: 14px;
          color: #333333;
          opacity: 0.85;
          padding: 20px 0 40px 50px
        }
        .ivu-modal-footer{
          border: none;
          padding:0 30px 30px 18px;
          Button{
            border-radius: 0;
          }
        }
      }
  }
}
</style>
