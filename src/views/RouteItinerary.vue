<template>
  <LayoutAuthenticated>
    <div class="relative m-6">
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
      <CardBox
        hasComponentLayout
        class="absolute left-10 top-[5%] h-[8%] w-[20%]"
      >
        <input
          type="text"
          id="first_name"
          class="m-2 flex-1 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          v-model="searchText"
          placeholder="Please Enter A Location"
        />
      </CardBox>
      <template v-if="isSearchOpen">
        <CardBox
          hasComponentLayout
          class="absolute left-10 top-[14%] h-auto max-h-[80%] w-[20%] overflow-y-scroll aside-scrollbars-light"
        >
          <div class="m-2">
            <div v-for="(item, index) in searchData">
              <div
                class="m-2 flex h-[100px] items-center gap-2 border-t-2 border-[#333333] px-2"
              >
                <div class="">
                  <BaseButton
                    color="#333333"
                    :icon="mdiPlusBox"
                    iconSize="auto"
                    @click="AddItineray(index)"
                    class="hover:border-green-500 hover:text-green-500"
                  ></BaseButton>
                </div>
                <div>
                  {{ item.address.freeformAddress }}
                </div>
              </div>
            </div>
          </div>
        </CardBox>
      </template>
      <template v-if="isItineratyOpen">
        <CardBox
          class="absolute right-10 top-[5%] h-[90%] w-[20%] overflow-y-scroll aside-scrollbars-light"
        >
          <div class="m-2">
            <CardBoxComponentTitle
              title="Itineraty"
              main
              class="border-b-2 border-slate-400"
              ><BaseButton
                color="#333333"
                :icon="mdiCheck"
                iconSize="auto"
                @click="checkAddData(addData)"
                class="hover:border-green-500 hover:text-green-500"
              ></BaseButton
            ></CardBoxComponentTitle>

            <div v-for="(item, index) in addData">
              <div
                class="m-2 flex h-[100px] items-center gap-2 border-b-2 border-[#333333] px-2"
              >
                <BaseButton
                  color="#333333"
                  :icon="mdiMinus"
                  iconSize="auto"
                  @click="DeleteItineray(index)"
                  class="hover:border-red-500 hover:text-red-500"
                ></BaseButton>
                <div>{{ index + 1 }}</div>
                :
                <div>{{ item.address.freeformAddress }}</div>
              </div>
            </div>
          </div>
        </CardBox>
      </template>
    </div>
  </LayoutAuthenticated>
</template>
<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";

import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";

import TomTomStyle from "@/style/tomtomstyle.json";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { mdiPlusBox, mdiMapMarker, mdiCheck, mdiMinus } from "@mdi/js";
import { apiWaypointOptimization } from "@/api/apiTomtom";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };

onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
    style: TomTomStyle,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  window.map = map;
});

const searchText = ref("");
const searchData = ref([]);
const isSearchOpen = ref(false);
const isItineratyOpen = ref(false);
const addressData = (data) => {
  tts.services
    .fuzzySearch({
      key: TOMTOMKEY,
      query: data,
    })
    .then((res) => {
      console.log(res);
      if (res.summary.numResults != "0") {
        searchData.value = res.results; //模糊搜索結果

        isRemove.value ? !isRemove.value : removeMarker(markerNumber.value);
        res.results.forEach((value, index) => {
          marker(value.position.lng, value.position.lat, index);
        });
      } else {
        searchData.value = res.results;
      }
    });
};

const isRemove = ref(false);
watch(searchText, () => {
  console.log(searchText.value.length);
  if (searchText.value.length >= 2) {
    addressData(searchText.value);
    isSearchOpen.value = true;
  } else {
    isSearchOpen.value = false;
  }
});

const addData = ref([]);
const AddItineray = (index) => {
  isItineratyOpen.value = true;
  addData.value.push(searchData.value[index]);
  console.log(searchData.value[index]);
};
const DeleteItineray = (index) => {
  addData.value.splice(index, 1);
};

const routeData = ref([]);
const open = ref(0);
const checkAddData = (addData) => {
  removeMarker(markerNumber.value);
  if (open.value > 0) {
    removeRoute(routeName.value);
  }

  isSearchOpen.value = false;
  let lat = 0;
  let lng = 0;
  addData.forEach((data, index) => {
    routeData.value[index] = {
      point: {
        longitude: data.position.lng,
        latitude: data.position.lat,
      },
    };
    lat += data.position.lat;
    lng += data.position.lng;
  });
  lat /= addData.length; //計算路經中心點
  lng /= addData.length; //計算路經中心點
  console.log(lat, lng);

  //設定路徑中心點
  window.map.panTo({
    lat: lat,
    lng: lng,
  });
  WaypointOptimization(routeData.value);
  open.value++;
};

//=====================================================
//優化航點
const routeData1 = ref([]);
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
    res.data.optimizedOrder.forEach((placeName, placeIndex) => {
      console.log(data[placeName]);
      routeData1.value[placeIndex] = data[placeName].point;

      marker(
        routeData1.value[placeIndex].longitude,
        routeData1.value[placeIndex].latitude,
        placeName
      );
    });
    route(routeData1.value);
  });
};

//=====================================================
//路徑生成
const routeName = ref();
const route = (data) => {
  let roadline = "";
  tts.services
    .calculateRoute({
      key: TOMTOMKEY,
      locations: data,
    })
    .then(function (res) {
      roadline = res.toGeoJson().features;
      roadline.forEach((features, index) => {
        console.log(features);
        console.log(index);
        window.map.addLayer({
          id: "route" + index,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
          paint: {
            "line-color": "#0088f0",
            "line-width": 4,
            "line-opacity": 0.5,
          },
        });
      });
      console.log(roadline.length);
      routeName.value = roadline.length;
    });
};

const removeRoute = (RouteArr) => {
  console.log(RouteArr);
  for (let i = 0; i < RouteArr; i++) {
    window.map.removeLayer(`route${i}`);
    window.map.removeSource(`route${i}`);
  }
  /*RouteArr.forEach((value, index) => {
    window.map.removeLayer(`route${index}`);
    window.map.removeSource(`route${index}`);
    console.log(i);
  });
  console.log("removeOK");*/
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
const marker = (lngData, latData, index) => {
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

//=====================================================
</script>
