<template>
  <LayoutAuthenticated>
    <BaseButton label="按" @click="addressData()"></BaseButton>
    <BaseButton label="按資料" @click="combinationData()"></BaseButton>
    <BaseButton label="按路線 " @click="route()"></BaseButton>
    <div
      class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
      id="map"
      ref="mapRef"
    ></div>
  </LayoutAuthenticated>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  apiAddnewfencetoaproject,
  apiWaypointOptimization,
} from "@/api/apiTomtom";
import { mdiStore } from "@mdi/js";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const mapRef = ref();
const center = { lat: 25.08343466748116, lng: 121.40712193411323 };
const routeData = ref([
  "林口物流中心",
  "全家工業三店",
  "全家工業一店",
  "全家宏展店",
  "全家港運店",
  "全家新成鑫店",
  "全家小彎公宅店",
  "全家港忠店",
  "全家南港車站店",
  "全家新昆陽店",
  "全家南港公宅店",
  "全家港成店",
  "全家研究院店",
  "全家中研店",
  "全家重陽店",
  "全家向陽店",
  "全家富康店",
  "全家工業二店",
  "全家經貿店",
  "全家大聯大店",
  "全家港福店",
  "全家中視店",
  "全家興華店",
  "全家國興店",
  "全家新莊研店",
  "全家胡適店",
]);
const finishData = ref([]);
const combinationData = () => {
  routeData.value.forEach((data, index) => {
    finishData.value[index] = { query: data, bestResult: true };
  });
  console.log(finishData.value);
};

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
});
//=====================================================
const address = ref([]);
const address1 = ref([]);
function callbackFn(result) {
  result.batchItems.forEach((data, index) => {
    if (index < 12) {
      address.value[index] = {
        point: {
          longitude: result.batchItems[index].results[0].position.lng,
          latitude: result.batchItems[index].results[0].position.lat,
        },
      };
    }
  });
  WaypointOptimization(address.value);
  console.log(address1.value);
}
//=====================================================
const WaypointOptimization = (data) => {
  apiWaypointOptimization({
    waypoints: data,
    options: {
      travelMode: "truck",
      vehicleMaxSpeed: 110,
      vehicleWeight: 36000,
      vehicleAxleWeight: 6000,
      vehicleLength: 16.2,
      vehicleWidth: 2.4,
      vehicleHeight: 3.8,
      vehicleCommercial: true,
      vehicleLoadType: ["USHazmatClass3", "otherHazmatExplosive"],
    },
  }).then((res) => {
    res.data.optimizedOrder.forEach((features, index) => {
      address1.value[index] = data[features].point;
      console.log(address1.value[index]);
      marker(
        address1.value[index].longitude,
        address1.value[index].latitude,
        features
      );
    });
    route(address1.value);
  });
};
//=====================================================
const route = (data) => {
  let roadline = "";
  tts.services
    .calculateRoute({
      key: TOMTOMKEY,
      locations: data,
    })
    .then(function (res) {
      roadline = res.toGeoJson().features;
      console.log(roadline);
      roadline.forEach((features, index) => {
        console.log(features);
        window.map.addLayer({
          id: "route" + index,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
        });
      });
    });
};
//=====================================================
const addressNumber = ref([]);
const marker = (lngData, latData, index) => {
  //==========
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
  pathElement.setAttribute("d", mdiStore);
  //pathElement.setAttribute("fill", "bg-sky-400");
  // 將 path 元素添加到 SVG 元素中
  svgElement.appendChild(pathElement);
  // 將 SVG 元素添加到文檔中的 body 元素中
  document.body.appendChild(svgElement);
  //console.log(svgElement);
  const popup = new tt.Popup({ offset: popupOffsets }).setHTML(
    `${index} : ${routeData.value[index]}`
  );
  //==========
  addressNumber.value[index] = new tt.Marker({ element: svgElement })
    .setLngLat({ lat: latData, lng: lngData })
    .addTo(window.map);
  addressNumber.value[index].setPopup(popup);
};

const addressData = () =>
  tts.services
    .geocode({
      batchMode: "sync",
      key: TOMTOMKEY,
      batchItems: [
        { query: "24452新北市林口區宏昌街1號", bestResult: true },
        { query: "115台北市南港區三重路66之2號1樓", bestResult: true },
        { query: "115台北市南港區三重路19-7號", bestResult: true },
        { query: "115台北市南港區三重路66號", bestResult: true },
        { query: "115台北市南港區玉成街52巷2弄7號", bestResult: true },
        { query: "115台北市南港區玉成街176巷1號", bestResult: true },
        { query: "115台北市南港區向陽路256號1樓", bestResult: true },
        { query: "115台北市南港區忠孝東路七段635號1樓", bestResult: true },
        { query: "115台北市南港區忠孝東路七段371號B2", bestResult: true },
        { query: "115台北市南港區昆陽街145號", bestResult: true },
        { query: "115台北市南港區南港路二段38巷6之2號", bestResult: true },
        { query: "115台北市南港區南港路三段2號", bestResult: true },
        { query: "115台北市南港區研究院路二段70巷1號", bestResult: true },
        { query: "115台北市南港區研究院路二段12巷55號1樓", bestResult: true },
        { query: "115台北市南港區重陽路183號1樓", bestResult: true },
        { query: "115台北市南港區重陽路16號", bestResult: true },
        { query: "115台北市南港區富康街86號1樓", bestResult: true },
        { query: "115台北市南港區園區街3號2F", bestResult: true },
        { query: "115台北市南港區經貿二路200號", bestResult: true },
        { query: "115台北市南港區經貿二路191號1樓", bestResult: true },
        { query: "115台北市南港區福德街373巷63號1樓", bestResult: true },
        { query: "115台北市南港區興南街39號", bestResult: true },
        { query: "115台北市南港區興華路86號", bestResult: true },
        { query: "115台北市南港區舊莊街一段3巷3弄2號", bestResult: true },
        { query: "115台北市南港區舊莊街一段169號", bestResult: true },
        { query: "115台北市南港區舊莊街一段3巷16號", bestResult: true },
        { query: "24452新北市林口區宏昌街1號", bestResult: true },
      ],
    })
    .then(callbackFn);

/*const test = ref([
  { lng: 121.40708, lat: 25.08311 },
  { lng: 121.61438, lat: 25.05724 },
  { lng: 121.61365, lat: 25.05737 },
  { lng: 121.40708, lat: 25.08311 },
]);*/
</script>
