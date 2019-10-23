<template>
  <section>
    <Modal
      v-model="accountShow"
      title="选择归属公司"
      width="750"
      :mask-closable="false"
      :transfer="false"
      draggable
      scrollable
      class="query-main"
      @on-visible-change="doInitInfo"
      >
      <section class="page-content">
        <div class="query-condition">
          <div class="query-condition-lf">
            <Input v-model="codeOrName" placeholder="编码/名称" :style="inputWidth" clearable @on-clear="doInit" @on-enter="doSearchMain"></Input>
            <Button slot="append" icon="ios-search" @click="doSearchMain"></Button>
          </div>
        </div>
        <div class="page-content-table">
          <Table
          :columns="tableColumns"
          :data="tableData"
          :no-data-text="null"
          :height="tableData.length ? '350' : ''"
          >
          </Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
        </div>
      </section>
      <div slot="footer">
        <section class="page-footer" v-show="tableData.length!=0">
          <div class="page-footer-lf">
            共 <strong>{{ tableDataTotal }}</strong> 条数据
          </div>
          <div class="page-footer-rt">
            <Page
            id="pageAccount"
            class-name="pages"
            :total="tableDataTotal"
            :current="current"
            :page-size="size"
            :page-size-opts="[20, 50, 100, 500, 1000]"
            show-elevator
            show-sizer
            @on-change="handleChangePage"
            @on-page-size-change="changePageSize">
            </Page>
            <Button size="small" @click="goElevatorPage('pageAccount')">GO</Button>
          </div>
        </section>
      </div>
    </Modal>
  </section>
</template>

<script>
import { saasMixin } from '@/libs/mixins.js'
// import { session } from '@/libs/location.js'
import nodata from '_c/nodata'
export default {
  components: {
    nodata
  },
  props: {
    dataModal: Object
  },
  mixins: [saasMixin],
  data () {
    return {
      // 核算主体测试
      isEnterpriseAdmin: 1, // 标识是否后台管理界面 0：否 1：是
      code: null, // 编码
      name: null, // 名称
      codeOrName: '', // 公司输入框的内容
      inputWidth: {
        width: '200px'
      },
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
          key: 'companyFormName',
          tooltip: true
        },
        {
          title: '操作',
          key: 'handle',
          className: 'primary',
          tooltip: true,
          minWidth: 30,
          align: 'center',
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span class="table-span" onClick= {this.$emit.bind(this, 'getAccountName', { row })}>选择</span>
              </div>
            )
          }
        }
      ],
      tableData: [],
      tableDataTotal: 0, // 列表总数
      size: 20, // 每页显示的数据个数
      current: 1 // 页码
      // list: []
    }
  },
  computed: {
    accountShow: {
      get () {
        return this.dataModal.isShow
      },
      set (data) {
        this.$emit('getShowAccount', false)
        return data
      }
    }
  },
  methods: {
    // 数据初始化
    doInit () {
      let reqDate = {
        isEnterpriseAdmin: 1,
        page: {
          size: this.size,
          current: this.current
        }
      }
      this.$request.post('/financeback/company/findCompanyPage', reqDate).then(result => {
        const { status, data } = result.data
        console.log(result)
        if (status === 'success') {
          const { records, total } = data
          this.tableData = records
          this.tableDataTotal = total
        } else {
          this.tableData = []
          this.tableDataTotal = 0
        }
      })
    },
    doInitInfo (val) {
      this.codeOrName = ''
      this.current = 1
      if (val) {
        this.doInit()
      }
    },
    // 输入框条件搜索
    doSearchMain () {
      console.log('搜索')
      let reqDate = {
        size: this.size,
        current: this.current,
        codeOrName: this.codeOrName
      }
      this.$request.post('/financeback//company/findCompanyPage', reqDate).then(result => {
        let { status, data } = result.data
        if (status === 'success') {
          console.log(data)
          let _fromData = []
          data.records.forEach(item => {
            _fromData.push({
              code: item.code,
              name: item.name,
              companyFormName: item.companyFormName,
              hasSubAccount: item.hasSubAccount,
              id: item.id
            })
          })
          this.tableData = _fromData
          this.tableDataTotal = data.total
        } else {
          this.tableData = []
          this.tableDataTotal = 0
        }
      })
    },
    // 改变当前页
    handleChangePage (pageNo) {
      this.current = pageNo
      this.doInit()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.handleChangePage(1)
    }
  }
}
</script>

<style lang="less">
@import "../../assets/css/base.less";
.query-main {
  .ivu-modal {
    .ivu-modal-content {
      height: 500px;
      border-radius: 0px;
      .ivu-modal-header p, .ivu-modal-header-inner {
        font-size: 16px;
        color: rgba(51, 51, 51, .85)
      }
      .ivu-modal-close .ivu-icon-ios-close {
        color: #595959;
      }
      .ivu-modal-body {
        .page-content {
          padding: 0px;
          .page-content-table {
            .ivu-table-tip {
              height: 0;
            }
          }
          .ivu-input-wrapper {
            width: 218px;
          }
          .searchBtn {
            width: 32px;
            position: relative;
            border-left: none;
            .ivu-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #999;
            }
          }
        }
      }
      .ivu-modal-footer {
        border-top: none;
        .page-footer-lf {
          text-align: left;
          margin-bottom: 10px;
        }
        .page-footer-rt {
          .ivu-page-options {
            margin-left: 4px;
            .ivu-page-options-elevator {
              input {
                margin: 0;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
}
</style>
