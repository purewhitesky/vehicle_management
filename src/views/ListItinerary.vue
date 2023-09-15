<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="modalOneActive"
      title="Please enter a itinerary name"
      button-label="Confirm"
      has-cancel
      :buttonTo="`/RouteItinerary/` + setItineraryName"
    >
      <input
        type="text"
        class="w-[50%] rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        v-model="setItineraryName"
      />
    </CardBoxModal>

    <div class="p-2">
      <SectionTitleLineWithButton
        class="mx-6"
        :icon="mdiListBox"
        title="Itinerary Overview"
        main
      >
      </SectionTitleLineWithButton>
      <div
        class="my-2 mx-6 flex min-h-[100px] flex-row-reverse items-center gap-2 px-2 py-4"
      >
        <BaseButton
          color="#333333"
          :icon="mdiPlusBox"
          iconSize="30"
          @click="modalOneActive = true"
          class="hover:border-green-500 hover:text-green-500"
        ></BaseButton>
      </div>
      <div v-for="(item, index) in list" :key="index">
        <CardBox
          hasComponentLayout
          class="grid grid-cols-5 grid-rows-1 gap-2 border-2 border-gray-200 p-4 dark:border-gray-500"
        >
          <div class="col-span-2 grid content-center gap-4">
            <div>create date : {{ item.date }}</div>
            <template v-if="editList[item.itineraryName]">
              <div class="flex items-center">
                plate ID :
                <input
                  type="text"
                  class="flex-1 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  v-model="searchCarID[item.itineraryName]"
                  :placeholder="item.VINID"
                />
              </div>
              <div class="flex items-center">
                itinerary Name :
                <input
                  type="text"
                  class="flex-1 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#333333] dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  v-model="searchItineraryName[item.itineraryName]"
                  :placeholder="item.itineraryName"
                />
              </div>
            </template>
            <template v-if="!editList[item.itineraryName]">
              <div>plate ID : {{ item.VINID }}</div>
              <div>itinerary Name : {{ item.itineraryName }}</div>
            </template>
          </div>
          <div class="col-span-3 col-start-3 flex">
            <div>itinerary :</div>
            <div class="p-4">
              <div v-for="(value, index) in item.itinerary" class="">
                ▼{{ value.name }}
                <div>▼</div>
              </div>
            </div>
          </div>
        </CardBox>
        <div class="mb-2 mr-3 flex flex-row-reverse items-center gap-2">
          <template v-if="!editList[item.itineraryName]">
            <!--刪除-->
            <BaseButton
              color="#333333"
              :icon="mdiTrashCanOutline"
              iconSize="30"
              @click="deleteData(item.itineraryName)"
              class="hover:border-green-500 hover:text-green-500"
            ></BaseButton>
            <!--修改-->
            <BaseButton
              color="#333333"
              :icon="mdiClipboardEditOutline"
              iconSize="30"
              @click="editOpen(item.itineraryName)"
              class="hover:border-green-500 hover:text-green-500"
            ></BaseButton>
          </template>
          <template v-if="editList[item.itineraryName]">
            <!--確認-->
            <BaseButton
              color="#333333"
              :icon="mdiCheck"
              iconSize="30"
              @click="editOpen(item.itineraryName, true)"
              class="hover:border-green-500 hover:text-green-500"
            ></BaseButton>
          </template>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
<script setup>
import CardBox from "@/components/CardBox.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import {
  getItinerary,
  postItinerary,
  putItinerary,
  deleteItinerary,
} from "@/api/obd_alwayshow";
import {
  mdiPlusBox,
  mdiListBox,
  mdiClipboardEditOutline,
  mdiTrashCanOutline,
  mdiCheck,
} from "@mdi/js";
import { ref, onMounted, provide, inject } from "vue";

const modalOneActive = ref(false);
const setItineraryName = ref();

onMounted(() => {
  getData();
});

const list = ref([]);
const editList = ref({});
//GET
const getData = () => {
  getItinerary().then((res) => {
    list.value = res.data;
    list.value.forEach((value, index) => {
      editList.value[value.itineraryName] = false;
    });
    console.log(res);
  });
};

const ItineraryData = ref({});
ItineraryData.value = {
  VINID: "",
  verifyID: "",
  date: "Sun, 23 Jul 2023 12:03:12 GMT",
  itineraryName: "atnerjaehj",
  itinerary: [
    {
      address: "371, 忠孝東路七段, 南港區, 台北市 11561",
      name: "全家南港車站店",
      poi: "全家南港車站店",
      position: { lat: 25.052555, lng: 121.607484 },
    },
    {
      address: "7, 玉成街52巷2弄, 南港區, 台北市 11562",
      name: "全家港運店",
      poi: "全家港運店",
      position: { lat: 25.047752, lng: 121.581429 },
    },
    {
      address: "八里區, 新北市 249",
      name: "台北港",
      poi: "台北港",
      position: { lng: 121.387064, lat: 25.157451 },
    },
  ],
};
ItineraryData.value.itineraryName = "hraerm46sss5";
//POST
const postData = async (data) => {
  await postItinerary(data).then((res) => {
    console.log(res);
  });
  getData();
};

//PUT
const putData = async (itineraryName, data) => {
  await putItinerary(itineraryName, data).then((res) => {
    console.log(res);
  });
  getData();
};
//DELETE
const deleteData = async (itineraryName) => {
  await deleteItinerary(itineraryName).then((res) => {
    console.log(res);
  });
  getData();
};

const searchCarID = ref({});
const searchDate = ref({});
const searchItineraryName = ref({});
const searchItinerary = ref({});

const editData = ref({});
const editNum = ref(0);
const editOpen = (itineraryName, isOk) => {
  editList.value[itineraryName] = !editList.value[itineraryName];

  if (isOk) {
    if (searchCarID.value[itineraryName] != undefined) {
      editData.value["VINID"] = searchCarID.value[itineraryName];
      editNum.value++;
    }
    if (searchDate.value[itineraryName] != undefined) {
      editData.value["date"] = searchDate.value[itineraryName];
      editNum.value++;
    }
    if (searchItineraryName.value[itineraryName] != undefined) {
      editData.value["itineraryName"] =
        searchItineraryName.value[itineraryName];
      editNum.value++;
    }
    if (editNum.value > 0) {
      putData(itineraryName, editData.value);
    }
  }
};

console.log(editList.value);
</script>
