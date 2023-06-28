<template>
  <div class="text-6xl lg:text-3xl">
    {{ milage_Data }}<span class="text-xl"> km</span>
  </div>
</template>
<script setup>
defineProps(["milage_Data"]);
</script>
