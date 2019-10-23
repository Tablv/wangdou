<template>
  <section>
    <Modal
      v-model="visible"
      width="750px"
      :transfer="false"
      scrollable
      draggable
      class="company-select-modal"
      @on-cancel="handleCancelSelect"
    >
      <p slot="header">
        <span>{{ title }}</span>
      </p>
      <div class="content">
        <div class="search-contain">
          <Row :gutter="10">
            <Col span="4">
              <Select v-model="companyFormId" @on-change="handleGetCompany">
                <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
              </Select>
            </Col>
            <Col span="8">
              <Input autocomplete="on" clearable type="text" v-model="params.codeOrName" placeholder="客户编码/客户名称" search enter-button @on-search="handleFilterData">
                <Button slot="append" icon="ios-search" @click="handleFilterData"></Button>
              </Input>
            </Col>
            <Col span="4">
              <Button style="position: relative;top: 2px" @click="handleInit">重置</Button>
            </Col>
          </Row>
        </div>
        <Table
          :columns="tableColumns"
          :data="tableData"
          :no-data-text="null"
          :height="tableData.length ? '400' : ''"
        ></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableData.length"></nodata>
      </div>
      <div slot="footer" style="margin-top: 30px">
        <div>
          <section class="page-footer">
            <div class="page-footer-lf">
              共 <strong>{{ total }}</strong>条数据
            </div>
            <div class="page-footer-rt">
              <Page
                id="companyId"
                class-name="pages"
                :total="total"
                :page-size="params.page.size"
                :page-size-opts="[20, 50, 100, 500, 1000]"
                show-elevator
                show-sizer
                @on-change="handleChangePage"
                @on-page-size-change="handleChangePageSize"></Page>
              <Button type="primary" size="small" @click="goElevatorPage('companyId')">GO</Button>
            </div>
          </section>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script>
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins'
export default {
  name: 'companySelect',
  components: { nodata },
  mixins: [saasMixin],
  props: {
    title: {
      type: String,
      default: '选择公司'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: function (val) {
      this.visible = val
    }
  },
  data () {
    return {
      visible: false,
      tableData: [],
      companyFormId: 0,
      type_list: [
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
        },
        {
          title: '操作',
          align: 'center',
          render: (h, { row }) => {
            return (
              <div>
                <span class="table-span table-right" on-click={this.handleChooseRow.bind(this, row)}>选择</span>
              </div>
            )
          }
        }
      ],
      total: 0,
      params: {
        isEnterpriseAdmin: 1,
        codeOrName: '',
        page: {
          size: 20,
          current: 1
        }
      }
    }
  },
  mounted () {
    this.handleGetCompany()
  },
  methods: {
    handleInit () {
      this.params = {
        isEnterpriseAdmin: 1,
        codeOrName: '',
        page: {
          size: 20,
          current: 1
        }
      }
      this.handleGetCompany()
    },
    handleChooseRow (row) {
      this.$emit('select', row)
      this.visible = false
    },
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleGetCompany()
    },
    handleChangePage (page) {
      this.params.page.current = page
      this.handleGetCompany()
    },
    handleGetCompany () {
      this.$request.post('/financeback/company/findCompanyPage', {
        ...this.params,
        companyFormId: this.companyFormId === 0 ? '' : this.companyFormId
      }).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.tableData = []
        }
      })
    },
    handleFilterData () {
      this.handleGetCompany()
    },
    handleCancelSelect () {
      this.visible = false
      this.$emit('select')
    },
    next_level_style (row) {
      return row.next ? 'next-level' : ''
    }
  }
}
</script>

<style lang="less">
  /*:row-class-name="next_level_style"*/
  /*.ivu-table .next-level td:not(:last-child){*/
  /*  padding-left: 10px;*/
  /*}*/
  .company-select-modal {
    .content {
      width: 100%;
      .ivu-table:before {
        height: 0 !important;
      }
    }
    .ivu-modal-body {
      padding: 10px;
    }
    .ivu-modal-footer {
      border-top: 0;
      padding: 0;
      text-align: right;
    }
    .page-footer-lf {
      text-align: left
    }
    .search-contain {
      .search-input {
        width: 250px;
      }
      .ivu-icon-ios-close-circle {
        right: 40px !important;
        cursor: pointer;
      }
      margin-bottom: 10px;
    }
  }
</style>
