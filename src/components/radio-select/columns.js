export const tableColumns = {
  'company': [
    { title: '编码', key: 'code', align: 'center', tooltip: true },
    { title: '名称', key: 'name', align: 'center', tooltip: true },
    { title: '形态', key: 'companyFormName', align: 'center', tooltip: true }
  ],
  'changecompany': [{
    title: '编码',
    key: 'code',
    align: 'center',
    tooltip: true
  },
  {
    title: '名称',
    key: 'name',
    align: 'center',
    tooltip: true
  },
  {
    title: '形态',
    key: 'companyFormName',
    align: 'center',
    tooltip: true
  }
  ],
  'department': [{
    title: '编码',
    key: 'code',
    align: 'center',
    tooltip: true
  },
  {
    title: '名称',
    key: 'name',
    align: 'center',
    tooltip: true
  },
  {
    title: '属性',
    key: 'deptTypeName',
    tooltip: true
  },
  {
    title: '数据状态',
    key: 'isEnableStr',
    width: 160,
    tooltip: true
  },
  {
    title: '使用公司',
    key: 'useCompanyName',
    tooltip: true
  }],
  'personInChargeName': [{
    title: '员工编码',
    key: 'code',
    align: 'center',
    tooltip: true
  },
  {
    title: '员工姓名',
    key: 'name',
    align: 'center',
    tooltip: true
  },
  {
    title: '手机号',
    key: 'contactNumber',
    align: 'center',
    tooltip: true
  },
  {
    title: '部门',
    key: 'dept',
    align: 'center',
    tooltip: true
  },
  {
    title: '使用公司',
    key: 'userCompany',
    align: 'center',
    tooltip: true
  },
  {
    title: '数据状态',
    tooltip: true,
    key: 'isEnable',
    render: (h, { row }) => {
      return h('div', [
        h('span', {
          style: {
            color: row.isEnable === 0 ? '#F73E3E' : '#595959',
            verticalAlign: 'middle'
          }
        }, row.isEnable === 0 ? '已失效' : '已生效')
      ])
    }
  }
  ],
  'auxiliary': [
    { title: '编码', key: 'entityCode', align: 'center', tooltip: true },
    { title: '名称', key: 'entityName', align: 'center', tooltip: true },
    { title: '核算账簿', key: 'accountBookName', align: 'center', tooltip: true }
  ],
  'bank': [
    { title: '编码', key: 'code', align: 'center', tooltip: true },
    { title: '名称', key: 'name', align: 'center', tooltip: true },
    { title: '银行类别', key: 'bankCategoryName', align: 'center', tooltip: true }
  ],
  'attrBusiness': [
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
      key: 'unitFormName',
      tooltip: true
    },
    {
      title: '数据状态',
      minWidth: 40,
      key: 'isEnable',
      render: (h, params) => {
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '5px',
              height: '5px',
              backgroundColor: params.row.isEnable === 0 ? '#F73E3E' : '#595959',
              borderRadius: '50%',
              marginRight: '10px'
            }
          }),
          h('span', {
            style: {
              color: params.row.isEnable === 0 ? '#F73E3E' : '#595959',
              verticalAlign: 'middle'
            }
          }, params.row.isEnable === 0 ? '已失效' : '已生效')
        ])
      }
    }
  ],
  'depttype': [{
    title: '编码',
    key: 'code',
    align: 'center',
    tooltip: true
  },
  {
    title: '名称',
    key: 'name',
    align: 'center',
    tooltip: true
  }],
  'period': [
    {
      title: '编码',
      key: 'code',
      minWidth: 60
    }
  ],
  'accountBook': [
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
      title: '会计准则',
      key: 'accountingStandardName',
      tooltip: true
    },
    {
      title: '记账本位币',
      key: 'accountingCurrencyName',
      tooltip: true
    }
  ],
  'accountBookSetting': [
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
      title: '会计准则',
      key: 'accountingStandardName',
      tooltip: true
    },
    {
      title: '记账本位币',
      key: 'accountingCurrencyName',
      tooltip: true
    }
  ],
  'abstract': [
    {
      title: '摘要内容',
      key: 'code',
      tooltip: true
    },
    {
      title: '公司',
      key: 'name',
      tooltip: true
    },
    {
      title: '助记码',
      key: 'companyFormName',
      tooltip: true
    }
  ],
  'subject': [
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
      title: '科目类别',
      key: 'subjectCategoryName',
      tooltip: true
    },
    {
      title: '余额方向',
      key: 'balanceDirection',
      tooltip: true,
      render: (h, { row }) => h('span', row.balanceDirection ? '贷方' : '借方')
    },
    {
      title: '分类名称',
      key: 'accountCategory',
      tooltip: true,
      render: (h, { row, index, colum }) => {
        return (
          <div>
            <span v-show={row.accountCategory === 'A01'} >现金科目</span>
            <span v-show={row.accountCategory === 'A02'} >银行科目</span>
            <span v-show={row.accountCategory === 'A03'} >现金等价物</span>
            <span v-show={row.accountCategory === 'B01'} >一般科目</span>
          </div>
        )
      }
    },
    {
      title: '辅助核算',
      key: 'auxiliaryNames',
      tooltip: true
    }
  ],
  'subjectSetting': [
    {
      title: '科目编码',
      key: 'code',
      tooltip: true
    },
    {
      title: '科目名称',
      key: 'name',
      tooltip: true
    },
    {
      title: '会计要素',
      key: 'accountElementItemName',
      tooltip: true
    },
    {
      title: '科目类别',
      key: 'subjectCategoryName',
      tooltip: true
    },
    {
      title: '余额方向',
      key: 'balanceDirection',
      tooltip: true,
      render: (h, { row }) => {
        return (
          <span class="readonly">{row.balanceDirection ? '贷' : '借'}</span>
        )
      }
    },
    // {
    //   title: '发生额方向',
    //   key: 'companyFormName',
    //   tooltip: true
    // },
    {
      title: '分类',
      key: 'accountCategory',
      tooltip: true,
      render: (h, { row }) => {
        return (
          <span class="readonly">{row.accountCategory === 'B01' ? '一般科目' : row.accountCategory === 'A01' ? '现金科目' : row.accountCategory === 'A02' ? '银行科目' : '现金等价物'}</span>
        )
      }
    },
    {
      title: '辅助核算',
      key: 'auxiliaryNames',
      tooltip: true
    },
    {
      title: '数据状态',
      tooltip: true,
      key: 'isEnable',
      render: (h, { row }) => {
        return h('div', [
          h('span', {
            style: {
              color: row.isEnable === 0 ? '#F73E3E' : '#595959',
              verticalAlign: 'middle'
            }
          }, row.isEnable === 0 ? '已失效' : '已生效')
        ])
      }
    }
  ],
  'projectCode': [
    {
      title: '编码',
      key: 'code',
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      tooltip: true
    }
  ],
  'employee': [
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
      title: '公司',
      key: 'company',
      minWidth: 60,
      tooltip: true
    },
    {
      title: '部门',
      key: 'companyFormName',
      tooltip: true
    },
    {
      title: '手机号码',
      key: 'companyFormName',
      tooltip: true
    },
    {
      title: '电子邮箱',
      key: 'companyFormName',
      tooltip: true
    }
  ],
  'checkAccounting': [
    {
      title: '编码',
      key: 'code',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '类型',
      key: 'name',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '所属核算账簿',
      key: 'name',
      minWidth: 100,
      tooltip: true
    }
  ],
  'classify': [
    {
      title: '编码',
      key: 'code',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '数据状态',
      key: 'isEnable',
      minWidth: 100,
      tooltip: true
    }
  ],
  'auxiliarySeting': [
    {
      title: '编码',
      key: 'code',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '数据状态',
      key: 'isEnable',
      minWidth: 100,
      tooltip: true,
      render: (h, { row }) => {
        return h('div', [
          h('span', {
            style: {
              color: row.isEnable === 0 ? '#F73E3E' : '#595959',
              verticalAlign: 'middle'
            }
          }, row.isEnable === 0 ? '已失效' : '已生效')
        ])
      }
    }
  ],
  'cashflow': [
    {
      title: '编码',
      key: 'code',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '方向',
      key: 'cashFlowDirection',
      minWidth: 60,
      tooltip: true,
      render: (h, { row }) => h('span', row.cashFlowDirection ? '现金流入' : '现金流出')
    },
    {
      title: '数据状态',
      key: 'isEnable',
      minWidth: 60,
      tooltip: true,
      render: (h, { row }) => {
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '5px',
              height: '5px',
              backgroundColor: row.isEnable === 0 ? '#F73E3E' : '#595959',
              borderRadius: '50%',
              marginRight: '10px'
            }
          }),
          h('span', {
            style: {
              color: row.isEnable === 0 ? '#F73E3E' : '#595959',
              verticalAlign: 'middle'
            }
          }, row.isEnable === 0 ? '已失效' : '已生效')
        ])
      }
    }
  ],
  'parentdept': [
    {
      title: '编码',
      key: 'code',
      align: 'center',
      tooltip: true
    },
    {
      title: '名称',
      key: 'name',
      align: 'center',
      tooltip: true
    },
    {
      title: '属性',
      key: 'deptTypeName',
      tooltip: true
    },
    {
      title: '数据状态',
      key: 'isEnableStr',
      width: 160,
      tooltip: true
    },
    {
      title: '使用公司',
      key: 'useCompanyName',
      tooltip: true
    }
  ]
}
export const urls = {
  'company': '/financeback/company/findCompanyPage', // 公司
  'changecompany': '/financeback/company/findCompanyPageOut', // 部门变更公司
  'department': '/financeback/dept/findDeptPage', // 部门
  'personInChargeName': '/financeback/staff/findStaffPage', // 负责人
  'auxiliary': '/financeback/bankAccount/findAccountBookEntityList', // 银行账户
  'bank': '/financeback/bankAccount/findBankPage', // 银行账户
  'attrBusiness': '/financeback/businessUnit/findBusinessUnitPage', // 业务单元
  'depttype': '/financeback/dept/findDeptTypePage', // 属性
  'period': '', // 期初余额
  'accountBook': '/financeback/dept/findCompanyPage', // 核算账簿
  'accountBookSetting': '/financeback//accountBook/findAccountBookPage', // 核算账簿-多栏账方案
  'abstract': '/financeback/dept/findDeptPage', // 常用摘要
  // 'subject': '/financeback/dept/findDeptPage', // 会计科目
  'subject': '/financeback/accountSubject/findPage', // 会计科目
  'subjectSetting': '/financeback/accountSubject/findPage', // 会计科目-参数设置/多栏账方案
  'projectCode': '/financeback/accountSubject/findAllChildInfo', // 项目编码-多栏账方案
  'auxiliarySeting': '/financeback/accountSubject/findSourceTableList', // 辅助核算项 - 用于多栏账方案栏目编码
  'employee': '/financeback/dept/findDeptPage', // 员工
  'checkAccounting': '/financeback/dept/findDeptPage', // 核算主体
  'classify': '/financeback/dept/findDeptPage', // 分类
  'cashflow': '/financeback/cashFlowItem/findCashFlowItemByPage', // 现金流量项目
  'parentdept': '/financeback/dept/findParentDeptList' // 上级部门
}
