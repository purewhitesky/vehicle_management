<script setup>
import { ref, onMounted, watchEffect } from "vue";
import {
  apiNotifications,
  apiGeofencing,
  apipostReport,
} from "@/api/apiTomtom";

/*let aData = new Date();
let Month =
  aData.getMonth() < 9 ? "0" + (aData.getMonth() + 1) : aData.getMonth() + 1;
let Hours = aData.getHours() <= 9 ? "0" + aData.getHours() : aData.getHours();
let Minutes =
  aData.getMinutes() <= 9 ? "0" + aData.getMinutes() : aData.getMinutes();
let Seconds =
  aData.getSeconds() <= 9 ? "0" + aData.getSeconds() : aData.getSeconds();
let timeData =
  aData.getFullYear() +
  "-" +
  Month +
  "-" +
  aData.getDate() +
  "T" +
  Hours +
  ":" +
  Minutes +
  ":" +
  Seconds;

let startTime =
  aData.getFullYear() + "-" + Month + "-" + aData.getDate() + "T00:00:00";

let endTime =
  aData.getFullYear() +
  "-" +
  Month +
  "-" +
  aData.getDate() +
  "T" +
  Hours +
  ":" +
  Minutes +
  ":" +
  Seconds;

let nID = "88733ea3-a08c-4cf3-9964-3a5780fec8a1";
let rID = "e5b54400-0189-4882-b544-000189888216";
let pID = "296dd4f8-ac9f-4522-8e90-228356dba920";
let oID = "e9fa9544-5160-4439-a947-6dfb128a00ea";

const NotificationData = ref();
const NotificationsGetContactGroupDetails = () => {
  apiNotifications.GetContactGroupDetails(nID).then((res) => {
    NotificationData.value = res.data;
    console.log(res);
  });
};
const allTomTomData = ref();
const apiGeofencingGetAlertRule = () => {
  apiGeofencing.GetAlertRule(rID).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};

const getReport = (lng, lat, objectName = "") => {
  apipostReport(pID, lng, lat, 0, oID, 0, timeData).then((res) => {
    console.log(res.data);
  });
};

const go = (num) => {
  const a = { lng: 121.39261024164468, lat: 25.150295173645087 };
  const b = { lng: 121.40124868672756, lat: 25.157536259951303 };
  if (num == 0) {
    getReport(a.lng, a.lat);
  }
  if (num == 1) {
    getReport(b.lng, b.lat);
  }
};

const History = ref();
const apiGeofencingListAlertHistory = () => {
  apiGeofencing.ListAlertHistory(startTime, endTime).then((res) => {
    History.value = res.data;
    console.log(res);
  });
};*/

import echatsCard from "@/components/Echarts/echatsCard.vue";
import echatsPie from "@/components/Echarts/pie.vue";

const postData = ref({
  date: "",
  tripsNumber: 260,
  data: {
    availability: {
      name: "Operating",
      pieColor: "#00DB00",
      total: 200,
      events: {
        roomTemperatureDelivery: 100,
        freezingDelivery: 30,
        refrigerationDelivery: 50,
        otherDelivery: 20,
      },
      eventsName: ["roomTemperature", "freezing", "refrigeration", "other"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    repair: {
      name: "Repair",
      pieColor: "#FFD306",
      total: 40,
      events: {
        toBeRepairedBreakdownNumber: 10,
        toBeRepairedAccident: 7,
        toBeRepairedRoutineMaintenance: 13,
        underRepairBreakdownNumber: 5,
        underRepairAccident: 3,
        underRepairRoutineMaintenance: 2,
      },
      eventsName: [
        "Repaired BreakdownNumber",
        "Repaired Accident",
        "Repaired RoutineMaintenance",
        "underRepair BreakdownNumber",
        "underRepair Accident",
        "underRepair RoutineMaintenance",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    breakdown: {
      name: "Break Down",
      pieColor: "#FF2D2D",
      total: 15,
      events: {
        tire: 3,
        battery: 5,
        powerChain: 1,
        EEA: 2,
        brakes: 4,
      },
      eventsName: ["Tire", "Battery", "PowerChain", "EEA", "Brakes"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 7 },
        { vid: "MIH0002", eventsNumber: 9 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    accident: {
      name: "Accident",
      pieColor: "#FF2D2D",
      total: 10,
      events: {
        pending: 6,
        partyAResponsibilities: 3,
        partyBResponsibilities: 1,
      },
      eventsName: [
        "Pending",
        "PartyA Responsibilities",
        "PartyB Responsibilities",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 1 },
        { vid: "MIH0002", eventsNumber: 7 },
        { vid: "MIH0003", eventsNumber: 8 },
        { vid: "MIH0004", eventsNumber: 2 },
      ],
    },
  },
});
const Data1 = ref({
  date: "",
  tripsNumber: 260,
  data: {
    availability: {
      name: "Operating",
      pieColor: "#00DB00",
      total: 200,
      events: {
        roomTemperatureDelivery: 100,
        freezingDelivery: 30,
        refrigerationDelivery: 50,
        otherDelivery: 20,
      },
      eventsName: ["roomTemperature", "freezing", "refrigeration", "other"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    repair: {
      name: "Repair",
      pieColor: "#FFD306",
      total: 40,
      events: {
        toBeRepairedBreakdownNumber: 10,
        toBeRepairedAccident: 7,
        toBeRepairedRoutineMaintenance: 13,
        underRepairBreakdownNumber: 5,
        underRepairAccident: 3,
        underRepairRoutineMaintenance: 2,
      },
      eventsName: [
        "Repaired BreakdownNumber",
        "Repaired Accident",
        "Repaired RoutineMaintenance",
        "underRepair BreakdownNumber",
        "underRepair Accident",
        "underRepair RoutineMaintenance",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    breakdown: {
      name: "Break Down",
      pieColor: "#FF2D2D",
      total: 15,
      events: {
        tire: 3,
        battery: 5,
        powerChain: 1,
        EEA: 2,
        brakes: 4,
      },
      eventsName: ["Tire", "Battery", "PowerChain", "EEA", "Brakes"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 7 },
        { vid: "MIH0002", eventsNumber: 9 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    accident: {
      name: "Accident",
      pieColor: "#FF2D2D",
      total: 10,
      events: {
        pending: 6,
        partyAResponsibilities: 3,
        partyBResponsibilities: 1,
      },
      eventsName: [
        "Pending",
        "PartyA Responsibilities",
        "PartyB Responsibilities",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 1 },
        { vid: "MIH0002", eventsNumber: 7 },
        { vid: "MIH0003", eventsNumber: 8 },
        { vid: "MIH0004", eventsNumber: 2 },
      ],
    },
  },
});
const Data2 = ref({
  date: "",
  tripsNumber: 260,
  data: {
    availability: {
      name: "Operating",
      pieColor: "#00DB00",
      total: 150,
      events: {
        roomTemperatureDelivery: 80,
        freezingDelivery: 10,
        refrigerationDelivery: 40,
        otherDelivery: 10,
      },
      eventsName: ["roomTemperature", "freezing", "refrigeration", "other"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    repair: {
      name: "Repair",
      pieColor: "#FFD306",
      total: 25,
      events: {
        toBeRepairedBreakdownNumber: 3,
        toBeRepairedAccident: 10,
        toBeRepairedRoutineMaintenance: 6,
        underRepairBreakdownNumber: 2,
        underRepairAccident: 1,
        underRepairRoutineMaintenance: 3,
      },
      eventsName: [
        "Repaired BreakdownNumber",
        "Repaired Accident",
        "Repaired RoutineMaintenance",
        "underRepair BreakdownNumber",
        "underRepair Accident",
        "underRepair RoutineMaintenance",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 10 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    breakdown: {
      name: "Break Down",
      pieColor: "#FF2D2D",
      total: 26,
      events: {
        tire: 6,
        battery: 3,
        powerChain: 2,
        EEA: 5,
        brakes: 10,
      },
      eventsName: ["Tire", "Battery", "PowerChain", "EEA", "Brakes"],
      carlist: [
        { vid: "MIH0001", eventsNumber: 7 },
        { vid: "MIH0002", eventsNumber: 9 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 1 },
      ],
    },
    accident: {
      name: "Accident",
      pieColor: "#FF2D2D",
      total: 31,
      events: {
        pending: 10,
        partyAResponsibilities: 6,
        partyBResponsibilities: 15,
      },
      eventsName: [
        "Pending",
        "PartyA Responsibilities",
        "PartyB Responsibilities",
      ],
      carlist: [
        { vid: "MIH0001", eventsNumber: 1 },
        { vid: "MIH0002", eventsNumber: 7 },
        { vid: "MIH0003", eventsNumber: 8 },
        { vid: "MIH0004", eventsNumber: 2 },
      ],
    },
  },
});

const post = ref([]);
let postObjects = Object.values(postData.value.data);
postObjects.forEach((item, index) => {
  let itemObjects = Object.values(item.events);
  let eventData = [["score", "product"]];
  itemObjects.forEach((event, index) => {
    eventData.push([event, item.eventsName[index]]);
  });
  post.value.push({
    pieColor: item.pieColor,
    name: item.name,
    num: ((item.total / postData.value.tripsNumber) * 100).toFixed(0),
    maxY: item.total,
    listCar: item.carlist,
    barData: { source: eventData },
  });
});
const post2 = ref([
  {
    name: postData.value.data.availability.name,
    value:
      (postData.value.data.availability.total / postData.value.tripsNumber) *
      100,
  },
  {
    name: postData.value.data.repair.name,
    value:
      (postData.value.data.repair.total / postData.value.tripsNumber) * 100,
  },
  {
    name: "Idle",
    value:
      ((postData.value.tripsNumber -
        postData.value.data.availability.total -
        postData.value.data.repair.total) /
        postData.value.tripsNumber) *
      100,
  },
]);

const updataPost = () => {
  post.value = [];
  post2.value = [];

  let postObjects = Object.values(postData.value.data);
  postObjects.forEach((item, index) => {
    let itemObjects = Object.values(item.events);
    let eventData = [["score", "product"]];
    itemObjects.forEach((event, index) => {
      eventData.push([event, item.eventsName[index]]);
    });
    post.value.push({
      pieColor: item.pieColor,
      name: item.name,
      num: ((item.total / postData.value.tripsNumber) * 100).toFixed(0),
      maxY: item.total,
      listCar: item.carlist,
      barData: { source: eventData },
    });
  });

  let IdleNum =
    postData.value.tripsNumber -
    postData.value.data.availability.total -
    postData.value.data.repair.total;

  if (IdleNum > 0) {
    post2.value = [
      {
        name: postData.value.data.availability.name,
        value: postData.value.data.availability.total,
      },
      {
        name: postData.value.data.repair.name,
        value: postData.value.data.repair.total,
      },
      {
        name: "Idle",
        value: IdleNum,
      },
    ];
  } else {
    post2.value = [
      {
        name: postData.value.data.availability.name,
        value: postData.value.data.availability.total,
      },
      {
        name: postData.value.data.repair.name,
        value: postData.value.data.repair.total,
      },
    ];
  }
};

/*
const post = ref([
  {
    pieColor: postData.value.value.availability.pieColor,
    name: "出車率",
    num: (postData.value.value.availability.total / postData.value.value.tripsNumber) * 100,
    barData: {
      source: [
        ["score", "product"],
        [postData.value.value.availability.roomTemperatureDelivery, "常溫"],
        [postData.value.value.availability.freezingDelivery, "冷凍"],
        [postData.value.value.availability.refrigerationDelivery, "冷藏"],
        [postData.value.value.availability.otherDelivery, "其他"],
      ],
    },
  },
  {
    pieColor: postData.value.value.repair.pieColor,
    name: "維修率",
    num: (postData.value.value.repair.total / postData.value.value.tripsNumber) * 100,
    barData: {
      source: [
        ["score", "product"],
        [postData.value.value.repair.underRepair.breakdownNumber, "維修中-故障"],
        [postData.value.value.repair.underRepair.accident, "維修中-事故"],
        [
          postData.value.value.repair.underRepair.routineMaintenance,
          "維修中-例行維修",
        ],
        [postData.value.value.repair.toBeRepaired.breakdownNumber, "待維修-故障"],
        [postData.value.value.repair.toBeRepaired.accident, "待維修-事故"],
        [
          postData.value.value.repair.toBeRepaired.routineMaintenance,
          "待維修-例行維修",
        ],
      ],
    },
  },
  {
    name: "故障率",
    num: 18,
    barData: {
      source: [
        ["score", "product"],
        [60, "輪胎"],
        [10, "電池"],
        [20, "Power Chain"],
        [7, "EEA"],
        [7, "煞車"],
      ],
    },
  },

  {
    name: "事故率",
    num: 10,
    barData: {
      source: [
        ["score", "product"],
        [60, "待處理"],
        [10, "甲方責任"],
        [20, "乙方責任"],
      ],
    },
  },
]);*/
const change = ref(true);
setInterval(() => {
  change.value = !change.value;
  if (change.value) {
    postData.value = Data2.value;
  } else {
    postData.value = Data1.value;
  }
  console.log();
  postData.value.tripsNumber = (Math.random() * 120 + 200).toFixed(0);
  console.log(postData.value);
  updataPost();
}, 1000);
</script>
<template>
  <div class="grid grid-cols-4 bg-blue-200 lg:grid-cols-7">
    <div v-for="data in post">
      <echatsCard v-bind="data"></echatsCard>
    </div>
    <div
      class="col-span-4 row-start-1 h-[300px] lg:col-span-3 lg:row-auto lg:h-screen"
    >
      <echatsPie class="h-[100%]" :pieData="post2"></echatsPie>
    </div>
  </div>
  <!--<button
    class="m-2 rounded-xl border-2 text-lg"
    @click="apiGeofencingGetAlertRule"
  >
    按下
  </button>
  <div v-if="allTomTomData">
    <div>ID：{{ allTomTomData.id }}</div>
    <div>name：{{ allTomTomData.name }}</div>
    <div>project：{{ allTomTomData.project }}</div>
    <div>fence：{{ allTomTomData.fence }}</div>
    <div>object：{{ allTomTomData.object }}</div>
    <div>notificationGroup：{{ allTomTomData.notificationGroup }}</div>
    <div>enabled：{{ allTomTomData.enabled }}</div>
    <div>alertType：{{ allTomTomData.alertType }}</div>
    <div>alertRuleConstraints：{{ allTomTomData.alertRuleConstraints }}</div>
  </div>
  <button
    class="m-2 rounded-xl border-2 text-lg"
    @click="NotificationsGetContactGroupDetails"
  >
    按下
  </button>
  <div v-if="NotificationData">
    <div>Notification：{{ NotificationData }}</div>
  </div>

  <button class="m-2 rounded-xl border-2 text-lg" @click="go(0)">a按下</button>
  <button class="m-2 rounded-xl border-2 text-lg" @click="go(1)">b按下</button>
  <button
    class="m-2 rounded-xl border-2 text-lg"
    @click="apiGeofencingListAlertHistory"
  >
    歷史
  </button>
  <div v-if="History">
    <div>History：{{ History }}</div>
  </div>-->
  <div></div>
</template>
