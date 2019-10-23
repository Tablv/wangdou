// 添加辅助核算项目
<template>
  <div class="handleModal">
    <Modal
    v-model= "handleModal"
    :transfer="false"
    :closable="false"
    :mask-closable="false"
    draggable
    scrollable
    width=1000>
      <header
        class="modal-header"
        slot="header"
      >
        <div class="modal-header-name">{{titleName}}</div>
        <div class="modal-header-actions">
          <span class="table-span" @click="doCancel"><common-icon :size="14" type="_modalclose"></common-icon></span>
        </div>
      </header>
      <article>
        <Row>
          <Col span="13" class-name="page-left">
          <section>
            <!-- <Input v-model="codeOrName" search enter-button style="width: 47%;margin-bottom: 10px" placeholder="用户手机号码或用户名" @on-search="searchOrMatch" @on-change="changeOrMatch" /> -->
            <Input style="width: 47%;margin-bottom: 10px" search v-model="codeOrName" placeholder="用户手机号码或用户名" @on-search="searchOrMatch" @on-change="changeOrMatch"></Input>
          </section>
          <section class="handle-table">
            <Table
            :height="handHeight"
            :columns="tableColumns"
            :data="tableData"
            @on-select-cancel="doCancleSelect"
            @on-selection-change="doSelectModalData"
            @on-select-all-cancel="doCancleAll"
            :no-data-text="null" :class="tableData.length ? null : 'tableHeight'" ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </section>
          <div class="page-footer">
            <div class="page-footer-lf">
              共<strong>{{total}}</strong>条数据
            </div>
            <div class="div-page-btn">
              <Page
                id="modalPageId"
                class-name="pages"
                :total="total"
                :current="current"
                :page-size="size"
                :page-size-opts="[20, 50, 100, 200, 500, 1000]"
                show-elevator
                show-sizer
                @on-page-size-change="changePageSize"
                @on-change="handleChangePage"/>
              <Button type="primary" size="small" @click="goElevatorPage('modalPageId')">Go</Button>
            </div>
          </div>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" style="height: 32px; margin-bottom: 10px">
              <span style="font-size: 14px">已选用户( <span class="table-span">{{pageSelect.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected">
                <div v-for="(item, index) in pageSelect" :key="index">
                  {{item.name}}
                  <Icon type="md-close" @click="doIconDeleteUser(item)" />
              </div>
            </section>
          </Col>
        </Row>
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
  name: 'handleModal',
  components: {
    CommonIcon,
    nodata
  },
  props: {
    handleModal: {
      defalult: false,
      type: Boolean
    },
    titleName: {
      type: String
    }
  },
  data () {
    return {
      handHeight: 36, // 表格高度
      codeOrName: null, // 弹框中查询条件
      show: true,
      size: 20, // 弹框每页显示的数据个数
      current: 1, // 弹框页码
      total: 0, // 弹框数据总数
      tableColumns: [
        {
          type: 'selection',
          width: 50,
          multiple: true,
          align: 'center'
        },
        {
          title: '编码',
          key: 'code',
          tooltip: true,
          minWidth: 70
        },
        {
          title: '用户姓名',
          key: 'name',
          tooltip: true,
          minWidth: 90
        },
        {
          title: '状态',
          key: 'isEnable',
          width: 80,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: (params.row.isEnable === 0) ? 'inline-block' : 'none',
                  color: '#F73E3E'
                }
              }, '已失效'),
              h('span', {
                style: {
                  display: (params.row.isEnable === 1) ? 'inline-block' : 'none',
                  color: '#595959'
                }
              }, '已生效')
            ])
          }
        }
      ],
      tableData: [],
      selectUser: [], // 弹框选中的数据
      pageSelect: []
    }
  },
  watch: {
    tableData: {
      handler () {
        this.pageSelect.forEach((son) => {
          this.tableData.forEach((item) => {
            if (son.code === item.code) {
              this.$set(item, '_checked', true)
            }
          })
        })
        // this.selectUser = []
      },
      deep: true
    }
    // current () {
    //   if (this.selectUser.lenght !== 0) {
    //     this.pageSelect = this.selectUser
    //   }
    // }
  },
  mixins: [saasMixin],
  methods: {
    // 取消某一项
    doCancleSelect (select, row) {
      this.pageSelect.forEach((item, index) => {
        if (item.code === row.code) {
          this.pageSelect.splice(index, 1)
        }
      })
    },
    // 全选取消
    doCancleAll (select) {
      this.tableData.forEach((item) => {
        this.pageSelect.forEach((page, index) => {
          if (item.code === page.code) {
            this.pageSelect.splice(index, 1)
          }
        })
      })
    },
    // 获取列表数据
    doGetList () {
      let req = {
        codeOrName: this.codeOrName,
        page: {
          current: this.current,
          size: this.size
        }
      }
      this.$request.post('/financeback/accountSubject/findAuxiliaryPage', req).then(res => {
        if (res.data.code === 200) {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          if (this.tableData.length === 0) {
            this.handHeight = 36
          } else {
            this.handHeight = 358
          }
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    doConfirm () {
      // this.$emit('selectUser', this.selectUser)
      let selectUser = JSON.stringify(this.pageSelect)
      this.$emit('selectUser', selectUser)
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.pageSelect = []
    },
    doCancel () {
      this.codeOrName = null
      this.current = 1
      this.size = 20
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.pageSelect = []
    },
    // 对话框----列表多选
    doSelectModalData (data) {
      this.$emit('onChange', 'change')
      if (data.length > 0) {
        data.forEach((item) => {
          let ispage = this.pageSelect.some((page) => {
            return page.code === item.code
          })
          if (!ispage) {
            this.pageSelect.push(item)
          }
        })
      }
    },
    // 点击删除图标删除用户
    doIconDeleteUser (item) {
      this.tableData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      // 删除pageSelect
      let pageIndex = this.pageSelect.findIndex(page => page === item)
      if (pageIndex !== -1) {
        this.pageSelect.splice(pageIndex, 1)
      }
      // 删除用户后，对应的列表中的数据取消勾选
      this.tableData.forEach(m => {
        this.pageSelect.forEach(s => {
          if (m.code === s.code) {
            this.$set(m, '_checked', true)
          }
        })
      })
      this.tableData.forEach(items => {
        delete items._checked
      })
    },
    // 搜索
    searchOrMatch (value) {
      this.codeOrName = value
      this.doGetList()
    },
    changeOrMatch (e) {
      if (e.target.value === '') {
        this.codeOrName = ''
        this.doGetList()
      }
    },
    // 点击清空删除用户
    doCloseModalData () {
      // this.pageSelect.forEach(m => {
      //   this.$set(m, '_checked', false)
      // })
      this.tableData.forEach(s => {
        this.$set(s, '_checked', false)
      })
      this.pageSelect = []
      this.tableData.forEach(item => {
        delete item._checked
      })
    },
    // 改变当前页
    handleChangePage (val) {
      // this.pageSelect = this.selectUser
      // console.log(JSON.stringify(this.pageSelect))
      this.current = val
      this.doGetList()
    },
    // 改变每页数量
    changePageSize (val) {
      this.size = val
      this.doGetList()
    }
    // // 分页跳转至第几页
    // goElevatorPages (pageId) {
    //   this.goElevatorPage(pageId)
    // }
  }
}
</script>
<style lang="less">
@import '../../../../../assets/css/base.less';
@import '../../../../../assets/css/redefine.less';
.handleModal{
  .ivu-modal{
    .ivu-modal-content {
      border-radius: 0;
    }
  }
  .page-left{
    .ivu-input-search{
      padding: 0 8px !important;
      color: #999999 !important;
      background: #FAFAFA !important;
      border-color: #e5e5e5 !important;
    }
    .ivu-input-search:before{
      background: none
    }
    // .ivu-table{
    //   min-height: 358px;
    // }
    .page-footer{
      position: static;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .div-page-btn{
        display: flex;
        justify-content: send;
      }
    }
    .tableHeight {
      height: 36px;
    }
    .handle-table {
      // height: 358px;
      overflow: auto;
    }
    .handle-table::-webkit-scrollbar {
      width: 3px;
    }
    .handle-table::-webkit-scrollbar-thumb {
      width: 3px;
      background: #a2a2a2;
      border-radius: 2px;
    }
  }
  .page-right{
    padding-left: 10px;
    .selected{
      height: 359px;
      border: 1px solid #DDDDDD;
      overflow: auto;
      div{
        height: 30px;
        border-radius: 15px;
        background: #ECECEC;
        border: 1px solid #C1C1C1;
        line-height: 30px;
        display: inline-block;
        text-align: center;
        padding: 0px 10px;
        margin: 7px;
      }
    }
    .selected::-webkit-scrollbar {
      width: 3px;
    }
    .selected::-webkit-scrollbar-thumb {
      width: 3px;
      background: #a2a2a2;
      border-radius: 2px;
    }
  }

  .modal-header {
    width: 100%;
    height: 30px;
    .modal-header-name {
      float: left;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      color: #333333;
    }
    .modal-header-actions {
      float: right;
      height: 30px;
      line-height: 30px;
    }

  }
  .ivu-btn.ivu-btn-primary.ivu-btn-small {
    margin-left: 10px;
  }
}

</style>
