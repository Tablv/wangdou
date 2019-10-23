<template>
    <section>
      <Modal
        v-model="visible"
        width="750px"
        :transfer="false"
        scrollable
        draggable
        :footer-hide="true"
        class="company-modal"
        @on-cancel="handleCancelSelect"
      >
        <p slot="header">
          <span>{{ title }}</span>
        </p>
        <div class="content">
          <div class="search-contain">
            <Input class="search-input" type="text" v-model="params.search" placeholder="客户编码/客户名称"><Button slot="append" icon="ios-search"></Button></Input>
          </div>
          <Table
            :columns="tableColumns"
            :data="tableData"
            :no-data-text="null"
            :row-class-name="next_level_style"
            :class="tableData.length ? null : 'tableHeight'"
          ></Table>
        </div>
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
              @on-change="handleChangePage"
              @on-page-size-change="handleChangePageSize"></Page>
            <Button size="small" @click="handleLocationPage">GO</Button>
          </div>
        </section>
      </Modal>
    </section>
</template>

<script>
export default {
  name: 'companySelect',
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
      maxItems: 200,
      params: {
        page: 1,
        limit: 10,
        search: ''
      },
      tableData: [

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
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
          tooltip: true
        },
        {
          title: '名称',
          key: 'name',
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
      ]
    }
  },
  methods: {
    handleCancelSelect () {
      this.visible = false
      this.$emit('select')
    },
    handleChangePage (page) {
      this.params.page = page
    },
    handleChangePageSize (size) {
      this.params.limit = size
    },
    handleLocationPage (size) {
      this.params.limit = size
    },
    next_level_style (row) {
      return row.next ? 'next-level' : ''
    }
  }
}
</script>

<style lang="less">
  .ivu-table .next-level td:not(:last-child){
    padding-left: 10px;
  }
  .company-modal {
    .content {
      width: 100%;
      min-height: 350px;
    }
    .ivu-modal-body {
      padding: 10px;
    }
    .page-footer {
      margin-top: 20px;
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
