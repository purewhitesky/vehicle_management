import myAxios from "./axios";

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
}
