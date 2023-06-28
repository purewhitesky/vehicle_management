<template>
  <BaseCarButton
    v-for="(item, i) in list"
    :key="i"
    class="mb-2 flex h-[6vh] w-[100%] flex-1 snap-start rounded-2xl"
    color="lightDark"
    :label="item.VIN_ID"
    @click="
      changeClick({ vinID: item.VIN_ID, status: true });
      buttonKey = i;
    "
    :active="setButtonColor(i)"
    small
  />
</template>

<script setup>
import BaseCarButton from "@/components/BaseCarButton.vue";

import { ref } from "vue";

const props = defineProps(["list"]);

const emit = defineEmits(["change"]);
function changeClick(data) {
  emit("change", data);
}

const buttonKey = ref();

const setButtonColor = (i) => {
  return buttonKey.value === i;
};
</script>
