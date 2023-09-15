import axios from "axios";

//===profile===
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const matrixRoutingVersionNumber = 2;
const waypointOptimizationVersionNumber = 1;
const geofencingVersionNumber = 1;
const locationHistoryNumber = 1;
const NotificationsNumber = 1;

//===============

// 20230914
// const api = () => {

//   const apiURL = "https://api.tomtom.com"

//   return {
//     matrixRoutingRequest: axios.create({
//       baseURL: `${apiURL}/matrix/`,
//     }),
//   };
// };

const matrixRoutingRequest = axios.create({
  baseURL: "https://api.tomtom.com/routing/matrix/",
});

const waypointOptimizationRequest = axios.create({
  baseURL: "https://api.tomtom.com/routing/waypointoptimization/",
});

const geofencingRequest = axios.create({
  baseURL: "https://api.tomtom.com/geofencing/",
});

const locationHistory = axios.create({
  baseURL: "https://api.tomtom.com/locationHistory/",
});

const Notifications = axios.create({
  baseURL: "https://api.tomtom.com/notifications/",
});
//===============
export const apiSynchronousMatrix = (data) =>
  matrixRoutingRequest.post(
    `${matrixRoutingVersionNumber}?key=${TOMTOMKEY}`,
    data
  );

export const apiAsynchronousMatrixSubmission = (data) =>
  matrixRoutingRequest.post(
    `${matrixRoutingVersionNumber}/async?key=${TOMTOMKEY}`,
    data
  );

export const apiAsynchronousMatrixStatus = (matrixJobId) =>
  matrixRoutingRequest.get(
    `${waypointOptimizationVersionNumber}/async/${matrixJobId}?key=${TOMTOMKEY}`
  );

export const apiAsynchronousMatrixDownload = (matrixJobId) =>
  matrixRoutingRequest.get(
    `${waypointOptimizationVersionNumber}/async/${matrixJobId}/result?key=${TOMTOMKEY}`
  );

export const apiWaypointOptimization = (data) =>
  waypointOptimizationRequest.post(
    `${waypointOptimizationVersionNumber}?key=${TOMTOMKEY}`,
    data
  );
//=============================================================
//Geofencing API
//配置服務Configuration service
export const apiRegisterAdminKey = (data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/register?key=${TOMTOMKEY}`,
    data
  );
export const apiRegenerateAdminKey = (data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/regenerateKey?key=${TOMTOMKEY}`,
    data
  );
export const apiChangecustomersecret = (data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/updateSecret?key=${TOMTOMKEY}`,
    data
  );
export const apiListcurrentoptions = (ADMINKEY) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/settings?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiSetnewsettingsvalues = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/settings?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );

//項目服務Projects service
export const apiListprojects = () =>
  geofencingRequest.get(`${geofencingVersionNumber}/projects?key=${TOMTOMKEY}`);
export const apiGetprojectdetails = (projectId, isTrue) => {
  isTrue ? isTrue : false;
  geofencingRequest.get(
    `${geofencingVersionNumber}/projects/${projectId}?&key=${TOMTOMKEY}&defaultObjects=${isTrue}`
  );
};
export const apiAddnewproject = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/projects/project?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiEditprojects = (projectId, ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/projects/${projectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiDeleteprojects = (projectId, ADMINKEY, isFalseDeleteData) => {
  return geofencingRequest.delete(
    `${geofencingVersionNumber}/projects/${projectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    {
      params: {
        dryRun: isFalseDeleteData,
      },
    }
  );
};

//圍欄服務Fences service
export const apiListthefencesforagivenproject = (projectId) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/projects/${projectId}/fences?key=${TOMTOMKEY}`
  );
export const apiGetfencedetails = (fenceId) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/fences/${fenceId}?key=${TOMTOMKEY}`
  );
export const apiGetobjectscountinthefence = (
  fenceId,
  filters,
  maxResults,
  pageNumber
) => {
  geofencingRequest.get(
    `${geofencingVersionNumber}/fences/${fenceId}/objects?key=${TOMTOMKEY}`,
    {
      params: {
        filters: filters,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
};

export const apiEditfence = (fenceId, ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/fences/${fenceId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiAddnewfencetoaproject = (projectId, ADMINKEY, data) => {
  return geofencingRequest.post(
    `${geofencingVersionNumber}/projects/${projectId}/fence?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
};
export const apiCreatenewfence = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/fences/fence?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiDeletefence = (fenceId, ADMINKEY, isFalseDeleteData) => {
  return geofencingRequest.delete(
    `${geofencingVersionNumber}/fences/${fenceId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    {
      params: {
        dryRun: isFalseDeleteData,
      },
    }
  );
};

export const apiDeletefencefromproject = (
  projectId,
  fenceId,
  ADMINKEY,
  isTrue
) => {
  return geofencingRequest.delete(
    `${geofencingVersionNumber}/projects/${projectId}/fences/${fenceId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    {
      params: {
        dryRun: isTrue,
      },
    }
  );
};

//對象服務Objects service
export const apiListobjects = () =>
  geofencingRequest.get(`${geofencingVersionNumber}/objects?key=${TOMTOMKEY}`);
export const apiGetobjectdetails = (objectId) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/objects/${objectId}?key=${TOMTOMKEY}`
  );
export const apiAddnewobject = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/objects/object?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );

export const apiEditobject = (objectId, ADMINKEY, data) =>
  geofencingRequest.put(
    `${geofencingVersionNumber}/objects/${objectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );

export const apiDeleteobject = (objectId, ADMINKEY) => {
  return geofencingRequest.delete(
    `${geofencingVersionNumber}/objects/${objectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
};

//報告服務Report service
export const apigetReport = (
  projectId,
  longitude,
  latitude,
  altitude,
  objectId,
  range
) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/report/${projectId}?key=${TOMTOMKEY}&point=${longitude},${latitude},${altitude}`,
    {
      params: {
        object: objectId,
        range: range,
      },
    }
  );
export const apipostReport = (
  projectId,
  longitude,
  latitude,
  altitude,
  objectId,
  range,
  timestamp,
  data
) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/report/${projectId}?key=${TOMTOMKEY}&point=${longitude},${latitude},${altitude}&object=${objectId}&range=${range}`,
    {
      params: {
        timestamp: timestamp,
      },
    },
    data
  );
//過渡服務Transitions service

export const apiGetfencestransitions = (
  fenceId,
  startTime,
  endTime,
  maxResults,
  pageNumber
) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/transitions/fences/${fenceId}?key=${TOMTOMKEY}&from=${startTime}`,
    {
      params: {
        to: endTime,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
export const apiGetobjectstransitions = (
  objectId,
  startTime,
  endTime,
  projects,
  maxResults,
  pageNumber
) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/transitions/objects/${objectId}?key=${TOMTOMKEY}&from=${startTime}`,
    {
      params: {
        to: endTime,
        projects: projects,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
export const apiGetprojectstransitions = (
  projectId,
  startTime,
  endTime,
  maxResults,
  pageNumber
) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/transitions/projects/${projectId}?key=${TOMTOMKEY}&from=${startTime}`,
    {
      params: {
        to: endTime,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
export const apiDeletetransitionshistory = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/transitions?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
//存檔服務Archive service

export const apiArchivestructure = (ADMINKEY) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/archive/structure?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiArchivetransitions = (ADMINKEY) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/archive/transitions?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiDownloadprepareddata = (token, ADMINKEY) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/download/${token}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );

//警報服務Alert service
export const apiGeofencing = {
  //警報服務Alert service
  CreateAlertRule(ADMINKEY, data) {
    return geofencingRequest.post(
      `${geofencingVersionNumber}/alerts/rules?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
      data
    );
  },
  GetAlertRule(ruleId) {
    return geofencingRequest.get(
      `${geofencingVersionNumber}/alerts/rules/${ruleId}?key=${TOMTOMKEY}`
    );
  },
  ListAlertRules(
    project,
    fence,
    object,
    alertType,
    isEnabled,
    notificationGroup,
    maxResults,
    pageNumber
  ) {
    return geofencingRequest.get(
      `${geofencingVersionNumber}/alerts/rules?key=${TOMTOMKEY}`,
      {
        params: {
          project: project,
          fence: fence,
          object: object,
          alertType: alertType,
          enabled: isEnabled,
          notificationGroup: notificationGroup,
          maxResults: maxResults,
          pageNumber: pageNumber,
        },
      }
    );
  },
  UpdateAlertRulePartially(ruleId, ADMINKEY, data) {
    return geofencingRequest.patch(
      `${geofencingVersionNumber}/alerts/rules/${ruleId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
      data
    );
  },
  DeleteAlertRule(ruleId, ADMINKEY) {
    return geofencingRequest.delete(
      `${geofencingVersionNumber}/alerts/rules/${ruleId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
    );
  },
  ListAlertHistory(startTime, endTime, alertType, maxResults, pageNumber) {
    return geofencingRequest.get(
      `${geofencingVersionNumber}/alerts/history?key=${TOMTOMKEY}&from=${startTime}`,
      {
        params: {
          to: endTime,
          alertType: alertType,
          maxResults: maxResults,
          pageNumber: pageNumber,
        },
      }
    );
  },
  DeleteAlertHistory(ADMINKEY, alertType, data) {
    return geofencingRequest.delete(
      `${geofencingVersionNumber}/alerts/history?key=${TOMTOMKEY}&adminKey=${ADMINKEY}&alertType=${alertType}`,
      data
    );
  },
};

export const apiCreatealertrule = (ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/alerts/rules?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiGetalertrule = (ADMINKEY) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/alerts/rules/${TOMTOMKEY}?key=${ADMINKEY}`
  );
export const apiListalertrules = (
  projectUUID,
  fenceUUID,
  objectUUID,
  alertType,
  isEnabled,
  notificationGroupUUID,
  maxResults,
  pageNumber
) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/alerts/rules?key=${TOMTOMKEY}&project=${projectUUID}&fence=${fenceUUID}&object=${objectUUID}&alertType=${alertType}&enabled=${isEnabled}&notificationGroup=${notificationGroupUUID}&maxResults=${maxResults}&pageNumber=${pageNumber}`
  );
export const apiUpdatealertrulepartially = (ruleId, ADMINKEY, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/alerts/rules/${ruleId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiDeletealertrule = (ruleId, ADMINKEY, data) => {
  return geofencingRequest.post(
    `${geofencingVersionNumber}/alerts/rules/${ruleId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
};
export const apiListalerthistory = (
  startTime,
  endTime,
  alertType,
  maxResults,
  pageNumber
) =>
  geofencingRequest.get(
    `${geofencingVersionNumber}/alerts/history?key=${TOMTOMKEY}&from=${startTime}&to=${endTime}&alertType=${alertType}&maxResults=${maxResults}&pageNumber=${pageNumber}`
  );
export const apiDeletealerthistory = (ADMINKEY, alertType, data) =>
  geofencingRequest.post(
    `${geofencingVersionNumber}/alerts/history?key=${TOMTOMKEY}&adminKey=${ADMINKEY}&alertType=${alertType}`,
    data
  );

//======================================================================
//Location History API
//配置服務Configuration service
export const apiHistoryChangeCustomerSecret = (data) =>
  locationHistory.post(
    `${locationHistoryNumber}/updateSecret?key=${TOMTOMKEY}`,
    data
  );
export const apiHistoryListCurrentOptions = (ADMINKEY) =>
  locationHistory.get(
    `${locationHistoryNumber}/settings?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiHistoryRegenerateAdminKey = (data) =>
  locationHistory.post(
    `${locationHistoryNumber}/regenerateKey?key=${TOMTOMKEY}`,
    data
  );
export const apiHistoryRegisterAdminKey = (data) =>
  locationHistory.post(
    `${locationHistoryNumber}/register?key=${TOMTOMKEY}`,
    data
  );
export const apiHistorySetNewSettingsValues = (ADMINKEY, data) =>
  locationHistory.post(
    `${locationHistoryNumber}/settings?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );

//對象服務Objects service
export const apiHistoryAddNewObject = (ADMINKEY, data) =>
  locationHistory.post(
    `${locationHistoryNumber}/objects/object?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiHistoryDeleteObject = (objectId, ADMINKEY, data) =>
  locationHistory.delete(
    `${locationHistoryNumber}/objects/${objectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiHistoryEditObject = (objectId, ADMINKEY, data) =>
  locationHistory.post(
    `${locationHistoryNumber}/objects/${objectId}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`,
    data
  );
export const apiHistoryGetObjectDetails = (objectId) =>
  locationHistory.get(
    `${locationHistoryNumber}/objects/${objectId}?key=${TOMTOMKEY}`
  );
export const apiHistoryListObjects = () =>
  locationHistory.get(`${locationHistoryNumber}/objects?key=${TOMTOMKEY}`);

//位置歷史服務Position History service
export const apiHistorySendPosition = (data) =>
  locationHistory.post(
    `${locationHistoryNumber}/history/positions?key=${TOMTOMKEY}`,
    data
  );
export const apiHistoryLastPosition = (objectId) =>
  locationHistory.get(
    `${locationHistoryNumber}/history/position/${objectId}?key=${TOMTOMKEY}`
  );
export const apiHistoryGetObjectsPositionHistory = (
  objectId,
  startTime,
  endTime,
  maxResults,
  pageNumber
) =>
  locationHistory.get(
    `${locationHistoryNumber}/history/positions/${objectId}?key=${TOMTOMKEY}&from=${startTime}`,
    {
      params: {
        to: endTime,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
export const apiHistoryClearObjectsPositionHistory = (ADMINKEY) =>
  locationHistory.delete(
    `${locationHistoryNumber}/history?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );

//存檔服務Archive service
export const apiArchiveHistoricalPositions = (ADMINKEY) =>
  locationHistory.get(
    `${locationHistoryNumber}/archive/positions?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiHistoryArchiveStructure = (ADMINKEY) =>
  locationHistory.get(
    `${locationHistoryNumber}/archive/structure?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
export const apiHistoryDownloadPreparedData = (token, ADMINKEY) =>
  locationHistory.get(
    `${locationHistoryNumber}/download/${token}?key=${TOMTOMKEY}&adminKey=${ADMINKEY}`
  );
//======================================================================
//Notifications API
//配置服務 Configuration service
export const apiNotificationsListCurrentOptions = () => {};
Notifications.get(`${NotificationsNumber}/settings?key=${TOMTOMKEY}`);

export const apiNotifications = {
  //配置服務 Configuration service
  ListCurrentOptions() {
    return Notifications.get(
      `${NotificationsNumber}/settings?key=${TOMTOMKEY}`
    );
  },

  //聯繫人群組服務 Contact Groups service
  CreateContactGroup(data) {
    return Notifications.post(
      `${NotificationsNumber}/groups?key=${TOMTOMKEY}`,
      data
    );
  },
  ListContactGroups(maxResults, pageNumber) {
    return Notifications.get(`${NotificationsNumber}/groups?key=${TOMTOMKEY}`, {
      params: {
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    });
  },
  GetContactGroupDetails(groupId) {
    return Notifications.get(
      `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`
    );
  },
  EditContactGroup(groupId, data) {
    return Notifications.put(
      `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`,
      data
    );
  },
  EditContactGroupPartially(groupId, data) {
    return Notifications.patch(
      `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`,
      data
    );
  },
  DeleteContactGroup(groupId) {
    return Notifications.delete(
      `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`
    );
  },

  //通知歷史服務 Notifications History service
  ListNotificationsHistory(startTime, endTime, maxResults, pageNumber) {
    return Notifications.get(
      `${NotificationsNumber}/history?key=${TOMTOMKEY}&from=${startTime}`,
      {
        params: {
          to: endTime,
          maxResults: maxResults,
          pageNumber: pageNumber,
        },
      }
    );
  },
  ClearNotificationsHistory() {
    return Notifications.delete(
      `${NotificationsNumber}/history?key=${TOMTOMKEY}`
    );
  },
};

//聯繫人群組服務 Contact Groups service
export const apiNotificationsCreateContactGroup = (data) =>
  Notifications.post(`${NotificationsNumber}/groups?key=${TOMTOMKEY}`, data);

export const apiNotificationsListContactGroups = (maxResults, pageNumber) =>
  Notifications.get(`${NotificationsNumber}/groups?key=${TOMTOMKEY}`, {
    params: {
      maxResults: maxResults,
      pageNumber: pageNumber,
    },
  });
export const apiNotificationsGetContactGroupDetails = (groupId) =>
  Notifications.get(
    `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`
  );
export const apiNotificationsEditContactGroup = (groupId, data) =>
  Notifications.put(
    `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`,
    data
  );
export const apiNotificationsEditContactGroupPartially = (groupId, data) =>
  Notifications.patch(
    `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`,
    data
  );
export const apiNotificationsDeleteContactGroup = (groupId) =>
  Notifications.delete(
    `${NotificationsNumber}/groups/${groupId}?key=${TOMTOMKEY}`
  );

//通知歷史服務 Notifications History service
export const apiNotificationsListNotificationsHistory = (
  startTime,
  endTime,
  maxResults,
  pageNumber
) =>
  Notifications.get(
    `${NotificationsNumber}/history?key=${TOMTOMKEY}&from=${startTime}`,
    {
      params: {
        to: endTime,
        maxResults: maxResults,
        pageNumber: pageNumber,
      },
    }
  );
export const apiNotificationsClearNotificationsHistory = () =>
  Notifications.delete(`${NotificationsNumber}/history?key=${TOMTOMKEY}`);

//通知格式 Notification format

/*export const api = (ADMINKEY, data) =>
    geofencingRequest.post(
      `${geofencingVersionNumber}`,
      data
    );*/
