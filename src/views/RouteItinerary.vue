<template>
  <LayoutAuthenticated>
    <div class="relative m-6">
      <div
        class="mt-2 h-[80vh] w-auto lg:h-[80vh] lg:w-[100%]"
        id="map"
        ref="mapRef"
      ></div>
      <CardBox
        hasComponentLayout
        class="h-[8 %] absolute left-10 top-[5%] w-[15%]"
      >
        <input
          type="text"
          id="first_name"
          class="m-2 flex-1 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          required
          v-model="searchText"
        />
      </CardBox>
    </div>
  </LayoutAuthenticated>
</template>
<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import CardBox from "@/components/CardBox.vue";
import tt from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "@tomtom-international/web-sdk-plugin-searchbox/dist/SearchBox.css";
import TomTomStyle from "@/style/tomtomstyle.json";
import { ref, reactive, onMounted, computed, watch } from "vue";

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

const searchText = ref("write");

const addressData = (data) => {
  tts.services
    .fuzzySearch({
      key: TOMTOMKEY,
      query: data,
    })
    .then((res) => {
      console.log(res.results);
    });
};
/*const test = computed(
  searchText.value,
  searchText.value.length >= 2 ? addressData(searchText.value) : ""
);*/

watch(searchText, () => {
  console.log(searchText.value.length);

  searchText.value.length >= 2 ? addressData("pizza") : "";
});
</script>
