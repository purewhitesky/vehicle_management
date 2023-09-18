import axios from "axios";

const apiGogoro = axios.create({
  baseURL: "https://mih-fleet-postgresql.eastasia.cloudapp.azure.com/gogoro/",
});

export const apiGetGogoroList = () => {
  return apiGogoro.get(`/gostation_site`);
};

export const apiGetGogoroVMS = (data) => {
  return apiGogoro.get(`/vms`, data);
};

export const apiGetGogoroVM = (data) => {
  return apiGogoro.get(`/vm_statuses?${data}`);
};
