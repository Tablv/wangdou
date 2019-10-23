<template>
  <section class="log-page">
    <Spin fix v-if="loading2" style="left: 8px;z-index: 201">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在载入数据</div>
    </Spin>
    <section class="page-header">
      <div class="page-header-name">操作日志查询</div>
      <div class="page-header-actions">
        <Button @click="exportExcel"><common-icon type="_import"/></Button>
        <Button @click="doSetTable"><common-icon type="_table"/></Button>
        <Button @click="doInit"><common-icon type="_refresh"/></Button>
      </div>
    </section>
    <section class="page-content">
      <div class="query-condition">
        <div class="query-condition-lf">
          <Row :gutter='10' class='screen'>
            <Col span="3">
              <DatePicker confirm v-model='startTime' type="datetime"
                          :options="startOption"
                          @on-ok="getStartTime"
                          @on-clickoutside="getStartTime"
                          @on-clear="doClearTime('start')"
                          :editable="false"
                          format="yyyy-MM-dd" placeholder="开始时间"></DatePicker>
            </Col>
            <Col span="3">
              <DatePicker confirm v-model='endTime' type="datetime"
                          :options="endOption"
                          @on-ok="getEndTime"
                          @on-clickoutside="getEndTime"
                          @on-clear="doClearTime('end')"
                          :editable="false"
                          format="yyyy-MM-dd" placeholder="结束时间"></DatePicker>
            </Col>
            <Col span="4">
              <Input v-model="userMobileOrName" clearable @on-enter="doInit" @on-clear="doInit" placeholder="用户手机号码/名称"></Input>
            </Col>
            <Col span='2'>
              <Button @click='handleReset'>重置</Button>
            </Col>
          </Row>
        </div>
      </div>
      <div class="page-content-table">
        <Spin fix v-if="loading" style="z-index: 10;">
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
            <vxe-table-column :field="item.key" :title="item.title" :min-width="item.minWidth" :key="item.key"></vxe-table-column>
          </template>
          <template v-slot:empty>
            <nodata :icon-size="60" notice-text="暂无数据"></nodata>
          </template>
        </vxe-table>
      </div>
      <table-config @close="doCloseTable" :drawer="drawer"></table-config>
    </section>
    <section class="page-footer" v-if="!!tableData.length">
      <div class="page-footer-lf">
        共 {{maxItems}} 条数据
      </div>
      <div class="page-footer-rt">
        <Page
          id="pageIdLog"
          class-name="pages"
          :total="maxItems"
          :page-size-opts="[20, 50, 100, 200, 500, 1000]"
          :page-size="20"
          show-elevator
          show-sizer
          @on-change="doUpdateCurrentPage"
          @on-page-size-change="doUpdatePageSize"
        />
        <Button size="small" @click="goElevatorPage('pageIdLog')">GO</Button>
      </div>
    </section>
    <a id="logId" style="display: none"></a>
  </section>
</template>

<script>
import { saasMixin } from '@/libs/mixins.js'
import CommonIcon from '_c/common-icon'
import nodata from '_c/nodata'
import tableConfig from '_c/tableConfigModal/tableConfig.vue'
import { sortArr, getHeight } from '@/libs/tools.js'

export default {
  name: 'log_index',
  components: {
    CommonIcon,
    nodata,
    tableConfig
  },
  data () {
    return {
      isXTable: true,
      menuCode: this.$route.name, // 菜单编码
      getTableList: [], // 接口获取的表头数组
      tableColumns: [],
      drawer: false,
      loading: false,
      loading2: false,
      userMobileOrName: '',
      currentYearMonth: '',
      startTime: '',
      endTime: '',
      maxItems: 0,
      tableHeight: 0,
      tableData: [],
      tableColumn: [
        {
          title: '子系统',
          key: 'sysName',
          minWidth: 150
        },
        {
          title: '菜单',
          key: 'menuName',
          minWidth: 150
        },
        {
          title: '操作',
          key: 'operation',
          minWidth: 150
        },
        {
          title: '操作时间',
          key: 'createTime',
          minWidth: 160
        },
        {
          title: '手机号码',
          key: 'mobile',
          minWidth: 160
        },
        {
          title: '用户姓名',
          key: 'creatorName',
          minWidth: 160
        },
        {
          title: 'ip地址',
          key: 'ipAddress',
          minWidth: 160
        }
      ],
      logParams: {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId,
        currentYearMonth: this.$dayjs().format('YYYYMM'),
        beginDay: this.$dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endDay: this.$dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        commParams: {
          orMatch: ''
        },
        page: {
          current: 1,
          size: 20
        }
      },
      height: getHeight(126)
    }
  },
  mixins: [saasMixin],
  methods: {
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
          that.isXTable = true
        }
      })
    },
    doInit () {
      this.loading = true
      this.logParams.beginDay = (this.startTime ? this.$dayjs(this.startTime) : this.$dayjs().startOf('month')).format('YYYY-MM-DD HH:mm:ss')
      this.logParams.endDay = (this.endTime ? this.$dayjs(this.endTime) : this.$dayjs()).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.logParams.currentYearMonth = this.currentYearMonth || this.$dayjs().format('YYYYMM')
      this.logParams.commParams.orMatch = this.userMobileOrName
      this.$request.post('/financeback/log/findOperationLogPage', this.logParams).then(res => {
        this.loading = false
        let { status, data } = res.data
        if (status === 'success') {
          this.maxItems = data.total
          data.records.forEach(item => {
            item.createTime = this.$dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
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
    handleReset () {
      this.startTime = ''
      this.endTime = ''
      this.userMobileOrName = ''
      this.currentYearMonth = ''
      this.doInit()
    },
    doClearTime (timeSel) {
      if (timeSel === 'start') {
        this.startTime = ''
        if (this.endTime) {
          this.endTime = this.$dayjs(this.endTime).format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        this.endTime = ''
        if (this.startTime) {
          this.startTime = this.$dayjs(this.startTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      if (!this.startTime && !this.endTime) {
        this.currentYearMonth = ''
      }
      this.doInit()
    },
    getStartTime () {
      if (!this.startTime) { return }
      this.startTime = this.$dayjs(this.startTime).format('YYYY-MM-DD HH:mm:ss')
      this.currentYearMonth = this.$dayjs(this.startTime).format('YYYYMM')
      if (!this.endTime) {
        let maxTime = this.$dayjs(this.startTime).endOf('month').valueOf() < this.$dayjs().valueOf() ? this.$dayjs(this.startTime).endOf('month').valueOf() : this.$dayjs().valueOf()
        this.endTime = this.$dayjs(maxTime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.doInit()
    },
    getEndTime () {
      if (!this.endTime) { return }
      this.endTime = this.$dayjs(this.endTime).endOf('day').format('YYYY-MM-DD HH:mm:ss')
      this.currentYearMonth = this.$dayjs(this.endTime).format('YYYYMM')
      if (!this.startTime) {
        this.startTime = this.$dayjs(this.endTime).startOf('month').format('YYYY-MM-DD HH:mm:ss')
      }
      this.doInit()
    },
    getOption (minTime, maxTime) {
      return !minTime || !maxTime ? {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      } : {
        disabledDate (date) {
          return date.valueOf() < minTime || date.valueOf() > maxTime
        }
      }
    },
    doUpdateCurrentPage (val) {
      this.logParams.page.current = val
      this.doInit()
    },
    doUpdatePageSize (val) {
      this.logParams.page.size = val
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
    exportExcel () {
      let _exportParams = JSON.parse(JSON.stringify(this.logParams))
      delete _exportParams.page
      this.$request.post('/financeback/log/exportExcel', _exportParams, 'blob').then(res => {
        let postfix = res.headers ? res.headers['content-disposition'] ? res.headers['content-disposition'].split('.')[1] : 'xls' : 'xls'
        this.$download(res.data, '操作日志管理', 'logId', postfix)
      })
    }
  },
  computed: {
    endOption () {
      if (!this.startTime) {
        return this.getOption()
      }
      let sTime = this.$dayjs(this.startTime)
      let maxTime = sTime.endOf('month').valueOf() < this.$dayjs().valueOf() ? sTime.endOf('month').valueOf() : this.$dayjs().valueOf()
      return this.getOption(sTime.valueOf(), maxTime)
    },
    startOption () {
      if (!this.endTime) {
        return this.getOption()
      }
      let eTime = this.$dayjs(this.endTime)
      let minTime = eTime.startOf('month').valueOf()
      return this.getOption(minTime, eTime.valueOf())
    }
  },
  created () {
    this.doInit()
    this.doGettableHeader()
  }
}
</script>
<style lang="less" scoped>
  .page-content{
    .page-content-table{
      padding-bottom: 0px !important;
    }
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
<style lang="less">
  @import '../../assets/css/base.less';
  @import '../../assets/css/redefine.less';
.log-page {
  .ivu-col-span-3 {
    width: max-content;
  }
}
</style>
