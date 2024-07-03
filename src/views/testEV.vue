<script setup>
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

import * as turf from "@turf/turf";
import qs from "qs";
import { mdiEvStation, mdiCar } from "@mdi/js";
import { apiGetGogoroList, apiGetGogoroVM } from "@/api/apiGogoro";
import {
  useSetUrlIcon,
  useSetSVGIcon,
} from "@/components/useTomTomIconElement";
import { elementCreator, popupOffsets } from "@/components/HtmlCreator";
import { ref, onMounted } from "vue";

//=======================================
//setting
const gogoroUrlIcon = "/Gogoro_icon3.png";
const tomtomUrlIcon = "/EV.png";

//=======================================
const TOMTOMKEY = import.meta.env.VITE_APP_API_KEY;
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
const center1 = [
  { lat: 25.034228, lng: 121.563995 },
  { lat: 25.047428, lng: 121.563995 },
  { lat: 25.034228, lng: 121.578995 },
];
const isEVOpen = ref(false);
const ownGPSLocation = ref();
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
    new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }).on("geolocate", function (event) {
      ownGPSLocation.value = event.coords;
      //console.log("緯度：" + ownGPSLocation.value.latitude);
      //console.log("經度：" + ownGPSLocation.value.longitude);
    })
  );

  map.on("moveend", () => {
    if (!navigationOpen.value && tomtomOpen.value) {
      openEVstation();
      console.log("moveend");
    } else {
      console.log("navigation");
    }
  });

  window.map = map;
  center1.map((car) => {
    useSetSVGIcon(car, 0, "30px", mdiCar, window.map);
  });
});

const gogoroList = ref([]);
const gogoroVMList = ref([]);
const gogoroMarketList = ref([]);
const gogorostate = ref(true);
let gBattery = {};

//===========================
//gogoro Marker生成
const gogoro = (open) => {
  if (open && gogorostate.value) {
    navigationCount.value = 0;
    apiGetGogoroList().then((res) => {
      console.log(res.data);
      res.data.data.forEach((item, index) => {
        if (item.vm_id_list != undefined) {
          gogoroVMList.value.push(...item.vm_id_list);
        }
      });
      gogoroList.value = res.data.data;
      let glist = qs.stringify({ vm: gogoroVMList.value }, { indices: false });

      apiGetGogoroVM(glist).then((res) => {
        console.log(res.data);
        res.data.data.forEach((item) => {
          gBattery[item.vm_id] = item.battery_count;
        });
        gogoroList.value.forEach((item, index) => {
          //console.log(item);
          let _tatalbattery = 0;
          if (item.vm_id_list != undefined) {
            item.vm_id_list.forEach((vmID) => {
              _tatalbattery += gBattery[vmID] || 0;
            });
          }
          const { markerUrlData } = useSetUrlIcon(
            {
              lng: item.longitude,
              lat: item.latitude,
            },
            index,
            "40px",
            gogoroUrlIcon,
            window.map
          );
          const popupBoxCreator = () => {
            const box = elementCreator().element(
              /*html*/
              `
              <div class="text-black text-sm font-bold">
                ${item.en_name}
              </div>
              <div class="text-black text-sm text-center">
                battery Count
                <div class="text-red-500 text-lg text-center ">
                ${_tatalbattery}
                </div>
              </div>`
            );
            const button = elementCreator().button(
              /*html*/
              `
              <button class="mt-2 w-full rounded-lg border-2 text-black">
                Navigation
              </button>`,
              (event) => {
                if (ownGPSLocation.value != undefined) {
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
                  navigationData.value[0] = {
                    lng: ownGPSLocation.value.longitude,
                    lat: ownGPSLocation.value.latitude,
                  };
                  navigationData.value[1] = {
                    lng: item.longitude,
                    lat: item.latitude,
                  };
                  route(navigationData.value);
                } else {
                  console.log("no gps data");
                }
              }
            );
            box.appendChild(button);
            return box;
          };
          const popup = new tt.Popup({ offset: popupOffsets }).setDOMContent(
            //textElement
            popupBoxCreator()
          );
          markerUrlData.value[index].setPopup(popup);
          gogoroMarketList.value[index] = markerUrlData.value[index];
        });
      });
    });
    gogorostate.value = false;
    console.log("open");
  } else if (!open && !gogorostate.value) {
    if (routeOpen.value) {
      window.map.removeLayer(`route`);
      window.map.removeSource(`route`);
      routeOpen.value = false;
    }
    removeGogoroMarket(gogoroMarketList.value);
    gogorostate.value = true;
    console.log("remove");
  }
};
const removeGogoroMarket = (markerList) => {
  markerList.forEach((marker) => {
    marker.remove();
  });
};
//===========================

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
const openEVstation = () => {
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
      response.results.forEach((marker, index) => {
        iconElement(marker, index, 0, isEVOpen.value);
      });
      isEVOpen.value = true;
    });

const navigationCount = ref(0);
const navigationOpen = ref(false);

const tomtomState = ref(true);
const tomtomOpen = ref(false);
const tomtom = (open) => {
  if (open && tomtomState.value) {
    navigationCount.value = 0;
    navigationOpen.value = false;
    tomtomOpen.value = true;
    tomtomState.value = false;
  } else if (!open && !tomtomState.value) {
    if (routeOpen.value) {
      window.map.removeLayer(`route`);
      window.map.removeSource(`route`);
      routeOpen.value = false;
    }
    tomtomOpen.value = false;
    removeMarker(EVNumber.value);
    tomtomState.value = true;
  }
};

const routeOpen = ref(false);
function route(data) {
  routeOpen.value = true;
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

function iconElement(marker, index, iconlistNum, isOpen) {
  //console.log(marker);
  if (isOpen) {
    removeMarker(EVNumber.value);
  }
  //================================================

  const { markerUrlData } = useSetUrlIcon(
    marker.position,
    index,
    "30px",
    tomtomUrlIcon,
    window.map
  );

  EVNumber.value[index] = markerUrlData.value[index];

  let chargData = "";
  marker.chargingPark.connectors.map((value, index) => {
    chargData += `
    <br>connectorType：${
      EVData.value[marker.chargingPark.connectors[index].connectorType]
    }
    `;
  });

  const markerData = ref(marker.chargingPark.connectors[0].connectorType);
  console.log(markerData.value);
  const popupBoxCreator = () => {
    const box = elementCreator().element(
      /*html*/
      `
      <div class="text-black text-sm font-bold">
        ${marker.poi.name}
      </div>
      <div class="text-black text-sm ">
        ${chargData}
      </div>
      `
    );
    const button = elementCreator().button(
      /*html*/
      `<button class="mt-2 w-full rounded-lg border-2 text-black">
        Navigation
      </button>`,
      (event) => {
        if (ownGPSLocation.value != undefined) {
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
          console.log(markerUrlData.value[index].getLngLat());
          navigationData.value[0] = {
            lng: ownGPSLocation.value.longitude,
            lat: ownGPSLocation.value.latitude,
          };
          navigationData.value[1] = markerUrlData.value[index].getLngLat();
          route(navigationData.value);
        } else {
          console.log("no gps data");
        }
      }
    );
    box.appendChild(button);
    return box;
  };

  const popup = new tt.Popup({ offset: popupOffsets }).setDOMContent(
    //textElement
    popupBoxCreator()
  );
  EVNumber.value[index].setPopup(popup);
  //================================================
  console.log(EVNumber.value);
}
const removeMarker = () => {
  EVNumber.value.forEach((marker) => {
    marker.remove();
  });
  EVNumber.value = [];
  console.log("remove");
  console.log(EVNumber.value);

  isEVOpen.value = false;
};
let saveCurrentTarget = {};

const selectButton = (e, buttonName) => {
  e.currentTarget.classList.add("text-green-500");
  if (e.currentTarget !== saveCurrentTarget) {
    if (Object.keys(saveCurrentTarget).length > 0) {
      saveCurrentTarget.classList.remove("text-green-500");
      console.log(saveCurrentTarget);
    }
    saveCurrentTarget = e.currentTarget;
  }
  console.log(buttonName);
  switch (buttonName) {
    case "Battery swap station":
      tomtom(false);
      gogoro(true);
      console.log("gOK");
      break;
    case "charging station":
      tomtom(true);
      gogoro(false);
      break;
    case "All":
      tomtom(true);
      gogoro(true);
      break;
  }
};
</script>
<template>
  <LayoutAuthenticated>
    <div class="relative m-6">
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
      <BaseButton
        class="absolute left-5 top-5 border-2 border-gray-200 dark:border-gray-500"
        label="View nearby charging stations"
        @click="openEVstation(true)"
      ></BaseButton>
      <div class="absolute left-5 top-[11%]">
        <BaseButton
          class="border-2 border-gray-200 dark:border-gray-500"
          label="Battery swap station"
          @click="selectButton($event, $event.currentTarget.textContent)"
        ></BaseButton>
        <BaseButton
          class="border-2 border-gray-200 dark:border-gray-500"
          label="charging station"
          @click="selectButton($event, $event.currentTarget.textContent)"
        ></BaseButton>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped>
.show {
  background-color: skyblue;
}
</style>
