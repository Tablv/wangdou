<template>
<div class="table-config">
  <Drawer @on-close="doVisibleChange" :transfer="false" :inner="true" :mask-style="{left: '9px'}" title="表格配置" class="drawer" v-model="isTable" width="300" :mask-closable="false" :styles="styles">
    <div class="table-config-header">
      <div class="table-config-header-left">是否显示</div>
      <div class="table-config-header-right">显示顺序</div>
    </div>
    <ul class="table-config-ul">
      <!-- v-show ="item.isShow == 1" -->
      <li class="table-config-ul-li" v-for="(item, index) in tableArray" :key="index"
      :class="number === index ? 'table-config-ul-li-native' : 'table-config-ul-li'"
      @mouseover="mouseOver(index)" @mouseleave="mouseLeave">
        <div :class="item.selection ? 'table-ul-li-left-active textBtn' : 'table-ul-li-left'">
          <!-- v-model="tableSort[index]" :disabled="item.disable" item.isDisabled || -->
          <Checkbox :disabled="!item.isEdit" v-model="tableSort[index]" @on-change="changeSort(index, $event)">{{item.columnRemark}}</Checkbox>
        </div>
        <!-- v-show="number === index" -->
        <div class="table-ul-li-right" v-show="!item.isDisabled && number === index">
          <common-icon type="_xiangshang" class="right-upper" v-if="item.isEdit ? true : false" @click.native="doClickSortUp(index, item)"></common-icon>
          <common-icon type="_xiangxia" class="right-lower" v-if="item.isEdit ? true : false" @click.native="doClickSortDown(0, index)"></common-icon>
        </div>
      </li>
    </ul>
    <div class="demo-drawer-footer">
      <Button type="primary" @click="doModify" class="confirm-btn">确认</Button>
      <Button @click="doClickClose" class="cancle-btn">取消</Button>
    </div>
  </Drawer>
</div>
</template>
<script>
import CommonIcon from '_c/common-icon'
export default {
  components: {
    CommonIcon
  },
  props: {
    drawer: {
      default: false,
      type: Boolean
    }
    // initCloumsList: {
    //   default: [],
    //   type: () => []
    // }
  },
  data () {
    return {
      number: -1, // 下标
      menuCode: this.$route.name, // 菜单编码
      styles: {
        height: 'calc(100% - 120px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'static',
        fontSize: '16px',
        fontFamily: 'PingFangSC-Medium'
      },
      tableArray: [],
      tableSort: [],
      updateFlag: false // 是否修改过
    }
  },
  computed: {
    isTable: {
      get () {
        return this.drawer
      },
      set () {

      }
    }
  },
  watch: {
    drawer () {
      this.dogetTableInfo()
    }
  },
  // mounted () {
  //   this.dogetTableInfo(() => {
  //     console.log(this.initCloumsList)
  //   })
  // },
  methods: {
    mouseOver (index) {
      this.number = index
    },
    mouseLeave () {
      this.number = -1
    },
    changeSort (index, msg) {
      this.updateFlag = true
      let sort = 0
      if (msg) {
        sort = 1
      } else {
        sort = 0
      }
      this.tableArray[index].isShow = sort
    },
    // 点击确认按钮
    doModify () {
      this.tableArray.forEach((item, index) => {
        this.tableArray[index].sortNum = index
        // console.log(this.tableArray[index].sortNum)
      })
      let req = {
        tableConfigQueryDto: {
          rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
          menuCode: this.menuCode, // 菜单编码
          userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
          updateFlag: this.updateFlag,
          isEnterpriseAdmin: 1
        },
        tabColumnDtoList: this.tableArray
      }
      const that = this
      that.$request.post('/financeback/tableConfig/batchUpdate', req).then(res => {
        if (res.data.code === 200) {
          this.updateFlag = false
          this.$emit('close', 'change')
        }
      })
    },
    // 获取表头数据
    dogetTableInfo (callback) {
      let req = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.menuCode, // 菜单编码
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId, // 用户ID
        isEnterpriseAdmin: 1
      }
      const that = this
      that.$request.post('/financeback/tableConfig/findList', req).then(res => {
        that.tableArray = []
        if (res.data.code === 200) {
          if (res.data.data.localConfigList.length === 0) {
            if (callback) { callback() }
            res.data.data.globalConfigList.forEach((item) => {
              if (that.menuCode === 'book_index') {
                // item.columnName !== 'code' && item.columnName !== 'mobile' &&
                // if (item.columnName === 'code' || item.columnName === 'mobile') {
                //   item.isShow = 1
                //   item.isDisabled = true
                // } else {
                //   item.isDisabled = false
                // }
                if (item.columnName !== 'name') {
                  that.tableArray.push(item)
                }
              } else {
                // if (item.columnName === 'code' || item.columnName === 'mobile') {
                //   item.isShow = 1
                //   item.isDisabled = true
                // } else {
                //   item.isDisabled = false
                // }
                that.tableArray.push(item)
              }
            })
            // that.tableArray = res.data.data.globalConfigList
            for (let i = 0; i < that.tableArray.length; i++) {
              // that.tableSort[i] = true
              // that.tableArray[i].isShow = 1
              if (that.tableArray[i].isShow === 1) {
                that.tableSort[i] = true
              } else {
                that.tableSort[i] = false
              }
            }
            this.updateFlag = true
          } else {
            res.data.data.localConfigList.forEach((item) => {
              if (that.menuCode === 'book_index') {
                // item.columnName !== 'code' && item.columnName !== 'mobile' &&
                // if (item.columnName === 'code' || item.columnName === 'mobile') {
                //   item.isShow = 1
                //   item.isDisabled = true
                // } else {
                //   item.isDisabled = false
                // }
                if (item.columnName !== 'name') {
                  that.tableArray.push(item)
                }
              } else {
                // if (item.columnName === 'code' || item.columnName === 'mobile') {
                //   item.isShow = 1
                //   item.isDisabled = true
                // } else {
                //   item.isDisabled = false
                // }
                that.tableArray.push(item)
              }
              // if (item.columnName !== 'code' && item.columnName !== 'mobile') {
              //   that.tableArray.push(item)
              // }
            })
            // that.tableArray = res.data.data.localConfigList
            for (let i = 0; i < that.tableArray.length; i++) {
              if (that.tableArray[i].isShow === 0) {
                that.tableSort[i] = false
              } else {
                that.tableSort[i] = true
              }
            }
          }
        }
      })
    },
    doVisibleChange () {
      this.tableArray = []
      this.tableSort = []
      this.updateFlag = false
      this.$emit('close', false)
    },
    // 点击取消
    doClickClose () {
      this.tableArray = []
      this.tableSort = []
      this.updateFlag = false
      this.$emit('close', false)
    },
    swapItems (arr, index1, index2, direction) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0]
      return arr
    },
    // 点击向上排序
    doClickSortUp (index) {
      this.updateFlag = true
      // let arr = this.tableArray
      if (index === 0) {
        return
      }
      let number = index - 1
      if (this.tableArray[number].columnName === 'code' || this.tableArray[number].columnName === 'mobile') {
        return
      }
      this.tableSort = this.swapItems(this.tableSort, index, index - 1)
      // this.sub = index - 1
      this.tableArray = this.swapItems(this.tableArray, index, index - 1)
    },
    // 点击向下排序
    doClickSortDown (msg, index) {
      this.updateFlag = true
      if (index === this.tableArray.length - 1) {
        return
      }
      this.tableSort = this.swapItems(this.tableSort, index, index + 1)
      this.swapItems(this.tableArray, index, index + 1)
    }
  }
}
</script>
<style lang="less">
@import './tableConfig.less';
</style>
