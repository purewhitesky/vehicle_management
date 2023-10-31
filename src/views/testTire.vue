<script setup>
import { ref } from "vue";
import { authentication } from "@/api/apiBridgestone";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";

let Bdata = {
  grant_type: "password",
  client_id: "tire-service-app",
  username: "Peach_Test1@peachsdev31testacc5002",
  password: "Peach@12",
};

authentication(Bdata).then((res) => {
  console.log(res.data);
});
</script>
<template>
  <LayoutAuthenticated>
    <div class="grid grid-cols-2">
      <div class="bg-black">123</div>
      <div class="bg-gray-700">123</div>
    </div>
  </LayoutAuthenticated>
</template>
