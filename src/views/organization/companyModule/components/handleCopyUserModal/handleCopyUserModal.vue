<template>
  <div class="handleCopyUserModal">
    <Modal
    v-model= "handleCopyUserModal"
    :transfer="false"
    :closable="false"
    :mask-closable="false"
    draggable
    scrollable
    width=1000
    @mousemove.native="onMouseUpModal"
    @mouseup.native="onMouseUpModal"
    >
      <header
        class="modal-header"
        slot="header"
      >
        <div class="modal-header-name page-header-name">复制岗位权限到其他用户</div>
        <div class="modal-header-actions">
          <span class="table-span" @click="doCancel"><common-icon type="_modalclose" class="modal-close"></common-icon></span>
        </div>
      </header>
      <article>
        <Row>
          <Col span="13" class-name="page-left">
          <section>
            <Input v-model="orMatchModal" search style="width: 47%;margin-bottom: 10px" placeholder="用户手机号码或用户名" @on-search="searchOrMatch" @on-change="changeOrMatch" />
          </section>
          <section>
            <Table
            :columns="tableColumns"
            :data="tableData"
            @on-selection-change="doSelectModalData"
            max-height="359"
            :no-data-text="null" :class="tableData.length ? null : 'tableHeight'" ></Table>
            <nodata :icon-size="60" notice-text="暂无数据" v-if="tableData.length===0"></nodata>
          </section>
          <div class="page-footer">
            <div class="page-footer-lf">
              共<strong>{{this.copyData.length}}</strong>条数据
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
              <Button size="small" @click="doGoElevatorPage('modalPageId')" class="icon-go">GO</Button>
            </div>
          </div>
          </Col>
          <Col span="11" class-name="page-right">
            <Row type="flex" justify="space-between" align="bottom" style="height: 32px; margin-bottom: 10px">
              <span style="font-size: 14px">已选用户( <span class="table-span">{{selectUser.length}}</span>)</span>
              <span class="table-span" @click="doCloseModalData">清空</span>
            </Row>
            <section class="selected">
              <div v-for="(item, index) in selectUser" :key="index" class="selected-div">
                {{item.name}}
                <Icon type="md-close" @click="doIconDeleteUser(item)" class="table-span md-close"/>
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
  name: 'handleCopyUserModal',
  components: {
    CommonIcon,
    nodata
  },
  props: {
    handleCopyUserModal: {
      defalult: false,
      type: Boolean
    },
    copyData: {
      type: Array
    }
  },
  data () {
    return {
      orMatchModal: '', // 弹框中查询条件
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
          title: '用户手机号码',
          key: 'mobile',
          width: 150
        },
        {
          title: '用户姓名',
          key: 'name'
        },
        {
          title: '状态',
          key: 'isEnable',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  backgroundColor: params.row.isEnable === 1 ? '#595959' : '#F73E3E',
                  borderRadius: '50%',
                  marginRight: '4px'
                }
              }),
              h('span', {
                style: {
                  color: params.row.isEnable === 1 ? '#595959' : '#F73E3E',
                  verticalAlign: 'middle'
                }
              }, params.row.isAccounting === 0 ? '已失效' : '已生效')
            ])
          }
        }
      ],
      tableData: [],
      selectUser: [] // 弹框选中的数据
    }
  },
  mixins: [saasMixin],
  watch: {
    handleCopyUserModal (val) {
      if (val === true) {
        this.doGetInit()
      }
    }
  },
  methods: {
    // 初始化
    doGetInit () {
      if (this.copyData) {
        this.tableData = this.copyData
        console.log(this.tableData)
      }
    },
    // 确认按钮
    doConfirm () {
      this.$emit('copyRole', this.selectUser)
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.orMatchModal = ''
    },
    // 取消按钮
    doCancel () {
      this.$emit('modalClose', false)
      this.doCloseModalData()
      this.orMatchModal = ''
    },
    // 对话框----列表多选
    doSelectModalData (data) {
      this.selectUser = []
      data.forEach(d => {
        let item = {
          userId: d.userId,
          name: d.name,
          mobile: d.mobile,
          assignRoleIds: d.assignRoleIds === undefined ? [] : d.assignRoleIds,
          checkAll: d.checkAll,
          checkAllGroup: d.checkAllGroup === undefined ? [] : d.checkAllGroup,
          indeterminate: d.indeterminate
        }
        this.selectUser.push(item)
      })
    },
    // 点击删除图标删除用户
    doIconDeleteUser (item) {
      this.tableData.forEach(m => {
        this.$set(m, '_checked', false)
      })
      // 删除用户
      let index = this.selectUser.findIndex(s => s === item)
      if (index !== -1) {
        this.selectUser.splice(index, 1)
      }
      // 删除用户后，对应的列表中的数据取消勾选
      this.tableData.forEach(m => {
        this.selectUser.forEach(s => {
          if (m.userId === s.userId) {
            this.$set(m, '_checked', true)
          }
        })
      })
    },
    // 搜索
    searchOrMatch (value) {
      let reg = new RegExp(value)
      let arr = []
      this.copyData.forEach(item => {
        if (reg.test(item.mobile) || reg.test(item.name)) {
          arr.push(item)
        }
      })
      this.tableData = arr
    },
    // 搜索框为空触发
    changeOrMatch (e) {
      if (e.target.value === '') {
        this.orMatchModal = ''
        this.doGetInit()
      }
    },
    // 点击清空删除用户
    doCloseModalData () {
      this.selectUser = []
      this.$set(this, 'tableData', this.tableData.map(m => {
        delete m._checked
        return m
      }))
    },
    // 改变当前页
    handleChangePage (pageNo) {
      this.current = pageNo
      // this.doGetInit()
    },
    // 改变每页数量
    changePageSize (e) {
      this.size = e
      this.handleChangePage(1)
    },
    // 分页跳转至第几页
    doGoElevatorPage (pageId) {
      let evtObj
      let thisPage = document.getElementById(pageId)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      if (elevatorDiv && elevatorDiv.length > 0) {
        let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
        if (window.KeyEvent) { // firefox 浏览器下模拟事件
          evtObj = document.createEvent('KeyEvents')
          evtObj.initKeyEvent('keyup', true, true, window, true, false, false, false, 13, 0)
        } else { // chrome 浏览器下模拟事件
          evtObj = document.createEvent('UIEvents')
          evtObj.initUIEvent('keyup', true, true, window, 1)
          delete evtObj.keyCode
          if (typeof evtObj.keyCode === 'undefined') { // 为了模拟keycode
            Object.defineProperty(evtObj, 'keyCode', { value: 13 })
          } else {
            evtObj.key = String.fromCharCode(13)
          }
        }
        pageInput.dispatchEvent(evtObj)
      }
    }
  }
}
</script>
<style lang="less">
@import '../../../../../assets/css/base.less';
@import '../../../../../assets/css/redefine.less';
@import '../../../../../assets/css/index.less';
@import 'handleCopyUserModal.less';
</style>
