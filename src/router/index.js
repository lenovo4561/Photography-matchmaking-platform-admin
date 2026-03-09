import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "数据概览", icon: "dashboard" },
      },
    ],
  },
  {
    path: "/users",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Users",
        component: () => import("@/views/users/index"),
        meta: { title: "用户管理", icon: "el-icon-user" },
      },
    ],
  },
  {
    path: "/photographers",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Photographers",
        component: () => import("@/views/photographers/index"),
        meta: { title: "摄影师审核", icon: "el-icon-camera" },
      },
    ],
  },
  {
    path: "/content",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Content",
        component: () => import("@/views/content/index"),
        meta: { title: "内容审核", icon: "el-icon-picture" },
      },
    ],
  },
  {
    path: "/orders",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Orders",
        component: () => import("@/views/orders/index"),
        meta: { title: "订单管理", icon: "el-icon-document" },
      },
    ],
  },
  {
    path: "/finance",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Finance",
        component: () => import("@/views/finance/index"),
        meta: { title: "财务管理", icon: "el-icon-money" },
      },
    ],
  },
  {
    path: "/distributor",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Distributor",
        component: () => import("@/views/distributor/index"),
        meta: { title: "分销管理", icon: "el-icon-share" },
      },
    ],
  },
  {
    path: "/settings",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Settings",
        component: () => import("@/views/settings/index"),
        meta: { title: "系统设置", icon: "el-icon-setting" },
      },
    ],
  },
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
