<script setup>
import BaseIcon from "@/components/BaseIcon.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

import { getCarAlert, getGPSAPI, getUserAPI } from "@/api/obd_alwayshow";
import { onMounted, ref } from "vue";
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
import BaseButton from "@/components/BaseButton.vue";

const TOMTOMKEY = import.meta.env.VITE_APP_API_KEY;
const center = { lat: 25.08343466748116, lng: 121.40712193411323 };
const mapRef = ref();
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  window.map = map;
  getCarAlertData("ZWE211-0019761   ");
  getGPSAPIData("ZWE211-0019761   ");
});

//===================================================================//

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

const getCarAlertData = (data) => {
  getCarAlert(data).then((res) => {
    console.log(res.data);
  });
};
const getGPSAPIData = (data) => {
  getGPSAPI(data).then((res) => {
    console.log(res.data);
  });
};

//=====================================================
//ICON 設定
const iconColor = (colordata) => {
  let GPSIconColor = "";
  switch (colordata) {
    case 0:
      GPSIconColor = "green";
      break;
    case 1:
      GPSIconColor = "red";
      break;
  }
  return GPSIconColor;
};

const iconSytle = (mdiIcon, mdiColor = "black") => {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("width", "30"); // 設定寬度為 200 像素
  svgElement.setAttribute("height", "30"); // 設定高度為 150 像素
  // 創建 SVG 元素的內容 - path 元素
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", mdiIcon);
  pathElement.setAttribute("fill", mdiColor);
  //pathElement.setAttribute("fill", "bg-sky-400");
  // 將 path 元素添加到 SVG 元素中
  svgElement.appendChild(pathElement);
  // 將 SVG 元素添加到文檔中的 body 元素中
  document.body.appendChild(svgElement);
  return svgElement;
};

//=====================================================
//MARKER 設定
const markerNumber = ref([]);
const setMarker = (lngData, latData, index) => {
  //==========
  const markerHeight = 30,
    markerRadius = 10,
    linearOffset = 25;
  const popupOffsets = {
    top: [0, 0],
    "top-left": [0, 0],
    "top-right": [0, 0],
    bottom: [0, -markerHeight],
    "bottom-left": [
      linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    "bottom-right": [
      -linearOffset,
      (markerHeight - markerRadius + linearOffset) * -1,
    ],
    left: [markerRadius, (markerHeight - markerRadius) * -1],
    right: [-markerRadius, (markerHeight - markerRadius) * -1],
  };
  //==========
  markerNumber.value[index] = new tt.Marker({
    element: iconSytle(mdiMapMarker, "#c00000"),
  })
    .setLngLat({ lat: latData, lng: lngData })
    .addTo(window.map);
};

const removeMarker = (markerArr) => {
  markerArr.forEach((value) => {
    value.remove();
  });
  console.log(markerArr);
};
//===================================================================//
//ICON警報變色

/*const classAccountAlert = ref({
  open: true,
  setIcon: true,
});
const classCellphone = ref({
  open: false,
  setIcon: false,
});
const classEye = ref({
  open: false,
  setIcon: false,
});
const classSmoking = ref({
  open: false,
  setIcon: false,
});
const classLiquor = ref({
  open: false,
  setIcon: false,
});
const classCarBrakeAlert = ref({
  open: false,
  setIcon: false,
});
const classSpeedometer = ref({
  open: false,
  setIcon: false,
});
const classCarTractionControl = ref({
  open: false,
  setIcon: false,
});
function openSelectICon(iconData) {
  console.log("OPEN");
  switch (iconData) {
    case "AHP":
      classAccountAlert.value.setIcon = true;
      classAccountAlert.value.open = true;
      openCamera.value = true;
      break;
    case "UHD":
      classCellphone.value.setIcon = true;
      classCellphone.value.open = true;
      openCamera.value = true;
      break;
    case "ACE":
      classEye.value.setIcon = true;
      classEye.value.open = true;
      openCamera.value = true;
      break;
    case "SMK":
      classSmoking.value.setIcon = true;
      classSmoking.value.open = true;
      openCamera.value = true;
      break;
    case "DRK":
      classLiquor.value.setIcon = true;
      classLiquor.value.open = true;
      openCamera.value = true;
      break;
    case "SBK":
      classCarBrakeAlert.value.setIcon = true;
      classCarBrakeAlert.value.open = true;
      openCamera.value = true;
      break;
    case "SAC":
      classSpeedometer.value.setIcon = true;
      classSpeedometer.value.open = true;
      break;
    case "SST":
      classCarTractionControl.value.setIcon = true;
      classCarTractionControl.value.open = true;
      openCamera.value = true;
      break;
  }
}
function closeSelectICon(iconData) {
  console.log("CLOSE");
  switch (iconData) {
    case "AHP":
      classAccountAlert.value.setIcon = false;
      classAccountAlert.value.open = false;
      openCamera.value = false;
      break;
    case "UHD":
      classCellphone.value.setIcon = false;
      classCellphone.value.open = false;
      openCamera.value = false;
      break;
    case "ACE":
      classEye.value.setIcon = false;
      classEye.value.open = false;
      openCamera.value = false;
      break;
    case "SMK":
      classSmoking.value.setIcon = false;
      classSmoking.value.open = false;
      openCamera.value = false;
      break;
    case "DRK":
      classLiquor.value.setIcon = false;
      classLiquor.value.open = false;
      openCamera.value = false;
      break;
    case "SBK":
      classCarBrakeAlert.value.setIcon = false;
      classCarBrakeAlert.value.open = false;
      openCamera.value = false;
      break;
    case "SAC":
      classSpeedometer.value.setIcon = false;
      classSpeedometer.value.open = false;
      break;
    case "SST":
      classCarTractionControl.value.setIcon = false;
      classCarTractionControl.value.open = false;
      openCamera.value = false;
      break;
  }
}*/

const openCamera = ref(false);
let timer;

const manualOpenCamera = ref(false);
const setManual = (Manual) => {
  if (Manual) {
    manualOpenCamera.value = !manualOpenCamera.value;
    console.log(manualOpenCamera.value);
    setCameraOpen();
  }
};

const setCameraOpen = (iconData) => {
  if (!manualOpenCamera.value) {
    openCamera.value = false;
    if (iconData != undefined) {
      if (iconData.length > 0) {
        console.log("程序开始");
        openCamera.value = true;
        if (timer) {
          console.log("重置計時器");
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          console.log("程序结束");
          openCamera.value = false;
        }, 3000);
      }
    }
  } else {
    if (timer) {
      console.log("重置計時器");
      clearTimeout(timer);
      timer = "";
    }
    openCamera.value = true;
  }
};

const iconIndex = ref({
  AHP: { iconPath: mdiAccountAlert, open: false },
  UHD: { iconPath: mdiCellphone, open: false },
  ACE: { iconPath: mdiEye, open: false },
  SMK: { iconPath: mdiSmoking, open: false },
  DRK: { iconPath: mdiLiquor, open: false },
  SBK: { iconPath: mdiCarBrakeAlert, open: false },
  SAC: { iconPath: mdiSpeedometer, open: false },
  SST: { iconPath: mdiCarTractionControl, open: false },
});

const iconSwitch = (iconData) => {
  iconIndex.value[iconData].open = true;
  if (iconData.charAt(0) === "N") {
    iconIndex.value[iconData].open = false;
  }
};

setInterval(() => {
  Object.keys(iconIndex.value).forEach((valueData) => {
    iconIndex.value[valueData].open = false;
  });
  const randomData = ref([]);
  for (let i = 0; i < Math.floor(Math.random() * 8); i++) {
    switch (Math.floor(Math.random() * 8)) {
      case 0:
        randomData.value.push("AHP");
        break;
      case 1:
        randomData.value.push("UHD");
        break;
      case 2:
        randomData.value.push("ACE");
        break;
      case 3:
        randomData.value.push("SMK");
        break;
      case 4:
        randomData.value.push("DRK");
        break;
      case 5:
        randomData.value.push("SBK");
        break;
      case 6:
        randomData.value.push("SAC");
        break;
      case 7:
        randomData.value.push("SST");
        break;
    }
  }
  console.log(randomData.value);
  if (randomData.value.length != 0) {
    randomData.value.forEach((valueData) => {
      iconSwitch(valueData);
    });
  }
  setCameraOpen(randomData.value);
}, 3000);
</script>
<template>
  <LayoutAuthenticated>
    <div class="m-4">
      <div class="mt-1 grid h-[90vh] w-auto grid-cols-5 gap-1">
        <CardBox class="w-[100%] border-2 border-gray-200 dark:border-gray-500">
          <div v-for="item in PermissionsCarlist">
            <BaseButton></BaseButton>
          </div>
        </CardBox>
        <div class="relative col-span-4 grid w-[100%]">
          <CardBox class="border-2 border-gray-200 dark:border-gray-500">
            <div
              class="h-[100%] overflow-hidden rounded-lg"
              id="map"
              ref="mapRef"
            ></div>
          </CardBox>
          <div class="absolute left-10 top-10 flex">
            <div v-for="(item, index) in iconIndex">
              <BaseIcon
                v-show="item.open"
                class="h-[30px] w-[30px] rounded-lg border-2 bg-red-500 text-white"
                :path="item.iconPath"
                w=""
                h=""
                size="40"
              ></BaseIcon>
            </div>
            <!--

              <BaseIcon
                v-show="classAccountAlert.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classAccountAlert"
                :path="iconIndex.AHP"
                w=""
                h=""
                size="40"
              ></BaseIcon>
              <BaseIcon
                v-show="classCellphone.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classCellphone"
                :path="mdiCellphone"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classEye.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classEye"
                :path="mdiEye"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classSmoking.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classSmoking"
                :path="mdiSmoking"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classLiquor.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classLiquor"
                :path="mdiLiquor"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classCarBrakeAlert.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classCarBrakeAlert"
                :path="mdiCarBrakeAlert"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classSpeedometer.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classSpeedometer"
                :path="mdiSpeedometer"
                w=""
                h=""
                size="40"
              />
              <BaseIcon
                v-show="classCarTractionControl.open"
                class="h-[30px] w-[30px] rounded-lg border-2"
                :class="classCarTractionControl"
                :path="mdiCarTractionControl"
                w=""
                h=""
                size="40"
              />
            -->
          </div>
          <template v-if="openCamera">
            <div class="absolute left-[55%] top-[55%]">
              <div class="h-40 w-40 bg-black text-white"></div>
            </div>
          </template>
          <div class="absolute left-[95%] top-[90%]">
            <BaseButton label="LIVE" @click="setManual(true)"></BaseButton>
          </div>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped>
.setIcon {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity));
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
</style>
