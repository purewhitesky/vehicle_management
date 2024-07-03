import {
  apiListobjects,
  apiListthefencesforagivenproject,
  apiListprojects,
  apiAddnewobject,
  apiAddnewfencetoaproject,
  apiAddnewproject,
  apiDeleteprojects,
  apiDeletefence,
  apiDeleteobject,
  apiNotifications,
  apiGeofencing,
} from "@/api/apiTomtom";

import { ref } from "vue";

const ADMINKEY = "lgYpP5hZijPMkKH6ScSIYT3E4djtW9d15DyJ1y3WowXRBBes";

const projectID = ref("");
const saveProjectName = ref("");
const fenceID = ref("");
const saveFenceName = ref("");
const objectIDList = ref([]);
const saveObjectNameList = ref([]);
const notificationID = ref("");
const saveNotificationName = ref("");
const alertRuleID = ref("");
const saveRouteName = ref([]);

const initializationData = () => {
  projectID.value = "";
  saveProjectName.value = "";
  fenceID.value = "";
  saveFenceName.value = "";
  objectIDList.value = [];
  saveObjectNameList.value = [];
  notificationID.value = "";
  saveNotificationName.value = "";
  alertRuleID.value = "";
  saveRouteName.value = [];
};

export function catchCounter(err, func) {
  if (
    (err.response.status == 403 || err.response.status == 429) &&
    counter < retryTimes
  ) {
    counter++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(func);
      }, 1000);
    });
  }
}

export function useSetTomTom(
  itineraryName,
  fenceCoordinatesData,
  objectNameArray,
  radius
) {
  initializationData();

  const retryTimes = 1000;

  const Listprojects = async (counter = 0) => {
    await apiListprojects()
      .then((res) => {
        const projectCompare = res.data.projects.find(
          (item) => item.name === itineraryName //尋找元素內的資料
        );
        if (projectCompare != undefined) {
          projectID.value = projectCompare.id;
          console.log(`${itineraryName} is register`);
        } else {
          saveProjectName.value = itineraryName;
          console.log(`${itineraryName} save`);
        }
      })
      .catch((err) => {
        catchCounter(err, Listprojects(counter));
      });
  };
  const Listfences = async (pID, counter = 0) => {
    await apiListthefencesforagivenproject(pID)
      .then((res) => {
        console.log(res.data);
        const fenceCompare = res.data.fences.find(
          (item) => item.name === `${itineraryName}_fence` //尋找元素內的資料
        );
        if (fenceCompare != undefined) {
          fenceID.value = fenceCompare.id;
          console.log(`${itineraryName}_fence is register`);
        } else {
          saveFenceName.value = `${itineraryName}_fence`;
          console.log(`${itineraryName}_fence save`);
        }
      })
      .catch((err) => {
        catchCounter(err, Listfences(pID, counter));
      });
  };
  const ListObjects = async (iName, oNameArray, counter = 0) => {
    await apiListobjects()
      .then((res) => {
        console.log(res.data);
        oNameArray.forEach((oName) => {
          const objectCompare = res.data.objects.find(
            (item) => item.name === `${iName}_${oName}_object` //尋找元素內的資料
          );
          if (objectCompare != undefined) {
            objectIDList.value.push(objectCompare.id);
            console.log(`${iName}_${oName}_object is register`);
          } else {
            saveObjectNameList.value.push(`${iName}_${oName}_object`);
            console.log(`${iName}_${oName}_object save`);
          }
        });
      })
      .catch((err) => {
        catchCounter(err, ListObjects(iName, oNameArray, counter));
      });
  };
  //ListObjects(itineraryName, objectNameArray);
  const ListNotification = async (iName, counter = 0) => {
    await apiNotifications
      .ListContactGroups()
      .then((res) => {
        const notificationCompare = res.data.groups.find(
          (item) => item.name === `${iName}_notification`
        );
        if (notificationCompare != undefined) {
          notificationID.value = notificationCompare.id;
          console.log(`${iName}_notification is register`);
        } else {
          saveNotificationName.value = `${iName}_notification`;
          console.log(`${iName}_notification save`);
        }
      })
      .catch((err) => {
        catchCounter(err, ListNotification(iName, counter));
      });
  };
  const ListAlertRules = async (pID, fID, iName, counter = 0) => {
    await apiGeofencing
      .ListAlertRules(pID, fID)
      .then((res) => {
        console.log(res.data);
        const rulesCompare = res.data.alertRules.find(
          (item) => item.name === `${iName}_Rules` //尋找元素內的資料
        );
        if (rulesCompare != undefined) {
          alertRuleID.value = rulesCompare.id;
          console.log(`${iName}_Rules is register`);
        } else {
          saveRouteName.value.push(`${iName}_Rules`);
          console.log(`${iName}_Rules save`);
        }
      })
      .catch((err) => {
        catchCounter(err, ListAlertRules(pID, fID, iName, counter));
      });
  };
  const AddNewProject = async (iName, counter = 0) => {
    await apiAddnewproject(ADMINKEY, { name: iName })
      .then((res) => {
        console.log("addprojectID:" + res.data.id);
        projectID.value = res.data.id;
        console.log(`ADD ${itineraryName} project success`);
      })
      .catch((err) => {
        catchCounter(err, AddNewProject(iName, counter));
      });
  };
  const AddNewfencetoaproject = async (
    pID,
    fCData,
    iName,
    radius,
    counter = 0
  ) => {
    const fenceCoordinatesDataList = ref([]);
    //製作路線
    fCData.forEach((value) => {
      if (value.length < 100) {
        fenceCoordinatesDataList.value.push(...value);
      } else {
        for (let i = 0; i < value.length / 20; i++) {
          fenceCoordinatesDataList.value.push(value[i * 20]);
        }
      }
    });
    const fenceData = ref({
      name: `${iName}_fence`,
      type: "Feature",
      geometry: {
        type: "LineString",
        radius: radius,
        shapeType: "Corridor",
        coordinates: fenceCoordinatesDataList.value,
      },
    });
    await apiAddnewfencetoaproject(pID, ADMINKEY, fenceData.value)
      .then((res) => {
        console.log("addfenceID:" + res.data.id);
        fenceID.value = res.data.id;
        console.log(`ADD ${fenceData.value.name} fence success`);
      })
      .catch((err) => {
        catchCounter(
          err,
          AddNewfencetoaproject(pID, fCData, iName, radius, counter)
        );
      });
  };
  const objectOK = ref(false);

  const AddNewObject = async (pID, iName, counter = 0, callback = null) => {
    const apis = saveObjectNameList.value.map((obj) => {
      return apiAddnewobject(ADMINKEY, {
        name: `${obj}`,
        defaultProject: pID,
      });
    });

    Promise.all(apis)
      .then((results) => {
        results.forEach((res) => {
          objectIDList.value.push(res.data.id);
          console.log(`ADD ${res.data.id} object success`);
        });

        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        catchCounter(err, AddNewObject(pID, iName, counter));
      });
  };

  const AddnewContactGroup = async (iName, counter = 0) => {
    const contactGroupData = ref({
      name: `${iName}_notification`,
      webhookUrls: [
        "https://mih-fleet.westus2.cloudapp.azure.com/api/geofence",
      ],
      emails: [],
    });
    await apiNotifications
      .CreateContactGroup(contactGroupData.value)
      .then((res) => {
        console.log("addnotificationID:" + res.data.id);
        notificationID.value = res.data.id;
        console.log(notificationID.value);
      })
      .catch((err) => {
        catchCounter(err, AddnewContactGroup(iName, counter));
      });
  };
  const AddnewAlertRules = async (pID, fID, nID, iName, counter = 0) => {
    const alertRulesData = ref({
      name: `${iName}_Leavel`,
      project: pID,
      fence: fID,
      object: "*",
      alertType: "TRANSITION",
      alertRuleConstraints: {
        transitionType: "EXIT",
      },
      notificationGroup: nID,
      enabled: true,
    });
    await apiGeofencing
      .CreateAlertRule(ADMINKEY, alertRulesData.value)
      .then((res) => {
        console.log(res.data);
        alertRuleID.value = res.data.id;
        console.log("AlertRule success :" + alertRuleID.value);
      })
      .catch((err) => {
        catchCounter(err, AddnewAlertRules(pID, fID, nID, iName, counter));
      });
  };
  const performTomTomSetup = async () => {
    await Listprojects();
    await ListNotification(itineraryName);
    if (saveProjectName.value) {
      await AddNewProject(saveProjectName.value);
    }
    if (saveNotificationName.value) {
      await AddnewContactGroup(itineraryName);
    }
    if (projectID.value) {
      await Listfences(projectID.value);
      await ListObjects(itineraryName, objectNameArray);
      if (saveFenceName.value) {
        console.log(saveFenceName.value);
        await AddNewfencetoaproject(
          projectID.value,
          fenceCoordinatesData,
          itineraryName,
          500
        );
      }
      if (saveObjectNameList.value.length !== 0) {
        await AddNewObject(projectID.value, itineraryName);
        saveObjectNameList.value.length = 0;
      }
    }
  };
}
