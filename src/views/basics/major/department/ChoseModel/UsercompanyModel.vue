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
          <Input autocomplete="on" clearable class="search-input" type="text" v-model="params.codeOrName" placeholder="编码/名称" search enter-button @on-search="handleFilterData">
            <Button slot="append" icon="ios-search" @click="handleFilterData"></Button>
          </Input>
        </div>
        <Table
          :columns="tableColumns"
          :data="tableData"
          :no-data-text="null"
          :class="tableData.length ? 'tableHeight' : ''"
        ></Table>
        <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableData.length"></nodata>
      </div>
      <div slot="footer">
        <section class="page-footer">
          <div class="page-footer-lf">
            共 <strong>{{ total }}</strong>条数据
          </div>
          <div class="page-footer-rt">
            <Page
              id="pageId"
              class-name="pages"
              :total="total"
              :page-size-opts="[10, 20, 50, 100]"
              show-elevator
              show-sizer
              @on-change="handleChangePage"
              @on-page-size-change="handleChangePageSize"></Page>
            <Button size="small" @click="goElevatorPage">GO</Button>
          </div>
        </section>
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
      default: '选择属性'
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
          title: '操作',
          align: 'center',
          render: (h, { row }) => {
            return h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: () => {
                  this.$emit('select', row)
                  this.visible = false
                }
              }
            }, '选择')
          }
        }
      ],
      total: 0,
      params: {
        codeOrName: '',
        page: {
          size: 10,
          current: 1
        }
      }
    }
  },
  mounted () {
    this.handleGetCompany()
  },
  methods: {
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleGetCompany()
    },
    handleChangePage (page) {
      this.params.page.current = page
      this.handleGetCompany()
    },
    handleGetCompany () {
      this.$request.post('/financeback/dept/findDeptTypePage', this.params).then(res => {
        if (res.data.code === 200) {
          // console.log(res)
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
    .ivu-table-tip table td {
    text-align: center;
    display: none;
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
    .tableHeight {
      height: 400px;
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
