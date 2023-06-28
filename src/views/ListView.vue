<template>
  <LayoutAuthenticated class="relative">
    <SectionMain class="relative">
      <button
        class="absolute right-[26px] bottom-[50px] h-10 w-10 rounded-full border-2"
        :class="openCamera"
        @click="buttonCamera"
      >
        Live
        <img v-show="openCamera.setOpenCamera" src="" alt="" srcset="" />
      </button>
      <div class="setLg mb-6 grid h-[77vh] gap-6">
        <div
          class="snap-y scroll-py-2 flex-row overflow-y-auto rounded-l-3xl border-4 border-white p-2 shadow-2xl md:mx-auto md:w-full"
        >
          <carList :list="GPSData" @change="getVinIDNum" />
        </div>
        <div
          class="col-auto row-auto grid grid-cols-none grid-rows-none gap-3 text-xs"
          :class="classObg"
        >
          <div
            class="grid overflow-hidden rounded-3xl border-4 border-white shadow-2xl md:mx-auto md:w-full"
            :class="classObg1"
          >
            <div class="h-full w-full" ref="mapRef"></div>
          </div>

          <div
            v-show="showMoreData"
            @click="modalOneActive = true"
            class="grid-items setWarningIcon grid items-center justify-items-center overflow-auto rounded-3xl border-2 border-white shadow-2xl md:mx-auto md:w-full"
          >
            <BaseIcon
              class="h-full w-full"
              :class="classAccountAlert"
              :path="mdiAccountAlert"
              w=""
              h=""
              size="40"
            ></BaseIcon>
            <BaseIcon
              class="h-full w-full"
              :class="classCellphone"
              :path="mdiCellphone"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classEye"
              :path="mdiEye"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classSmoking"
              :path="mdiSmoking"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classLiquor"
              :path="mdiLiquor"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classCarBrakeAlert"
              :path="mdiCarBrakeAlert"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classSpeedometer"
              :path="mdiSpeedometer"
              w=""
              h=""
              size="40"
            />
            <BaseIcon
              class="h-full w-full"
              :class="classCarTractionControl"
              :path="mdiCarTractionControl"
              w=""
              h=""
              size="40"
            />
          </div>
          <div
            v-show="showMoreData"
            v-for="(item, index) in OBDData20"
            :key="index"
            class="grid-items grid grid-cols-1 rounded-3xl border-2 border-white p-2 shadow-2xl md:mx-auto md:w-full"
          >
            <div class="grid">
              {{ item.name }}
            </div>
            <div class="grid text-center text-xl md:text-3xl">
              {{ item.data }}
            </div>
          </div>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
<script setup>
//===================================================================//
//預設樣式

import BaseIcon from "@/components/BaseIcon.vue";
import SectionMain from "@/components/SectionMain.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
//===================================================================//
import carList from "./carList.vue";
import { ref, onUnmounted, onMounted } from "vue";
//import { GoogleMap, Marker, MarkerCluster } from "vue3-google-map";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css"; //必須加入

import {
  getGPSAPI,
  getOBD2API,
  getPageAPI,
  getUserAPI,
  getHistoryAPI,
} from "../api/obd_alwayshow";
import { useMainStore } from "@/stores/main";
import {
  mdiAccountAlert,
  mdiCellphone,
  mdiEye,
  mdiSmoking,
  mdiLiquor,
  mdiCarBrakeAlert,
  mdiSpeedometer,
  mdiCarTractionControl,
} from "@mdi/js";

//const APIKey = "AIzaSyCOrexE9L2IK3eU7x5Dhqsbj7WaYbGzt-A";
//const APIKey = "AIzaSyAi2bHkeD1PQF9zEhVDNx4Chy_TeSaVpyM";
const APIKey = "AIzaSyDvwgDol-Hhnu1f25ltw3d_mcMXZ-jMK0I";
//圖標
const url = "http://maps.google.com/mapfiles/ms/micons/green.png";
//地圖
const center = { lat: 25.04175297175991, lng: 121.54385354353367 };
const mapRef = ref(null);
const gpsTimeSpeed = ref(3000); //gps更新速度
const obdTimeSpeed = ref(10000);
const pageTimeSpeed = ref(1000);

//資料推動
const GPSData = ref([]);
//定時器
let interval;
//===================================================================//

//const userID = { ID: useMainStore().usePermissions };
const PermissionsID = { ID: "1" }; //最高管理權限
const PermissionsCarlist = ref({});

getUserAPI(PermissionsID)
  .then((res) => {
    console.log(res);

    PermissionsCarlist.value = res.data.car_list;

    console.log(PermissionsCarlist.value);
  })
  .catch((err) => {
    console.log(err);
  });

//===================================================================//
//獲取GPS資料
const countNum = ref(0);
const countData = ref([]);

//時間格式轉換
function changeDataTimeMod(dataTime) {
  //存成data型態
  const data = new Date(dataTime);
  //轉成iso8061的data型態 "YYYY-MM-DDTHH:mm:ss.sssZ"
  //轉成伺服器所需格式"YYYY-MM-DD HH:mm:ss.sss+00"
  const isoData = data.toISOString().replace("T", " ").replace("Z", "+00");
  return isoData;
}

function getGSPList(gGL, i) {
  return new Promise((resolve, reject) => {
    getGPSAPI(gGL)
      .then((res) => {
        //取得GPS座標
        resolve({
          VIN_ID: res.data.VIN_ID,
          lat: res.data.VSS.Vehicle.CurrentLocation.Latitude,
          lng: res.data.VSS.Vehicle.CurrentLocation.Longitude,
          time: changeDataTimeMod(res.data.Timestamp),
        });
      })
      .catch(function (res) {
        PermissionsCarlist.value.splice(i, 1);
        reject(res);
      });
  });
}
//===================================================================//
let GPSDataNum = [];
function markerElementicon(GPS, index) {
  let markerElement = document.createElement("div");
  markerElement.style.backgroundImage =
    "url(https://api.tomtom.com/maps-sdk-for-web/cdn/static/accident.colors-white.svg)";
  markerElement.style.backgroundSize = "20px";
  markerElement.style.height = "20px";
  markerElement.style.width = "20px";
  GPSDataNum[index] = new tt.Marker({ element: markerElement })
    .setLngLat({ lat: GPS.lat, lng: GPS.lng })
    .addTo(window.map);
}
//===================================================================//
let GPSFIRSTUSE = false;
async function getAllGSPList() {
  let promises = [];
  for (let i in PermissionsCarlist.value) {
    try {
      const gpsData = await getGSPList(PermissionsCarlist.value[i].VIN_ID, i);

      promises.push(gpsData);
    } catch (err) {
      console.log(err);
    }
  }
  Promise.all(promises)
    .then((results) => {
      GPSData.value = results;
    })
    .catch((error) => {
      // 处理 Promise 对象的错误
      console.error(error);
    });

  if (GPSData.value) {
    if (mapRef.value?.ready) {
      //中心點更新
      if (isClick.value) {
        mapRef.value.map.panTo({
          lat: GPSData.value[VINIdNumber.value].lat,
          lng: GPSData.value[VINIdNumber.value].lng,
        });
      } else {
        mapRef.value.map.panTo({
          lat: GPSData.value[0].lat,
          lng: GPSData.value[0].lng,
        });
      }
    }
    console.log(mapRef.value);
  }
  GPSData.value.forEach((GPS, index) => {
    markerElementicon(GPS, index);
    console.log(GPS);
  });
  //中心點更新
  if (isClick.value) {
    window.map.panTo({
      lat: GPSData.value[VINIdNumber.value].lat,
      lng: GPSData.value[VINIdNumber.value].lng,
    });
  } else {
    window.map.panTo({
      lat: GPSData.value[0].lat,
      lng: GPSData.value[0].lng,
    });
  }
  GPSData.value.length = 0;
}

//歷史紀錄使用方式
/*function getAllGSPList1() {
  let promises = [];
  if (countCar.value[0].hasData) {
    for (let i = 0; i < 5; i++) {
      try {
        const gpsData = {
          VIN_ID: countCar.value[i].GPS.VIN_ID,
          lat: countCar.value[i].GPS.VSS.Vehicle.CurrentLocation.Latitude,
          lng: countCar.value[i].GPS.VSS.Vehicle.CurrentLocation.Longitude,
        };
        promises.push(gpsData);
      } catch (err) {
        console.log(err);
      }
    }
    Promise.all(promises)
      .then((results) => {
        GPSData.value = results;
        if (mapRef.value?.ready) {
          //中心點更新
          if (isClick.value) {
            mapRef.value.map.panTo({
              lat: GPSData.value[VINIdNumber.value].lat,
              lng: GPSData.value[VINIdNumber.value].lng,
            });
          } else {
            mapRef.value.map.panTo({
              lat: GPSData.value[0].lat,
              lng: GPSData.value[0].lng,
            });
          }
        }
      })
      .catch((error) => {
        // 处理 Promise 对象的错误
        console.error(error);
      });
    GPSData.value.length = 0;
  } else {
    console.log("NODATA");
  }
}*/

onMounted(() => {
  interval = window.setInterval(() => {
    /*if (GPSFIRSTUSE) {
      GPSData.value.forEach((GPS, index) => {
        GPSDataNum[index].remove();
      });
    }
    GPSFIRSTUSE = true;*/
    getAllGSPList();
    //getAllGSPList1();//歷史紀錄使用方式
  }, gpsTimeSpeed.value);

  let map = tt.map({
    key: "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx",
    container: mapRef.value,
    zoom: 18,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.setMaxBounds(null);
  //const a = new tt.Marker().setLngLat(center).addTo(map);
  window.map = map;
});
//當實例被銷毀時關閉定時器
onUnmounted(() => {
  clearInterval(interval);
  clearInterval(interval1);
  clearInterval(interval2);
});
//標記格式
const flight = {
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

//===================================================================//
//轉換追蹤中心點

const VINIdNumber = ref("");
const isClick = ref(false);

function getVinIDNum(e) {
  for (var i = 0; i < GPSData.value.length; i++) {
    if (GPSData.value[i].VIN_ID === e.vinID) {
      //當GPSData的VIN_ID

      console.log(i);
      VINIdNumber.value = i;
      //當狀態為true時觸發中心點更新
      isClick.value = true;
      break;
    }
  }
  //當狀態為true時觸發buttonClick函式
  if (e.status) {
    buttonClick(VINIdNumber.value);
  }
}

//===================================================================//

//OBD2資料顯示
const classObg = ref({
  setGridColRow: false,
});
//MAP style 改變
const classObg1 = ref({
  setGridMap: false,
});
//當getVinIDNum被觸發的時候使用此函數
const buttonClick = (ID) => {
  classObg.value.setGridColRow = !classObg.value.setGridColRow;
  classObg1.value.setGridMap = !classObg1.value.setGridMap;
  showMoreData.value = !showMoreData.value;

  if (showMoreData.value) {
    //設定全域車牌

    useMainStore().setCarVINID(GPSData.value[ID].VIN_ID);
    console.log(useMainStore().userCarVINID);

    const CarIDData = {
      VINID: useMainStore().userCarVINID,
    };

    useAPI1(CarIDData);
    getOBD(CarIDData);

    //歷史紀錄使用方式
    //const CarIDData1 = useMainStore().userCarVINID;
    //useAPI1(CarIDData1);
    //getOBD1(CarIDData1);
  } else {
    clearOBD();
  }
};

//計時器
let interval1;
let interval2; //歷史紀錄追加

//顯示狀態
const showMoreData = ref(false);

//接收資料
const OBDData = ref([]);
const OBDData1 = ref([]);
//排序資料
const OBDData20 = ref({
  Speed: { name: " Speed", data: "loading" },
  EngineSpeed: { name: " Engine RPM", data: "loading" },
  EngineLoad: { name: " Engine Load", data: "loading" },
  DistanceSinceDTCClear: { name: " Mileage", data: "loading" },
  RunTime: { name: " Engine Run Time", data: "loading" },
  CoolantTemperature: { name: " Coolant Temp", data: "loading" },
  IntakeTemp: { name: " Intake Air Temp", data: "loading" },
  AmbientAirTemperature: { name: " Ambient Air Temp", data: "loading" },
  AbsoluteLoad: { name: " Absolute Load", data: "loading" },
  CommandedEquivalenceRatio: { name: " Air-Fuel Ratio", data: "loading" },
  ControlModuleVoltage: { name: " Battery Voltage", data: "loading" },
  TimingAdvance: { name: " Before TDC", data: "loading" },
  BarometricPressure: { name: " Air pressure", data: "loading" },
  ThrottlePosition: { name: " Throttle", data: "loading" },
  ThrottleActuator: { name: " Throttle Actuator", data: "loading" },
  RelativeThrottlePosition: { name: " Relative Throttle", data: "loading" },
  ThrottlePositionB: { name: " Throttle B", data: "loading" },
  MAF: { name: " Mass Air Flow", data: "loading" },
  CommandedEVAP: { name: " Command EVAP", data: "loading" },
  WarmupsSinceDTCClear: { name: " Warm-Ups", data: "loading" },
});

//getOBD資料
function getOBD(CarIDData) {
  interval1 = window.setInterval(() => {
    useAPI1(CarIDData);
  }, obdTimeSpeed.value);
  interval2 = window.setInterval(() => {
    useAPI2(CarIDData);
  }, pageTimeSpeed.value);
}
//getPage&&getOBD2資料

function useAPI1(CarIDData) {
  getOBD2API(CarIDData)
    .then((res) => {
      OBDData.value = res.data.VSS.OBD;
      //console.log(OBDData.value);
      for (let i in OBDData20.value) {
        if (i == "Speed" || i == "EngineSpeed" || i == "EngineLoad") {
          console.log("break");
        } else {
          if (OBDData.value[i] == null) {
            OBDData20.value[i].data = OBDData.value[i];
          } else {
            OBDData20.value[i].data = parseFloat(OBDData.value[i].toFixed(4));
          }
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}
function useAPI2(CarIDData) {
  getPageAPI(CarIDData)
    .then((res) => {
      OBDData1.value = res.data.VSS.OBD;
      for (let i in OBDData1.value) {
        OBDData20.value[i].data = OBDData1.value[i];
      }
    })
    .catch(function (err) {
      console.log(err);
    });
}

//歷史紀錄使用方法
/* 
function getOBD1(CarIDData) {
  interval1 = window.setInterval(() => {
    useAPI1(CarIDData);
  }, 10000);
  interval2 = window.setInterval(() => {
    useAPI2(CarIDData);
  }, 1000);
}
//getPage&&getOBD2資料
function useAPI1(CarIDData) {
  for (let i = 0; i < 5; i++) {
    if (countCar.value[i].GPS.VIN_ID == CarIDData) {
      OBDData.value = countCar.value[i].obdTen.VSS.OBD;
      //console.log(OBDData.value);
      for (let i in OBDData20.value) {
        if (i == "Speed" || i == "EngineSpeed" || i == "EngineLoad") {
          console.log("break");
        } else {
          if (OBDData.value[i] == null) {
            OBDData20.value[i].data = OBDData.value[i];
          } else {
            OBDData20.value[i].data = parseFloat(OBDData.value[i].toFixed(4));
          }
        }
      }
    }
  }
}
function useAPI2(CarIDData) {
  for (let i = 0; i < 5; i++) {
    if (countCar.value[i].GPS.VIN_ID == CarIDData) {
      OBDData1.value = countCar.value[i].obdSec.VSS.OBD;
      for (let i in OBDData1.value) {
        OBDData20.value[i].data = OBDData1.value[i];
      }
      OBDData.value = countCar.value[i].obdTen.VSS.OBD;
      //console.log(OBDData.value);
    }
  }
}
*/

//清除OBD資料及定時器
function clearOBD() {
  console.log("清除成功");
  for (let i in OBDData20.value) {
    OBDData20.value[i].data = "loading";
  }
  OBDData.value = "";
  OBDData1.value = "";
  clearInterval(interval1);
  clearInterval(interval2);
}

//===================================================================//
//ICON警報變色
const openCamera = ref({
  setOpenCamera: false,
});
function buttonCamera() {
  openCamera.value.setOpenCamera = !openCamera.value.setOpenCamera;
}
const classAccountAlert = ref({
  setIcon: false,
});
const classCellphone = ref({
  setIcon: false,
});
const classEye = ref({
  setIcon: false,
});
const classSmoking = ref({
  setIcon: false,
});
const classLiquor = ref({
  setIcon: false,
});
const classCarBrakeAlert = ref({
  setIcon: false,
});
const classSpeedometer = ref({
  setIcon: false,
});
const classCarTractionControl = ref({
  setIcon: false,
});
function openSelectICon(iconData) {
  console.log("OPEN");
  switch (iconData) {
    case "AHP":
      classAccountAlert.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "UHD":
      classCellphone.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "ACE":
      classEye.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "SMK":
      classSmoking.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "DRK":
      classLiquor.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "SBK":
      classCarBrakeAlert.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
    case "SAC":
      classSpeedometer.value.setIcon = true;
      break;
    case "SST":
      classCarTractionControl.value.setIcon = true;
      openCamera.value.setOpenCamera = true;
      break;
  }
}
function closeSelectICon(iconData) {
  console.log("CLOSE");
  switch (iconData) {
    case "AHP":
      classAccountAlert.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "UHD":
      classCellphone.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "ACE":
      classEye.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "SMK":
      classSmoking.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "DRK":
      classLiquor.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "SBK":
      classCarBrakeAlert.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
    case "SAC":
      classSpeedometer.value.setIcon = false;
      break;
    case "SST":
      classCarTractionControl.value.setIcon = false;
      openCamera.value.setOpenCamera = false;
      break;
  }
}

//ICON使用函數
function selectIcon(id) {
  console.log("wait");
  if (countCar.value[id].hasAlert) {
    console.log("alert:");
    console.log(countCar.value[id].GPSAlret.alert);
    if (countCar.value[id].GPSAlret.alert.slice(0, 1) == "N") {
      closeSelectICon(
        countCar.value[id].GPSAlret.alert.slice(
          1,
          countCar.value[id].GPSAlret.alert.length
        )
      );
    } else {
      openSelectICon(countCar.value[id].GPSAlret.alert);
    }
  }
}
//===========================================================
//歷史紀錄使用方法
/*
let setTime = "2023-03-23 06:17:45.627356+00";
let newTime = new Date(setTime).getTime();

const PermissionsID1 = { ID: "1" };
const PermissionsCarlist1 = ref({});

const GPS = ref([]);
const obdTen = ref([]);
const obdSec = ref([]);
const GPSAlret = ref([]);

const countGPS = ref({});
const countobdTen = ref({});
const countobdSec = ref({});
const countGPSAlret = ref({});

const countCar = ref({ ID: "", GPS: {}, obdTen: {}, obdSec: {}, GPSAlret: {} });

getUserAPI(PermissionsID1)
  .then((res) => {
    PermissionsCarlist1.value = res.data.car_list;
    //console.log(PermissionsCarlist.value);
    go();
    go1();
    go2();
    go3();
    //new Date(GPS.value[0].Timestamp).getTime();
    const time = ref();
    let startTime = new Date().getTime();
    for (let i = 0; i < 5; i++) {
      countCar.value[i] = {
        ID: i,
        GPS: {},
        obdTen: {},
        obdSec: {},
        GPSAlret: {},
        hasData: false,
        hasAlert: false,
      };
      countGPS.value[i] = 0;
      countobdTen.value[i] = 0;
      countobdSec.value[i] = 0;
      countGPSAlret.value[i] = 0;
    }
    setInterval(function () {
      time.value = new Date().getTime() - startTime;
      if (time.value > 6000 * 1000) {
        startTime = new Date().getTime();
        time.value = new Date().getTime() - startTime;
        for (let i = 0; i < 5; i++) {
          countCar.value[i] = {
            ID: i,
            GPS: {},
            obdTen: {},
            obdSec: {},
            GPSAlret: {},
            hasData: false,
            hasAlert: false,
          };
          countGPS.value[i] = 0;
          countobdTen.value[i] = 0;
          countobdSec.value[i] = 0;
          countGPSAlret.value[i] = 0;
        }
      }
      for (let i = 0; i < 5; i++) {
        if (
          time.value + newTime >=
          new Date(GPS.value[i][countGPS.value[i]].Timestamp).getTime()
        ) {
          countCar.value[i].GPS = GPS.value[i][countGPS.value[i]];
          countCar.value[i].hasData = true;
          if (countGPS.value[i] < GPS.value[i].length) {
            countGPS.value[i]++;
          }
        }
        if (
          time.value + newTime >=
          new Date(obdTen.value[i][countobdTen.value[i]].Timestamp).getTime()
        ) {
          countCar.value[i].obdTen = obdTen.value[i][countobdTen.value[i]];
          if (countobdTen.value[i] < obdTen.value[i].length) {
            countobdTen.value[i]++;
          }
        }
        if (
          time.value + newTime >=
          new Date(obdSec.value[i][countobdSec.value[i]].Timestamp).getTime()
        ) {
          countCar.value[i].obdSec = obdSec.value[i][countobdSec.value[i]];
          if (countobdSec.value[i] < obdSec.value[i].length) {
            countobdSec.value[i]++;
          }
        }
        if (
          time.value + newTime >=
          new Date(
            GPSAlret.value[0][countGPSAlret.value[0]].Timestamp
          ).getTime()
        ) {
          countCar.value[0].GPSAlret =
            GPSAlret.value[0][countGPSAlret.value[0]];
          countCar.value[0].hasAlert = true;

          if (countGPSAlret.value[0] < GPSAlret.value[0].length - 1) {
            selectIcon(0);
            countGPSAlret.value[0]++;
          }
        }
      }
    }, 1000);
  })
  .catch((err) => {
    console.log(err);
  });

async function go() {
  for (let i in PermissionsCarlist.value) {
    const startTime = {
      VINID: PermissionsCarlist.value[i].VIN_ID,
      data: "gps",
      timestart: "2023-03-23 06:17:00.627356+00",
      timeend: "2023-03-23 06:27:00.627356+00",
    };

    await getHistoryAPI(startTime).then((res) => {
      GPS.value.push(res.data.GPS_time);
    });
  }
}
async function go1() {
  for (let i in PermissionsCarlist.value) {
    const startTime1 = {
      VINID: PermissionsCarlist.value[i].VIN_ID,
      data: "obd_ten",
      timestart: "2023-03-23 06:17:00.627356+00",
      timeend: "2023-03-23 06:27:00.627356+00",
    };
    await getHistoryAPI(startTime1).then((res) => {
      obdTen.value.push(res.data.GPS_time);
    });
  }
}
async function go2() {
  for (let i in PermissionsCarlist.value) {
    const startTime2 = {
      VINID: PermissionsCarlist.value[i].VIN_ID,
      data: "obd_sec",
      timestart: "2023-03-23 06:17:00.627356+00",
      timeend: "2023-03-23 06:27:00.627356+00",
    };
    await getHistoryAPI(startTime2).then((res) => {
      obdSec.value.push(res.data.GPS_time);
    });
  }
}
async function go3() {
  for (let i in PermissionsCarlist.value) {
    const startTime3 = {
      VINID: PermissionsCarlist.value[i].VIN_ID,
      data: "alert",
      timestart: "2023-03-23 06:17:00.627356+00",
      timeend: "2023-03-23 06:27:00.627356+00",
    };
    await getHistoryAPI(startTime3).then((res) => {
      GPSAlret.value.push(res.data.GPS_time);
    });
  }
}

*/
</script>

<style scoped>
.setOpenCamera {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--tw-bg-opacity));
  height: 36vh;
  width: 64vh;
  border-radius: 0;
}
.setIcon {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
.setGridColRow {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
}
.setGridMap {
  grid-column: span 4 / span 4;
  grid-row: span 1 / span 1;
}
.setLg {
  grid-template-rows: 1fr 5fr;
}
.setWarningIcon {
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(8, minmax(0, 1fr));
  grid-row: span 3 / span 3;
  grid-column-start: 4;
  grid-row-start: 2;
}

/*最大值768px的畫面*/
@media (max-width: 768px) {
  /*items的格子數只顯示到第10個 */
  .grid-items:nth-child(n + 12) {
    display: none;
  }
}
/*超過768px的畫面*/
@media (min-width: 768px) {
  .setGridColRow {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }
  .setGridMap {
    grid-column: span 2 / span 2;
    grid-row: span 2 / span 2;
  }
  .setLg {
    grid-template-rows: none;
    grid-template-columns: 1fr 5fr;
  }

  .setWarningIcon {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(4, minmax(0, 1fr));
    grid-column: 1;
    grid-row: span 2 / span 2;
    grid-column-start: 6;
    grid-row-start: 1;
  }
  /*items的格子數只顯示到第21個 */
  .grid-items:nth-child(n + 21) {
    display: none;
  }
}
</style>
