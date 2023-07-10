<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  apiAddnewfencetoaproject,
  apiWaypointOptimization,
  apiListthefencesforagivenproject,
  apiListprojects,
  apiGetfencedetails,
} from "@/api/apiTomtom";
import { mdiStore, mdiCar, mdiMapMarkerRadiusOutline, mdiTruck } from "@mdi/js";
import * as turf from "@turf/turf";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";

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

const MapGPS = ref();
const isOpenTime = ref(false);
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

  window.map = map;
});
onUnmounted(() => {
  clearInterval(intervalId);
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
    res.data.optimizedOrder.forEach((features, index) => {
      address1.value[index] = data[features].point;
      /*Addnewfencetoaproject(
        routeData.value[index],
        address1.value[index].longitude,
        address1.value[index].latitude
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
        address1.value[index].longitude,
        address1.value[index].latitude,
        features
      );
    });
    route(address1.value);
  });
};

//=====================================================
//路徑生成
//saveRoadPoint計時器
let intervalId;
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
    `1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj`,
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
//假資料生成
const GPSCount = ref(0);
const placePoint = ref(0);
const GPSNumber = ref([]);

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
    let firstGPS = 360;
    if (placePoint.value == 0 && GPSCount.value == 0) {
      GPSCount.value = firstGPS;
    }
    //============
    let GPSlng = saveRoadPoint.value[placePoint.value][GPSCount.value][0];
    let GPSlat = saveRoadPoint.value[placePoint.value][GPSCount.value][1];
    let GPSColor = saveRoadPoint.value[placePoint.value][GPSCount.value][2];

    console.log(GPSCount.value);
    GPSNumber.value[GPSCount.value] = new tt.Marker({
      element: iconSytle(mdiTruck, iconColor(GPSColor)),
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
}, 300);
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
        <BaseButton
          class="grid border-2 border-gray-200 dark:border-gray-500"
          label="Show Fence"
          @click="Listprojects()"
        ></BaseButton>
      </BaseButtons>
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
    </div>
  </LayoutAuthenticated>
</template>
