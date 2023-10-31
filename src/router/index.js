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
    path: "/test",
    name: "test",
    component: () => import("@/views/testView.vue"),
  },
  {
    meta: {
      title: "test2",
    },
    path: "/test2",
    name: "test2",
    component: () => import("@/views/test2.vue"),
  },
  {
    meta: {
      title: "test3",
    },
    path: "/test3",
    name: "test3",
    component: () => import("@/views/test3.vue"),
  },
  {
    meta: {
      title: "testEV",
    },
    path: "/testEV",
    name: "testEV",
    component: () => import("@/views/testEV.vue"),
    meta: { requireAuth: true },
  },
  {
    meta: {
      title: "testEV2",
    },
    path: "/testEV2",
    name: "testEV2",
    component: () => import("@/views/outWEB/testEV.vue"),
    meta: { requireAuth: true },
  },
  {
    meta: {
      title: "testMapFleet",
    },
    path: "/testMapFleet",
    name: "testMapFleet",
    component: () => import("@/views/testMapFleet.vue"),
  },
  {
    meta: {
      title: "testAlert",
    },
    path: "/testAlert",
    name: "testAlert",
    component: () => import("@/views/testAlert.vue"),
  },
  {
    meta: {
      title: "testLocationHistory",
    },
    path: "/testLocationHistory",
    name: "testLocationHistory",
    component: () => import("@/views/testLocationHistory.vue"),
  },
  {
    meta: {
      title: "testMap",
    },
    path: "/testMap",
    name: "testMap",
    component: () => import("@/views/testMap.vue"),
  },
  {
    meta: {
      title: "testMap",
    },
    path: "/testMap",
    name: "testMap",
    component: () => import("@/views/testMap.vue"),
  },
  {
    meta: {
      title: "testTire",
    },
    path: "/testTire",
    name: "testTire",
    component: () => import("@/views/testTire.vue"),
  },
  {
    meta: {
      title: "T",
    },
    path: "/T",
    name: "T",
    component: () => import("@/views/T.vue"),
  },
  {
    meta: {
      title: "RouteItinerary",
    },
    path: "/RouteItinerary/:id",
    name: "RouteItinerary/:id",
    component: () => import("@/views/RouteItinerary.vue"),
  },
  {
    meta: {
      title: "ListItinerary",
    },
    path: "/ListItinerary",
    name: "ListItinerary",
    component: () => import("@/views/ListItinerary.vue"),
  },
  {
    meta: {
      title: "RouteItinerary2",
    },
    path: "/RouteItinerary2/:id",
    name: "RouteItinerary2/:id",
    component: () => import("@/views/outWEB/RouteItinerary.vue"),
  },
  {
    meta: {
      title: "ListItineraryMap2",
    },
    path: "/ListItineraryMap2",
    name: "ListItineraryMap2",
    component: () => import("@/views/outWEB/ListItineraryMap.vue"),
  },
  {
    meta: {
      title: "ListItineraryMap",
    },
    path: "/ListItineraryMap",
    name: "ListItineraryMap",
    component: () => import("@/views/ListItineraryMap.vue"),
  },
  {
    meta: {
      title: "SeeTomTom",
    },
    path: "/SeeTomTom",
    name: "SeeTomTom",
    component: () => import("@/views/SeeTomTom.vue"),
  },
  {
    meta: {
      title: "Register",
    },
    path: "/Register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
  {
    meta: {
      title: "vehicleTransportation",
    },
    path: "/vehicleTransportation",
    name: "vehicleTransportation",
    component: () => import("@/views/outWEB/vehicleTransportation.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, from) => {
  if (to.meta.requireAuth) {
  }
});

export default router;
