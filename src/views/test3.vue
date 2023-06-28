<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as turf from "@turf/turf";
import { ref, reactive, onMounted } from "vue";
import {
  apiAddnewproject,
  apiAddnewfencetoaproject,
  apiAddnewobject,
  apiEditobject,
  apigetReport,
} from "@/api/apiTomtom";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 15,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.on("click", (event) => {
    const position = event.lngLat;
    console.log(position);
    window.map = map;
    apiAddnewfencetoaproject(
      "ba848e64-c5d1-4190-9d41-2762966ac6f5",
      "1n7ESSUGBnwnU96gbzYtdX3rYhikRwVOeyagQWSDuC9xCbUj",
      {
        name: `Our location ${Math.floor(Math.random() * 10000)}`,
        type: "Feature",
        geometry: {
          radius: 1000,
          type: "Point",
          shapeType: "Circle",
          coordinates: [position.lng, position.lat],
        },
        properties: {
          //Optional
          type: "Feature",
        },
      }
    ).then((res) => {
      console.log(res.data);

      let _center = turf.point([position.lng, position.lat]);
      let _radius = 1;
      let _options = {
        steps: 40,
        units: "kilometers", // or "mile"
      };
      let _circle = turf.circle(_center, _radius, _options);
      console.log(_circle);
      map.addSource(`circleData`, {
        type: "geojson",
        data: _circle,
      });

      map.addLayer({
        id: `circle-fill`,
        type: "fill",

        source: "circleData",
        paint: {
          "fill-color": "red",
          "fill-opacity": 0.5,
        },
      });
    });
  });
});
</script>
<template>
  <LayoutAuthenticated>
    <div
      class="h-[70vh] w-auto lg:h-[40vh] lg:w-[100%]"
      id="map"
      ref="mapRef"
    ></div>
  </LayoutAuthenticated>
</template>
