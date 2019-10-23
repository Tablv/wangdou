<template>
  <div class="multi-select-modal">
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
        <div class="modal-header-name"><b>{{titleName}}</b></div>
        <div class="modal-header-actions">
          <span class="table-span" @click="doCancel"><common-icon type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article class="centent">
        <Row>
          <Col span="13" class-name="page-left">
            <Row :gutter="16">
              <Col span="5">
                <Select v-model="companyFormId" class="clearList" @on-change="queryData">
                  <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </Col>
              <Col span="10">
                <Input class="user-mobile" v-model="companyCodeOrName" search placeholder="公司编码或名称" @on-change="doChangeCompany"  @on-search="queryData"/>
              </Col>
              <Col span="2">
                <Button @click="doReset">重置</Button>
              </Col>
            </Row>
            <Table :columns="tableColumns" max-height="360" :class="tableData.length ? null : 'tableHeight'"
                   :data="tableData" @on-selection-change="doSelectModalData" @on-select-cancel="doGetCancelRow" @on-select-all-cancel="doAllCancel"></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-row">
              <span>已选公司(<span class="font-center">{{selectCompany.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectCompany" :key="index" class="selected-div">
                {{item.name}}
                <Icon type="md-close" @click="doIconDeleteUser(item)" class="table-span"/>
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page" v-if="tableData.length">
          <div class="div-page-lf">共<span class="font-center">{{totalModal}}</span>条数据</div>
          <div class="div-page-btn no-error-modal">
            <Page
              id="pageIdMulti"
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
            <Button type="primary" size="small" @click="goElevatorPage('pageIdMulti')">GO</Button>
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
import nodata from '_c/nodata'

export default {
  neme: 'multiSelectModal',
  components: {
    CommonIcon,
    nodata
  },
  props: {
    assignModal: {
      default: false,
      type: Boolean
    },
    titleName: {
      type: String
    },
    comSelectedList: {
      type: Array
    },
    allCompany: {
      type: Array
    }
  },
  mixins: [saasMixin],
  data () {
    return {
      totalModal: 0,
      sizeModal: 20,
      currentModal: 1,
      companyFormId: 0,
      companyCodeOrName: '',
      tableData: [],
      selectCompany: [],
      allCompanyCopy: [],
      formList: [
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
      tableColumns: [
        {
          type: 'selection',
          width: 44,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '形态',
          key: 'companyFormName',
          tooltip: true
        }
      ]
    }
  },
  watch: {
    assignModal (val) {
      if (val) {
        this.selectCompany = []
        this.allCompanyCopy = JSON.parse(JSON.stringify(this.allCompany))
        this.allCompanyCopy.forEach(item => {
          if (this.comSelectedList.indexOf(item.code) > -1) {
            this.selectCompany.push(item)
          }
        })
        this.doModalInit()
      }
    }
  },
  methods: {
    doChangeCompany () {
      if (this.companyCodeOrName === '') {
        this.queryData()
      }
    },
    doConfirm () {
      this.$emit('selectCompany', this.selectCompany, this.allCompanyCopy)
      this.doCancel()
    },
    doCancel () {
      this.sizeModal = 20
      this.currentModal = 1
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.$emit('modalClose', 'company')
      this.doCloseModalData()
    },
    doModalInit () {
      this.$request.post('/financeback/company/findCompanyPage', { codeOrName: '', page: { size: 1000000, current: 1 } }).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          this.allCompanyCopy = data.records
        }
      })
      let _reqdata = {
        companyFormId: this.companyFormId === 0 ? '' : this.companyFormId,
        codeOrName: this.companyCodeOrName,
        page: {
          size: this.sizeModal,
          current: this.currentModal
        }
      }
      return this.$request.post('/financeback/company/findCompanyPage', _reqdata).then(res => {
        let { status, data } = res.data
        if (status === 'success') {
          this.totalModal = data.total
          this.tableData = data.records
        } else {
          this.tableData = []
          this.totalModal = 0
        }
        return this.tableData
      }).then(data => {
        this.selectCompany.forEach((son) => {
          data.forEach((item) => {
            if (son.code === item.code) {
              this.$set(item, '_checked', true)
            }
          })
        })
      })
    },
    queryData () {
      this.currentModal = 1
      this.doModalInit()
    },
    doReset () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.currentModal = 1
      this.doModalInit()
    },
    doGetCancelRow (selection, row) {
      this.selectCompany.forEach((item, index) => {
        if (item.code === row.code) {
          this.selectCompany.splice(index, 1)
        }
      })
    },
    doSelectModalData  (data) {
      if (data.length > 0) {
        data.forEach((item) => {
          let ispage = this.selectCompany.some((page) => {
            return page.code === item.code
          })
          if (!ispage) {
            this.selectCompany.push(item)
          }
        })
      }
    },
    doAllCancel (selection) {
      this.tableData.forEach((item) => {
        this.selectCompany.forEach((item2, index) => {
          if (item.code === item2.code) {
            this.selectCompany.splice(index, 1)
          }
        })
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
          if (m.code === s.code) {
            this.$set(m, '_checked', true)
          }
        })
      })
    },
    // 点击清空删除用户
    doCloseModalData () {
      this.selectCompany.forEach(m => {
        this.$set(m, '_checked', false)
      })
      this.tableData.forEach(s => {
        this.$set(s, '_checked', false)
      })
      this.tableData.forEach(s => {
        delete s._checked
      })
      this.selectCompany = []
    },
    // 改变当前页
    handleModalChangePage (pageNo) {
      this.currentModal = pageNo
      this.doModalInit()
    },
    // 改变每页数量
    changeModalPageSize (e) {
      this.sizeModal = e
      this.handleModalChangePage(1)
    }
  }
}
</script>
<style lang="less" scoped>
  @import './multi-select-modal.less';
</style>
<style lang="less">
.multi-select-modal {
  .ivu-input-search-icon {
    background-color: #fafafa;
    border: 1px solid #e5e5e5;
  }
}
</style>
