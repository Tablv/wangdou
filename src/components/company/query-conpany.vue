<template>
  <section>
    <Modal
      v-model = "companyShow"
      width="750px"
      :transfer="false"
      scrollable
      draggable
      class="company-modal"
      @on-visible-change="doInitInfo"
    >
      <p slot="header">
        <span>{{ titleName }}</span>
      </p>
      <section class="page-content">
        <div class="query-condition">
          <div class="query-condition-lf">
            <Row class="screen query-company">
              <Col span="6">
                <Select v-model="companyForm" placeholder="全部形态" @on-change="doSearchData" clearable>
                  <Option v-for="item in formList" :value="item.id" :key="item.id">{{ item.name }}</Option >
                </Select>
              </Col>
              <Col span="12">
                <Input v-model="codeOrName" placeholder="公司编码或名称" search enter-button clearable @on-search="doSearchData" @on-clear="doInit"></Input>
              </Col>
              <Col span="1">
                <Button @click="handleReset">重置</Button>
              </Col>
            </Row>
          </div>
          <div style="width:20%"></div>
        </div>
        <div class="page-content-table">
          <Table
          :columns="tableColumns"
          :data="tableData"
          :no-data-text="null"
          :class="tableData.length ? null : 'tableHeight'"
          ></Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
        </div>
      </section>
      <div slot="footer">
        <section class="page-footer">
          <div class="page-footer-lf">
            共 <strong>{{ maxItems }}</strong>条数据
          </div>
          <div class="page-footer-rt">
            <Page
              id="pageId"
              class-name="pages"
              :total="maxItems"
              :page-size-opts="[10, 20, 50, 100]"
              show-elevator
              show-sizer
              @on-change="doUpdateCurrentPage"
              @on-page-size-change="doUpdatePageSize"></Page>
            <Button size="small" @click="goElevatorPage">GO</Button>
          </div>
        </section>
      </div>
    </Modal>
  </section>
</template>

<script>
import { saasMixin } from '@/libs/mixins'
import { checkCompanyForm } from '@/libs/filters'
import { session } from '@/libs/location.js'
import nodata from '_c/nodata'
export default {
  components: {
    nodata
  },
  data () {
    return {
      companyForm: '',
      codeOrName: '',
      maxItems: 0,
      tableData: [],
      tableColumns: [
        {
          title: '编码',
          key: 'code',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true,
          minWidth: 100
        },
        {
          title: '形态',
          key: 'companyForm',
          tooltip: true,
          render: (h, params) => {
            let companyForm = ''
            if (params.row.companyFormId) {
              companyForm = checkCompanyForm(params.row.companyFormId)
            }
            return h('div', {}, companyForm)
          }
        },
        {
          title: '操作',
          key: 'handle',
          tooltip: true,
          minWidth: 50,
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" on-click={this.$emit.bind(this, 'getCowName', row)}>选择</span>
              </div>
            )
          }
        }
      ],
      page: {
        size: 10,
        current: 1
      },
      formList: [
        { id: 1, name: '总部' },
        { id: 2, name: '公司' },
        { id: 3, name: '门店' },
        { id: 4, name: '中央厨房' },
        { id: 5, name: '仓储中心' },
        { id: 6, name: '配送中心' },
        { id: 7, name: '采购中心' },
        { id: 8, name: '其他' }
      ]
    }
  },
  props: {
    showFlag: {
      type: Boolean
    },
    titleName: {
      type: String
    }
  },
  mixins: [saasMixin],
  computed: {
    companyShow: {
      get () {
        return this.showFlag
      },
      set (data) {
        this.$emit('getShowFlag', false)
      }
    }
  },
  methods: {
    doInit () {
      let _reqData = {
        rootEnterpriseId: JSON.parse(session.getItem('userInfo')).rootEnterpriseId,
        companyFormId: this.companyForm,
        codeOrName: this.codeOrName,
        page: this.page
      }
      this.$request.post('/financeback/company/findCompanyPage', _reqData).then(res => {
        const { status, data } = res.data
        if (status === 'success') {
          const { records, total } = data
          this.tableData = records
          this.maxItems = total
        } else {
          this.tableData = []
          this.maxItems = 0
        }
      })
    },
    doSearchData () {
      this.page.current = 1
      this.doInit()
    },
    handleReset () {
      this.companyForm = ''
      this.codeOrName = ''
      this.page.current = 1
      this.doSearchData()
    },
    doUpdateCurrentPage (val) {
      this.page.current = val
      this.doInit()
    },
    doUpdatePageSize (val) {
      this.page.size = val
      this.doUpdateCurrentPage(1)
    },
    doInitInfo (val) {
      this.companyForm = ''
      this.codeOrName = ''
      this.page.current = 1
      if (val) {
        this.doInit()
      }
    }
  }
}
</script>
<style lang="less">
@import "./companyModal.less";
</style>
