import Vue from 'vue';
import { Message } from 'iview';
Vue.component('Message',Message);
export const Validation = {
  // 编码
  codeRule : (rule, value, callback) => {
    if (value === '') {
      return callback(Message.error('请输入必填字段'))
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return callback(Message.error('内容格式错误'))
    } else if (value.toString().length !== 4) {
      return callback(Message.error('内容格式错误,请输入4位数字或英文字母'))
    } else {
      callback()
    }
  },
  // 岗位编码
  authCodeRule: (rule, value, callback) => {
    if (value === '') {
      return callback(Message.error('请输入必填字段'))
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return callback(Message.error('内容格式错误'))
    } else if (value.toString().length !== 10) {
      return callback(Message.error('内容格式错误,请输入10位数字或英文字母'))
    } else {
      callback()
    }
  },
  // 名称
  nameRule : (rule, value, callback) => {
    if (value === '') {
      return callback(Message.error('请输入必填字段'))
    } else {
      callback()
    }
  },
  // 形态
  formsRule : (rule, value, callback) => {
    if (value === '') {
      return callback(Message.error('请选择必填字段'))
    } else {
      callback()
    }
  },
  // 简称
  AbbreviationRule : (rule, value, callback) => {
    if (value === '') {
      callback()
    } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value)) {
      return callback(Message.error('内容格式错误'))
    } else {
      callback()
    }
  },
  // 法定代表人
  legalPersonRule : (rule, value, callback) => {
    if (value === '') {
      callback()
    } else {
      callback()
    }
  },
  // // 固定电话
  // fixedTelephoneRule : (rule, value, callback) => {
  //   if (value === '') {
  //     callback()
  //   } else if (!/^[1-9]\d*$/.test(value)) {
  //     callback(new Error())
  //   }else if (value.length >12) {
  //     callback(new Error())
  //   }else {
  //     callback()
  //   }
  // },
  // 手机号码
  phoneNumberRule : (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (value === '') {
      callback()
    } else if (!/^[1-9]\d*$/.test(value)) {
      return callback(Message.error('内容格式错误'))
    } else if (value.toString().length !== 11) {
      return callback(Message.error('内容格式错误,请输入11位数字'))
    }else {
      callback()
    }
  },
  // 统一社会信用代码
  creditCodeRule : (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (value === '') {
      callback()
    } else if (!/^[a-zA-HJ-NP-RT-UW-Y0-9]+$/.test(value)) {
      return callback(Message.error('内容格式错误,请输入18位数字或英文字母'))
    }else if (value.length !== 18) {
      return callback(Message.error('内容格式错误,请输入18位数字或英文字母'))
    }else {
      callback()
    }
  },
  // 纳税人识别号
  TaxpayerRule : (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (value === '') {
      callback()
    } else if (!/^[a-zA-HJ-NP-RT-UW-Y0-9]+$/.test(value)) {
      return callback(Message.error('内容格式错误,请输入15位、17位、18或者20位数字或英文字母'))
    } else if (!(value.length === 15 || value.length === 17 || value.length === 18 || value.length === 20)) {
      return callback(Message.error('内容格式错误,请输入15位、17位、18或者20位数字或英文字母'))
    }else {
      callback()
    }
  },
  // 工商注册号
  registerNumberRule : (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (value === '') {
      callback()
    } else if (!/^[a-zA-HJ-NP-RT-UW-Y0-9]+$/.test(value)) {
      return callback(Message.error('内容格式错误,请输入15位或18位数字或英文字母'))
    }else if (!(value.length === 15 || value.length === 18)) {
      return callback(Message.error('内容格式错误,请输入15位或18位数字或英文字母'))
    }else {
      callback()
    }
  },
  // 开户银行
  BankRule : (rule, value, callback) => {
    if (value === '') {
      callback()
    }  else {
      callback()
    }
  },
  // 银行账户
  bankAccountRule : (rule, value, callback) => {
    if (value === null) {
      value = ''
    }
    if (value === '') {
      callback()
    } else if (!/^\d+$/.test(value)) {
      return callback(Message.error('内容格式错误,请输入16或19位的数字'))
    }else if (!(value.length === 16 || value.length === 19)) {
      return callback(Message.error('内容格式错误,请输入16或19位的数字'))
    }else {
      callback()
    }
  },
  // 注册地址
  addressRule : (rule, value, callback) => {
    if (value === '') {
      callback()
    } else {
      callback()
    }
  },
  // 银行账号部分表单验证
  // 必填字段验证
  companyRule: (rule, value, callback) => {
    if (value === null || value === ' ') {
      callback()
    } else {
      callback()
    }
  },
  bankAccountCheck: (rule, value, callback) => {
    if (value === '') {
      return callback(Message.error('输入内容不能为空'))
    } else if (!/^\d+$/.test(value)) {
      return callback(Message.error('内容格式错误,请输入17位数字'))
    } else if (value.length !== 17) {
      return callback(Message.error('内容格式错误,请输入17位数字'))
    } else (
      callback()
    )
  },
  accountNameRule: (rule, value, callback) => {
    if (/(^\s+)|(\s+$)|\s+/g.test(value)) {
      return callback(Message.error('输入内容不能有空格'))
    } else if (value.length > 50) {
      return callback(Message.error('字符长度不能超过50'))
    } else if (/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im.test(value)) {
      return callback(Message.error('输入内容不能包含有特殊字符'))
    } else {
      callback()
    }
  },
  // 现金流量项目-下级项目编码规则
  cashflowCodeRule: (rule, value, callback) => {
    if (!value) {
      // return callback(Message.error('请输入必填字段'))
      return callback('qing shuru ')
    } else if (!/^[0-9]{2,2}$/.test(value)) {
      // return callback(Message.error('内容格式错误,请输入2位数字'))
      return callback('请输入2位数字')
    } else {
      callback()
    }
  }
}

export function codeRule(rule, value, callback) {
  console.log(value)
  if (!value) {
    return callback(Message.error('请输入必填字段'))
  } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
    return callback(Message.error('内容格式错误'))
  } else {
    callback()
  }
}

export function nameRules(rule, value, callback) {
  if (!value) {
    return callback(Message.error('请输入必填字段'))
  } else {
    callback()
  }
}
export function checkNameRule(rule, value, callback) {
  if (value === '') {
    return callback(Message.error('请输入必填字段'))
  } else if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)){
    return callback(Message.error('内容格式错误,请输入汉字,数字或英文字母'))
  } else {
    callback()
  }
}
