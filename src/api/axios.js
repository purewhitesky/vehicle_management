import axios from "axios";

function myAxios(axiosConfig) {
  const service = axios.create({
    baseURL: "https://mih-fleet.westus2.cloudapp.azure.com/",
    timeout: "10000",
  });
  return service(axiosConfig);
}

export default myAxios;
