<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  apiAddnewfencetoaproject,
  apiWaypointOptimization,
  apiListthefencesforagivenproject,
  apiListprojects,
  apiGetfencedetails,
  apipostReport,
  apigetReport,
  apiListobjects,
} from "@/api/apiTomtom";
import { getTomTomAlert } from "@/api/obd_alwayshow";
import {
  mdiMapMarkerRadiusOutline,
  mdiTruck,
  mdiAlert,
  mdiCarBack,
  mdiBellAlert,
} from "@mdi/js";
import * as turf from "@turf/turf";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import BaseIcon from "@/components/BaseIcon.vue";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const mapRef = ref();
const center = { lat: 25.08343466748116, lng: 121.40712193411323 };
const routeData = ref([
  "林口物流中心",
  "全家港運店,台北市南港區",
  "全家新成鑫店,台北市南港區",
  "全家小彎公宅店,台北市南港區",
  "全家工業三店,台北市南港區",
  "全家南港車站店,台北市南港區",
  "全家新昆陽店,台北市南港區",
  "全家南港公宅店,台北市南港區",
  "全家港成店,台北市南港區",
  "全家研究院店,台北市南港區",
  "全家中研店,台北市南港區",
  "林口物流中心",
]);
const js = ref({
  title: "goOrLeavel - b72b7c6f-10d4-4ed6-ab7c-6f10d49ed6c0",
  body: '"objects7951" entered "\u5168\u5bb6\u5de5\u696d\u4e09\u5e97,\u53f0\u5317\u5e02\u5357\u6e2f\u5340" on 2023-07-12 at 01:21:26 (UTC).',
  contextData: {
    estimatedTransitionTime: "2023-07-12T01:21:26.270638953Z",
    eventType: "TRANSITION",
    fenceName:
      "\u5168\u5bb6\u5de5\u696d\u4e09\u5e97,\u53f0\u5317\u5e02\u5357\u6e2f\u5340",
    estimatedTransitionPositionLongitude: 121.6136872010061,
    alertName: "goOrLeavel",
    objectName: "objects7951",
    alertId: "b72b7c6f-10d4-4ed6-ab7c-6f10d49ed6c0",
    projectName: "Geofences creator",
    projectId: "ba848e64-c5d1-4190-9d41-2762966ac6f5",
    fenceId: "4a38138e-6b46-4628-8a67-376bae736d48",
    transitionType: "ENTER",
    estimatedTransitionPositionLatitude: 25.055958374371187,
    objectId: "f49cd369-4cf6-460f-9f7c-0735c80b3502",
  },
});
//console.log(js.value.body);
const MapGPS = ref();
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.addControl(
    (MapGPS.value = new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }))
  );
  console.log(MapGPS.value);
  /*MapGPS.value.on((event) => {
    console.log(event);
  });*/
  /*map.on("data", (event) => {
    console.log(event);
  });*/
  map.on("click", (event) => {
    //Listprojects()
    console.log(event.lngLat);
    //觸發測試
    //getReport(event.lngLat.lng, event.lngLat.lat);
  });
  window.map = map;
});
onUnmounted(() => {
  clearInterval(intervalId);
  clearInterval(intervalId2);
});
//=====================================================
const address = ref([]);
const address1 = ref([]);
function callbackFn(result) {
  //console.log(result);
  result.batchItems.forEach((data, index) => {
    address.value[index] = {
      point: {
        longitude: result.batchItems[index].results[0].position.lng,
        latitude: result.batchItems[index].results[0].position.lat,
      },
    };
  });
  WaypointOptimization(address.value);
  //console.log(address1.value);
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
    console.log(res);
    res.data.optimizedOrder.forEach((placeName, placeIndex) => {
      console.log(data[placeName]);
      address1.value[placeIndex] = data[placeName].point;

      /*Addnewfencetoaproject(
        routeData.value[placeName],
        address1.value[placeIndex].longitude,
        address1.value[placeIndex].latitude
      );*/

      //console.log(address1.value[index]);
      //console.log(routeData.value[index], index);
      /*if (index >= 10 && index < 12) {
        Addnewfencetoaproject(
          routeData.value[index],
          address1.value[index].longitude,
          address1.value[index].latitude,
          index
        );
      }*/
      marker(
        address1.value[placeIndex].longitude,
        address1.value[placeIndex].latitude,
        placeName
      );
    });
    route(address1.value);
  });
};

//=====================================================
//路徑生成
const saveRoadPoint = ref([]);

const route = (data) => {
  let roadline = "";
  tts.services
    .calculateRoute({
      key: TOMTOMKEY,
      locations: data,
    })
    .then(function (res) {
      roadline = res.toGeoJson().features;

      saveRoadPoint.value = res.toGeoJson().features[0].geometry.coordinates; //[第幾站點][lng座標,lat座標,color]
      saveRoadPoint.value.map((value, index) => {
        saveRoadPoint.value[index].map((value, index1) => {
          saveRoadPoint.value[index][index1].push(0);
        });
      });
      let place = Math.floor(Math.random() * 9) + 1;
      let placelatlngStart = Math.floor(Math.random() * 2);
      let placelatlngEnd = placelatlngStart + 10;
      console.log(
        `place:${place} start:${placelatlngStart} end:${placelatlngEnd}`
      );
      for (let i = 0; i < placelatlngEnd; i++) {
        saveRoadPoint.value[place][i][2] = 1;
      }

      //console.log(roadline);
      console.log(saveRoadPoint.value);
      roadline.forEach((features, index) => {
        //console.log(features);
        window.map.addLayer({
          id: "route" + index,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
          paint: {
            "line-width": 3,
            "line-opacity": 0.5,
          },
        });
      });
    });
};
//=====================================================
//圍欄註冊
const Addnewfencetoaproject = (data, lng, lat, counter = 0) => {
  const retryTimes = 5;
  apiAddnewfencetoaproject(
    `ba848e64-c5d1-4190-9d41-2762966ac6f5`,
    `lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes`,
    {
      name: data,
      type: "Feature",
      geometry: {
        radius: 200,
        type: "Point",
        shapeType: "Circle",
        coordinates: [lng, lat],
      },
      properties: {
        //Optional
        type: "Feature",
      },
    }
  )
    .then((res) => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err.response.status);
      if (
        (err.response.status == 403 || err.response.status == 429) &&
        counter < retryTimes
      ) {
        counter++;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(Addnewfencetoaproject(data, lng, lat, counter));
          }, 1000);
        });
      }
    });
};
//=====================================================
//資料長輪詢
const alertData = ref({});
const oldalertTime = ref();
const alretArr = ref([]);
const alertCount = ref(0);
//長輪詢計時器
let intervalId2;
const alertUse = () => {
  intervalId2 = window.setInterval(() => {
    getTomTomAlert().then((res) => {
      // 在这里处理获取到的数据
      alertData.value = res.data;
      console.log(alertData.value);

      let transitionType = alertData.value.contextData.transitionType;
      let objectId = alertData.value.contextData.objectName;
      let fenceName = alertData.value.contextData.fenceName;
      fenceName = fenceName.replace(",台北市南港區", "");

      let time = res.data.contextData.estimatedTransitionTime;

      let aData = new Date(time);
      let Month =
        aData.getMonth() < 9
          ? "0" + (aData.getMonth() + 1)
          : aData.getMonth() + 1;
      let Hours =
        aData.getHours() <= 9 ? "0" + aData.getHours() : aData.getHours();
      let Minutes =
        aData.getMinutes() <= 9 ? "0" + aData.getMinutes() : aData.getMinutes();
      let Seconds =
        aData.getSeconds() <= 9 ? "0" + aData.getSeconds() : aData.getSeconds();
      let timeData =
        aData.getFullYear() +
        "-" +
        Month +
        "-" +
        aData.getDate() +
        " " +
        Hours +
        ":" +
        Minutes +
        ":" +
        Seconds;

      console.log(timeData);
      time = timeData;

      if (transitionType != "DWELL") {
        if (alertCount.value == 0) {
          oldalertTime.value = time;
          alretArr.value.unshift({ objectId, transitionType, fenceName });
          alertCount.value = 1;
        } else if (
          oldalertTime.value !=
          alertData.value.contextData.estimatedTransitionTime
        ) {
          oldalertTime.value =
            alertData.value.contextData.estimatedTransitionTime;

          alretArr.value.unshift({ objectId, transitionType, fenceName, time });
        }
      }
    });
  }, 1000);
};

//=====================================================
//假資料生成
const GPSCount = ref(0);
const placePoint = ref(0);
const GPSNumber = ref([]);
//saveRoadPoint計時器
let intervalId;

intervalId = window.setInterval(() => {
  if (saveRoadPoint.value != "") {
    //============
    //模擬開始結束判斷式
    if (
      placePoint.value == saveRoadPoint.value.length - 1 &&
      GPSCount.value == 120
    ) {
      placePoint.value = 0;
      GPSCount.value = 0;
      GPSNumber.value = [];
    }
    let firstGPS = 550;
    if (placePoint.value == 0 && GPSCount.value == 0) {
      GPSCount.value = firstGPS;
    }
    //============
    let GPSlng = saveRoadPoint.value[placePoint.value][GPSCount.value][0];
    let GPSlat = saveRoadPoint.value[placePoint.value][GPSCount.value][1];
    let GPSColor = saveRoadPoint.value[placePoint.value][GPSCount.value][2];
    GPSNumber.value[GPSCount.value] = new tt.Marker({
      element: iconSytle(mdiCarBack, iconColor(GPSColor)),
    })
      .setLngLat({
        lat: GPSlat,
        lng: GPSlng,
      })
      .addTo(window.map);
    window.map.panTo({
      lat: GPSlat,
      lng: GPSlng,
    });
    getReport(GPSlng, GPSlat);
    if (GPSCount.value > 0) {
      //增加首次啟動時判斷式(下橋開始)
      if (GPSCount.value != firstGPS) {
        GPSNumber.value[GPSCount.value - 1].remove();
      }
    }
    if (GPSCount.value == saveRoadPoint.value[placePoint.value].length - 1) {
      GPSNumber.value[GPSCount.value].remove();
    }

    if (GPSCount.value == saveRoadPoint.value[placePoint.value].length - 1) {
      if (placePoint.value == saveRoadPoint.value.length - 1) {
        placePoint.value = 0;
      } else {
        placePoint.value++;
      }
      GPSCount.value = 0;
      GPSNumber.value = [];
    } else {
      GPSCount.value += 1;
    }
  }
}, 2000);
//=====================================================
//現在時間製作
let aData = new Date();
let Month =
  aData.getMonth() < 9 ? "0" + (aData.getMonth() + 1) : aData.getMonth() + 1;
let Hours = aData.getHours() <= 9 ? "0" + aData.getHours() : aData.getHours();
let Minutes =
  aData.getMinutes() <= 9 ? "0" + aData.getMinutes() : aData.getMinutes();
let Seconds =
  aData.getSeconds() <= 9 ? "0" + aData.getSeconds() : aData.getSeconds();
let timeData =
  aData.getFullYear() +
  "-" +
  Month +
  "-" +
  aData.getDate() +
  "T" +
  Hours +
  ":" +
  Minutes +
  ":" +
  Seconds;

const ListObjectsData = ref([]);
const Listobjects = (data) => {
  apiListobjects().then((res) => {
    ListObjectsData.value = res.data.objects[0].id;
    //console.log(ListObjectsData.value);
  });
};
const getReport = (lng, lat, objectName = "") => {
  Listobjects();
  apipostReport(
    ListProjectsData.value,
    lng,
    lat,
    0,
    ListObjectsData.value,
    0,
    timeData
  ).then((res) => {
    console.log(res.data);
  });
  //HistorySendPosition(GPSgo[num].lng, GPSgo[num].lat);
};
//=====================================================
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
const addressNumber = ref([]);
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
  //console.log(svgElement);
  const popup = new tt.Popup({ offset: popupOffsets }).setHTML(
    `${index} : ${routeData.value[index]} `
  );
  //==========
  addressNumber.value[index] = new tt.Marker({
    element: iconSytle(mdiMapMarkerRadiusOutline),
  })
    .setLngLat({ lat: latData, lng: lngData })
    .addTo(window.map);
  addressNumber.value[index].setPopup(popup);
};

//批量輸入
const routeNameDataArr = ref([]);
const routeNameData = (data) => {
  data.map((value, index) => {
    routeNameDataArr.value[index] = {
      query: `${value}`,
      bestResult: true,
    }; /*
    if (value == "林口物流中心") {
      routeNameDataArr.value[index] = {
        query: `${value}`,
        bestResult: true,
      };
    } else {
      routeNameDataArr.value[index] = {
        query: `${value},台北市南港區`,
        bestResult: true,
      };
    }*/
  });
  //console.log(routeNameDataArr.value);
};

//模糊搜索
const addressData = () => {
  Listprojects();
  /*tts.services
    .geocode({
      batchMode: "sync",
      key: TOMTOMKEY,
      batchItems: routeAddressData.value,
    })
    */
  routeNameData(routeData.value);
  //console.log(routeNameDataArr.value);
  tts.services
    .fuzzySearch({
      batchMode: "sync",
      key: TOMTOMKEY,
      batchItems: routeNameDataArr.value,
    })
    .then(callbackFn);
  alertUse();
};

const ListProjectsData = ref([]);
const Listprojects = () => {
  apiListprojects().then((res) => {
    //console.log(res.data.projects[0].id);
    ListProjectsData.value = res.data.projects[0].id;
    Listthefencesforagivenproject(ListProjectsData.value);
  });
};

const ListfencesData = ref([]);
const Listthefencesforagivenproject = (data) => {
  apiListthefencesforagivenproject(data).then((res) => {
    ListfencesData.value = res.data.fences;
    Promise.all(
      ListfencesData.value.map((value) => {
        console.log(value);
        Getfencedetails(value.id);
      })
    );
    //Getfencedetails(ListfencesData.value[0].id);
  });
};
const defaultOptions = {
  style: {
    stroke: true,
    color: "#61ade0",
    opacity: 0.8,
    fillOpacity: 0.2,
    lineJoin: "round",
    lineCap: "round",
    weight: 3,
    steps: 40,
  },
};
const Getfencedetails = (fencesData, counter = 0) => {
  const retryTimes = 5;
  apiGetfencedetails(fencesData)
    .then((res) => {
      console.log(res);
      let _center = turf.point(res.data.geometry.coordinates);
      let _radius = res.data.geometry.radius / 1000;
      let _options = {
        steps: defaultOptions.style.steps,
        units: "kilometers", // or "mile"
      };
      let _circle = turf.circle(_center, _radius, _options);
      console.log(_circle);
      window.map.addSource(`${fencesData}`, {
        type: "geojson",
        data: _circle,
      });
      if (defaultOptions.style.stroke) {
        window.map.addLayer({
          id: `${fencesData}_line`,
          type: "line",
          source: `${fencesData}`,
          layout: {
            "line-join": defaultOptions.style.lineJoin,
            "line-cap": defaultOptions.style.lineCap,
          },
          paint: {
            "line-color": defaultOptions.style.color,
            "line-opacity": defaultOptions.style.opacity,
            "line-width": defaultOptions.style.weight,
          },
        });
      }
      window.map.addLayer({
        id: `${fencesData}_fill`,
        type: "fill",
        source: `${fencesData}`,
        paint: {
          "fill-color": defaultOptions.style.color,
          "fill-opacity": defaultOptions.style.fillOpacity,
        },
      });
    })
    .catch((err) => {
      //console.log(err.response.status);
      if (
        (err.response.status == 403 || err.response.status == 429) &&
        counter < retryTimes
      ) {
        counter++;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(Getfencedetails(fencesData, counter));
          }, 1000);
        });
      }
    });
};
</script>

<template>
  <LayoutAuthenticated>
    <div class="m-2">
      <BaseButtons>
        <BaseButton
          class="grid border-2 border-gray-200 dark:border-gray-500"
          label="Show Itinerary"
          @click="addressData()"
        ></BaseButton>
        <!--

        
        <BaseButton
          class="grid border-2 border-gray-200 dark:border-gray-500"
          label="Show Fence"
          @click="Listprojects()"
        ></BaseButton>
        
        <BaseButton
          class="grid border-2 border-gray-200 dark:border-gray-500"
          label="Show objects"
          @click="Listobjects()"
        ></BaseButton>
        -->
      </BaseButtons>
      <div class="mt-2 grid h-[75vh] grid-cols-5 gap-2">
        <CardBox
          class="col-span-4 border-2 border-gray-200 dark:border-gray-500"
        >
          <div
            class="h-[100%] w-auto lg:h-[100%] lg:w-[100%]"
            id="map"
            ref="mapRef"
          ></div>
        </CardBox>
        <CardBox
          class="overflow-y-auto border-2 border-gray-200 aside-scrollbars-light dark:border-gray-500"
        >
          <CardBoxComponentTitle title="Alert Event" main class="border-b-2">
          </CardBoxComponentTitle>
          <div
            class="mt-2 grid gap-2 rounded-lg border-2 text-center"
            v-for="(item, index) in alretArr"
          >
            <div class="flex border-b-2 text-left text-red-400">
              <BaseIcon
                :path="mdiBellAlert"
                size="16"
                class="m-2 text-red-400"
              />
              <div class="flex place-items-center">
                {{ item.transitionType }}
              </div>
            </div>
            <div>{{ item.objectId }}</div>
            <div>{{ item.fenceName }}</div>
            <div>{{ item.time }}</div>
          </div>
        </CardBox>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style></style>
