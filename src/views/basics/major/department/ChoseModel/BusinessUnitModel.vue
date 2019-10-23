<template>
  <section>
    <Modal
      v-model="visible"
      width="750px"
      :transfer="false"
      scrollable
      draggable
      :zIndex="9999"
      class="company-select-modal"
      @on-cancel="handleCancelSelect"
    >
      <p slot="header">
        <span>{{ title }}</span>
      </p>
      <div class="content">
        <div class="search-contain">
          <row :gutter="10">
            <Col span="4">
              <Select v-model="params.isEnable" @on-change="handleFilterData" disabled clearable placeholder="已生效">
                <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
              </Select>
            </Col>
            <Col span="4">
              <Select v-model="unitFormId" @on-change="handleGetCompany">
                <Option v-for="item in type_list" :value="item.value" :label="item.label" :key="item.value"></Option>
              </Select>
            </Col>
            <Col span="8">
              <Input autocomplete="on" clearable class="search-input" type="text" v-model="params.codeOrName" placeholder="客户编码/客户名称" search enter-button @on-search="handleFilterData">
                <Button slot="append" icon="ios-search" @click="handleFilterData"></Button>
              </Input>
            </Col>
            <Col span="4">
              <Button style="position: relative;top: 1px" @click="handleInit">重置</Button>
            </Col>
          </row>
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
      default: '选择归属公司业务单元'
    },
    value: {
      type: Boolean,
      default: false
    },
    model_ids: {
      default: null,
      type: Number
    }
  },
  watch: {
    value: function (val) {
      this.visible = val
    },
    model_ids: {
      handler: function (newName, oldName) {
        // console.log(this)
        this.handeIdchange(newName)
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      visible: false,
      tableData: [],
      formList: [],
      unitFormId: '',
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
          key: 'unitFormName',
          tooltip: true
        },
        {
          title: '数据状态',
          minWidth: 40,
          key: 'isEnable',
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  backgroundColor: params.row.isEnable === 0 ? '#F73E3E' : '#595959',
                  borderRadius: '50%',
                  marginRight: '10px'
                }
              }),
              h('span', {
                style: {
                  color: params.row.isEnable === 0 ? '#F73E3E' : '#595959',
                  verticalAlign: 'middle'
                }
              }, params.row.isEnable === 0 ? '已失效' : '已生效')
            ])
          }
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
        companyIdList: [],
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
    handleInit () {
      this.params = {
        isEnterpriseAdmin: 1,
        codeOrName: '',
        companyIdList: [],
        isEnable: '',
        page: {
          size: 10,
          current: 1
        }
      }
      this.unitFormId = ''
      this.handleGetCompany()
    },
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleGetCompany()
    },
    handeIdchange (id) {
      // console.log(id)
      this.params.companyIdList.splice(1, 1, id)
      this.handleGetCompany()
    },
    handleChangePage (page) {
      this.params.page.current = page
      this.handleGetCompany()
    },
    handleGetCompany () {
      this.$request.post('/financeback/businessUnit/findBusinessUnitPage', {
        ...this.params,
        unitFormId: this.unitFormId === 0 ? '' : this.unitFormId
      }).then(res => {
        if (res.data.code === 200) {
          console.log('88', res)
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
