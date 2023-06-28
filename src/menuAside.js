import {
  mdiAccountCircle,
  mdiLock,
  mdiPalette,
  mdiCarMultiple,
  mdiMap,
  mdiCarWrench,
  mdiLightningBoltCircle,
  mdiAccountSettings,
  mdiApplicationSettings,
} from "@mdi/js";

export default [
  /*{
    to: "/FleetOverview",
    label: "Fleet overview",
    icon: mdiCarMultiple,
    menu: [
      {
        to: "/list",
        label: "list",
        icon: mdiCarMultiple,
      },
      {
        label: "Item Two",
      },
    ],
  },*/
  /*{
    to: "/car",
    icon: mdiCar,
    label: "Car",
  },*/
  {
    to: "/FleetOverview",
    label: "FleetOverview",
    icon: mdiCarMultiple,
  },
  {
    to: "/FleetTrackingView",
    label: "FleetTracking",
    icon: mdiMap,
  },
  {
    to: "/FleetRepairView",
    label: "FleetRepair",
    icon: mdiCarWrench,
  },
  /*{
    to: "/",
    label: "Styles",
    icon: mdiPalette,
  },*/
  {
    to: "/list",
    label: "List",
    icon: mdiAccountCircle,
  },
  {
    to: "/ChargingMapView",
    label: "ChargingMap",
    icon: mdiLightningBoltCircle,
  },
  {
    to: "/Profile",
    label: "Profile",
    icon: mdiAccountCircle,
  },
  {
    to: "/PermissionsAccountView",
    label: "PermissionsAccount",
    icon: mdiAccountSettings,
  },
  {
    to: "/PermissionsPageView",
    label: "PermissionsPage",
    icon: mdiApplicationSettings,
  },
  {
    to: "/Login",
    label: "Login",
    icon: mdiLock,
  },
  /*{
    to: "/error",
    label: "Error",
    icon: mdiAlertCircle,
  },
  {
    label: "Dropdown",
    icon: mdiViewList,
    menu: [
      {
        label: "Item One",
      },
      {
        label: "Item Two",
      },
    ],
  },*/
];
