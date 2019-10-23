<template>
  <div class="batchHandleModal">
    <Alert class="batchAlert" type="success" banner v-if="batchHandleModal">
      <Icon type="md-checkmark-circle" class="md-checkmark"/>
      <span>{{checked}}</span>
      <span class="table-span detail" @click="show">{{showTable === false ? '查看详情' : '收起详情'}}</span>
      <Icon type="md-close" class="table-span md-close" @click="doClose"/>
    </Alert>
    <Modal
      class-name="batch-handle-modal"
      v-model="showTable"
      :transfer="false"
      :mask-closable="false"
      draggable
      scrollable
      @on-cancel="doClose"
      width=720
    >
      <header
        class="modal-header"
        slot="header"
      >
        <div class="modal-header-name page-header-name">查看详情</div>
      </header>
      <article class="modal-body">
        <Table
          :columns="batchhandleColumns"
          :data="batchhandleData"
          :disabled-hover="true"
          :no-data-text="null"
          max-height='362'
          :class="batchhandleData.length ? null : 'tableHeight'"
        ></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="batchhandleData.length===0"></nodata>
      </article>
      <footer slot="footer">
        <div>
          <Button type="default" @click="doClose">关闭</Button>
        </div>
      </footer>
    </Modal>
  </div>
</template>
<script>
import nodata from '_c/nodata'
export default {
  name: 'batchHandelModal',
  components: {
    nodata
  },
  props: {
    // 批量操作alert开关
    batchHandleModal: {
      defalult: false,
      type: Boolean
    },
    // 批量操作alert中的文字
    checked: {
      type: String
    },
    // 批量操作弹窗的表头数据
    batchhandleColumns: {
      type: Array
    },
    // 批量操作弹窗的表格数据
    batchhandleData: {
      type: Array
    }
  },
  data () {
    return {
      showTable: false
    }
  },
  methods: {
    // 控制对话框显隐
    show () {
      this.showTable = !this.showTable
    },
    // 关闭
    doClose () {
      this.showTable = false
      this.$emit('modalClose', false)
    }
  }
}
</script>
<style lang="less">
@import '../../assets/css/base.less';
@import './batchHandleModal.less';
</style>
