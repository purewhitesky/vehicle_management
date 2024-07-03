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
  mdiBattery,
  mdiListBox,
  mdiTrainCar,
  mdiAlert,
  mdiRoadVariant,
  mdiRegisteredTrademark,
  mdiCar,
} from "@mdi/js";

export default [
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
    to: "/bms",
    label: "Battery",

    icon: mdiBattery,
  },
  {
    to: "/ListItineraryMap2",
    label: "ListItinerary",

    icon: mdiListBox,
  },
  {
    to: "/vehicleTransportation",
    label: "Transportation",

    icon: mdiTrainCar,
  },
  {
    to: "/T",
    label: "Transportation2",

    icon: mdiTrainCar,
  },
  {
    to: "/testAlert",
    label: "Alert",

    icon: mdiAlert,
  },
  {
    to: "/testMapFleet",
    label: "MapFleet",

    icon: mdiRoadVariant,
  },
  {
    to: "/Register",
    label: "Register",

    icon: mdiRegisteredTrademark,
  },
  {
    to: "/car",
    label: "car",

    icon: mdiCar,
  },
];
