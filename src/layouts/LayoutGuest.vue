<script setup>
import { useStyleStore } from "@/stores/style.js";

const styleStore = useStyleStore();
</script>

<template>
  <div :class="{ dark: styleStore.darkMode }">
    <div class="bg-gray-50 dark:bg-[#8D9D94] dark:text-slate-100">
      <slot />
    </div>
  </div>
</template>
