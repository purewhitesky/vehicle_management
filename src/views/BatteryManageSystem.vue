<template>
  <LayoutAuthenticated @eChartsDarkMode="eChartsDarkMode">
    <SectionMain>
      <div class="setColRow grid h-[80vh] w-[100%] gap-2">
        <!--AVG-->
        <Box class="relative col-span-2 row-span-4 grid">
          <v-chart :option="optionAVG" autoresize />
        </Box>

        <!--充電-->
        <Box class="grid-col-1 relative col-span-2 row-span-2 grid-rows-2">
          <BaseIcon
            w=""
            :path="mdiEvStation"
            size="60"
            class="absolute left-5 top-10 text-[#facc15]"
          />
          <div class="setTextPosition">Remaining Charge Time</div>
          <div class="grid items-start justify-items-center py-3">
            <span class="text-5xl">{{ remainingChargeTime }}</span>
          </div>
        </Box>

        <!--溫度-->
        <Box
          class="grid-col-1 relative col-span-2 row-span-2 grid-rows-2"
          :class="changeTemperatureBorder"
        >
          <BaseIcon
            w=""
            :path="mdiThermometer"
            size="60"
            class="absolute left-5 top-10 text-green-400"
          />
          <div class="setTextPosition" :class="changeTemperatureText">
            Temperature
          </div>
          <div class="grid items-start justify-items-center py-3">
            <span class="text-5xl">{{ temperature }} °C</span>
          </div>
        </Box>

        <!--里程-->
        <Box class="grid-col-1 col-span-2 row-span-2 grid-rows-2">
          <div class="setTextPosition">Remaining mileage</div>
          <div class="grid items-start justify-items-center py-3">
            <span class="text-5xl">{{ remainingMileage }} KM</span>
          </div>
        </Box>

        <!--健康度-->
        <Box
          class="grid-col-1 relative col-span-2 row-span-2 grid-rows-2"
          :class="changeSoHBorder"
        >
          <BaseIcon
            w=""
            :path="mdiHeartPulse"
            size="60"
            class="absolute left-5 top-10 text-red-400"
          />
          <div class="setTextPosition">SoH</div>
          <div class="grid items-start justify-items-center py-3">
            <span class="text-5xl" :class="changeSoHText">{{ SoH }} %</span>
          </div>
        </Box>
        <!--電壓-->
        <!--
          
                  <Box class="setVoltCurrent row-span-2">
                    <v-chart :option="optionVoitage" autoresize />
                  </Box>
        -->

        <!--電流-->
        <!--
          
                  <Box class="setVoltCurrent row-span-2">
                    <v-chart :option="optionCurrent" autoresize />
                  </Box>
        -->
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseIcon from "@/components/BaseIcon.vue";

//自定義版型元件vo1.0
import Box from "@/components/Box.vue";

import { onMounted, ref, onUnmounted, watch } from "vue";
import { mdiHeartPulse, mdiThermometer, mdiFlash, mdiEvStation } from "@mdi/js";

import { THEME_KEY } from "vue-echarts";

//接口設定
const remainingMileage = ref(100);
const remainingChargeTime = ref();
const SoH = ref(93.5);
const temperature = ref(40);
//=========================================================
//變色設定
const SoHNum = 93; //健康度60以下
const temperatureNum = 70; //溫度70以下

const changeSoHText = ref({
  setTextRed: false,
});
const changeSoHBorder = ref({
  setBorderRed: false,
});
watch(SoH, () => {
  if (SoH.value < SoHNum) {
    changeSoHText.value.setTextRed = true;
    changeSoHBorder.value.setBorderRed = true;
  }
});

const changeTemperatureText = ref({
  setTextRed: false,
});
const changeTemperatureBorder = ref({
  setBorderRed: false,
});
watch(temperature, () => {
  if (temperature.value > temperatureNum) {
    changeTemperatureText.value.setTextRed = true;
    changeTemperatureBorder.value.setBorderRed = true;
  }
});
//=========================================================
const useEChartsDark = ref();
function eChartsDarkMode(e) {
  useEChartsDark.value = e;
}
//=========================================================
//mdi/js ICON 轉 dataURI
const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${mdiFlash}" fill="#facc15"/></svg>`;
const dataURI = `data:image/svg+xml,${encodeURIComponent(svgCode)}`;
//顏色
const ICONGREY = "#d1d5db";
const ICONGREEN = "#00ff7f";
//模擬資料設定
let randomNum = 0;
const up = ref(true);
const Interval = setInterval(() => {
  //=========================================================
  //模擬資料
  if (randomNum < 100 && up.value == true) {
    if (randomNum + Math.floor(Math.random() * 50) >= 100) {
      randomNum = 100;
    } else {
      randomNum = randomNum + Math.floor(Math.random() * 50);
    }
  } else if (randomNum >= 100 || up.value == false) {
    up.value = false;

    if (randomNum - Math.floor(Math.random() * 50) <= 0) {
      randomNum = 0;
      up.value = true;
      SoH.value -= 1;
    } else {
      randomNum = randomNum - Math.floor(Math.random() * 50);
    }
  }
  //=========================================================
  chartsData.value[0].value = 100 - randomNum;
  //變色區間設定
  const changeSoHText = [20, 50, 100]; //區間20 20~50 50~100

  if (randomNum < changeSoHText[0]) {
    chartsData.value[1].itemStyle.color = "#ef4444";
  } else if (randomNum >= changeSoHText[0] && randomNum < changeSoHText[1]) {
    chartsData.value[1].itemStyle.color = "#facc15";
  } else {
    chartsData.value[1].itemStyle.color = ICONGREEN;
  }
  //判斷有沒有充電
  if (chartsData.value[1].value < randomNum) {
    chartsData.value[1].label.fontSize = 25;
    chartsData.value[1].value = randomNum;
    chartsData.value[1].label.formatter = [
      "{b}\n{icon|}",
      randomNum + "%",
    ].join("\n");
  } else {
    chartsData.value[1].label.fontSize = 35;
    chartsData.value[1].value = randomNum;
    chartsData.value[1].label.formatter = [randomNum + "%"].join("\n");
  }
}, 2000);

//=========================================================
//標準初始資料
const chartsData = ref([
  {
    value: 100,
    itemStyle: {
      color: ICONGREY,
    },
  },
  {
    value: 0,
    itemStyle: {
      color: ICONGREEN,
    },
    label: {
      show: true,
      position: "center",
      fontSize: 35,
      formatter: ["null%"].join("\n"),
      rich: {
        icon: {
          height: 70,
          width: 70,
          backgroundColor: {
            image: dataURI,
          },
        },
      },
    },
  },
]);

const optionAVG = ref({});
const optionVoitage = ref({});
const optionCurrent = ref({});

onMounted(() => {
  optionAVG.value = {
    title: {
      show: true,
      text: "SoC",
      left: "center",
      top: "30%",
      textStyle: {
        color: "#ef4444",
        fontWeight: "normal",
        fontSize: "20",
      },
    },
    backgroundColor: "",
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        clockwise: false,
        avoidLabelOverlap: false,
        tooltip: {
          show: false,
        },
        itemStyle: {
          borderColor: "#fff",
        },
        labelLine: {
          show: false,
        },
        silent: true, //關閉滑鼠觸發 預設關閉
        data: chartsData.value,
      },
    ],
  };
  optionVoitage.value = {
    backgroundColor: "",
    title: {
      text: "Voltage：" + "9V",
      left: "center",
      top: "10%",
    },
    grid: {
      left: "20%",
      right: "10%",
      bottom: "20%",
    },
    xAxis: {
      boundaryGap: false, //防止間隙
      type: "category",
      data: [],
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [10, 11, 15, 18, 20, 9],
        type: "line",
        smooth: true,
      },
    ],
  };
  optionCurrent.value = {
    backgroundColor: "",
    title: {
      text: "Current：" + "0.5A",
      left: "center",
      top: "10%",
    },
    grid: {
      left: "20%",
      right: "10%",
      bottom: "20%",
    },
    xAxis: {
      boundaryGap: false, //防止間隙
      type: "category",
      data: [],
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [0.9, 1.1, 1.5, 1.2, 1.3, 1.5, 0.5],
        type: "line",
        smooth: true,
      },
    ],
  };
});

onUnmounted(() => {
  clearInterval(Interval);
});
</script>
<style>
.setTextRed {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity));
}
.setBorderRed {
  border-width: 4px;
  --tw-border-opacity: 1;
  border-color: rgb(248 113 113 / var(--tw-border-opacity));
}
.setColRow {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(6, minmax(0, 1fr));
}
.setTextPosition {
  display: grid;
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
  align-items: center;
  justify-items: none;
  padding-left: 6rem /* 96px */;
}
.setVoltCurrent {
  grid-column: span 2 / span 2;
}
@media (min-width: 768px) {
  .setColRow {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }
  .setTextPosition {
    justify-items: center;
    padding-left: 0;
  }
  .setVoltCurrent {
    grid-column: span 3 / span 3;
  }
}
</style>
