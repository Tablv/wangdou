<template>
  <div class="company-user-modal">
    <Modal
      v-model="againModal"
      :transfer="false"
      :closable="false"
      :mask-closable="false"
      draggable
      scrollable
      width="1000"
      @mousemove.native="onMouseUpModal"
      @mouseup.native="onMouseUpModal"
    >
      <header class="modal-header" slot="header">
        <div class="modal-header-name">复制到其他公司</div>
        <div class="modal-header-actions">
          <span class="table-span1" @click="doCancel"><common-icon type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article class="centent">
        <Row>
          <Col span="13" class-name="page-left">
            <Row :gutter="16">
              <Col span="10"><Input class="user-mobile" search placeholder="公司编码/名称" @on-search="enterCodeName" @on-change="changeOrMatch"/></Col>
            </Row>
            <Table :columns="tableColumns" :loading="modalLoading" :data="tableData" max-height="360" :class="tableData.length ? null : 'tableHeight initTable'" @on-selection-change="doSelectModalData"></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-row">
              <span>已选公司(<span class="table-span modal-span">{{selectCompany.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectCompany" :key="index" class="selected-div">
                {{item.name}}
                <Icon type="md-close" @click="doIconDeleteUser(item)" class="modal-icon" />
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page" v-if="tableData.length > 0">
          <div  class="div-page-lf">共 {{totalModal}} 条数据</div>
          <div class="div-page-btn">
            <Page
              id="modalPageId"
              class-name="pages"
              :total="totalModal"
              :current="currentModal"
              :page-size="sizeModal"
              :page-size-opts="[20, 50, 100, 200, 500, 1000]"
              show-elevator
              show-sizer
              @on-page-size-change="changeModalPageSize"
              @on-change="handleModalChangePage"
            />
            <Button size="small" @click="doGoPage('modalPageId')">Go</Button>
          </div>
        </div>
      </article>
      <footer slot="footer">
        <div class="modal-footer-actions">
          <Button type="primary" @click="doConfirm">确定</Button>
          <Button type="default" @click="doCancel">取消</Button>
        </div>
      </footer>
    </Modal>
  </div>
</template>
<script>
import CommonIcon from '_c/common-icon'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'
export default {
  name: 'copyModal',
  props: {
    againModal: {
      defalult: false,
      type: Boolean
    },
    companyData: {
      type: Array
    }
  },
  components: {
    CommonIcon,
    nodata
  },
  data () {
    return {
      modalLoading: false,
      show: true,
      tableColumns: [
        {
          type: 'selection',
          width: 44,
          align: 'center'
        },
        {
          title: '公司编码',
          key: 'code',
          align: 'center'
        },
        {
          title: '公司名称',
          key: 'name',
          align: 'left'
        }
      ],
      tableData: [],
      selectCompany: [], // 选中的公司
      rootEnterpriseId: '', // 企业id
      totalModal: 0, // 分页总数据个数
      sizeModal: 20, // 分页每页显示的数据个数
      currentModal: 1 // 分页当前页
    }
  },
  mixins: [saasMixin],
  watch: {
    againModal (val) {
      if (val === true) {
        this.doModalInit()
      }
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    doConfirm () {
      this.$emit('modalClose', false)
      this.$emit('selectCompany', this.selectCompany)
      this.doCloseModalData()
      this.tableData = []
    },
    doCancel () {
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.tableData = []
    },
    // 即时查询----输入内容，按下回车键触发
    enterCodeName (value) {
      if (value === '') {
        this.tableData = []
        // 走查询接口
        this.doModalInit()
      } else {
        let reg = new RegExp(value)
        let arr = []
        this.companyData.forEach(item => {
          if (reg.test(item.code) || reg.test(item.name)) {
            arr.push(item)
          }
        })
        this.tableData = arr
      }
    },
    // 搜索框为空触发
    changeOrMatch (e) {
      if (e.target.value === '') {
        this.doModalInit()
      }
    },
    // 获取公司
    doModalInit () {
      this.modalLoading = true
      if (this.companyData) {
        this.modalLoading = false
        this.tableData = this.companyData
        this.totalModal = this.tableData.length
      }
    },
    // 对话框----列表多选
    doSelectModalData (data) {
      this.selectCompany = []
      data.forEach(d => {
        this.selectCompany.push(d)
      })
    },
    // 点击删除图标删除用户
    doIconDeleteUser (item) {
      this.tableData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      // 删除用户
      let index = this.selectCompany.findIndex(s => s === item)
      if (index !== -1) {
        this.selectCompany.splice(index, 1)
      }
      // 删除用户后，对应的列表中的数据取消勾选
      this.tableData.forEach(m => {
        this.selectCompany.forEach(s => {
          if (m.name === s.name) {
            this.$set(m, '_checked', true)
          }
        })
      })
    },
    // 点击清空删除用户
    doCloseModalData () {
      this.selectCompany = []
      this.tableData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      this.doModalInit()
    },
    // 分页
    doGoPage (pageId) {
      this.goElevatorPage(pageId)
    },
    // 改变当前页
    handleModalChangePage (pageNo) {
      this.currentModal = pageNo
      this.doModalInit()
    },
    // 改变每页数量
    changeModalPageSize (e) {
      this.sizeModal = e
      this.doModalInit()
    }
  }
}
</script>
<style lang="less">
@import '../../assets/css/base.less';
@import '../../assets/css/redefine.less';
@import '../../assets/css/index.less';
@import './copyModal.less';
</style>
