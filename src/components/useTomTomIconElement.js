import tt from "@tomtom-international/web-sdk-maps";
import { ref } from "vue";

const markerData = ref([]);
export const useSetIcon = (marker, index, size, url, map) => {
  let element = document.createElement("div");
  element.style.backgroundImage = `url(${url})`;
  element.style.backgroundSize = size;
  element.style.height = size;
  element.style.width = size;

  markerData[index] = new tt.Marker({ element: element })
    .setLngLat({ lat: marker.lat, lng: marker.lng })
    .addTo(map);
};
