<template>
  <div class="company-user-modal">
    <Modal
      v-model="assignModal"
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
        <div class="modal-header-name">{{titleName}}</div>
        <div>
          <span class="table-span1" @click="doCancel">
            <common-icon type="_modalclose"></common-icon>
          </span>
        </div>
      </header>
      <article class="centent">
        <div class="query-condition">
          <Select v-model="companyFormId" class="select-width query-select" @on-change="doChange">
            <Option v-for="item in formList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input class="query-input" v-model="companyCodeOrName" search placeholder="公司编码或名称" @on-search="doSearch"/>
          <Button class="span-space query-button" @click="doReset">重置</Button>
        </div>
        <Row class="centent-row">
          <Col span="13" class-name="page-left">
            <div class="letf-title">待选公司</div>
            <Table :columns="tableColumns" max-height="360" :loading="modalLoading" :class="tableData.length ? null : 'tableHeight initTable'"
                   :data="tableData" @on-selection-change="doSelectModalData"></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" class="page-right-rows">
              <span class="letf-title">已选公司(<span class="table-span modal-span">{{selectCompany.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected col-div">
              <div v-for="(item, index) in selectCompany" :key="index" class="selected-div">
                <Poptip trigger="hover" width='300' word-wrap placement="top" :content="item.name" transfer>
                  {{item.name}}
                  <Icon type="md-close" @click="doIconDeleteUser(item)" class="modal-icon"/>
                </Poptip>
              </div>
            </section>
          </Col>
        </Row>
        <div class="div-page">
          <div class="div-page-lf">共 {{totalModal}} 条数据</div>
          <div class="div-page-btn">
            <Page
              id="pageId"
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
            <Button size="small" @click="doGoPage('pageId')">GO</Button>
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
import { mapMutations } from 'vuex'
import nodata from '_c/nodata'

export default {
  neme: 'companyUserModal',
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
    companyId: {
      type: Array
    }
  },
  mixins: [saasMixin],
  data () {
    return {
      modalLoading: false,
      totalModal: 0,
      sizeModal: 20,
      currentModal: 1,
      companyFormId: 0,
      companyCodeOrName: '',
      show: true,
      tableData: [],
      selectCompany: [],
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
          key: 'code'
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '形态',
          key: 'companyFormName'
        }
      ],
      sessionSelectCompany: []
    }
  },
  created () {
  },
  watch: {
    assignModal (val) {
      if (val) {
        this.doModalInit().then(data => {
          this.companyId.forEach(selItem => {
            data.forEach((item, index) => {
              if (selItem === item.id) {
                this.tableData.splice(index, 1)
              }
            })
          })
          console.log(this.tableData)
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'getListIds'
    ]),
    // 点击确定
    doConfirm () {
      this.$emit('selectCompany', this.selectCompany)
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.companyFormId = 0
      this.companyCodeOrName = ''
    },
    // 点击取消
    doCancel () {
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.companyFormId = 0
      this.companyCodeOrName = ''
    },
    // 获取公司
    doModalInit () {
      let reqdata = {
        page: {
          size: this.sizeModal,
          current: this.currentModal
        }
      }
      this.modalLoading = true
      reqdata.rootEnterpriseId = this.rootEnterpriseId
      reqdata.companyFormId = this.companyFormId === 0 ? '' : this.companyFormId
      reqdata.codeOrName = this.companyCodeOrName
      return this.$request.post('/financeback/company/findCompanyPage', reqdata).then(response => {
        let { status, data } = response.data
        this.modalLoading = false
        if (status === 'success') {
          this.totalModal = data.total
          this.sizeModal = data.size
          this.currentModal = data.current
          this.tableData = data.records
          this.sessionSelectCompany = JSON.parse(session.getItem('selectCompany'))
          return this.tableData
        }
      })
    },
    // 监听下拉列表改变
    doChange () {
      this.doModalInit().then(data => {
        this.companyId.forEach(selItem => {
          data.forEach((item, index) => {
            if (selItem === item.id) {
              this.tableData.splice(index, 1)
            }
          })
        })
        console.log(this.tableData)
      })
    },
    // 输入框搜索
    doSearch () {
      this.doModalInit().then(data => {
        this.companyId.forEach(selItem => {
          data.forEach((item, index) => {
            if (selItem === item.id) {
              this.tableData.splice(index, 1)
            }
          })
        })
        console.log(this.tableData)
      })
    },
    // 点击重置
    doReset () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.doModalInit().then(data => {
        this.companyId.forEach(selItem => {
          data.forEach((item, index) => {
            if (selItem === item.id) {
              this.tableData.splice(index, 1)
            }
          })
        })
        console.log(this.tableData)
      })
    },
    // 对话框----列表多选
    doSelectModalData (data) {
      this.selectCompany = []
      if (this.sessionSelectCompany) {
        this.sessionSelectCompany.forEach(a => {
          this.selectCompany.push(a)
        })
      }
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
      session.setItem('selectCompany', JSON.stringify(this.selectCompany))
    },
    // 改变当前页
    handleModalChangePage (pageNo) {
      session.setItem('selectCompany', JSON.stringify(this.selectCompany))
      this.currentModal = pageNo
      this.doModalInit().then(data => {
        data.forEach((item, index) => {
          this.companyId.forEach(selItem => {
            if (selItem === item.id) {
              this.tableData.splice(index, 1)
            }
          })
        })
      })
    },
    // 改变每页数量
    changeModalPageSize (e) {
      this.sizeModal = e
      this.handleModalChangePage(1)
    },
    // 分页
    doGoPage (pageId) {
      this.goElevatorPage(pageId)
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../assets/css/base.less';
  @import '../../assets/css/redefine.less';
  @import './companyUserModal.less';
</style>
