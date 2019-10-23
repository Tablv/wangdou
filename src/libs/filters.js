// 年月日时分
export let dateFormat = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    // let week = date.getDay()
    let hour = dateTime.getHours()
    let minute = dateTime.getMinutes()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2)
  }
}
// 年月日时分秒
export let dateFormatAll = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    // let week = date.getDay()
    let hour = dateTime.getHours()
    let minute = dateTime.getMinutes()
    let seconds = dateTime.getSeconds()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2) + ':' + ('0' + seconds).slice(-2)
  }
}
// 年月日
export let dateFormatYYYYHHDD = (date) => {
  if (date) {
    let dateTime = new Date(date)
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    return year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2)
  }
}
//校验公司形态
export function checkCompanyForm(value) {
  let companyForm = ''
  switch (value) {
    case 1:
      companyForm = '总部'
      break
    case 2:
      companyForm = '公司'
      break
    case 3:
      companyForm = '门店'
      break
    case 4:
      companyForm = '中央厨房'
      break
    case 5:
      companyForm = '仓储中心'
      break
    case 6:
      companyForm = '配送中心'
      break
    case 7:
      companyForm = '采购中心'
      break
    case 8:
      companyForm = '其他'
      break
  }
  return companyForm
}
// 校验公司类型
export function checkCompanyType(value) {
  let companyType = ''
  switch (value) {
    case 9:
      companyType = '有限责任公司'
      break
    case 10:
      companyType = '股份有限责任公司'
      break
    case 11:
      companyType = '个人独资企业'
      break
    case 12:
      companyType = '合伙企业'
      break
    case 13:
      companyType = '个体工商户'
      break
  }
  return companyType
}
