<template>
  <LayoutAuthenticated>
    <div class="m-6">
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
    </div>
  </LayoutAuthenticated>
</template>
<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";
import TomTomStyle from "@/style/tomtomstyle.json";
import { ref, reactive, onMounted, computed } from "vue";

const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";

const mapRef = ref(null);
const center = { lat: 25.034228, lng: 121.563995 };

onMounted(() => {
  let map = tt.map({
    key: TOMTOMKEY,
    container: mapRef.value,
    zoom: 13,
    center: center,
    style: TomTomStyle,
  });
  map.addControl(new tt.FullscreenControl());
  map.addControl(new tt.NavigationControl());
});
</script>
