import axios from "axios";

const apiGogoro = axios.create({
  baseURL: "https://mih-fleet-postgresql.eastasia.cloudapp.azure.com/gogoro/",
});

export const apiGetGogoroList = () => {
  return apiGogoro.get(`/gostation_site`);
};

export const apiPostGogoroVMS = (data) => {
  return apiGogoro.post(`/vms`, data);
};

export const apiPostGogoroVM = (data) => {
  return apiGogoro.post(`/vm`, data);
};
