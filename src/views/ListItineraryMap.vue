<script setup>
import CardBox from "@/components/CardBox.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import TomTomStyle from "@/style/tomtomstyle.json";
import {
  getItinerary,
  postItinerary,
  putItinerary,
  getUserAPI,
  deleteItinerary,
} from "@/api/obd_alwayshow";
import {
  mdiPlusBox,
  mdiListBox,
  mdiClipboardEditOutline,
  mdiTrashCanOutline,
  mdiCheck,
  mdiArrowUp,
  mdiClose,
} from "@mdi/js";
import {
  useSetTomTomData,
  useDeleteTomTomData,
} from "@/components/useTomTomAPI";
import { usePermissionsList } from "@/components/PermissionsList";
import { ref, onMounted } from "vue";

import * as turf from "@turf/turf";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const modalOneActive = ref(false);
const setItineraryName = ref();

const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };

onMounted(() => {
  getData();
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 10,
    center: center,
    style: TomTomStyle,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  window.map = map;
});

//======================================================
//抓取車牌資料
const { PermissionsCarlist } = usePermissionsList();
//=============================================================================
//設定範圍
const range = ref(500);
//=============================================================================

const list = ref([]); //顯示用
const editList = ref({}); //編輯開關
const itineraryPlaceData = ref([]); //單路線
const itineraryList = ref([]); //多路線
//GET
const openItinerary = ref(false);

const getData = () => {
  if (openItinerary.value) {
    removeRoutes(saveRouteName.value);
    console.log(saveRouteName.value);
    console.log("use");
  }
  getItinerary().then((res) => {
    list.value = res.data;
    list.value
      .sort((a, b) => {
        //20230914
        const dateA = new Date(a.date),
          dateB = new Date(b.date);

        return dateB.getTime() - dateA.getTime();
      })
      .forEach((features, dataIndex) => {
        polygon(features, dataIndex, features.fenceRadius);
      });
    /*
    list.value.forEach((valueData, index) => {
      console.log("route:" + index);
      list.value[index].date = changeTime(list.value[index].date);

      editList.value[valueData.itineraryName] = false;
      valueData.itinerary.forEach((value1, index1) => {
        itineraryPlaceData.value[index1] = value1.position; //單條路線儲存
      });
      let randomNumber = Math.floor(Math.random() * 900000) + 100000;
      route(itineraryPlaceData.value, index, `#${randomNumber}`);

      itineraryList.value[index] = itineraryPlaceData.value; //多條路線整合
      itineraryPlaceData.value = [];
    });
    console.log(itineraryList.value);
    //route(itineraryList.value[0]);*/
  });
  openItinerary.value = true;
};

//POST
const postData = async (data) => {
  await postItinerary(data).then((res) => {
    console.log(res);
  });
  getData();
};

//PUT
const putData = async (itineraryName, data) => {
  await putItinerary(itineraryName, data).then((res) => {
    console.log(res);
  });
  getData();
};
//DELETE
const deleteData = async (itineraryName, listIndex) => {
  const acceptData = ref([]);
  console.log(list.value);
  acceptData.value = list.value[listIndex];
  console.log(acceptData.value);

  useDeleteTomTomData(itineraryName, acceptData.value.VINID);

  await deleteItinerary(itineraryName).then((res) => {
    console.log(res);
  });
  getData();
};
const cancelCarNumber = (itemSearch, itineraryName) => {
  const index = searchCarID.value[itineraryName].indexOf(itemSearch);
  searchCarID.value[itineraryName].splice(index, 1);
  console.log(index);
};

const ADMINKEY = "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes";

//=============================================================================
//編輯
const searchCarID = ref([]); //車牌
const searchDate = ref({}); //時間
const searchItineraryName = ref({}); //行程

const editData = ref({}); //存檔
const editNum = ref(0); //紀錄修改欄位數量

//當欄位超過1個修改時才觸發送出修改
const editOpen = (itineraryName, isOk, listIndex) => {
  editList.value[itineraryName] = !editList.value[itineraryName];
  if (!isOk) {
    searchCarID.value[itineraryName] = list.value[listIndex].VINID;
  }

  if (isOk) {
    if (searchCarID.value[itineraryName] != undefined) {
      //針對車牌修改
      editData.value["VINID"] = searchCarID.value[itineraryName];
      console.log(editData.value);
      editNum.value++;
    }
    if (searchDate.value[itineraryName] != undefined) {
      //針對時間修改
      editData.value["date"] = searchDate.value[itineraryName];
      editNum.value++;
    }
    /*if (searchItineraryName.value[itineraryName] != undefined) {
      //針對行程修改
      editData.value["itineraryName"] =
        searchItineraryName.value[itineraryName];
      editNum.value++;
    }*/
    if (editNum.value > 0) {
      putData(itineraryName, editData.value);
      console.log(editData.value);
      console.log(list.value[listIndex]); //此路線的所有資料
    }
  }
};
const carNumberList = ref([]);
const oncePushCarNumber = ref(true);
const pushCarNumber = (carNumber, itineraryName) => {
  if (oncePushCarNumber.value) {
    carNumberList.value.push(...searchCarID.value[itineraryName]);
    oncePushCarNumber.value = false;
  }
  if (searchCarID.value[itineraryName].indexOf(carNumber) == -1) {
    carNumberList.value.push(carNumber);
    searchCarID.value[itineraryName] = carNumberList.value;
  } else {
    console.log(`${carNumber} is already use`);
  }
};

//=============================================================================
//註冊
const registerOpen = (itineraryName, listIndex) => {
  console.log(itineraryName);
  console.log(itineraryName + "_fence");

  const acceptData = ref([]);
  console.log(list.value);
  acceptData.value = list.value[listIndex];
  console.log(acceptData.value);

  useSetTomTomData(
    itineraryName,
    acceptData.value.itineraryData[0].geometry.coordinates,
    acceptData.value.VINID,
    500
  );
};
//=============================================================================
//自定義格式yyyy-mm-dd
const changeTime = (time) => {
  let aData = new Date(time);
  let Month =
    aData.getMonth() < 9 ? "0" + (aData.getMonth() + 1) : aData.getMonth() + 1;

  let timeData =
    aData.getFullYear() + "-" + Month + "-" + aData.getDate() + " ";
  return timeData;
};

//=============================================================================
//路徑畫線
//const routeName = ref();
//const retryTimes = 10;

/*const route = (data, dataIndex, routeColor, counter = 0) => {
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
        console.log("route內:" + index);
        saveRouteName.value.push("route" + dataIndex);
        window.map.addLayer({
          id: "route" + dataIndex,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
          paint: {
            "line-color": routeColor,
            "line-width": 4,
            "line-opacity": 0.5,
          },
        });
      });
      console.log(saveRouteName.value);
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
            resolve(route(data, dataIndex, routeColor));
          }, 1000);
        });
      }
    });
};*/

//=============================================================================
//存檔名稱
const saveRouteName = ref([]);
//設定取樣
const setSamplingPoint = ref(20);
//=============================================================================
const seeItinerary = ref([]);
const seeItineraryData = ref([]);
const seeItineraryLengthLabel = ref();

const polygon = (features, dataIndex, radius) => {
  seeItinerary.value = [];
  seeItineraryLengthLabel.value = "";
  seeItineraryData.value = features.itineraryData[0].geometry.coordinates;
  seeItineraryLengthLabel.value = seeItineraryData.value.length;

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

  //存儲刪除變數檔
  saveRouteName.value.push([dataIndex + "_line", dataIndex + "_fill"]);
  //設定檔
  const turfOptions = {
    units: "meters",
  };
  //資料檔

  const geometry = {
    type: "LineString",
    shapeType: "Corridor",
    radius: radius,
    coordinates: seeItinerary.value,
  };
  //轉換點成範圍點
  const geoJsonData = turf.buffer(geometry, geometry.radius, turfOptions);

  //亂數顯示路線顏色
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;

  //路線生成

  window.map.addLayer({
    id: dataIndex + "_line",
    type: "line",
    source: {
      type: "geojson",
      data: features.itineraryData[0], //geojson的資料
    },
    paint: {
      "line-color": `#${randomNumber}`,
      "line-width": 1,
      "line-opacity": 1,
    },
  });
  //圍欄生成
  window.map.addLayer({
    id: dataIndex + "_fill",
    type: "fill",
    source: {
      type: "geojson",
      data: geoJsonData, //geojson的資料
    },
    layout: {},
    paint: {
      "fill-color": `#${randomNumber}`,
      "fill-opacity": 0.2,
    },
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

//=============================================================================
//TOMTOMAPI圍欄註冊
</script>
<template>
  <LayoutAuthenticated>
    <SectionTitleLineWithButton
      class="mx-6"
      :icon="mdiListBox"
      title="Itinerary Overview"
      main
    >
    </SectionTitleLineWithButton>
    <div class="grid grid-cols-2">
      <div class="max-h-[80vh] overflow-y-scroll">
        <CardBoxModal
          v-model="modalOneActive"
          title="Please enter a itinerary name"
          button-label="Confirm"
          has-cancel
          :buttonTo="`/RouteItinerary/` + setItineraryName"
        >
          <input
            type="text"
            class="w-[50%] rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            v-model="setItineraryName"
          />
        </CardBoxModal>

        <div class="p-2">
          <div
            class="my-2 mx-6 flex min-h-[100px] flex-row-reverse items-center gap-2 px-2 py-4"
          >
            <BaseButton
              color="#333333"
              :icon="mdiPlusBox"
              iconSize="30"
              @click="modalOneActive = true"
              class="hover:border-green-500 hover:text-green-500"
            ></BaseButton>
          </div>
          <div v-for="(item, listIndex) in list" :key="listIndex">
            <CardBox
              hasComponentLayout
              class="grid grid-cols-2 grid-rows-1 gap-2 border-2 border-gray-200 p-4 dark:border-gray-500"
            >
              <div class="grid content-center gap-4 border-r-2">
                <template v-if="editList[item.itineraryName]">
                  <!--<div class="flex flex-col items-center">
                    <div>route Name :</div>
                    <input
                      type="text"
                      class="flex-1 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      v-model="searchItineraryName[item.itineraryName]"
                      :placeholder="item.itineraryName"
                    />
                  </div>-->
                  <div class="group relative flex flex-col items-center">
                    <div>Car Number:</div>
                    <!--<input
                      type="text"
                      class="rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      v-model="searchCarID[item.itineraryName]"
                      :placeholder="item.VINID"
                    />{{ searchCarID[item.itineraryName] }}-->

                    <div
                      v-for="itemSearch in searchCarID[item.itineraryName]"
                      class="flex"
                    >
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
                            @click="
                              cancelCarNumber(itemSearch, item.itineraryName)
                            "
                          />
                        </div>
                      </div>
                    </div>

                    <div class="group relative">
                      <div class="flex items-center">
                        <div>--------車輛清單--------</div>
                        <BaseIcon
                          :path="mdiArrowUp"
                          class="group-hover:rotate-180"
                        />
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
                            @click="
                              pushCarNumber(
                                carNumber.VIN_ID,
                                item.itineraryName
                              )
                            "
                          >
                            {{ carNumber.VIN_ID }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  Route Name
                </template>
                <div>Route Name : {{ item.itineraryName }}</div>
                <template v-if="!editList[item.itineraryName]">
                  <div>Car Number: {{ item.VINID }}</div>
                </template>
                <div>Create Date : {{ item.date }}</div>
              </div>
              <div class="flex flex-col">
                <div class="flex">Route :</div>
                <div
                  v-for="(value, index) in item.itinerary"
                  class="flex flex-col"
                >
                  ▼{{ value.name }}
                </div>
              </div>
            </CardBox>
            <div class="mb-2 mr-3 flex flex-row-reverse items-center gap-2">
              <template v-if="!editList[item.itineraryName]">
                <!--註冊-->
                <BaseButton
                  color="#333333"
                  :icon="mdiCheck"
                  iconSize="30"
                  @click="registerOpen(item.itineraryName, listIndex)"
                  class="hover:border-green-500 hover:text-green-500"
                ></BaseButton>
              </template>
              <template v-if="!editList[item.itineraryName]">
                <!--刪除-->
                <BaseButton
                  color="#333333"
                  :icon="mdiTrashCanOutline"
                  iconSize="30"
                  @click="deleteData(item.itineraryName, listIndex)"
                  class="hover:border-green-500 hover:text-green-500"
                ></BaseButton>
                <!--修改-->
                <BaseButton
                  color="#333333"
                  :icon="mdiClipboardEditOutline"
                  iconSize="30"
                  @click="editOpen(item.itineraryName, false, listIndex)"
                  class="hover:border-green-500 hover:text-green-500"
                ></BaseButton>
              </template>
              <template v-if="editList[item.itineraryName]">
                <!--確認-->
                <BaseButton
                  color="#333333"
                  :icon="mdiCheck"
                  iconSize="30"
                  @click="editOpen(item.itineraryName, true, listIndex)"
                  class="hover:border-green-500 hover:text-green-500"
                ></BaseButton>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
          id="map"
          ref="mapRef"
        ></div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
