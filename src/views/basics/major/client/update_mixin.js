export default {
  data () {
    return {
      reminderModal: false, // 提示
      reqs: {},
      reqS: {},
      requset: {},
      del_visible: false, // 删除
      isLoading: false,
      can_use: false,
      disable_type: '', // 禁用 or 反禁用
      current_row: '',
      is_inside: false, // 是否内部客户或供应商
      select_loading: false, // 远程搜索loading
      select_company_visible: false,
      edit_visible: false,
      type_list: [{
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
      table_config: {
        type: 'company', // 单选类型,在columns.js 文件里定义好
        title: '选择公司',
        width: '300px', // 组件宽度
        refresh: false, // 数据刷新操作，有重置时可传，传值就是取反就行，让组件监听数据改变就会刷新
        request_params: { // 请求参数，数据分页必传!
          // companyFormId: 0,
          menuCode: this.$route.name,
          isEnterpriseAdmin: 1,
          codeOrName: ''
        }
      },
      form_changed: false
    }
  },
  watch: {
    form_changed (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  mounted () {
    let _id = this.$route.query && this.$route.query.id
    this.getCurrentInfo(_id)
  },
  methods: {
    // 选择归属公司
    handleGetCompany (item) {
      this.create_form.companyName = item.companyName
      this.create_form.companyId = item.companyId
      this.form_changed = true
    },
    // 打开删除操作
    handleConfirmDel () {
      let that = this
      // if (that.form_changed) {
      //   that.$Control({
      //     title: '消息提示',
      //     type: 'control',
      //     message: '当前数据已修改，需要保存吗？',
      //     yes () {
      //       that.handleSaveInfo()
      //       that.$CloseCtl()
      //       that.del_visible = true
      //     },
      //     no () {
      //       that.$CloseCtl()
      //       for (let key in that.create_form) {
      //         that.create_form[key] = that.current_row[key]
      //       }
      //       that.handleSyncInternalCustomer(that.current_row.isInternalCustomer)
      //       that.form_changed = false
      //       that.del_visible = true
      //     },
      //     cancel () {
      //       that.$CloseCtl()
      //     }
      //   })
      // } else {
      that.del_visible = true
      // }
    },
    // 监听客户类型改变
    handleChangeCustomerType (val) {
      this.handleChangeInfo()
      if (parseInt(val) === 1) {
        this.can_use = true
        this.create_form.unifiedSocialCreditCode = ''
      } else {
        this.can_use = false
        this.create_form.idCardNum = ''
      }
    },
    // 确定选择归属公司
    handleSelectCompany (data) {
      if (data) {
        this.create_form.companyId = data.id
        this.create_form.companyName = data.name
        if (this.create_form.companyName !== '集团') {
          this.create_form.dataTypes = 3
        } else {
          this.create_form.dataTypes = 1
        }
        this.form_changed = true
      }
      this.select_company_visible = false
    },
    handleSaveInfo (type) {
      if (this.create_form.companyName === '' || this.create_form.companyName === null) {
        this.$Message.warning('请选择创建公司！')
        this.edit_visible = false
        return false
      }
      if (this.create_form.customerType === '') {
        this.$Message.warning('请选择客户类型！')
        this.edit_visible = false
        return false
      }
      if (!this.create_form.name) {
        this.$Message.warning('请填写客户名称！')
        this.edit_visible = false
        return false
      }
      if (!/^(\d|[a-zA-Z]|[\u4e00-\u9fa5]){1,50}$/.test(this.create_form.name)) {
        this.$Message.warning('客户名称格式不正确！')
        return false
      }
      if (this.create_form.unifiedSocialCreditCode) {
        if (!/^(\d|[a-zABCDEFGHJKLMNPQRTUWXY]){18}$/.test(this.create_form.unifiedSocialCreditCode)) {
          this.$Message.warning('统一社会信用代码格式为:18位数字或英文字母，不含大写字母IOZSV')
          return false
        }
      }
      if (this.create_form.contactNumber) {
        if (!/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
          this.$Message.warning('手机号码格式不正确！')
          return false
        }
      }
      // if (this.create_form.idCardNum !== '' && this.create_form.idCardNum.length < 18) {
      //   this.$Message.warning('身份证号格式不正确！')
      //   return false
      // }
      if (this.create_form.idCardNum) {
        if (!/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
          this.$Message.warning('身份证号格式不正确！')
          return false
        }
      }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,20}$/.test(this.create_form.linkman)) {
      //   this.$Message.warning('联系人格式不正确！')
      //   return false
      // }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,200}$/.test(this.create_form.businessAddress)) {
      //   this.$Message.warning('经营地址格式不正确！')
      //   return false
      // }
      // http://192.168.1.167:8183
      if (this.$route.name === 'update_client') {
        this.reqs = {
          ...this.create_form,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.reqs = {
          ...this.create_form,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.$request.post('/financeback/customerSupplier/updateCustomerSupplierById', this.reqs
      ).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('保存成功！')
          this.form_changed = false
          this.edit_visible = false
          // if (!type) {
          let _id = this.$route.query && this.$route.query.id
          this.getCurrentInfo(_id)
          // }
        } else {
          this.$Message.warning('保存失败！')
        }
      })
    },
    // 判断表单是否有改动
    handleUpdateInfo () {
      if (this.form_changed) {
        this.cancleboxModel = true
      }
    },
    // change 归属公司
    handleChangeInfo () {
      this.form_changed = true
    },
    // 新增是
    handleNewYes () {
      this.handleSaveInfo()
      this.reminderModal = false
      this.doContinueActions()
    },
    // 取消
    handleConfirmCancel () {
      for (let key in this.create_form) {
        this.create_form[key] = this.current_row[key]
      }
      this.handleSyncInternalCustomer(this.current_row.isInternalCustomer)
      this.form_changed = false
      this.reminderModal = false
      this.doContinueActions()
    },
    doShowEditModal (type) {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前页面数据已发生变化，是否保存在继续`,
        yes () {
          that.handleSaveInfo('no-found')
          that.$CloseCtl()
          that.disable_visible = type === 'disable'
        },
        no () {
          for (let key in that.create_form) {
            that.create_form[key] = that.current_row[key]
          }
          that.handleSyncInternalCustomer(that.current_row.isInternalCustomer)
          that.form_changed = false
          that.$CloseCtl()
          that.doContinueActions()
          that.disable_visible = type === 'disable'
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 点击批量禁用
    handleStartDis (type) {
      this.disable_type = type
      // if (this.form_changed) {
      //   this.doShowEditModal('disable')
      // } else {
      this.disable_visible = true
      // }
    },
    // 禁用
    doDisable (typed) {
      let idS = []
      let versions = []
      versions.push(this.current_row.version)
      let _url = ''
      idS.push(this.current_row.id)
      // 禁用1 反禁用0
      if (typed === 1) {
        _url = '/financeback/customerSupplier/disableCustomerSupplierByIds'
      } else {
        _url = '/financeback/customerSupplier/enableCustomerSupplierByIds'
      }
      // 根据路由控制是客户还是供应商来的
      if (this.$route.name === 'update_client') {
        this.reqS = {
          idS,
          versions,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.reqS = {
          idS,
          versions,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.$request.post(_url, this.reqS).then(res => {
        if (res.data.code === 200) {
          if (typed === 1 && res.data.data && res.data.data.successList && res.data.data.successList.length !== 0) {
            this.create_form.isEnable = 0
          } else {
            this.create_form.isEnable = 1
          }
          if (res.data.data && res.data.data.failList && res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            return false
          } else {
            this.$Message.success('操作成功！')
          }
          // this.$Message.success('操作成功！')
          this.disable_visible = false
          // this.getCurrentInfo(this.current_row.id)
          this.doContinueActions()
        } else {
          this.$Message.warning('操作失败！')
        }
      })
    },
    // 删除
    doDelete () {
      let idS = []
      let versions = []
      versions.push(this.current_row.version)
      idS.push(this.current_row.id)
      if (this.$route.name === 'update_client') {
        this.requset = {
          idS,
          versions,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.requset = {
          idS,
          versions,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.$request.post('/financeback/customerSupplier/deleteCustomerSupplierByIds', this.requset).then(res => {
        if (res.data.code === 200) {
          if (res.data.data && res.data.data.failList && res.data.data.failList.length !== 0) {
            this.$Message.warning(res.data.data.failList[0].referenceDescription)
            this.del_visible = false
            this.form_changed = false
            this.handleDelSkip()
            return false
          } else {
            this.$Message.success('删除成功！')
          }
          this.del_visible = false
          this.form_changed = false
          this.handleDelSkip()
        } else {
          this.$Message.warning('删除失败！')
          this.form_changed = false
        }
      })
    },
    // 删除后跳转
    handleDelSkip () {
      let _prev = this.doFindPage(3, this.current_row.id)
      if (_prev === '当前为末条') {
        let _next = this.doFindPage(2, this.current_row.id)
        if (_next === '当前为首条') {
          return false
        } else if (_next === '跳转') {
          setTimeout(() => {
            this.$Message.info('查看页面暂无数据，3秒后跳转到列表页')
          }, 1000)
          let _name = this.$route.name === 'update_supplier' ? 'supplier_index' : 'client_index'
          setTimeout(() => {
            this.$router.push({ name: _name })
          }, 3000)
        }
        this.getCurrentInfo(_next)
      } else {
        this.getCurrentInfo(_prev)
      }
    },
    // 翻页
    handlePageLocation (type) {
      switch (type) {
        case 'first':
          let _first = this.doFindPage(1, this.current_row.id)
          if (_first === '当前为首条') {
            return false
          }
          this.getCurrentInfo(_first)
          break
        case 'prev':
          let _prev = this.doFindPage(2, this.current_row.id)
          if (_prev === '当前为首条') {
            return false
          }
          this.getCurrentInfo(_prev)
          break
        case 'next':
          let _next = this.doFindPage(3, this.current_row.id)
          if (_next === '当前为末条') {
            return false
          }
          this.getCurrentInfo(_next)
          break
        case 'last':
          let _last = this.doFindPage(4, this.current_row.id)
          if (_last === '当前为末条') {
            return false
          }
          this.getCurrentInfo(_last)
          break
      }
    },
    // 打开选择归属公司
    handleOpenSel () {
      this.select_company_visible = true
    },
    // 同步isInternalCustomer 0 否 1 是
    handleSyncInternalCustomer (val) {
      this.create_form.isInternalCustomer = typeof val === 'boolean' ? val ? '1' : 0 : val
      this.is_inside = typeof val === 'boolean' ? val : val !== 0
    },
    // 初始化info
    handleInitInfo () {
      this.isEnable = this.current_row.isEnable
      for (let key in this.create_form) {
        if (this.current_row[key] !== null) {
          this.create_form[key] = this.current_row[key]
        } else {
          this.create_form[key] = null
        }
      }
      this.can_use = parseInt(this.current_row.customerType) === 1
      this.handleSyncInternalCustomer(this.current_row.isInternalCustomer)
    },
    // 请求当前数据信息
    getCurrentInfo (id) {
      console.log(id, '131')
      // 根据路由控制是客户还是供应商来的
      if (this.$route.name === 'update_client') {
        this.req = {
          id,
          isEnterpriseAdmin: 1,
          dataType: 0
        }
      } else {
        this.req = {
          id,
          isEnterpriseAdmin: 1,
          dataType: 1
        }
      }
      this.isLoading = true
      this.$request.post('/financeback/customerSupplier/findCustomerSupplierById', this.req
      ).then(res => {
        this.isLoading = false
        if (res.data.code === 200) {
          if (res.data.data) {
            this.current_row = res.data.data
            console.log(this.current_row.isEnable, '0980')
            console.log(this.current_row.isEnable, '0980')
            this.create_form = res.data.data
            if (this.create_form && this.create_form.useCompanyIdString) {
              console.log('使用公司数组')
              this.paramsed.idList = this.create_form.useCompanyIdString.split(',')
              var idList = this.paramsed.idList.map((item, index) => {
                return item - 0
              })
              this.paramsed.idList = idList
            } else {
              this.paramsed.idList = []
            }
            // 资料类型 1.共享型,2.分配型,3.私有型
            if (this.create_form.dataTypes === '3') {
              console.log(this.create_form.dataTypes, '999')
              this.create_form.dataTypes = 3
            }
            if (this.create_form.dataTypes === '2') {
              this.create_form.dataTypes = 2
            }
            if (this.create_form.dataTypes === '1') {
              this.create_form.dataTypes = 1
            }
            if (this.create_form.supplierType === 1) {
              this.create_form.supplierType = 1
            }
            if (this.create_form.supplierType === 0) {
              this.create_form.supplierType = 0
            }
            this.handleInitInfo()
          } else {
            this.current_row = ''
          }
        } else {
          this.current_row = ''
        }
      })
    }
  }
}
