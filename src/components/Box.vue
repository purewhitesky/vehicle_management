<template>
  <div class="grid bg-white" :class="componentClass">
    <slot />
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  rounded: {
    type: String,
    default: "rounded-3xl",
  },
  isModal: Boolean,
});
const componentClass = computed(() => {
  const base = [
    props.rounded,
    props.isModal ? "dark:bg-[#333333]" : "dark:bg-[#333333]/70",
    props.isCenter ? "items-center justify-items-center" : "",
  ];
  return base;
});
</script>
