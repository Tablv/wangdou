<template>
  <section class="user-report">
    <Spin fix v-if="loading2" style="left: 8px;z-index: 10">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">用户权限表</div>
      <div class="page-header-actions">
        <Button @click="doSetTable"><common-icon type="_table" /></Button>
        <Button @click="doInit"><common-icon type="_refresh" /></Button>
      </div>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row :gutter='10' class='screen'>
            <Col span="4">
              <multi-select :data="userParams"
                            @on-select="getUserId"
                            @on-clear="isCheck"
                            placeholder="用户手机号码或名称"
                            title="选择用户"
                            type="user"
                            width="100%"
                            isEnterpriseAdmin = 1
                            :isClear="isClear"
                            @searchWord="searchWordUser"
                            :searchText="searchTextUser"
                            modalPageId="modalPageId1"
                            compareId="userId">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="3">
                    <Select v-model="isEnable" @on-change="doSelectUser">
                      <Option v-for="item in userEnableList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                  </Col>
                  <Col span="6">
                    <Input clearable v-model="userMobile" placeholder="用户手机号码或名称" @on-enter="doSearchUser" @on-clear="doSearchUser">
                      <Button slot="append" icon="ios-search" @click="doSearchUser" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doResetUser">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="4">
              <multi-select :data="companyParams"
                            @on-select="getCompanyId"
                            @on-clear="isCheck"
                            placeholder="公司编码或名称"
                            title="选择公司"
                            type="company"
                            width="100%"
                            isEnterpriseAdmin = 1
                            :isClear="isClear"
                            @searchWord="searchWordCom"
                            modalPageId="modalPageId2"
                            :searchText="searchTextCom">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="3">
                    <Select v-model="companyFormId" @on-change="doSelect">
                      <Option v-for="item in formList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                  </Col>
                  <Col span="6">
                    <Input clearable v-model="companyCodeOrName" placeholder="公司编码或名称" @on-enter="doSearch" @on-clear="doSearch">
                      <Button slot="append" icon="ios-search" @click="doSearch" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doResetCom">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="4">
              <multi-select :data="roleParams"
                            @on-select="getRoleId"
                            @on-clear="isCheck"
                            placeholder="岗位权限编码或名称"
                            title="选择岗位"
                            type="role"
                            width="100%"
                            isEnterpriseAdmin = 1
                            :isClear="isClear"
                            @searchWord="searchWordRole"
                            :searchText="searchTextRole"
                            modalPageId="modalPageId3"
                            compareId="roleId">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="6">
                    <Input clearable v-model="roleCodeOrName" placeholder="岗位权限编码或名称" @on-enter="doSearchRole" @on-clear="doSearchRole">
                      <Button slot="append" icon="ios-search" @click="doSearchRole" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doResetRole">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="4">
              <multi-select :data="sysParams"
                            @on-select="getSysName"
                            @on-clear="isCheck"
                            placeholder="全部子系统"
                            title="选择子系统"
                            type="subSystem"
                            width="100%"
                            isEnterpriseAdmin = 1
                            :isClear="isClear"
                            @searchWord="searchWordSys"
                            :searchText="searchTextSys"
                            modalPageId="modalPageId4"
                            compareId="typeName">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="6">
                    <Input clearable v-model="typeName" placeholder="全部子系统" @on-enter="doSearchSys" @on-clear="doSearchSys">
                      <Button slot="append" icon="ios-search" @click="doSearchSys" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doResetSys">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span="4">
              <multi-select :data="menuParams"
                            @on-select="getMenuId"
                            @on-clear="isCheck"
                            placeholder="全部菜单"
                            title="选择菜单"
                            type="menu"
                            width="100%"
                            isEnterpriseAdmin = 1
                            :isClear="isClear"
                            @searchWord="searchWordMenu"
                            :searchText="searchTextMenu"
                            modalPageId="modalPageId5"
                            compareId="menuId">
                <Row :gutter="10" slot="search" class="query-conditions">
                  <Col span="6">
                    <Input clearable v-model="menuCodeOrName" placeholder="全部菜单" @on-enter="doSearchMenu" @on-clear="doSearchMenu">
                      <Button slot="append" icon="ios-search" @click="doSearchMenu" size="small"></Button>
                    </Input>
                  </Col>
                  <Col span="2">
                    <Button @click="doResetMenu">重置</Button>
                  </Col>
                </Row>
              </multi-select>
            </Col>
            <Col span='2'>
              <Button @click="handleReset">重置</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div class="page-content-table">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>正在载入数据</div>
        </Spin>
        <vxe-table
          ref="xTable"
          :data="tableData"
          :height="tableHeight"
          v-if="isXTable"
        >
          <template v-for="item in tableColumns">
            <vxe-table-column :field="item.key" :title="item.title" :min-width="item.minWidth" :key="item.key" v-if="item.key !== 'actionReport'"></vxe-table-column>
            <vxe-table-column title="操作" fixed="right" width="240" :show-overflow="false" v-else :key="item.key" :resizable="false">
              <template v-slot="{ row }">
                <div>
                  <span class="table-span" @click="showDetails({ row })">查看按钮权限</span>
                </div>
              </template>
            </vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-table>
      </div>
    </section>
    <section class="page-footer" v-if="!!tableData.length">
      <div class="page-footer-lf">
        共 {{ maxItems }} 条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="pageIdReport"
          class-name="pages"
          :total="maxItems"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          :page-size="20"
          show-elevator
          show-sizer
          @on-change="doUpdateCurrentPage"
          @on-page-size-change="doUpdatePageSize"
        />
        <Button size="small" @click="goElevatorPage('pageIdReport')">GO</Button>
      </div>
    </section>
    <div>
      <Drawer
        title="查看按钮权限"
        :transfer="false"
        :inner="true"
        v-model="detailShow"
        width="300"
        :mask-style="{left: '8px'}"
      >
        <div class='userdetail'>
          <Row>
            <Col span="8" class="textOverflow"> 用户手机号码 </Col>
            <Col span="16"  class='detail'> {{detailData.mobile}} </Col>
          </Row>
          <Row>
            <Col span="8" class="textOverflow"> 用户姓名 </Col>
            <Col span="16"  class='detail'> {{detailData.userName}} </Col>
          </Row>
          <Row>
            <Col span="8" class="textOverflow"> 岗位权限名称 </Col>
            <Col span="16" class='detail'> {{detailData.roleName}} </Col>
          </Row>
          <Row>
            <Col span="8" class="textOverflow"> 功能菜单 </Col>
            <Col span="16" class='detail'> {{detailData.menuName}} </Col>
          </Row>
        </div>
        <div>
          <div class="userdetail-auth">
            <span>按钮权限</span>
          </div>
          <Tree :data="menuList" children-key="sysMenuList" show-checkbox></Tree>
        </div>
      </Drawer>
    </div>
    <table-config @close="doCloseTable" :drawer="drawer"></table-config>
  </section>
</template>

<script type="text/jsx">
import { saasMixin } from '@/libs/mixins.js'
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import { sortArr, getHeight } from '@/libs/tools.js'
import multiSelect from '_c/multi-select'

export default {
  name: 'report_index',
  components: {
    CommonIcon,
    nodata,
    tableConfig,
    multiSelect
  },
  data () {
    return {
      isXTable: true,
      searchTextUser: { commParams: {} },
      searchTextCom: {},
      searchTextRole: { commParams: {} },
      searchTextSys: {},
      searchTextMenu: {},
      companyFormId: 0,
      companyCodeOrName: '',
      isEnable: 2,
      userMobile: '',
      userEnableList: [
        {
          label: '全部',
          value: 2
        },
        {
          label: '已生效',
          value: 1
        },
        {
          label: '已失效',
          value: 0
        }
      ],
      roleCodeOrName: '',
      typeName: '',
      menuCodeOrName: '',
      menuCode: this.$route.name,
      getTableList: [],
      tableColumns: [],
      mobile: {
        title: '用户手机号码',
        key: 'mobile',
        minWidth: 123
      },
      opreation: {
        title: '操作',
        key: 'actionReport'
      },
      maxItems: 0,
      tableHeight: 0,
      detailShow: false,
      drawer: false,
      loading: false,
      loading2: false,
      isClear: false,
      idList: [],
      userIdList: [],
      roleIdList: [],
      menuIdList: [],
      sysSelectedList: [],
      detailData: [],
      tableData: [],
      menuList: [],
      authList: [],
      tableColumn: [
        {
          title: '用户姓名',
          key: 'userName',
          minWidth: 123
        },
        {
          title: '公司编码',
          key: 'companyCode',
          minWidth: 123
        },
        {
          title: '公司名称',
          key: 'companyName',
          minWidth: 123
        },
        {
          title: '岗位权限编码',
          key: 'roleCode',
          minWidth: 123
        },
        {
          title: '岗位权限名称',
          key: 'roleName',
          minWidth: 123
        },
        {
          title: '子系统名称',
          key: 'typeName',
          minWidth: 123
        },
        {
          title: '功能菜单名称',
          key: 'menuName',
          minWidth: 123
        }
      ],
      formList: [
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
      page: {
        size: 20,
        current: 1
      },
      height: getHeight(126),
      companyParams: {
        companyFormId: '',
        codeOrName: ''
      },
      userParams: {
        isEnable: '',
        commParams: {
          orMatch: ''
        }
      },
      roleParams: {
        commParams: {
          orMatch: ''
        }
      },
      sysParams: {
        typeName: ''
      },
      menuParams: {
        codeOrName: ''
      }
    }
  },
  mixins: [saasMixin],
  methods: {
    searchWordUser (val) {
      this.searchTextUser.commParams.orMatch = val
    },
    searchWordCom (val) {
      this.searchTextCom.codeOrName = val
    },
    searchWordRole (val) {
      this.searchTextRole.commParams.orMatch = val
    },
    searchWordSys (val) {
      this.searchTextSys.typeName = val
    },
    searchWordMenu (val) {
      this.searchTextMenu.codeOrName = val
    },
    doResetCom () {
      this.companyFormId = 0
      this.companyCodeOrName = ''
      this.doSelect()
      this.doSearch()
    },
    doResetUser () {
      this.isEnable = 2
      this.userMobile = ''
      this.doSelectUser()
      this.doSearchUser()
    },
    doResetRole () {
      this.roleCodeOrName = ''
      this.doSearchRole()
    },
    doResetSys () {
      this.typeName = ''
      this.doSearchSys()
    },
    doResetMenu () {
      this.menuCodeOrName = ''
      this.doSearchMenu()
    },
    doSelect () {
      let newValue = this.companyFormId === 0 ? null : this.companyFormId
      this.$set(this.companyParams, 'companyFormId', newValue)
      this.$set(this.companyParams, 'type', true)
    },
    doSelectUser () {
      let newValue = this.isEnable === 2 ? '' : this.isEnable
      this.$set(this.userParams, 'isEnable', newValue)
      this.$set(this.userParams, 'type', true)
    },
    doSearch () {
      this.$set(this.companyParams, 'codeOrName', this.companyCodeOrName)
      this.$set(this.companyParams, 'type', true)
    },
    doSearchUser () {
      this.$set(this.userParams.commParams, 'orMatch', this.userMobile)
      this.$set(this.userParams, 'type', true)
    },
    doSearchRole () {
      this.$set(this.roleParams.commParams, 'orMatch', this.roleCodeOrName)
      this.$set(this.roleParams, 'type', true)
    },
    doSearchSys () {
      this.$set(this.sysParams, 'typeName', this.typeName)
      this.$set(this.sysParams, 'type', true)
    },
    doSearchMenu () {
      this.$set(this.menuParams, 'codeOrName', this.menuCodeOrName)
      this.$set(this.menuParams, 'type', true)
    },
    isCheck (val) {
      this.isClear = val
    },
    // 获取表头
    doGettableHeader () {
      this.loading2 = true
      let req = {
        menuCode: this.menuCode,
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
        isEnterpriseAdmin: 1
      }
      this.isXTable = false
      const that = this
      that.$request.post('/financeback/tableConfig/findList', req).then(res => {
        this.loading2 = false
        that.getTableList = []
        if (res.data.code === 200) {
          let newHeader = []
          if (res.data.data.localConfigList.length === 0) {
            newHeader = res.data.data.globalConfigList
          } else {
            newHeader = res.data.data.localConfigList
          }
          newHeader.forEach((item) => {
            item.key = item.columnName
            if (item.isShow !== 0) {
              that.getTableList.push(item)
            }
          })
          that.tableColumns = sortArr(that.tableColumn, that.getTableList)
          that.tableColumns.push(this.opreation)
          that.tableColumns.unshift(this.mobile)
          this.isXTable = true
        }
      })
    },
    doInit () {
      this.loading = true
      let _reportParams = {
        companyIdList: this.idList,
        userIdList: this.userIdList,
        roleIdList: this.roleIdList,
        sysNameList: this.sysSelectedList,
        menuIdList: this.menuIdList,
        page: this.page
      }
      this.$request.post('/financeback/sysRole/findUserRolePage', _reportParams).then(res => {
        this.loading = false
        let { status, data } = res.data
        if (status === 'success') {
          this.maxItems = data.total
          this.tableData = data.records
          if (this.tableData.length === 0) {
            this.tableHeight = 36
          } else {
            this.tableHeight = this.height + 44
          }
        } else {
          this.tableData = []
          this.maxItems = 0
        }
      })
    },
    recursionList (list1, list2) {
      if (list1.length === 0) { return }
      for (let item of list1) {
        item.title = item.name
        item.disableCheckbox = true
        if (list2.includes(item.menuId)) {
          item.checked = true
        }
        this.recursionList(item.sysMenuList, this.authList)
      }
    },
    showDetails (params) {
      this.detailData = params.row
      this.detailShow = true
      let request = [{
        method: 'POST',
        url: '/financeback/sysMenu/findTree',
        data: { menuParentId: params.row.menuId }
      }, {
        method: 'POST',
        url: '/financeback/sysMenu/findListByCompanyAndUser',
        data: { userId: params.row.userId, companyId: params.row.companyId, roleId: params.row.roleId }
      }]
      this.$request.multipleRequest(request).then(resList => {
        if (resList[0].status === 200 && resList[1].status === 200) {
          this.menuList = resList[0].data.data
          this.authList = resList[1].data.data
          this.recursionList(this.menuList, this.authList)
        }
      })
    },
    handleReset () {
      this.isClear = true
      this.idList = []
      this.userIdList = []
      this.roleIdList = []
      this.sysSelectedList = []
      this.menuIdList = []
    },
    doUpdateCurrentPage (val) {
      this.page.current = val
      this.doInit()
    },
    doUpdatePageSize (val) {
      this.page.size = val
      this.doUpdateCurrentPage(1)
    },
    doSetTable () {
      this.drawer = true
    },
    doCloseTable (msg) {
      if (msg === 'change') {
        this.doGettableHeader()
        this.doInit()
      }
      this.drawer = false
    },
    getUserId (data) {
      this.userIdList = data.map(item => item.userId)
      this.doInit()
    },
    getCompanyId (data) {
      this.idList = data.map(item => item.id)
      this.doInit()
    },
    getRoleId (data) {
      this.roleIdList = data.map(item => item.roleId)
      this.doInit()
    },
    getSysName (data) {
      this.sysSelectedList = data.map(item => item.typeName)
      this.doInit()
    },
    getMenuId (data) {
      this.menuIdList = data.map(item => item.menuId)
      this.doInit()
    }
  },
  created () {
    this.doInit()
    this.doGettableHeader()
  }
}
</script>
<style lang="less" scoped>
  // 抽屉内容对齐方式
  .user-report {
    .userdetail{
      line-height: 1.875rem;
      text-align: right;
      .detail{
        text-align: left;
        padding-left: 1.25rem;
        color: #C9C9C9;
      }
    }
    // 按钮权限样式
    .userdetail-auth {
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      background-color: #f2f2f2;
    }
    // 消除搜索按钮偏移
    .page-content{
      .query-condition{
        .query-condition-lf{
          .screen{
            button{
              margin-right:-0.5rem;
            }
            .select-icon {
              position: absolute;
              top: 16px;
              right: 8px;
              cursor: pointer;
            }
          }
        }
      }
      .page-content-table{
        padding-bottom: 0px !important;
      }
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  }
</style>
<style lang="less">
  @import '../../../assets/css/base.less';
  @import '../../../assets/css/redefine.less';
  .query-conditions {
    .ivu-input-icon-clear {
      right: 32px;
      position: absolute;
    }
  }
</style>
