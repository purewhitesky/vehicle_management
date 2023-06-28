<template>
  <div class="text-3xl">{{ speedData }}<span class="text-xl"> rpm</span></div>
  <v-chart class="h-[30vh] lg:h-[20vh]" :option="option1" autoresize></v-chart>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import VChart from "vue-echarts";

const props = defineProps(["speedData"]);

const data1 = ref([0]);

watchEffect(() => {
  data1.value.push(props.speedData);
  if (data1.value.length >= 1) {
    data1.value.shift();
  }
});

const option1 = ref({
  series: [
    {
      min: 0,
      max: 8000,
      radius: "100%",
      center: ["50%", "55%"],
      type: "gauge",
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.3, "#67e0e3"],
            [0.7, "#37a2da"],
            [1, "#fd666d"],
          ],
        },
      },
      pointer: {
        itemStyle: {
          color: "inherit",
        },
      },
      axisTick: {
        distance: -10,
        length: 5,
        lineStyle: {
          color: "#fff",
          width: 2,
        },
      },
      splitLine: {
        distance: -10,
        length: 10,
        lineStyle: {
          color: "#fff",
          width: 4,
        },
      },
      axisLabel: {
        color: "inherit",
        distance: 15,
        fontSize: 10,
      },
      detail: {
        fontSize: 15,
        valueAnimation: true,
        formatter: "{value} rpm",
        color: "inherit",
      },
      data: [
        {
          value: data1.value,
        },
      ],
    },
  ],
});
</script>
<style scoped></style>
