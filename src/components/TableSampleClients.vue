<script setup>
import { computed, ref, reactive, onMounted } from "vue";
import { getUserAPI, getDTC } from "@/api/obd_alwayshow";
import { fix } from "@/api/apiGraphen";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import tts from "@tomtom-international/web-sdk-services";

defineProps({
  checkable: Boolean,
});
const TOMTOMKEY = "DGEne3GZIqPKvLGIxmB8xszfh0BU8NEx";
const PermissionsID = { ID: "1" }; //最高管理權限

const repairData1 = ref([]);
const posArray1 = reactive([]);
const jsonData = ref({
  Date: "",
  VinID: "",
  Mileage: "",
  Position: {
    lat: "",
    lng: "",
  },
  PendingDTC: "",
  PrimaryDTC: "",
  SecondaryDTC: "",
  PrimaryCause: "",
  PredictedFix: "",
  Emergency: "",
});
const fixData = ref({
  "Primary DTC": "",
  "Secondary DTC": "",
  "Pending DTC": "",
});
const testData = ref({
  "Pending DTC": ["P0353"],
  "Primary DTC": "",
  "Secondary DTC": ["P0353"],
  password: "graphen4york",
  username: "york",
});
fix(testData.value).then((res) => {
  console.log(res);
});

const DTCData = async () => {
  let carList;

  let promiseList = [];

  await getUserAPI(PermissionsID).then((res) => {
    carList = res.data.car_list;
    promiseList = carList.map((c) => getDTC(c.VIN_ID));
  });
  //20230914
  Promise.all(promiseList).then((results) => {
    results.forEach((res) => {
      if (res.data.message != "NOT FOUND") {
        jsonData.value = {
          Date: res.data.Timestamp,
          VinID: res.data.VIN_ID,
          Mileage: res.data.VSS.DTC.Mileage,
          Position: {
            lat: res.data.VSS.DTC.Latitude,
            lng: res.data.VSS.DTC.Longitude,
          },
          PendingDTC: res.data.VSS.DTC.PendingDTC,
          PrimaryDTC: res.data.VSS.DTC.PrimaryDTC,
          SecondaryDTC: res.data.VSS.DTC.SecondaryDTC,
          PrimaryCause: "",
          PredictedFix: "",
          Emergency: "",
          positionLoading: true,
        };
        repairData1.value.push(jsonData.value);
        posArray1.push({
          position: {
            lat: res.data.VSS.DTC.Latitude,
            lng: res.data.VSS.DTC.Longitude,
          },
        });
      }
    });

    tts.services
      .reverseGeocode({
        language: "en-US",
        batchMode: "sync",
        key: TOMTOMKEY,
        batchItems: posArray1,
      })
      .then((res) => {
        res.batchItems.forEach((data, index) => {
          repairData1.value[index].Position =
            res.batchItems[index].addresses[0].address.freeformAddress;
          repairData1.value[index].positionLoading = false;
        });
      });
    console.log(repairData1.value);
    repairData1.value.forEach((fixValue, index) => {
      fixData.value = {
        "Primary DTC": fixValue.PrimaryDTC,
        "Secondary DTC": fixValue.SecondaryDTC,
        "Pending DTC": fixValue.PendingDTC,
        username: "york",
        password: "graphen4york",
      };
      fix(fixData.value).then((res) => {
        console.log(res.data);
        repairData1.value[index].PrimaryCause = res.data.Definitions;
        repairData1.value[index].PredictedFix = res.data.Fix;
        repairData1.value[index].Emergency = res.data.Aggregated_FixPriority;
      });
    });
  });

  // for (const value of carList) {
  //   await getDTC(value.VIN_ID).then((res) => {
  //     if (res.data.message != "NOT FOUND") {
  //       jsonData.value = {
  //         Date: res.data.Timestamp,
  //         VinID: res.data.VIN_ID,
  //         Mileage: res.data.VSS.DTC.Mileage,
  //         Position: {
  //           lat: res.data.VSS.DTC.Latitude,
  //           lng: res.data.VSS.DTC.Longitude,
  //         },
  //         PendingDTC: res.data.VSS.DTC.PendingDTC,
  //         PrimaryDTC: res.data.VSS.DTC.PrimaryDTC,
  //         SecondaryDTC: res.data.VSS.DTC.SecondaryDTC,
  //         PrimaryCause: "",
  //         PredictedFix: "",
  //         Emergency: "",
  //       };
  //       repairData1.value.push(jsonData.value);
  //       posArray1.push({
  //         position: {
  //           lat: res.data.VSS.DTC.Latitude,
  //           lng: res.data.VSS.DTC.Longitude,
  //         },
  //       });
  //     }
  //   });
  // }
  // tts.services
  //   .reverseGeocode({
  //     language: "en-US",
  //     batchMode: "sync",
  //     key: TOMTOMKEY,
  //     batchItems: posArray1,
  //   })
  //   .then((res) => {
  //     res.batchItems.forEach((data, index) => {
  //       repairData1.value[index].Position =
  //         res.batchItems[index].addresses[0].address.freeformAddress;
  //     });
  //   });
  // console.log(repairData1.value);
  // repairData1.value.forEach((fixValue, index) => {
  //   fixData.value = {
  //     "Primary DTC": fixValue.PrimaryDTC,
  //     "Secondary DTC": fixValue.SecondaryDTC,
  //     "Pending DTC": fixValue.PendingDTC,
  //     username: "york",
  //     password: "graphen4york",
  //   };
  //   fix(fixData.value).then((res) => {
  //     console.log(res.data);
  //     repairData1.value[index].PrimaryCause = res.data.Definitions;
  //     repairData1.value[index].PredictedFix = res.data.Fix;
  //     repairData1.value[index].Emergency = res.data.Aggregated_FixPriority;
  //   });
  // });
};

const change = (data) => {
  switch (data) {
    case "3":
      return "bg-red-400";
    case "2":
      return "bg-orange-400";
    case "1":
      return "bg-yellow-400";
    case "0":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

onMounted(() => {
  DTCData();
});

const items = computed(() => repairData1.value);

const perPage = ref(10); //超過5換頁

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
      <tr v-for="(itemsData, index) in itemsPaginated" :key="itemsData.VinID">
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
          {{ itemsData.positionLoading ? "解析中..." : itemsData.Position }}
        </td>

        <td data-label="Primary Cause">
          <li v-for="(value, key) in itemsData.PrimaryCause" :key="key">
            {{ value }}
          </li>
        </td>
        <td data-label="Predicted Fix">
          {{ itemsData.PredictedFix }}
        </td>
        <td data-label="emergency level">
          <div class="justify-center lg:flex lg:flex-1">
            <div
              class="h-10 w-10 rounded-full"
              :class="change(itemsData.Emergency)"
            ></div>
          </div>
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
