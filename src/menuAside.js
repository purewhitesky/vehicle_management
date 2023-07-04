import {
  mdiAccountCircle,
  mdiLock,
  mdiPalette,
  mdiCarWrench,
  mdiLightningBoltCircle,
  mdiAccountSettings,
  mdiApplicationSettings,
  mdiTabletDashboard,
  mdiCarMultiple,
  mdiMap,
  mdiWrenchClock,
  mdiTire,
  mdiEvStation,
  mdiCardAccountDetailsOutline,
} from "@mdi/js";

export default [
  /*{
    to: "/FleetOverview",
    label: "Fleet overview",
    
    //icon: mdiCarMultiple,
    menu: [
      {
        to: "/list",
        label: "list",
        
        //icon: mdiCarMultiple,
      },
      {
        label: "Item Two",
      },
    ],
  },*/
  /*{
    to: "/car",
    
    //icon: mdiCar,
    label: "Car",
  },*/
  {
    to: "/FleetOverview",
    label: "Dashboard",

    icon: mdiTabletDashboard,
  },
  {
    to: "/list",
    label: "Vehicles",

    icon: mdiCarMultiple,
  },
  {
    to: "/testEV",
    label: "ChargingMap",

    icon: mdiMap,
  },
  {
    to: "/FleetRepairView",
    label: "PHM",

    icon: mdiWrenchClock,
  },
  {
    label: "Tire Analysis",

    icon: mdiTire,
  },
  {
    label: "DMS",

    icon: mdiCardAccountDetailsOutline,
  },
  {
    label: "CPO",

    icon: mdiEvStation,
  },

  /*{
    to: "/FleetTrackingView",
    label: "FleetTracking",

    //icon: mdiMap,
  },

  {
    to: "/Profile",
    label: "Profile",

    //icon: mdiAccountCircle,
  },
  {
    to: "/PermissionsAccountView",
    label: "PermissionsAccount",

    //icon: mdiAccountSettings,
  },
  {
    to: "/PermissionsPageView",
    label: "PermissionsPage",

    //icon: mdiApplicationSettings,
  },
  {
    to: "/Login",
    label: "Login",

    //icon: mdiLock,
  },*/
  /*{
    to: "/error",
    label: "Error",
    
    //icon: mdiAlertCircle,
  },
  {
    label: "Dropdown",
    
    //icon: mdiViewList,
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
