<template>
  <section class="ownershipcompany">
    <Modal
      v-model = "companyShow"
      width="750px"
      :transfer="false"
      scrollable
      draggable
      class="company-modal"
      @on-cancel="handleCancelSelect"
      @on-visible-change="doInitInfo"
    >
      <p slot="header">
        <span>{{ titleName }}</span>
      </p>
      <section class="page-content">
        <div class="query-condition">
          <div class="query-condition-lf">
            <Row class="screen query-company">
              <Col span="12">
                <!-- <Input v-model="codeOrName" placeholder="员工编码姓名" search enter-button clearable></Input> -->
                          <div class="query-condition-lf">
        <Input  :placeholder="this.promptMessage" :style="inputWidth" v-model="params.codeOrName" @on-search="doSearchMain"></Input>
        <Button slot="append" icon="ios-search" @click="doSearchMain"></Button>
      </div>
              </Col>
            </Row>
          </div>
          <div style="width:20%"></div>
        </div>
        <div class="page-content-table">
           <Table :columns="columns1" :data="tableData" :no-data-text="null"
            :row-class-name="next_level_style"></Table>
           <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableData.length"></nodata>
        </div>
      </section>
      <div slot="footer" style="margin-top:20px">
        <section class="page-footer">
          <div class="page-footer-lf">
            共 <strong>{{ total }}</strong>条数据
          </div>
          <div class="page-footer-rt">
            <Page
              id="pageIds"
              class-name="pages"
              :total="total"
              :page-size-opts="[10, 20, 50, 100]"
              show-elevator
              show-sizer
              @on-change="handleChangePage"
              @on-page-size-change="handleChangePageSize"></Page>
            <Button size="small" @click="goElevatorPage('pageIds')">GO</Button>
          </div>
        </section>
      </div>
    </Modal>
  </section>
</template>

<script>
import { saasMixin } from '@/libs/mixins'
import nodata from '_c/nodata'
// import { checkCompanyForm } from '@/libs/filters'
// import { session } from '@/libs/location.js'
export default {
  data () {
    return {
      inputWidth: {
        width: '200px'
      },
      promptMessage: '编码/名称',
      companyForm: '',
      // codeOrName: '',
      total: 0,
      params: {
        codeOrName: '',
        companyIdList: [],
        page: {
          size: 10,
          current: 1
        }
      },
      tableData: [],
      columns1: [
        {
          title: '员工编码',
          key: 'code'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '操作',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" on-click={this.doGetDetailsData.bind(this, { row, index, column })}>选择</span>
              </div>
            )
          }
        }
      ]
      // tableData: [
      //   {
      //     name: 'Ep000',
      //     age: '王晓明',
      //     address: '选择',
      //     date: '2016-10-03'
      //   },
      //   {
      //     name: 'Ep001',
      //     age: '刘德华',
      //     address: '选择',
      //     date: '2016-10-01',
      //     next: true
      //   },
      //   {
      //     name: 'Ep002',
      //     age: 30,
      //     address: '选择',
      //     date: '2016-10-02'
      //   },
      //   {
      //     name: 'Ep003',
      //     age: 26,
      //     address: '选择',
      //     date: '2016-10-04'
      //   }
      // ]
    }
  },
  props: {
    showFlag: {
      type: Boolean
    },
    titleName: {
      type: String
    },
    model_ids2: {
      default: null,
      type: Number
    }
  },
  watch: {
    model_ids2: {
      handler (newName, oldName) {
        this.handeIdchange(newName)
      }
    }
  },
  components: { nodata },
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
    handeIdchange (id) {
      console.log(id)
      this.params.companyIdList.splice(0, 1, id)
      this.handleGetCompany()
    },
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleGetCompany()
    },
    doInitInfo (val) {
      this.params.codeOrName = ''
      this.current = 1
      if (val) {
        this.handleGetCompany()
      }
    },
    handleChangePage (page) {
      this.params.page.current = page
      this.handleGetCompany()
    },
    handleGetCompany () {
      this.$request.post('/financeback/staff/findStaffPage', this.params).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          // this.params.codeOrName = ''
        } else {
          this.tableData = []
        }
      })
    },
    handleCancelSelect () {
      this.companyShow = false
      this.$emit('address')
    },
    next_level_style (row) {
      return row.next ? 'next-level' : ''
    },
    doSearchMain () {
      this.handleGetCompany()
    },
    doGetDetailsData (row) {
      console.log(row.row.name)
      // 点击选择
      this.$emit('address', row)
      this.companyShow = false
    }
  },
  mounted () {
    this.handleGetCompany()
  }
}
</script>
<style lang="less">
  @import "../../assets/css/base.less";
  .ownershipcompany {
        .ivu-table-tip table td {
    text-align: center;
    display: none;
}
.company-modal {
    .ivu-modal-body {
      padding: 0px;
    }
    .ivu-modal-footer {
      border-top: 0;
      padding: 0;
      text-align: right;
    }
    .page-footer-lf {
    text-align: left
    }
  }
  .query-company {
    .ivu-input-icon {
      right: 50px;
    }
  }
  .page-content .query-condition .query-condition-lf .screen .ivu-col {
    padding-left: 0px;
    padding-top: 10px;
}
  }

</style>
