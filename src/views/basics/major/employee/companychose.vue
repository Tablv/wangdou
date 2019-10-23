<template>
    <section>
      <Modal
        v-model="visible"
        width="750px"
        :transfer="false"
        draggable
        :footer-hide="true"
        class="company-modal3"
        @on-cancel="handleCancelSelect"
        @on-visible-change="doInitInfo"
      >
        <p slot="header">
          <span>{{ title }}</span>
        </p>
        <div class="content">
          <div class="search-contain">
            <Row :gutter="10">
              <Col span="4">
                <Select v-model="params.isEnable" @on-change="handleGetDepartment" disabled clearable placeholder="已生效">
                  <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                </Select>
              </Col>
              <Col span="4">
                <Select v-model="params.deptType" @on-change="handleGetDepartment" clearable placeholder="全部属性">
                  <Option v-for="(item,name) in formList" :value="item.id" :key="name">{{item.name}}</Option>
                </Select>
              </Col>
              <Col span="8">
                <Input class="search-input" type="text" v-model="params.deptCodeOrDeptName" placeholder="部门编码/名称" search enter-button @on-search="handleGetDepartments">
                  <Button slot="append" icon="ios-search" @click="handleGetDepartments"></Button>
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
            :row-class-name="next_level_style"
            :class="tableData.length ? null : 'tableHeight'"
          ></Table>
           <nodata :icon-size="60" notice-text="暂无数据" v-if="!tableData.length"></nodata>
        </div>
        <div style="margin-top: 30px">
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
            <Button type="primary" size="small" @click="goElevatorPage('pageId')">GO</Button>
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
  name: 'companychose',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    value: {
      type: Boolean,
      default: false
    },
    model_ids2: {
      default: null,
      type: Number
    }
  },
  components: { nodata },
  mixins: [saasMixin],
  watch: {
    value: function (val) {
      this.visible = val
    },
    model_ids2: {
      handler (newName, oldName) {
        this.handeIdchange(newName)
        this.getdeptchange()
      }
    }
  },
  data () {
    return {
      visible: false,
      total: 0,
      params: {
        isEnterpriseAdmin: 1,
        deptCodeOrDeptName: '',
        companyIdList: [],
        isEnable: 1,
        deptType: '',
        page: {
          size: 10,
          current: 1
        }
      },
      formList: [],
      tableData: [],
      // tableData: [
      //   { code: '0101', name: '人事部', attribute: '管理部门', attributioncompany: '南京网兜科技有限公司', spandcompany: '南京网兜科技有限公司', BusinessUnit: '本部' },
      //   { code: '0101', name: '人事部', attribute: '管理部门', attributioncompany: '南京网兜科技', spandcompany: '南京网兜科技', BusinessUnit: '本部' },
      //   { code: '0101', name: '人事部', attribute: '管理部门', attributioncompany: '南京网兜科技', spandcompany: '南京网兜科技', BusinessUnit: '本部' },
      //   { code: '0101', name: '人事部', attribute: '管理部门', attributioncompany: '南京网兜科技', spandcompany: '南京网兜科技', BusinessUnit: '本部' },
      //   { code: '0101', name: '人事部', attribute: '管理部门', attributioncompany: '南京网兜科技', spandcompany: '南京网兜科技', BusinessUnit: '门店' }
      // ],
      tableColumns: [
        {
          title: '编码',
          key: 'code',
          width: 70,
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          width: 80,
          tooltip: true
        },
        {
          title: '属性',
          key: 'deptTypeName',
          width: 90,
          tooltip: true
        },
        {
          title: '使用公司',
          key: 'useCompanyName',
          width: 160,
          tooltip: true
        },
        {
          title: '数据状态',
          key: 'isEnableStr',
          width: 160,
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
      ]
    }
  },
  methods: {
    handleInit () {
      this.params = {
        isEnterpriseAdmin: 1,
        deptCodeOrDeptName: '',
        companyIdList: [],
        isEnable: 1,
        deptType: '',
        page: {
          size: 10,
          current: 1
        }
      }
      this.handleGetDepartment()
    },
    doInitInfo (val) {
      this.params.deptCodeOrDeptName = ''
      this.current = 1
      if (val === '') {
        this.handleGetDepartment()
      }
    },
    handleCancelSelect () {
      this.visible = false
      this.$emit('select')
    },
    handleChangePage (page) {
      this.params.page.current = page
      this.handleGetDepartment()
    },
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleGetDepartment()
    },
    handeIdchange (id) {
      console.log(id)
      this.params.companyIdList.splice(0, 1, id)
      this.handleGetDepartment()
    },
    handleGetDepartment () {
      this.$request.post('financeback/dept/findDeptPage', this.params).then(res => {
        if (res.data.code === 200) {
          console.log(res)
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.tableData = []
        }
      })
    },
    getdeptchange () {
      this.$request.post('/financeback/dept/findDeptTypeList').then(res => {
        if (res.data.code === 200) {
          // console.log( res)
          this.formList = res.data.data
          // this.formList.babel = res.data.data.name
        }
      })
    },
    handleGetDepartments () {
      console.log('1')
      this.handleGetDepartment()
    },

    next_level_style (row) {
      return row.next ? 'next-level' : ''
    }
  }
}
</script>

<style lang="less">

  .company-modal3 {
    .ivu-table .next-level td:not(:last-child){
    padding-left: 10px;
  }
    .content {
      width: 100%;
      min-height: 350px;
    }
    .ivu-modal-body {
      padding: 10px;
    }
    .page-footer-lf {
      text-align: left
    }
    .tableHeight {
      height: 36px;
    }
    .search-contain {
      .search-input {
        width: 250px;
      }
      margin-bottom: 10px;
    }
  }
</style>
