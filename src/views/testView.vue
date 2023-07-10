<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css"; //必須加入
import axios from "axios";
import * as turf from "@turf/turf";
import { ref, onMounted } from "vue";
import {
  apiRegisterAdminKey,
  apiRegenerateAdminKey,
  apiListcurrentoptions,
  apiSetnewsettingsvalues,
  apiListprojects,
  apiListthefencesforagivenproject,
  apiAddnewobject,
  apiGetobjectdetails,
  apiGetprojectdetails,
  apiGetfencedetails,
  apiGetobjectscountinthefence,
  apiAddnewfencetoaproject,
  apiSynchronousMatrix,
  apiListobjects,
  apiEditobject,
  apiDeleteobject,
  apiDeletefence,
  apigetReport,
  apipostReport,
  apiGetfencestransitions,
  apiGetobjectstransitions,
  apiGetprojectstransitions,
  apiDeletetransitionshistory,
  apiNotificationsListCurrentOptions,
  apiNotificationsCreateContactGroup,
  apiNotificationsListContactGroups,
  apiNotificationsGetContactGroupDetails,
  apiNotificationsEditContactGroup,
  apiNotificationsEditContactGroupPartially,
  apiNotificationsDeleteContactGroup,
  apiNotificationsListNotificationsHistory,
  apiNotificationsClearNotificationsHistory,
  apiNotifications,
  apiGeofencing,
  apiHistorySendPosition,
} from "@/api/apiTomtom";

const postData = () => {
  axios
    .post("https://mih-fleet.westus2.cloudapp.azure.com/api/geofence", {
      DataNum: "123",
    })
    .then((res) => {
      console.log("save success Data");
      console.log(res);
    });
};

const gData = () => {
  axios
    .get("https://mih-fleet.westus2.cloudapp.azure.com/api/geofence")
    .then((res) => {
      console.log("save success Data");
      console.log(res);
    });
};

const allTomTomData = ref(["no data"]);

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

let startTime =
  aData.getFullYear() + "-" + Month + "-" + aData.getDate() + "T00:00:00";

let endTime =
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
/*T00:10:22 */

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);

const center = { lat: 25.034228, lng: 121.563995 };
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
  window.map = map;

  //new tt.Marker({ element: element }).setLngLat(center).addTo(window.map);
});
//==============================================
//地理圍欄
const center1 = { lat: 25.037228, lng: 121.566995 };

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
    "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes"
  ).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};

const Addnewfencetoaproject = (data) => {
  apiAddnewfencetoaproject(
    `ba848e64-c5d1-4190-9d41-2762966ac6f5`,
    `lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes`,
    {
      name: "first",
      type: "Feature",
      geometry: {
        radius: 1000,
        type: "LineString",
        shapeType: "Corridor",
        coordinates: data[0].geometry.coordinates,
      },
      properties: {
        //Optional
        type: "Feature",
      },
    }
  ).then((res) => {
    console.log(res.data.geometry);
  });
};
//=================================================================
//查看項目
const ListProjectsData = ref([]);
const Listprojects = () => {
  apiListprojects().then((res) => {
    console.log(res.data.projects[0].id);
    ListProjectsData.value = res.data.projects[0].id;
    allTomTomData.value = res.data;
  });
};
//=================================================================
//查看圍欄

const ListfencesData = ref([]);
const Listthefencesforagivenproject = () => {
  apiListthefencesforagivenproject(ListProjectsData.value).then((res) => {
    ListfencesData.value = res.data.fences;
    allTomTomData.value = res.data;
    console.log(ListfencesData.value);
  });
};
//查看圍欄詳細
const Getfencedetails = () => {
  apiGetfencedetails(ListfencesData.value[8].id).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
    let _center = turf.point(res.data.geometry.coordinates);
    let _radius = res.data.geometry.radius / 1000;
    let _options = {
      steps: 40,
      units: "kilometers", // or "mile"
    };
    let _circle = turf.circle(_center, _radius, _options);
    console.log(_circle);
    window.map.addSource(`circleData`, {
      type: "geojson",
      data: _circle,
    });

    window.map.addLayer({
      id: `circle-fill`,
      type: "fill",

      source: "circleData",
      paint: {
        "fill-color": "red",
        "fill-opacity": 0.5,
      },
    });
  });
};
//查看圍欄對象
/*const Getobjectscountinthefence = () => {
  apiGetobjectscountinthefence(ListfencesData.value[0].id).then((res) => {
    console.log(res);
  });
};*/
//刪除圍欄
const Deletefence = () => {
  apiDeletefence(
    ListfencesData.value[0].id,
    "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes"
  );
  console.log("ok");
};
//=================================================================
//查看對象
const ListObjectsData = ref([]);
const Listobjects = () => {
  apiListobjects().then((res) => {
    allTomTomData.value = res.data;
    ListObjectsData.value = res.data.objects;
    console.log(ListObjectsData.value);
  });
};
//新增對象
const Addnewobject = () => {
  apiAddnewobject("lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes", {
    name: `objects${Math.floor(Math.random() * 10000)}`,
    defaultProject: ListProjectsData.value,
    properties: {},
  }).then((res) => {
    console.log(res);
    console.log("OK");
  });
};
//查看對象詳細
const ObjectsData = ref([]);
const Getobjectdetails = () => {
  apiGetobjectdetails(ListObjectsData.value[0].id).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
    ObjectsData.value = res.data.properties.coordinates;
    console.log("OK");
    new tt.Marker()
      .setLngLat(res.data.properties.coordinates)
      .addTo(window.map);
  });
};
//編輯對象
const Editobject = () => {
  apiEditobject(
    ListObjectsData.value[0].id,
    "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes",
    {
      defaultProject: ListProjectsData.value,
      properties: {
        coordinates: ["121.583995", "25.074228"],
      },
    }
  ).then((res) => {
    console.log(res);
    console.log("OK");
  });
};
//刪除對象
const Deleteobject = () => {
  apiDeleteobject(
    ListObjectsData.value[0].id,
    "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes"
  ).then((res) => {
    console.log(res);
    console.log("is Delete");
  });
};
//=================================================================
//報告
const center2 = { lat: 25.034228, lng: 121.563995 };
const GPSgo = [
  { lat: 25.034228, lng: 121.563995 },
  { lat: 25.037296, lng: 121.56496 },
  { lat: 25.0433535, lng: 121.566899 },
  { lat: 25.048139, lng: 121.567792 },
];
const getReport = (num) => {
  apipostReport(
    ListProjectsData.value,
    GPSgo[num].lng,
    GPSgo[num].lat,
    0,
    ListObjectsData.value[0].id,
    0,
    timeData
  ).then((res) => {
    allTomTomData.value = res.data;
    console.log(res.data);
  });
  HistorySendPosition(GPSgo[num].lng, GPSgo[num].lat);
  new tt.Marker().setLngLat(GPSgo[num]).addTo(window.map);
};
const HistorySendPosition = (lng, lat) => {
  apiHistorySendPosition({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [lng, lat, 0],
    },
    object: ListObjectsData.value[0].id,
  }).then((res) => {
    console.log(res);
  });
};
//=================================================================
//過渡
const Getfencestransitions = () => {
  apiGetfencestransitions(ListfencesData.value[0].id, startTime, endTime).then(
    (res) => {
      allTomTomData.value = res.data;
      console.log(res);
    }
  );
};

const Getobjectstransitions = () => {
  apiGetobjectstransitions(
    ListObjectsData.value[0].id,
    startTime,
    endTime,
    ListProjectsData.value
  ).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};
const Getprojectstransitions = () => {};
const Deletetransitionshistory = () => {};
//=================================================================
const NotificationsListCurrentOptions = () => {
  apiNotifications.ListCurrentOptions().then((res) => {
    console.log(res);
  });
};
const NotificationsCreateContactGroup = () => {
  apiNotifications
    .CreateContactGroup({
      name: "AlertWebhooks",
      webhookUrls: [],
      emails: ["cjifug@gmail.com", "cjifug@yahoo.com.tw"],
    })
    .then((res) => {
      console.log(res);
    });
};
const ListContactGroupsData = ref([]);
const NotificationsListContactGroups = () => {
  apiNotifications.ListContactGroups().then((res) => {
    allTomTomData.value = res.data;
    ListContactGroupsData.value = res.data.groups;
    console.log(ListContactGroupsData.value);
  });
};
const NotificationsGetContactGroupDetails = () => {
  apiNotifications
    .GetContactGroupDetails(ListContactGroupsData.value[0].id)
    .then((res) => {
      allTomTomData.value = res.data;
      console.log(res);
    });
};
const NotificationsEditContactGroup = () => {
  apiNotifications
    .EditContactGroup(ListContactGroupsData.value[0].id, {
      name: "cjifug",
      webhookUrls: [
        "https://mih-fleet.westus2.cloudapp.azure.com/api/geofence",
      ],
      emails: [],
    })
    .then((res) => {
      console.log(res);
    });
};
const NotificationsEditContactGroupPartially = () => {
  apiNotifications
    .EditContactGroupPartially(ListContactGroupsData.value[0].id, {
      emails: ["ccc2@gmail.com"],
    })
    .then((res) => {
      console.log(res);
    });
};
const NotificationsDeleteContactGroup = () => {
  apiNotifications
    .DeleteContactGroup(ListContactGroupsData.value[0].id)
    .then((res) => {
      console.log(res);
    });
};
const NotificationsListNotificationsHistory = () => {
  apiNotifications.ListNotificationsHistory(startTime, endTime).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};
const NotificationsClearNotificationsHistory = () => {
  apiNotifications.ClearNotificationsHistory().then((res) => {
    console.log(res);
  });
};
//=================================================================
//警報
const apiGeofencingCreateAlertRule = () => {
  apiGeofencing
    .CreateAlertRule("lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes", {
      name: "goOrLeavel",
      project: ListProjectsData.value,
      fence: ListfencesData.value[8].id,
      object: ListObjectsData.value[0].id,
      alertType: "TRANSITION",
      alertRuleConstraints: {
        transitionType: "ALL",
      },
      notificationGroup: ListContactGroupsData.value[0].id,
      enabled: true,
    })
    .then((res) => {
      console.log(res);
    });
};
const apiGeofencingGetAlertRule = () => {
  apiGeofencing.GetAlertRule(ListAlertRulesData.value[0].id).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};
const ListAlertRulesData = ref({});
const apiGeofencingListAlertRules = () => {
  apiGeofencing.ListAlertRules().then((res) => {
    allTomTomData.value = res.data;
    ListAlertRulesData.value = res.data.alertRules;
    console.log(ListAlertRulesData.value);
  });
};
const apiGeofencingUpdateAlertRulePartially = () => {
  apiGeofencing
    .UpdateAlertRulePartially(
      ListAlertRulesData.value[0].id,
      "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes",
      {
        enabled: false,
      }
    )
    .then((res) => {
      console.log(res);
    });
};
const apiGeofencingDeleteAlertRule = () => {
  apiGeofencing
    .DeleteAlertRule(
      ListAlertRulesData.value[0].id,
      "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes"
    )
    .then((res) => {
      console.log(res);
    });
};
const apiGeofencingListAlertHistory = () => {
  apiGeofencing.ListAlertHistory(startTime, endTime).then((res) => {
    allTomTomData.value = res.data;
    console.log(res);
  });
};
const apiGeofencingDeleteAlertHistory = () => {
  apiGeofencing.DeleteAlertHistory();
};
//=================================================================
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
        window.map.addLayer({
          id: "route" + index,
          type: "line",
          source: {
            type: "geojson",
            data: features,
          },
        });
      });
      Addnewfencetoaproject(roadline);
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
  });
};
</script>
<template>
  <LayoutAuthenticated>
    <div class="m-2">
      <div class="h-[70vh] w-auto lg:h-[40vh] lg:w-[100%]" ref="mapRef"></div>
      <div class="mt-2 grid">
        <CardBox>
          <CardBoxComponentTitle title="響應資料顯示" />
          <div v-for="(i, item) in allTomTomData">{{ item }}：{{ i }}</div>
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
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

        <CardBox>
          <CardBoxComponentTitle title="路由" />
          <BaseButton label="結果" @click="route()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="查看圍欄" />
          <BaseButton label="結果" @click="Listthefencesforagivenproject()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看圍欄詳細" />
          <BaseButton label="結果" @click="Getfencedetails()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="添加圍欄" />
          <BaseButton label="結果" @click="Addnewfencetoaproject()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除圍欄" />
          <BaseButton label="結果" @click="Deletefence()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="查看對象" />
          <BaseButton label="結果" @click="Listobjects()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="添加對象" />
          <BaseButton label="結果" @click="Addnewobject()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看對象詳細" />
          <BaseButton label="結果" @click="Getobjectdetails()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="編輯對象詳細" />
          <BaseButton label="結果" @click="Editobject()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除對象詳細" />
          <BaseButton label="結果" @click="Deleteobject()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="報告1" />
          <BaseButton label="結果" @click="getReport(0)" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="報告2" />
          <BaseButton label="結果" @click="getReport(1)" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="報告3" />
          <BaseButton label="結果" @click="getReport(2)" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="報告4" />
          <BaseButton label="結果" @click="getReport(3)" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="過渡" />
          <BaseButton label="結果" @click="Getfencestransitions()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="對象過渡" />
          <BaseButton label="結果" @click="Getobjectstransitions()" />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="列出當前選項" />
          <BaseButton label="結果" @click="NotificationsListCurrentOptions()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="新增聯絡人" />
          <BaseButton label="結果" @click="NotificationsCreateContactGroup()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看聯絡人" />
          <BaseButton label="結果" @click="NotificationsListContactGroups()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看該聯絡人詳細資訊" />
          <BaseButton
            label="結果"
            @click="NotificationsGetContactGroupDetails()"
          />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="編輯該聯絡人詳細資訊" />
          <BaseButton label="結果" @click="NotificationsEditContactGroup()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="編輯增加該聯絡人詳細資訊" />
          <BaseButton
            label="結果"
            @click="NotificationsEditContactGroupPartially()"
          />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除該聯絡人詳細資訊" />
          <BaseButton label="結果" @click="NotificationsDeleteContactGroup()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="查看通知歷史" />
          <BaseButton
            label="結果"
            @click="NotificationsListNotificationsHistory()"
          />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除通知歷史" />
          <BaseButton
            label="結果"
            @click="NotificationsClearNotificationsHistory()"
          />
        </CardBox>
      </div>
      <div class="mt-2 grid grid-cols-5 gap-2">
        <CardBox>
          <CardBoxComponentTitle title="創建警報" />
          <BaseButton label="結果" @click="apiGeofencingCreateAlertRule()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="列出警報規則" />
          <BaseButton label="結果" @click="apiGeofencingListAlertRules()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="獲取該警報規則" />
          <BaseButton label="結果" @click="apiGeofencingGetAlertRule()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="部分更新該警報規則" />
          <BaseButton
            label="結果"
            @click="apiGeofencingUpdateAlertRulePartially()"
          />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除該警報規則" />
          <BaseButton label="結果" @click="apiGeofencingDeleteAlertRule()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="歷史警報紀錄" />
          <BaseButton label="結果" @click="apiGeofencingListAlertHistory()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="刪除歷史警報紀錄" />
          <BaseButton label="結果" @click="apiGeofencingDeleteAlertHistory()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="put" />
          <BaseButton label="結果" @click="postData()" />
        </CardBox>
        <CardBox>
          <CardBoxComponentTitle title="get" />
          <BaseButton label="結果" @click="gData()" />
        </CardBox>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<style scoped></style>
