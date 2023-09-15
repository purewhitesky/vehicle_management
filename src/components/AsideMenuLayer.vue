<script setup>
import { mdiLogout, mdiClose } from "@mdi/js";
import { computed } from "vue";
import { useStyleStore } from "@/stores/style.js";
import AsideMenuList from "@/components/AsideMenuList.vue";
import AsideMenuItem from "@/components/AsideMenuItem.vue";
import BaseIcon from "@/components/BaseIcon.vue";

defineProps({
  menu: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const styleStore = useStyleStore();

const logoutItem = computed(() => ({
  label: "Logout",
  icon: mdiLogout,
  color: "info",
  isLogout: true,
}));

const menuClick = (event, item) => {
  emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
  emit("aside-lg-close-click", event);
};
</script>

<template>
  <aside
    id="aside"
    class="fixed top-0 z-40 flex h-screen w-60 overflow-hidden transition-position lg:py-2 lg:pl-2"
  >
    <div
      :class="styleStore.asideStyle"
      class="flex flex-1 flex-col overflow-hidden dark:bg-[#333333] lg:rounded-2xl"
    >
      <div
        :class="styleStore.asideBrandStyle"
        class="flex h-20 flex-row items-center justify-between dark:bg-[#333333]"
      >
        <div
          class="mt-3 flex flex-1 flex-col text-center lg:pl-6 lg:text-left xl:pl-0 xl:text-center"
        >
          <!--MIH LOGO SETTING-->
          <img
            src="https://www.mih-ev.org/img/MIH-consortium-logo_20210728.svg"
            width="120"
            class="self-center"
          />
        </div>
        <button
          class="hidden p-3 lg:inline-block xl:hidden"
          @click.prevent="asideLgCloseClick"
        >
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div
        :class="
          styleStore.darkMode
            ? 'aside-scrollbars-[slate]'
            : styleStore.asideScrollbarsStyle
        "
        class="flex-1 overflow-y-auto overflow-x-hidden"
      >
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>
