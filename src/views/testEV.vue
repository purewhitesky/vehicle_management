<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import TomTomStyle from "@/style/tomtomstyle.json";
import * as turf from "@turf/turf";
import BaseButton from "@/components/BaseButton.vue";
import { ref, reactive, onMounted, computed } from "vue";
import { mdiEvStation } from "@mdi/js";
import { apiGetGogoroList, apiPostGogoroVM } from "@/api/apiGogoro";
import { useSetIcon } from "@/components/useTomTomIconElement";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
const isEVOpen = ref(false);
const ownGPSLocation = ref();
const gogoroClick = ref(false);
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
    style: TomTomStyle,
  });
  let geolocateControl;
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.addControl(
    new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }).on("geolocate", function (event) {
      //console.log(event.coords);
      ownGPSLocation.value = event.coords;
      //console.log("緯度：" + ownGPSLocation.value.latitude);
      //console.log("經度：" + ownGPSLocation.value.longitude);
    })
  );
  map.on("click", (event) => {
    //Listprojects()
    gogoroClick.value = !gogoroClick.value;
    console.log(event);
    //觸發測試
    //getReport(event.lngLat.lng, event.lngLat.lat);
  });

  /*map.on("click", (event) => {
    const position = event.lngLat;
    console.log(position);
  });*/

  map.on("moveend", () => {
    if (navigationOpen.value == false) {
      openEVstation();
      console.log("moveend");
    } else {
      console.log("navigation");
    }
  });

  //console.log(map.getBounds());

  window.map = map;
});

const gogoraList = ref([]);
apiGetGogoroList().then((res) => {
  console.log(res.data);
  console.log(res);
  res.data.data.forEach((item, index) => {
    useSetIcon(
      {
        lng: item.longitude,
        lat: item.latitude,
      },
      index,
      "40px",
      `/Gogoro_icon3.png`,
      window.map
    );
  });

  console.log(gogoraList.value);
});

const EVData = ref({
  IEC62196Type1: " J1772(Type1)",
  IEC62196Type1CCS: "CCS1",
  IEC62196Type2CableAttached: "Type2",
  IEC62196Type2Outlet: "Type2",
  IEC62196Type2CCS: "CCS2",
  Chademo: "CHAdeMO",
  GBT20234Part2: "GB/T 20234.2",
  GBT20234Part3: "GB/T 20234.3",
  Tesla: "Tesla",
});

const EVNumber = ref([]);
const openEVstation = (isclose) => {
  /*if (isclose) {
    navigationOpen.value = false;
  }*/
  EVstation(map.getBounds()._sw, map.getBounds()._ne);
};
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

const navigationCount = ref(0);
const navigationOpen = ref(false);
function iconElement(marker, index, iconlistNum, isOpen) {
  console.log(marker);
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

  const buttonElement = document.createElement("button");
  buttonElement.textContent = "Navigation"; // 按鈕上的文字
  buttonElement.className = "mt-2 w-full rounded-lg border-2 "; // 添加類別

  // 綁定 click 事件的處理函式
  buttonElement.addEventListener("click", (event) => {
    if (navigationCount.value == 0) {
      navigationOpen.value = true;
      navigationCount.value = 1;
    } else {
      window.map.removeLayer(`route`);
      window.map.removeSource(`route`);
    }
    // 在此處理 click 事件的程式碼
    const navigationData = ref([]);
    console.log(ownGPSLocation.value);
    console.log(EVNumber.value[index].getLngLat());
    navigationData.value[0] = {
      lng: ownGPSLocation.value.longitude,
      lat: ownGPSLocation.value.latitude,
    };
    navigationData.value[1] = EVNumber.value[index].getLngLat();
    route(navigationData.value);
  });

  function route(data) {
    let roadline = "";
    tts.services
      .calculateRoute({
        key: TOMTOMKEY,
        locations: data,
      })
      .then(function (res) {
        roadline = res.toGeoJson().features;
        roadline.forEach((features, index) => {
          window.map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: features,
            },
          });
        });
      });
  }

  const textElement = document.createElement("div");
  textElement.className = "text-black";
  let chargData = "";
  marker.chargingPark.connectors.map((value, index) => {
    /*console.log(
      EVData.value[marker.chargingPark.connectors[index].connectorType].name
    );*/
    chargData += `
    <br>RatedPowerKW：${marker.chargingPark.connectors[index].ratedPowerKW}
    <br>connectorType：${
      EVData.value[marker.chargingPark.connectors[index].connectorType]
    }
    `;
  });
  console.log(chargData);

  textElement.innerHTML = `${marker.poi.name}
    ${chargData}`;
  textElement.appendChild(buttonElement);

  const elementCreator = () => {
    const generator = (innerHTML) => {
      const parser = new DOMParser();
      const testElement = parser.parseFromString(innerHTML, "text/html");
      return testElement.body;
    };

    return {
      element: (innerHTML) => {
        return generator(innerHTML);
      },
      button: (innerHTML, onClickCallBack) => {
        const btn = generator(innerHTML);
        btn.addEventListener("click", onClickCallBack);
        return btn;
      },
    };
  };

  const popupBoxCreator = () => {
    const box = elementCreator().element(
      /*html*/
      `<div class="text-red-500 text-lg font-bold">
        測試
        
      </div>`
    );

    const button = elementCreator().button(
      /*html*/
      `<button class="mt-2 w-full rounded-lg border-2">
        Navigation
      </button>`,
      () => {
        console.log("clickiiiiiiiii");
      }
    );

    box.appendChild(button);

    return box;
  };

  const popup = new tt.Popup({ offset: popupOffsets }).setDOMContent(
    // textElement
    popupBoxCreator()
  );
  console.log(textElement);
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
  <LayoutAuthenticated>
    <div class="relative m-6">
      <BaseButton
        class="w-full border-2 border-gray-200 dark:border-gray-500"
        label="View nearby charging stations"
        @click="openEVstation(true)"
      ></BaseButton>
      <!--<button class="w-full rounded-lg border-2" @click="navigation()">
        navigation
      </button>-->
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
      <Transition>
        <template v-if="gogoroClick">
          <CardBox
            class="absolute left-10 bottom-[5%] h-[82%] w-[23%] overflow-y-auto border-2 border-gray-200 aside-scrollbars-light dark:border-gray-500"
          >
            <CardBoxComponentTitle
              title="VINID"
              main
              class="border-b-2 border-slate-400"
            ></CardBoxComponentTitle>

            <div>|</div>
          </CardBox>
        </template>
      </Transition>
    </div>
  </LayoutAuthenticated>
</template>
