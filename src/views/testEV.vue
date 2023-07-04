<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as turf from "@turf/turf";
import BaseButton from "@/components/BaseButton.vue";
import { ref, reactive, onMounted } from "vue";
import { mdiEvStation } from "@mdi/js";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
const isEVOpen = ref(false);
onMounted(() => {
  /*window.setInterval(() => {
    //中心點更新
    console.log(isOpen.value);
    navigator.geolocation.getCurrentPosition((position) => {
      window.map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    /*if (isClick.value) {
      window.map.panTo({
        lat: locationGPS.value.lat,
        lng: locationGPS.value.lng,
      });
    }
    console.log(locationGPS.value);
  }, 10000);*/
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.addControl(
    new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

  map.on("click", (event) => {
    const position = event.lngLat;
    console.log(position);
  });

  map.on("moveend", () => {
    openEVstation();
    console.log("moveend");
  });

  //console.log(map.getBounds());

  window.map = map;
});

/*const EVData = ref({
  IEC62196Type1: { name: " J1772(Type1)" },
  IEC62196Type1CCS: { name: "CCS1" },
  EC62196Type2CableAttached: { name: "Type2" },
  IEC62196Type2Outlet: { name: "Type2" },
  IEC62196Type2CCS: { name: "CCS2" },
  Chademo: { name: "CHAdeMO" },
  GBT20234Part2: { name: "GB/T 20234.2" },
  GBT20234Part3: { name: "GB/T 20234.3" },
  Tesla: { name: "Tesla" },
});*/

const EVNumber = ref([]);
const openEVstation = () => EVstation(map.getBounds()._sw, map.getBounds()._ne);
const EVstation = (sw, ne) =>
  tts.services
    .fuzzySearch({
      key: TOMTOMKEY,
      query: "",
      categorySet: "7309",
      connectorSet:
        "Tesla,Chademo,IEC62196Type2Outlet,IEC62196Type1,IEC62196Type1CCS",
      boundingBox: [sw, ne],
    })
    /*
      IEC62196Type2Outlet：这是一种符合台湾标准的类型2电动汽车充电桩插座。
      Chademo：这是一种快速充电标准，主要由日本汽车制造商使用。
      Tesla：特斯拉（Tesla）是一家电动汽车制造商，他们的充电桩使用特斯拉自己的充电标准。
      IEC62196Type1：IEC62196Type1是一种标准的交流充电插头，也被称为"J1772"，在日本用于一些电动车型的充电需求。
      IEC62196Type1CCS：这是IEC62196Type1插头与CCS（Combined Charging System）标准的结合，支持直流快速充电和交流充电。在日本，一些新款电动车型也采用了这种充电插头类型。
    */
    .then(function (response) {
      if (isEVOpen.value) {
        console.log("Open");
      }
      console.log(response);
      //console.log(response.results);
      /*var chargingStationID = response.results[0].entryPoints.info;
      tts.services
        .evChargingStationsAvailability({
          key: TOMTOMKEY,
          chargingAvailability: "124599002464658",
        })
        .then(callbackFn);*/
      response.results.forEach((marker, index) => {
        iconElement(marker, index, 0, isEVOpen.value);
      });
      //console.log(EVNumber.value);
      isEVOpen.value = true;
    });

let markerHeight = 30,
  markerRadius = 10,
  linearOffset = 25;
let popupOffsets = {
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

function iconElement(marker, index, iconlistNum, isOpen) {
  if (isOpen) {
    removeMarker(EVNumber.value);
  }
  //console.log(marker);
  //================================================
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
  pathElement.setAttribute("d", mdiEvStation);
  //pathElement.setAttribute("fill", "bg-sky-400");
  // 將 path 元素添加到 SVG 元素中
  svgElement.appendChild(pathElement);
  // 將 SVG 元素添加到文檔中的 body 元素中
  document.body.appendChild(svgElement);
  //console.log(svgElement);
  const popup = new tt.Popup({ offset: popupOffsets }).setHTML(
    `${marker.poi.name}
    <br>RatedPowerKW：${marker.chargingPark.connectors[0].ratedPowerKW}
    <br>CurrentType：${marker.chargingPark.connectors[0].currentType}
    `
  );
  EVNumber.value[index] = new tt.Marker({ element: svgElement })
    .setLngLat(marker.position)
    .addTo(window.map);
  EVNumber.value[index].setPopup(popup);
  //================================================
}

const removeMarker = () => {
  EVNumber.value.forEach((marker, index) => {
    EVNumber.value[index].remove();
  });
  EVNumber.value = [];
  console.log("remove");
  console.log(EVNumber.value);

  isEVOpen.value = false;
};
</script>
<template>
  <LayoutAuthenticated class="m-2">
    <BaseButton
      class="w-full border-2 border-gray-300 dark:border-gray-500"
      label="View nearby charging stations"
      @click="openEVstation()"
    ></BaseButton>

    <div
      class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
      id="map"
      ref="mapRef"
    ></div>
  </LayoutAuthenticated>
</template>
