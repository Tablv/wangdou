import Main from '_c/main'
import Home from '_v/home'
/**
 * routes 不受权限约束的路由
 * routerMap 受权限约束的路由
 * hideInMenu 控制不在菜单栏显示的路由，但是跳转不控制菜单高亮的，不受权限约束的子路由
 * hide 控制不在菜单栏显示的路由，但是跳转控制菜单高亮的
 * 路由name设置与统一门户权限设置的字段对应（用于控制页面级别权限）
 */
export const routesMap = [
  {
    path: '/organization',
    name: 'organization',
    meta: {
      icon: '_zuzhi',
      title: '组织用户'
    },
    component: Main,
    children: [
      {
        path: 'company',
        name: '_organization_company',
        meta: {
          title: '组织机构'
        },
        component: Home,
        children: [
          {
            path: 'company_index',
            name: 'company_index',
            meta: {
              title: '公司'
            },
            component: () => import('_v/organization/company.vue')
          },
          {
            path: 'company_createcompany',
            name: 'create_company',
            meta: {
              title: '新增公司',
              hide: true
            },
            component: () => import('_v/organization/companyModule/create_company.vue')
          },
          {
            path: 'company_updatecompany',
            name: 'update_company',
            meta: {
              title: '查看公司',
              hide: true
            },
            component: () => import('_v/organization/companyModule/update_company.vue')
          },
          {
            path: 'element_index',
            name: 'element_index',
            meta: {
              title: '业务单元'
            },
            component: () => import('_v/organization/element.vue')
          },
          {
            path: 'element_create',
            name: 'create_element',
            meta: {
              hide: true,
              title: '新增业务单元'
            },
            component: () => import('_v/organization/business/create_element.vue')
          },
          {
            path: 'element_update',
            name: 'update_element',
            meta: {
              hide: true,
              title: '查看业务单元'
            },
            component: () => import('_v/organization/business/update_element.vue')
          }
        ]
      },
      {
        path: 'auth',
        name: '_organization_auth',
        meta: {
          title: '用户权限'
        },
        component: Home,
        children: [
          {
            path: 'auth_index',
            name: 'auth_index',
            meta: {
              title: '岗位权限'
            },
            component: () => import('_v/organization/auth/auth.vue')
          },
          {
            path: 'auth_create',
            name: 'create_auth',
            meta: {
              title: '新增岗位',
              hide: true
            },
            component: () => import('_v/organization/auth/create_auth.vue')
          },
          {
            path: 'auth_update',
            name: 'update_auth',
            meta: {
              title: '查看岗位',
              hide: true
            },
            component: () => import('_v/organization/auth/update_auth.vue')
          },
          {
            path: 'user_index',
            name: 'user_index',
            meta: {
              title: '用户'
            },
            component: () => import('_v/organization/auth/post_user.vue')
          },
          {
            path: 'user_create',
            name: 'create_user',
            meta: {
              title: '新增用户',
              hide: true
            },
            component: () => import('_v/organization/auth/create_user.vue')
          }, {
            path: 'user_update',
            name: 'update_user',
            meta: {
              title: '查看用户',
              hide: true
            },
            component: () => import('_v/organization/auth/update_user.vue')
          },
          {
            path: 'report_index',
            name: 'report_index',
            meta: {
              title: '用户权限报表'
            },
            component: () => import('_v/organization/auth/report.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/basics',
    name: 'basics',
    meta: {
      icon: '_shezhi',
      title: '基础资料'
    },
    component: Main,
    children: [
      {
        path: 'major',
        name: '_basics_major',
        meta: {
          title: '主资料'
        },
        component: Home,
        children: [
          {
            path: 'accountant_index',
            name: 'accountant_index',
            meta: {
              title: '会计科目'
            },
            component: () => import('_v/basics/major/accountant/accountant.vue')
          },
          {
            path: 'accountant_create',
            name: 'create_accountant',
            meta: {
              title: '新增会计科目',
              hide: true
            },
            component: () => import('_v/basics/major/accountant/create_accountant.vue')
          },
          {
            path: 'accountant_update',
            name: 'update_accountant',
            meta: {
              title: '查看会计科目',
              hide: true
            },
            component: () => import('_v/basics/major/accountant/update_accountant.vue')
          },
          {
            path: 'more_project',
            name: 'more_project',
            meta: {
              title: '更多科目模板',
              hide: true
            },
            component: () => import('_v/basics/major/accountant/more_project.vue')
          },
          {
            path: 'cashflow_index',
            name: 'cashflow_index',
            meta: {
              title: '现金流量项目'
            },
            component: () => import('_v/basics/major/cashflow/cashflow.vue')
          },
          {
            path: 'cashflow_create',
            name: 'create_cashflow',
            meta: {
              title: '新增现金流量项目',
              hide: true
            },
            component: () => import('_v/basics/major/cashflow/create_cashflow.vue')
          },
          {
            path: 'cashflow_update',
            name: 'update_cashflow',
            meta: {
              title: '查看现金流量项目',
              hide: true
            },
            component: () => import('_v/basics/major/cashflow/update_cashflow.vue')
          },
          {
            path: 'department_index',
            name: 'department_index',
            meta: {
              title: '部门'
            },
            component: () => import('_v/basics/major/department/department.vue')
          },
          {
            path: 'department_create',
            name: 'create_department',
            meta: {
              title: '新增部门',
              hide: true
            },
            component: () => import('_v/basics/major/department/create_department.vue')
          },
          {
            path: 'department_update',
            name: 'update_department',
            meta: {
              title: '查看部门',
              hide: true
            },
            component: () => import('_v/basics/major/department/update_department.vue')
          },
          {
            path: 'employee_index',
            name: 'employee_index',
            meta: {
              title: '员工'
            },
            component: () => import('_v/basics/major/employee/employee.vue')
          },
          {
            path: 'employee_create',
            name: 'create_employee',
            meta: {
              title: '新增员工',
              hide: true
            },
            component: () => import('_v/basics/major/employee/create_employee.vue')
          },
          {
            path: 'employee_update',
            name: 'update_employee',
            meta: {
              title: '查看员工',
              hide: true
            },
            component: () => import('_v/basics/major/employee/update_employee.vue')
          },
          {
            path: 'client_index',
            name: 'client_index',
            meta: {
              title: '客户'
            },
            component: () => import('_v/basics/major/client/client.vue')
          },
          {
            path: 'client_create',
            name: 'create_client',
            meta: {
              title: '新增客户',
              hide: true
            },
            component: () => import('_v/basics/major/client/create_client.vue')
          },
          {
            path: 'client_update',
            name: 'update_client',
            meta: {
              title: '查看客户',
              hide: true
            },
            component: () => import('_v/basics/major/client/update_client.vue')
          },
          {
            path: 'supplier_index',
            name: 'supplier_index',
            meta: {
              title: '供应商'
            },
            component: () => import('_v/basics/major/supplier/supplier.vue')
          },
          {
            path: 'supplier_create',
            name: 'create_supplier',
            meta: {
              title: '新增供应商',
              hide: true
            },
            component: () => import('_v/basics/major/supplier/create_supplier.vue')
          },
          {
            path: 'supplier_update',
            name: 'update_supplier',
            meta: {
              title: '查看供应商',
              hide: true
            },
            component: () => import('_v/basics/major/supplier/update_supplier.vue')
          },
          {
            path: 'project_index',
            name: 'project_index',
            meta: {
              title: '项目'
            },
            component: () => import('_v/basics/major/project/project.vue')
          },
          {
            path: 'project_create',
            name: 'create_project',
            meta: {
              title: '新增项目',
              hide: true
            },
            component: () => import('_v/basics/major/project/create_project.vue')
          },
          {
            path: 'project_update',
            name: 'update_project',
            meta: {
              title: '查看项目',
              hide: true
            },
            component: () => import('_v/basics/major/project/update_project.vue')
          },
          {
            path: 'account_index',
            name: 'account_index',
            meta: {
              title: '银行账号'
            },
            component: () => import('_v/basics/major/account/account.vue')
          },
          {
            path: 'account_create',
            name: 'create_account',
            meta: {
              title: '新增银行账号',
              hide: true
            },
            component: () => import('_v/basics/major/account/create_account.vue')
          },
          {
            path: 'account_update',
            name: 'update_account',
            meta: {
              title: '查看银行账号',
              hide: true
            },
            component: () => import('_v/basics/major/account/update_account.vue')
          },
          {
            path: 'check_index',
            name: 'check_index',
            meta: {
              title: '自定义核算项目'
            },
            component: () => import('_v/basics/major/check/check.vue')
          },
          {
            path: 'check_create',
            name: 'create_check',
            meta: {
              title: ' 自定义核算项目大区',
              hide: true
            },
            component: () => import('_v/basics/major/check/create_check.vue')
          },
          {
            path: 'check_update',
            name: 'update_check',
            meta: {
              title: '查看自定义核算项目',
              hide: true
            },
            component: () => import('_v/basics/major/check/update_check.vue')
          }
        ]
      },
      {
        path: 'apply',
        name: '_basics_apply',
        meta: {
          title: '应用资料'
        },
        component: Home,
        children: [
          {
            path: 'voucher_index',
            name: 'voucher_index',
            meta: {
              title: '凭证摘要'
            },
            component: () => import('_v/basics/apply/voucher.vue')
          },
          {
            path: 'voucher_create',
            name: 'create_voucher',
            meta: {
              title: '新增摘要',
              hide: true
            },
            component: () => import('_v/basics/apply/create_voucher.vue')
          },
          {
            path: 'voucher_update',
            name: 'update_voucher',
            meta: {
              title: '查看摘要',
              hide: true
            },
            component: () => import('_v/basics/apply/update_voucher.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/settings',
    name: 'settings',
    meta: {
      icon: '_set',
      title: '系统设置'
    },
    component: Main,
    children: [
      {
        path: 'book',
        name: '_settings_account',
        meta: {
          title: '账簿设置'
        },
        component: Home,
        children: [
          {
            path: 'book_index',
            name: 'book_index',
            meta: {
              title: '核算账簿'
            },
            component: () => import('_v/settings/book/book.vue')
          },
          {
            path: 'book_update',
            name: 'update_book',
            meta: {
              title: '查看账簿',
              hide: true
            },
            component: () => import('_v/settings/book/update_book.vue')
          }
        ]
      },
      {
        path: 'accountAll',
        name: '_settings_accountAll',
        meta: {
          title: '总账设置'
        },
        component: Home,
        children: [
          {
            path: 'argument_index',
            name: 'argument_index',
            meta: {
              title: '参数选项'
            },
            component: () => import('_v/settings/account/argument_true.vue')
          },
          {
            path: 'scheme_index',
            name: 'scheme_index',
            meta: {
              title: '多栏账方案'
            },
            component: () => import('_v/settings/account/scheme.vue')
          },
          {
            path: 'scheme_create',
            name: 'create_scheme',
            meta: {
              title: '新增多栏账方案',
              hide: true
            },
            component: () => import('_v/settings/account/create_scheme.vue')
          },
          {
            path: 'scheme_update',
            name: 'update_scheme',
            meta: {
              title: '查看多栏账方案',
              hide: true
            },
            component: () => import('_v/settings/account/update_scheme.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/operation',
    name: 'operation',
    meta: {
      icon: '_yunwei',
      title: '系统运维'
    },
    component: Main,
    children: [
      {
        path: 'log',
        name: '_operation_log',
        meta: {
          title: '日志管理'
        },
        component: Home,
        children: [
          {
            path: 'log_index',
            name: 'log_index',
            meta: {
              title: '操作日志管理'
            },
            component: () => import('_v/operation/log.vue')
          }
        ]
      }
    ]
  }
]

export const routes = [
  {
    path: '/welcome',
    name: 'welcome',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/welcome.vue')
  },
  {
    path: '/',
    name: '__home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: 'home',
      name: '_home',
      redirect: '/home',
      meta: {
        hideInMenu: true,
        notCache: true
      },
      component: Home,
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            hideInMenu: true,
            title: '首页',
            notCache: true,
            icon: '_menu_icon_'
          },
          component: () => import('_v/index')
        }
      ]
    }]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('_v/error-page/404.vue')
  }
]
