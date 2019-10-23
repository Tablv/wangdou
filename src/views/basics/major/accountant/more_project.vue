<template>
  <div>
    <Modal
    :transfer="false"
    :closable="false"
    v-model="moreValue"
    @on-cancel="docancle"
    class-name="more-modal large large-modal"
    >
      <div slot="header" class="more-modal-header">
        <Spin fix v-if="isloading">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在导入数据</div>
    </Spin>
        <div class="header-font">更多科目模板</div>
        <div class="header-icon-button">
          <!-- 导入 -->
          <Button class="header-icon-export" @click.native="doClickExport">
            <common-icon type="_export" :size="14"/>
          </Button>
          <!-- 刷新 -->
          <Button class="header-icon-refresh" @click.native="doRefresh">
            <common-icon type="_refresh" :size="14"/>
          </Button>
        </div>
      </div>
      <div class="more-modal-content">
        <div class="more-modal-find">
          <span>选择模板</span>
          <Select v-model="subjectId" clearable class="more-modal-select" @on-change="doGetListTemplate">
            <Option v-for="item in moreList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="more-modal-content-table">
          <Table :columns="moreColumns" :loading="loading" :data="moreData" :max-height="350" :no-data-text="null"></Table>
          <nodata :icon-size="60" notice-text="暂无数据" v-if="moreData.length===0"></nodata>
        </div>
        <div class="page-footer" v-show="moreData.length!==0">
          <div class="page-footer-lf">
            共<strong>{{total}}</strong>条数据
          </div>
          <div class="page-footer-rt">
            <Page
              id="morePageId"
              class-name="pages"
              :total="total"
              :current="current"
              :page-size="size"
              :page-size-opts="[20, 50, 100, 200, 500, 1000]"
              show-elevator
              show-sizer
              @on-page-size-change="changePageSize"
              @on-change="handleChangePage"
              />
            <Button size="small" @click="goElevatorPage('morePageId')" class="more-go">Go</Button>
          </div>
        </div>
      </div>
      <div slot="footer" class="more-modal-footer">
        <button class="box-background more-modal-comfirm" @click="doIntroduct">确定</button>
        <button class="more-modal-cancle" @click="docancle">取消</button>
      </div>
    </Modal>
    <upload-modal @modalClose="doCloseUpload" :isupload="isupload" template-type="account_subject"></upload-modal>
  </div>
</template>

<script>
import nodata from '_c/nodata'
import CommonIcon from '_c/common-icon'
import uploadModal from '_c/uploadModal/uploadModal.vue'
import { saasMixin } from '@/libs/mixins.js'
// import CommonIcon from '_c/common-icon'
export default {
  name: 'more_project',
  props: {
    showMore: {
      default: null,
      type: Boolean
    },
    moreList: {
      default: null,
      type: Array
    },
    isTemplete: {
      default: null,
      type: Boolean
    }
  },
  components: {
    nodata,
    CommonIcon,
    uploadModal
    // CommonIcon
  },
  mixins: [saasMixin],
  data () {
    return {
      isloading: false,
      moreHeight: 36, // 表格高度
      isupload: false, // 导入弹窗
      moreFind: null, // 选择模板
      isHover: false,
      loading: false, // 数据加载
      SubjectId: null,
      subjectId: null,
      // moreValue: true, // 是否显示
      total: 0, // 总条数
      current: 1, // 当前页数
      size: 20, // 当前页面条数
      moreColumns: [// 表格设置
        {
          title: '科目编码',
          key: 'code',
          minWidth: 150,
          renderHeader: (h, { row, index, column }) => {
            return (
              <div>
                <span style="margin-right: 13px;">科目编码</span>
                <Poptip trigger="hover" content="编码次级：4-2-2-2-2-2" class="header-icon" placement="right" transfer>
                  <Icon type="md-help-circle" size="18"/>
                </Poptip >
              </div>
            )
          }
        },
        {
          title: '科目名称',
          key: 'name',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '科目类别',
          key: 'subjectCategoryName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '余额方向',
          key: 'balanceDirection',
          minWidth: 150,
          render: (h, { row, index, column }) => {
            return (
              <div>
                <span v-show = { row.balanceDirection === 0 }>借方</span>
                <span v-show = { row.balanceDirection === 1 }>贷方</span>
              </div>
            )
          },
          tooltip: true
        },
        {
          title: '分类',
          key: 'accountCategoryName',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '辅助核算',
          key: 'auxiliaryNames',
          tooltip: true,
          minWidth: 150
        },
        {
          title: '现金流量预设',
          key: 'cashFlowNames',
          tooltip: true,
          minWidth: 150
        }

      ],
      moreData: [], // 表格数据
      maxLevel: null // 最大次级
    }
  },
  computed: {
    moreValue: {
      get () {
        return this.showMore
      },
      set () {}
    }
  },
  methods: {
    // 监听导入弹窗关闭
    doCloseUpload (msg) {
      this.isupload = false
    },
    // 点击导入按钮
    doClickExport () {
      this.isupload = true
    },
    // 点击确认按钮
    doIntroduct () {
      let req = {
        subjectId: this.subjectId
      }
      this.isloading = true
      this.$request.post('/financeback/accountSubject/addRoot', req).then(res => {
        this.isloading = false
        if (res.data.code === 200) {
          this.moreHeight = 36
          this.doReset()
          this.$emit('moreClose', 1)
        }
      })
    },
    // 点击刷新
    doRefresh () {
      this.doGetListTemplate()
    },
    // 获取模板列表
    doGetListTemplate () {
      if (!this.subjectId) {
        this.moreData = []
        this.total = 0
        this.maxLevel = null
        return false
      }
      let _this = this
      let obj = this.moreList.find(function (item) {
        return item.id === _this.subjectId
      })
      this.maxLevel = obj.maxLevel
      let req = {
        subjectId: this.subjectId,
        page: {
          current: this.current,
          size: this.size
        }
      }
      this.loading = true
      this.$request.post('/financeback/accountSubject/findRootPage', req).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.moreData = res.data.data.records
          this.total = res.data.data.total
          if (this.moreData.length === 0) {
            this.moreHeight = 36
          } else {
            this.moreHeight = 350
          }
        } else {
          this.moreData = []
          this.total = 0
        }
      })
    },
    helpHover () {
      this.isHover = true
    },
    loseHover () {
      this.isHover = false
    },
    // 改变每页条数
    changePageSize (val) {
      this.size = val
      this.doGetListTemplate()
    },
    // 改变页数
    handleChangePage (val) {
      this.current = val
      this.doGetListTemplate()
    },
    // 点击取消按钮
    docancle () {
      this.doReset()
      this.moreHeight = 36
      this.$emit('moreClose', false)
    },
    // 重置
    doReset () {
      this.subjectId = null
      this.moreData = []
      this.total = 0
      this.current = 1
      this.size = 20
    }
    // 分页跳转至第几页
    // doGoElevatorPage (pageId) {
    //   this.goElevatorPage(pageId)
    // }
  }
}
</script>

<style lang="less">
@import '../../../../assets/css/base.less';
@import '../../../../assets/css/forminit.less';
@import '../../../../assets/css/redefine.less';
.more-modal {
  position: absolute;
  left: 8px;
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .ivu-modal {
    position: absolute;
    top: 0;
    width: 100% !important;
    .ivu-modal-content {
      border-radius: 0;
    }
  }
  .ivu-modal-header {
    border: none;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid #e5e5e5;
    .more-modal-header {
      height: 50px;
      border: none;
      .header-font {
        float: left;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #333333;
        text-indent: 16px;

      }
      .header-icon-button {
        float: right;
        height: 50px;
        line-height: 50px;
        margin-right: 16px;
        .header-icon-export {
          margin-right: 3px;
        }
        .header-icon-refresh {
          margin-left: 3px;
        }
      }
    }
  }
  .header-icon { // 表头问号
    width: 10px;
    .ivu-icon {
      margin-left: -5px;
      margin-top: -1px;
      color:#d7d7d7;
      &:hover {
        color: #fa790e;
      }
    }
  }
  .ivu-modal-body {
    margin: 0;
    padding: 0;
    .more-modal-content {
      width: 100%;
      height: 460px;
      margin: 0;
      position: relative;
      .more-modal-find {
        margin-left: 16px;
        height: 65px;
        line-height: 65px;
        font-size: 14px;
        color: #333333;
        span {
          font-size: 12px;
          margin-right: 8px;
        }
        .more-modal-select {
          color: #333333;
          width: 300px;
          height: 32px;
        }
      }
      .more-modal-content-table {
        width: calc(100% - 32px);
        margin: 0 auto;
        overflow: auto;
      }

    }
  }
  .ivu-modal-footer {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 60px;
    text-align: right;
    .more-modal-comfirm {
      outline: none;
      border: none;
      width: 56px;
      height: 32px;
      color: #eef8f7;
      font-size: 12px;
      margin-top: 14px;
      cursor: pointer;
      overflow: hidden;
    }
    .more-modal-cancle {
      outline: none;
      border: none;
      background: none;
      width: 56px;
      height: 32px;
      color: #666666;
      font-size: 12px;
      border: 1px solid #e7e7e7;
      margin-top: 14px;
      margin-right: 16px;
      cursor: pointer;
    }
  }
  // .my_poptip{
  //   .top,.bottom{
  //     text-align: center;
  //   }
  //   .center{
  //     width: 300px;
  //     margin: 10px auto;
  //     overflow: hidden;
  //   }
  //   .center-left{
  //     float: left;
  //   }
  //   .center-right{
  //     float: right;
  //   }
  //   .icon_help{
  //     font-size: 16px;
  //   }
  //   .icon_help_nofocus{
  //     color: #d7d7d7;
  //   }
  //   .icon_help_focus{
  //     color: @warning ;
  //   }
  // }
  .more-go {
    outline: none;
  }
}
</style>
