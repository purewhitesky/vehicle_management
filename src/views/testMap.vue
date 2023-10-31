<template>
  <LayoutAuthenticated>
    <div></div>
  </LayoutAuthenticated>
</template>
<script setup>
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { onMounted, ref, reactive } from "vue";
import tt from "@tomtom-international/web-sdk-maps";

const TOMTOMKEY = "";
const mapRef = ref(null);
onMounted(() => {
  const map = tt.map({
    key: TOMTOMKEY,
    container: mapRef,
  });
});
</script>
