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
  apiListobjects,
  apiAddnewobject,
  apiAddnewfencetoaproject,
  apiListthefencesforagivenproject,
  apiAddnewproject,
  apiListprojects,
  apiNotifications,
  apiGeofencing,
  apiDeleteprojects,
  apiDeletefence,
  apiDeleteobject,
} from "@/api/apiTomtom";
import {
  getItinerary,
  postItinerary,
  putItinerary,
  deleteItinerary,
  getUserAPI,
} from "@/api/obd_alwayshow";
import {
  mdiPlusBox,
  mdiListBox,
  mdiClipboardEditOutline,
  mdiTrashCanOutline,
  mdiCheck,
  mdiArrowUp,
} from "@mdi/js";
import { ref, onMounted, provide, inject } from "vue";

import * as turf from "@turf/turf";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const ADMINKEY = "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes";

const TomTom = ref([]);
const projectID = ref("");
const fenceID = ref("");
const objectIDList = ref([]);
const notificationID = ref("");
const alertRuleList = ref([]);

const list = ref([]);

getItinerary().then((res) => {
  list.value = res.data;
  list.value.forEach((item) => {
    console.log("start");
    TomTomData(item.itineraryName, item.VINID);
  });
});

const TomTomData = (itineraryName, objectNameArray) => {
  //======================================================
  const Listprojects = async () => {
    await apiListprojects().then((res) => {
      projectID.value = res.data.projects;
      console.log(projectID.value);
    });
  };
  //======================================================
  const Listthefencesforagivenproject = async (pID) => {
    await apiListthefencesforagivenproject(pID).then((res) => {
      const fenceCompare = res.data.fences.find(
        (item) => item.name === `${itineraryName}_fence` //尋找元素內的資料
      );
      if (fenceCompare != undefined) {
        console.log("fence Delet Find");
        fenceID.value = fenceCompare.id;
      } else {
        console.log("fence not Find");
      }
    });
  };
  //======================================================
  const Listobjects = async (pID) => {
    //初始化
    objectIDList.value = [];
    //objectAPI資料格式
    await apiListobjects().then((res) => {
      const objectCompare = ref("");
      objectNameArray.forEach((objectName, index) => {
        objectCompare.value = res.data.objects.find(
          (item) => item.name === objectName //尋找元素內的資料
        );
        if (objectCompare.value != undefined) {
          console.log("objectData Delete Find");
          objectIDList.value.push(objectCompare.value.id);
        } else {
          console.log("objectData no Find");
        }
      });
    });
  };

  //======================================================
  const Notification = async () => {
    await apiNotifications.ListContactGroups().then((res) => {
      const notificationCompare = res.data.groups.find(
        (item) => item.name === `${itineraryName}_notification`
      );

      if (notificationCompare != undefined) {
        console.log("contactGroup Delete Find");
        notificationID.value = notificationCompare.id;
      } else {
        console.log("contactGroup no Find");
      }
    });
  };

  //======================================================
  const AlertRule = async (pID, fID, oIDList, nID) => {
    //初始化
    alertRuleList.value = [];

    await apiGeofencing.ListAlertRules(pID, fID).then((res) => {
      console.log(res.data);
      objectNameArray.forEach((objectName, index) => {
        console.log(objectName);
        const alertRuleCompare = res.data.alertRules.find(
          (item) => item.name === `${itineraryName}_${objectName}_Leavel`
        );
        console.log(alertRuleCompare);
        if (alertRuleCompare != undefined) {
          console.log("alertRule delete Find");
          alertRuleList.value.push(alertRuleCompare.id);
        } else {
          console.log("alertRule no Find");
        }
      });
    });
  };

  //======================================================
  const seeIDData = () => {
    console.log("pID" + projectID.value);
    console.log("fID" + fenceID.value);
    console.log("oID" + objectIDList.value);
    console.log("nID" + notificationID.value);
    console.log("arID" + alertRuleList.value);
  };

  const performTomTomSetup = async () => {
    await Listprojects();
    /*await Listthefencesforagivenproject(projectID.value);
    await Listobjects(projectID.value);
    await Notification();
    await AlertRule(
      projectID.value,
      fenceID.value,
      objectIDList.value,
      notificationID.value
    );
    seeIDData();*/
  };
  performTomTomSetup();
};
</script>
<template>
  <LayoutAuthenticated>
    <div v-for="(item, index) in list">
      {{ item.VINID }}{{ item.itineraryName }}
      <div>|</div>
    </div>
  </LayoutAuthenticated>
</template>
