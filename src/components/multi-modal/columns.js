export const multiColumns = {
  'company': [
    {
      title: '编码',
      key: 'code',
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      tooltip: true
    },
    {
      title: '形态',
      key: 'companyFormName',
      tooltip: true
    }
  ],
  'auxiliary': [ // 核算主体
    {
      title: '编码',
      key: 'code',
      minWidth: 90,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 90,
      tooltip: true
    },
    {
      title: '形态',
      key: 'formName',
      minWidth: 90,
      tooltip: true
    }
  ],
  'cancleallocation': [ // 取消分配
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }, {
      title: '形态',
      key: 'type',
      tooltip: true
    }
  ],
  'bankAccount': [ // 银行账户
    {
      title: '编码',
      key: 'code',
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      tooltip: true
    },
    {
      title: '银行账号',
      key: 'account',
      tooltip: true
    },
    {
      title: '开户银行',
      key: 'depositBankName',
      tooltip: true
    },
    {
      title: '账户类型',
      key: 'accTypeName',
      tooltip: true
    },
    {
      title: '账户用途',
      key: 'accUsageName',
      tooltip: true
    }
  ],
  'subject': [ // 会计科目
    {
      title: '编码',
      key: 'code',
      minWidth: 30,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 30,
      tooltip: true
    },
    {
      title: '类别属性',
      key: 'type',
      minWidth: 50,
      tooltip: true
    },
    {
      title: '余额方向',
      key: 'remainingSum',
      minWidth: 50,
      tooltip: true
    },
    {
      title: '分类',
      key: 'classify',
      minWidth: 30,
      tooltip: true
    },
    {
      title: '辅助核算',
      key: 'auxiliaryAccounting ',
      minWidth: 50,
      tooltip: true
    }
  ],
  'generalLedger': [ // 总账账簿
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }, {
      title: '账簿类型',
      key: 'type',
      tooltip: true
    }, {
      title: '公司',
      key: 'companyFormName',
      tooltip: true
    }
  ],
  'accountBook': [ // 总账账簿(查询条件)
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }, {
      title: '会计准则',
      key: 'accountingStandardName',
      tooltip: true
    }, {
      title: '记账本位币',
      key: 'accountingCurrencyName',
      tooltip: true
    }
  ],
  'allocation': [ // 总账账簿
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }, {
      title: '形态',
      key: 'type',
      tooltip: true
    }
  ],
  'user': [ // 用户
    {
      title: '用户手机号码',
      key: 'mobile',
      tooltip: true
    }, {
      title: '用户姓名',
      key: 'name',
      tooltip: true
    }, {
      title: '数据状态',
      key: 'isEnableName',
      tooltip: true
    }
  ],
  'role': [ // 岗位权限
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }
  ],
  'subSystem': [ // 子系统
    {
      title: '名称',
      key: 'typeName',
      tooltip: true
    }
  ],
  'menu': [ // 菜单
    {
      title: '编码',
      key: 'code',
      tooltip: true
    }, {
      title: '名称',
      key: 'name',
      tooltip: true
    }
  ]
}

export const multiUrls = {
  'company': '/financeback/company/findCompanyPage', // 请求路径
  'auxiliary': '/financeback/bankAccount/findAccountBookEntityList', // 核算主体
  'bankAccount': '/financeback/bankAccount/findBankAccountPage', // 银行账户
  'subject': '/financeback/bankAccount/findBankAccountPage', // 会计科目
  'accountBook': '/financeback/accountBook/findAccountBookPage', // 总账账簿(查询条件)
  'generalLedger': '/financeback/company/findCompanyPage', // 总账账簿
  'allocation': '/financeback/company/findCompanyPage', // 项目分配
  'cancleallocation': '/financeback/company/findPageForConfigure', // 项目取消分配
  'user': '/financeback/sysUser/findPage', // 用户
  'role': '/financeback/sysRole/findPage', // 岗位权限
  'subSystem': '/financeback/sysMenu/findEnableSysList', // 子系统
  'menu': '/financeback/sysMenu/findEnableMenuList' // 菜单
}
