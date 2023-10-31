<script setup>
import { ref } from "vue";

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
        { vid: "MIH0001", eventsNumber: 60 },
        { vid: "MIH0002", eventsNumber: 40 },
        { vid: "MIH0003", eventsNumber: 30 },
        { vid: "MIH0004", eventsNumber: 70 },
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
        { vid: "MIH0001", eventsNumber: 15 },
        { vid: "MIH0002", eventsNumber: 5 },
        { vid: "MIH0003", eventsNumber: 10 },
        { vid: "MIH0004", eventsNumber: 10 },
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
        { vid: "MIH0002", eventsNumber: 3 },
        { vid: "MIH0003", eventsNumber: 3 },
        { vid: "MIH0004", eventsNumber: 2 },
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
        { vid: "MIH0002", eventsNumber: 3 },
        { vid: "MIH0003", eventsNumber: 4 },
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
    value: postData.value.data.availability.total,
  },
  {
    name: postData.value.data.repair.name,
    value: postData.value.data.repair.total,
  },
  {
    name: "Idle",
    value:
      postData.value.tripsNumber -
      postData.value.data.availability.total -
      postData.value.data.repair.total,
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
const change = ref(true);
/*setInterval(() => {
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
}, 1000);*/
</script>
<template>
  <div class="m-2 rounded-lg bg-white bg-opacity-10 p-2 shadow-lg">
    <div class="grid h-[80vh] grid-cols-4 gap-2 lg:grid-cols-7">
      <div v-for="data in post">
        <echatsCard v-bind="data"></echatsCard>
      </div>
      <div
        class="col-span-4 row-start-1 h-[250px] lg:col-span-3 lg:row-auto lg:h-[100%]"
      >
        <echatsPie :pieData="post2"></echatsPie>
      </div>
    </div>
  </div>
</template>
