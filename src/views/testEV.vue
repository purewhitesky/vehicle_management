<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as turf from "@turf/turf";
import BaseButton from "@/components/BaseButton.vue";
import { ref, reactive, onMounted } from "vue";
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };
const isClick = ref(false);
const isOpen = ref(false);
onMounted(() => {
  window.setInterval(() => {
    //中心點更新
    console.log(isOpen.value);
    navigator.geolocation.getCurrentPosition((position) => {
      window.map.panTo({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    /*if (isClick.value) {
      window.map.panTo({
        lat: locationGPS.value.lat,
        lng: locationGPS.value.lng,
      });
    }
    console.log(locationGPS.value);*/
  }, 10000);
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 10,
    center: center,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
  map.on("click", (event) => {
    const position = event.lngLat;
    console.log(position);
  });

  console.log(map.getBounds());

  window.map = map;
});

const positionEV = ref();
const openEVstation = () => EVstation(map.getBounds()._sw, map.getBounds()._ne);

const EVstation = (sw, ne) =>
  tts.services
    .fuzzySearch({
      key: TOMTOMKEY,
      query: "station",
      connectorSet: "Tesla,Chademo,IEC62196Type2Outlet",
      boundingBox: [sw, ne],
    })
    .then(function (response) {
      console.log(response.results);
      positionEV.value = response;
      /*var chargingStationID = response.results[0].entryPoints.info;
      tts.services
        .evChargingStationsAvailability({
          key: TOMTOMKEY,
          chargingAvailability: "124599002464658",
        })
        .then(callbackFn);*/

      response.results.forEach((marker, index) => {
        new tt.Marker().setLngLat(marker.position).addTo(window.map);
        console.log(marker.position);
      });
    });
</script>
<template>
  <LayoutAuthenticated>
    <div
      class="h-[100vh] w-auto lg:h-[100vh] lg:w-[100%]"
      id="map"
      ref="mapRef"
    ></div>
    <!--
    <BaseButton label="1" @click="changeLocation(0)"></BaseButton>
-->
    <BaseButton label="2" @click="openEVstation()"></BaseButton>
  </LayoutAuthenticated>
</template>
