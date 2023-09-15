<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";

import TomTomStyle from "@/style/tomtomstyle.json";
import { ref, reactive, onMounted, computed, watch } from "vue";
import {
  mdiPlusBox,
  mdiMapMarker,
  mdiEye,
  mdiCheck,
  mdiMinus,
  mdiArrowUpBoldBox,
  mdiClose,
} from "@mdi/js";
import { apiWaypointOptimization } from "@/api/apiTomtom";
import { useRoute } from "vue-router";
import { VueDraggable } from "vue-draggable-plus";
import { postItinerary } from "@/api/obd_alwayshow";
import { usePermissionsList } from "@/components/PermissionsList";
import * as turf from "@turf/turf";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };

const id = useRoute().params.id;
console.log(id);

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

//=======
const { PermissionsCarlist } = usePermissionsList();
const carNumberList = ref([]);
const pushCarNumber = (carNumber) => {
  if (carNumberList.value.indexOf(carNumber) == -1) {
    carNumberList.value.push(carNumber);
  } else {
    console.log(`${carNumber} is already use`);
  }
  saveItinerayData.value.VINID = carNumberList.value;
};
const cancelCarNumber = (itemSearch) => {
  const index = carNumberList.value.indexOf(itemSearch);
  carNumberList.value.splice(index, 1);
  console.log(index);
};
//=======

const searchText = ref();
const searchData = ref([]);
const searchSeeData = ref([]);
/*{
  name:"",
  poi: "",
  address: "",
  position: "",
} */

const isSearchOpen = ref(false);
const isItineratyOpen = ref(false);
const isRemoveOpen = ref(false);
const isDraggableOpen = ref(false);

//預定製作延遲判定
const addressData = (data) => {
  tts.services
    .fuzzySearch({
      key: TOMTOMKEY,
      query: data,
    })
    .then((res) => {
      console.log(res);
      if (res.summary.numResults != "0") {
        //初始化
        searchSeeData.value = [];
        //移除
        isRemoveOpen.value
          ? !isRemoveOpen.value
          : removeMarker(markerNumber.value);

        searchData.value = res.results; //模糊搜索結果
        res.results.forEach((value, index) => {
          if (value.poi != undefined) {
            searchSeeData.value[index] = {
              name: value.poi.name,
              poi: value.poi.name,
              address: value.address.freeformAddress,
              position: value.position,
            };
          } else {
            searchSeeData.value[index] = {
              name: value.address.freeformAddress,
              poi: "",
              address: value.address.freeformAddress,
              position: value.position,
            };
          }
        });

        res.results.forEach((value, index) => {
          setMarker(value.position.lng, value.position.lat, index);
        });
      } else {
        searchData.value = res.results;
      }
    });
};

watch(searchText, () => {
  console.log(searchText.value.length);
  if (searchText.value.length >= 2) {
    addressData(searchText.value);
    isSearchOpen.value = true;
  } else {
    removeMarker(markerNumber.value);
    isSearchOpen.value = false;
  }
});

const addData = ref([]);

const addItineray = (index) => {
  isItineratyOpen.value = true;
  addData.value.push(searchSeeData.value[index]);
  if (isCheckOpen.value) {
    updataItineray(addData.value);
  }
};

const deleteItineray = (index) => {
  addData.value.splice(index, 1);
  console.log(addData.value);
  if (isCheckOpen.value) {
    updataItineray(addData.value);
  }
};

const isCheckOpen = ref(false);
const isSetFenceOpen = ref(false);
const isSetCarOpen = ref(false);
const routeData = ref([]);

const dataItineray = (setAddData) => {
  //初始化
  isCheckOpen.value = true;
  routeData.value = [];
  //
  removeMarker(markerNumber.value);
  isRemoveOpen.value ? !isRemoveOpen.value : removeRoutes(saveRouteName.value);
  isSearchOpen.value = false;
  let lat = 0;
  let lng = 0;
  setAddData.forEach((data, index) => {
    routeData.value[index] = {
      point: {
        longitude: data.position.lng,
        latitude: data.position.lat,
      },
    };
    lat += data.position.lat;
    lng += data.position.lng;
  });
  lat /= setAddData.length; //計算路經中心點
  lng /= setAddData.length; //計算路經中心點
  console.log(lat, lng);

  //設定路徑中心點
  window.map.panTo({
    lat: lat,
    lng: lng,
  });
};

const checkItineray = (setAddData) => {
  dataItineray(setAddData);
  WaypointOptimization(routeData.value);
};

const updataItineray = (setAddData) => {
  dataItineray(setAddData);
  routeData1.value = [];
  routeData.value.forEach((placeName, placeIndex) => {
    routeData1.value[placeIndex] = routeData.value[placeIndex].point;
    setMarker(
      routeData.value[placeIndex].point.longitude,
      routeData.value[placeIndex].point.latitude,
      placeIndex
    );
  });
  route(routeData1.value);
};

const setRange = ref(500);
/*const updataFenceRange = (setAddData, rangeData) => {
  setRange.value = rangeData;
  dataItineray(setAddData);
  routeData1.value = [];
  routeData.value.forEach((placeName, placeIndex) => {
    routeData1.value[placeIndex] = routeData.value[placeIndex].point;
    setMarker(
      routeData.value[placeIndex].point.longitude,
      routeData.value[placeIndex].point.latitude,
      placeIndex
    );
  });
  route(routeData1.value, setRange.value);
  saveItinerayData.value.fenceRadius = setRange.value;
};*/
const updataFenceRange = (setAddData, event) => {
  console.log(event);
  setRange.value = event.target.value;
  dataItineray(setAddData);
  routeData1.value = [];
  routeData.value.forEach((placeName, placeIndex) => {
    routeData1.value[placeIndex] = routeData.value[placeIndex].point;
    setMarker(
      routeData.value[placeIndex].point.longitude,
      routeData.value[placeIndex].point.latitude,
      placeIndex
    );
  });
  route(routeData1.value, setRange.value);
  saveItinerayData.value.fenceRadius = setRange.value;
};

const postData = (data) => {
  postItinerary(data).then((res) => {
    console.log(res);
    window.location.href = "/ListItineraryMap";
  });
};

const saveItinerayData = ref({
  VINID: [],
  verifyID: "",
  date: "",
  itineraryName: id,
  itinerary: [],
  itineraryData: [],
  fenceRadius: 500,
});

const itineraryDataCreator = (data) => {
  const { address, poi, position } = data;

  return {
    address: address,
    name: poi ?? address,
    poi: poi,
    position: position,
  };
};

/*
{
  VINID:""
  verifyID:"",
  carID:"",
  date:"",
  itinerary:[{
      name:"",
      poi:"",
      address:"",
      position:{
        lng:"",
        lat:"",
      },
    },
  }]
  itineraryData:[]
}
*/
//20230914 ?. ??差別
const addItinerary = (addData) => {
  console.log(addData);
  addData.forEach((data) => itineraryDataCreator(data));
  // {
  //   if (data.poi != "") {
  //     saveItinerayData.value.itinerary.push({
  //       address: data.address,
  //       name: data.poi,
  //       poi: data.poi,
  //       position: data.position,
  //     });
  //   } else {
  //     saveItinerayData.value.itinerary.push({
  //       address: data.address,
  //       name: data.address,
  //       poi: data.poi,
  //       position: data.position,
  //     });
  //   }
  // }
  //saveItinerayData.value.itineraryName = id;
  saveItinerayData.value.date = aData.toUTCString();
};

//const see = ref([]);
const setItineray = (addData) => {
  isSetFenceOpen.value = true;
  if (isCheckOpen.value) {
    addItinerary(addData);
    //postData(saveItinerayData.value);
    console.log(aData.toUTCString());
    console.log(saveItinerayData.value);
    // see.value = saveItinerayData.value;
  } else {
    checkItineray(addData);
    addItinerary(addData);
    //postData(saveItinerayData.value);
    console.log(aData.toUTCString());
    console.log(saveItinerayData.value);
    //see.value = saveItinerayData.value;
  }
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
    //初始化
    routeData1.value = [];
    let saveData = [];
    //
    res.data.optimizedOrder.forEach((placeName, placeIndex) => {
      routeData1.value[placeIndex] = data[placeName].point; //路徑畫線順序
      setMarker(
        routeData1.value[placeIndex].longitude,
        routeData1.value[placeIndex].latitude,
        placeName
      );
      saveData[placeIndex] = addData.value[placeName];
    });
    addData.value = saveData;
    route(routeData1.value);
    console.log(routeData1.value);
  });
};

//=====================================================
//路徑生成

//存檔名稱
const saveRouteName = ref([]);
//設定取樣
const setSamplingPoint = ref(20);
//=============================================================================
const seeItinerary = ref([]);
const seeItineraryData = ref([]);
const seeItineraryLengthLabel = ref();

const routeName = ref();
const change = ref();
const route = (data, rangeData = 500) => {
  let roadline = "";
  tts.services
    .calculateRoute({
      key: TOMTOMKEY,
      locations: data,
      trackingId: "975a4e8e-e6c9-492b-84d1-916cf352109a",
    })
    .then(function (res) {
      saveItinerayData.value.itineraryData = res.toGeoJson().features;
      saveItinerayData.value.itineraryData.forEach((features, index) => {
        console.log(features);

        seeItinerary.value = [];
        seeItineraryLengthLabel.value = "";
        seeItineraryData.value = features.geometry.coordinates;
        seeItineraryLengthLabel.value = seeItineraryData.value.length;

        if (seeItineraryLengthLabel.value > 20) {
          console.log(seeItineraryLengthLabel.value);
          console.log();
          if (seeItineraryData.value.length > 100) {
            for (
              let j = 0;
              j < seeItineraryData.value.length / setSamplingPoint.value;
              j++
            ) {
              seeItinerary.value.push(
                seeItineraryData.value[j * setSamplingPoint.value]
              );
            }
          } else {
            for (let j = 0; j < seeItineraryData.value.length; j++) {
              seeItinerary.value.push(seeItineraryData.value[j]);
            }
          }
        } else {
          for (let i = 0; i < seeItineraryLengthLabel.value; i++) {
            //console.log(seeItineraryData.value[i]);
            if (seeItineraryData.value[i].length > 100) {
              for (
                let j = 0;
                j < seeItineraryData.value[i].length / setSamplingPoint.value;
                j++
              ) {
                seeItinerary.value.push(
                  seeItineraryData.value[i][j * setSamplingPoint.value]
                );
              }
            } else {
              for (let j = 0; j < seeItineraryData.value[i].length; j++) {
                seeItinerary.value.push(seeItineraryData.value[i][j]);
              }
            }
          }
        }
        console.log(seeItinerary.value);

        //存儲刪除變數檔
        saveRouteName.value.push([index + "_line", index + "_fill"]);
        //設定檔
        const turfOptions = {
          units: "meters",
        };
        //資料檔

        const geometry = {
          type: "LineString",
          shapeType: "Corridor",
          radius: rangeData,
          coordinates: seeItinerary.value,
        };
        //轉換點成範圍點
        const geoJsonData = ref(
          turf.buffer(geometry, geometry.radius, turfOptions)
        );

        window.map.addLayer({
          id: `${index}_line`,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
          paint: {
            "line-color": "#0088f0",
            "line-width": 1,
            "line-opacity": 1,
          },
        });

        window.map.addLayer({
          id: index + "_fill",
          type: "fill",
          source: {
            type: "geojson",
            data: geoJsonData.value, //geojson的資料
          },
          layout: {},
          paint: {
            "fill-color": `#0088f0`,
            "fill-opacity": 0.2,
          },
        });
      });
      //console.log(roadline.length);
      routeName.value = saveItinerayData.value.itineraryData.length;
    });
};

const removeRoutes = (RouteArr) => {
  console.log(RouteArr);
  for (let i = 0; i < RouteArr.length; i++) {
    console.log(RouteArr[i]);
    window.map.removeLayer(RouteArr[i][0]);
    window.map.removeSource(RouteArr[i][0]);
    window.map.removeLayer(RouteArr[i][1]);
    window.map.removeSource(RouteArr[i][1]);
  }
  saveRouteName.value = [];
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
//=====================================================
//現在時間製作
let aData = new Date();

//=====================================================
const a = () => {
  console.log("use");
};
</script>
<template>
  <LayoutAuthenticated>
    <!--{{ see }}-->
    <SectionTitleLineWithButton class="mx-6" :title="'Itinerary ' + id" main>
    </SectionTitleLineWithButton>
    <div class="relative m-6">
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
      <template v-if="!isSetFenceOpen">
        <CardBox
          hasComponentLayout
          class="absolute left-10 top-[5%] h-[8%] w-[20%]"
        >
          <input
            type="text"
            id="first_name"
            class="m-1 flex-1 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
              <div v-for="(item, index) in searchSeeData" :key="item.name">
                <div
                  class="m-2 flex min-h-[100px] items-center gap-2 border-t-2 border-[#333333] px-2 py-4"
                >
                  <div class="">
                    <BaseButton
                      color="#333333"
                      :icon="mdiPlusBox"
                      iconSize="30"
                      @click="addItineray(index)"
                      class="hover:border-green-500 hover:text-green-500"
                    ></BaseButton>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex text-2xl">
                      {{ item.poi }}
                    </div>
                    <div class="flex text-gray-400">
                      {{ item.address }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBox>
        </template>
      </template>

      <template v-if="isItineratyOpen">
        <CardBox
          class="absolute right-10 top-[5%] h-[90%] w-[20%] overflow-y-scroll aside-scrollbars-light"
        >
          <template v-if="!isSetFenceOpen">
            <div class="m-2">
              <CardBoxComponentTitle
                title="Itinerary"
                main
                class="border-b-2 border-slate-400"
              >
                <template v-if="!isCheckOpen">
                  <BaseButton
                    color="#333333"
                    :icon="mdiEye"
                    iconSize="30"
                    @click="checkItineray(addData)"
                    class="hover:border-green-500 hover:text-green-500"
                  ></BaseButton>
                </template>
                <template v-if="isCheckOpen">
                  <BaseButton
                    color="#333333"
                    :icon="mdiArrowUpBoldBox"
                    iconSize="30"
                    @click="checkItineray(addData)"
                    class="hover:border-green-500 hover:text-green-500"
                  ></BaseButton>
                  <BaseButton
                    color="#333333"
                    :icon="mdiCheck"
                    iconSize="30"
                    @click="setItineray(addData)"
                    class="hover:border-green-500 hover:text-green-500"
                  ></BaseButton>
                  <!--to="/ListItineraryMap"-->
                </template>
              </CardBoxComponentTitle>
              <VueDraggable
                v-model="addData"
                :animation="200"
                @end="updataItineray(addData)"
              >
                <div v-for="(item, index) in addData" :key="item.name">
                  <div
                    class="m-2 flex h-[100px] items-center gap-2 border-b-2 border-[#333333] px-2"
                  >
                    <BaseButton
                      color="#333333"
                      :icon="mdiMinus"
                      iconSize="30"
                      @click="deleteItineray(index)"
                      class="hover:border-red-500 hover:text-red-500"
                    ></BaseButton>
                    <div>{{ index }}</div>
                    :
                    <div>{{ item.name }}</div>
                  </div>
                </div>
              </VueDraggable>
            </div>
          </template>
          <template v-if="isSetFenceOpen">
            <div class="m-2 grid gap-4">
              <CardBoxComponentTitle
                title="Setting fence"
                main
                class="border-b-2 border-slate-400"
                ><BaseButton
                  color="#333333"
                  :icon="mdiCheck"
                  iconSize="30"
                  @click="postData(saveItinerayData)"
                  class="hover:border-green-500 hover:text-green-500"
                ></BaseButton
              ></CardBoxComponentTitle>
              <div class="text-center text-5xl">{{ setRange }}m</div>
              <input
                id="steps-range"
                type="range"
                min="100"
                max="5000"
                value="500"
                step="100"
                @mouseup="updataFenceRange(addData, $event)"
                class="h-6 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              />
            </div>
          </template>
          <template v-if="isSetFenceOpen">
            <div class="m-2">
              <CardBoxComponentTitle
                title="Setting Car"
                main
                class="border-b-2 border-slate-400"
              ></CardBoxComponentTitle>
              <div class="group relative">
                <div v-for="itemSearch in carNumberList" class="flex">
                  <div
                    class="m-1 flex min-w-[180px] flex-row rounded-full bg-gray-500 p-2"
                  >
                    <div class="flex-1 place-self-center text-xs">
                      {{ itemSearch }}
                    </div>
                    <div>
                      <BaseButton
                        :icon="mdiClose"
                        color="whiteDark"
                        rounded-full
                        @click="cancelCarNumber(itemSearch)"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div>--------車輛清單--------</div>
                  <BaseIcon :path="mdiArrowUp" class="group-hover:rotate-180" />
                </div>
                <div
                  class="absolute hidden w-full divide-y rounded-lg border bg-[#333333] group-hover:block"
                >
                  <div
                    v-for="(carNumber, index) in PermissionsCarlist"
                    class="text-center"
                  >
                    <button
                      class="hover:text-red-500"
                      @click="pushCarNumber(carNumber.VIN_ID)"
                    >
                      {{ carNumber.VIN_ID }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </CardBox>
      </template>
    </div>
  </LayoutAuthenticated>
</template>
