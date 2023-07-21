import { createRouter, createWebHistory } from "vue-router";
import Style from "@/views/StyleView.vue";

const routes = [
  {
    meta: {
      title: "Fleet",
    },
    path: "/",
    name: "Fleet",
    component: () => import("@/views/ListView.vue"),
  },
  {
    meta: {
      title: "ChargingMapView",
    },
    path: "/ChargingMapView",
    name: "ChargingMapView",
    component: () => import("@/views/ChargingMapView.vue"),
  },
  {
    meta: {
      title: "FleetOverview",
    },
    path: "/FleetOverview",
    name: "FleetOverview",
    component: () => import("@/views/FleetOverview.vue"),
  },
  {
    meta: {
      title: "FleetTrackingView",
    },
    path: "/FleetTrackingView",
    name: "FleetTrackingView",
    component: () => import("@/views/FleetTrackingView.vue"),
  },
  {
    meta: {
      title: "FleetRepairView",
    },
    path: "/FleetRepairView",
    name: "FleetRepairView",
    component: () => import("@/views/FleetRepairView.vue"),
  },
  {
    meta: {
      title: "PermissionsAccountView",
    },
    path: "/PermissionsAccountView",
    name: "PermissionsAccountView",
    component: () => import("@/views/PermissionsAccountView.vue"),
  },
  {
    meta: {
      title: "PermissionsPageView",
    },
    path: "/PermissionsPageView",
    name: "PermissionsPageView",
    component: () => import("@/views/PermissionsPageView.vue"),
  },
  {
    meta: {
      title: "BMS",
    },
    path: "/bms",
    name: "BMS",
    component: () => import("@/views/BatteryManageSystem.vue"),
  },
  {
    meta: {
      title: "Car",
    },
    path: "/car",
    name: "car",
    component: () => import("@/views/CarView.vue"),
  },
  {
    meta: {
      title: "List",
    },
    path: "/List",
    name: "List",
    component: () => import("@/views/ListView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/Profile",
    name: "Profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/Login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/:xxx(.*)*", //報錯顯示404頁面
    name: "Error",
    component: () => import("@/views/ErrorView.vue"),
  },
  {
    meta: {
      title: "test",
    },
    path: "/test", //報錯顯示404頁面
    name: "test",
    component: () => import("@/views/testView.vue"),
  },
  {
    meta: {
      title: "test2",
    },
    path: "/test2", //報錯顯示404頁面
    name: "test2",
    component: () => import("@/views/test2.vue"),
  },
  {
    meta: {
      title: "test3",
    },
    path: "/test3", //報錯顯示404頁面
    name: "test3",
    component: () => import("@/views/test3.vue"),
  },
  {
    meta: {
      title: "testEV",
    },
    path: "/testEV", //報錯顯示404頁面
    name: "testEV",
    component: () => import("@/views/testEV.vue"),
  },
  {
    meta: {
      title: "testMapFleet",
    },
    path: "/testMapFleet", //報錯顯示404頁面
    name: "testMapFleet",
    component: () => import("@/views/testMapFleet.vue"),
  },
  {
    meta: {
      title: "testLocationHistory",
    },
    path: "/testLocationHistory", //報錯顯示404頁面
    name: "testLocationHistory",
    component: () => import("@/views/testLocationHistory.vue"),
  },
  {
    meta: {
      title: "testMap",
    },
    path: "/testMap", //報錯顯示404頁面
    name: "testMap",
    component: () => import("@/views/testMap.vue"),
  },
  {
    meta: {
      title: "RouteItinerary",
    },
    path: "/RouteItinerary", //報錯顯示404頁面
    name: "RouteItinerary",
    component: () => import("@/views/RouteItinerary.vue"),
  },
  {
    meta: {
      title: "Register",
    },
    path: "/Register", //報錯顯示404頁面
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

export default router;
