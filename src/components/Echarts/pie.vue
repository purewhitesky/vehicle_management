<script setup>
import VChart from "vue-echarts";
import { ref, computed, watchEffect, watch } from "vue";
import * as echarts from "echarts";
const props = defineProps({
  pieData: {
    type: Object,
  },
});

let color = [
  "#00DB00", //綠色
  "#FFD306", //黃色
  "#d1d5db", //灰色
  "#FF801C", //橙色
  "#00FEFF",
  "#ffa800",
  "#ff5b00",
  "#ff3000",
];

const data = computed(() => props.pieData);
const dataSum = computed(() => {
  let sum = 0;
  for (let i = 0; i < props.pieData.length; i++) {
    sum += props.pieData[i].value;
  }
  return sum;
});
console.log(dataSum.value);
const objData = computed(() => array2obj(data.value, "name"));

const angle = ref(0);

const option = ref({
  /*title: {
    show: true,
    text: "1",
    top: "35%",
    left: "inner",
  },*/
  backgroundColor: "transparent",
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    top: "40%",
    right: "10%",
    itemGap: 20,

    textStyle: {
      rich: {
        a: {
          fontSize: 14,
          align: "left",
          width: 100,
        },
        b: {
          fontSize: 14,
          align: "right",
          width: 20,
        },
        c: {
          fontSize: 14,
          align: "right",
          width: 40,
        },
      },
    },
    formatter: function (name) {
      return (
        "{a|" +
        name +
        "}{b|" +
        objData.value[name].value.toFixed(0) +
        "}{c|" +
        ((objData.value[name].value / dataSum.value) * 100).toFixed(0) +
        "%}"
      );
    },
  },
  series: [
    {
      legend: { left: "20%" },
      color: color,
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      itemStyle: {},
      data: data,
    },
  ],
});

function array2obj(array, key) {
  let resObj = {};
  for (let i = 0; i < array.length; i++) {
    resObj[array[i][key]] = array[i];
  }
  return resObj;
}

const timer = ref(false);

// 视口宽度
const vieWidth = ref(
  document.documentElement.clientWidth || document.body.clientWidth
);
//监听并更新视口宽度

const w = { sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 };

watchEffect(
  (vieWidth.value = () => {
    angle.value += 3;
    console.log(angle.value);
    // 为了避免频繁触发导致页面卡顿，使用定时器
    if (!timer.value) {
      vieWidth.value = document.body.clientWidth;
      timer.value = true;
      setTimeout(function () {
        timer.value = false;
      }, 200);

      if (vieWidth.value <= w.sm) {
        option.value.legend.right = "0%";
      } else if ((vieWidth.value > w.sm) & (vieWidth.value <= w.lg)) {
        option.value.legend.right = "5%";
      } else if (vieWidth.value > w.lg) {
        option.value.legend.right = "center";
      }
    }
  })
);
</script>
<template>
  <div class="flex h-[100%] w-full rounded-2xl border-2 bg-white">
    <v-chart :ref="refName" :option="option" autoresize></v-chart>
  </div>
</template>
