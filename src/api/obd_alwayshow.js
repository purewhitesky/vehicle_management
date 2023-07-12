/*import myAxios from "./axios";

export function getPageAPI(param) {
  return myAxios({
    url: "/api/get/obd_sec",
    params: param,
  });
}

export function getGPSAPI(param) {
  return myAxios({
    url: "/api/get/gps",
    params: { VINID: param },
  });
}

export function getOBD2API(param) {
  return myAxios({
    url: "/api/get/obd_ten",
    params: param,
  });
}

export function getHistoryAPI(param) {
  return myAxios({
    url: "/api/get/history",
    params: param,
  });
}

export function getUserAPI(param) {
  return myAxios({
    url: "/api/get/car",
    params: param,
  });
}*/

import axios from "axios";
const MIHapi = axios.create({
  baseURL: "https://mih-fleet.westus2.cloudapp.azure.com/",
});

export const getPageAPI = (param) =>
  MIHapi.get(`/api/get/obd_sec`, { params: param });

export const getGPSAPI = (param) =>
  MIHapi.get(`/api/get/gps`, { params: { VINID: param } });

export const getOBD2API = (param) =>
  MIHapi.get(`/api/get/obd_ten`, { params: param });

export const getHistoryAPI = (param) =>
  MIHapi.get(`/api/get/history`, { params: param });

export const getUserAPI = (param) =>
  MIHapi.get(`/api/get/car`, { params: param });

export const getTomTomAlert = () => {
  MIHapi.get(`/api/geofence`);
};
