import myAxios from "./axios";
/*
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
  baseURL: "https://mih-fleet3.westus2.cloudapp.azure.com/",
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

export const getCamera = () => {
  MIHapi.get(`/video_feed`);
};

export const getTomTomAlert = () => MIHapi.get(`/api/geofence`);

export const getDTC = (ID) =>
  MIHapi.get(`api/get/dtc`, { params: { VINID: ID } });

export const getCarAlert = (param) =>
  MIHapi.get(`/api/get/alert`, { params: { VINID: param } });

export const getItinerary = (ID) =>
  MIHapi.get(`api/itinerary`, { params: { itineraryName: ID } });

export const putItinerary = (itineraryName, data) =>
  MIHapi.put(`api/itinerary?itineraryName=${itineraryName}`, data, {
    params: null, // 设置params为null
  });

export const postItinerary = (data) => MIHapi.post(`api/itinerary`, data);

export const deleteItinerary = (itineraryName) =>
  MIHapi.delete(`api/itinerary?itineraryName=${itineraryName}`);
