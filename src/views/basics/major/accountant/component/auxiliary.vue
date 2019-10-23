// 新增会计科目辅助核算
<template>
  <div class="auxiliary">
    <Table border draggable
    v-if="isMounted"
    :columns="auxiliaryColums"
    @on-drag-drop="doChangeIndex"
    :data="auxiliaryData"
    :no-data-text="null"
    :class="auxiliaryData.length ? 'auxiliary-table' : 'tableHeight'">
    </Table>
    <nodata :icon-size="60" notice-text="暂无数据" v-if="auxiliaryData.length===0"></nodata>
  </div>
</template>
<script>
import nodata from '_c/nodata'
import { saasMixin } from '@/libs/mixins.js'
import { mapMutations } from 'vuex'
export default {
  components: {
    nodata
  },
  mixins: [saasMixin],
  props: {
    auxiliary: {
      type: Array
    },
    isInterior: {
      type: Number,
      default: 1
    },
    isSpecial: {
      type: Boolean
    }
  },
  data () {
    return {
      dataBck: [],
      isChanged: false,
      isResh: false,
      isMounted: false,
      auxiliaryColums: [ // 表格配置
        {
          type: 'index',
          width: 40,
          align: 'left',
          multiple: true,
          title: '序号'
        },
        {
          title: '编码',
          key: 'code',
          minWidth: 100
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 100
        },
        {
          title: '使用',
          minWidth: 100,
          render: (h, { row, index }) => {
            return h('i-switch', { // 数据库1是已处理，0是未处理
              props: {
                type: 'primary',
                value: row.ifUsed > 0, // 1 启用 0 未启用
                disabled: this.isSpecial
              },
              style: {
                marginRight: '5px'
              },
              on: {
                'on-change': (value) => { // 触发事件是on-change,用双引号括起来，
                  this.doEnable({ row, index, value }) // params.index是拿到table的行序列，可以取到对应的表格值
                }
              }
            })
          }
        },
        {
          title: '操作',
          minWidth: 100,
          align: 'center',
          render: (h) => (<div>
            <Poptip trigger="hover" content="移动">
              <Icon type="md-menu" class="tableline-move" />
            </Poptip >
          </div>)
        }
      ],
      auxiliaryCodes: '', // 辅助核算编码拼接
      auxiliaryNames: '', // 辅助核算名称拼接
      auxiliarySources: '', // 辅助核算值来源拼接（暂时不传）
      auxiliarySourceTables: '', // 辅助核算值来源表拼接
      auxiliaryDependents: '', // 辅助核算值依赖拼接（暂时不传）
      auxiliaryData: [], // 辅助核算数组
      auxiliarySourcesList: [
        {
          value: 0,
          label: '平台'
        },
        {
          value: 1,
          label: '自定义辅助核算'
        }
      ], // 值来源数组
      auxiliaryDependentsList: [
        {
          value: 1,
          label: '值依赖测试1'
        },
        {
          value: 2,
          label: '值依赖测试2'
        }
      ] // 值依赖数组
    }
  },
  mounted () {
    if (!this.$route.query.cid) {
      this.doGetLists()
    }
  },
  watch: {
    isResh () {
      this.doGetLists()
    },
    isChanged () {
      this.$emit('getChangeInfo', this.isChanged)
    },
    auxiliary () {
      // this.auxiliaryData = this.auxiliary
      this.dataBck = this.auxiliary
      this.isMounted = true
    },
    isInterior (val) {
      console.log('内部共享' + val)
      if (!val) {
        this.auxiliaryData = this.dataBck.filter(item => item.code !== '00005')
      } else {
        this.auxiliaryData = this.dataBck
      }
    },
    isSpecial (val) {
      console.log('isSpecial' + val)
    }
  },
  methods: {
    ...mapMutations([
      'addIdToList'
    ]),
    /**
     * 互换位置 移动方法
     * start 初始索引
     * end 结束位置
     */
    doChangeIndex (start, end) {
      // 初始位置是启用状态的才可以重置
      let startItem = this.auxiliaryData[start]
      if (startItem.ifUsed) {
        let endItem = this.auxiliaryData[end]
        // 判断结束位置是不是启用状态
        if (endItem.ifUsed) {
          // 如果是启用状态，互换位置
          this.auxiliaryData.splice(end, 1, startItem)
          this.auxiliaryData.splice(start, 1, endItem)
        } else {
          // 定义结束索引
          let overIndex = start
          // 自上向下切换
          if (start < end) {
            for (let index = parseInt(end); index > start; index--) {
              let element = this.auxiliaryData[index]
              if (element.ifUsed) {
                overIndex = index
                break
              }
            }
          }
          // 自下向上切换
          if (start > end) {
            for (let index = parseInt(end) + 1; index < start; index++) {
              let element = this.auxiliaryData[index]
              if (element.ifUsed) {
                overIndex = index
                break
              }
            }
          }
          // 定义结束切换记录
          let endItem = this.auxiliaryData[overIndex]
          this.auxiliaryData.splice(overIndex, 1, startItem)
          this.auxiliaryData.splice(start, 1, endItem)
        }
      }
    },
    /**
     * 请求辅助核算列表数据
     */
    doGetLists () {
      let subjectId = this.$route.query.subjectId
      this.$request.post('/financeback/accountSubject/findSubjectAuxiliaryList', { subjectId: subjectId }).then(({ data }) => {
        this.isMounted = true
        if (data.code === 200) {
          if (this.isInterior) {
            this.dataBck = data.data
            this.auxiliaryData = data.data
          } else {
            this.dataBck = data.data
            this.auxiliaryData = data.data.filter(item => item.code !== '00005')
          }
        } else {
          this.auxiliaryData = []
          this.total = 0
        }
      })
    },
    /**
     * 启用方法
     */
    doEnable ({ row, index, value }) {
      this.isChanged = true
      // 修改内容
      this.auxiliaryData[index].ifUsed = value
      let enableList = this.auxiliaryData.filter(item => item.ifUsed)
      // 辅助核算编码拼接
      this.auxiliaryCodes = enableList.map(item => item.code).join(',')
      // 辅助核算名称拼接
      this.auxiliaryNames = enableList.map(item => item.name).join(',')
      // 辅助核算值来源表拼接
      this.auxiliarySourceTables = enableList.map(item => item.sourceTable).join(',')
    },
    /**
     * 值来源改变
     */
    doAuxiliarySourcesChange ({ row, index, item }) {
      this.isChanged = true
      this.auxiliaryData[index].sourceValue = item ? item.value : ''
      this.auxiliaryData[index].sourceName = item ? item.label : ''
      let enableList = this.auxiliaryData.filter(item => item.ifUsed)
      // 辅助核算值来源拼接（暂时不传）
      this.auxiliarySources = enableList.map(item => item.sourceName).join(',')
    },
    /**
     * 值依赖改变
     */
    doAuxiliaryDependentsChange ({ row, index, item }) {
      this.isChanged = true
      this.auxiliaryData[index].dependentsValue = item ? item.value : ''
      this.auxiliaryData[index].dependentsName = item ? item.label : ''
      let enableList = this.auxiliaryData.filter(item => item.ifUsed)
      // 辅助核算值来源拼接（暂时不传）
      this.auxiliaryDependents = enableList.map(item => item.dependentsName).join(',')
    }
  }

}
</script>
<style lang="less">
.auxiliary {
  margin-top: 22px;
  margin-left: 16px;
  .auxiliary-table {
    margin-top: 7px;
    text-indent: 5px;
    overflow: inherit;
  }
  .tableHeight {
    height: 360px;
    margin-top: 7px;
  }
  .ivu-select-selection {
    border: none;
  }
  .ivu-table-cell {
    padding: 0 !important;
    margin: 0;
  }
  th.ivu-table-column-left {
    padding-left: 5px;
  }
  th {
    padding-left: 5px;
  }
  .tableline-move {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
