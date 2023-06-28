<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import { ref, onMounted, nextTick } from "vue";
import tt, { map } from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css"; //必須加入
import UserAvatarCurrentUser from "@/components/UserAvatarCurrentUser.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import axios from "axios";
import {
  apiSynchronousMatrix,
  apiWaypointOptimization,
  apiRegisterAdminKey,
  apiRegenerateAdminKey,
  apiListcurrentoptions,
  apiSetnewsettingsvalues,
  apiListprojects,
} from "@/api/apiTomtom";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);

const center = { lat: 25.034228, lng: 121.563995 };
const center1 = { lat: 25.037228, lng: 121.566995 };
const markerList = [
  { lat: 25.034228, lng: 121.563995 },
  { lat: 25.035228, lng: 121.564995 },
  { lat: 25.036228, lng: 121.565995 },
  { lat: 25.037228, lng: 121.566995 },
];
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 15,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  //const a = new tt.Marker().setLngLat(center).addTo(map);
  window.map = map;
  //console.log(map);
  //new tt.Marker({ element: element }).setLngLat(center).addTo(window.map);
});

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
  return url;
}
//==== 懸浮框的設定黨 ====
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
//==== ==== ==== ==== ====
function iconElement(marker, index, iconlistNum) {
  let element = document.createElement("div");
  element.style.backgroundImage = "url(" + setGPSMarkerColor(iconlistNum) + ")";
  element.style.backgroundSize = "20px";
  element.style.height = "20px";
  element.style.width = "20px";

  markerData[index] = new tt.Marker({ element: element })
    .setLngLat({ lat: marker.lat, lng: marker.lng })
    .addTo(window.map);

  /*new tts.services.reverseGeocode({
    language: "en-US",
    key: TOMTOMKEY,
    position: { lat: marker.lat, lng: marker.lng },
  }).then((res) => {
    const popup = new tt.Popup({ offset: popupOffsets }).setHTML(
      res.addresses[0].address.freeformAddress
    );
    markerData[index].setPopup(popup);
  });*/
}

let markerData = [];
const markerDataSee = ref([]);
const outData = ref("");
const openIcon = ref(false);
const addMarker = (iconNum) => {
  if (openIcon.value) {
    removeMarker();
  }
  openIcon.value = true;
  markerList.forEach((marker, index) => {
    iconElement(marker, index, iconNum);
  });

  //a = new tt.Marker().setLngLat(center).addTo(window.map);
  window.map.panTo(center1);
  console.log("add");
  console.log(mapRef.value);
};

/*function addM() {
  a = new tt.Marker().setLngLat(center).addTo(window.map);
  setTimeout(() => {
    a.remove();
    console.log("remove");
  }, 500);
}
setInterval(() => {
  addM();
  console.log("updata");
}, 1000);*/

/*tts.services
  .reverseGeocode({
    language: "en-US",
    key: TOMTOMKEY,
    position: { lat: "25.032770628027805", lng: "121.57012507387039" },
  })
  .then((res) => {
    console.log(res.addresses[0].address.freeformAddress);
  });*/

/*tts.services
  .reverseGeocode({
    batchMode: "sync",
    key: TOMTOMKEY,
    batchItems: [
      { position: { lat: "25.032770628027805", lng: "121.57012507387039" } },
      { position: { lat: "25.029957532499", lng: "121.56832474139684" } },
    ],
  })
  .then((res) => {
    console.log(res);
  });*/

/*tts.services.alongRouteSearch
tts.services.categorySearch
tts.services.geometrySearch
tts.services.nearbySearch
tts.services.poiSearch*/

/*tts.services.fuzzySearch({

})*/
//==============================================

function callbackFn(res) {
  addGeocodeMarker(res, 0);
  console.log(res);
}
const addGeocodeMarker = (marker, index) => {
  markerDataSee.value = marker;
  iconElement(marker.position, index, 0);
  window.map.panTo(marker.position);
  console.log("add");
  console.log(mapRef.value);
};

function callbackFnArr(res) {
  addMarkerArr(res.results);
  console.log(res.results);
}
const addMarkerArr = (marker) => {
  console.log(marker);
  markerDataSee.value = marker;
  marker.forEach((data, index) => {
    iconElement(data.position, index, 0);
  });
  //a = new tt.Marker().setLngLat(center).addTo(window.map);
  window.map.panTo(marker[0].position);
  console.log("add");
};

const addMarker1 = (marker) => {
  //a = new tt.Marker().setLngLat(center).addTo(window.map);
  iconElement(marker, 0, 0);
  console.log("add");
};

const removeMarker = () => {
  console.log(markerData);
  if (markerData.length == 1) {
    markerData[0].remove();
  } else {
    markerData.forEach((marker, index) => {
      markerData[index].remove();
    });
  }
  markerDataSee.value = "";
  console.log("remove");
};
//==============================================
//模糊
const fuzzySearch = (num) => {
  if (openIcon.value) {
    removeMarker();
  }
  if (num == 0) {
    tts.services
      .fuzzySearch({
        key: TOMTOMKEY,
        query: "南港展覽館",
      })
      .then(callbackFnArr);
  } else {
    tts.services
      .fuzzySearch({
        key: TOMTOMKEY,
        query: "南港展覽館",
        bestResult: true,
      })
      .then(callbackFn);
  }
  openIcon.value = true;
  outData.value = `if (num == 0) {
    if (openIcon.value) {
      removeMarker();
    }
    tts.services
      .fuzzySearch({
        key: TOMTOMKEY,
        query: "南港展覽館",
      })
      .then(callbackFnArr);
  } else {
    if (openIcon.value) {
      console.log(markerData);
      removeMarker();
    }
    tts.services
      .fuzzySearch({
        key: TOMTOMKEY,
        query: "南港展覽館",
        bestResult: true,
      })
      .then(callbackFn);
  }`;
};
//==============================================
//類別
const categorySearch = () => {
  if (openIcon.value) {
    removeMarker();
  }
  tts.services
    .categorySearch({
      key: TOMTOMKEY,
      query: "捷運站",
      center: center,
      redius: 10000,
      limit: 10,
    })
    .then(callbackFnArr);
  openIcon.value = true;
  outData.value = `tts.services
    .categorySearch({
      key: TOMTOMKEY,
      query: "捷運站",
      center: center,
      redius: 1000,
      limit: 10,
    })
    .then(callbackFnArr);`;
};
//==============================================
//幾何
const CIRCLEList = [
  {
    type: "CIRCLE",
    position: "121.563995,25.034228",
    radius: 1000,
  },
];
const POLYGONList = [
  {
    type: "POLYGON",
    vertices: [
      "121.563995,25.034228",
      "121.583995,25.034228",
      "121.563995,25.054228",
      "121.583995,25.054228",
    ],
  },
];
//==============================================
const geometrySearch = (num) => {
  if (openIcon.value) {
    removeMarker();
  }
  if (num == 0) {
    tts.services
      .geometrySearch({
        key: TOMTOMKEY,
        geometryList: CIRCLEList,
        query: "捷運站",
      })
      .then(callbackFnArr);
    console.log(markerData);
  } else {
    tts.services
      .geometrySearch({
        key: TOMTOMKEY,
        geometryList: POLYGONList,
        query: "捷運站",
      })
      .then(callbackFnArr);
  }
  openIcon.value = true;
  outData.value = `if (num == 0) {
    tts.services
      .geometrySearch({
        key: TOMTOMKEY,
        geometryList: CIRCLEList,
        query: "捷運站",
      })
      .then(callbackFnArr);
    console.log(markerData);
  } else {
    tts.services
      .geometrySearch({
        key: TOMTOMKEY,
        geometryList: POLYGONList,
        query: "捷運站",
      })
      .then(callbackFnArr);
  }`;
};
//==============================================
const nearbySearch = () => {
  if (openIcon.value) {
    removeMarker();
  }
  tts.services
    .nearbySearch({
      key: TOMTOMKEY,
      center: center,
      radius: 1000,
    })
    .then(callbackFnArr);
  openIcon.value = true;
  outData.value = `  
  tts.services
  .nearbySearch({
    key: TOMTOMKEY,
    center: center,
    radius: 1000,
  })
  .then(callbackFnArr);`;
};
//==============================================
const poiSearch = () => {
  if (openIcon.value) {
    removeMarker();
  }
  tts.services
    .poiSearch({
      key: TOMTOMKEY,
      center: center,
      query: "pizza",
    })
    .then(callbackFnArr);
  openIcon.value = true;
  outData.value = `
  tts.services
  .poiSearch({
    key: TOMTOMKEY,
    center: center,
    query: "pizza",
  })
  .then(callbackFnArr);`;
};
//==============================================
const alongRouteSearch = () => {
  if (openIcon.value) {
    removeMarker();
  }
  tts.services
    .alongRouteSearch({
      key: TOMTOMKEY,
      limit: 20,
      maxDetourTime: 120,
      query: "gas station",
      route: [
        {
          lat: 37.7524152343544,
          lon: -122.43576049804686,
        },
        {
          lat: 37.70660472542312,
          lon: -122.43301391601562,
        },
        [-122.36434936523438, 37.712059855877314], // Another valid format
      ],
    })
    .then(callbackFnArr);
  openIcon.value = true;
  outData.value = `
  tts.services
  .alongRouteSearch({
    key: TOMTOMKEY,
    limit: 20,
    maxDetourTime: 120,
    query: "gas station",
    route: [
      {
        lat: 37.7524152343544,
        lon: -122.43576049804686,
      },
      {
        lat: 37.70660472542312,
        lon: -122.43301391601562,
      },
      [-122.36434936523438, 37.712059855877314], // Another valid format
    ],
  })
  .then(function (response) {
    console.table(response);
  });`;
};
//==============================================
const removeBoolen = ref(false);
const MatrixData = ref("");
const route = () => {
  const locations =
    "121.51798234054269,25.047800815245218:121.61805647210734,25.055041370325878";
  let roadline = "";
  tts.services
    .calculateRoute({
      key: TOMTOMKEY,
      locations: locations,
    })
    .then(function (res) {
      /*if (removeBoolen.value) {
        console.log("removeLayer");
        window.map.removeLayer("route");
      }*/
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
      //removeBoolen.value = true;
    });
  apiSynchronousMatrix({
    origins: [
      {
        point: { latitude: 25.047800815245218, longitude: 121.51798234054269 },
      },
    ],
    destinations: [
      {
        point: { latitude: 25.055041370325878, longitude: 121.61805647210734 },
      },
    ],
  }).then((res) => {
    MatrixData.value = res.data.data[0].routeSummary;
    console.log(MatrixData.value);
  });

  outData.value = `
const locations =
  "121.51798234054269,25.047800815245218:121.61805647210734,25.055041370325878";
let roadline = "";
const locations1 = tts.services
  .calculateRoute({
    key: TOMTOMKEY,
    locations: locations,
  })
  .then(function (res) {
    roadline = res.toGeoJson().features;
    roadline.forEach((features, index) => {
      map.addLayer({
        id: "route" + index,
        type: "line",
        source: {
          type: "geojson",
          data: features,
        },
      });
    });
  });

  apiSynchronousMatrix( {
    origins: [
      {
        point: { latitude: 25.047800815245218, longitude: 121.51798234054269 },
      },
    ],
    destinations: [
      {
        point: { latitude: 25.055041370325878, longitude: 121.61805647210734 },
      },
    ],
  }).then((res) => {
    console.log(res.data);
  });`;
};
//==============================================
const Waypoint = ref();
const jsonData = ref([
  {
    point: {
      longitude: 16.90497409165738,
      latitude: 52.41111094318538,
    },
  },
  {
    point: {
      longitude: 16.90709715173861,
      latitude: 52.410666138418065,
    },
  },
  {
    point: {
      longitude: 16.909298155957515,
      latitude: 52.410228259481045,
    },
  },
  {
    point: {
      longitude: 16.907319287272202,
      latitude: 52.41061316108531,
    },
  },
  {
    point: {
      longitude: 16.910996727064912,
      latitude: 52.41041397793927,
    },
  },
  {
    point: {
      longitude: 16.911123756099897,
      latitude: 52.41066703462286,
    },
  },
  {
    point: {
      longitude: 16.90941955426868,
      latitude: 52.41122957918256,
    },
  },
]);
const waypointOptimization = () => {
  apiWaypointOptimization({
    waypoints: jsonData.value,
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
    Waypoint.value = res.data;
    console.log(res);
  });
  outData.value = `  
  apiWaypointOptimization( {
    waypoints: jsonData.value,
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
    Waypoint.value = res.data;
    console.log(res);
  });`;
};
//==============================================
const longDistanceEVRouting = () => {
  tts.services
    .longDistanceEVRouting({
      key: TOMTOMKEY,
      locations:
        "121.6167426047844,25.056611596944748:121.01004167048252,24.838322855248673",
      vehicleEngineType: "electric",
      avoid: "unpavedRoads",
      constantSpeedConsumptionInkWhPerHundredkm: ["50.0,6.5", "100.0,8.5"],
      currentChargeInkWh: 10,
      maxChargeInkWh: 40,
      minChargeAtDestinationInkWh: 5.2,
      minChargeAtChargingStopsInkWh: 1.5,
      chargingModes: [
        {
          chargingConnections: [
            {
              facilityType: "Charge_200_to_480V_Direct_Current_at_255A_120kW",
              plugType: "CHAdeMO",
            },
          ],
          chargingCurve: [
            {
              chargeInkWh: 6,
              timeToChargeInSeconds: 300,
            },
            {
              chargeInkWh: 12,
              timeToChargeInSeconds: 720,
            },
            {
              chargeInkWh: 24,
              timeToChargeInSeconds: 1500,
            },
            {
              chargeInkWh: 40,
              timeToChargeInSeconds: 3000,
            },
          ],
        },
      ],
    })
    .then(function (routeData) {
      console.log(routeData);
      routeData.toGeoJson().features.forEach((features, index) => {
        window.map.addLayer({
          id: "route" + index,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
        });
      });

      routeData.routes[0].legs.forEach(function (leg) {
        let chargeInfo = leg.summary.chargingInformationAtEndOfLeg;
        if (chargeInfo) {
          let id = routeData.routes[0].legs.indexOf(leg) + 1;
          addMarker1(leg.points[leg.points.length - 1]);
        }
      });
    });
};
//==============================================
//地理圍欄
const Register = () => {
  apiRegisterAdminKey({
    secret: "secret_key",
  }).then((res) => {
    console.log(res);
  });
};
const Regenerate = () => {
  apiRegenerateAdminKey({
    secret: "secret_key",
  }).then((res) => {
    console.log(res.data.adminKey);
    apiSetnewsettingsvalues(res.data.adminKey, {
      consentForStoringObjectsPositionsHistory: true,
      consentForStoringTransitionsHistory: true,
    });
    apiListcurrentoptions(res.data.adminKey).then((res) => {
      console.log(res);
    });
  });
};
const List = () => {
  apiListcurrentoptions(
    "ldmE3dIU9yBtrlyoagAgO379elm0o6PmjyvkhssEf50Mm7Xa"
  ).then((res) => {
    console.log(res);
  });
};
const Listprojects = () => {
  apiListprojects().then((res) => {
    console.log(res);
  });
};
</script>
<template>
  <LayoutAuthenticated>
    <div class="m-2">
      <input />
      <div class="h-[70vh] w-auto lg:h-[40vh] lg:w-[100%]" ref="mapRef"></div>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="ICON切換" />
          <BaseButton label="綠" @click="addMarker(0)" />
          <BaseButton label="紫" @click="addMarker(1)" />
          <BaseButton label="紅" @click="addMarker(2)" />
          <BaseButton label="警告" @click="addMarker(3)" />
          <BaseButton label="remove" @click="removeMarker" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="模糊搜索" class="gay-2" />
          <BaseButton label="結果" @click="fuzzySearch(0)" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="類別搜索" />
          <BaseButton label="結果" @click="categorySearch()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="幾何搜索" />
          <BaseButton label="CIRCLE" @click="geometrySearch(0)" />
          <BaseButton label="POLYGON" @click="geometrySearch(1)" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="附近搜索" />
          <BaseButton label="結果" @click="nearbySearch()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="興趣點搜索" />
          <BaseButton label="add0" @click="poiSearch()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="沿途搜索" />
          <BaseButton label="add0" @click="alongRouteSearch()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="路由" />
          <BaseButton label="結果" @click="route()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="航點優化" />
          <BaseButton label="結果" @click="waypointOptimization()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="擴充路由" />
          <BaseButton label="結果" @click="longDistanceEVRouting()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="註冊圍欄秘鑰" />
          <BaseButton label="結果" @click="Register()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="更新圍欄秘鑰" />
          <BaseButton label="結果" @click="Regenerate()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看圍欄秘鑰" />
          <BaseButton label="結果" @click="List()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看項目" />
          <BaseButton label="結果" @click="Listprojects()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="輸入" />
          {{ outData }}
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="輸出" />
          <div v-for="(data, index) in markerDataSee">
            第{{ index }}筆，地址{{ data.address.freeformAddress }}
          </div>
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="路由輸出" />
          <div>{{ MatrixData }}</div>
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="優化輸出" />
          <div>{{ Waypoint }}</div>
        </CardBox>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped></style>
