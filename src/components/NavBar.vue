<script setup>
import { ref } from "vue";
import { mdiClose, mdiDotsVertical } from "@mdi/js";
import { containerMaxW } from "@/config.js";
import BaseIcon from "@/components/BaseIcon.vue";
import NavBarMenuList from "@/components/NavBarMenuList.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click"]);

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

const isMenuNavBarActive = ref(false);
</script>

<template>
  <nav
    class="fixed inset-x-0 top-0 z-30 h-14 w-screen bg-gray-50 transition-position dark:bg-[#8D9D94] lg:w-auto"
  >
    <div class="flex lg:items-stretch" :class="containerMaxW">
      <div class="flex h-14 flex-1 items-stretch">
        <slot />
      </div>
      <div class="flex h-14 flex-none items-stretch lg:hidden">
        <NavBarItemPlain
          @click.prevent="isMenuNavBarActive = !isMenuNavBarActive"
        >
          <BaseIcon
            :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical"
            size="24"
          />
        </NavBarItemPlain>
      </div>
      <div
        class="absolute top-14 left-0 max-h-screen-menu w-screen overflow-y-auto bg-gray-50 shadow-lg dark:bg-[#8D9D94] lg:static lg:flex lg:w-auto lg:overflow-visible lg:shadow-none"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <NavBarMenuList :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
  </nav>
</template>
