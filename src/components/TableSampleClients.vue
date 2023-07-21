<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import repairData from "../../public/data-sources/repairData.json";
import tts from "@tomtom-international/web-sdk-services";

defineProps({
  checkable: Boolean,
});
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const mainStore = useMainStore();

const posArray = reactive([]);

repairData.data.forEach((pos, index) => {
  posArray.push({ position: repairData.data[index].Position });
});
tts.services
  .reverseGeocode({
    language: "en-US",
    batchMode: "sync",
    key: TOMTOMKEY,
    batchItems: posArray,
  })
  .then((res) => {
    res.batchItems.forEach((data, index) => {
      console.log(res.batchItems[index].addresses[0].address.freeformAddress);
      repairData.data[index].Position =
        res.batchItems[index].addresses[0].address.freeformAddress;
      console.log(repairData.data);
    });
  });
const items = computed(() => repairData.data);

const isModalActive = ref(false);

const perPage = ref(7); //超過5換頁

const currentPage = ref(0);

const itemsPaginated = computed(() =>
  items.value.slice(
    perPage.value * currentPage.value,
    perPage.value * (currentPage.value + 1)
  )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value)); //換頁

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
  const pagesList = [];

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>VinID</th>
        <th>Mileage</th>
        <th>Position</th>
        <th>Primary Cause</th>
        <th>Predicted Fix</th>
        <th>emergency level</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="itemsData in itemsPaginated" :key="itemsData.VinID">
        <td data-label="Date" class="whitespace-nowrap lg:w-1">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="itemsData.Date"
            >{{ itemsData.Date }}</small
          >
        </td>
        <td data-label="VinID">
          {{ itemsData.VinID }}
        </td>
        <td data-label="Mileage">{{ itemsData.Mileage }} km</td>
        <td data-label="Position">
          {{ itemsData.Position }}
        </td>

        <td data-label="Primary Cause">
          {{ itemsData.PrimaryCause }}
        </td>
        <td data-label="Predicted Fix">
          {{ itemsData.PredictedFix }}
        </td>

        <td data-label="emergency level" class="lg:w-32">
          <progress
            class="flex w-2/5 self-center lg:w-full"
            max="100"
            :value="itemsData.ProcessingProgress"
          >
            {{ itemsData.progress }}
          </progress>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="border-t border-gray-100 p-3 dark:border-slate-800 lg:px-6">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
