<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import { ref, onMounted, computed } from "vue";
import tt, { map } from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css"; //必須加入
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import {
  apiHistoryChangeCustomerSecret,
  apiHistoryListCurrentOptions,
  apiHistoryRegenerateAdminKey,
  apiHistoryRegisterAdminKey,
  apiHistorySetNewSettingsValues,
  apiHistoryAddNewObject,
  apiHistoryDeleteObject,
  apiHistoryEditObject,
  apiHistoryGetObjectDetails,
  apiHistoryListObjects,
  apiHistorySendPosition,
  apiHistoryLastPosition,
  apiHistoryGetObjectsPositionHistory,
  apiHistoryClearObjectsPositionHistory,
  apiArchiveHistoricalPositions,
  apiHistoryArchiveStructure,
  apiHistoryDownloadPreparedData,
} from "@/api/apiTomtom";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);

const center = { lat: 25.034228, lng: 121.563995 };
let newdate = new Date();

console.log(newdate.toJSON());
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
const HistoryChangeCustomerSecret = () => {
  apiHistoryChangeCustomerSecret({
    secret: "FirstName1",
    newSecret: "SecondName1",
  }).then((res) => {
    console.log(res);
  });
};
const HistoryListCurrentOptions = () => {
  apiHistoryListCurrentOptions(
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj"
  ).then((res) => {
    console.log(res);
  });
};

const HistoryRegenerateAdminKey = () => {
  apiHistoryRegenerateAdminKey({
    secret: "FirstName1",
  }).then((res) => {
    console.log(res);
  });
};
const HistoryRegisterAdminKey = () => {
  apiHistoryRegisterAdminKey({
    secret: "FirstName1",
  }).then((res) => {
    console.log(res);
  });
};
const HistorySetNewSettingsValues = () => {
  apiHistorySetNewSettingsValues(
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj",
    {
      consentForStoringObjectsPositionsHistory: true,
    }
  ).then((res) => {
    console.log(res);
  });
};

//==================================================
//對象服務Objects service
const ListObjectsData = ref([]);

const HistoryAddNewObject = () => {
  apiHistoryAddNewObject("1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj", {
    name: `object_name ${Math.floor(Math.random() * 10000)}`,
    properties: {
      key: Math.floor(Math.random() * 10000),
    },
  });
};
const HistoryDeleteObject = () => {};
const HistoryEditObject = () => {};
const HistoryGetObjectDetails = () => {};
const HistoryListObjects = () => {
  apiHistoryListObjects().then((res) => {
    ListObjectsData.value = res.data.objects;
    console.log(ListObjectsData.value[0]);
  });
};
//==================================================
//位置歷史服務Position History service
const lng = ref(121.563995);
const lat = ref(25.034228);

const HistorySendPosition = () => {
  lng.value = lng.value + 0.001;
  lat.value = lat.value + 0.001;

  console.log(lng.value);
  console.log(lat.value);

  apiHistorySendPosition({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lng.value, lat.value, 0],
    },
    object: ListObjectsData.value[0].id,
  }).then((res) => {
    console.log(res);
  });
};
const HistoryLastPosition = () => {
  apiHistoryLastPosition(ListObjectsData.value[0].id).then((res) => {
    console.log(res.data);
  });
};
const HistoryGetObjectsPositionHistory = () => {
  apiHistoryGetObjectsPositionHistory(
    ListObjectsData.value[0].id,
    "2023-06-26T23:01:22"
  ).then((res) => {
    console.log(res.data);
  });
};
const HistoryClearObjectsPositionHistory = () => {
  apiHistoryClearObjectsPositionHistory(
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj"
  ).then((res) => {
    console.log(res.data);
  });
};
//==================================================
//存檔服務Archive service
const ArchiveHistoricalPositions = () => {
  apiArchiveHistoricalPositions(
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj"
  ).then((res) => {
    console.log(res.data);
  });
};
const token = ref("");
const HistoryArchiveStructure = () => {
  apiHistoryArchiveStructure(
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj"
  ).then((res) => {
    token.value = res.data.token;
    console.log(token.value);
  });
};
const HistoryDownloadPreparedData = () => {
  apiHistoryDownloadPreparedData(
    token.value,
    "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj"
  ).then((res) => {
    console.log(res.data);
  });
};
</script>
<template>
  <LayoutAuthenticated>
    <div class="m-2">
      <div class="h-[70vh] w-auto lg:h-[40vh] lg:w-[100%]" ref="mapRef"></div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="更改使用者密鑰名稱" />
          <BaseButton label="結果" @click="HistoryChangeCustomerSecret()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="清單密鑰" />
          <BaseButton label="結果" @click="HistoryListCurrentOptions()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="重新註冊密鑰" />
          <BaseButton label="結果" @click="HistoryRegenerateAdminKey()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="註冊密鑰" />
          <input />
          <BaseButton label="結果" @click="HistoryRegisterAdminKey()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="設置新的設置值" />
          <BaseButton label="結果" @click="HistorySetNewSettingsValues()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="清單對象" />
          <BaseButton label="結果" @click="HistoryListObjects()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="發送位置" />
          <BaseButton label="結果" @click="HistorySendPosition()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="最後位置" />
          <BaseButton label="結果" @click="HistoryLastPosition()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="獲取對象位置歷史" />
          <BaseButton
            label="結果"
            @click="HistoryGetObjectsPositionHistory()"
          />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除位置歷史" />
          <BaseButton
            label="結果"
            @click="HistoryClearObjectsPositionHistory()"
          />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="存檔歷史位置" />
          <BaseButton label="結果" @click="ArchiveHistoricalPositions()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="存檔結構" />
          <BaseButton label="結果" @click="HistoryArchiveStructure()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="下載" />
          <BaseButton label="結果" @click="HistoryDownloadPreparedData()" />
        </CardBox>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped></style>
