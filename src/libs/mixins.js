import Vue from 'vue'
import Router from 'vue-router'
import { session } from '@/libs/location'
import store from "@/store"
import iView from 'iview'
import { mapActions, mapMutations } from 'vuex'
Vue.use(Router)
export const saasMixin = {
  data () {
    return {
      listArrId: store.state.app.listArrId[this.$route.name.split('_')[1]],
      num: 0,
      dofilterId: [],
      nofilterId: [],
      tableData: [], // 优化后列表数据数组
      tableYs: null,
      name: this.$route.name,
      modal_typeList: [
        {
          value: 2,
          label: '全部'
        },
        {
          value: 1,
          label: '已生效'
        },
        {
          value: 0,
          label: '已失效'
        }
      ],
      // 会计要素
      accountElementItemList: [],
      // 科目分类
      accountCategoryList: [
        {
          label: '现金科目',
          value: 'A01'
        },
        {
          label: '银行科目',
          value: 'A02'
        },
        {
          label: '现金等价物',
          value: 'A03'
        },
        {
          label: '一般科目',
          value: 'B01'
        },
      ],
      // 科目类别
      subjectCategoryList: [],
      // 可选辅助核算项
      subjectAuxiliaryList: [],
      subjectCategoryListBck: [],
      accountElementItemValue: 'all', // 会计要素绑定值
      subjectCategoryValue: 'all', // 科目类别绑定值
      // 虚拟列表字段
      bars: 0,
      height: 0,
      startIndex: 0,
      endIndex: 0,
      startOffset: 0,
      endOffset: 0
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    ...mapActions([
      'handleTagsOption'
    ]),
    // 监听modal 拖拽
    onMouseUpModal (e) {
      let pageX = parseInt(e.target.offsetParent.style.left)
      let pageY = parseInt(e.target.offsetParent.style.top)
      if (pageX < 0) {
        e.target.offsetParent.style.left = 0
      }
      if (pageY < 0) {
        e.target.offsetParent.style.top = 0
      }
      if (pageX > window.innerWidth - 750) {
        e.target.offsetParent.style.left = (window.innerWidth - 750) + 'px'
      }
      if (pageY > window.innerHeight - 500) {
        e.target.offsetParent.style.top = (window.innerHeight - 500) + 'px'
      }
    },
    // 获取会计科目筛选条件数据来源列表
    doGetSubjectScreenList(id) {
      this.$request.post('/financeback/accountSubject/findSelectionList', { id }).then(res => {
        const { code, data } = res.data
        if (code === 200) {
          this.accountElementItemList = data.accountElementItemList // 会计要素
          this.subjectCategoryList = data.subjectCategoryList // 科目类别
          this.subjectCategoryListBck = data.subjectCategoryList // 备份过滤数据
          this.subjectAuxiliaryList = data.subjectAuxiliaryList
        }
      })
    },
    /**
     * 过滤数据
     */
    doFilterArray (ArrayList, value, field) {
      if (field) {
        if (value) {
          return ArrayList.filter(item => item[field] === value)
        } else {
          return ArrayList.filter(item => item[field])
        }
      } else {
        if (ArrayList[0].elementItemId) {
          return ArrayList.filter(item => item.elementItemId === value)
        } else {
          return ArrayList.filter(item => item.id === value)
        }
      }
    },
    // 会计要素点击事件
    doChangeElementItem (value, callback) {
      console.log(value)
      if (value === 'all') {
        this.subjectCategoryList = this.subjectCategoryListBck
      } else {
        this.subjectCategoryList = this.subjectCategoryListBck.filter(item => item.elementItemId === value)
      }
      if (callback) {  callback() }
    },
    /**
     * 会计类型点击事件
     */
    doChangeCategoryList (value, filed, callback) {
      console.log(value)
      if (value !== 'all' && value) {
        this.accountElementItemValue = this.subjectCategoryListBck.filter(item => item.id === value)[0].elementItemId
        this[filed] = this.subjectCategoryListBck.filter(item => item.id === value)[0].elementItemId
      }
      if (callback) { callback() }
    },
    // 表单页面编辑后，路由里面做标识，关闭页签操作判断提示
    doIdentifying (route, status) {
      let _tagNaveListCopy = JSON.parse(session.getItem('tagNaveListCopy'))
      _tagNaveListCopy.forEach(item => {
        if (item.name === route.name) item.meta.is_edit = status
      })
      session.setItem('tagNaveListCopy', JSON.stringify(_tagNaveListCopy))
    },
    // 路由跳转
    doLocationDetail (name, query, params) {
      let _tagNaveList = JSON.parse(session.getItem('tagNaveList'))
      // 已打开路由
      let _route = {}
      // 即将跳转路由
      let _nextRouteObj = { name, query, params }
      // 判断跳转路由是列表or表单页,找到已打开的路由
      if (name.indexOf('_index') > -1) {
        _route = _tagNaveList.find(n => n.name === name)
      } else {
        let _currentMenu = name.split('_')[1]
        _route = _tagNaveList.find(n => n.name === `create_${_currentMenu}` || n.name === `update_${_currentMenu}`)
      }
      // 判断当前路由是否已打开，如果已打开则调用关闭逻辑
      if (_route) {
        this.closeTag({ route: _route, nextRouteObj: _nextRouteObj })
      } else {
        this.$router.push(_nextRouteObj)
      }
    },
    // go按钮跳转分页
    goElevatorPage (id = 'pageId') {
      let evtObj
      // let thisPage = document.getElementById('pageId')
      let thisPage = document.getElementById(id)
      let pageNumArr = thisPage.getElementsByClassName('ivu-page-item')
      let maxPageNum = Number(pageNumArr[pageNumArr.length - 1].lastChild.innerText)
      let elevatorDiv = thisPage.getElementsByClassName('ivu-page-options-elevator')
      if (elevatorDiv && elevatorDiv.length > 0) {
        let pageInput = elevatorDiv[0].getElementsByTagName('input')[0]
        if (Number(pageInput.value) > maxPageNum) {
          return this.$Message.warning('输入值超过总页数，请重新输入')
        }
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
    },
    // 首条
    doGoFirst(id) {
      // console.log(this.listArrId)
      let _ListId = this.listArrId[0]
      // console.log(_ListId)
      if (_ListId === id) {
        iView.Message.info('当前为首条数据')
        return '当前为首条'
      } else {
        return this.listArrId[0]
      }
    },
    // 上一条
    doGoPrevious (id) {
      let _ListId = this.listArrId
      let _index = _ListId.findIndex(m => m === id)
      if (_index >= 0) {
        if (_index) {
          return _ListId[_index - 1]
        } else {
          iView.Message.info('当前为首条数据')
          return '当前为首条'
        }
      } else {
        console.log(11)
      }
    },
    // 下一条
    doGoNext (id, type) {
      let _ListId = this.listArrId
      let _index = _ListId.findIndex(m => m === id) + 1
      // 判断是否为尾条
      if (_index > _ListId.length - 1) {
        // 判断是否带 delete 参数
        if (type === 'delete') {
          if (_ListId.length === 1) {
            // 用于跳转到新增页
            return '跳转'
          } else {
            // 用于计数删除的个数
            this.num = this.num + 1
            this.dofilterId.push(id)
            this.nofilterId = this.listArrId.filter(val => this.dofilterId.indexOf(val) === -1)
            if (this.num === _ListId.length) {
              return '跳转'
            } else {
              return this.nofilterId[this.nofilterId.length - 1]
            }
            // _ListId.splice(_ListId.findIndex(m => m === id), 1)
            // store.commit('deleteListid', _ListId)
          }
        } else {
          iView.Message.info('当前为末条数据')
          return '当前为末条'
        }
      } else {
        if (type === 'delete') {
          // 删除状态机里面的id
          this.num = this.num + 1
          this.nofilterId = this.listArrId.filter(val => this.dofilterId.indexOf(val) === -1)
          _index = this.nofilterId.findIndex(m => m === id)
          this.dofilterId.push(id)
          if (_index > this.nofilterId.length - 2) {
            if (this.num === _ListId.length) {
              return '跳转'
            } else {
              return this.nofilterId[_index - 1]
            }
          } else {
            if (this.num === _ListId.length) {
              return '跳转'
            } else {
              return this.nofilterId[_index + 1]
            }
          }
        } else {
          return _ListId[_index]
        }
      }
    },
    // 尾条
    doGoEnd(id) {
      let _ListId = this.listArrId[this.listArrId.length - 1]
      if (_ListId === id) {
        iView.Message.info('当前为末条数据')
        return '当前为末条'
      } else {
        return this.listArrId[this.listArrId.length - 1]
      }
    },
    // 封装上下条
    doFindPage(num, id, type) {
      switch (num) {
        case 1:
          return this.doGoFirst(id)
        case 2:
          return this.doGoPrevious(id)
        case 3:
          return this.doGoNext(id, type)
        case 4:
          return this.doGoEnd(id)
        default:
          break;
      }
    },
    // 后续操作
    doContinueActions () {
      console.log(this.continueActions, 'this.continueActions')
      this.doIdentifying(this.$route, false)
      if (this.continueActions.length > 1) {
        if (this.continueActions[1]) {
          const nextRoute = this.continueActions[1]
          this.closeTag({ route: this.$route, nextRouteObj: nextRoute })
        } else {
          this.closeTag({ route: this.$route })
        }
      } else {
        if (this.continueActions[0] === 'closeAll') {
          this.handleTagsOption('all')
        } else if (this.continueActions[0] === 'closeOthers') {
          this.handleTagsOption('others')
        }
      }
    },
    doScrolls(tableY, arr, accountantHeight) {
      // console.log(JSON.stringify(this.tableDatas))
      this.tableYs = tableY
      let scrollTable = document.querySelector('.page-content-table')
      let table = document.querySelector('.account-line')
      let header = document.querySelector('.ivu-table-header')
      if (arr.length < 100) {
        tableY.style.overflowY = 'auto'
        scrollTable.style.overflowY = 'hidden'
        this.tableData = arr
        return false
      }
      table.style.paddingTop = 0 + 'px'
      scrollTable.scrollTop = 0
      this.bars = Math.floor(tableY.clientHeight / 32) // 可视区域渲染条数
      this.height = arr.length * 32 // 所有数据总高度
      this.startIndex = 0 // 起始位置
      this.endIndex = 0 // 结束位置
      this.startOffset = 0 // 这是向上偏移量
      this.endOffset = this.height - tableY.clientHeight // 这是向下偏移量
      this.$nextTick(() => {
        // let tableY = document.querySelector('.ivu-table-overflowY')
        if (tableY) {
          tableY.style.overflowY = 'hidden'
          scrollTable.style.overflowY = 'auto'
          // if (table) {
          table.style.paddingBottom = this.endOffset + 'px'
          scrollTable.addEventListener('scroll', () => {
            this.startOffset = scrollTable.scrollTop + header.clientHeight
            this.endOffset = this.height - this.startOffset - (this.bars * 32)
            this.startIndex = Math.floor(this.startOffset / 32)
            this.endIndex = this.startIndex + this.bars
            this.tableData = arr.slice(this.startIndex, this.endIndex)
            table.style.paddingTop = Math.ceil(this.startOffset) + 'px'
            table.style.paddingBottom = Math.ceil(this.endOffset) + 'px'
          })
        }
      })
    },
    doNewScrolls(tableY) {
      this.tableYs = tableY
      let scrollTable = document.querySelector('.page-content-table')
      let table = document.querySelector('.account-line')
      let header = document.querySelector('.ivu-table-header')
      if (this.tableDatas.length < 101) {
        tableY.style.overflowY = 'auto'
        scrollTable.style.overflowY = 'hidden'
        this.tableData = this.tableDatas
        return false
      }
      table.style.paddingTop = 0 + 'px'
      scrollTable.scrollTop = 0
      this.bars = Math.floor(tableY.clientHeight / 32) // 可视区域渲染条数
      this.height = this.tableDatas.length * 32 // 所有数据总高度
      this.startIndex = 0 // 起始位置
      this.endIndex = 0 // 结束位置
      this.startOffset = 0 // 这是向上偏移量
      this.endOffset = this.height - tableY.clientHeight // 这是向下偏移量
      this.$nextTick(() => {
        // let tableY = document.querySelector('.ivu-table-overflowY')
        if (tableY) {
          tableY.style.overflowY = 'hidden'
          scrollTable.style.overflowY = 'auto'
          // if (table) {
          table.style.paddingBottom = this.endOffset + 'px'
          scrollTable.addEventListener('scroll', () => {
            this.startOffset = scrollTable.scrollTop + header.clientHeight
            this.endOffset = this.height - this.startOffset - (this.bars * 32)
            this.startIndex = Math.floor(this.startOffset / 32)
            this.endIndex = this.startIndex + this.bars
            this.tableData = this.tableDatas.slice(this.startIndex, this.endIndex)
            table.style.paddingTop = Math.ceil(this.startOffset) + 'px'
            table.style.paddingBottom = Math.ceil(this.endOffset) + 'px'
          })
        }
      })
    },
    doChangeRoute(arr, msg) {
      if (!this.tableYs) {
        return false
      }
      let scrollTable = document.querySelector('.page-content-table')
      let table = document.querySelector('.account-line')
      let header = document.querySelector('.ivu-table-header')
      if (msg === 'change') {
        scrollTable.scrollTop = this.startIndex * 32 - header.clientHeight
        this.tableData = arr.slice(this.startIndex, this.endIndex)
        table.style.paddingTop = this.startOffset + 'px'
        table.style.paddingBottom = this.endOffset + 'px'
      } else {
        table.style.paddingTop = 0 + 'px'
        scrollTable.scrollTop = 0
        this.bars = Math.floor(this.tableYs.clientHeight / 32) // 可视区域渲染条数
        this.height = arr.length * 32 // 所有数据总高度
        this.startIndex = 0 // 起始位置
        this.endIndex = 0 // 结束位置
        this.startOffset = 0 // 这是向上偏移量
        this.endOffset = this.height - this.tableYs.clientHeight // 这是向下偏移量
        this.tableYs.style.overflowY = 'hidden'
        scrollTable.style.overflowY = 'auto'
        // if (table) {
        table.style.paddingBottom = this.endOffset + 'px'
        this.startOffset = scrollTable.scrollTop + header.clientHeight
        this.endOffset = this.height - this.startOffset - (this.bars * 32)
        this.startIndex = Math.floor(this.startOffset / 32)
        this.endIndex = this.startIndex + this.bars
        this.tableData = arr.slice(this.startIndex, this.endIndex)
        table.style.paddingTop = this.startOffset + 'px'
        table.style.paddingBottom = this.endOffset + 'px'
      }
    }
  },
  beforeDestroy () {
    let scrollTable = document.querySelector('.page-content-table')
    if (scrollTable) {
      scrollTable.removeEventListener('scroll', () => { })
    }
  },
  computed: {
    continueActions () {
      return this.$store.state.user.actions
    },
    isShowEditModal () {
      return this.$store.state.user.isShowEditModal
    }
  },
  watch: {
    isShowEditModal (value, oldValue) {
      if (value && this.doShowEditModal) {
        console.log(this.doShowEditModal)
        this.doShowEditModal()
      }
    }
  }
}
