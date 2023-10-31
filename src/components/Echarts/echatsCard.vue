<script setup>
import VChart from "vue-echarts";
import { ref, computed } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  num: {
    type: String,
  },
  name: {
    type: String,
  },
  maxY: {
    type: Number,
  },
  barData: {
    type: Object,
  },
  listData: {
    type: Object,
  },
  pieColor: {
    type: String,
  },
  listCar: {
    type: Object,
  },
});
console.log(props.maxY);
console.log(props.pieColor);

const hasNum = computed(() => (props.num ? props.num : 0));
const hasTitle = computed(() => (props.num ? props.num + "%" : 0 + "%"));
const hasNum1 = computed(() => (props.num ? 100 - props.num : 100));
const hasNameData = computed(() => (props.name ? props.name : "未知"));
const hasMaxY = computed(() => props.maxY);
const ICONGREY = "#d1d5db";
const ICONRED = "	#FF2D2D";
const data = [
  {
    value: hasNum1,
    itemStyle: {
      color: ICONGREY,
    },
  },
  {
    value: hasNum,
    name: hasNameData,
    itemStyle: {
      //漸變質感
      color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
        {
          offset: 0,
          color: "#fff",
        },
        {
          offset: 1,
          color: props.pieColor,
        },
      ]),
    },
  },
];

const option = ref({
  backgroundColor: "transparent",
  title: {
    text: hasTitle,
    bottom: "0%",
    right: "0%",
    textStyle: {
      fontSize: 16,
    },
  },
  series: [
    {
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      data: data,
    },
  ],
});

const data2 = computed(() => props.barData);

const option2 = ref({
  backgroundColor: "transparent",
  dataset: data2,
  grid: {
    top: "10%",

    left: "20%",
  },
  xAxis: {
    type: "category",
    axisLabel: {
      interval: 0,
      rotate: 45,
    },
  },
  yAxis: {
    max: hasMaxY,
  },
  visualMap: {
    show: false,
    orient: "horizontal",
    top: "90%",
    left: "center",
    min: 0,
    max: hasMaxY,
    text: ["High", "Low"],
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
        x: "product",
        // Map the "product" column to Y axis
        y: "score",
      },
      label: {
        show: true,
        position: "top",
      },
    },
  ],
});
</script>
<template>
  <div class="flex h-[100%] flex-col gap-2 hover:shadow-2xl">
    <div class="text-center text-base">{{ props.name }}</div>
    <div class="h-[25%] min-h-[50px] rounded-t-2xl border-2 bg-white">
      <v-chart :option="option" autoresize></v-chart>
    </div>
    <div class="h-[45%] min-h-[150px] border-2 bg-white">
      <v-chart :option="option2" autoresize></v-chart>
    </div>
    <div
      class="h-[30%] min-h-[100px] overflow-y-auto rounded-2xl border-8 border-double bg-white"
    >
      <div class="my-2 text-center text-sm">Ranking List</div>
      <div v-for="car in props.listCar" class="text-center text-xs">
        {{ car.vid }} : {{ car.eventsNumber }}
      </div>
    </div>
  </div>
</template>
