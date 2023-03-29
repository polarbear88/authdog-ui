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
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
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
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Dashboard-Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'workplace',
        component: () => import('@/views/Dashboard/Workplace.vue'),
        name: 'Dashboard-Workplace',
        meta: {
          title: t('router.workplace'),
          noCache: true
        }
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
