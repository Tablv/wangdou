export default {
  data () {
    return {
      can_use: false,
      reqS: {},
      req: {},
      cancel_visible: false, // 取消
      select_company_visible: false,
      companyId: '0',
      changed: false, // 表单是否改变
      select_loading: false, // 远程搜索loading
      save_type: '', // 保存(1) or 保存新增(2)
      check_fields: {
        name: '客户名称',
        unifiedSocialCreditCode: '统一社会信用代码',
        idCardNum: '身份证号'
      },
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
      ruleValidate: {
        companyName: [
          { required: true, trigger: 'change' }
        ],
        customerType: [
          { required: true, trigger: 'change' }
        ],
        name: [
          { required: true, trigger: 'blur' }
        ]
      },
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
      }
    }
  },
  watch: {
    changed: function (val) {
      this.doIdentifying(this.$route, val)
    }
  },
  methods: {
    // 选择公司
    handleGetCompany (item) {
      this.create_form.companyId = item.companyId
      this.create_form.companyName = item.companyName
    },
    handleChangeCustomerType (val) {
      this.handleFormChange()
      if (parseInt(val) === 1) {
        this.can_use = true
        this.create_form.unifiedSocialCreditCode = ''
      } else {
        this.can_use = false
        this.create_form.idCardNum = ''
      }
    },
    handleSelectCompany (data, item) {
      if (data) {
        this.create_form.companyName = data.name
        if (this.create_form.companyName !== '集团') {
          this.create_form.dataTypes = 3
        } else {
          this.create_form.dataTypes = 1
        }
        this.create_form.companyId = data.id
      }
      if (!item) {
        this.create_form.companyName = this.create_form.companyName === '集团' ? '集团 ' : '集团'
      }
      if (!data.name || !data.id) {
        return false
      }
      // this.select_company_visible = false
    },
    handleOpenSel () {
      this.select_company_visible = true
    },
    // 监听表单change
    handleFormChange () {
      this.changed = true
    },
    handleSaveInfo (type) {
      this.$refs['formValidate'].validate((valid) => {
        if (!valid) return false
      })
      this.cancel_visible = false
      this.save_type = type
      if (this.create_form.companyName === '' || this.create_form.companyName === null || this.create_form.companyId === null) {
        this.$Message.warning('请选择创建公司！')
        return false
      }
      if (this.create_form.customerType === '') {
        this.$Message.warning('请选择客户类型！')
        return false
      }
      if (!this.create_form.name) {
        this.$Message.warning('请填写客户名称！')
        return false
      }
      // if (!/^(\d|[a-zA-Z]|[\u4e00-\u9fa5]){1,50}$/.test(this.create_form.name)) {
      //   this.$Message.warning('客户名称格式不正确！')
      //   return false
      // }
      if (this.create_form.contactNumber !== '' && !/^1[3456789]\d{9}$/.test(this.create_form.contactNumber)) {
        this.$Message.warning('手机号码格式不正确！')
        return false
      }
      if (this.create_form.unifiedSocialCreditCode !== '' && !/^(\d|[a-zABCDEFGHJKLMNPQRTUWXY]){18}$/.test(this.create_form.unifiedSocialCreditCode)) {
        this.$Message.warning('统一社会信用代码格式为:18位数字或英文字母，不含大写字母IOZSV')
        return false
      }
      if (this.create_form.idCardNum !== '' && this.create_form.idCardNum.length < 18) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      if (this.create_form.idCardNum !== '' && !/^(\d{17})([0-9]|[a-zA-Z])$/.test(this.create_form.idCardNum)) {
        this.$Message.warning('身份证号格式不正确！')
        return false
      }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,20}$/.test(this.create_form.linkman)) {
      //   this.$Message.warning('联系人格式不正确！')
      //   return false
      // }
      // if (!/^([\u4e00-\u9fa5]|\d|[a-zA-Z]){0,200}$/.test(this.create_form.businessAddress)) {
      //   this.$Message.warning('经营地址格式不正确！')
      //   return false
      // }
      if (this.$route.name === 'create_client') {
        this.req = {
          dataType: 0,
          dataTypes: this.create_form.dataTypes,
          isEnterpriseAdmin: 1,
          companyId: this.create_form.companyId,
          companyName: this.create_form.companyName,
          codeType: this.create_form.codeType,
          customerType: this.create_form.customerType,
          name: this.create_form.name,
          isInternalCustomer: this.create_form.isInternalCustomer,
          unifiedSocialCreditCode: this.create_form.unifiedSocialCreditCode,
          idCardNum: this.create_form.idCardNum,
          businessAddress: this.create_form.businessAddress,
          linkman: this.create_form.linkman,
          contactNumber: this.create_form.contactNumber,
          isInternalSupplier: this.create_form.isInternalSupplier,
          supplierType: this.create_form.supplierType,
          codeName: this.create_form.codeName
        }
      } else {
        this.req = {
          dataType: 1,
          isEnterpriseAdmin: 1,
          dataTypes: this.create_form.dataTypes,
          companyId: this.create_form.companyId,
          companyName: this.create_form.companyName,
          codeType: this.create_form.codeType,
          customerType: this.create_form.customerType,
          name: this.create_form.name,
          isInternalCustomer: this.create_form.isInternalCustomer,
          unifiedSocialCreditCode: this.create_form.unifiedSocialCreditCode,
          idCardNum: this.create_form.idCardNum,
          businessAddress: this.create_form.businessAddress,
          linkman: this.create_form.linkman,
          contactNumber: this.create_form.contactNumber,
          isInternalSupplier: this.create_form.isInternalSupplier,
          supplierType: this.create_form.supplierType,
          codeName: this.create_form.codeName
        }
      }
      this.$request.post('/financeback/customerSupplier/checkColumn', this.req).then(res => {
        if (res.data.code === 200) {
          this.handleConfirmSave()
        } else {
          console.log(res.data.data, '9999')
          if (res.data.data.length) {
            var fields = res.data.data
            console.log(fields, '00000')
            let _str = ''
            for (var i = 0; i < fields.length; i++) {
              _str += this.check_fields[fields[i]] + '、'
            }
            _str = _str.substring(0, _str.length - 1)
            this.$Message.warning(`${_str}字段重复！`)
          } else {
            this.$Message.warning(res.data.message)
          }
        }
      })
    },
    // 确定保存
    handleConfirmSave () {
      if (this.$route.name === 'create_client') {
        this.reqS = {
          dataType: 0,
          dataTypes: this.create_form.dataTypes,
          isEnterpriseAdmin: 1,
          companyId: this.create_form.companyId,
          companyName: this.create_form.companyName,
          codeType: this.create_form.codeType,
          customerType: this.create_form.customerType,
          name: this.create_form.name,
          isInternalCustomer: this.create_form.isInternalCustomer,
          unifiedSocialCreditCode: this.create_form.unifiedSocialCreditCode,
          idCardNum: this.create_form.idCardNum,
          businessAddress: this.create_form.businessAddress,
          linkman: this.create_form.linkman,
          contactNumber: this.create_form.contactNumber,
          isInternalSupplier: this.create_form.isInternalSupplier,
          supplierType: this.create_form.supplierType,
          codeName: this.create_form.codeName
        }
      } else {
        this.reqS = {
          dataType: 1,
          dataTypes: this.create_form.dataTypes,
          isEnterpriseAdmin: 1,
          companyId: this.create_form.companyId,
          companyName: this.create_form.companyName,
          codeType: this.create_form.codeType,
          customerType: this.create_form.customerType,
          name: this.create_form.name,
          isInternalCustomer: this.create_form.isInternalCustomer,
          unifiedSocialCreditCode: this.create_form.unifiedSocialCreditCode,
          idCardNum: this.create_form.idCardNum,
          businessAddress: this.create_form.businessAddress,
          linkman: this.create_form.linkman,
          contactNumber: this.create_form.contactNumber,
          isInternalSupplier: this.create_form.isInternalSupplier,
          supplierType: this.create_form.supplierType,
          codeName: this.create_form.codeName
        }
      }
      this.$request.post('/financeback/customerSupplier/addCustomerSupplier', this.reqS).then(res => {
        if (res.data.code === 200) {
          this.$Message.success('新增成功！')
          let _name = ''
          _name = this.$route.name === 'create_client' ? 'client' : 'supplier'
          this.$store.dispatch('addIdToList', { id: res.data.data, name: _name })
          if (this.save_type === 1) {
            this.$router.push({ name: `update_${_name}`, query: { id: res.data.data } })
          } else {
            this.$refs.formValidate.resetFields()
            this.changed = false
            if (this.$route.name === 'create_client') {
              setTimeout(() => {
                this.$router.push({
                  name: 'create_client'
                })
                this.handleResetForm()
                this.changed = false
              }, 1000)
            } else {
              setTimeout(() => {
                this.$router.push({
                  name: 'create_supplier'
                })
                this.handleResetForm()
                this.changed = false
              }, 1000)
            }
            console.log(this.changed, '08079')
            // this.handleResetForm()
          }
        } else {
          this.$Message.warning('新增失败！')
        }
      })
    },
    doShowEditModal () {
      let that = this
      this.$Control({
        type: 'control',
        message: `当前数据已修改，需要保存吗？`,
        yes () {
          that.handleSaveInfo()
          that.$CloseCtl()
          that.doContinueActions()
        },
        no () {
          that.$CloseCtl()
          that.doContinueActions()
        },
        cancel () {
          that.$CloseCtl()
        }
      })
    },
    // 取消保存
    handleCancelSave () {
      if (this.changed) {
        this.cancleboxModel = true
        // this.doShowEditModal()
      }
    },
    handleConfirmCancel () {
      this.handleResetForm()
      this.cancel_visible = false
    }
  }
}
