import axios from "axios";

const apiGraphen = axios.create({
  baseURL: "https://aica.graphen.ai:3082/",
});

export const fix = (data) => apiGraphen.post(`/api/predict`, data);
