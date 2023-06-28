<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiCar" :title="CarVINID" main>
      </SectionTitleLineWithButton>
      <div class="grid">
        <div class="mb-6 grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          <div class="grid">
            <CarSpeed :speedData1="speedData" />Vehicle speed
          </div>
          <div class="grid">
            <CarEnginesSpeed :speedData="enginesSpeedData" />Engine speed
          </div>
          <div class="grid"><CarState :STATE="stateData" />Engine Load</div>
          <div class="grid items-end">
            <CarMilage :milageData="milageData" />Milage
          </div>
        </div>
        <div
          class="row-start-1 mb-6 grid grid-cols-1 gap-6 lg:row-start-auto lg:grid-cols-2"
        >
          <template v-if="oKDataTime">
            <div class="grid grid-cols-2">
              <div class="grid">
                <div v-for="(item, i) in formattedString" :key="i">
                  <button @click="getTimeID(i, i + 1)">{{ i }}</button>
                  {{ item }}
                </div>
              </div>
              <div class="grid">
                開始時間
                <input type="date" v-model="selectData" />
                結束時間
                <input type="date" v-model="endData" />
                <BaseButton
                  color="lightDark"
                  label="GO"
                  @click="getData()"
                  class="mt-2"
                />
              </div>
            </div>
          </template>
          <div
            class="overflow-hidden rounded-3xl border-8 border-white shadow-2xl md:mx-auto md:w-full"
          ></div>
          <div
            class="overflow-hidden rounded-3xl border-8 border-white shadow-2xl md:mx-auto md:w-full"
          >
            <GoogleMap
              ref="mapRef"
              :api-key="APIKey"
              class="map"
              :center="center"
              :zoom="15"
            >
              <Marker ref="mapMarker" class="marker" :options="flight" />
              <Polyline
                ref="mapPolyline"
                class="polyline"
                :options="flightLine"
              />
            </GoogleMap>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<script setup>
//===================================================================//
//預設樣式
import BaseButton from "@/components/BaseButton.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
//===================================================================//

import CarEnginesSpeed from "@/components/CarEnginesSpeed.vue";
import CarMilage from "@/components/CarMilage.vue";
import CarSpeed from "@/components/CarSpeed.vue";
import CarState from "@/components/CarState.vue";

import { mdiCar } from "@mdi/js";
import { ref, watch, reactive, onMounted, onUnmounted, computed } from "vue";
import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import {
  getGPSAPI,
  getPageAPI,
  getOBD2API,
  getHistoryAPI,
} from "@/api/obd_alwayshow";
import { useMainStore } from "@/stores/main";

//===================================================================//
//資料設定區
//常態
const oKDataTime = ref(false);
const APIKey = "AIzaSyCOrexE9L2IK3eU7x5Dhqsbj7WaYbGzt-A";
const CarVINID = useMainStore().userCarVINID;

//const APIKey = "AIzaSyAi2bHkeD1PQF9zEhVDNx4Chy_TeSaVpyM";
const mapRef = ref(null);
const mapMarker = ref(null);
const mapPolyline = ref(null);
const center = { lat: 25.04175297175991, lng: 121.54385354353367 };
const timeSpeed = ref(3000);
//資料推動
const GPSData = ref([]);
const GPSPolyline = reactive([]);
//資料陣列讀取
const GPSTime = ref([]);
const GPSTimePolyline = reactive([]);
//GPSData計時器
let intervalId;
let intervalId1;
let intervalId2;
let intervalId3;
//狀態
const VIN_ID = ref();
const allData = ref();
const speedData = ref();
const enginesSpeedData = ref();
const stateData = ref();
const milageData = ref();
//標記格式
const flight = {
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};
//畫線格式
const flightLine = {
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

//===================================================================//
//圖示更新url

let url = "http://maps.google.com/mapfiles/ms/micons/green.png";
function setGPSMarkerColor(dataColor) {
  switch (dataColor) {
    case 0:
      url = "http://maps.google.com/mapfiles/ms/micons/green.png";
      break;
    case 1:
      url = "http://maps.google.com/mapfiles/ms/micons/purple.png";
      break;
    case 2:
      url = "http://maps.google.com/mapfiles/ms/micons/red.png";
      break;
    case 3:
      url = "http://maps.google.com/mapfiles/kml/pal3/icon33.png";
      break;
  }
  mapMarker.value.marker.setIcon(url);
}
//===================================================================//
//選擇日期查看路徑
const formattedString = ref([]);
const selectData = ref(dateToString(new Date()));
const endData = ref(selectData.value);

function dateToString(date) {
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}

function pad(n, s = String(n)) {
  return s.length < 2 ? `0${s}` : s;
}

function getData() {
  if (selectData.value <= endData.value) {
    const startTime = {
      VINID: CarVINID,
      data: "startup",
      timestart: selectData.value + " 00:00:00+00",
      timeend: endData.value + " 00:00:00+00",
    };
    getStartTime(startTime);
  } else if (selectData.value == endData.value) {
    const startTime = {
      VINID: CarVINID,
      data: "startup",
      timestart: selectData.value + " 00:00:00+00",
      timeend: endData.value + " 23:59:59+00",
    };
    getStartTime(startTime);
  } else {
    alert("error");
  }
}

async function getStartTime(startTime) {
  try {
    await getHistoryAPI(startTime).then((res) => {
      GPSTime.value = res.data.GPS_time;
      //console.log(GPSTime.value);
      GPSTime.value.forEach((element, index) => {
        //存成data型態
        const data = new Date(element.Timestamp);
        //轉成iso8061的data型態 "YYYY-MM-DDTHH:mm:ss.sssZ"
        const isoData = data.toISOString();
        //轉成伺服器所需格式"YYYY-MM-DD HH:mm:ss.sss+00"
        formattedString.value[index] = isoData
          .replace("T", " ")
          .replace("Z", "+00");
      });
      console.log(formattedString.value.slice(0, -1));
    });
  } catch (error) {
    console.error(error);
  }
}

function getTimeID(i, i2) {
  const selectDataTime = {
    VINID: CarVINID,
    data: "gps",
    timestart: formattedString.value[i],
    timeend: formattedString.value[i2],
  };
  console.log(selectDataTime);
  getGPSTimes(selectDataTime);
}

function getGPSTimes(selectDataTime) {
  clearGPS();
  getHistoryAPI(selectDataTime).then((res) => {
    GPSTime.value = res.data.GPS_time;
    console.log(GPSTime.value);
    if (GPSTime.value) {
      for (let i = 0; i < GPSTime.value.length; i++) {
        if (
          GPSTime.value[i].VSS.Vehicle.CurrentLocation.Latitude != "0" &&
          GPSTime.value[i].VSS.Vehicle.CurrentLocation.Longitude != "0"
        ) {
          GPSTimePolyline.push({
            lat: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Latitude,
            lng: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Longitude,
          });
          if (i === GPSTime.value.length - 1) {
            mapRef.value.map.panTo({
              lat: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Latitude,
              lng: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Longitude,
            });
            mapMarker.value.marker.setPosition({
              lat: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Latitude,
              lng: GPSTime.value[i].VSS.Vehicle.CurrentLocation.Longitude,
            });
            mapMarker.value.marker.setIcon(url);
          }
        }
      }
      mapPolyline.value.polyline.setPath(GPSTimePolyline);
    } else {
      console.log("not data");
    }
  });
}
//===================================================================//
//啟動和終止追蹤車輛 清理資料

function startInterval() {
  intervalId = window.setInterval(() => {
    getGPSAPI()
      .then((res) => {
        //取得GPS座標
        GPSData.value = res.data.VSS.Vehicle.CurrentLocation;
        console.log(res.data);
        //畫線陣列更新
        GPSPolyline.push({
          lat: GPSData.value.Latitude,
          lng: GPSData.value.Longitude,
        });
      })
      .catch(function (res) {
        console.log(res);
      });
    if (GPSPolyline.length === 50000) {
      clearGPS();
    }
  }, timeSpeed.value);
  //====
  intervalId1 = window.setInterval(() => {
    //取得資料
    getPageAPI()
      .then((res) => {
        //OBD 資料集
        allData.value = res.data;
        //user.vue 資料
        VIN_ID.value = allData.value.VIN_ID;
        //speed.vue 資料
        speedData.value = allData.value.VSS.OBD.Speed;
        //enginesSpeed.vue 資料
        enginesSpeedData.value = allData.value.VSS.OBD.EngineSpeed;
        //state.vue 資料
        stateData.value = allData.value.VSS.OBD.EngineLoad;
      })
      .catch(function (res) {
        console.log(res);
      });
    //當長度超過4以後 刪除第一個值排序
    if (stateData.length === 4) {
      stateData.shift(); //
    }
  }, 1000);
  //====
  intervalId2 = window.setInterval(() => {
    getOBD2API()
      .then((res) => {
        //milage.vue 資料
        milageData.value = res.data.VSS.OBD.DistanceSinceDTCClear;
      })
      .catch(function (res) {
        console.log(res);
      });
  }, 10000);
}
function useAPI() {
  getPageAPI()
    .then((res) => {
      //OBD 資料集
      allData.value = res.data;
      //user.vue 資料
      VIN_ID.value = allData.value.VIN_ID;
      //speed.vue 資料
      speedData.value = allData.value.VSS.OBD.Speed;
      //enginesSpeed.vue 資料
      enginesSpeedData.value = allData.value.VSS.OBD.EngineSpeed;
      //state.vue 資料
      stateData.value = allData.value.VSS.OBD.EngineLoad;
    })
    .catch(function (res) {
      console.log(res);
    });
  //當長度超過4以後 刪除第一個值排序
  if (stateData.length === 4) {
    stateData.shift(); //
  }
  getOBD2API()
    .then((res) => {
      //milage.vue 資料
      milageData.value = res.data.VSS.OBD.DistanceSinceDTCClear;
    })
    .catch(function (res) {
      console.log(res);
    });
}
function stopInterval() {
  clearInterval(intervalId);
  clearInterval(intervalId1);
  clearInterval(intervalId2);
  clearInterval(intervalId3);
}
function clearGPS() {
  GPSData.value.length = 0;
  GPSPolyline.length = 0;
  GPSTime.value.length = 0;
  GPSTimePolyline.length = 0;
}

//===================================================================//
//生命週期

onMounted(() => {
  //預先啟動追蹤車輛
  //useAPI()
  startInterval();
  //getGPSTimes();
});
onUnmounted(() => {
  clearInterval(intervalId);
  clearInterval(intervalId1);
  clearInterval(intervalId2);
  clearInterval(intervalId3);
});

//===================================================================//
//偵測資料變動更新畫面

watch(GPSData, () => {
  if (GPSData.value) {
    if (mapRef.value?.ready) {
      //中心點更新
      mapRef.value.map.panTo({
        lat: GPSData.value.Latitude,
        lng: GPSData.value.Longitude,
      });
      //標記更新
      mapMarker.value.marker.setPosition({
        lat: GPSData.value.Latitude,
        lng: GPSData.value.Longitude,
      });
      mapMarker.value.marker.setIcon(url);
      //畫線更新
      mapPolyline.value.polyline.setPath(GPSPolyline);
    }
  }
});
</script>
<style scoped>
.map {
  width: 100%;
  height: 50vh;
}
</style>
