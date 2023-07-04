<template>
  <LayoutAuthenticated>
    <SectionTitleLineWithButton
      class="mx-6"
      :icon="mdiCar"
      title="Fleet Overview Dashboard"
      main
    >
    </SectionTitleLineWithButton>
    <div class="m-6 grid grid-cols-2 gap-2">
      <div class="grid h-screen grid-cols-2 grid-rows-3 gap-2">
        <CardBox class="border-2 border-gray-200 dark:border-gray-500">
          <CardBoxComponentHeader
            class="rounded-lg bg-sky-400"
            title="Vehicles"
            :icon="mdiHeartPulse"
          />
          <div class="m-2 h-[90%]">
            <CardBoxComponentHeader title="Total:100" />
            <v-chart :option="optionCarList" autoresize />
          </div>
        </CardBox>
        <CardBox class="border-2 border-gray-200 dark:border-gray-500">
          <CardBoxComponentHeader
            class="rounded-lg bg-sky-400"
            title="Safety"
            :icon="mdiHeartPulse"
          />

          <div class="m-2 h-[90%]">
            <v-chart :option="option" autoresize />
          </div>
        </CardBox>

        <CardBox
          class="col-span-2 border-2 border-gray-200 dark:border-gray-500"
        >
          <CardBoxComponentHeader class="rounded-lg bg-sky-400" title="PHM" />
          <div class="m-2 h-[100%]">
            <v-chart :option="option1" autoresize />
          </div>
        </CardBox>
        <CardBox
          class="col-span-2 border-2 border-gray-200 dark:border-gray-500"
        >
          <CardBoxComponentHeader class="rounded-lg bg-sky-400" title="CPO" />
          <div class="m-2 h-[100%]">
            <v-chart :option="option2" autoresize />
          </div>
        </CardBox>
      </div>

      <CardBox
        class="grid h-screen border-2 border-gray-200 dark:border-gray-500"
      >
        <CardBoxComponentHeader class="rounded-lg bg-sky-400" title="Map" />
        <div class="my-2 h-[92%] w-[100%]" id="map" ref="mapRef"></div>
      </CardBox>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import CardBoxComponentHeader from "@/components/CardBoxComponentHeader.vue";
import CardBoxComponentBody from "@/components/CardBoxComponentBody.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { ref, onMounted } from "vue";
import {
  mdiHeartPulse,
  mdiThermometer,
  mdiFlash,
  mdiEvStation,
  mdiCar,
} from "@mdi/js";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
const option = ref({});
const optionCarList = ref({});
const option1 = ref({});
const option2 = ref({});
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 10,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());

  console.log(map.getBounds());

  window.map = map;
  optionCarList.value = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        center: ["70%", "30%"],
        radius: "50%",
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 70, name: "Online" },
          { value: 6, name: "Offline" },
          { value: 8, name: "Repair" },
          { value: 16, name: "Charging" },
        ],
      },
    ],
  };
  option1.value = {
    dataset: {
      source: [
        ["score", "amount", "product"],
        [90, 8, "Under Repair"],
        [57.1, 16, "Warning"],
      ],
    },
    grid: { containLabel: true },
    xAxis: { name: "amount" },
    yAxis: { type: "category" },
    visualMap: {
      orient: "horizontal",
      left: "center",
      min: 10,
      max: 100,

      // Map the score column to color
      dimension: 0,
      inRange: {
        color: ["#65B581", "#FFCE34", "#FD665F"],
      },
    },
    series: [
      {
        type: "bar",
        encode: {
          // Map the "amount" column to X axis.
          x: "amount",
          // Map the "product" column to Y axis
          y: "product",
        },
      },
    ],
  };

  option.value = {
    title: [
      {
        subtext: "10 drives",
        left: "10%",
        top: "60%",
        textAlign: "center",
      },
      {
        subtext: "11 drives",
        left: "40%",
        top: "60%",
        textAlign: "center",
      },
      {
        subtext: "6 drives",
        left: "70%",
        top: "60%",
        textAlign: "center",
      },
    ],
    dataset: [
      {
        source: [
          ["Product", "Sales", "Price", "Year"],
          ["Speeding", 10, 25, 2011],
          ["", 90, 29, 2011],

          ["Doze off", 11, 27, 2012],
          ["", 89, 34, 2012],

          ["Distracted", 6, 31, 2013],
          ["", 94, 39, 2013],
        ],
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "Year", value: 2011 },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "Year", value: 2012 },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "Year", value: 2013 },
        },
      },
      {
        transform: {
          type: "filter",
          config: { dimension: "Year", value: 2014 },
        },
      },
    ],
    series: [
      {
        title: {
          text: "Referer of a Website",
        },
        type: "pie",
        radius: ["18%", "22%"],
        datasetIndex: 1,
      },
      {
        type: "pie",

        radius: ["18%", "22%"],

        datasetIndex: 2,
      },
      {
        type: "pie",
        radius: ["18%", "22%"],

        datasetIndex: 3,
      },
    ],
    // Optional. Only for responsive layout:
    media: [
      {
        query: { minAspectRatio: 1 },
        option: {
          series: [
            { center: ["10%", "40%"] },
            { center: ["40%", "40%"] },
            { center: ["70%", "40%"] },
          ],
        },
      },
    ],
  };
  option2.value = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };
});
</script>
