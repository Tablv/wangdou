const Mixin = {
  data () {
    return {
      tableConfigVisible: false,
      columns: [],
      table_list: [],
      delvision: [],
      total: 0,
      reqS: {},
      requset: {},
      requesting: {},
      del_visible: false, // 删除确认
      del_ids: [], // 删除ids
      current_selection_row: [], // 列表多选选中
      disable_visible: false, // 禁用
      disable_ids: [], // 禁用id
      disableversion: [],
      disable_type: '', // 禁用类型 禁用 or 反禁用
      isUpload: false, // 导入
      batchHandleModal: false, // 成功提示
      checked: '', // 成功提示的check
      batchhandleData: [],
      batchhandleColumns: [
        {
          title: '序号',
          key: 'sort'
        },
        {
          title: '客户名称',
          key: 'customerName'
        },
        {
          title: '说明',
          key: 'desc',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#fa790e'
              }
            }, params.row.desc)
          }
        }
      ],
      is_table_control: false // 禁用、反禁用、删除 是否是表格操作
    }
  },
  mounted () {
    this.handleFindHeaderList()
  },
  methods: {
    doCloseBatchAccount (msg) {
      // 监听授权弹窗关闭
      this.batchHandleModal = msg
    },
    doCloseTableConfig (change) {
      if (change) {
        this.handleFindHeaderList()
        this.handleInitData()
      }
      this.tableConfigVisible = false
    },
    handleFindHeaderList () {
      let _arr = []
      let _obj = {
        rootEnterpriseId: JSON.parse(sessionStorage.getItem('userInfo')).rootEnterpriseId, // 企业id
        menuCode: this.$route.name, // 菜单编码
        isEnterpriseAdmin: 1,
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId // 用户ID
      }
      this.$request.post('/financeback/tableConfig/findList', _obj).then(res => {
        if (res.data.code === 200) {
          let _data = res.data.data
          if (_data.localConfigList.length) {
            _arr = _data.localConfigList
          } else {
            _arr = _data.globalConfigList
          }
          _arr.forEach((item) => {
            item.key = item.columnName
          })
          _arr = _arr.filter(item => item.isShow)
          this.columns = this.$sortArr(this.column, _arr, 'key')
          this.columns.unshift(this.column[1])
          this.columns.unshift(this.column[0])
          this.columns.push(this.column[this.column.length - 1])
        }
      })
    },
    // 导入
    doOpenImport () {
      this.isUpload = true
    },
    // 导出
    doOpenExport () {
      if (this.$route.name === 'client_index') {
        this.requesting = {
          ...this.params,
          isEnable: this.params.isEnable === 9 ? '' : this.params.isEnable,
          customerType: this.params.customerType === 9 ? '' : this.params.customerType,
          isInternalCustomer: this.params.isInternalCustomer === 9 ? '' : this.params.isInternalCustomer
        }
      } else {
        this.requesting = {
          ...this.params,
          isEnable: this.params.isEnable === 9 ? '' : this.params.isEnable,
          supplierType: this.params.supplierType === 9 ? '' : this.params.supplierType,
          isInternalSupplier: this.params.isInternalSupplier === 9 ? '' : this.params.isInternalSupplier
        }
      }
      this.$request.post('financeback/customerSupplier/exportExcel', this.requesting, 'blob').then(res => {
        this.$download(res.data, this.$route.name)
      })
    },
    // 反禁用
    handleDisableRow (row) {
      this.disable_type = row.isEnable
      this.disable_ids = []
      this.disableversion = []
      this.disable_ids.push(row.id)
      this.disableversion.push(row.version)
      this.is_table_control = true
      this.disable_visible = true
    },
    // 禁用
    handleDisable () {
      let _url = ''
      if (this.disable_type === 1) {
        _url = 'financeback/customerSupplier/disableCustomerSupplierByIds' // 禁用
      } else {
        _url = 'financeback/customerSupplier/enableCustomerSupplierByIds' // 启用
      }
      if (this.$route.name === 'client_index') {
        this.reqS = {
          idS: this.disable_ids,
          versions: this.disableversion,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.reqS = {
          idS: this.disable_ids,
          versions: this.disableversion,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.$request.post(_url, this.reqS).then(res => {
        if (res.data.code === 200) {
          this.disable_ids = []
          this.disableversion = []
          // if (!this.is_table_control) {
          //   this.$Message.success('操作成功')
          //   this.disable_ids = []
          //   this.disableversion = []
          // } else {
          let _data = res.data.data
          this.checked = `操作成功${_data.successList.length}条,失败${_data.failList.length}条`
          let _arr = []
          _data.failList.map(tmp => {
            this.table_list.map(item => {
              if (tmp.businessId === item.id) {
                _arr.push({
                  sort: item.id,
                  customerName: item.name,
                  desc: tmp.referenceDescription
                })
              }
            })
          })
          this.batchhandleData = _arr
          this.batchHandleModal = true
          this.disable_ids = []
          this.disableversion = []
          // }
          this.handleInitData()
          this.handleCancelDisable()
        } else {
          this.$Message.warning('操作失败！')
          this.disable_ids = []
          this.disableversion = []
        }
      })
    },
    // 取消禁用
    handleCancelDisable () {
      this.current_selection_row = []
      this.disable_ids = []
      this.disableversion = []
      this.disable_type = ''
      this.disable_visible = false
      // this.$refs['client_selection'].selectAll(false)
      this.$refs['client_selection'].clearAll()
    },
    // 删除
    handleDelRow (row) {
      this.del_ids = []
      this.delvision = []
      this.disableversion = []
      this.delvision.push(row.version)
      this.del_ids.push(row.id)
      this.is_table_control = false
      this.del_visible = true
    },
    // 多选表格项
    handleSelectRow ({ selection }) {
      this.current_selection_row = selection
    },
    // 点击批量禁用
    handleStartDis (type) {
      this.is_table_control = false
      if (!this.current_selection_row.length) {
        this.$Message.warning('请选择至少一行数据后再操作')
        return false
      }
      this.disable_type = type
      this.current_selection_row.map(item => {
        // this.disable_ids = []
        this.disable_ids.push(item.id)
        // this.disableversion = []
        this.disableversion.push(item.version)
      })
      this.disable_visible = true
    },
    // 点击批量删除
    handleStartDel () {
      if (!this.current_selection_row.length) {
        this.$Message.warning('请选择至少一行数据后再操作')
        return false
      }
      this.current_selection_row.map(item => {
        this.del_ids.push(item.id)
        this.delvision.push(item.version)
      })
      this.is_table_control = true
      this.del_visible = true
    },
    // 删除
    handleDeleteData () {
      this.doContinueActions()
      if (this.$route.name === 'client_index') {
        this.requset = {
          idS: this.del_ids,
          versions: this.delvision,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.requset = {
          idS: this.del_ids,
          versions: this.delvision,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.$request.post('/financeback/customerSupplier/deleteCustomerSupplierByIds', this.requset).then(res => {
        if (res.data.code === 200) {
          if (this.is_table_control) {
            let _data = res.data.data
            this.batchHandleModal = true
            this.checked = `删除成功${_data.successList.length}条,失败${_data.failList.length}条`
            let _arr = []
            _data.failList.map(tmp => {
              this.table_list.map(item => {
                if (tmp.businessId === item.id) {
                  _arr.push({
                    sort: item.id,
                    customerName: item.name,
                    desc: tmp.referenceDescription
                  })
                }
              })
            })
            this.batchhandleData = _arr
          } else if (res.data.data && res.data.data.failList[0] && res.data.data.failList && res.data.data.failList[0].referenceDescription) {
            this.$Message.success(res.data.data.failList[0].referenceDescription)
          } else {
            this.$Message.success('删除成功')
          }
          if (this.current_selection_row.length >= this.table_list.length) {
            if (this.params.page.current > 1) {
              this.params.page.current--
            }
          }
          this.handleCancelDelete()
          this.handleInitData()
        } else {
          this.$Message.warning('删除失败！')
        }
      })
    },
    // 取消删除
    handleCancelDelete () {
      this.doContinueActions()
      this.del_ids = []
      this.delvision = []
      this.current_selection_row = []
      // this.$refs['client_selection'].selectAll(false)
      this.$refs['client_selection'].clearAll()
      this.del_visible = false
    },
    // change current page
    handleChangePage (current) {
      this.params.page.current = current
      this.handleCancelDelete()
      this.handleInitData()
    },
    // change page size
    handleChangePageSize (size) {
      this.params.page.size = size
      this.handleCancelDelete()
      this.handleInitData()
    }
  }
}
export default Mixin
