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
export function useSetTomTomData(
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
  const AddNewObject = async (pID, iName, counter = 0) => {
    saveObjectNameList.value.forEach((oName, index) => {
      apiAddnewobject(ADMINKEY, {
        name: `${oName}`,
        defaultProject: pID,
      })
        .then((res) => {
          objectIDList.value.push(res.data.id);
          console.log(`ADD ${res.data.id} object success`);
        })
        .catch((err) => {
          catchCounter(err, AddNewObject(pID, iName, counter));
        });

      if (saveObjectNameList.value.length == index + 1) {
        objectOK.value = true;
      }
    });
  };
  const AddnewContactGroup = async (iName, counter = 0) => {
    const contactGroupData = ref({
      name: `${iName}_notification`,
      webhookUrls: [""],
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
      object: objectIDList.value[0],
      alertType: "TRANSITION",
      alertRuleConstraints: {
        transitionType: "ALL",
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
  const see = async () => {
    console.log(`pID:${projectID.value}`);
    console.log(`fID:${fenceID.value}`);
    console.log(`oID:${objectIDList.value}`);
    console.log(`nID:${notificationID.value}`);
    console.log(`rID:${alertRuleID.value}`);
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
    if (
      projectID.value &&
      fenceID.value &&
      objectOK.value &&
      notificationID.value
    ) {
      await ListAlertRules(projectID.value, fenceID.value, itineraryName);
      console.log("success");
    }
    if (saveRouteName.value !== 0) {
      await AddnewAlertRules(
        projectID.value,
        fenceID.value,
        notificationID.value,
        itineraryName
      );
      see();
    }

    //20230914
    // AddNewObject_NEW(projectID.value, itineraryName,0, async ()=> {
    //   await AddnewAlertRules(
    //     projectID.value,
    //     fenceID.value,
    //     notificationID.value,
    //     itineraryName
    //   );
    //   see();
    // });
  };
  performTomTomSetup();
}

export function useDeleteTomTomData(itineraryName, objectNameArray) {
  initializationData();
  const retryTimes = 10;
  const Listprojects = async (counter = 0) => {
    await apiListprojects()
      .then((res) => {
        const projectCompare = res.data.projects.find(
          (item) => item.name === itineraryName //尋找元素內的資料
        );
        if (projectCompare != undefined) {
          projectID.value = projectCompare.id;
          console.log(`${itineraryName} is register`);
          //Deleteprojects(projectCompare.id);
        } else {
          saveProjectName.value = itineraryName;
          console.log(`${itineraryName} no register`);
        }
      })
      .catch((err) => {
        catchCounter(err, Listprojects(counter));
      });
  };
  const Listfences = async (pID, iName, counter = 0) => {
    await apiListthefencesforagivenproject(pID)
      .then((res) => {
        console.log(res.data);
        const fenceCompare = res.data.fences.find(
          (item) => item.name === `${iName}_fence` //尋找元素內的資料
        );
        if (fenceCompare != undefined) {
          fenceID.value = fenceCompare.id;
          console.log(`${iName}_fence is register`);
          //Deletefencetoaproject(fenceCompare.id);
        } else {
          saveFenceName.value = `${itineraryName}_fence`;
          console.log(`${itineraryName}_fence no register`);
        }
      })
      .catch((err) => {
        catchCounter(err, Listfences(pID, iName, counter));
      });
  };
  const ListObjects = async (iName, oNameArray, counter = 0) => {
    saveObjectNameList.value = [];
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
            Deleteobject(objectCompare.id);
          } else {
            saveObjectNameList.value.push(`${iName}_${oName}_object`);
            console.log(`${iName}_${oName}_object no register`);
          }
        });
      })
      .catch((err) => {
        catchCounter(err, ListObjects(iName, oNameArray, counter));
      });
  };
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
          DeleteContactGroup(notificationCompare.id);
        } else {
          saveNotificationName.value = `${iName}_notification`;
          console.log(`${iName}_notification no register`);
        }
      })
      .catch((err) => {
        catchCounter(err, ListNotification(iName, counter));
      });
  };
  const ListAlertRules = async (pID, fID, iName, counter = 0) => {
    saveRouteName.value = [];
    await apiGeofencing
      .ListAlertRules(pID, fID)
      .then((res) => {
        console.log(res.data);
        const rulesCompare = res.data.alertRules.find(
          (item) => item.name === `${iName}_Leavel` //尋找元素內的資料
        );
        if (rulesCompare != undefined) {
          alertRuleID.value = rulesCompare.id;
          console.log(`${iName}_Leavel is register`);
          DeleteAlertRules(rulesCompare.id);
        } else {
          saveRouteName.value.push(`${iName}_Leavel`);
          console.log(`${iName}_Leavel no register`);
        }
      })
      .catch((err) => {
        catchCounter(err, ListAlertRules(pID, fID, iName, counter));
      });
  };
  const see = async () => {
    console.log(`pID:${projectID.value}`);
    console.log(`fID:${fenceID.value}`);
    console.log(`oID:${objectIDList.value}`);
    console.log(`nID:${notificationID.value}`);
    console.log(`rID:${alertRuleID.value}`);
  };
  const Deleteprojects = async (pID, counter = 0) => {
    await apiDeleteprojects(pID, ADMINKEY)
      .then((res) => {
        console.log("project is Delete");
        console.log(res);
      })
      .catch((err) => {
        catchCounter(err, Deleteprojects(pID, counter));
      });
  };
  const Deletefencetoaproject = async (fID, counter = 0) => {
    await apiDeletefence(fID, ADMINKEY)
      .then((res) => {
        console.log(fID + "_fence is Delete");
        console.log(res.data);
      })
      .catch((err) => {
        catchCounter(err, Deletefencetoaproject(fID, counter));
      });
  };
  const Deleteobject = async (oID, counter = 0) => {
    await apiDeleteobject(oID, ADMINKEY)
      .then((res) => {
        console.log(oID + "_object is Delete");
      })
      .catch((err) => {
        catchCounter(err, Deleteobject(oID, counter));
      });
  };
  const DeleteContactGroup = async (nID, counter = 0) => {
    await apiNotifications
      .DeleteContactGroup(nID)
      .then((res) => {
        console.log(nID + "_ContactGroup is Delete");
      })
      .catch((err) => {
        catchCounter(err, DeleteContactGroup(nID, counter));
      });
  };
  const DeleteAlertRules = async (rID, counter = 0) => {
    apiGeofencing
      .DeleteAlertRule(rID, ADMINKEY)
      .then((res) => {
        console.log(rID + "_Rules is Delete");
      })
      .catch((err) => {
        catchCounter(err, DeleteAlertRules(rID, counter));
      });
  };
  const performTomTomSetup = async () => {
    await Listprojects();
    await ListNotification(itineraryName);
    if (projectID.value) {
      await Listfences(projectID.value, itineraryName);
      await ListObjects(itineraryName, objectNameArray);
    }
    if (projectID.value && fenceID.value) {
      console.log("success delete");
      await ListAlertRules(projectID.value, fenceID.value, itineraryName);
      await see();
      //await Deletefencetoaproject(fenceID.value);
      await Deleteprojects(projectID.value);
    }
  };
  performTomTomSetup();
}
