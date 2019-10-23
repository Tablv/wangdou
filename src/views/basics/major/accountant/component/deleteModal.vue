<template>
<!-- 删除提示弹窗 -->
<div class="deleteModal">
  <Modal
  :transfer="false"
  @on-cancel="doCancel"
  v-model="isDelete"
  class-name="reminder-modal">
    <p slot="header" style="text-align:left;">
      <common-icon type="_guide" :size="14" class="guide"></common-icon>
      <span>{{modalTilte.title}}</span>
    </p>
    <p>
      <span>{{modalTilte.content}}</span>
    </p>
    <div slot="footer">
      <!-- @click="doConfirm" -->
      <Button type="primary" @click.native="doClickDelete">确定</Button>
      <!--  @click="doCancel" -->
      <Button type="default" @click="doCancel">取消</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import CommonIcon from '_c/common-icon'
export default {
  props: ['modalTilte', 'showDelete', 'deleteInfo'],
  data () {
    return {
      $url: 'http://192.168.1.160:8183',
      title: null,
      content: null,
      url: 'http://192.168.1.249:8183'
    }
  },
  computed: {
    isDelete: { // 是否显示删除弹窗
      get () {
        return this.showDelete
      },
      set () {

      }
    }
  },
  components: {
    CommonIcon
  },
  methods: {
    // 点击确认按钮
    doClickDelete () {
      switch (this.deleteInfo.isbatch) {
        case 1: // 批量删除
          this.doBatchDelete()
          break
        case 2: // 单条删除
          this.doSingleDelete()
          break
        case 3: // 单条禁用
          this.doSinglePro()
          break
        case 4: // 批量禁用
          this.doBatchPro()
          break
        case 5: // 单条反禁用
          this.doSingleNoPro()
          break
        case 6: // 批量反禁用
          this.doBatchNoPro()
          break
        case 9: // 单纯的删除
          this.doDelete()
          break
      }
    },
    // 删除辅助核算列表
    doDelete () {
      this.$emit('doClose', 'delete')
    },
    // 1 批量 0 单个
    // 单条禁用
    doSinglePro () {
      let req = {
        codes: this.deleteInfo.codes,
        versionList: this.deleteInfo.versionList,
        subjectId: this.deleteInfo.subjectId
      }
      // http://192.168.1.250:8183
      this.$request.post('/financeback/accountSubject/updateBatchDisable', req).then(res => {
        if (res.data.code === 200) {
          this.$emit('doClose', res.data.data, 0, '禁用')
        } else {
          this.$emit('doClose', false)
        }
      })
    },
    // 批量禁用
    doBatchPro () {
      let isInteriorArr = this.deleteInfo.data.filter(item => item.isInterior === 1).map(item => {
        return {
          businessCode: null,
          businessId: item.id,
          referenceDescription: '内部往来科目不可以禁用',
          info: item
        }
      })
      let deleteInfo = this.deleteInfo.data.filter(item => item.isInterior !== 1)
      if (deleteInfo.length === 0) {
        let data = {
          failList: isInteriorArr,
          successList: [],
          successDetailsList: []
        }
        return this.$emit('doClose', data, 1, '禁用')
      } else {
        let req = {
          codes: deleteInfo.map(item => item.code),
          versionList: this.deleteInfo.versionList,
          subjectId: this.deleteInfo.subjectId
        }
        this.$request.post('/financeback/accountSubject/updateBatchDisable', req).then(res => {
          if (res.data.code === 200) {
            res.data.data.failList = [...res.data.data.failList, ...isInteriorArr]
            this.$emit('doClose', res.data.data, 1, '禁用')
          } else {
            this.$emit('doClose', false)
          }
        })
      }
    },
    // 单条反禁用
    doSingleNoPro () {
      let req = {
        codes: this.deleteInfo.codes,
        versionList: this.deleteInfo.versionList,
        subjectId: this.deleteInfo.subjectId
      }
      this.$request.post('/financeback/accountSubject/updateBatchEnable', req).then(res => {
        if (res.data.code === 200) {
          this.$emit('doClose', res.data.data, 0, '反禁用')
        } else {
          this.$emit('doClose', false)
        }
      })
    },
    // 批量反禁用
    doBatchNoPro () {
      let isInteriorArr = this.deleteInfo.data.filter(item => item.isInterior === 1).map(item => {
        return {
          businessCode: null,
          businessId: item.id,
          referenceDescription: '内部往来科目不可以反禁用',
          info: item
        }
      })
      let deleteInfo = this.deleteInfo.data.filter(item => item.isInterior !== 1)
      if (deleteInfo.length === 0) {
        let data = {
          failList: isInteriorArr,
          successList: [],
          successDetailsList: []
        }
        return this.$emit('doClose', data, 1, '反禁用')
      } else {
        let req = {
          codes: deleteInfo.map(item => item.code),
          versionList: this.deleteInfo.versionList,
          subjectId: this.deleteInfo.subjectId
        }
        this.$request.post('/financeback/accountSubject/updateBatchEnable', req).then(res => {
          if (res.data.code === 200) {
            res.data.data.failList = [...res.data.data.failList, ...isInteriorArr]
            this.$emit('doClose', res.data.data, 1, '反禁用')
          } else {
            this.$emit('doClose', false)
          }
        })
      }
    },
    // 单条删除数据
    doSingleDelete () {
      if (this.deleteInfo.ids[0].isFinal === 0) {
        this.$emit('doClose', false)
        return this.$Message.error('删除失败，请先删除下级科目')
      }
      if (this.deleteInfo.ids[0].isCited === 1) {
        this.$emit('doClose', false)
        return this.$Message.error('当前数据已使用，无法删除')
      }
      let req = {
        ids: this.deleteInfo.ids.map(item => item.id),
        versionList: this.deleteInfo.ids.map(item => item.version)
      }
      this.$request.post('/financeback/accountSubject/updateBatchDelete', req).then(res => {
        if (res.data.code === 200) {
          this.$emit('doClose', res.data.data, 0, '删除')
        } else {
          this.$emit('doClose', false)
        }
      })
    },
    // 批量删除接口
    doBatchDelete () {
      let isInitArr = this.deleteInfo.ids.filter(item => item.isInit === 1).map(item => {
        return {
          businessCode: null,
          businessId: item.id,
          referenceDescription: '系统预置科目不可删除',
          info: item
        }
      })
      let deleteInfo = this.deleteInfo.ids.filter(item => item.isInit !== 1)
      let isInteriorArr = deleteInfo.filter(item => item.isInterior === 1).map(item => {
        return {
          businessCode: null,
          businessId: item.id,
          referenceDescription: '内部往来科目不可删除',
          info: item
        }
      })
      deleteInfo = deleteInfo.filter(item => item.isInterior !== 1)
      if (deleteInfo.length === 0) {
        let data = {
          failList: [...isInitArr, ...isInteriorArr],
          successList: [],
          successDetailsList: []
        }
        return this.$emit('doClose', data, 1, '删除')
      } else {
        let req = {
          ids: deleteInfo.map(item => item.id),
          versionList: deleteInfo.map(item => item.version)
        }
        this.$request.post('/financeback/accountSubject/updateBatchDelete', req).then(res => {
          if (res.data.code === 200) {
            res.data.data.failList = [...res.data.data.failList, ...isInitArr, ...isInteriorArr]
            this.$emit('doClose', res.data.data, 1, '删除')
          } else {
            this.$emit('doClose', false)
          }
        })
      }
    },
    // 点击取消
    doCancel () {
      this.$emit('doClose', 'close')
    }
  }

}
</script>
<style lang="less">
@import '../../../../../assets/css/base.less';
@import '../../../../../assets/css/redefine.less';
.deleteModal{
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
        padding: 20px 50px 40px 50px
      }
      .ivu-modal-footer{
        border: none;
        padding:0 30px 30px 18px;
        // Button{
        //   border-radius: 4px;
        // }
      }
    }
  }
}

.ivu-input-search{
  padding: 0 8px !important;
  color: #999999 !important;
  background: #FAFAFA !important;
  border-color: #e5e5e5 !important;
}
.ivu-input-search:before{
  background: none
}
</style>
