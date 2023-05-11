import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/jump',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/jump',
    component: () => import('@/views/Dashboard/Jump.vue'),
    name: 'Jump',
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/saler-login',
    component: () => import('@/views/SalerLogin/Login.vue'),
    name: 'SalerLogin',
    meta: {
      hidden: true,
      title: '代理登录',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/jump',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'main',
        component: () => import('@/views/DeveloperConsole/index.vue'),
        name: 'Dashboard-Developer',
        meta: {
          title: '首页'
        },
        roles: ['developer']
      },
      {
        path: 'analysis',
        component: () => import('@/views/DeveloperConsole/Analysis.vue'),
        name: 'Analysis-Developer',
        meta: {
          title: '分析'
        },
        roles: ['developer']
      },
      {
        path: 'main-saler',
        component: () => import('@/views/SalerConsole/index.vue'),
        name: 'Dashboard-Saler',
        meta: {
          title: '首页'
        },
        roles: ['saler']
      }
    ]
  },
  {
    path: '/saler-recharge-card',
    component: Layout,
    redirect: '/saler-recharge-card/list',
    name: 'Saler-RechargeCard',
    meta: {
      title: '充值卡管理',
      icon: 'ic:round-credit-card',
      alwaysShow: true
    },
    roles: ['saler'],
    children: [
      {
        path: 'list',
        component: () => import('@/views/SalerView/RechargeCardList.vue'),
        name: 'Saler-RechargeCardList',
        meta: {
          title: '充值卡管理'
        },
        roles: ['saler']
      },
      {
        path: 'make-card',
        component: () => import('@/views/SalerView/CreateRechargeCard/CreateRechargeCard.vue'),
        name: 'Saler-CreateRechargeCard',
        meta: {
          title: '制作充值卡'
        },
        roles: ['saler']
      },
      {
        path: 'fast-action',
        component: () => import('@/views/SalerView/FastAction.vue'),
        name: 'Saler-FastAction',
        meta: {
          title: '充值卡操作'
        },
        roles: ['saler']
      }
    ]
  },
  {
    path: '/saler-subordinate',
    component: Layout,
    redirect: '/saler-subordinate/manage',
    name: 'Saler-Subordinate',
    meta: {
      title: '下级代理',
      icon: 'bi:people-fill',
      alwaysShow: true
    },
    roles: ['saler'],
    children: [
      {
        path: 'manage',
        component: () => import('@/views/SalerView/Subordinate.vue'),
        name: 'Saler-Subordinate-Manage',
        meta: {
          title: '下级代理管理'
        },
        roles: ['saler']
      },
      {
        path: 'entry-link',
        component: () => import('@/views/SalerView/EntryLink.vue'),
        name: 'Saler-EntryLink',
        meta: {
          title: '下级代理入口'
        },
        roles: ['saler']
      },
      {
        path: 'subordinate-price',
        component: () => import('@/views/SalerView/SubordinatePrice.vue'),
        name: 'Saler-SubordinatePrice',
        meta: {
          title: '下级代理价格'
        },
        roles: ['saler']
      },
      {
        path: 'subordinate-roles',
        component: () => import('@/views/SalerView/SalerRoles.vue'),
        name: 'Saler-SubordinateRoles',
        meta: {
          title: '角色管理'
        },
        roles: ['saler']
      },
      {
        path: 'subordinate-notice',
        component: () => import('@/views/SalerView/SalerNotice.vue'),
        name: 'Saler-SubordinateNotice',
        meta: {
          title: '下级代理公告'
        }
      }
    ]
  },
  {
    path: '/saler-account',
    component: Layout,
    redirect: '/saler-account/fundflow',
    name: 'Saler-Account',
    meta: {
      title: '账户',
      icon: 'ic:baseline-account-circle',
      alwaysShow: true
    },
    roles: ['saler'],
    children: [
      {
        path: 'fundflow',
        component: () => import('@/views/SalerView/FundFlow.vue'),
        name: 'Saler-FundFlow',
        meta: {
          title: '资金明细'
        },
        roles: ['saler']
      },
      {
        path: 'change-password',
        component: () => import('@/views/SalerView/ChangePassword.vue'),
        name: 'Saler-ChangePassword',
        meta: {
          title: '修改密码'
        },
        roles: ['saler']
      }
    ]
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/list',
    name: 'Application',
    meta: {
      title: t('router.application'),
      icon: 'icon-park-solid:all-application',
      alwaysShow: true
    },
    roles: ['developer'],
    children: [
      {
        path: 'list',
        component: () => import('@/views/Application/List.vue'),
        name: 'Application-List',
        meta: {
          title: t('router.applist')
        }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/Application/Detail.vue'),
        name: 'Application-Detail',
        meta: {
          title: '应用详情',
          hidden: true,
          canTo: true
        }
      },
      {
        path: 'fastAction',
        component: () => import('@/views/Application/FastAction.vue'),
        name: 'Application-FastAction',
        meta: {
          title: '充值卡操作'
        }
      },
      {
        path: 'feedback',
        component: () => import('@/views/Application/Feedback.vue'),
        name: 'Application-Feedback',
        meta: {
          title: '用户反馈'
        }
      }
    ]
  },
  {
    path: '/clouddata',
    component: Layout,
    redirect: '/clouddata/var',
    name: 'Clouddata',
    meta: {
      title: '云数据',
      icon: 'material-symbols:cloud',
      alwaysShow: true
    },
    roles: ['developer'],
    children: [
      {
        path: 'var',
        component: () => import('@/views/CloudData/Cloudvar.vue'),
        name: 'Clouddata-Var',
        meta: {
          title: '云变量'
        }
      },
      {
        path: 'fun',
        component: () => import('@/views/CloudData/Cloudfun.vue'),
        name: 'Clouddata-Fun',
        meta: {
          title: '云函数'
        }
      },
      {
        path: 'userdata',
        component: () => import('@/views/CloudData/UserData.vue'),
        name: 'Clouddata-UserData',
        meta: {
          title: '用户数据'
        }
      }
    ]
  },
  {
    path: '/saler',
    component: Layout,
    redirect: '/saler/list',
    name: 'Saler',
    meta: {
      title: '代理',
      icon: 'bi:people-fill',
      alwaysShow: true
    },
    roles: ['developer'],
    children: [
      {
        path: 'list',
        component: () => import('@/views/Saler/SalerList.vue'),
        name: 'Saler-List',
        meta: {
          title: '代理管理'
        }
      },
      {
        path: 'entry-link',
        component: () => import('@/views/Saler/EntryLink.vue'),
        name: 'Saler-EntryLink',
        meta: {
          title: '入口链接'
        }
      },
      {
        path: 'saler-roles',
        component: () => import('@/views/Saler/SalerRoles.vue'),
        name: 'Saler-Roles',
        meta: {
          title: '代理角色'
        }
      },
      {
        path: 'saler-notice',
        component: () => import('@/views/Saler/SalerNotice.vue'),
        name: 'Saler-Notice',
        meta: {
          title: '代理公告'
        }
      },
      {
        path: 'saler-notice-topsaler',
        component: () => import('@/views/Saler/SalerNoticeTopSaler.vue'),
        name: 'Saler-Notice-TopSaler',
        meta: {
          title: '顶级代理公告'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/fund-flow',
    name: 'Finance',
    meta: {
      title: '财务',
      icon: 'icon-park-solid:finance',
      alwaysShow: true
    },
    roles: ['developer'],
    children: [
      {
        path: 'fund-flow',
        component: () => import('@/views/Finance/FundFlow.vue'),
        name: 'Finance-FundFlow',
        meta: {
          title: '资金明细'
        }
      },
      {
        path: 'user-financial',
        component: () => import('@/views/Finance/UserFinancial.vue'),
        name: 'Finance-UserFinancial',
        meta: {
          title: '用户明细'
        }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/change-password',
    name: 'Account',
    meta: {
      title: '账户',
      icon: 'ic:baseline-account-circle',
      alwaysShow: true
    },
    roles: ['developer'],
    children: [
      {
        path: 'change-password',
        component: () => import('@/views/Account/ChangePassword.vue'),
        name: 'Account-ChangePassword',
        meta: {
          title: '修改密码'
        }
      },
      {
        path: 'jwt-token',
        component: () => import('@/views/Account/JWTToken.vue'),
        name: 'Account-JWTToken',
        meta: {
          title: 'jwt令牌'
        }
      }
    ]
  }

  // {
  //   path: '/authorization',
  //   component: Layout,
  //   redirect: '/authorization/user',
  //   name: 'Authorization',
  //   meta: {
  //     title: t('router.authorization'),
  //     icon: 'eos-icons:role-binding',
  //     alwaysShow: true
  //   },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/Authorization/User.vue'),
  //       name: 'User',
  //       meta: {
  //         title: t('router.user')
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/Authorization/Role.vue'),
  //       name: 'Role',
  //       meta: {
  //         title: t('router.role')
  //       }
  //     }
  //   ]
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
