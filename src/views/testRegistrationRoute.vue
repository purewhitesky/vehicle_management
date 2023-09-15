<script setup>
import { ref } from "vue";
import {
  apiAddnewproject,
  apiAddnewfencetoaproject,
  apiAddnewobject,
  apiNotificationsListContactGroups,
  apiCreatealertrule,
} from "@/api/apiTomtom";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

const ADMINKEY = "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes";

const registerAlert = (projectName, objectName) => {
  let projectData = { name: projectName };
  let projectId = "";
  apiAddnewproject(ADMINKEY, projectData).then((res) => {
    console.log(res.data);
    projectId = res.data.id;
  });

  let fenceData = {
    name: "fence_name",
    type: "Feature",
    geometry: {
      radius: "radius",
      type: "Point",
      shapeType: "shape_type",
      coordinates: "locations",
    },
  };
  let fenceId = "";
  apiAddnewfencetoaproject(projectId, ADMINKEY, fenceData).then((res) => {
    console.log(res.data);
    fenceId = res.data.id;
  });

  let objectData = {
    name: objectName,
    defaultProject: projectId,
  };
  let objectId = "";
  apiAddnewobject(ADMINKEY, objectData).then((res) => {
    console.log(res.data);
    objectId = res.data.id;
  });

  let contactId = "";
  apiNotificationsListContactGroups().then((res) => {
    contactId = res.data.groups[0].id;
  });

  let alertData = {
    name: `${projectName} deviate from preset itinerary`,
    project: projectId,
    fence: "*",
    object: objectId,
    alertType: "TRANSITION",
    alertRuleConstraints: {
      transitionType: "ALL",
    },
    notificationGroup: contactId,
    enabled: true,
  };
  apiCreatealertrule(ADMINKEY, alertData).then((res) => {
    console.log(res.data);
  });
};
</script>
<template>
  <LayoutAuthenticated></LayoutAuthenticated>
</template>
