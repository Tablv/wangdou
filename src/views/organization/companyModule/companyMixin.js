const companyMixin = {
  created () {
    this.doGetSelectList()
  },
  methods: {
    // 获取选择器列表
    doGetSelectList () {
      this.loading = true
      this.$request.post('/financeback/company/findSysAuxDataList').then(res => {
        this.loading = false
        let { code, data } = res.data
        if (code === 200) {
          let _formsList = []
          data.form.forEach(item => {
            _formsList.push({
              id: item.id,
              label: item.name
            })
          })
          this.formsList = _formsList
          let _companyTypeList = []
          data.company_type.forEach(item => {
            _companyTypeList.push({
              id: item.id,
              label: item.name
            })
          })
          this.companyTypeList = _companyTypeList
          let _taxQualificationList = []
          data.tax_qualification.forEach(item => {
            _taxQualificationList.push({
              id: item.id,
              label: item.name
            })
          })
          this.taxQualificationList = _taxQualificationList

          let _accountingStandardList = []
          let _taxSystemList = []
          let _accountingCurrencyList = []
          data.accounting_standard.forEach(item => {
            _accountingStandardList.push({
              id: item.accStandardId,
              label: item.accStandardName
            })
            _taxSystemList.push({
              id: item.taxSystems[0].taxSystemId,
              label: item.taxSystems[0].taxSystemName
            })
            _accountingCurrencyList.push({
              id: item.currencys[0].currencyId,
              label: item.currencys[0].currencyName
            })
          })
          this.accountingStandardList = _accountingStandardList
          this.taxSystemList = _taxSystemList
          this.accountingCurrencyList = _accountingCurrencyList

          // let _taxSystemList = []
          // data.accounting_standard.forEach(item => {
          //   _taxSystemList.push({
          //     id: item.taxSystemId,
          //     label: item.taxSystemName
          //   })
          // })
          // this.taxSystemList = _taxSystemList

          // let _accountingCurrencyList = []
          // data.accounting_standard.forEach(item => {
          //   _accountingCurrencyList.push({
          //     id: item.currencyId,
          //     label: item.currencyName
          //   })
          // })
          // this.accountingCurrencyList = _accountingCurrencyList
        }
      })
    }
  }
}
export default companyMixin
