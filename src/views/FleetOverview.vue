<template>
  <LayoutAuthenticated class="h-screen">
    <SectionTitleLineWithButton
      class="mx-6"
      :icon="mdiCar"
      title="Fleet Overview Dashboard"
      main
    >
    </SectionTitleLineWithButton>
    <div class="m-6 grid h-screen grid-cols-2 gap-1">
      <div class="grid grid-cols-2 grid-rows-3 gap-1">
        <CardBox
          hasComponentLayout
          class="flex gap-2 border-2 border-gray-200 p-2 dark:border-gray-500"
        >
          <CardBoxComponentHeader
            class="rounded-lg border-b-2 bg-slate-200 text-xl dark:bg-slate-500"
            title="Vehicles"
          />
          <CardBoxComponentHeader title="Total:100"></CardBoxComponentHeader>
          <div class="mx-4 h-[100%]">
            <v-chart :option="optionCarList" autoresize />
          </div>
        </CardBox>
        <CardBox
          hasComponentLayout
          class="flex gap-2 border-2 border-gray-200 p-2 dark:border-gray-500"
        >
          <CardBoxComponentHeader
            class="rounded-lg border-b-2 bg-slate-200 text-xl dark:bg-slate-500"
            title="Safety"
          />
          <div class="mx-4 h-[100%]">
            <v-chart :option="option" autoresize />
          </div>
        </CardBox>

        <CardBox
          hasComponentLayout
          class="col-span-2 flex gap-2 border-2 border-gray-200 p-2 dark:border-gray-500"
        >
          <CardBoxComponentHeader
            class="rounded-lg border-b-2 bg-slate-200 text-xl dark:bg-slate-500"
            title="PHM"
          />
          <div class="h-[100%]">
            <v-chart :option="option1" autoresize />
          </div>
        </CardBox>
        <CardBox
          hasComponentLayout
          class="col-span-2 flex gap-2 border-2 border-gray-200 p-2 dark:border-gray-500"
        >
          <CardBoxComponentHeader
            class="rounded-lg border-b-2 bg-slate-200 text-xl dark:bg-slate-500"
            title="CPO"
          />
          <div class="h-[100%]">
            <v-chart :option="option2" autoresize />
          </div>
        </CardBox>
      </div>

      <CardBox
        hasComponentLayout
        class="flex gap-2 border-2 border-gray-200 p-2 dark:border-gray-500"
      >
        <CardBoxComponentHeader
          class="rounded-lg border-b-2 bg-slate-200 text-xl dark:bg-slate-500"
          title="Map"
        />
        <div
          class="h-[100%] w-auto overflow-hidden rounded-lg"
          id="map"
          ref="mapRef"
        ></div>
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
import TomTomStyle from "@/style/tomtomstyle.json";
import { ref, onMounted, provide } from "vue";
import {
  mdiHeartPulse,
  mdiThermometer,
  mdiFlash,
  mdiEvStation,
  mdiCar,
} from "@mdi/js";
import { THEME_KEY } from "vue-echarts";

provide(THEME_KEY, "dark");

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
    style: TomTomStyle,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());

  console.log(map.getBounds());

  window.map = map;

  optionCarList.value = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },

    //切換顏色
    color: ["#8CEA00", "#F75000", "#FF8000", "#F9F900"],
    series: [
      {
        name: "Access From",
        type: "pie",
        center: ["70%", "50%"],
        radius: "90%",
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
    backgroundColor: "transparent",
    darkMode: true,
    dataset: {
      source: [
        ["score", "amount", "product"],
        [90, 8, "Under Repair"],
        [57.1, 16, "Warning"],
      ],
    },
    grid: { containLabel: true, right: "15%", left: "1%" },
    xAxis: { name: "amount" },
    yAxis: { type: "category" },

    //切換顏色
    color: ["#FFCE34", "#FD665F"],
    series: [
      {
        type: "bar",
        colorBy: "data",
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
    backgroundColor: "transparent",
    title: [
      //first title/subtitle
      {
        text: "Speeding",
        left: "10%",
        textAlign: "center",
        top: "45%",
        textStyle: {
          fontSize: "0.65rem",
        },
      },
      {
        subtext: `${data1.value[0].value}` + "{aaa| drivers}",
        left: "10%",
        textAlign: "center",
        bottom: "25%",
        subtextStyle: {
          fontStyle: "bold",
          color: "",
          fontSize: "0.85rem",
          rich: {
            aaa: {
              fontStyle: "",
              color: "#ADADAD",
              fontSize: "0.65rem",
            },
          },
        },
      },

      //second title/subtitle
      {
        text: "Harsh braking",
        left: "45%",
        textAlign: "center",
        top: "45%",
        textStyle: {
          fontSize: "0.65rem",
        },
      },
      {
        subtext: `${data2.value[0].value}` + "{aaa| drivers}",
        left: "45%",
        textAlign: "center",
        bottom: "25%",
        subtextStyle: {
          fontStyle: "bold",
          color: "",
          fontSize: "0.85rem",
          rich: {
            aaa: {
              fontStyle: "",
              color: "#ADADAD",
              fontSize: "0.65rem",
            },
          },
        },
      },

      //third title/subtitle
      {
        text: "  After-hours\nvehicle usage",
        left: "83.33%",
        textAlign: "center",
        top: "42.5%",
        textStyle: {
          fontSize: "0.65rem",
        },
      },
      {
        subtext: `${data3.value[0].value}` + "{aaa| drivers}",
        left: "83.33%",
        textAlign: "center",
        bottom: "25%",

        subtextStyle: {
          fontStyle: "bold",
          color: "",
          fontSize: "0.85rem",
          rich: {
            aaa: {
              fontStyle: "",
              color: "#ADADAD",
              fontSize: "0.65rem",
            },
          },
        },
      },
    ],
    color: ["#CE0000", "#F0F0F0", "#CE0000", "#F0F0F0", "#CE0000", "#F0F0F0"],
    series: [
      //first cirlce
      {
        name: "",
        type: "pie",
        radius: ["70%", "55%"],
        center: ["40%", "25%"],
        left: 0,
        right: "66.6667%",
        top: 0,
        bottom: 0,
        labelLine: {
          length: 30,
        },
        emphasis: {
          disabled: true,
        },
        label: {
          position: "center",

          formatter: ["{a|{d}}", "%"].join(""),
          rich: {
            a: {
              fontSize: "1rem",
              fontWeight: "bold",
              color: "inherit",
            },
          },
        },
        data: data1.value,
      },

      //second circle
      {
        name: "",
        type: "pie",
        radius: ["70%", "55%"],
        center: ["50%", "25%"],
        left: "33.3333%",
        right: "33.3333%",
        top: 0,
        bottom: 0,
        labelLine: {
          length: 30,
        },
        emphasis: {
          disabled: true,
        },
        label: {
          position: "center",

          formatter: ["{a|{d}}", "%"].join(""),
          rich: {
            a: {
              fontSize: "1rem",
              fontWeight: "bold",
              color: "inherit",
            },
          },
        },
        data: data2.value,
      },

      //third circle
      {
        name: "",
        type: "pie",
        radius: ["70%", "55%"],
        center: ["60%", "25%"],
        left: "66.6667%",
        right: 0,
        top: 0,
        bottom: 0,
        labelLine: {
          length: 30,
        },
        emphasis: {
          disabled: true,
        },
        label: {
          position: "center",

          formatter: ["{a|{d}}", "%"].join(""),
          rich: {
            a: {
              fontSize: "1rem",
              fontWeight: "bold",
              color: "inherit",
            },
          },
        },
        data: data3.value,
      },
    ],
  };
  option2.value = {
    backgroundColor: "transparent",
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

//first data
const data1 = ref([
  { value: 9, name: "useless0" },
  { value: 91, name: "used0", label: { show: false } },
]);

//second data
const data2 = ref([
  { value: 11, name: "useless1" },
  { value: 89, name: "used1", label: { show: false } },
]);

//third data
const data3 = ref([
  { value: 5, name: "useless2" },
  { value: 95, name: "used2", label: { show: false } },
]);
</script>
