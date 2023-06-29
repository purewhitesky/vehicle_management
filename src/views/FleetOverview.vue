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
            title="車輛總覽"
            :icon="mdiHeartPulse"
          />
          <div class="m-2 h-[90%]">
            <v-chart :option="optionCarList" autoresize />
          </div>
        </CardBox>
        <CardBox class="border-2 border-gray-200 dark:border-gray-500">
          <CardBoxComponentHeader
            class="rounded-lg bg-sky-400"
            title="維修總覽"
            :icon="mdiHeartPulse"
          />
          <div class="m-2 h-[90%]">
            <v-chart :option="option" autoresize />
          </div>
        </CardBox>

        <CardBox
          class="col-span-2 border-2 border-gray-200 dark:border-gray-500"
        >
          <CardBoxComponentHeader class="rounded-lg bg-sky-400" title="清單" />
          <div class="m-2 h-[100%]">
            <v-chart :option="option1" autoresize />
          </div>
        </CardBox>
        <CardBox
          class="col-span-2 border-2 border-gray-200 dark:border-gray-500"
        >
          <CardBoxComponentHeader class="rounded-lg bg-sky-400" title="清單" />
          <div class="m-2 h-[100%]">
            <v-chart :option="option2" autoresize />
          </div>
        </CardBox>
      </div>

      <CardBox
        class="grid h-screen border-2 border-gray-200 dark:border-gray-500"
      >
        <CardBoxComponentHeader
          class="rounded-lg bg-sky-400"
          title="地圖總覽"
        />
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
        center: ["70%", "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "可運行" },
          { value: 1048, name: "出車中" },
          { value: 735, name: "維修中" },
          { value: 1048, name: "充電中" },
        ],
      },
    ],
  };
  option.value = {
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
        center: ["70%", "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "待維修" },
          { value: 735, name: "維修中" },
          { value: 1048, name: "評估中" },
        ],
      },
    ],
  };

  option1.value = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
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
