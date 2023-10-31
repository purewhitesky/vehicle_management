import tt from "@tomtom-international/web-sdk-maps";
import { ref } from "vue";

export const useSetUrlIcon = (marker, index, size, url, map) => {
  const markerUrlData = ref([]);
  let element = document.createElement("div");
  element.style.backgroundImage = `url(${url})`;
  element.style.backgroundSize = size;
  element.style.height = size;
  element.style.width = size;

  markerUrlData.value[index] = new tt.Marker({ element: element })
    .setLngLat({ lat: marker.lat, lng: marker.lng })
    .addTo(map);

  return { markerUrlData };
};

export const useSetSVGIcon = (marker, index, size, svg, map) => {
  const markerSVGData = ref([]);
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("viewBox", "0 0 24 24");
  svgElement.setAttribute("width", size); // 設定寬度為 200 像素
  svgElement.setAttribute("height", size); // 設定高度為 150 像素
  // 創建 SVG 元素的內容 - path 元素
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", svg);
  //pathElement.setAttribute("fill", "bg-sky-400");
  // 將 path 元素添加到 SVG 元素中
  svgElement.appendChild(pathElement);
  // 將 SVG 元素添加到文檔中的 body 元素中
  document.body.appendChild(svgElement);

  markerSVGData.value[index] = new tt.Marker({ element: svgElement })
    .setLngLat({ lat: marker.lat, lng: marker.lng })
    .addTo(map);

  return { markerSVGData };
};
