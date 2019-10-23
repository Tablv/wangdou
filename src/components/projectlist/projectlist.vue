<template>
  <div class="project-list">
    <Modal
      v-model="assignModal"
      :transfer="false"
      :closable="false"
      :mask-closable="false"
      draggable
      scrollable
      width="1000"
    >
      <header class="modal-header" slot="header">
        <div class="modal-header-name">{{titleName}}</div>
        <div class="modal-header-actions">
          <span class="table-span" @click="doCancel"><common-icon type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article>
        <Row>
          <Col span="13" class-name="page-left">
            <Row :gutter="16">
              <Col span="10">
                <Input class="user-mobile" v-model="companyCodeOrName" search placeholder="公司编码/名称" @on-search="enterCodeName"/>
              </Col>
            </Row>
            <Table :columns="tableColumns" :class="tableData.length ? null : 'tableHeight'" :data="tableData" @on-selection-change="doSelectModalData"></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-row">
              <span>已选公司(<span class="table-span">{{selectCompany.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectCompany" :key="index" class="selected-div">
                {{item.name}}
                <Icon type="md-close" @click="doIconDeleteUser(item)" class="table-span" />
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page">
          <div>共<strong>{{tableData.length}}</strong>条数据</div>
          <div class="div-page-btn">
            <Page
              id="modalPageId"
              class-name="pages"
              :total="totalModal"
              :current="currentModal"
              :page-size="sizeModal"
              :page-size-opts="[20, 30, 40]"
              show-elevator
              show-sizer
              @on-page-size-change="changeModalPageSize"
              @on-change="handleModalChangePage"
            />
            <Button  size="small" @click="goModalElevatorPage('modalPageId')">Go</Button>
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
import { session } from '@/libs/location.js'
import nodata from '_c/nodata'
export default {
  neme: 'project-list',
  components: {
    CommonIcon,
    nodata
  },
  props: {
    assignModal: {
      defalult: false,
      type: Boolean
    },
    titleName: {
      type: String
    }
  },
  data () {
    return {
      formList: [
        {
          value: 0,
          label: '全部'
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
      modelForm: 0,
      companyCodeOrName: '',
      show: true,
      tableColumns: [
        {
          type: 'selection',
          width: 44,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code',
          align: 'left',
          width: 150
        },
        {
          title: '名称',
          key: 'name',
          align: 'left'
        }
        // {
        //   title: '形态',
        //   key: 'companyForm',
        //   align: 'left'
        // }
      ],
      tableData: [],
      selectCompany: [], // 选中的公司
      rootEnterpriseId: '', // 企业id
      totalModal: null, // 分页总数据个数
      sizeModal: null, // 分页每页显示的数据个数
      currentModal: null // 分页当前页
    }
  },
  mixins: [saasMixin],
  created () {
    this.rootEnterpriseId = JSON.parse(session.getItem('userInfo')).rootEnterpriseId
    this.doModalInit()
  },
  methods: {
    // 点击确定
    doConfirm () {
      // this.$emit('selectCompany', this.selectCompany)
      // this.$emit('modalClose', false)
      // this.doCloseModalData()
    },
    // 点击取消
    doCancel () {
      this.$emit('modalClose', false)
      this.doCloseModalData()
    },
    // 即时查询----下拉框选择值改变
    changeModelForm () {
      // 走查询接口
      this.doModalInit()
    },
    // 即时查询----输入内容，按下回车键触发
    enterCodeName (value) {
      // 走查询接口
      this.doModalInit()
    },
    // 获取公司
    doModalInit () {
      let reqdata = {
        page: {
          size: this.sizeModal,
          current: this.currentModal
        }
      }
      reqdata.rootEnterpriseId = this.rootEnterpriseId
      reqdata.companyForm = this.modelForm === 0 ? '' : this.modelForm
      reqdata.codeOrName = this.companyCodeOrName
      this.$request.post('company/findCompanyPage', reqdata).then(response => {
        let { status, data } = response.data
        if (status === 'success') {
          // 分页
          this.totalModal = data.total
          this.sizeModal = data.size
          this.currentModal = data.current
          // 列表
          data.records.forEach(r => {
            switch (r.companyForm) {
              case 1:
                r.companyForm = '总部'
                break
              case 2:
                r.companyForm = '公司'
                break
              case 3:
                r.companyForm = '门店'
                break
              case 4:
                r.companyForm = '中央厨房'
                break
              case 5:
                r.companyForm = '仓储中心'
                break
              case 6:
                r.companyForm = '配送中心'
                break
              case 7:
                r.companyForm = '采购中心'
                break
              case 8:
                r.companyForm = '其他'
                break
            }
          })
          this.tableData = data.records
        }
      })
    },
    // 点击重置
    doReset () {
      this.modelForm = 0
      this.companyCodeOrName = ''
      // 走查询接口
      this.doModalInit()
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
    goModalElevatorPage (pageId) {
      let evtObj
      let thisPage = document.getElementById(pageId)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      if (elevatorDiv && elevatorDiv.length > 0) {
        let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
        if (window.KeyEvent) { // firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents')
          evtObj.initKeyEvent('keyup', true, true, window, true, false, false, false, 13, 0)
        } else { // chrome 浏览器下模拟事件
          evtObj = document.createEvent('UIEvents')
          evtObj.initUIEvent('keyup', true, true, window, 1)
          delete evtObj.keyCode
          if (typeof evtObj.keyCode === 'undefined') { // 为了模拟keycode
            Object.defineProperty(evtObj, 'keyCode', { value: 13 })
          } else {
            evtObj.key = String.fromCharCode(13)
          }
        }
        pageInput.dispatchEvent(evtObj)
      }
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
@import './projectlist.less';
</style>
