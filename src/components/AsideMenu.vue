<script setup>
import AsideMenuLayer from "@/components/AsideMenuLayer.vue";
import OverlayLayer from "@/components/OverlayLayer.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
  isAsideMobileExpanded: Boolean,
  isAsideLgActive: Boolean,
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
  emit("aside-lg-close-click", event);
};
</script>

<template>
  <!-- 20230914 -->
  <AsideMenuLayer
    :menu="menu"
    :class="[
      // isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0',
      // { 'lg:hidden xl:flex': !isAsideLgActive },
      'transition-all',
      isAsideLgActive
        ? 'translate-x-0 opacity-100 delay-300'
        : '-translate-x-full lg:opacity-0 xl:opacity-100',
      isAsideMobileExpanded && '-translate-x-full !opacity-100',
    ]"
    @menu-click="menuClick"
    @aside-lg-close-click="asideLgCloseClick"
  />
  <OverlayLayer
    :class="[
      'transition-all',
      isAsideLgActive ? 'opacity-100' : 'pointer-events-none opacity-0',
    ]"
    z-index="z-30"
    @overlay-click="asideLgCloseClick"
  />
</template>
